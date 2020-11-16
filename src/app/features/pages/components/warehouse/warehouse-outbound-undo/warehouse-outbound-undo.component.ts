import { Component, OnInit, ViewChild } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { OrderEndpoint } from '../../../services/endpoints/order.endpoint'
import { WarehouseEndpoint } from '../../../services/endpoints/warehouse.endpoint'

@Component({
  selector: 'app-warehouse-outbound-undo',
  templateUrl: './warehouse-outbound-undo.component.html',
  styleUrls: ['./warehouse-outbound-undo.component.css'],
})
export class WarehouseOutboundUndoComponent implements OnInit {
  sigleOrderNoFormControl = new FormControl('')
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator
  orderNoArrary: any[] = []
  displayedColumns: string[] = ['position', 'order', 'sender', 'recipient', 'product', 'dates', 'customer', 'Cin7InterCode', 'payment', 'undo']
  dataSource = new MatTableDataSource()
  NormalTableContent: any[] = []
  ResponseNormalTableContent: any[] = []
  containerArray = []

  constructor(private sweetAlertService: SweetAlertService, private warehouseEndpoint: WarehouseEndpoint, private orderService: OrderEndpoint) {}

  ngOnInit(): void {}

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
          (searchTerms.orderProductIdSelected ? data.product.ProductId === searchTerms.orderProductIdSelected : true) &&
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

  outboundPOST(data: string[]) {
    this.orderService._orderSearchByOrderArray(data).subscribe(
      (res: any) => {
        setTimeout(() => {
          // 过滤出订单号状态是出库的订单
          const newRes = res.filter((order) => order.Status === 8)
          if (!newRes.length) {
            this.sweetAlertService.successAlert('No data！')
            return
          }
          data.map((orderNo) => this.containerArray.push(orderNo))
          newRes.map((value) => this.ResponseNormalTableContent.push(value))
          const temp = this.setNormalTableContent()
          this.dataSource = new MatTableDataSource(temp)
          this.dataSource.paginator = this.paginator
          this.dataSource.filterPredicate = this.createFilter()
        })
      },
      (err) => {}
    )
  }

  setNormalTableContent() {
    this.NormalTableContent = []
    this.ResponseNormalTableContent.map((value, index) => {
      this.NormalTableContent.push({
        position: index + 1,
        order: {
          OrderNo: value.OrderNo,
          Reference: value.Reference,
          Concat: value.OrderNo + value.Reference,
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
          CustomerString: value.CustomerString,
          LastName: value.LastName,
          FirstName: value.FirstName,
          Concat: value.CustomerString + value.LastName + value.FirstName,
        },
        Cin7InterCode: value.Cin7InterCode ? value.Cin7InterCode : '',
        payment: {
          Nzd: value.Nzd,
          UnitPrice: value.UnitPrice,
          TotalPrice: value.TotalPrice,
          OrderPrice: value.OrderPrice,
        },
        undo: {
          comment: '',
          OrderNo: value.OrderNo,
        },
      })
    })
    return this.NormalTableContent
  }

  async undoPUT(orderNumber, undoComment) {
    if (!undoComment) {
      this.sweetAlertService.showSweetAlert('Type comment first！')
      return
    }
    const saveAlert = await this.sweetAlertService.saveAlert('Confrimation: ' + orderNumber + ' ？')
    if (!saveAlert.value) {
      return
    }
    this.warehouseEndpoint
      ._outboundUndoPUT({
        orderNo: orderNumber,
        comment: undoComment,
      })
      .subscribe((sus) => {
        this.sweetAlertService.successAlert2('Undo successfully！')
        this.deleteRow(orderNumber)
      })
  }

  deleteRow(orderNumber) {
    this.containerArray = this.containerArray.filter((orderNo) => orderNo !== orderNumber)
    this.NormalTableContent = this.NormalTableContent.filter((value) => value.order.OrderNo !== orderNumber)
    this.ResponseNormalTableContent = this.ResponseNormalTableContent.filter((order) => order.OrderNo !== orderNumber)
    this.dataSource = new MatTableDataSource(this.NormalTableContent)
    this.dataSource.paginator = this.paginator
    this.dataSource.filterPredicate = this.createFilter()
  }

  addSingleOrderNo() {
    if (this.sigleOrderNoFormControl.value) {
      if (this.containerArray.includes(this.sigleOrderNoFormControl.value)) {
        this.sweetAlertService.showSweetAlert(this.sigleOrderNoFormControl.value + ' exists！')
      } else {
        this.outboundPOST([this.sigleOrderNoFormControl.value])
        this.sigleOrderNoFormControl.setValue('')
      }
    } else {
      this.sweetAlertService.showSweetAlert('Type in order no first！')
    }
  }

  uploadTextToArrayOrder(value: any) {
    if (value.length) {
      this.sweetAlertService.successAlert2('upload successfully！')
      let isValidFile = true
      value.map((res) => {
        if (this.containerArray.includes(res)) {
          this.sweetAlertService.showSweetAlert('order ' + res + ' is founded！')
          isValidFile = false
        }
      })
      if (!isValidFile) {
        return
      }
      value.map((res) => {
        this.orderNoArrary.push(res)
      })
      this.outboundPOST(this.orderNoArrary)
    }
  }
}
