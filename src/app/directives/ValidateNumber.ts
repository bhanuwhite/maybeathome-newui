import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumberDirective]'
})
export class numberDirective {
  constructor(public el: ElementRef) {
  }

  @HostListener('input') onInput(event): void {
    const val = this.el.nativeElement.value;
    this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^0-9.]/g, '');
  }
}
