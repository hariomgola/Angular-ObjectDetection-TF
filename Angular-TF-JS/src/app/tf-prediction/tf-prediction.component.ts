import { Component, OnInit } from '@angular/core';

// Import Inbuild Module
import {ElementRef, EventEmitter, HostBinding, Input,Output, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// Import Installed Module
import * as cocossd from '@tensorflow-models/coco-ssd';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import confetti from 'canvas-confetti';

// Import Model
import { PredictionType } from '../../model/prediction-type';
import { PredictionResult } from '../../model/prediction-result';
import { Prediction } from '../../model/prediction';

// Constant for Font
const FONT = '16px open-sans';
// Constant Color of Object Detection
const COLOR = '#FFA500';
// Constant for Time to check Object
const SNAPSHOT_INTERVAL = 200;

@Component({
  selector: 'app-tf-prediction',
  templateUrl: './tf-prediction.component.html',
  styleUrls: ['./tf-prediction.component.css']
})





export class TFPredictionComponent implements OnInit {

  constructor() { 
    console.log('Object Detection Child Component is working')
  }

  // Input Decorator
  @Input() predictionThreshold: number;
  @Input() objectToPredict: PredictionType;
  @Input() isStopOnObjectFoundEnabled = false;
  @Input() isConfettiEnabled = false;

  // Output Decorator
  @Output() predictionChange = new EventEmitter<PredictionResult[]>();

  // Getting Result from #HariPredictionObj
  @ViewChild('HariPredictionObj', {read: ElementRef, static: false}) canvas: ElementRef<any>;
  webcamImage: WebcamImage;
  predictions: Prediction[] = [];


  private trigger: Subject<void> = new Subject<void>();
  private model: any;
  private found = false;

  /**
   * ngOnInit function Runs When Ever the component is called
   */
  ngOnInit(): void {
    // For debugging purposes
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => console.log('Detected devices:', mediaDevices));

    // Loading cocossd module
    cocossd.load()
      .then(model => this.model = model)
      .catch(err => console.log('Error in Loading COCO model', err));

    // Render predictions for snapshots, based on the provided model
    this.trigger.subscribe(() => {
      if (this.webcamImage && this.webcamImage.imageData && this.model) {
        this.model.detect(this.webcamImage.imageData)
          .then(predictions => {
            this.renderPredictions(predictions);
            this.predictions = predictions;

            const results = this.mapPredictionsToResults(predictions);
            this.emitResults(results);
            this.markFound(results);
          });
      }
    });
    // Snapshot interval
    setInterval(() => this.trigger.next(), SNAPSHOT_INTERVAL);
  }



  // Check if there is Any Web Cam related Error
  error(error: WebcamInitError): void {
    console.error('Cannot initialize:', error);
  }

  // for Capuring Web Cam Image
  capture(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  /**
   * Methord Can be used for Checking new Object.
   * @param results 
   */
  private markFound(results): void {
    if (!this.found && this.isStopOnObjectFoundEnabled) {
      this.found = results.find(res => res.correct) !== undefined;

      if (this.found && this.isConfettiEnabled) {
        this.showConfetti();
      }
    }
  }


  /**
   * Showing Some confetti
   */
  private showConfetti(): void {
    const myConfetti = confetti.create(this.canvas.nativeElement, { resize: true });
    myConfetti({
      particleCount: 400,
      spread: 200
    });
  }

  
  /**
   * Give Result in Form of Prediction in console
   */
  private emitResults(results): void {
    if (!this.found) {
      console.log('prediction', results);
      this.predictionChange.emit(results);
    }
  }


  /**
   * Setting the prediction result into model
   * @param predictions 
   * @returns 
   */
  private mapPredictionsToResults(predictions): PredictionResult[] {
    return predictions.map(p => (
      {
        correct: p.score > this.predictionThreshold
          && p.class === this.objectToPredict,
        object: p.class,
        certainty: p.score
      }
    ));
  }
  
  /**
   * Give Prediction from #canvas Check HTML for same
   * @param predictions 
   */
  private renderPredictions(predictions: any): void {
    const ctx = this.canvas.nativeElement.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.font = FONT;
    ctx.textBaseline = 'top';

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];

      ctx.strokeStyle = COLOR;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
    });
  }


  // Private Methord Finish 

}
