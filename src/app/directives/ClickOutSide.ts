import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { fromEvent } from "rxjs";
import { take } from "rxjs/operators";

@Directive({
  selector: '[clickOutSide]'
})
export class HighlightDirective {


  @Output() clickOutSide = new EventEmitter();

  captured = false;

  constructor(private elRef: ElementRef) {
  }

  @HostListener("document:click", ["$event.target"])
  onClick(target) {
    
    if (!this.captured) {
      return;
    }
    if (target.className !== "mat-calendar-body-cell-content mat-focus-indicator mat-calendar-body-selected") {
      if (!this.elRef.nativeElement.contains(target)) {
        this.clickOutSide.emit();

      }
    }
  }

  ngOnInit() {
    fromEvent(document, "click", { capture: true })
      .pipe(take(1))
      .subscribe(() => (this.captured = true));
  }

  

}