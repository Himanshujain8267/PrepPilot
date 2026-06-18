import multer from "multer";

const storage = multer.diskStorage({
    destination: function(req, file , cb){
        cb(null , "public")
    }, // cb -->callback , destination jaha mujha apni file store karni hai
    filename: function(req , file , cb){
        const filename = Date.now() + "-" + file.originalname;
        cb(null , filename)
        // yeh simply jo hmara file name rehna vala hai
    }
})


//yeh humara middleware hai iska through 
// hum file ko public folder ka andarr upload kar 
// sakte hai 
export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});






// ek jo file milagi voh public folder meih upload hoo jaegi
// jo resume ka data milega voh public folder meih store hogi
// jo ai hoga voh public folder seih file ko uthhaega 
// or uspe kaam karega