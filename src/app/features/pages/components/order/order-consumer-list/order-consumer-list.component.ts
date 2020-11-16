import { Component, OnInit, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { ClientEndpoint } from '../../../services/endpoints/client.endpoint'
import { OrderEndpoint } from '../../../services/endpoints/order.endpoint'
import { ClientDetailEditComponent } from '../../client/client-detail-edit/client-detail-edit.component'
import { TableDataModel } from './list-model'
import { ProductDetailEditComponent } from '../../product/product-detail-edit/product-detail-edit.component'
import { ProductEndpoint } from '../../../services/endpoints/product.endpoint'

@Component({
  selector: 'app-order-consumer-list',
  templateUrl: './order-consumer-list.component.html',
  styleUrls: ['./order-consumer-list.component.css'],
})
export class OrderConsumerListComponent implements OnInit {
  // @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator
  isInit = true
  // displayedColumns: string[] = ['order', 'sender', 'recipient', 'product', 'dates', 'customer', 'Cin7InterCode', 'payment']
  // dataSource: MatTableDataSource<TableDataModel>
  // Different Abnormal order numbers
  productAbnormalNumber = 0
  customerAbnormalNumber = 0
  TotalAbnormalNumber = 0
  formGroupProductAbnormalTable: FormGroup
  formGroupCustomerAbnormalTable: FormGroup
  isNormal = true
  isAbnormalDisplay: string
  isProductDisplay: string
  isCustomerDisplay: string
  isProductSubmit = false
  isCustomerSubmit = false
  isNoData = false
  RetailOrderNormalModel: any[] = []
  ReturnedNormalModel: any[] = []
  RetailOrderAbnormalProductModel = []
  RetailOrderAbnormalCustomerModel = []
  RetailOrderAbnormalProduct: any[] = []
  RetailOrderAbnormalCustomer: any[] = []
  NormalTableContent: TableDataModel[] = []
  AbnormalTableContent: TableDataModel[] = []
  AbnormalProductTableContent: TableDataModel[] = []
  AbnormalCustomerTableContent: TableDataModel[] = []
  isShowFilterAndTable = false
  isSave = true
  filteredValue = ''
  ordersTableData: any
  // displayColumns = ['OrderNo', 'BillingDate', 'EnterDate', 'customer', 'product', 'payment', 'warehouse', 'Status', 'Comment1']
  tableColumnsAllSelected = false
  tableColumnDisplaySelection = new FormControl([
    'OrderNo',
    'BillingDate',
    'EnterDate',
    'customer',
    'product',
    'payment',
    'warehouse',
    'Status',
    'Comment1',
    'action',
  ])
  availableColumns = [
    { value: 'OrderNo', name: 'Order Number' },
    { value: 'Reference', name: 'Order Reference' },
    { value: 'Cin7InvoiceNo', name: 'Cin7 Invoice No' },
    { value: 'sender', name: 'Sender' },
    { value: 'recipient', name: 'Recipient' },
    { value: 'EnterDate', name: 'Entry Date' },
    { value: 'BillingDate', name: 'Financial date' },
    { value: 'customer', name: 'Client' },
    { value: 'product', name: 'Product' },
    { value: 'payment', name: 'Payment Info' },
    { value: 'warehouse', name: 'Warehouse Info' },
    { value: 'Status', name: 'Order Status' },
    { value: 'Cin7InterCode', name: 'Cin7 Inter Code' },
    { value: 'Comment1', name: 'Comment' },
    { value: 'action', name: 'Action' },
  ]
  getCategory1: any
  getCategory2: any
  getCategory3: any
  getPlaceOfOrigin: any
  getSupplier: any
  getProductType: any

  constructor(
    public dialog: MatDialog,
    private sweetAlertService: SweetAlertService,
    private fb: FormBuilder,
    private orderEndpoint: OrderEndpoint,
    private clientEndpoint: ClientEndpoint,
    private productEndpoint: ProductEndpoint
  ) {}

  toggleAllColumnSelection(allSelectValue) {
    if (!allSelectValue) {
      this.tableColumnDisplaySelection.patchValue([...this.availableColumns.map((item) => item['value'])])
    } else {
      this.tableColumnDisplaySelection.patchValue([])
    }
  }

  ngOnInit() {
    this.getSelect()
    // this.orderEndpoint
    //   ._ordersConsumerList()
    //   .toPromise()
    //   .then((res: any) => {
    //     const data = []
    //     res.RetailOrderNomalModel.map((value) => {
    //       value.RetailOrderDto.ProductName = value.RetailOrderProductInfo.ProductName
    //       data.push(value.RetailOrderDto)
    //     })
    //     this.ordersTableData = data
    //   })
  }

  openProductDialog() {
    this.dialog.open(ProductDetailEditComponent, {
      width: '100%',
      data: {
        category1: this.getCategory1,
        category2: this.getCategory2,
        category3: this.getCategory3,
        placeOfOrigin: this.getPlaceOfOrigin,
        supplier: this.getSupplier,
        productType: this.getProductType,
        boolean: false,
        type: 'detail',
      },
    })
  }

  getSelect() {
    this.productEndpoint._getCategory1().subscribe((response) => {
      this.getCategory1 = response
    })
    this.productEndpoint._getCategory2().subscribe((response) => {
      this.getCategory2 = response
    })
    this.productEndpoint._getCategory3().subscribe((response) => {
      this.getCategory3 = response
    })
    this.productEndpoint._getPlaceOfOrigin().subscribe((response) => {
      this.getPlaceOfOrigin = response
    })
    this.productEndpoint._getSupplier().subscribe((response) => {
      this.getSupplier = response
    })
    this.getProductType = this.productEndpoint.appConfigStore.appSettings.Mapping.ProductType
  }

  openClientDialog() {
    this.clientEndpoint._GetAllAddress().subscribe((res) => {
      this.dialog.open(ClientDetailEditComponent, {
        width: '1250px',
        data: {
          addressData: res,
          client: null,
        },
      })
    })
  }

  getFilteredValue(value: any) {
    this.filteredValue = value
    // if (this.dataSource) {
    //   this.dataSource.filter = value
    // }
  }

  // 重设所有variables
  private reset() {
    this.productAbnormalNumber = 0
    this.customerAbnormalNumber = 0
    this.TotalAbnormalNumber = 0
    this.isNormal = true
    this.isProductSubmit = false
    this.isCustomerSubmit = false
    this.isNoData = false
    this.RetailOrderNormalModel = []
    this.ReturnedNormalModel = []
    this.RetailOrderAbnormalProductModel = []
    this.RetailOrderAbnormalCustomerModel = []
    this.RetailOrderAbnormalProduct = []
    this.RetailOrderAbnormalCustomer = []
    this.NormalTableContent = []
    this.AbnormalTableContent = []
    this.AbnormalProductTableContent = []
    this.AbnormalCustomerTableContent = []
  }

  public async getData() {
    this.isInit = false
    this.isShowFilterAndTable = true
    this.reset()
    this.formGroupProductAbnormalTable = this.fb.group({
      tableRows: this.fb.array([]),
    })
    this.formGroupCustomerAbnormalTable = this.fb.group({
      tableRows: this.fb.array([]),
    })
    this.orderEndpoint._ordersConsumerList().subscribe(
      (res: any) => {
        this.RetailOrderNormalModel = res.RetailOrderNomalModel
        this.RetailOrderAbnormalProductModel = res.RetailOrderAbnomalModel.RetailOrderProductAbnormalInfos
        this.RetailOrderAbnormalCustomerModel = res.RetailOrderAbnomalModel.RetailOrderCustomerAbnormalInfos
        this.RetailOrderAbnormalProduct = res.RetailOrderAbnomalModel.RetailOrderProductAbnomalModels
        this.RetailOrderAbnormalCustomer = res.RetailOrderAbnomalModel.RetailOrderCustomerAbnomalModels
        if (!this.RetailOrderNormalModel.length && !this.RetailOrderAbnormalProductModel.length && !this.RetailOrderAbnormalCustomerModel.length) {
          this.isNoData = true
          this.isSave = true
        } else if (
          this.RetailOrderNormalModel.length
          // &&
          // !this.RetailOrderAbnormalProductModel.length &&
          // !this.RetailOrderAbnormalCustomerModel.length
        ) {
          this.isSave = false
          this.RetailOrderNormalModel.map((value) => {
            this.ReturnedNormalModel.push(value.RetailOrderDto)
          })
        }
        this.initAbnormal()
        this.TotalAbnormalNumber = this.productAbnormalNumber + this.customerAbnormalNumber
        if (this.customerAbnormalNumber === 0) {
          this.isCustomerSubmit = true
        }
        if (this.productAbnormalNumber === 0) {
          this.isProductSubmit = true
        }
        const data = []
        this.RetailOrderNormalModel.map((value) => {
          value.RetailOrderDto.ProductName = value.RetailOrderProductInfo.ProductName
          data.push(value.RetailOrderDto)
        })
        this.NormalTableContent = data
        this.ordersTableData = this.NormalTableContent
        this.AbnormalCustomerTableContent = this.RetailOrderAbnormalCustomerModel
        this.AbnormalProductTableContent = this.RetailOrderAbnormalProductModel
        // this.setTableContent()
        // this.dataSource = new MatTableDataSource<TableDataModel>(this.NormalTableContent)
        // setTimeout(() => {
        //   this.dataSource.paginator = this.paginator
        //   if (this.paginator) {
        //     this.paginator.firstPage()
        //   }
        // })
        this.isNormal = true
        this.isAbnormalDisplay = 'none'
        // this.dataSource.filterPredicate = this.createFilter()
        this.isInit = true
      },
      (_) => (this.isInit = true)
    )
  }

  async saveData() {
    const saveAlert = await this.sweetAlertService.saveAlert()
    if (!saveAlert.value) {
      return
    }
    this.orderEndpoint._ordersConsumerListPutNormalisation(this.ReturnedNormalModel).subscribe(
      (_) => {
        this.sweetAlertService.showSuccessMessage('Save Successfully！')
        this.getData()
      },
      (_) => {}
    )
  }

  // createFilter(): (data: any, filter: string) => boolean {
  //   return (data: any, filter: any): boolean => {
  //     const searchTerms = JSON.parse(filter)
  //     return (
  //       (searchTerms.uploadTextArray.length ? searchTerms.uploadTextArray.includes(data.order.OrderNo) : true) &&
  //       (searchTerms.orderProjectNameSelected ? data.order.ProjectIdNo === searchTerms.orderProjectNameSelected : true) &&
  //       data.product.ProductId.toString().toLowerCase().indexOf(searchTerms.orderProductIdSelected) !== -1 &&
  //       data.customer.CustomerId.toString().toLowerCase().indexOf(searchTerms.orderCustomerIdSelected) !== -1 &&
  //       // (data.position.toString().toLowerCase().indexOf(searchTerms.searchString) !== -1 ||
  //       (data.order.Concat.toString().toLowerCase().indexOf(searchTerms.searchString) !== -1 ||
  //         data.sender.Concat.toString().toLowerCase().indexOf(searchTerms.searchString) !== -1 ||
  //         data.recipient.Concat.toString().toLowerCase().indexOf(searchTerms.searchString) !== -1 ||
  //         data.product.Concat.toString().toLowerCase().indexOf(searchTerms.searchString) !== -1 ||
  //         data.customer.Concat.toString().toLowerCase().indexOf(searchTerms.searchString) !== -1 ||
  //         data.Cin7InterCode.toString().toLowerCase().indexOf(searchTerms.searchString) !== -1)
  //     )
  //   }
  // }

  // Fill in the content of the table
  // setTableContent() {
  //   this.RetailOrderNormalModel.map((value: any, key: number) => {
  //     // const positionNumber = key + 1
  //     const OrderDto = value.RetailOrderDto
  //     let ProjectName = ''
  //     switch (OrderDto.ProjectId) {
  //       case 1:
  //         ProjectName = '电子单'
  //         break
  //       case 2:
  //         ProjectName = '纸单'
  //         break
  //       default:
  //         break
  //     }
  //     this.NormalTableContent.push({
  //       // position: positionNumber,
  //       order: {
  //         OrderNo: OrderDto.OrderNo,
  //         Reference: OrderDto.Reference,
  //         ProjectId: ProjectName,
  //         ProjectIdNo: OrderDto.ProjectId,
  //         Concat: OrderDto.OrderNo + OrderDto.Reference + ProjectName,
  //       },
  //       sender: {
  //         Sender: OrderDto.Sender,
  //         SenderAddr: OrderDto.SenderAddr,
  //         SenderPhone: OrderDto.SenderPhone,
  //         Concat: OrderDto.Sender + OrderDto.SenderAddr + OrderDto.SenderPhone,
  //       },
  //       recipient: {
  //         Recipient: OrderDto.Recipient,
  //         RecipientAddr: OrderDto.RecipientAddr,
  //         RecipientPhone: OrderDto.RecipientPhone,
  //         RecipientIdno: OrderDto.RecipientIdno,
  //         Concat: OrderDto.Recipient + OrderDto.RecipientAddr + OrderDto.RecipientPhone + OrderDto.RecipientIdno,
  //       },
  //       product: {
  //         ProductId: OrderDto.ProductId,
  //         ProductString: OrderDto.ProductString,
  //         ProductCode: OrderDto.ProductCode,
  //         Uom: OrderDto.Uom,
  //         Concat: OrderDto.ProductString + OrderDto.ProductCode + OrderDto.Uom,
  //       },
  //       dates: {
  //         EnterDate: OrderDto.EnterDate,
  //         BillingDate: OrderDto.BillingDate,
  //         Concat: OrderDto.EnterDate + OrderDto.BillingDate,
  //       },
  //       customer: {
  //         CustomerId: value.RetailOrderCustomerInfo ? value.RetailOrderCustomerInfo.CustomerId : 0,
  //         CustomerString: OrderDto.CustomerString,
  //         LastName: OrderDto.LastName,
  //         FirstName: OrderDto.FirstName,
  //         Reference: value.RetailOrderCustomerInfo ? value.RetailOrderCustomerInfo.Reference : '',
  //         Concat: value.RetailOrderCustomerInfo
  //           ? OrderDto.CustomerString + OrderDto.LastName + OrderDto.FirstName + value.RetailOrderCustomerInfo.Reference
  //           : OrderDto.CustomerString + OrderDto.LastName + OrderDto.FirstName,
  //       },
  //       Cin7InterCode: OrderDto.Cin7InterCode ? OrderDto.Cin7InterCode : '',
  //       payment: {
  //         Nzd: OrderDto.Nzd,
  //         UnitPrice: Number.parseFloat(OrderDto.UnitPrice).toFixed(5),
  //         TotalPrice: OrderDto.TotalPrice,
  //         OrderPrice: OrderDto.OrderPrice,
  //       },
  //     })
  //   })
  //   this.RetailOrderAbnormalProductModel.map((value: any, key: number) => {
  //     // const positionNumber = key + 1
  //     let ProjectName = ''
  //     switch (value.ProjectId) {
  //       case 1:
  //         ProjectName = '电子单'
  //         break
  //       case 2:
  //         ProjectName = '纸单'
  //         break
  //       default:
  //         break
  //     }
  //     this.AbnormalProductTableContent.push({
  //       // position: positionNumber,
  //       order: {
  //         OrderNo: value.OrderNo,
  //         Reference: value.Reference,
  //         ProjectId: ProjectName,
  //         ProjectIdNo: value.ProjectId,
  //         Concat: value.OrderNo + value.Reference + ProjectName,
  //       },
  //       sender: {
  //         Sender: value.Sender,
  //         SenderAddr: value.SenderAddr,
  //         SenderPhone: value.SenderPhone,
  //         Concat: value.Sender + value.SenderAddr + value.SenderPhone,
  //       },
  //       recipient: {
  //         Recipient: value.Recipient,
  //         RecipientAddr: value.RecipientAddr,
  //         RecipientPhone: value.RecipientPhone,
  //         RecipientIdno: value.RecipientIdno,
  //         Concat: value.Recipient + value.RecipientAddr + value.RecipientPhone + value.RecipientIdno,
  //       },
  //       product: {
  //         ProductString: value.ProductString,
  //         ProductCode: value.ProductCode,
  //         Uom: value.Uom,
  //         Concat: value.ProductString + value.ProductCode + value.Uom,
  //       },
  //       dates: {
  //         EnterDate: value.EnterDate,
  //         BillingDate: value.BillingDate,
  //         Concat: value.EnterDate + value.BillingDate,
  //       },
  //       customer: {
  //         CustomerString: value.CustomerString,
  //         LastName: value.LastName,
  //         FirstName: value.FirstName,
  //         Concat: value.CustomerString + value.LastName + value.FirstName,
  //       },
  //       Cin7InterCode: value.Cin7InterCode ? value.Cin7InterCode : '',
  //       payment: {
  //         Nzd: value.Nzd,
  //         UnitPrice: value.UnitPrice,
  //         TotalPrice: value.TotalPrice,
  //         OrderPrice: value.OrderPrice,
  //       },
  //     })
  //   })
  //   this.RetailOrderAbnormalCustomerModel.map((value: any, key: number) => {
  //     // const positionNumber = key + 1
  //     let ProjectName = ''
  //     switch (value.ProjectId) {
  //       case 1:
  //         ProjectName = '电子单'
  //         break
  //       case 2:
  //         ProjectName = '纸单'
  //         break
  //       default:
  //         break
  //     }
  //     this.AbnormalCustomerTableContent.push({
  //       // position: positionNumber,
  //       order: {
  //         OrderNo: value.OrderNo,
  //         Reference: value.Reference,
  //         ProjectId: ProjectName,
  //         ProjectIdNo: value.ProjectId,
  //         Concat: value.OrderNo + value.Reference + ProjectName,
  //       },
  //       sender: {
  //         Sender: value.Sender,
  //         SenderAddr: value.SenderAddr,
  //         SenderPhone: value.SenderPhone,
  //         Concat: value.Sender + value.SenderAddr + value.SenderPhone,
  //       },
  //       recipient: {
  //         Recipient: value.Recipient,
  //         RecipientAddr: value.RecipientAddr,
  //         RecipientPhone: value.RecipientPhone,
  //         RecipientIdno: value.RecipientIdno,
  //         Concat: value.Recipient + value.RecipientAddr + value.RecipientPhone + value.RecipientIdno,
  //       },
  //       product: {
  //         ProductString: value.ProductString,
  //         ProductCode: value.ProductCode,
  //         Uom: value.Uom,
  //         Concat: value.ProductString + value.ProductCode + value.Uom,
  //       },
  //       dates: {
  //         EnterDate: value.EnterDate,
  //         BillingDate: value.BillingDate,
  //         Concat: value.EnterDate + value.BillingDate,
  //       },
  //       customer: {
  //         CustomerString: value.CustomerString,
  //         LastName: value.LastName,
  //         FirstName: value.FirstName,
  //         Concat: value.CustomerString + value.LastName + value.FirstName,
  //       },
  //       Cin7InterCode: value.Cin7InterCode ? value.Cin7InterCode : '',
  //       payment: {
  //         Nzd: value.Nzd,
  //         UnitPrice: value.UnitPrice,
  //         TotalPrice: value.TotalPrice,
  //         OrderPrice: value.OrderPrice,
  //       },
  //     })
  //   })
  // }

  // Change the Table content to Normal data
  setNormalTableContent() {
    this.isProductDisplay = 'none'
    this.isCustomerDisplay = 'none'
    this.isShowFilterAndTable = false
    // if (this.isNormal) {
    //   return
    // }
    // this.dataSource = new MatTableDataSource<TableDataModel>(this.NormalTableContent)
    this.ordersTableData = this.NormalTableContent
    setTimeout(() => {
      // this.dataSource.paginator = this.paginator
      // if (this.paginator) {
      //   this.paginator.firstPage()
      // }
      this.isShowFilterAndTable = true
    })
    // this.dataSource.filterPredicate = this.createFilter()
    this.isNormal = !this.isNormal
    this.isAbnormalDisplay = 'none'
  }

  // Change the Table content to Abnormal Product data
  setAbnormalProductTableContent() {
    this.isProductDisplay = 'block'
    this.isCustomerDisplay = 'none'
    this.isShowFilterAndTable = false
    this.ordersTableData = this.AbnormalProductTableContent
    // this.dataSource = new MatTableDataSource<TableDataModel>(this.AbnormalProductTableContent)
    setTimeout(() => {
      // this.dataSource.paginator = this.paginator
      // if (this.paginator) {
      //   this.paginator.firstPage()
      // }
      this.isShowFilterAndTable = true
    })
    // this.dataSource.filterPredicate = this.createFilter()
    this.isNormal = !this.isNormal
    this.isAbnormalDisplay = 'block'
    // if (this.isNormal) {
    // } else {
    //   this.isShowFilterAndTable = true
    //   return
    // }
  }

  // Change the Table content to Abnormal Product data
  setAbnormalCustomerTableContent() {
    this.isProductDisplay = 'none'
    this.isCustomerDisplay = 'block'
    this.isShowFilterAndTable = false
    // if (!this.isNormal) {
    //   this.isShowFilterAndTable = true
    //   return
    // }
    this.ordersTableData = this.AbnormalCustomerTableContent
    // this.dataSource = new MatTableDataSource<TableDataModel>(this.AbnormalCustomerTableContent)
    setTimeout(() => {
      // this.dataSource.paginator = this.paginator
      // if (this.paginator) {
      //   this.paginator.firstPage()
      // }
      this.isShowFilterAndTable = true
    })
    // this.dataSource.filterPredicate = this.createFilter()
    this.isNormal = !this.isNormal
    this.isAbnormalDisplay = 'block'
  }

  // Initialise the details of abnormal table
  initAbnormal() {
    const controlProduct = this.formGroupProductAbnormalTable.get('tableRows') as FormArray
    const controlCustomer = this.formGroupCustomerAbnormalTable.get('tableRows') as FormArray
    this.RetailOrderAbnormalProduct.map((value: any, key: number) => {
      this.productAbnormalNumber += value.Count
      const positionNumber = key + 1
      // 往Product Abnormal table Form里面增加内容
      controlProduct.push(this.initiateProductAbnormalForm(positionNumber, value.ProductString, value.ProductCode, value.Count, -1))
    })
    this.RetailOrderAbnormalCustomer.map((value: any, key: number) => {
      this.customerAbnormalNumber += value.Count
      const positionNumber = key + 1
      // 往Customer Abnormal table Form里面增加内容
      controlCustomer.push(this.initiateCustomerAbnormalForm(positionNumber, value.CustomerString, value.Count, -1))
    })
  }

  initiateProductAbnormalForm(positionNumber: number, ProductString: string, ProductCode: string, Count: number, ProductId: number): FormGroup {
    return this.fb.group({
      position: [positionNumber],
      ProductString: [ProductString],
      ProductCode: [ProductCode],
      Count: [Count],
      ProductId: [ProductId],
    })
  }

  initiateCustomerAbnormalForm(positionNumber: number, CustomerString: string, Count: number, CustomerId: number): FormGroup {
    return this.fb.group({
      position: [positionNumber],
      CustomerString: [CustomerString],
      Count: [Count],
      CustomerId: [CustomerId],
    })
  }

  get getProductAbnormalFormControls() {
    return this.formGroupProductAbnormalTable.get('tableRows') as FormArray
  }

  get getCustomerAbnormalFormControls() {
    return this.formGroupCustomerAbnormalTable.get('tableRows') as FormArray
  }

  async submitProductAbnormalForm() {
    const saveAlert = await this.sweetAlertService.saveAlert()
    if (!saveAlert.value) {
      return
    }
    const arrayProductAbnormalForm = this.getProductAbnormalFormControls.controls.filter((row) => row.touched).map((row) => row.value)
    const postProductData: any[] = []
    arrayProductAbnormalForm.map((value) => {
      if (value && value.ProductId) {
        postProductData.push({
          nameString: value.ProductString,
          productId: value.ProductId,
        })
      }
    })
    if (!postProductData.length) {
      this.sweetAlertService.showSweetAlert('No Products need to be corrected.')
    } else {
      this.orderEndpoint._ordersConsumerListPostProduct(postProductData).subscribe(
        (res) => {
          this.isProductSubmit = true
          this.productAbnormalNumber = 0
          this.getProductAbnormalFormControls.clear()
          if (this.isCustomerSubmit) {
            this.sweetAlertService.showSuccessMessage('Please re-extract  data and then save, thank you!')
          } else {
            this.sweetAlertService.showSuccessMessage('Products modified successfully!')
          }
          this.getData()
        },
        (err) => {}
      )
    }
  }

  async submitCustomerAbnormalForm() {
    const saveAlert = await this.sweetAlertService.saveAlert()
    if (!saveAlert.value) {
      return
    }
    const arrayCustomerAbnormalForm = this.getCustomerAbnormalFormControls.controls.filter((row) => row.touched).map((row) => row.value)
    const postCustomerData: any[] = []
    arrayCustomerAbnormalForm.map((value) => {
      if (value && value.CustomerId) {
        postCustomerData.push({
          nameString: value.CustomerString,
          customerId: value.CustomerId,
        })
      }
    })
    if (!postCustomerData.length) {
      this.sweetAlertService.showSweetAlert('No Customers need to be corrected.')
    } else {
      this.orderEndpoint._ordersConsumerListPostCustomer(postCustomerData).subscribe(
        (res) => {
          this.isCustomerSubmit = true
          this.customerAbnormalNumber = 0
          this.getCustomerAbnormalFormControls.clear()
          if (this.isProductSubmit) {
            this.sweetAlertService.showSuccessMessage('Please re-extract data and then save, thank you!')
          } else {
            this.sweetAlertService.showSuccessMessage('Customers modified successfully！')
          }
          this.getData()
        },
        (err) => {}
      )
    }
  }
}
