import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.scss']
})
export class TourComponent implements OnInit {

  constructor() { }

  carouselItem = 0;
  ngOnInit(): void {
  }
  
  prevSlide(): void {
   this.carouselItem = this.carouselItem -1;
  }

  nextSlide(): void {
    this.carouselItem = this.carouselItem + 1;
  }
}
