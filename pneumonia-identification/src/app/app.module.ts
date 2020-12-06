import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import {FileUploadOptions} from '@ionic-native/file-transfer/ngx';
import {FileTransferObject, FileTransfer} from '@ionic-native/file-transfer/ngx';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [Ng2GoogleChartsModule, BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ImagePicker,
    Crop,
    FileTransfer,
    FileTransferObject
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
