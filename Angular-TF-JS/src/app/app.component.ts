import { Component } from '@angular/core';

// Import model
import { PredictionConfig } from '../model/prediction-config';
import { PredictionResult } from '../model/prediction-result';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent {
  title = 'Hariom Kumar Angular-TF-JS';

  data: PredictionConfig = {
    objectToDetect: 'person',
    threshold: 0.7,
    quitOnFound: false,
    showConfettiWhenFound: true
  };


  // Prediction Result
  Predictionresults: PredictionResult[] = [];
  handlePredictionChange(Predictionresults: PredictionResult[]): void {
    this.Predictionresults = Predictionresults;
  }
}
