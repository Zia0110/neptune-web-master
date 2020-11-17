import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service';
import { WarehouseEndpoint } from '../../../services/endpoints/warehouse.endpoint';

@Component({
  selector: 'app-warehouse-list-formarray',
  templateUrl: './warehouse-list-formarray.component.html',
  styleUrls: ['./warehouse-list-formarray.component.css']
})
export class WarehouseListFormarrayComponent implements OnInit {

  userTable: FormGroup;
  control: FormArray;
  mode: boolean;
  touchedRows: any;
  dataSource: any;

  constructor(private fb: FormBuilder, private warehouseEndpoint: WarehouseEndpoint, public dialog: MatDialog, private sweetAlertService: SweetAlertService) { }

  ngOnInit(): void {
    this.getWarehouseList()
    this.touchedRows = [];
    this.userTable = this.fb.group({
      tableRows: this.fb.array([])
    });
  }

  getWarehouseList() {
    this.warehouseEndpoint._getWarehousesList().subscribe(
      (list) => {
        this.touchedRows = [];
        this.userTable = this.fb.group({
          tableRows: this.fb.array([])
        });
        this.dataSource = list
        console.log('List:', this.dataSource)
        this.dataSource.map(row => {
          this.addRow(row);
        })
      },
      (err) => {
        console.log('Server Error!', err)
      }
    )
  }


  ngAfterOnInit() {
    this.control = this.userTable.get('tableRows') as FormArray;
  }

  initiateForm(row?): FormGroup {
    if (row) {
      return this.fb.group({
        WarehouseId: [row.WarehouseId],
        WarehouseName: [row.WarehouseName],
        ContactPerson: [row.ContactPerson],
        Phone: [row.Phone],
        Email: [row.Email],
        Fax: [row.Fax],
        Website: [row.Website],
        WarehouseType: [row.WarehouseTypeId],
        WarehouseTypeName: [row.WarehouseTypeName],
        isEditable: [false],
        isNew: [false]
      });
    } else {
      return this.fb.group({
        WarehouseId: 0,
        WarehouseName: [''],
        ContactPerson: [''],
        Phone: [''],
        Email: [''],
        Fax: [''],
        Website: [''],
        WarehouseType: [''],
        WarehouseTypeName: [''],
        isEditable: [true],
        isNew: [true]
      });
    }

  }



  addRow(row) {
    if (row) {
      const control = this.userTable.get('tableRows') as FormArray;
      control.push(this.initiateForm(row));
    }
  }

  addNewRow() {
    const control = this.userTable.get('tableRows') as FormArray;
    console.log(control);
    control.controls.unshift(this.initiateForm());
  }

  addNewWarehouse(group) {
    group.get('isEditable').setValue(true);
    this.warehouseEndpoint._newWarehouse(group.value).subscribe(
      (success) => {
        console.log('Create Success!', success)
        this.getWarehouseList()
        this.sweetAlertService.showSuccessMessage('Successfully added warehouse！')
        group.get('isNew').setValue(false)
        group.get('isEditable').setValue(false);
      },
      (error) => {
        this.sweetAlertService.showSweetAlert('Sorry, create failed！')
        console.log(error)
      })
  }

  deleteWarehouse(warehouseId: any) {
    if (window.confirm('Sure to delete this warehouse？')) {
      this.warehouseEndpoint._deleteWarehouse(warehouseId).subscribe(
        (success) => {
          this.getWarehouseList()
          this.sweetAlertService.showSuccessMessage('Warehouse deleted')
        },
        (error) => {
          console.log(error)
        }
      )
    }
  }


  editWarehouse(group: FormGroup) {
    group.get('isEditable').setValue(true);
  }


  updateWarehouse(group: FormGroup) {

    let warehouseTypeName
    switch (group.value['WarehouseType']) {
      case 1:
        warehouseTypeName = '中国'
        break
      case 2:
        warehouseTypeName = '新西兰'
        break
    }

    let newWarehouseDetail = {
      warehouseName: group.value['WarehouseName'],
      contactPerson: group.value['ContactPerson'],
      phone: group.value['Phone'],
      email: group.value['Email'],
      fax: group.value['Fax'],
      website: group.value['Website'],
      warehouseTypeName: warehouseTypeName,
      warehouseTypeId: group.value['WarehouseType'],
      isActive: 1,     
    }
    console.log(group)
    console.log(group.value['WarehouseType']);
    console.log(newWarehouseDetail);

    group.get('isEditable').setValue(false);

    this.warehouseEndpoint._updateWarehouse(newWarehouseDetail, group.value.WarehouseId).subscribe(
      (success) => {
        this.getWarehouseList()
        console.log('Create Success!', success)
        this.sweetAlertService.showSuccessMessage('Successfully updated warehouse！')
      },
      (error) => {
        this.sweetAlertService.showSweetAlert('Sorry, update failed！')
        console.log(error)
      })
  }

  saveUserDetails() {
    console.log(this.userTable.value);
  }

  get getFormControls() {
    const control = this.userTable.get('tableRows') as FormArray;
    // console.log(control);
    // console.log(control.controls);
    return control;
  }

  submitForm() {
    const control = this.userTable.get('tableRows') as FormArray;
    console.log(control);
    this.touchedRows = control.controls.filter(row => row.touched).map(row => row.value);
    console.log(this.touchedRows);
  }

  toggleTheme() {
    this.mode = !this.mode;
  }


  // onSubmit(group: FormGroup) {
  //   this.doneRow(group);
  //   let warehouseTypeName
  //   switch (group.value['WarehouseType']) {
  //     case 1:
  //       warehouseTypeName = '中国'
  //       break
  //     case 2:
  //       warehouseTypeName = '新西兰'
  //       break
  //   }
  //   this.newWarehouseDetail = {
  //     warehouseName: group.value['WarehouseName'],
  //     contactPerson: group.value['ContactPerson'],
  //     phone: group.value['Phone'],
  //     email: group.value['Email'],
  //     fax: group.value['Fax'],
  //     website: group.value['Website'],
  //     warehouseTypeName: warehouseTypeName,
  //     warehouseTypeId: group.value['WarehouseType'],
  //     isActive: 1,
  //   }
  //   // if (this.isNew == false) {
  //   //   console.log('表单', group)
  //   //   console.log('更新后信息', this.newWarehouseDetail)
  //   //   this.warehouseEndpoint._updateWarehouse(this.newWarehouseDetail, this.warehouse['WarehouseId']).subscribe(
  //   //     (success) => {
  //   //       console.log('Update Success!', success)
  //   //       this.sweetAlertService.showSuccessMessage('update completed！')
  //   //       this.dialogref.close(this.isSuccess)
  //   //     },
  //   //     (error) => {
  //   //       this.sweetAlertService.showSweetAlert('Sorry, update failed！')
  //   //       console.log(error)
  //   //     }
  //   //   )
  //   // } else {
  //   this.warehouseEndpoint._newWarehouse(this.newWarehouseDetail).subscribe(
  //     (success) => {
  //       console.log('Create Success!', success)
  //       this.sweetAlertService.showSuccessMessage('Successfully created warehouse！')
  //       this.dialogref.close(this.isSuccess)
  //     },
  //     (error) => {
  //       this.sweetAlertService.showSweetAlert('Sorry, create failed！')
  //       console.log(error)
  //     }
  //   )
  //   // }
  // }
}

