//All Middleware
var Book = require("../models/books"),
    Comment = require("../models/comment");


var middlewareObj = {};

middlewareObj.checkBookOwnership = function (req,res,next){
    if(req.xhr){
        return next();
    } else{
            if(req.isAuthenticated()){
                Book.findById(req.params.id,function(err,foundBook){
                if(err){
                    req.flash("error","Book not found");
                    res.redirect("back");
                } else{
                    if(foundBook.author.id.equals(req.user._id)){
                        next();    
                    }else{
                        req.flash("error","you don't have permission");
                        res.redirect("back");
                    }
                }
            });
        }else{
            req.flash("error","You need log in first");
            res.redirect("back");
        }
    }
};

middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                req.flash("error","comment not found");
                res.redirect("back");
            } else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash("error","you don't have permission");
                    res.redirect("back");
                }
            }
        });
    } else{
     req.flash("error","You need log in first");   
     res.redirect("back");   
    }
};
    
middlewareObj.isLoggedIn= function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please log in first");
    res.redirect("/login");
};



module.exports = middlewareObj;