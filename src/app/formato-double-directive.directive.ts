import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appFormatoDoubleDirective]'
})
export class FormatoDoubleDirectiveDirective {

  private regex: RegExp = new RegExp(/^\d{1,3}(\.\d{0,2})?$/);


  constructor(private el: ElementRef) { }


  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initialValue = this.el.nativeElement.value;
    if (initialValue.length > 6) {
      this.el.nativeElement.value = initialValue.slice(0, 6);
    }
    let newValue = this.el.nativeElement.value;
    if (this.regex.test(newValue)) {
      this.el.nativeElement.value = newValue;
    } else {
      this.el.nativeElement.value = newValue.substring(0, newValue.length - 1);
    }
  }
}
