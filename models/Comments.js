var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  body: String,
  author: String,
  votes: {type: Number, default: 0},
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
});

//add an upvote() method to the Comment schema
CommentSchema.methods.upvote = function (cb) {
    this.votes += 1;
    this.save(cb);
};

CommentSchema.methods.downvote = function (cb) {
    this.votes -= 1;
    this.save(cb);
};

mongoose.model('Comment', CommentSchema);