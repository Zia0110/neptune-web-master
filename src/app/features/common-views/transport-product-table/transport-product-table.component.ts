import { Component, OnChanges, Input, ViewChild, ViewEncapsulation } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { FormBuilder, FormGroup, FormArray, AbstractControl, ValidatorFn, Validators } from '@angular/forms'
import { AppConfigStore } from '../../../core/services/app-config.store'
import { SweetAlertService } from '../../../core/alert/sweet-alert.service'
import { InventoryEndpoint } from '../../pages/services/endpoints/inventory.endpoint'

@Component({
  selector: 'app-transport-product-table',
  templateUrl: './transport-product-table.component.html',
  styleUrls: ['./transport-product-table.component.css'],
})
export class TransportProductTableComponent implements OnChanges {
  @Input() tableData: any
  @Input() warehouseId: any
  @Input() formIsDisabled: any = false
  isShowTable = true
  customerStock = 0

  displayedColumns: string[] = [
    'baseProductId',
    'customerId',
    // 'availableStock',

    'quantityPerPackage',
    'quantityPackage',
    'quantityOfProduct',

    'netWeight',
    'grossWeightOfUnit',
    'grossWeight',
    'productExp',

    'actions',
  ]

  dataSource: MatTableDataSource<any>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  transportForms: FormArray
  originTypes: any

  constructor(
    private sweetAlert: SweetAlertService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private appConfigData: AppConfigStore,
    private inventoryEndpoint: InventoryEndpoint
  ) {
    this.originTypes = this.appConfigData.appSettings.Mapping.PlaceOfOrigin
  }

  ngOnChanges(): void {
    console.log(this.tableData)
    console.log(this.warehouseId)
    this.dataSource = null
    this.prepTable()
  }

  getCustomerStock(data) {
    this.customerStock = data.Stock
    console.log(this.customerStock)
  }

  getAvailableStock(data) {
    console.log(data.value)
    if (data.value && data.value.baseProductId && data.value.customerId && this.warehouseId) {
      return 4
      // setTimeout(() => {
      //   setTimeout(() => {
      //     this.isShowTable = true
      //   })
      //   return 3
      // })
      // return this.inventoryEndpoint.GetStockByProductAndCustomerId(
      //   data.BaseProductId,
      //   data.CustomerId
      // ).toPromise().then((res: any) => {
      //   return res.filter(row => row.WarehouseId === this.warehouseId)[0].AvaliableQuantity
      // })
    } else {
      return 0
    }
  }

  prepTable() {
    this.transportForms = new FormArray([])
    for (let data of this.tableData) {
      this.initFormRows(data)
    }

    // this.transportForms.push(this.formControlInit(this.tableData))

    this.dataSource = new MatTableDataSource(this.transportForms.controls)
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
    // console.log(this.dataSource)
  }

  initFormRows(data?) {
    // console.log({ data: data })
    this.transportForms.push(this.formControlInit(data))
    console.log(this.transportForms)
    // this.dataSource.data = this.transportForms.controls
  }

  addNewFormRow() {
    let newForm = this.formControlInit({})
    this.transportForms.push(newForm)
    this.dataSource._updateChangeSubscription()

    // this.dataSource.data = [this.dataSource.data, newForm]
    // console.log(this.transportForms)
    // console.log(this.dataSource.data)
  }

  formControlInit(data?): FormGroup {
    return this.formBuilder.group({
      FreightId: [{ value: data.FreightId ? data.FreightId : null, disabled: false }],

      baseProductId: [{ value: data.BaseProductId, disabled: false }, Validators.required],
      productName: [{ value: data.ProductName, disabled: true }],

      customerId: [{ value: data.CustomerId, disabled: false }, Validators.required],
      customerName: [{ value: data.CustomerName, disabled: true }],
      // availableStock: [{ value: this.getAvailableStock(data), disabled: true }],
      quantityOfProduct: [{ value: data.QuantityOfProduct, disabled: false }, [Validators.max(9999999), Validators.min(0)]],
      quantityPerPackage: [
        { value: data.QuantityPerPackage ? data.QuantityPerPackage : 6, disabled: false },
        [Validators.max(9999999), Validators.min(0)],
      ],
      quantityPackage: [{ value: data.QuantityPackage ? data.QuantityPackage : 0, disabled: false }, [Validators.max(9999999), Validators.min(0)]],
      grossWeight: [{ value: data.GrossWeight, disabled: false }, [Validators.max(9999999), Validators.min(0)]],
      grossWeightOfUnit: [{ value: data.GrossWeightOfUnit, disabled: false }, [Validators.max(9999999), Validators.min(0)]],
      productExp: [{ value: data.ProductExp ? this.getLocateDateString(data.ProductExp) : data.ProductExp, disabled: false }],
      placeOfOriginId: [{ value: data.PlaceOfOriginId, disabled: false }],
      netWeight: [{ value: data.NetWeight, disabled: false }, [Validators.max(9999999), Validators.min(0)]],
    })
  }

  getLocateDateString(date) {
    console.log(date)
    return new Date(date.replace('T', ' ') + ' UTC')
  }

  valueRangeValidator(control: any): { [key: string]: boolean } | null {
    console.log(control.value)
    if (control.value < 5) {
      return null
    }
    return { valueRange: true }
  }

  findArrayDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) != index)

  // Validates to check if there are duplicate product and client
  onTransportTableSave() {
    console.log(this.transportForms)
    for (let i = 0; i < this.transportForms.value.length; i++) {
      const value = this.transportForms.value[i]
      console.log(value)
      // console.log(value.customerId)
      // console.log(value.customerId.Stock)
      if (value.customerId.Stock < value.quantityOfProduct) {
        this.sweetAlert.showSweetAlert(`Quantity error in the ${i + 1} row!`)
        return
      }
    }
    this.transportForms.controls.map((row: any) => {
      if (row.controls.customerId.value.CustomerId) {
        row.controls.customerId.setValue(row.controls.customerId.value.CustomerId)
      }
    })
    console.log(this.transportForms)
    let arrayControls = this.transportForms.controls
    // If theres more than one item
    if (arrayControls.length > 1) {
      let productValueArr = arrayControls.map((item) => {
        return item['controls'].baseProductId.value
      })
      console.log(productValueArr)
      let productDuplicates = this.findArrayDuplicates(productValueArr)

      console.log(productDuplicates)
      // If product is duplicate
      if (productDuplicates.length) {
        for (let baseProductId of productDuplicates) {
          let clientValueArr = []
          arrayControls.map((item) => {
            if (item['controls'].baseProductId.value == baseProductId) {
              console.log(item['controls'])
              return clientValueArr.push(item['controls'].customerId.value)
            }
          })
          console.log(clientValueArr)
          let clientDuplicates = this.findArrayDuplicates(clientValueArr)
          // If client is duplicate
          if (clientDuplicates.length) {
            this.sweetAlert.showSweetAlert('Transportation items Products and customers Fill in duplicate')
            return false
          }
        }
      }
    }
    return this.transportForms.value
  }

  removeRow(element) {
    this.transportForms.controls.splice(element, 1)

    this.dataSource._updateChangeSubscription()
    console.log(this.transportForms)
  }

  passData() {
    if (this.onTransportTableSave()) {
      let newData = []
      for (let x of this.transportForms.controls) {
        newData.push(x.value)
      }
      return newData
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex)
  }
}
