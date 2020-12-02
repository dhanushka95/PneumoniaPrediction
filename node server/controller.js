const testFolderPneumonia = './test data set/pneumonia/';
const testFolderNormal = './test data set/normal/';
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const neatCsv = require('neat-csv');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'API_Evaluate.csv',
    header: [{id:'API_01_prediction',title:'prediction of API 01'}, {id:'API_02_prediction',title:'prediction of API 02'},{id:'Expected_prediction',title:'expected out put'}]
});
exports.createCSV = async(req, res, next) => {

    let returnArray =[];
    let record =[];
    const Path = require('path');
            /*for pneumonia data set*/
            const positiveImages = await fs.readdirSync(testFolderPneumonia);
             for(let i=0;i<positiveImages.length;i++) {
                        try{
                            let form_1 = new FormData();
                            let form_2 = new FormData();
                            const EXPECTED_VALUE = 1;
                            await form_1.append('image', fs.createReadStream(Path.join(testFolderPneumonia+positiveImages[i])), {
                                filename: positiveImages[i].filename
                            });
                            await form_2.append('image', fs.createReadStream(Path.join(testFolderPneumonia+positiveImages[i])), {
                                filename: positiveImages[i].filename
                            });
                            await axios.create({
                                headers: form_1.getHeaders()
                            }).post('http://localhost:5001/predict', form_1).then(async (response_api_1)=>{
                                await axios.create({
                                    headers: form_2.getHeaders()
                                }).post('http://localhost:5002/predict', form_2).then((response_api_2)=>{
                                    console.log('API 01: ',response_api_1.data,'API 02: ',response_api_2.data,'Expected: ',EXPECTED_VALUE);
                                    if((response_api_1.data===1 || response_api_1.data===0) && (response_api_2.data===1 || response_api_2.data===0)) {
                                        returnArray.push({
                                            API_1_VALUE: response_api_1.data,
                                            API_2_VALUE: response_api_2.data,
                                            EXPECTED: EXPECTED_VALUE
                                        });
                                        record.push({API_01_prediction:response_api_1.data,API_02_prediction:response_api_2.data,Expected_prediction:EXPECTED_VALUE});
                                    }
                                });
                            });
                        }catch (e) {
                            console.log(e);
                        }
            }

            /*for normal data set*/
            const normalImages = await fs.readdirSync(testFolderNormal);
            for(let k=0;k<normalImages.length;k++) {
                        try{
                            const EXPECTED_VALUE = 0;
                            let form_3 = new FormData();
                            let form_4 = new FormData();
                            await form_3.append('image', fs.createReadStream(Path.join(testFolderNormal+normalImages[k])), {
                                filename: normalImages[k].filename
                            });
                            await form_4.append('image', fs.createReadStream(Path.join(testFolderNormal+normalImages[k])), {
                                filename: normalImages[k].filename
                            });
                            await axios.create({
                                headers: form_3.getHeaders()
                            }).post('http://localhost:5001/predict', form_3).then(async(response_api_1)=>{
                                await axios.create({
                                    headers: form_4.getHeaders()
                                }).post('http://localhost:5002/predict', form_4).then((response_api_2)=>{
                                    console.log('API 01: ',response_api_1.data,'API 02: ',response_api_2.data,'Expected: ',EXPECTED_VALUE);
                                    if((response_api_1.data===1 || response_api_1.data===0) && (response_api_2.data===1 || response_api_2.data===0)) {
                                        returnArray.push({API_1_VALUE: response_api_1.data, API_2_VALUE: response_api_2.data, EXPECTED: EXPECTED_VALUE});
                                        record.push({API_01_prediction:response_api_1.data,API_02_prediction:response_api_2.data,Expected_prediction:EXPECTED_VALUE});
                                    }
                                });
                            });
                        }catch (e) {
                            console.log(e);
                        }
    }

            /*create CSV file*/
            csvWriter.writeRecords(record).then(() => {
                console.log('...Done');
            });
    res.status(200).json({
        data: null,
        message: 'Build CSV'
    });


};

exports.getWeightForModel = async () => {
    let record = [];
    const data = await fs.readFileSync('./API_Evaluate.csv');
    record = await neatCsv(data);
    let result_1_1_1 =0;
    let result_1_1_0 =0;
    let result_1_0_1 =0;
    let result_1_0_0 =0;
    let result_0_1_1 =0;
    let result_0_0_1 =0;
    let result_0_0_0 =0;
    let result_0_1_0 =0;
    let total = record.length;
    for(let i=0;i<record.length;i++){
        if(record[i]['prediction of API 01'] === '1' && record[i]['prediction of API 02'] == '1' && record[i]['expected out put'] ==='1'){
            result_1_1_1++;
        }
        if(record[i]['prediction of API 01'] === '1' && record[i]['prediction of API 02'] == '1' && record[i]['expected out put'] ==='0'){
            result_1_1_0++;
        }
        if(record[i]['prediction of API 01'] === '1' && record[i]['prediction of API 02'] == '0' && record[i]['expected out put'] ==='1'){
            result_1_0_1++;
        }
        if(record[i]['prediction of API 01'] === '1' && record[i]['prediction of API 02'] == '0' && record[i]['expected out put'] ==='0'){
            result_1_0_0++;
        }
        if(record[i]['prediction of API 01'] === '0' && record[i]['prediction of API 02'] == '1' && record[i]['expected out put'] ==='1'){
            result_0_1_1++;
        }
        if(record[i]['prediction of API 01'] === '0' && record[i]['prediction of API 02'] == '0' && record[i]['expected out put'] ==='1'){
            result_0_0_1++;
        }
        if(record[i]['prediction of API 01'] === '0' && record[i]['prediction of API 02'] == '0' && record[i]['expected out put'] ==='0'){
            result_0_0_0++;
        }if(record[i]['prediction of API 01'] === '0' && record[i]['prediction of API 02'] == '1' && record[i]['expected out put'] ==='0'){
            result_0_1_0++;
        }
    }
    console.log('result_1_1_1',((result_1_1_1/total)*100));
    console.log('result_1_1_0',((result_1_1_0/total)*100));
    console.log('result_1_0_1',((result_1_0_1/total)*100));
    console.log('result_1_0_0',((result_1_0_0/total)*100));
    console.log('result_0_1_1',((result_0_1_1/total)*100));
    console.log('result_0_0_1',((result_0_0_1/total)*100));
    console.log('result_0_0_0',((result_0_0_0/total)*100));
    console.log('result_0_1_0',((result_0_1_0/total)*100));
    console.log('positive percentage--------------------');
    console.log('result_1_1',((result_1_1_1/(result_1_1_1+result_1_1_0))*100));
    console.log('result_1_0',((result_1_0_1/(result_1_0_1+result_1_0_0))*100));
    console.log('result_0_1',(isNaN(result_0_1_1/(result_0_1_1+result_0_1_0))?0:result_0_1_1/(result_0_1_1+result_0_1_0)*100));
    console.log('result_0_0',((result_0_0_1/(result_0_0_1+result_0_0_0))*100));
 };
