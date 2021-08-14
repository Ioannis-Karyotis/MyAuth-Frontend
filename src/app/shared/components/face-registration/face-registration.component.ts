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

  video :any;
  video2: any;
  canvas: any;
  capture: any;
  stream: any;
  image:any;
  spinerVisible: boolean;
  isLogged : boolean = false; 
  result: faceapi.WithFaceDescriptor<faceapi.WithFaceExpressions<faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection; }, faceapi.FaceLandmarks68>>>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {formData : any},
    private authService: AuthService,
    private sessionService : SessionService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private alertService: AlertService
    ) { }

  public ngOnInit() {   
    $('.flash').hide(); 
    this.spinerVisible = true; 
    this.sessionService.isLoggedIn().subscribe(loggedIn => {
        this.isLogged = loggedIn;
    })
    this.video = document.getElementById('outerVideo');   
    this.video2 = document.getElementById('innerVideo');
  }

  async ngAfterViewInit(){
    if(this.isLogged == false){
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/faceModels');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/faceModels');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/assets/faceModels');
      await faceapi.nets.faceExpressionNet.loadFromUri('/assets/faceModels');
      faceapi.loadTinyFaceDetectorModel('/assets/faceModels').then(() =>{
        this.startVideo();
      });
    }else{
      this.startVideo();
    }
  }
  
  public startVideo() {
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
          $('#faceDiv').removeClass('hidden');
          this.canvas = document.getElementById("cropCvs");
          this.video.srcObject = stream;
          this.video2.srcObject = stream;
          this.spinerVisible = false;
          setInterval(()=>{
            let ctx = this.canvas.getContext('2d');
            ctx.drawImage(this.video, ((this.video.videoWidth -  this.canvas.width) / 2), ((this.video.videoHeight -  this.canvas.height) / 2), this.canvas.width, this.canvas.height, 0, 0, this.canvas.width,this.canvas.height);  
          }, 100)
      });
    }
  }

  takePicture(){
    this.capture = this.canvas.toDataURL('image/jpeg');
    $('#screenshot').attr("src",this.capture);
    $('#imageOutput').attr("src",this.capture);
    $('#faceDiv').addClass('hidden');
    $('#imageOutput').removeClass('hidden');

    $('.flash')
    .show()  //show the hidden div
    .animate({opacity: 0.5}, 700) 
    .fadeOut(300)
    .css({'opacity': 1});
    var that = this;

    setTimeout(() => {
      $('#imageOutput').addClass('hidden');
      that.spinerVisible = true;
      setTimeout(() => {
        that.captureFace();
      }, 1000);
    },3000)
  }

  captureFace() {
    
    this.image = document.getElementById('screenshot');

    faceapi.detectSingleFace(this.image).withFaceLandmarks().withFaceExpressions().withFaceDescriptor().run().then(res => {
      this.result = res;
      if((this.result != null && this.result != undefined && this.result.expressions.neutral >= 0.6) ){
        this.serverCall(this.result.descriptor);
      }
      else if((this.result != null && this.result != undefined &&  this.result.expressions.neutral < 0.6)){
        this._snackBar.open("Please keep your expression neutral","OK",{
          duration : 3000,
          panelClass: ['failure-snackbar']
        });
        this.result = null;
        this.capture = null;
        this.startVideo();
        
      }
      else if(this.result == null || this.result == undefined){
        this._snackBar.open("Couldn't track a face. Please try again","OK",{
          duration : 3000,
          panelClass: ['failure-snackbar']
        });
        this.result = null;
        this.capture = null;
        this.startVideo();
      }
    });
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
          this.result = null;
          this.capture = null;
          this.router.navigate(['/account']);
        },
        error: error => {
          console.log(error);
          this.result = null;
          this.capture = null;
          this.router.navigate(['/']);
        }
    });
  }
}
