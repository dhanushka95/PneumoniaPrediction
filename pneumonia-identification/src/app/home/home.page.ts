import {Component, ElementRef, ViewChild} from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { Crop } from '@ionic-native/crop/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public peiChart: GoogleChartInterface;
  fileUrl: any = null;
  respData: any;
  Chart: any;
  ImageCard: any;
    @ViewChild('chart', { static: true }) chart: ElementRef;
    @ViewChild('imageCard', { static: true }) imageCard: ElementRef;
  constructor(private imagePicker: ImagePicker,
              private crop: Crop,
              private transfer: FileTransfer) {
      this.loadPieChart();
  }
  loadPieChart(){
    this.peiChart = {
      chartType: 'PieChart',
      dataTable: [
          ['Identification', 'True Or False'],
          ['Normal', 0],
          ['Pneumonia', 0]
      ],
      options: {
        height: '50%',
        width: '100%',
        slices: {
          0: { offset: 0.0, color: 'Green' },
          1: { offset: 0.0, color: 'Red' }
        }
      }
    };
  }
  cropUpload() {
    this.imagePicker.getPictures({ maximumImagesCount: 1, outputType: 0 }).then((results) => {
      for (let i = 0; i < results.length; i++) {
        const fileTransfer: FileTransferObject = this.transfer.create();
        const uploadOpts: FileUploadOptions = {
                    fileKey: 'image',
                    fileName: results[i]
                  };

        fileTransfer.upload(results[i], 'http://localhost:5000/api/predict', uploadOpts)
                      .then((data) => {
                        this.respData = JSON.parse(data.response);
                        this.peiChart = {
                              chartType: 'PieChart',
                              dataTable: [
                                  ['Identification', 'True Or False'],
                                  ['Normal', 100 - parseFloat(this.respData.data)],
                                  ['Pneumonia', parseFloat(this.respData.data)]
                              ],
                              options: {
                                  height: '50%',
                                  width: '100%',
                                  slices: {
                                      0: { offset: 0.0, color: 'Green' },
                                      1: { offset: 0.0, color: 'Red' }
                                  }
                              }
                          };
                        this.Chart = this.chart;
                        this.Chart.data = this.peiChart;
                        this.Chart.draw();
                        console.log(this.respData);
                        this.fileUrl = this.respData.fileUrl;
                      }, (err) => {
                        console.log(err);
                      });
      }
    }, (err) => { console.log(err); });
  }
}
