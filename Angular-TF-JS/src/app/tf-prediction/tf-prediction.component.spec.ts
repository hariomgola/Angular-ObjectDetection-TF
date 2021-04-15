import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TFPredictionComponent } from './tf-prediction.component';

describe('TFPredictionComponent', () => {
  let component: TFPredictionComponent;
  let fixture: ComponentFixture<TFPredictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TFPredictionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TFPredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
