import { Component } from '@angular/core';
import { Geometry } from '../geometry/geometry';

@Component({
  imports: [],
  selector: 'app-circle',
  styleUrl: './circle.scss',
  templateUrl: './circle.html',
})
export class Circle {
  area = 0;
  constructor(private readonly geometryService: Geometry) {
    console.log(geometryService.circleArea(10.0));
  }

  radiusChanged(event: any) {
    this.area = this.geometryService.circleArea(event.target.value);
  }
}
