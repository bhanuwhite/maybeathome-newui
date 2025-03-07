/// <reference types="@types/googlemaps" />
import { Component, ViewChild, EventEmitter, Output, AfterViewInit, Input, Self, Optional } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'auto-complete',
  template: `
  <input class="gmapl"
    type="{{type}}"
    [(ngModel)]="autocompleteInput"
    #addresstext
    [required]="required"
    #test="ngModel"
    placeholder="{{placeholder}}"
    (input)="onChange()"
    (change)="onChange()"
    (blur)="onTouchedFn()"
  >
`,
  styleUrls: ['./auto-complete.component.scss']
})
export class AutoCompleteComponent implements AfterViewInit, ControlValueAccessor {
  @Input() placeholder: string;
  @Input() autocompleteInput: string;
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  @Output() newPlace: EventEmitter<any> = new EventEmitter();
  @ViewChild('addresstext') addresstext: any;
  @Input() validate: boolean
  @Input() type: string
  public required = false;
  private errorMessages = new Map<string, () => string>();
  public onChangeFn = (_: any) => { };

  public onTouchedFn = () => { };
  constructor(@Self() @Optional()
  public control: NgControl,
    translate: TranslateService) {
    this.control && (this.control.valueAccessor = this);
    this.errorMessages.set('required', () => translate.instant('error._name'));
    this.type = (this.type) ? this.type : "search";



  }


  public get invalid(): boolean {
    return this.control ? this.control.invalid : false;
  }

  public get showError(): boolean {
    if (!this.control) {
      return false;
    }

    const { dirty, touched } = this.control;
    return this.invalid ? (dirty || touched) : false;
  }

  public get errors(): Array<string> {
    if (!this.control) {
      return [];
    }

    const { errors } = this.control;
    return Object.keys(errors).map(key => this.errorMessages.has(key) ? this.errorMessages.get(key)() : <string>errors[key] || key);
  }
  ngAfterViewInit(): void {
    this.getPlaceAutocomplete();
  }
  private getPlaceAutocomplete(): void {

    const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement);
    autocomplete.setFields(["place_id", "geometry", "name", "address_components"]);
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      this.placeChanged();
      this.addresstext.nativeElement.focus();
      const place = autocomplete.getPlace();
      this.addresstext.nativeElement.value = autocomplete.getPlace().name;
      const lat = autocomplete.getPlace().geometry?.location.lat();
      const lng = autocomplete.getPlace().geometry?.location.lng();
      const result = autocomplete;
      setTimeout(() => {
        this.addresstext.nativeElement.blur();
      }, 1000);
      this.invokeEvent(place, lat, lng, result);
    });
  }

  invokeEvent(place: Object, lat, lng, result): void {
    const lc = { 'place': place, 'lng': lng, 'lat': lat, 'result': result };
    this.setAddress.emit(lc);
  }
  placeChanged() {
    this.newPlace.emit(true);
  }

  public registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  public writeValue(obj: any): void {
    this.autocompleteInput = obj;
  }

  public onChange() {
    this.onChangeFn(this.autocompleteInput);
  }
}
