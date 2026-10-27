import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnChanges
} from '@angular/core';

@Directive({
  selector: '[mathMode]',
  standalone: true
})
export class MathMode implements AfterViewInit, OnChanges {

  @Input() mathMode = '';

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.render();
  }

  ngOnChanges(): void {
    this.render();
  }

  private render(): void {
    this.el.nativeElement.innerHTML = this.mathMode;

    (window as any).MathJax?.typesetPromise([
      this.el.nativeElement
    ]);
  }
}