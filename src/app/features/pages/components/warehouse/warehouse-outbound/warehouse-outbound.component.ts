import { Component, OnInit, ViewChild } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { WarehouseEndpoint } from '../../../services/endpoints/warehouse.endpoint'

@Component({
  selector: 'app-warehouse-outbound',
  templateUrl: './warehouse-outbound.component.html',
  styleUrls: ['./warehouse-outbound.component.css'],
})
export class WarehouseOutboundComponent implements OnInit {
  sigleOrderNoFormControl = new FormControl('')
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator
  orderNoArrary: any[] = []
  outboundOrderNoArrary: string[] = []
  displayedColumns: string[] = ['position', 'order', 'sender', 'recipient', 'product', 'dates', 'customer', 'Cin7InterCode', 'payment']
  dataSource = new MatTableDataSource()
  NormalTableContent: any[] = []
  ResponseNormalTableContent: any[] = []
  ResponseAbnormalTableContent: any[] = []
  warehouseSelected: any
  warehouseFormControl = new FormControl('')
  warehouseComment = ''
  warehouseDate: any
  PostErrorELEMENT_DATA = []
  PostError_DATA_ToTxt = []
  PutErrorELEMENT_DATA = []
  containerArray = []
  displayedColumnsPostError: string[] = ['position', 'error']
  displayedColumnsPutError: string[] = ['position', 'error']
  dataSourcePostError = this.PostErrorELEMENT_DATA
  dataSourcePutError = this.PutErrorELEMENT_DATA
  isNotSubmit = true
  isInit = false
  isShowUpload = true
  batchValue = ''
  batches = []

  constructor(private sweetAlertService: SweetAlertService, private warehouseEndpoint: WarehouseEndpoint) {}

  ngOnInit(): void {
    this.warehouseFormControl.valueChanges.subscribe((res) => {
      this.warehouseSelected = res
    })
    this.warehouseEndpoint
      ._outboundGET()
      .toPromise()
      .then((res: any) => {
        this.batches = res
        this.batches = this.batches.sort((a, b) => a.BatchNo - b.BatchNo)
      })
  }

  getFilteredValue(value: any) {
    if (this.dataSource) {
      this.dataSource.filter = value
    }
  }

  createFilter(): (data: any, filter: string) => boolean {
    return (data: any, filter: any): boolean => {
      if (data) {
        const searchTerms = JSON.parse(filter)
        return (
          (searchTerms.uploadTextArray.length ? searchTerms.uploadTextArray.includes(data.order.OrderNo) : true) &&
          (searchTerms.orderProjectNameSelected ? data.order.ProjectIdNo === searchTerms.orderProjectNameSelected : true) &&
          data.product.ProductId.toString().toLowerCase().indexOf(searchTerms.orderProductIdSelected) !== -1 &&
          (data.position.toString().toLowerCase().indexOf(searchTerms.searchString) !== -1 ||
            data.order.Concat.toString().toLowerCase().indexOf(searchTerms.searchString) !== -1 ||
            data.sender.Concat.toString().toLowerCase().indexOf(searchTerms.searchString) !== -1 ||
            data.recipient.Concat.toString().toLowerCase().indexOf(searchTerms.searchString) !== -1 ||
            data.product.Concat.toString().toLowerCase().indexOf(searchTerms.searchString) !== -1 ||
            data.customer.Concat.toString().toLowerCase().indexOf(searchTerms.searchString) !== -1 ||
            data.Cin7InterCode.toString().toLowerCase().indexOf(searchTerms.searchString) !== -1)
        )
      }
    }
  }

  reset() {
    this.isShowUpload = false
    setTimeout(() => (this.isShowUpload = true))
    this.containerArray = []
    this.orderNoArrary = []
    this.outboundOrderNoArrary = []
    this.dataSource = new MatTableDataSource()
    this.NormalTableContent = []
    this.ResponseNormalTableContent = []
    this.ResponseAbnormalTableContent = []
    this.warehouseSelected = null
    this.warehouseFormControl.setValue(null)
    this.warehouseComment = ''
    this.warehouseDate = ''
    this.PostErrorELEMENT_DATA = []
    this.PutErrorELEMENT_DATA = []
    this.PostError_DATA_ToTxt = []
    this.dataSourcePostError = this.PostErrorELEMENT_DATA
    this.dataSourcePutError = this.PutErrorELEMENT_DATA
    this.isNotSubmit = true
    this.isInit = false
    // 之前需要批次，暂时隐藏
    this.batchValue = ''
    this.batches = []
    this.ngOnInit()
  }

  getUTCdate(dateString) {
    return new Date(dateString).toISOString().replace(/\..+/, '')
  }

  async outboundPUT() {
    const saveAlert = await this.sweetAlertService.saveAlert('Confirmation？')
    if (!saveAlert.value) {
      return
    }
    const orders = []
    this.NormalTableContent.map((value) => {
      orders.push(value.order.OrderNo)
    })
    const data = {
      // pickupOrderBatchId: this.batchValue,
      warehouseId: this.warehouseSelected,
      operatedAt: this.getUTCdate(this.warehouseDate),
      comment: this.warehouseComment,
      orderNos: orders,
    }
    // if (!data.warehouseId || !data.operatedAt || !data.pickupOrderBatchId) {
    // this.sweetAlertService.showSweetAlert('请选择仓库、日期和批次之后再提交！')
    if (!data.warehouseId || !data.operatedAt) {
      this.sweetAlertService.showSweetAlert('Please select warehouse and date before submitting！')
      return
    }
    this.warehouseEndpoint._outboundPUT(data).subscribe(
      (res: any) => {
        this.sweetAlertService.successAlert()
        this.dataSource = new MatTableDataSource<any>([])
        res.map((abValue: any) => {
          this.PutErrorELEMENT_DATA.push({
            position: this.PutErrorELEMENT_DATA.length + 1,
            error: abValue.Error,
          })
        })
        this.dataSourcePutError = this.PutErrorELEMENT_DATA
        this.isNotSubmit = false
      },
      (err) => {}
    )
  }

  outboundPOST(data: string[], isFormSingle) {
    this.warehouseEndpoint._outboundPOST(data).subscribe(
      (res: any) => {
        setTimeout(() => {
          this.isInit = true
          if (!this.ResponseNormalTableContent.length && !this.ResponseAbnormalTableContent.length) {
            this.ResponseNormalTableContent = res['RetailOrderPaperExpressNormalModels']
            this.ResponseAbnormalTableContent = res['RetailOrderPaperExpressAbNormalModels']
          } else {
            if (isFormSingle) {
              res['RetailOrderPaperExpressNormalModels'].map((value) => this.ResponseNormalTableContent.push(value))
              res['RetailOrderPaperExpressAbNormalModels'].map((value) => this.ResponseAbnormalTableContent.push(value))
            } else {
              this.ResponseNormalTableContent = []
              res['RetailOrderPaperExpressNormalModels'].map((value) => this.ResponseNormalTableContent.push(value))
              res['RetailOrderPaperExpressAbNormalModels'].map((value) => this.ResponseAbnormalTableContent.push(value))
            }
          }
          const temp = this.setNormalTableContent()
          this.dataSource = new MatTableDataSource(temp)
          this.dataSource.paginator = this.paginator
          this.dataSource.filterPredicate = this.createFilter()
          this.PostErrorELEMENT_DATA = []
          this.ResponseAbnormalTableContent.map((abValue: any) => {
            this.PostErrorELEMENT_DATA.push({
              position: this.PostErrorELEMENT_DATA.length + 1,
              error: abValue.Error,
            })
            this.PostError_DATA_ToTxt.push(abValue.Error.replace(/\s.*$/g, ''))
          })
          this.dataSourcePostError = this.PostErrorELEMENT_DATA
        })
      },
      (err) => {}
    )
  }

  setNormalTableContent() {
    this.NormalTableContent = []
    this.ResponseNormalTableContent.map((value, index) => {
      this.outboundOrderNoArrary.push(value.OrderNo)
      const positionNumber = index + 1
      let ProjectName = ''
      switch (value.ProjectId) {
        case 1:
          ProjectName = '电子单'
          break
        case 2:
          ProjectName = '纸单'
          break
        default:
          break
      }
      this.NormalTableContent.push({
        position: positionNumber,
        order: {
          OrderNo: value.OrderNo,
          Reference: value.Reference,
          ProjectIdNo: value.ProjectId,
          ProjectId: ProjectName,
          Concat: value.OrderNo + value.Reference + ProjectName,
        },
        sender: {
          Sender: value.Sender,
          SenderAddr: value.SenderAddr,
          SenderPhone: value.SenderPhone,
          Concat: value.Sender + value.SenderAddr + value.SenderPhone,
        },
        recipient: {
          Recipient: value.Recipient,
          RecipientAddr: value.RecipientAddr,
          RecipientPhone: value.RecipientPhone,
          RecipientIdno: value.RecipientIdno,
          Concat: value.Recipient + value.RecipientAddr + value.RecipientPhone + value.RecipientIdno,
        },
        product: {
          ProductId: value.ProductId,
          ProductString: value.ProductString,
          ProductCode: value.ProductCode,
          Uom: value.Uom,
          Concat: value.ProductString + value.ProductCode + value.Uom,
        },
        dates: {
          EnterDate: value.EnterDate,
          BillingDate: value.BillingDate,
          Concat: value.EnterDate + value.BillingDate,
        },
        customer: {
          CustomerId: value.RetailOrderCustomerInfo ? value.RetailOrderCustomerInfo.CustomerId : null,
          CustomerString: value.CustomerString,
          LastName: value.LastName,
          FirstName: value.FirstName,
          Reference: value.RetailOrderCustomerInfo ? value.RetailOrderCustomerInfo.Reference : '',
          Concat: value.RetailOrderCustomerInfo
            ? value.CustomerString + value.LastName + value.FirstName + value.RetailOrderCustomerInfo.Reference
            : value.CustomerString + value.LastName + value.FirstName,
        },
        Cin7InterCode: value.Cin7InterCode ? value.Cin7InterCode : '',
        payment: {
          Nzd: value.Nzd,
          UnitPrice: Number.parseFloat(value.UnitPrice).toFixed(5),
          TotalPrice: value.TotalPrice,
          OrderPrice: value.OrderPrice,
        },
      })
    })
    return this.NormalTableContent
  }

  addSingleOrderNo() {
    if (this.sigleOrderNoFormControl.value) {
      if (this.containerArray.includes(this.sigleOrderNoFormControl.value)) {
        this.sweetAlertService.showSweetAlert('Order ' + this.sigleOrderNoFormControl.value + ' is imported！')
      } else {
        this.outboundPOST([this.sigleOrderNoFormControl.value], true)
        this.containerArray.push(this.sigleOrderNoFormControl.value)
        this.sigleOrderNoFormControl.setValue('')
      }
    } else {
      this.sweetAlertService.showSweetAlert('Please enter order number first！')
    }
  }

  uploadTextToArrayOrder(value: any) {
    if (value.length) {
      this.sweetAlertService.successAlert2('Uploaded！')
      let isValidFile = true
      value.map((res) => {
        if (this.containerArray.includes(res)) {
          this.sweetAlertService.showSweetAlert('Order ' + res + ' is imported！')
          isValidFile = false
        }
      })
      if (!isValidFile) {
        return
      }
      value.map((res) => {
        this.containerArray.push(res)
        this.orderNoArrary.push(res)
      })
      this.outboundPOST(this.orderNoArrary, false)
    }
  }
}
