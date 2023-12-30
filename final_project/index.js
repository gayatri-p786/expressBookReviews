const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

let users = require("./router/auth_users.js").users;

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}



app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
if(req.session.authorization) { //get the authorization object stored in the session
    // if(req.session.authorization) {
        token = req.session.authorization['accessToken'];
        jwt.verify(token, "access",(err,user)=>{
            if(!err){
                req.user = user;
                next();
            }
            else{
                return res.status(403).json({message: "User not authenticated"})
            }
         });
     } else {
         return res.status(403).json({message: "User not logged in"})
     }
 });
 
 
 app.post("/register", (req,res) => {
   const username = req.body.username;
   const password = req.body.password;
 
   if (username && password) {
     if (!doesExist(username)) { 
        let len=users.length;
       users.push({"username":username,"password":password});
       let new_len=users.length;
       if (new_len==len+1){
        return res.status(200).json({message: "User successfully registered. Now you can login"});
       }
        } else {
       return res.status(404).json({message: "User already exists!"});    
     }
   } 
   return res.status(404).json({message: "Unable to register user."});
 });
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
module.exports.users = users;
