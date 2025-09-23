const mongoose = require("mongoose")
const LogiSchema = mongoose.Schema({

    Email :
    {
        type : String,
        unique : true
    },
    Password :
    {
        type: String
    }

    }
    ,{timestamps : true})

const Login = mongoose.model('Login',LogiSchema)
module.exports = Login