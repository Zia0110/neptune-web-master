import { Component, OnInit, ViewChild } from '@angular/core'
import { FormControl, FormGroup, FormBuilder } from '@angular/forms'
import { AppConfigStore } from '../../../../../../../app/core/services/app-config.store'
import { OrderEndpoint } from '../../../../../../features/pages/services/endpoints/order.endpoint'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'
import { MatTableDataSource } from '@angular/material/table'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { ImgPresentComponent } from '../../../../../../shared/common-components/img-present/img-present.component'
import { environment } from '../../../../../../../environments/environment'
import Swal from 'sweetalert2'
import { WarehouseEndpoint } from '../../../../services/endpoints/warehouse.endpoint'
import { Router } from '@angular/router'

@Component({
  selector: 'app-new-lost-event',
  templateUrl: './new-lost-event.component.html',
  styleUrls: ['./new-lost-event.component.css'],
})
export class NewLostEventComponent implements OnInit {
  public productsInfo: any[] = []
  public pickedWarehouseFormControl = new FormControl('')
  public pickedProductFormControl = new FormControl('')
  public lostQuantityFormControl = new FormControl('')
  public pickedWarehouseId: any
  public lostTypes: any
  public lostTypeDropDown: any[] = []
  public contentForm: FormGroup
  public pickedLostTypeId: string
  public pickedQuantity: number = -1
  public showNewProduct: boolean = false
  public currentUserId: string
  public pickedProductId: number = -1

  public lostPropertyModels: any[] = []
  public lostPropertyForTables: any[] = [] // put all info in and push this to the final array (for http request)
  public displayedColumns: string[] = ['产品名称', '产品数量', '图片', '删除']
  public dataSource: any
  public imageBaseUrl = environment.imageBaseUrl
  public pickedContent: string
  public dalOrNot: number

  public initTableData = [{}]
  @ViewChild('newProductTable') newProductTable

  public stockCustomerIdControl = new FormControl('')
  constructor(
    private appConfigStore: AppConfigStore,
    private fb: FormBuilder,
    private orderService: OrderEndpoint,
    private sweetAlert: SweetAlertService,
    public dialog: MatDialog,
    public warehouseService: WarehouseEndpoint,
    private dialogRef: MatDialogRef<NewLostEventComponent>,
    public router: Router
  ) {}

  ngOnInit(): void {
    if (this.router.url.includes('warehouse-dal-damage-lose')) this.dalOrNot = 1
    else this.dalOrNot = 2
    this.productsInfo = this.appConfigStore.appSettings['ProductInfo']['Products']
    this.lostTypes = this.appConfigStore.appSettings['Mapping']['LostType']
    this.currentUserId = this.appConfigStore.appSettings['UserInfo']['UserId']
    this.toLostTypeDropDown()
    this.contentForm = this.fb.group({
      content: [''],
    })
  }

  private toLostTypeDropDown(): void {
    for (let type of this.lostTypes) {
      this.lostTypeDropDown.push({
        view: type['LostTypeName'],
        value: type['LostType1'],
      })
    }
  }

  public getLostType(typeId): void {
    this.pickedLostTypeId = typeId
  }

  public confirmLostEvent(): void {
    // console.log(this.newProductTable.productsForms);
    // console.log(this.newProductTable.productsForms.value[0]['productId'].value);
    // console.log(this.newProductTable.productsForms.value[0]['productId']);
    console.log(this.stockCustomerIdControl.value)
    if (this.stockCustomerIdControl.value == '') {
      this.sweetAlert.showSweetAlert('Please select stock customer!')
    } else {
      let emptyProducts: boolean = this.checkEmptyProducts()
      if (emptyProducts) {
        this.sweetAlert.showSweetAlert('Please select product!')
      } else {
        let duplicateProducts: boolean = this.checkDuplicateProducts()
        if (duplicateProducts) {
          this.sweetAlert.showSweetAlert('Duplicate products found, please check!')
        } else {
          let emptyProductQuantity: boolean = this.checkEmptyProductQuantity()
          if (emptyProductQuantity) {
            this.sweetAlert.showSweetAlert('Please finish all products and quantities!')
          } else {
            this.pickedWarehouseId = this.pickedWarehouseFormControl.value
            this.pickedContent = this.contentForm.value['content']
            let result: boolean
            result = this.checkToCreateNewLostEvent()
            if (result) {
              Swal.fire({
                text: 'Comfirm to create local sale & lost?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '确定',
              }).then((result) => {
                if (result.value) {
                  let bodyForLostEvent = this.buildObjectForNewLostEvent()
                  // console.log(bodyForLostEvent)
                  this.warehouseService.createLostEvent(bodyForLostEvent, this.currentUserId).subscribe((value) => {
                    // console.log(value)
                    this.sweetAlert.showSuccessMessage('Local sale & lost created!')
                    this.dialogRef.close()
                  })
                }
              })
            } else {
              this.sweetAlert.showSweetAlert('Please fill all infomations!')
            }
          }
        }
      }
    }
  }

  public checkEmptyProductQuantity(): boolean {
    console.log(this.newProductTable.productsForms.value)
    for (let product of this.newProductTable.productsForms.value) {
      if (product['quantityOfProduct'].value == undefined) {
        return true
      }
    }
    return false
  }

  public checkEmptyProducts(): boolean {
    return typeof this.newProductTable.productsForms.value[0]['productId'] !== 'number'
  }

  public checkDuplicateProducts(): boolean {
    let productIdArray: any[] = []
    productIdArray = this.newProductTable.productsForms.value.map((product) => {
      return product['productId']
    })
    for (let id of productIdArray) {
      let temArray: number[] = []
      temArray = productIdArray.filter((product) => product == id)
      if (temArray.length > 1) {
        return true
      }
    }
    return false
  }

  public checkToCreateNewLostEvent(): boolean {
    return this.pickedWarehouseId != '' && this.pickedLostTypeId != '' && this.pickedContent != ''
  }

  public buildObjectForNewLostEvent(): any {
    let a_obj = {
      warehouseId: this.pickedWarehouseId,
      lostTypeId: this.pickedLostTypeId,
      comments: this.pickedContent,
      customerId: this.stockCustomerIdControl.value,
      lostPropertyModels: [],
    }
    // console.log(this.newProductTable.productsForms.value)
    for (let product of this.newProductTable.productsForms.value) {
      let a_lostPropertyModel = {
        qty: product['quantityOfProduct'].value,
        baseProductId: product['productId'],
        urls: product['imagesUrl'].value == undefined ? [] : product['imagesUrl'].value,
      }
      a_obj['lostPropertyModels'].push(a_lostPropertyModel)
    }
    return a_obj
  }

  public test(): void {
    // console.log(this.lostPropertyForTables);
    console.log(this.newProductTable.productsForms)
  }
}
/*
{
  "warehouseId": 0,
  "lostTypeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "comments": "string",
  "lostPropertyModels": [
    {
      "qty": 0,
      "productId": 0,
      "urls": [
        "string"
      ]
    }
  ]
}

*/
