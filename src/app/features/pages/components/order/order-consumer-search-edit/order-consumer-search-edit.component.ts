import { Component, OnInit, OnChanges } from '@angular/core'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormControl, Validators, FormBuilder } from '@angular/forms'
import { FormFieldConfigInterface } from '../../../../../shared/presentational-components/dynamic-form/dynamic-form-presentational.interface'

@Component({
  selector: 'app-order-consumer-search-edit',
  templateUrl: './order-consumer-search-edit.component.html',
  styleUrls: ['./order-consumer-search-edit.component.css'],
})
export class OrderConsumerSearchEditComponent implements OnInit {
  editModeOn = false

  orderID = new FormControl('', [Validators.minLength(10), Validators.maxLength(10)])
  errorMessage: string
  orderNo
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  searchById() {
    if (this.orderID.invalid) {
      this.errorMessage = '订单号格式：10位数字'
      return
    } else {
      this.orderNo = this.orderID.value
      console.log(this.orderNo)
    }
  }

  // openConditionSearch(): void {
  //   const dialogRef = this.dialog.open(OrderConditionSearchComponent, {
  //     width: '70%',
  //     data: {}
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //   });
  // }
}
