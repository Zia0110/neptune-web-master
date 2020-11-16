import { Component, OnInit, EventEmitter, Output } from '@angular/core'
import { ErrorStateMatcher } from '@angular/material/core'
import { FormGroupDirective, NgForm, FormControl, Validators } from '@angular/forms'

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted))
  }
}

@Component({
  selector: 'app-order-number-input',
  templateUrl: './order-number-input.component.html',
  styleUrls: ['./order-number-input.component.css'],
})
export class OrderNumberInputComponent implements OnInit {
  public quantityFormControl = new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')])
  public matcher = new MyErrorStateMatcher()
  @Output() outputData: EventEmitter<any> = new EventEmitter<any>()
  constructor() {}

  ngOnInit(): void {}

  public submit(): void {
    this.outputData.emit(this.quantityFormControl.value)
  }
}
