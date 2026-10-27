import { Component, Input } from '@angular/core';
import { Geometry } from '../geometry/geometry';

@Component({
  imports: [],
  selector: 'app-playground',
  styleUrl: './playground.scss',
  templateUrl: './playground.html',
})
export class Playground {
  area = 0;
  @Input()
  dlugosc: number = 0;
  constructor(private readonly geometryService: Geometry) {
    console.log(geometryService.circleArea(10.0));
  }

  radiusChanged(event: any) {
    this.area = this.geometryService.circleArea(event.target.value);
  }
}
