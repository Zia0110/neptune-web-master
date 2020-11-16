import { Component, OnChanges, Input, ViewChild, ViewEncapsulation, Output, EventEmitter } from '@angular/core'
import { AppConfigStore } from '../../../core/services/app-config.store'
import { TransportEndpoint } from '../../pages/services/endpoints/transport.endpoint'
import { FormValidationDirective } from '../../../shared/directives/form-validation.directive'
import { FormArray, FormControl } from '@angular/forms'

@Component({
  selector: 'app-transport-plan-edit',
  templateUrl: './transport-plan-edit.component.html',
  styleUrls: ['./transport-plan-edit.component.css'],
})
export class TransportPlanEditComponent implements OnChanges {
  currentTransportRequirement = []
  transportRequirements: any
  formConfig: any
  @Input() formIsDisabled: any = false
  @Input() isInTransit: any = false

  @Input() transportData: any
  @Output() formValueChange = new EventEmitter()
  @ViewChild('dynamicForm') dynamicForm

  constructor(
    private formValidations: FormValidationDirective,
    private appConfigData: AppConfigStore,
    private transportEndpoint: TransportEndpoint
  ) {}

  ngOnChanges(changes): void {
    console.log(changes)
    // if (!changes.transportData && changes.formIsDisabled) {
    // return
    // }

    this.createForm(this.transportData)
  }

  getFormValues(data) {
    console.log(data)
    this.formValueChange.emit(data)
  }

  setFormEnable() {
    // console.log('setform')
    // Disable form
    if (this.formIsDisabled) {
      console.log('disable')
      this.dynamicForm.form.disable()
    }
    // Form enabled && not in transit
    if (!this.formIsDisabled && !this.isInTransit) {
      console.log('not in transit')
    }
    // Form enabled &&  in transit
    if (!this.formIsDisabled && this.isInTransit) {
      console.log('in transit')
      this.dynamicForm.form.disable()
      this.dynamicForm.form.controls.estimatedArrivalTime.enable()
      this.dynamicForm.form.controls.warehouseId.enable()
    }
  }

  warehouseChangesSubscriber() {
    this.dynamicForm.form.controls.warehouseId.valueChanges.subscribe((res) => {
      // console.log(res)
      this.currentTransportRequirement = []
      this.transportRequirements = []
      if (res) {
        this.getTransportRequirementsApi(res)
      }
    })
  }

  ngAfterViewInit() {
    if (this.dynamicForm.form.controls.warehouseId.value) {
      this.getTransportRequirementsApi(this.dynamicForm.form.controls.warehouseId.value)
    }
    this.warehouseChangesSubscriber()
  }

  getTransportRequirementsApi(warehouseId) {
    this.transportEndpoint._getTransportRequirementsByWarehouse(warehouseId).subscribe((res) => {
      this.createRequirementsForm(res)
    })
  }

  // 转货需求单
  createRequirementsForm(datas) {
    for (let data of datas) {
      data['isCurrent'] = false
    }
    if (this.transportData.TransportRequirementInfo && this.transportData.TransportRequirementInfo.length) {
      for (let currentRequirement of this.transportData.TransportRequirementInfo) {
        currentRequirement['isCurrent'] = true

        datas.push(currentRequirement)
      }
    }
    this.transportRequirements = datas
  }

  checkSubmitDetails() {
    console.log(this.transportRequirements)
    console.log(this.dynamicForm.form)
    // if (this.formIsDisabled) {
    //   return null
    // }
    if (this.dynamicForm.form.status != 'DISABLED' && this.dynamicForm.form.status !== 'VALID') {
      for (let control in this.dynamicForm.form.controls) {
        this.dynamicForm.form.controls[control].touched = true
      }
      return null
    } else {
      return { transportForm: this.dynamicForm.form.value, transportRequirement: this.prepareTransportRequirementsForApi(this.transportRequirements) }
    }
  }

  prepareTransportRequirementsForApi(requirements) {
    let currentRequirement = []
    if (requirements)
      for (let requirement of requirements) {
        if (requirement.isCurrent) {
          currentRequirement.push(requirement.RequirementId)
        }
      }
    return currentRequirement
  }

  getLocateDateString(date) {
    return new Date(date.replace('T', ' ') + ' UTC')
  }

  getUTCdate(dateString) {
    return new Date(dateString).toISOString().replace(/\..+/, '')
  }

  createForm(data) {
    this.formConfig = [
      {
        type: 'input',
        name: 'transportNo',
        class: 'p-2 w-auto ',
        label: 'Transport No',
        value: data.TransportNo,
        validations: [this.formValidations.required(), this.formValidations.minlength(2)],
        // disabled: this.formIsDisabled,
      },
      {
        type: 'select',
        label: 'Transport Type',
        name: 'transportTypeId',
        value: data.TransportTypeId,
        options: this.valueMapping(this.appConfigData.appSettings.Mapping.TransportType, 'TransportTypeId', 'TransportTypeName'),
        class: 'w-auto p-2',
        validations: [this.formValidations.required()],
        // disabled: this.formIsDisabled,
      },
      {
        type: 'date',
        label: 'Departure Time',
        name: 'departureTime',
        class: 'w-auto p-2',
        value: data.DepartureTime ? this.getLocateDateString(data.DepartureTime) : data.DepartureTime,
        validations: [this.formValidations.required()],
        // disabled: this.formIsDisabled,
      },
      {
        type: 'date',
        label: 'Estimated Arrival Time',
        name: 'estimatedArrivalTime',
        class: 'w-auto p-2',
        value: data.EstimatedArrivalTime ? this.getLocateDateString(data.EstimatedArrivalTime) : data.EstimatedArrivalTime,
        validations: [this.formValidations.required()],
        // disabled: this.formIsDisabled,
      },
      // {
      //   type: 'input',
      //   name: 'comment',
      //   class: 'p-2 w-25',
      //   label: '备注信息',
      //   value: '',
      //   // disabled: this.formIsDisabled,
      // },
      {
        type: 'input',
        name: 'comment',
        class: 'p-2 w-25',
        label: 'Comment',
        value: '',
        // disabled: this.formIsDisabled,
      },
      {
        type: 'select',
        label: 'Warehouse(From)',
        name: 'FromWarehouseId',
        value: data.FromWarehouseId,
        options: this.valueMapping(this.appConfigData.appSettings.Mapping.Warehouse, 'WarehouseId', 'WarehouseName'),
        class: 'w-auto p-2',
        validations: [this.formValidations.required()],
        // disabled: this.formIsDisabled,
      },
      {
        type: 'select',
        label: 'Warehouse(To)',
        name: 'warehouseId',
        value: data.WarehouseId,
        options: this.valueMapping(this.appConfigData.appSettings.Mapping.Warehouse, 'WarehouseId', 'WarehouseName'),
        class: 'w-auto p-2',
        validations: [this.formValidations.required()],
        // disabled: this.formIsDisabled,
      },
      {
        type: 'input',
        name: 'recipient',
        class: 'p-2 w-auto ',
        label: 'Recipient',
        value: data.Recipient,
        validations: [this.formValidations.required(), this.formValidations.minlength(2)],
        disabled: this.formIsDisabled,
      },
    ]
    // if (this.formIsDisabled) {
    setTimeout(() => {
      this.setFormEnable()
    }, 300)
    // }
  }

  valueMapping(datas, x, y) {
    // console.log(datas)
    let newOb = []
    for (let data of datas) {
      newOb.push({ value: data[x], view: data[y] })
    }
    return newOb
  }
}
