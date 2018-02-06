var express = require("express");
var router = express.Router();
var Book = require("../models/books"),
    middleware = require("../middleware");

//Books Routes
router.get("/",function(req,res){
    Book.find({},function(err,allbooks){
       if(err){
           console.log(err);
       }else{
            res.render("books/index",{books:allbooks});  
       }
    });
});

router.post("/",middleware.isLoggedIn,function(req,res){
    var newBook = req.body.book;
    newBook.author = {
        id:req.user._id,
        username:req.user.username
    };
    Book.create(newBook,function(err,newCreate){
        if(err){
            console(err);
        }else{
            res.redirect("/books");// a get method     
        }
    });
});


//Create new books
router.get("/new",middleware.isLoggedIn,function(req, res) {
    res.render("books/new"); 
});

//Show more info about one book
router.get("/:id",function(req,res){       //Can be /books/new,so /books/new first
    Book.findById(req.params.id).populate({path:"comments",model:"Comment"}).exec(function(err,foundBook){
        if(err){
            console.log(err);
        }else{
            res.render("books/show",{book:foundBook});     
        }
    });
});

//EDIT BOOK ROUTE
router.get("/:id/edit",middleware.checkBookOwnership,function(req, res) {
    Book.findById(req.params.id,function(err,foundBook){
        if(err){
            req.flash("error","Can't find book");
            res.redirect("/books");
        }else{
            res.render("books/edit",{book:foundBook});    
        }
    });
});

//UPDATE BOOK ROUTE
router.put("/:id",middleware.checkBookOwnership,function(req,res){
    Book.findByIdAndUpdate(req.params.id,req.body.book,function(err,Data){
       if(err){
           res.redirect("/books");
       }else {
           if(req.xhr){
               Book.findById(req.params.id,function(err,newData){
                    var sendData = {};
                    for(var name in req.body.book){
                        sendData["value"] = newData[name]; //{value:number}
                    }
                    res.json(sendData);
               });

           } else{
              res.redirect("/books/"+req.params.id);
           }
       }
   }); 
});

//DELETE BOOK ROUTE
router.delete("/:id",middleware.checkBookOwnership,function(req,res){
   Book.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.redirect("/books");
       } else{
           req.flash("success","Delete Book Successfully")
           res.redirect("/books");
       }
   });
});


module.exports = router;