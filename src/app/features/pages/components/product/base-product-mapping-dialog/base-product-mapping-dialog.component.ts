import { Component, Inject, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { ProductEndpoint } from '../../../services/endpoints/product.endpoint'

@Component({
  selector: 'app-base-product-mapping-dialog',
  templateUrl: './base-product-mapping-dialog.component.html',
  styleUrls: ['./base-product-mapping-dialog.component.css'],
})
export class BaseProductMappingDialogComponent implements OnInit {
  userTable: FormGroup
  control: FormArray

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BaseProductMappingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private productEndpoint: ProductEndpoint,
    private sweetAlertService: SweetAlertService
  ) {}

  ngOnInit(): void {
    this.userTable = this.fb.group({
      tableRows: this.fb.array([]),
    })
    this.control = this.userTable.get('tableRows') as FormArray
    if (this.data.type === 'update') {
      this.productEndpoint
        ._getBaseProductMappingById(this.data.productId)
        .toPromise()
        .then((res: any) => {
          res.map((row: any) => {
            this.addRow(row)
          })
        })
    } else {
      this.addRow()
    }
  }

  initiateForm(data?): FormGroup {
    return data
      ? this.fb.group({
          product: [data.BaseProductId, Validators.required],
          productName: [data.BaseProductCode + ' -- ' + data.BaseProductName],
          count: [data.Quantity, [Validators.required, Validators.pattern('^[0-9]+$')]],
        })
      : this.fb.group({
          product: ['', Validators.required],
          productName: [''],
          count: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        })
  }

  addRow(data?) {
    const control = this.userTable.get('tableRows') as FormArray
    data ? control.push(this.initiateForm(data)) : control.push(this.initiateForm())
  }

  async deleteRow(index: number) {
    const saveAlert = await this.sweetAlertService.saveAlert('Please note that you are about to delete this line！')
    if (!saveAlert.value) {
      return
    }
    const control = this.userTable.get('tableRows') as FormArray
    control.removeAt(index)
  }

  getFormControls() {
    return this.userTable.get('tableRows') as FormArray
  }

  submitForm() {
    const postData = []
    for (const row of this.getFormControls().value) {
      postData.push({
        baseProductId: row.product,
        quantity: row.count,
      })
    }
    if (!postData.length) {
      this.sweetAlertService.showSweetAlert('请先选择产品再提交！')
      return
    }
    if (this.data.type === 'update') {
      this.productEndpoint._updateBaseProductMapping(this.data.productId, postData).subscribe((_) => {
        this.sweetAlertService.successAlert('Saved successfully！')
        this.dialogRef.close()
      })
    } else {
      this.productEndpoint
        ._newBaseProductMapping({
          productId: this.data.productId,
          createBaseProductMappingModels: postData,
        })
        .subscribe((_) => {
          this.sweetAlertService.successAlert('Saved successfully！')
          this.dialogRef.close()
        })
    }
  }

  closeDialog(): void {
    this.dialogRef.close()
  }
}
