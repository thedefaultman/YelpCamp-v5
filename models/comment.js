let mongoose = require("mongoose")

let CommentSchema = mongoose.Schema({
    text: String,
    author: String
})

module.exports = mongoose.model("Comment", CommentSchema)