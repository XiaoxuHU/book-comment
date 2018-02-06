var express = require("express");
var router = express.Router({mergeParams:true});
var Book = require("../models/books"),
    Comment = require("../models/comment"),
    middleware = require("../middleware/index");
//=====Comments Route===========

//NEW ROUTE
router.get("/new",middleware.isLoggedIn,function(req, res) {
    Book.findById(req.params.id,function(err,book){
       if(err){
           console.log(err);
       }else{
            res.render("comments/new",{book:book});       
       }
    });
});

//Post Comment Route
router.post("/",middleware.isLoggedIn,function(req,res){
    Book.findById(req.params.id,function(err, foundBook) {
       if(err){
           console.log(err);
           res.redirect("/books");
       } else{
           Comment.create(req.body.comment,function(err,comment){
              if(err){
                  req.flash("error","Something went wrong with database");
                  console.log(err);
              } else{
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  comment.save();
                  foundBook.comments.push(comment);
                  foundBook.save();
                  req.flash("success","Successfully create comment");
                  res.redirect("/books/"+foundBook._id);
              }
           });
       }
    });
});


//Comment Edit Router
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
       if(err){
           res.redirect("back");
       } else{
           res.render("comments/edit",{book_id:req.params.id, comment:foundComment});
       }
    });
});


//Comment Update
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
   Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,newComment){
       if(err){
           res.redirect("/back");
       } else{
           res.redirect("/books/" + req.params.id);  //back to show page
       }
   }); 
});

//Comment Delete
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
   Comment.findByIdAndRemove(req.params.comment_id,function(err){
      if(err){
          res.redirect("back");
      } else{
          req.flash("success","Delete Comment Successfully");
          res.redirect("/books/"+req.params.id);
      }
   });
});





module.exports = router;

