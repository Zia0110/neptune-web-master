import { Component, OnInit } from '@angular/core'
import { InventoryEndpoint } from '../../../services/endpoints/inventory.endpoint'
import * as moment from 'moment'
import { FormControl, Validators, FormBuilder, FormArray } from '@angular/forms'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { NewTicketImageComponent } from '../../order/order-ticket/order-ticket-new/new-ticket-image/new-ticket-image.component'
import { ShowImagesComponent } from '../../../../../shared/common-components/show-images/show-images.component'

@Component({
  selector: 'app-inventory-client-purchase-create-dialog',
  templateUrl: './inventory-client-purchase-create-dialog.component.html',
  styleUrls: ['./inventory-client-purchase-create-dialog.component.css'],
})
export class InventoryClientPurchaseCreateDialogComponent implements OnInit {
  clientId = new FormControl(0)
  warehouseId = new FormControl(2)
  purchaseForm: FormArray
  public showImgUrls: any[] = []

  constructor(
    public dialogRef: MatDialogRef<InventoryClientPurchaseCreateDialogComponent>,
    private inventoryEndpoint: InventoryEndpoint,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit() {
    this.createForm()
  }

  createForm() {
    this.purchaseForm = new FormArray([])

    this.purchaseForm.push(this.formRowCreate())

    console.log(this.purchaseForm)
  }

  addNewRow() {
    this.purchaseForm.push(this.formRowCreate())
  }

  removeRow(element) {
    console.log(this.purchaseForm.controls)
    this.purchaseForm.controls.splice(element, 1)
    console.log(this.purchaseForm.controls)
  }

  formRowCreate() {
    return this.formBuilder.group({
      baseProductId: ['', Validators.required],
      quantity: ['', Validators.required],
      comment: [''],
      urls: [[]],
    })
  }

  submitForm() {
    if (!this.onSaveCheckDuplicates()) {
      return
    }
    console.log(this.purchaseForm)
    let products = []
    this.purchaseForm.controls.map((row) => products.push(row.value))
    let newData = {
      customerId: this.clientId.value,
      warehouseId: this.warehouseId.value || 2,
      selfGoodDetails: products,
    }
    this.createNewApi(newData)
  }

  onSaveCheckDuplicates() {
    // console.log(this.purchaseForm)
    let arrayControls = this.purchaseForm.controls
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
        this.sweetAlert.showSweetAlert('Duplicate products ！')
        return false
      } else {
        return true
      }
    }
    return true
  }

  findArrayDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) != index)

  isDisabled() {
    if (!this.clientId.value || this.purchaseForm.status == 'INVALID') {
      return true
    } else {
      return false
    }
  }

  createNewApi(data) {
    this.inventoryEndpoint.createNewClientInventorySelfPurchaseData(data).subscribe((res) => {
      console.log(res)
      this.sweetAlert.showSuccessMessage('add success!')
      this.dialogRef.close('success')
    })
  }

  addImages(element, index): void {
    const dialogRef = this.dialog.open(NewTicketImageComponent, {
      disableClose: true, // disable clicking to close the dialog coz it would not upload the pic
      width: '1000px',
      height: '80%',
    })
    // needs to add the url one by one to a tem array
    // then assign the tem array to control

    // if (element.value.imagesUrl.value == undefined) {
    //     element.value.imagesUrl.value = []
    // }
    let temArray: string[] = []
    for (let url of element.urls.value) {
      temArray.push(url)
    }
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        for (let url of result) {
          temArray.push(url.FileNameForStorage)
          this.showImgUrls.push(url)
        }
        element.urls.value = temArray
        this.purchaseForm.controls[index].value.urls = temArray
      }
      console.log(this.purchaseForm)
    })
  }

  showImages(element, index): void {
    let urls = element.urls.value
    console.log(urls)
    if (urls == undefined) {
      this.sweetAlert.showSweetAlert('no uploaded image！')
    } else {
      const dialogRef = this.dialog.open(ShowImagesComponent, {
        width: '1000px',
        height: '80%',
        data: {
          urlsArray: this.showImgUrls,
          deleteAllowed: true,
        },
      })
      dialogRef.afterClosed().subscribe((result) => {
        if (result != undefined) {
          let returnedUrlsArray: string[] = []
          for (let url of result) {
            returnedUrlsArray.push(url)
          }
          element.urls.value = returnedUrlsArray
          this.purchaseForm.controls[index].value.urls = returnedUrlsArray
        }
      })
    }
  }
}
