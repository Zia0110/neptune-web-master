/*
JSON.stringify   Object => string which datasource filter needs
JSON.parse       string => Object which to a object
*/
import { Component, OnInit, ViewChild } from '@angular/core'
import { WarehouseEndpoint } from '../../../services/endpoints/warehouse.endpoint'
import { FormControl } from '@angular/forms'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import Swal from 'sweetalert2'
import { RuleCommentFromTextComponent } from './rule-comment-from-text/rule-comment-from-text.component'
import { MatDialog } from '@angular/material/dialog'
import { PriceSelectionDialogComponent } from '../../finance/products/finance-product-price-list/price-selection-dialog/price-selection-dialog.component'
import { BulkCommentsModifyDialogComponent } from './bulk-comments-modify-dialog/bulk-comments-modify-dialog.component'

@Component({
  selector: 'app-consumer-orders-predispatch-status-five',
  templateUrl: './consumer-orders-predispatch-status-five.component.html',
  styleUrls: ['./consumer-orders-predispatch-status-five.component.css'],
})
export class ConsumerOrdersPredispatchStatusFiveComponent implements OnInit {
  public rulesData: any
  public statusFiveFromBackEnd: any
  public filteredValue
  public excelData: any
  public showChangeRuleAndCommentButton: boolean = false
  public showChangeRuleAndCommentFromExcelButton: boolean = false
  comment1Array = []
  comment2Array = []
  comment3Array = []
  filteredOrders = []
  isShowOrderFunctions = true

  @ViewChild('preDispatchFiveTable') preDispatchFiveTable

  constructor(private warehouseService: WarehouseEndpoint, private sweetAlertService: SweetAlertService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.comment1Array = []
    this.comment2Array = []
    this.comment3Array = []
    this.getStatusFiveData()
    this.getRulesData()
  }

  public getStatusFiveData(): void {
    this.warehouseService.getPreDispatchStatusFive().subscribe((value) => {
      this.statusFiveFromBackEnd = value
      this.filteredOrders = this.statusFiveFromBackEnd
      this.setValueForComment(this.statusFiveFromBackEnd)
      console.log(this.comment1Array)
      console.log(this.comment2Array)
      console.log(this.comment3Array)
    })
  }

  setValueForComment(data) {
    this.comment1Array = []
    this.comment2Array = []
    this.comment3Array = []
    data.map((row) => {
      if (row.Comment1 && !this.comment1Array.includes(row.Comment1)) {
        this.comment1Array.push(row.Comment1)
      }
      if (row.Comment2 && !this.comment2Array.includes(row.Comment2)) {
        this.comment2Array.push(row.Comment2)
      }
      if (row.Comment3 && !this.comment3Array.includes(row.Comment3)) {
        this.comment3Array.push(row.Comment3)
      }
    })
  }

  public getRulesData(): void {
    this.warehouseService.getWarehouseRules().subscribe((value) => {
      this.rulesData = value
    })
  }

  passFilteredValue($event) {
    this.filteredValue = JSON.parse($event)
    this.checkChangeRuleAndCommentButton()
  }

  public refreshBothTables(): void {
    this.getStatusFiveData()
  }

  private checkChangeRuleAndCommentButton(): void {
    /*
      We have to initilize testFilteredValue otherwise it is UNDEFINED!
      let testFilteredValue: any;
      let aEvent = {"searchString":"","orderProjectNameSelected":null,
      "uploadTextArray":["1415430364","1346843489","1096881006","2180846094"]}
      testFilteredValue = event;
      console.log(testFilteredValue["uploadTextArray"]);
    */

    if (this.filteredValue) {
      if (this.filteredValue['uploadTextArray']) {
        if (this.filteredValue['uploadTextArray'].length != 0) {
          this.showChangeRuleAndCommentButton = true
        }
      }
    }
  }

  public changeRuleAndCommentFromTextFile(): void {
    if (this.filteredValue['uploadTextArray'].length == 0) {
      this.sweetAlertService.showSweetAlert('Upload file first！')
    } else {
      let childData = {
        allFiveData: this.statusFiveFromBackEnd,
        orderNoFromText: this.filteredValue['uploadTextArray'],
        rulesData: this.rulesData,
      }
      const dialogRef = this.dialog.open(RuleCommentFromTextComponent, {
        width: '1000px',
        height: '80%',
        data: childData,
      })

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.updateStatusFiveData(result)
        }
      })
    }
  }

  getFilteredOrders(orders) {
    this.filteredOrders = orders
    this.setValueForComment(this.filteredOrders)
  }

  onChangeComments() {
    if (this.filteredOrders) {
      console.log(this.filteredOrders)
      const dialogRef = this.dialog.open(BulkCommentsModifyDialogComponent, {})
      dialogRef.componentInstance.outputData.subscribe((result) => {
        const putData = []
        this.filteredOrders.map((row) => {
          putData.push({
            orderId: row.OrderId,
            ruleId: row.RuleId,
            dispatchComment: result.comment1,
            dispatchComment2: result.comment2,
          })
        })
        this.warehouseService._updateRuleIdToStockOrders(putData).subscribe((_) => {
          this.sweetAlertService.successAlert('update successfully!')
          this.isShowOrderFunctions = false
          setTimeout(() => {
            this.isShowOrderFunctions = true
          })
          this.ngOnInit()
        })
      })
    }
  }

  //result = [rule, comment]
  // statusFiveFromBackEnd changes then the two tables change
  private updateStatusFiveData(result): void {
    for (let orderNo of this.filteredValue['uploadTextArray']) {
      for (let order of this.statusFiveFromBackEnd) {
        if (order.OrderNo == orderNo) {
          order.orderFormControl.setValue(result[0])
          order.commentFormControl.setValue(result[1])
          order.commentFormControl2.setValue(result[2])
        }
      }
    }
  }

  test() {
    console.log(1234567890)
  }

  public dataFromExcel($event): void {
    console.log($event)
    this.showChangeRuleAndCommentFromExcelButton = true
    // this.excelData = JSON.parse($event)
    this.excelData = $event
  }

  public changeRuleAndCommentsFromExcel(): void {
    let orderIds: string[] = []
    let ruleIds: number[] = []
    let commentsArray: string[] = []
    let comments2Array: string[] = []
    for (let record of this.statusFiveFromBackEnd) {
      for (let row of this.excelData) {
        if (row.OrderNo == record.OrderNo) {
          orderIds.push(record.OrderId)
          ruleIds.push(this.findRuleId(record['orderFormControl'].value))
          commentsArray.push(record.commentFormControl.value)
          comments2Array.push(record.commentFormControl2.value)
        }
      }
    }
    // orderIds.push(order['OrderId'])
    // ruleIds.push(this.findRuleId(order['orderFormControl'].value))
    // commentsArray.push(order.commentFormControl.value)
    // comments2Array.push(order.commentFormControl2.value)
    Swal.fire({
      text: 'Confirmation？',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm',
    }).then((result) => {
      if (result.value) {
        this.warehouseService.updateRuleIdToStockOrders(orderIds, ruleIds, commentsArray, comments2Array).subscribe((res) => {
          this.sweetAlertService.showSuccessMessage('Saved！')
          // this.childEvent.emit()
        })
      }
    })
  }

  private findRuleId(name: string): number {
    for (let rule of this.rulesData) {
      if (rule['RuleName'] == name) {
        return rule['RuleId']
      }
    }
  }
}

/*




*/
