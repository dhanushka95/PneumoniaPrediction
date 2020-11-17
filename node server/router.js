const express = require('express');
const axios = require('axios');
const router = express.Router();
const multer  = require('multer');
const FormData = require('form-data');
const fs = require('fs');
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname+'.'+'jpeg')
    }
});

let upload = multer({ storage: storage })

router.post(
    '/predict', upload.single('image'), (req, res, next) => {
        const file = req.file;
        if (!file) {
            const error = new Error('Please uploads a file');
            error.httpStatusCode = 400;
            return next(error)
        }
        try{
            const Path = require('path');
            let form = new FormData();
            form.append('image', fs.createReadStream(Path.join('./uploads/'+file.filename)), {
                filename: file.filename
            });
            req.headers.PredictData = [];
            axios.create({
                headers: form.getHeaders()
            }).post('http://127.0.0.1:5000/predict', form).then(response => {
                res.status(200).json({
                    data: response.data===1?true:false,
                    message: 'Prediction: '+(response.data===1?'Pneumonia':'Normal')
                });
            }).catch(error => {
                console.log(error.message);
            });
        }catch (e) {
            console.log(e);
        }

    }
);


module.exports = router;
