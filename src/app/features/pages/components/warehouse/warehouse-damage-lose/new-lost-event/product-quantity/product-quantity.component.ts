import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core'
import { FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core'

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted))
  }
}

@Component({
  selector: 'app-product-quantity',
  templateUrl: './product-quantity.component.html',
  styleUrls: ['./product-quantity.component.css'],
})
export class ProductQuantityComponent implements OnInit {
  public quantityFormControl
  public matcher = new MyErrorStateMatcher()

  @Input() sgn
  @Output() outputData: EventEmitter<any> = new EventEmitter<any>()

  constructor() {}

  ngOnInit(): void {
    if (this.sgn == 1) this.quantityFormControl = new FormControl('', [Validators.required, Validators.pattern('^-?[0-9]*$')])
    else this.quantityFormControl = new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(1)])
  }

  ngOnChanges(changes): void {
    console.log(changes)
    console.log(this.quantityFormControl.value)
  }

  public submit(): void {
    this.outputData.emit(this.quantityFormControl.value)
  }
}
