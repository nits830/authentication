const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public')); 
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const userSchema = {
    email:String,
    password:String
}

const User = new mongoose.model("User", userSchema);



app.get("/", (req,res)=>{
    res.render('home');
})

app.get("/login", (req,res)=>{
    res.render('login');
})

app.get("/register", (req,res)=>{
    res.render('register');
})


app.post("/register", (req,res)=>{
    const newUser = new User({
        email:req.body.username,
        password:req.body.password

    });
    newUser.save();
    res.render("home");
})

app.post("/login", async (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const foundUser = await User.findOne({email: username});
    if(foundUser){
        if(foundUser.password === password){
            res.render("secrets");
        }
        else{
            res.send("Wrong Password");
        }
    }
    else{
        res.send("ERROR: USER NOT FOUND");
    }
})







app.listen(3000, console.log("Server started"));