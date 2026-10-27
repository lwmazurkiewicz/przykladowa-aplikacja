import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class Geometry {
    public circleArea(radius: number) {
        return Math.PI * radius * radius;
    }
}
