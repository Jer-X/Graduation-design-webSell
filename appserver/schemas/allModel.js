const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    "name": String,
    "address": String,
    "description": String,
    "deliveryTime": Number,
    "score": Number,
    "serviceScore": Number,
    "foodScore": Number,
    "rankRate": Number,
    "minPrice": Number,
    "deliveryPrice": Number,
    "ratingCount": Number,
    "sellCount": Number,
    "bulletin": String,
    "supports": Array,
    "avatar": String,
    "pics": Array,
    "infos": Array
})

const goodsSchema = new mongoose.Schema({
    "name": String,
    "type": Number,
    "foods": Array
})

const ratingSchema = new mongoose.Schema({
    "username": String,
    "rateTime": String,
    "deliveryTime": Number,
    "score": Number,
    "rateType": Number,
    "text": String,
    "avatar": String,
    "recommend": Array
})

const orderSchema = new mongoose.Schema({
    "desk": Number,
    "foods": Array,
    "progress": String,
    "pay": String
})

const userSchema = new mongoose.Schema({
    'user_name': String,
    'pwd': String,
    'key': String
})

const seller = mongoose.model('seller', sellerSchema)
const goods = mongoose.model('good', goodsSchema)
const ratings = mongoose.model('rating', ratingSchema)
const orders = mongoose.model('order', orderSchema)
const users = mongoose.model('user', userSchema)

module.exports = { seller, goods, ratings, orders, users }