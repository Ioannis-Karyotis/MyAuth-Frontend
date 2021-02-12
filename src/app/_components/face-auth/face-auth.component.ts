import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AccountService, AlertService } from '@app/_services';
import { LoginFacialReqModel } from '@app/_models/_requestModels';
//import '@tensorflow/tfjs-node';
import * as faceapi from 'face-api.js';
import { CountdownComponent, CountdownEvent } from 'ngx-countdown';
import { first } from 'rxjs/operators';
import * as $ from 'jquery'
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-face-auth',
  templateUrl: './face-auth.component.html',
  styleUrls: ['./face-auth.component.less']
})
export class FaceAuthComponent implements OnInit,AfterViewInit {
 
  @ViewChild("canvasScreenshot")
  public canvasScreenshot: ElementRef;
  

  public video :any;
  
  public captures: Array<any>;
  video2: any;
  canvas: any;
  stream: any;
  canvas2: any;
  lol:any;
  lol2:any;
  detections: faceapi.FaceDetection[];
  pass: boolean;
  num: number;
  displaySize: { width: any; height: any; };
  public video3: any;
  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;
  countdownVisibility: { 'visibility' : string};
  timerVisible: boolean = false;
  foundFaceStatus = 0;
  videoId = 'outerVideo';
  scaleFactor = 0.25;
  snapshot : any;
  spinerVisible : boolean;
  findFaceTimeout: NodeJS.Timeout;
  stopTracking: boolean;


  constructor(private accountService: AccountService,
              private _snackBar: MatSnackBar,
              private route: ActivatedRoute,
              private router: Router,
              ) { }

  public ngOnInit() { 
    $('.flash').hide(); 
    this.spinerVisible = true; 
    this.stopTracking = false;
    this.video = document.getElementById('outerVideo');   
    this.video2 = document.getElementById('videoCenter');
    this.video3 = document.getElementById('innerVideo');
    this.setCountdownStyles();
    
  }

  public ngAfterViewInit(){
    faceapi.nets.faceLandmark68Net.loadFromUri('/assets/faceModels'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/assets/faceModels'),
    faceapi.nets.faceExpressionNet.loadFromUri('/assets/faceModels')
    faceapi.loadTinyFaceDetectorModel('/assets/faceModels').then(() => {
      this.pass = false;
      this.startVideo();
    })
  }
  
  setCountdownStyles() {
    this.countdownVisibility = {
      'visibility':  this.timerVisible ? 'visible' : 'hidden'
    };
  }
  public async startVideo() {
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then( async stream => {
          this.video.srcObject = stream;
          this.video3.srcObject = stream;

          this.createFaceCanvas();
          this.video2.srcObject = this.canvas.captureStream(25);
          this.canvas2 = document.getElementById("faceCanvas");
          this.displaySize = { width: this.video2.width, height: this.video2.height }
          faceapi.matchDimensions(this.canvas2, this.displaySize)
          setTimeout(()=>{
            this.pass=true;
          }, 1000);
           
      });
    }
    
  }

  public async createFaceCanvas() {
    this.canvas = document.getElementById('cropCvs');
    let ctx = this.canvas.getContext('2d');
    ctx.drawImage(this.video, ((this.video.videoWidth -  this.canvas.width) / 2), ((this.video.videoHeight -  this.canvas.height) / 2), this.canvas.width, this.canvas.height, 0, 0, this.canvas.width,this.canvas.height);

    if(this.pass == true){

      if(this.spinerVisible == true && this.stopTracking == false){
        $('#faceDiv').removeClass('hidden');
        this.spinerVisible = false;
      }
      
      this.detections = await faceapi.detectAllFaces(this.video2, new faceapi.TinyFaceDetectorOptions());
      // let resizedDetections = faceapi.resizeResults(this.detections, this.displaySize);
      // this.canvas2.getContext('2d').clearRect(0, 0, this.canvas2.width, this.canvas2.height);
      // faceapi.draw.drawDetections(this.canvas2, resizedDetections);
     
      
      if(this.detections != null && this.detections.length > 0){
        if(this.countdown.left == 4000){
          this.countdown.begin();
          console.log("began");
          this.timerVisible = true;
          this.setCountdownStyles()
        }
        if(this.countdown.left == 0 && this.foundFaceStatus == 1){
          this.countdown.restart();
        }
        console.log(this.countdown.left);
      }

    }
    
    if(this.stopTracking == false){
      let self = this;
      this.findFaceTimeout = setTimeout(function() {
        self.createFaceCanvas();
      }, 1000/60);
    }
  }

  async onTimerFinished(e: CountdownEvent){
    if (e.action == 'done') {
      this.timerVisible = false;
      this.setCountdownStyles()
      if(this.detections != null && this.detections.length > 0){
        console.log("Found Face was Succesfull");
        this.foundFaceStatus = 2;
        clearTimeout(this.findFaceTimeout);
        this.stopTracking = true;
        this.capture();
      }
      else{
        console.log("Found Face was a Failure");
        this.foundFaceStatus = 0;
        this._snackBar.open("Couldn't track a face. Please try again","OK",{
          duration : 3000,
          panelClass: ['failure-snackbar']
        });
        setTimeout(() =>{this.foundFaceStatus = 1;},3000)
        
      }
    }
  }

  capture() {
    var context = this.canvasScreenshot.nativeElement.getContext("2d").drawImage(this.video, 0, 0, 640, 480);
    this.capture = this.canvasScreenshot.nativeElement.toDataURL("image/png");

    var existingUserInfo = this.accountService.UserInfo;
    let facialRecoUser = new LoginFacialReqModel()
    facialRecoUser.x_seq = existingUserInfo.x_seq;
    facialRecoUser.base64Img = this.capture.toString();

    $('#screenshot').attr("src",this.capture);
    $('#screenshot').removeClass('hidden');
    $('#faceDiv').addClass('hidden');

    $('.flash')
    .show()  //show the hidden div
    .animate({opacity: 0.5}, 700) 
    .fadeOut(300)
    .css({'opacity': 1});

    setTimeout(() => {
      $('#faceDiv').addClass('hidden');
      this.spinerVisible = true;
      $('#screenshot').addClass('hidden');
    },3000);

    setTimeout(() => {
      this.accountService.loginFaceRecognition(facialRecoUser)
      .pipe(first())
      .subscribe({
          next: () => {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            this.router.navigateByUrl(returnUrl);
          },
          error: error => {
              console.log(error);
          }
      });
    },10000)
  }
}
