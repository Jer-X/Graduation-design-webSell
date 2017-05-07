/**
 * 引入各種庫
 */
var express = require('express') //express服務器
var path = require('path') //路徑
var fs = require('fs') //文件讀取
var mongoose = require('mongoose') //數據庫鏈接
var model = require('./schemas/allModel') //數據庫模型
var _ = require('lodash') //lodash庫
const bodyParser = require('body-parser') //獲取post的body
const images = require('images') //引入圖片處理庫
const multer = require('multer') //引入文件上傳中間件
const crypto = require('crypto') //引入加密模块
const keyMap = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'] //加密key的随机map
const session = require('express-session') //引入session模块
const MongoStore = require('connect-mongo')(session) //引入mongo的session存储

/**
 * 定義各種變量
 */
const uploadPath = path.resolve(__dirname, './uploads') //定義上傳路徑
const maxSize = 750 //定義大圖片大小
const minSize = 114 //定義小圖片大小
const minQual = 90 //定義最小質量
    //定義multer的diskStorage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadPath)
    },
    filename: function(req, file, cb) {
        let suffix = /\.(\w)+$/.exec(file.originalname)[0]
        cb(null, `${file.fieldname}-${Date.now()}${suffix}`)
    }
})
const code = {
        success: 0,
        fail: 1
    } //定義返回碼
const upload = multer({ storage: storage }) //定义存储位置
var app = express() //開啟express服務器

/**
 * 讀取post發送來的信息
 */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/**
 * 使用session
 */
app.use(session({
    secret: 'sell App session',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    store: new MongoStore({ url: 'mongodb://localhost:27017/zzz' })
}))

/**
 * 鏈接mongo數據庫
 */
mongoose.connect('mongodb://localhost:27017/zzz')
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('connect to database: zzz')
})

let jsonObj = JSON.parse(fs.readFileSync('./ratings.json'))
jsonObj.forEach(function(element) {
    new model.ratings(element).save()
}, this);
// console.log(jsonObj)
// new seller(jsonObj).save()
// new model.goods(jsonObj[8]).save()

//獲取信息路由
app.get('/data/seller', function(req, res) {
    model.seller.find({}, function(err, seller) {
        if (err) {
            return console.log(err)
        }

        res.json({
            'errno': code.success,
            'data': seller
        })
    })
})

app.get('/data/goods', function(req, res) {
    model.goods.find({}, function(err, goods) {
        if (err) {
            return console.log(err)
        }

        res.json({
            'errno': code.success,
            'data': goods
        })
    })
})

app.get('/data/goods/column', function(req, res) {
    model.goods.find({}, function(err, goods) {
        let tmp = []

        if (err) {
            return console.log(err)
        }

        goods.forEach((good) => {
            tmp.push(good.name);
        })

        res.json({
            'errno': code.success,
            'data': tmp
        })
    })
})

app.get('/data/ratings', function(req, res) {
    model.ratings.find({}, function(err, ratings) {
        if (err) {
            return console.log(err)
        }
        //返回的数据为json格式
        res.json({
            'errno': code.success,
            'data': ratings
        })
    })
})

app.get('/data/order', function(req, res) {
    model.orders.find({}, function(err, orders) {
        if (err) {
            return console.log(err)
        }

        res.json({
            'errno': code.success,
            'data': orders
        })
    })
})

app.get('/data/images', (req, res) => {
    const fileName = req.query.file
    let filePath = path.resolve(__dirname, './uploads', fileName)
    fs.access(filePath, (err) => {
        if (err) {
            filePath = path.resolve(__dirname, './uploads/timg.jpg')
        }
        res.sendFile(filePath)
    })
})

//获取登录状态路由
app.get('/data/user/loginState', readSession)

//退出路由
app.post('/data/user/loginOut', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.json({
                'errno': 1
            })
        } else {
            res.json({
                'errno': 0
            })
        }
    })
})

//登录路由
app.post('/data/user/login', (req, res) => {
    let tmp = req.body
    model.users.find({ 'user_name': tmp.user_name }, (err, user) => {
        if (err) {
            return console.log(err)
        }
        let tmp_user = user[0]
        let validate = encrypt(tmp.pwd, tmp_user.key)
        if (validate === tmp_user.pwd) {
            req.session.sid = `${tmp_user.user_name},${tmp_user._id}`
            console.log(req.session)
            res.json({
                'errno': 0,
                'data': {
                    'user_name': user.user_name,
                    'user_id': user._id
                }
            })
        } else {
            res.json({
                'errno': 1
            })
        }
    })
})

//注册路由
app.post('/data/user/register', (req, res) => {
    let tmp = req.body
    let key = ''
    for (let i = 0; i < 3; i++) {
        key += keyMap[Math.floor(Math.random() * 10)]
    }
    tmp.pwd = encrypt(tmp.pwd, key)
    tmp = _.assign(tmp, { 'key': key })
    new model.user(tmp).save()
    res.json({
        'errno': 0
    })
})

//添加信息路由
app.post('/data/order', function(req, res) {
    let item = req.body;
    new model.order(item).save()
    res.json({
        'errno': code.success
    })
})

app.post('/data/add/column', function(req, res) {
    let item = req.body;
    new model.goods(item).save()
    res.json({
        'errno': code.success
    })
})

app.post('/data/add/food', function(req, res) {
    let tmp_req = req.body
    let columnName = tmp_req.column
        // console.log(tmp_req.column)
    let tmp
    model.goods.find({ name: tmp_req.column }, function(err, good) {
        if (err) {
            return console.log(err)
        }
        tmp = good
        delete tmp_req.column
            // console.log(tmp_req)
        tmp_req = _.assign(tmp_req, { sellCount: Math.floor(Math.random() * 10 + 1), rating: Math.floor(Math.random() * 10 + 90), ratings: [] })
            // console.log(tmp_req)
        tmp[0].foods.push(tmp_req)
            // console.log(tmp[0])
        model.goods.update({ name: columnName }, tmp[0], (err, good) => {
            if (err) {
                res.json({
                    'errno': code.fail
                })
                return console.log(err)
            }

            res.json({
                'errno': code.success
            })
        })
    })
})

//图片上传路由
//店家图片
app.post('/data/file/seller', upload.single('seller'), (req, res) => {
    const fileName = req.file.filename
    const diff = /^(\w+)/.exec(req.file.originalname)[0]
    const filePath = req.file.path
    const suffix = /\.(\w)+$/.exec(fileName)[0]
    const minFileName = `${req.file.fieldname}-${diff}-min${suffix}`
        // console.log(fileName, filePath, suffix, minFileName)
    images(filePath).size(180).save(path.resolve(uploadPath, minFileName), { quality: minQual })
    res.json({
        'errno': code.success,
        'data': `/data/images?file=${minFileName}`
    })
})

//商品图片
app.post('/data/file/good', upload.single('good'), (req, res) => {
    const fileName = req.file.filename
    const diff = /(\w+)\./.exec(fileName)[0].split('.')[0]
    const filePath = req.file.path
    const suffix = /\.(\w)+$/.exec(fileName)[0]
    const minFileName = `${req.file.fieldname}-${diff}-min${suffix}`
        // console.log(fileName, filePath, suffix, minFileName)
    images(filePath).size(minSize, minSize).save(path.resolve(uploadPath, minFileName), { quality: minQual })
    res.json({
        'errno': code.success,
        'data': `/data/images?file=${fileName}`,
        'minData': `/data/images?file=${minFileName}`
    })
})

//修改信息路由
app.patch('/data/modify/order', (req, res) => {
    let tmp = req.body
    model.orders.find({ _id: tmp.id }, (err, order) => {
        if (err) {
            return console.log(err)
        }

        order[0].progress = tmp.progress
        model.orders.update({ _id: tmp.id }, order[0], (err) => {
            if (err) {
                res.json({
                    'errno': code.fail
                })
                return console.log(err)
            }

            res.json({
                'errno': code.success
            })
        })
    })
})

app.patch('/data/modify/food', (req, res) => {
    let tmp_req = req.body
    let columnName = tmp_req.column
    let oldName = tmp_req.oldName
        // console.log(tmp_req.column)
    let tmp, index
    model.goods.find({ name: columnName }, (err, good) => {
        if (err) {
            return console.log(err)
        }
        tmp = good
        delete tmp_req.column
        delete tmp_req.oldName
        if (tmp_req.icon === '') delete tmp_req.icon
        if (tmp_req.image === '') delete tmp_req.image
        index = _.findIndex(tmp[0].foods, (chr) => {
                return chr.name === oldName
            })
            // console.log(index)
        tmp[0].foods[index] = _.assign(tmp[0].foods[index], tmp_req)
            // console.log(tmp[0])
        model.goods.update({ name: columnName }, tmp[0], (err) => {
            if (err) {
                res.json({
                    'errno': code.fail
                })
                return console.log(err)
            }

            res.json({
                'errno': code.success
            })
        })
    })
})

app.patch('/data/modify/column', (req, res) => {
    let tmp_req = req.body
    let oldName = tmp_req.oldName
    delete tmp_req.oldName
    let tmp
    model.goods.find({ name: oldName }, (err, good) => {
        tmp = good
        tmp[0] = _.assign(tmp[0], tmp_req)
        model.goods.update({ name: oldName }, tmp[0], (err) => {
            if (err) {
                res.json({
                    'errno': code.fail
                })
                return console.log(err)
            }

            res.json({
                'errno': code.success
            })
        })
    })
})

app.patch('/data/modify/seller', (req, res) => {
    let tmp_req = req.body
    let tmp
    model.seller.find({ name: tmp_req.name }, (err, good) => {
        tmp = good[0]
        if (tmp_req.pics) {
            tmp_req.pics.forEach((item) => {
                tmp.pics.push(item)
            })
            delete tmp_req.pics
        }
        tmp = _.assign(tmp, tmp_req)
        model.seller.update({ name: tmp_req.name }, tmp, (err) => {
            if (err) {
                res.json({
                    'errno': code.fail
                })
                return console.log(err)
            }

            res.json({
                'errno': code.success
            })
        })
    })
})

//刪除信息路由
app.delete('/data/delete/food', (req, res) => {
    let tmp_req = req.query
    let columnName = tmp_req.column
    let name = tmp_req.name
        // console.log(tmp_req)
    let tmp, index
    model.goods.find({ name: columnName }, (err, good) => {
        if (err) {
            return console.log(err)
        }
        tmp = good
        const removeItem = _.remove(tmp[0].foods, (item) => {
                return item.name === name
            })
            // console.log(removeItem)
        deleteLocalFile(removeItem[0].icon, removeItem[0].image)
        model.goods.update({ name: columnName }, tmp[0], (err, good) => {
            if (err) {
                res.json({
                    'errno': code.fail
                })
                return console.log(err)
            }

            res.json({
                'errno': code.success
            })
        })
    })
})

app.delete('/data/delete/column', (req, res) => {
    let tmp_req = req.query
    let columnName = tmp_req.column
    model.goods.find({ name: columnName }, (err, good) => {
        let tmp = good[0]
        tmp.foods.forEach((item) => {
            deleteLocalFile(item.icon, item.image)
        })
    })
    model.goods.deleteOne({ name: columnName }, (err) => {
        if (err) {
            res.json({
                'errno': code.fail
            })
            return console.log(err)
        }

        res.json({
            'errno': code.success
        })
    })
})

//读取session函数
function readSession(req, res, next) {
    if (req.session.sid) {
        const sid = req.session.sid;
        const user = {
            'user_name': sid.split(',')[0],
            'user_id': sid.split(',')[1]
        }
        res.json({
            'errno': code.success,
            'data': {
                'user_name': user.user_name,
                'user_id': user.user_id
            }
        })
    } else {
        res.json({
            'errno': 1
        })
    }
}

//加密算法
function encrypt(origin, key) {
    let hmac = crypto.createHmac('sha256', key).update(origin).digest('hex')
    return hmac
}

//删除图片函数
function deleteLocalFile(im_query, imM_query) {
    const im_name = decodeURIComponent(im_query).split('?')[1].split('=')[1]
    const imM_name = decodeURIComponent(imM_query).split('?')[1].split('=')[1]
    const im_path = path.resolve(__dirname, './uploads/', im_name)
    const imM_path = path.resolve(__dirname, './uploads/', imM_name)
    fs.unlinkSync(im_path)
    fs.unlinkSync(imM_path)
}

//開啟服務器，并設定監聽端口
var server = app.listen(3000, function() {
    console.log('server is on')
})