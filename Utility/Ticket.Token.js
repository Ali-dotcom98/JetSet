const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

const Secret = process.env.SecretKey;

if (!Secret) {
    throw new Error("SecretKey is not defined in the environment variables.");
}

const GenerateToken = (Payload) => {
    return jwt.sign(Payload, Secret, { expiresIn: "1h" });
};

const ValidToken = (Token) => {
    try {
        return jwt.verify(Token, Secret);
    } catch (error) {
        console.error("Invalid Token", error);
        return null;
    }
};


const TicketToken = (req, res ,next)=>{
    try {
        const Token = req.cookie.uid;
        
    } catch (error) {
        console.log("Error",error);
        
    }
}

module.exports = {ValidToken, GenerateToken , TicketToken}