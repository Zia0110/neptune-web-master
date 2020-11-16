import { Component, OnInit, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'
import { FormGroup, FormBuilder, FormControl } from '@angular/forms'
import { NewTicketImageComponent } from './new-ticket-image/new-ticket-image.component'
import { AppConfigStore } from '../../../../../../core/services/app-config.store'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'
import { OrderEndpoint } from '../../../../services/endpoints/order.endpoint'

@Component({
  selector: 'app-order-ticket-new-dialog',
  templateUrl: './order-ticket-new-dialog.component.html',
  styleUrls: ['./order-ticket-new-dialog.component.css'],
})
export class OrderTicketNewDialogComponent implements OnInit {
  public tickeTypes: any
  public ticketTypeDropDown: any[] = []
  public pickedTicketTypeId: number = -1
  public pickedTicketTypeName: string = '-1'
  public pickedUserId: number = -1
  public inputContent: string
  public contentForm: FormGroup
  public testT: any
  public imagesUrls: any
  public showOrderNoInput: boolean = false

  public orderNumberFromInput = new FormControl('')
  public orderIdFromInputOrderNumber: string
  public pickedOrderDetail: any // when user searches a valid order, show the order details
  public showValidOrder: boolean = false

  constructor(
    @Inject(MAT_DIALOG_DATA) public orderIdandNoForNewTicket: any,
    private appConfigStore: AppConfigStore,
    private fb: FormBuilder,
    private sweetAlert: SweetAlertService,
    public dialog: MatDialog,
    private orderService: OrderEndpoint,
    private dialogRef: MatDialogRef<OrderTicketNewDialogComponent>
  ) {}

  ngOnInit(): void {
    // console.log(this.orderId);
    console.log(this.orderIdandNoForNewTicket)
    this.showOrderNoInput = this.orderIdandNoForNewTicket == null ? true : false
    this.tickeTypes = this.appConfigStore.appSettings['Mapping']['TicketType']
    this.convertToTicketTypeDropDown()
    this.contentForm = this.fb.group({
      content: [''],
    })
  }

  private convertToTicketTypeDropDown(): void {
    for (let type of this.tickeTypes) {
      this.ticketTypeDropDown.push({
        view: type['TicketTypeName'],
        value: type['TicketTypeId'],
      })
    }
  }

  public getTicketType(ticketTypeId): void {
    this.setUpTypeIdandName(ticketTypeId)
  }

  private setUpTypeIdandName(ticketTypeId: number): void {
    this.pickedTicketTypeId = ticketTypeId
    this.pickedTicketTypeName = this.matchTicketTypeName(this.pickedTicketTypeId)[0]['view']
  }

  private matchTicketTypeName(pickedId: number): string[] {
    return this.ticketTypeDropDown.filter((type) => type['value'] == pickedId)
  }

  public getUser(userId): void {
    this.pickedUserId = userId
    console.log(this.pickedUserId)
  }

  public confirmNewTicket(): void {
    this.inputContent = this.contentForm.value['content']
    // console.log(this.pickedTicketTypeId, this.pickedUserId);
    // console.log(this.inputContent);
    //console.log(this.orderIdFromInputOrderNumber);
    let allValues: boolean = this.validInputs()
    if (!allValues) {
      this.sweetAlert.showSweetAlert('Please select and fill in all information！')
    } else {
      this.imagesUrls = this.orderService.returnImagesUrls.getValue() == null ? [] : this.orderService.returnImagesUrls.getValue()
      console.log(this.imagesUrls)
      let temOrderId = this.orderIdandNoForNewTicket == null ? this.orderIdFromInputOrderNumber : this.orderIdandNoForNewTicket['orderId']
      // let temOrderId = this.orderIdandNoForNewTicket == null ? this.orderNumberFromInput.value : this.orderIdandNoForNewTicket['orderId']
      let dataForNewTicket: any = {
        content: this.inputContent,
        orderId: temOrderId,
        inchargeUserId: this.pickedUserId,
        ticketTypeId: this.pickedTicketTypeId,
        imageUrls: this.imagesUrls,
      }
      this.orderService._createTicket(dataForNewTicket).subscribe((res) => {
        console.log(res)
        this.sweetAlert.showSuccessMessage('Ticket Created successfully！')
        this.dialogRef.close()
        this.orderService.returnImagesUrls.next(null)
      })
      // this.dialogRef.close()
    }
  }

  //to check no one is empty
  public validInputs(): boolean {
    return this.pickedTicketTypeId != -1 && this.pickedUserId != -1 && this.inputContent != ''
  }

  //from order number input when user selects from outside.
  public getOrderNumber(orderNo): void {
    //console.log(orderNo) //its string
    this.orderNumberFromInput = orderNo
  }

  public searchOrderNo(): void {
    this.findOrderId()
  }

  public buildOrderDetailTable(): void {}

  public findOrderId(): void {
    this.orderService._orderSearchByOrderNo(this.orderNumberFromInput.value).subscribe(
      (value) => {
        console.log(value)
        this.pickedOrderDetail = value
        this.orderIdFromInputOrderNumber = value[0]['OrderId']
        this.showValidOrder = true
        console.log(this.pickedOrderDetail)
        this.buildOrderDetailTable()
      },
      (error) => {
        this.showValidOrder = false
        console.log(error)
      }
    )
  }

  public test(): void {
    // console.log(this.contentForm.value['content']);
    console.log(this.orderService.returnImagesUrls.getValue())
  }
}

/*

BillingCustomerId  (用开片）

StockCustomerId (用开片）仓储客户

ProductId (用开片） 当前产品

WarehouseName: "武汉"  仓库

OrderPrice 当前订单价格

Recipient  收件人
RecipientPhone 收件人 电话

Status 订单状态


*/
