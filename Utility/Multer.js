const multer = require("multer")

const Storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./public/uploads/Movies"); 
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: Storage });
module.exports = upload