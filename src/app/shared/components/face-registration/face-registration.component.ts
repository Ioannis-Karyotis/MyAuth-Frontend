import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/features/auth/services/auth.service';
import { AlertService, SessionService } from '@app/shared/services';
import * as faceapi from 'face-api.js';
import { CountdownComponent, CountdownEvent } from 'ngx-countdown';
import { first } from 'rxjs/operators';
import * as $ from 'jquery'
import { LoginFacialReqModel, RegisterReqModel } from '@app/shared/models/requestModels';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-face-registration',
  templateUrl: './face-registration.component.html',
  styleUrls: ['./face-registration.component.less']
})
export class FaceRegistrationComponent implements OnInit,AfterViewInit {

  @ViewChild("canvasScreenshot")
  public canvasScreenshot: ElementRef;
  

  public video :any;
  
  public capture: any;
  video2: any;
  canvas: any;
  stream: any;
  canvas2: any;
  image:any;
  lol:any;
  lol2:any;
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
  detections: any;
  result: faceapi.WithFaceDescriptor<faceapi.WithFaceExpressions<faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection; }, faceapi.FaceLandmarks68>>>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {formData : any},
    private authService: AuthService,
    private sessionService : SessionService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService
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

  async ngAfterViewInit(){
    this.pass = false;
    this.startVideo();
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
          await new Promise(f => setTimeout(f, 1000));
          this.pass = true;
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
      
      this.detections = await faceapi.detectAllFaces(this.video2, new faceapi.TinyFaceDetectorOptions({scoreThreshold: 0.5}));
      console.log('face captured');
      let resizedDetections = faceapi.resizeResults(this.detections, this.displaySize);
      this.canvas2.getContext('2d').clearRect(0, 0, this.canvas2.width, this.canvas2.height);
      faceapi.draw.drawDetections(this.canvas2, resizedDetections);
    } 

    if(this.detections != null && this.detections.length > 0){
      if(this.countdown.left == 4000){
        this.countdown.begin();
        this.stopTracking = true;
        this.pass = false;
        console.log("began");
        this.timerVisible = true;
        this.setCountdownStyles()
      }

    }
    
    if(this.stopTracking == false){
      let self = this;
      this.findFaceTimeout = setTimeout(function() {
        self.createFaceCanvas();
      }, 1000/60);
    }
  }

  onTimerFinished(e: CountdownEvent){
    if (e.action == 'done') {
      this.timerVisible = false;
      this.setCountdownStyles();
      var context = this.canvasScreenshot.nativeElement.getContext("2d").drawImage(this.video,0,0,this.video.height,this.video.width);
      this.capture = this.canvasScreenshot.nativeElement.toDataURL('image/jpeg');
      $('#screenshot').attr("src",this.capture);
      $('#faceDiv').addClass('hidden');
      // $('#screenshot').removeClass('hidden');

      // $('.flash')
      // .show()  //show the hidden div
      // .animate({opacity: 0.5}, 700) 
      // .fadeOut(300)
      // .css({'opacity': 1});
    
      // setTimeout(function() {
      //   $('#screenshot').addClass('hidden');
      // }, 1000);

      this.spinerVisible = true;

      this.captureFace();
      
    }
  }

  async captureFace() {
    
    this.image = document.getElementById('screenshot');

    this.result = await faceapi.detectSingleFace(this.image).withFaceLandmarks().withFaceExpressions().withFaceDescriptor();

    if((this.result != null && this.result != undefined && this.result.expressions.neutral >= 0.6) ){
      console.log("Found Face was Succesfull");
      this.serverCall(this.result.descriptor);
      
    }
    else if((this.result != null && this.result != undefined &&  this.result.expressions.neutral < 0.6)){
      this._snackBar.open("Please keep your expression neutral","OK",{
        duration : 3000,
        panelClass: ['failure-snackbar']
      });
      this.pass = true;
      this.stopTracking = false;
      this.result = null;
      this.detections = null;
      this.countdown.restart();
      this.createFaceCanvas();     
    }
    else if(this.result == null || this.result == undefined){
      console.log("Found Face was a Failure");
      this._snackBar.open("Couldn't track a face. Please try again","OK",{
        duration : 3000,
        panelClass: ['failure-snackbar']
      });
      this.pass = true;
      this.stopTracking = false;
      this.result = null;
      this.detections = null;
      this.countdown.restart();
      this.createFaceCanvas();      
    }
  }
  
  serverCall(descriptor : Float32Array){

    let facialRecoUser: RegisterReqModel = new RegisterReqModel();

    facialRecoUser = this.data.formData; 
    facialRecoUser.faceDescriptor = JSON.stringify(Array.from(descriptor));

    this.authService.SignUp(facialRecoUser)
    .pipe(first())
    .subscribe({
        next: () => {
          this.alertService.successAlert('Registration successful');
          this.detections = null;
          this.result = null;
          this.router.navigate(['/account']);
        },
        error: error => {
          console.log(error);
          this.detections = null;
          this.result = null;
          this.router.navigate(['/']);
        }
    });
  }
}
