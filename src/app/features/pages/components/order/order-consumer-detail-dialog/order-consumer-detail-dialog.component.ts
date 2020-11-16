import { Component, OnInit, OnChanges, Inject, ChangeDetectorRef } from '@angular/core'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormControl, Validators, FormBuilder } from '@angular/forms'
import { FormFieldConfigInterface } from '../../../../../shared/presentational-components/dynamic-form/dynamic-form-presentational.interface'
import { OrderEndpoint } from '../../../services/endpoints/order.endpoint'
import { AppConfigStore } from '../../../../../core/services/app-config.store'
import { OrderConsumerDetailCancelDialogComponent } from '../order-consumer-detail-cancel/order-consumer-detail-cancel-dialog.component'

@Component({
  selector: 'app-order-consumer-detail-dialog',
  templateUrl: './order-consumer-detail-dialog.component.html',
  styleUrls: ['./order-consumer-detail-dialog.component.css'],
})
export class OrderConsumerDetailDialogComponent implements OnInit {
  editModeOn = false
  orderData: any
  orderNo
  orderId
  selectionWarehouse = new FormControl('')

  constructor(
    private orderService: OrderEndpoint,
    private appConfigStore: AppConfigStore,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<OrderConsumerDetailDialogComponent>,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data?
  ) {}

  // Init with data passed from list
  ngOnInit(): void {
    this.orderNo = this.data.OrderNo
    this.orderId = this.data.OrderId
    this.getOrderDetailApi(this.data.OrderId)
    // this.abc()
  }

  // Get assoicated order details
  getOrderDetailApi(orderId) {
    this.orderService._orderSearchByOrderId(orderId).subscribe((res) => {
      console.log(res)
      if (res[0]) {
        this.orderData = res[0]
      } else {
        this.orderData = res
      }
      this.cdr.detectChanges()
    })
  }

  editedOutput($event) {
    console.log($event)
    this.orderData = $event
    this.dialogRef.close()
  }

  // abc() {
  //   this.selectionWarehouse.valueChanges.subscribe((data) => console.log(data))
  // }

  onNoClick() {
    this.dialogRef.close()
  }
}
