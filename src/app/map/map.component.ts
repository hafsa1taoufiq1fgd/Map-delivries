import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as L from 'leaflet';
import { FileUploadService } from '../file-upload-service.service';

import { HttpEventType, HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  @ViewChild('fileUpload') fileUpload: ElementRef
  private map;

  selectedFiles: FileList;
  numFileSelected
  progressInfos = [];
  message = '';
  progress = 0;
  //currentFile;
  currentFile?: File;
  isShown: boolean = false;
  disabled=true;
  constructor(private uploadService: FileUploadService) {

  }
  fileInfos: Observable<any>;
  private initMap(): void {
    this.map = L.map('map', {
      center: [33.2677, -7.5806],
      zoom: 13
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  // onFileUpload(event) {
  //   var file = event.target.files[0]
  //   console.log(file)
  // }
  selectFiles(event) {
    console.log("*************")
    this.disabled=false;
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
    this.numFileSelected = event.target.files.length
    this.currentFile = this.selectedFiles[0];
    console.log(this.selectedFiles)
    console.log(this.currentFile)
  }

  Send() {
    var test=[];
    this.uploadService.upload(this.currentFile).subscribe(
      (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          console.log("***************",event.body)
          this.message = event.body.message;
          this.fileInfos = this.uploadService.getFiles();
          test=event.body;
         
          test.forEach(point=>{
            console.log(point)
            var greenIcon = L.icon({
              iconUrl: 'assets/green.png',
              iconSize: [8, 8] 
          });
            var newMarker = new L.marker([point.lat,point.lon], {icon: greenIcon});
            newMarker.bindPopup("id Commande: "+point.id_commande+"<br> Client:"+point.Name_Client)
            newMarker.addTo(this.map);
          })
        }
      },
      (err: any) => {

        console.log(err);
        this.progress = 0;
        if (err.error && err.error.message) {
          this.message = err.error.message;
        } else {
          this.message = 'Could not upload the file!';
        }
      });
  }

}

