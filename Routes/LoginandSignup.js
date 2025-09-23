const express = require("express")

const route = express.Router()
const bcrypt = require("bcrypt")
const {ValidToken , GenerateToken}= require("../Utility/Ticket.Token.js")

const Login = require("../Models/Login.Model.js")
const History = require("../Models/UserHistory.Model.js")
const {check, validationResult} =require("express-validator")

route.get("/Login",(req,res)=>{
    try {
        res.render("Login", {layout:"./layout/Default"})
    } catch (error) {
        console.log("Error",error)
    }
})
route.post("/Login", async(req,res)=>{
    try {
        const{Email, Password} =req.body
        
        const IsExist = await Login.findOne({Email : Email})
        if(IsExist)
        {
            const ISPasswordExist = await bcrypt.compare(Password, IsExist.Password)
            if(!ISPasswordExist)
            {
                console.log("Is Correct Pssword")
            }
            else
            {
                const Payload ={
                    Email : Email
                }
                const Token = GenerateToken(Payload)
                console.log(Token)
                const IsValid = ValidToken(Token)
                if(IsValid)
                {
                    res.cookie("uid",Token)
                    res.redirect("/Home")
                }

            }
        }
    } catch (error) {
        console.log(error)
    }
})

route.get("/Singup",(req,res)=>{
    try {
        res.render("Signup", {layout:"./layout/Default",message:"", Email: "" , Password : "" , validation:[]})

    } catch (error) {
        console.log("Error",error)
    }
})
route.post("/Singup",
    check("Email","Email Required")
    .custom((value,{req})=>{
        var Regex =/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ ;
        if(!Regex.test(value))
        {
            throw new Error (`${value} Should folloew Pattren example@example.com`)
        }
        return true;
    })
    ,
    check("Password","Password Should be Lenght of 5").isLength({min : 5}).isAlphanumeric(),
    
    async(req,res)=>{
    try {
        const {Email, Password}= req.body
        const error = validationResult(req)
        const validation = error.array()
        console.log("Validation ", validation)

        if(!error.isEmpty())
        {
            const message = error.array()[0].msg
            res.render("Signup", {layout:"./layout/Default",message: message , Email: Email , Password : Password , validation : error.array()})
        }
        else
        {
            const Salt = await bcrypt.genSalt(10)
            const NewPassword = await bcrypt.hash(Password,Salt)
            console.log(NewPassword)

            const AddData = new Login({
                Email : Email,
                Password : NewPassword
            })
            const SaveData = await AddData.save();
            if(SaveData)
            {
    
                console.log("Data Added")
                res.redirect("/Site/Login")
            }
            else
            {
                console.log("Data is Not Added")
            }

        }

        
    } catch (error) {
        console.log("Error",error)
    }
})

route.get("/Logout", (req, res)=>{
    try {
        res.cookie("uid",null)
        res.redirect("/Home")
    } catch (error) {
        console.log(error)
    }
})
route.get("/History",async(req,res)=>{
    try {
        const Token = req.cookies.uid
        const Data = ValidToken(Token)
        const UserHistory = await History.find({Email : Data.Email})
        if(UserHistory)
        {
            
            return res.json(UserHistory);
        }
        else
        {
            console.log("Not data")
        }
        
    } catch (error) {
        console.log(error)
    }
})


module.exports = route