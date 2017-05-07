var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/zzz')
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('connect to database: zzz')
})

var MSchema = new mongoose.Schema({
    doctor: String,
});

var Mm = mongoose.model('Mm', MSchema);

// new Mm({
//     doctor: 'xjw'
// }).save();

Mm.find({}, (err, mm) => {
    console.log(mm);
})