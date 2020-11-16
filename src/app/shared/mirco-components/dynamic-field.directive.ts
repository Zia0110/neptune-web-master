import { ComponentFactoryResolver, ComponentRef, Directive, Input, OnInit, ViewContainerRef } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { FormFieldConfigInterface } from '../presentational-components/dynamic-form/dynamic-form-presentational.interface'
import { InputComponent } from './forms/input/input.component'
import { ButtonComponent } from './forms/button/button.component'
import { SelectComponent } from './forms/select/select.component'
import { DateComponent } from './forms/date/date.component'
import { RadiobuttonComponent } from './forms/radiobutton/radiobutton.component'
import { CheckboxComponent } from './forms/checkbox/checkbox.component'

const componentMapper = {
  input: InputComponent,
  textarea: InputComponent,
  button: ButtonComponent,
  select: SelectComponent,
  date: DateComponent,
  radiobutton: RadiobuttonComponent,
  checkbox: CheckboxComponent,
}

@Directive({
  selector: '[dynamicField]',
})
export class DynamicFieldDirective implements OnInit {
  @Input() field: FormFieldConfigInterface
  @Input() group: FormGroup
  componentRef: any

  constructor(private resolver: ComponentFactoryResolver, private container: ViewContainerRef) {}

  ngOnInit() {
    const factory = this.resolver.resolveComponentFactory(componentMapper[this.field.type])
    this.componentRef = this.container.createComponent(factory)
    this.componentRef.instance.field = this.field
    this.componentRef.instance.group = this.group
  }
}
