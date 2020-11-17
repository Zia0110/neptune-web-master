import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { WarehouseEndpoint } from '../../../../services/endpoints/warehouse.endpoint'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-warehouse-list-dialog',
  templateUrl: './warehouse-list-dialog.component.html',
  styleUrls: ['./warehouse-list-dialog.component.css'],
})
export class WarehouseListDialogComponent implements OnInit {
  warehouseDetailForm: FormGroup
  warehouse: object
  newWarehouseDetail = {
    warehouseName: '',
    contactPerson: '',
    phone: '',
    email: '',
    fax: '',
    website: '',
    warehouseTypeName: '',
    warehouseTypeId: '',
    isActive: 1,
  }
  isNew: boolean = false
  isSuccess: boolean = true

  constructor(
    public dialogref: MatDialogRef<WarehouseListDialogComponent>,
    private fb: FormBuilder,
    private warehouseEndpoint: WarehouseEndpoint,
    private sweetAlertService: SweetAlertService,
    @Inject(MAT_DIALOG_DATA) element
  ) {
    if (element) {
      this.warehouse = element.data
      console.log(this.warehouse)
    } else {
      this.isNew = true
    }
  }

  ngOnInit() {
    if (this.isNew == true) {
      // Create New Warehouse
      this.warehouseDetailForm = this.fb.group({
        WarehouseName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
        ContactPerson: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
        Phone: ['', [Validators.minLength(2), Validators.maxLength(20)]],
        Email: ['', [Validators.minLength(2), Validators.maxLength(100)]],
        Fax: ['', [Validators.minLength(2), Validators.maxLength(20)]],
        Website: ['', [Validators.minLength(2), Validators.maxLength(50)]],
        WarehouseType: ['', [Validators.required]],
      })
    } else {
      // Edit Warehouse
      this.warehouseDetailForm = this.fb.group({
        WarehouseName: [this.warehouse['WarehouseName'], [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
        ContactPerson: [this.warehouse['ContactPerson'], [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
        Phone: [this.warehouse['Phone'], [Validators.minLength(2), Validators.maxLength(20)]],
        Email: [this.warehouse['Email'], [Validators.email, Validators.minLength(2), Validators.maxLength(100)]],
        Fax: [this.warehouse['Fax'], [Validators.minLength(2), Validators.maxLength(20)]],
        Website: [this.warehouse['Website'], [Validators.minLength(2), Validators.maxLength(50)]],
        WarehouseType: [this.warehouse['WarehouseTypeId'], [Validators.required]],
      })
    }
  }

  get WarehouseName() {
    return this.warehouseDetailForm.get('WarehouseName')
  }

  get ContactPerson() {
    return this.warehouseDetailForm.get('ContactPerson')
  }

  get Phone() {
    return this.warehouseDetailForm.get('Phone')
  }

  get Email() {
    return this.warehouseDetailForm.get('Email')
  }

  get Fax() {
    return this.warehouseDetailForm.get('Fax')
  }

  get Website() {
    return this.warehouseDetailForm.get('Website')
  }

  get WarehouseType() {
    return this.warehouseDetailForm.get('WarehouseType')
  }

  getErrorMessageWarehouseName() {
    return this.WarehouseName.hasError('required')
      ? 'Please enter a name'
      : this.WarehouseName.hasError('minlength') || this.WarehouseName.hasError('maxlength')
      ? 'Sorry, please enter 2-20 characters'
      : ''
  }

  getErrorMessageContactPerson() {
    return this.ContactPerson.hasError('required')
      ? 'Please enter a name'
      : this.ContactPerson.hasError('minlength') || this.ContactPerson.hasError('maxlength')
      ? 'Sorry, please enter 2-20 characters'
      : ''
  }

  getErrorMessagePhone() {
    return this.Phone.hasError('minlength') || this.Phone.hasError('maxlength') ? 'Sorry, please enter 2-20 characters' : ''
  }

  getErrorMessageEmail() {
    return this.Email.hasError('email') || this.Email.hasError('minlength') || this.Email.hasError('maxlength')
      ? 'Sorry, please enter 2-100 characters'
      : ''
  }

  getErrorMessageFax() {
    return this.Fax.hasError('minlength') || this.Fax.hasError('maxlength') ? 'Sorry, please enter 2-20 characters' : ''
  }

  getErrorMessageWebsite() {
    return this.Website.hasError('minlength') || this.Website.hasError('maxlength') ? 'Sorry, please enter 2-50 characters' : ''
  }

  getErrorMessageWarehouseType() {
    return this.WarehouseType.hasError('minlength') || this.WarehouseType.hasError('required') ? 'Please select warehouse type' : ''
  }

  onSubmit() {
    let warehouseTypeName
    switch (this.warehouseDetailForm.value['WarehouseType']) {
      case 1:
        warehouseTypeName = '中国'
        break
      case 2:
        warehouseTypeName = '新西兰'
        break
    }
    this.newWarehouseDetail = {
      warehouseName: this.warehouseDetailForm.value['WarehouseName'],
      contactPerson: this.warehouseDetailForm.value['ContactPerson'],
      phone: this.warehouseDetailForm.value['Phone'],
      email: this.warehouseDetailForm.value['Email'],
      fax: this.warehouseDetailForm.value['Fax'],
      website: this.warehouseDetailForm.value['Website'],
      warehouseTypeName: warehouseTypeName,
      warehouseTypeId: this.warehouseDetailForm.value['WarehouseType'],
      isActive: 1,     
    }
    
    if (this.isNew == false) {
      console.log('表单', this.warehouseDetailForm)
      console.log('更新后信息', this.newWarehouseDetail)
      this.warehouseEndpoint._updateWarehouse(this.newWarehouseDetail, this.warehouse['WarehouseId']).subscribe(
        (success) => {
          console.log('Update Success!', success)
          this.sweetAlertService.showSuccessMessage('update completed！')
          this.dialogref.close(this.isSuccess)
        },
        (error) => {
          this.sweetAlertService.showSweetAlert('Sorry, update failed！')
          console.log(error)
        }
      )
    } else {
      this.warehouseEndpoint._newWarehouse(this.newWarehouseDetail).subscribe(
        (success) => {
          console.log('Create Success!', success)
          this.sweetAlertService.showSuccessMessage('Successfully created warehouse！')
          this.dialogref.close(this.isSuccess)
        },
        (error) => {
          this.sweetAlertService.showSweetAlert('Sorry, create failed！')
          console.log(error)
        }
      )
    }
  }
}
