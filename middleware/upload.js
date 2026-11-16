const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req,file,cb){
       const uploads= path.join(__dirname,'../uploads');
       cb(null,uploads);
    },
    filename : function(req,file,cb){
      const name = crypto.randomUUID();
      const ext = path.extname(file.originalname);
      cb(null,`${name}${ext}`);
    }
});

function fileFilter(req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if(allowedTypes.includes(file.mimetype)){
        cb(null,true);
    }
    else{cb(new Error('Invalid file type'),false);}
}

const limits= {
    fileSize: 5 * 1024 * 1024
}

const upload = multer({ storage,fileFilter,limits });
module.exports = upload;
