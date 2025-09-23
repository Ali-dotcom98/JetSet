const mongoose = require('mongoose');

const castSchema = new mongoose.Schema({
  Title: 
  { 
    type: String, 
    required: true,
    unique : true

  },
  Description: 
  { 
    type: String, 
    required: true 
  },
  Act:
  [
    {
      type: String 
    }
  ]
});

const Cast = mongoose.model('Cast', castSchema);
module.exports = Cast;
