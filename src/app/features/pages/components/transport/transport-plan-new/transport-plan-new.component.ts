import { NewTransportationExcelMapping } from './../../../services/mappings/new-transportaion-excel.mapping'
import { Component, OnInit, ViewChild, Inject } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { AppConfigStore } from '../../../../../core/services/app-config.store'
import { TransportEndpoint } from '../../../services/endpoints/transport.endpoint'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { FormValidationDirective } from '../../../../../shared/directives/form-validation.directive'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-transport-plan-new',
  templateUrl: './transport-plan-new.component.html',
  styleUrls: ['./transport-plan-new.component.css'],
})
export class TransportPlanNewComponent implements OnInit {
  initTableData = [{}]
  initTransportPlanData = {}

  @ViewChild('transportTable') transportTable
  @ViewChild('transportPlanEdit') transportPlanEdit

  transportForm: FormGroup
  transportRequirements: any
  formConfig: any
  formWarehouseId: number

  constructor(private sweetAlert: SweetAlertService, private appConfigData: AppConfigStore, private transportEndpoint: TransportEndpoint) {}

  ngOnInit() {
    // console.log(this.transportForm)
    // this.transportTypes = this.appConfigData.appSettings.Mapping.TransportType
    // this.destinationTypes = this.appConfigData.appSettings.Mapping.Warehouse
  }

  ngAfterViewInit() {}

  getFormWarehouseId(data) {
    console.log(data)
    this.formWarehouseId = data.FromWarehouseId
  }

  save() {
    let transportTableData = this.transportTable.onTransportTableSave()
    let transportData = this.transportPlanEdit.checkSubmitDetails()
    if (transportData && transportData.transportForm && transportTableData) {
      let newData = {
        transportDto: transportData.transportForm,
        freightDtos: transportTableData,
        requirementIds: transportData.transportRequirement,
      }
      this.postToAPI(newData)
    }
    // else {
    //   this.sweetAlert.showSweetAlert('There is an error in your content')
    // }
  }

  postToAPI(newData) {
    console.log(newData)
    this.transportEndpoint._newTransportPlan(newData).subscribe((res) => {
      console.log(res)
      this.sweetAlert.showSuccessMessage('Add success')
      this.clearChanges()
    })
  }

  clearChanges() {
    this.initTableData = [{}]
    this.initTransportPlanData = {}
  }
  excelOutput(event) {
    console.log(event)
    let excelMapping = new NewTransportationExcelMapping()
    let importData = excelMapping.mapping(event)
    this.initTableData = this.dataToTable(importData)
    if (event.length != this.initTableData.length) this.sweetAlert.showSweetAlert('There is an error in format, Please check!')
  }
  private dataToTable(importData) {
    for (let e of importData) {
      let customer = this.getIdforCode(e.Customer, 1)
      if (!customer) {
        this.sweetAlert.showSweetAlert('There is an error in customer code mapping')
        continue
      }
      let product = this.getIdforCode(e.Product, 2)
      if (!product) {
        this.sweetAlert.showSweetAlert('There is an error in product code mapping')
        continue
      }
      if (e.QuantityOfProduct == 0 || e.ProductExp == null) {
        this.sweetAlert.showSweetAlert('There is an error in format of the excel')
        continue
      }
      e.BaseProductId = product.BaseProductId
      e.ProductName = product.ProductName
      e.CustomerId = customer.CustomerId
      e.CustomerName = customer.CustomerName
      e.FreightId = null
      e.placeOfOriginId = null
      e.ProductExp = e.ProductExp.toISOString()
    }
    return importData
  }
  private getIdforCode(code, type) {
    if (type == 1) {
      return this.appConfigData.appSettings.CustomerInfo.Customers.find((e) => e.CustomerCode == code)
    } else {
      return this.appConfigData.appSettings.ProductInfo.BaseProducts.find((e) => e.ProductCode == code)
    }
  }
}
