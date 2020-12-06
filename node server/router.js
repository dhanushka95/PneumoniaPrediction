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
            const form_1 = new FormData();
            const form_2 = new FormData();
            form_1.append('image', fs.createReadStream(Path.join('./uploads/'+file.filename)), {
                filename: file.filename
            });
            form_2.append('image', fs.createReadStream(Path.join('./uploads/'+file.filename)), {
                filename: file.filename
            });
            req.headers.PredictData = [];
            // get prediction from api 1
            const API_01 = await axios.create({
                headers: form_1.getHeaders()
            }).post('http://127.0.0.1:5001/predict', form_1);
            const API_01_VALUE = API_01.data;
            const API_02 = await axios.create({
                headers: form_2.getHeaders()
            }).post('http://127.0.0.1:5002/predict', form_2);
            const API_02_VALUE = API_02.data;
            let positiveAccuracy = ((API_01_VALUE+API_02_VALUE)/2)*100;
            res.status(200).json({
                data: positiveAccuracy,
                message: 'Prediction'
            });
        }catch (e) {
            console.log(e);
        }

    }
);
router.get('/buildCSV',require('./controller').createCSV);

module.exports = router;
