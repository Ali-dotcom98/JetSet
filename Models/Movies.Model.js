const mongoose = require("mongoose");
const movieSchema = new mongoose.Schema({
    title: { type: String, required: true, unique : true },
    TicketPrice:
    {
        type : String,
    },
    genre: { 
    type: String, 
    required: true, 
    enum: ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Science Fiction', 'Fantasy', 'Thriller']
    },
    posterImage: { type: String },
    Duration: { type: Number, required: true },
    totalSeats: { type: Number, required: true },
    Cast :
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Cast"
    },
    showtimes: [{
    NumberSeat:[
        {
            type : String
        }
    ],
    

    }],
    
}, { timestamps: true });

const Movie = mongoose.model('Movie', movieSchema)
module.exports = Movie;
