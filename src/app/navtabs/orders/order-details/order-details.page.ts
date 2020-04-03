import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {
  
  slideNavOpt = {
    initialSlide: 0,
    loop: false,
    direction: 'vertical',
    speed: 400,
    slidesPerView: 3,
    spacebetween: 3,
  };

  constructor() { }

  ngOnInit() {
  }

}
