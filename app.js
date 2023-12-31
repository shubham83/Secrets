//jshint esversion:6
require('dotenv').config();
const express=require("express");
const bodyparser=require("body-parser");
const ejs=require("ejs");
const { log } = require("console");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app=express();
console.log(process.env.API_KEY)
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));

mongoose.connect('mongodb+srv://Admin:shubh123@cluster0.ga5afas.mongodb.net/userDB',{useNewUrlParser:true});

const userSchema=new mongoose.Schema({
    email:String,
    password:String 
});


userSchema.plugin(encrypt, { secret:process.env.SECRET, encryptedFields: ['password'] });

const User=new mongoose.model("User",userSchema);
app.get("/",function(req,res){
res.render("home");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
const newUser= new User({
    email:req.body.username,
     password:req.body.password
});
newUser.save();
res.render("Secrets");
});
app.get("/login",function(req,res){
    res.render("login");
});
app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;

    User.findOne({email:username}).then(function(foundUser){
    
            if(foundUser)
            {
                if(foundUser.password===password)
                {
                    res.render("Secrets");
                }
            }
        
    })
});
app.listen(3000,function(){
    console.log("Server Started on Port 3000")
});
