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
    '/predict', upload.single('image'), async(req, res, next) => {
        const file = req.file;
        if (!file) {
            const error = new Error('Please uploads a file');
            error.httpStatusCode = 400;
            return next(error)
        }
        try{
            const Path = require('path');
            const form = new FormData();
            form.append('image', fs.createReadStream(Path.join('./uploads/'+file.filename)), {
                filename: file.filename
            });
            req.headers.PredictData = [];
            // get prediction from api 1
            const API = await axios.create({
                headers: form.getHeaders()
            }).post('http://127.0.0.1:5003/predict', form);
            const API_VALUE = API.data;
            res.status(200).json({
                data: API_VALUE,
                message: 'Prediction'
            });
        }catch (e) {
            console.log(e);
        }

    }
);
router.get('/buildCSV',require('./controller').createCSV);

module.exports = router;
