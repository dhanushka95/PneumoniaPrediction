const testFolderPneumonia = './test data set/pneumonia/';
const testFolderNormal = './test data set/normal/';
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'API_Evaluate.csv',
    header: ['prediction of API 01', 'prediction of API 02','expected out put']
});
exports.createCSV = async(req, res, next) => {

    let returnArray =[];
    let record =[];
    const Path = require('path');
            /*for pneumonia data set*/
             await fs.readdirSync(testFolderPneumonia).forEach(async file => {
                try{
                    let form_1 = new FormData();
                    let form_2 = new FormData();
                    await form_1.append('image', fs.createReadStream(Path.join(testFolderPneumonia+file)), {
                        filename: file.filename
                    });
                    await form_2.append('image', fs.createReadStream(Path.join(testFolderPneumonia+file)), {
                        filename: file.filename
                    });
                    await axios.create({
                        headers: form_1.getHeaders()
                    }).post('http://localhost:5001/predict', form_1).then((response_api_1)=>{
                        axios.create({
                            headers: form_2.getHeaders()
                        }).post('http://localhost:5002/predict', form_2).then((response_api_2)=>{
                            console.log('API 01: ',response_api_1.data,'API 02: ',response_api_2.data,'Expected: ',1);
                            if((response_api_1===1 || response_api_1===0) && (response_api_2===1 || response_api_2===0)) {
                                returnArray.push({
                                    API_1_VALUE: response_api_1,
                                    API_2_VALUE: response_api_2,
                                    EXPECTED: 1
                                });
                                record.push([response_api_1,response_api_2,1]);
                                csvWriter.writeRecords(records);
                            }
                        });
                    });
                }catch (e) {
                    console.log(e);
                }
            });

            /*for normal data set*/
            await fs.readdirSync(testFolderNormal).forEach(async file => {
        try{
            let form_3 = new FormData();
            let form_4 = new FormData();
            await form_3.append('image', fs.createReadStream(Path.join(testFolderNormal+file)), {
                filename: file.filename
            });
            await form_4.append('image', fs.createReadStream(Path.join(testFolderNormal+file)), {
                filename: file.filename
            });
            await axios.create({
                headers: form_3.getHeaders()
            }).post('http://localhost:5001/predict', form_3).then((response_api_1)=>{
                axios.create({
                    headers: form_4.getHeaders()
                }).post('http://localhost:5002/predict', form_4).then((response_api_2)=>{
                    console.log('API 01: ',response_api_1.data,'API 02: ',response_api_2.data,'Expected: ',0);
                    if((response_api_1===1 || response_api_1===0) && (response_api_2===1 || response_api_2===0)) {
                        returnArray.push({API_1_VALUE: response_api_1, API_2_VALUE: response_api_2, EXPECTED: 0});
                        record.push([response_api_1,response_api_2,0]);
                        csvWriter.writeRecords(records);
                    }
                });
            });
        }catch (e) {
            console.log(e);
        }
    });
    res.status(200).json({
        data: null,
        message: 'Building CSV'
    });


};
