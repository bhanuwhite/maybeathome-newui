import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quality-labels',
  templateUrl: './quality-labels.component.html',
  styleUrls: ['./quality-labels.component.scss']
})
export class QualityLabelsComponent implements OnInit {

  labelsView: boolean = false;
  testimonialsView: boolean = false
  constructor() { }

  ngOnInit(): void {
    this.labelsView = true;
    
  }

  labels(): void {
    this.labelsView = true;
    this.testimonialsView = false;
  }

  testimonials(): void {
    this.testimonialsView = true;
    this.labelsView = false;

  }

}
