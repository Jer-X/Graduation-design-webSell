var mongoose = require('mongoose');
var MovieSchema = require('../schemas/test');
var Movie = mongoose.model('aaa', MovieSchema);

module.exports = Movie;