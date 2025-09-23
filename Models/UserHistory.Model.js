const mongoose = require("mongoose")
const HistoryScheme = mongoose.Schema({
    Email:
    {
        type:String
    },
    Movie:
    {
        type :String
    },
    Img:
    {
        type:String
    },
    BuyAt:
    {
        type:String
    },
    Cost:
    {
        type:String
    },
    Seats:
    {
        type:String
    }
},{timestamps :true})

const History = mongoose.model("History",HistoryScheme)
module.exports = History