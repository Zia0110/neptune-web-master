import { Component, OnInit, Inject } from '@angular/core'
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { InventoryEndpoint } from '../../../../services/endpoints/inventory.endpoint'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'
import { FormControl } from '@angular/forms'
import { WarehouseEndpoint } from '../../../../services/endpoints/warehouse.endpoint'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-rule-comment-from-text',
  templateUrl: './rule-comment-from-text.component.html',
  styleUrls: ['./rule-comment-from-text.component.css'],
})
export class RuleCommentFromTextComponent implements OnInit {
  public ruleFormControl = new FormControl('')
  public commentFormControl = new FormControl('')
  public comment2FormControl = new FormControl('')
  public rulesForOptions: string[] = []
  public pickedRuleId: number
  public commentInput: string //note1
  public comment2Input: string //note2
  public ruleNameAndCommentForParent: string[] = []
  public pickedRuleName: string

  constructor(
    public dialog: MatDialog,
    private inventoryService: InventoryEndpoint,
    private sweetAlert: SweetAlertService,
    private warehouseService: WarehouseEndpoint,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<RuleCommentFromTextComponent>
  ) {}

  ngOnInit(): void {
    console.log(this.data)
    this.setUpRulesForDropDown()
  }

  private setUpRulesForDropDown(): void {
    if (this.data.rulesData) {
      for (let rule of this.data.rulesData) {
        this.rulesForOptions.push(rule['RuleName'])
      }
    }
  }

  public getRule(rule): void {
    console.log(rule)
    this.pickedRuleName = rule
    this.pickedRuleId = this.findRuleId(rule)
  }

  private findRuleId(name: string): number {
    for (let rule of this.data.rulesData) {
      if (rule['RuleName'] == name) {
        return rule['RuleId']
      }
    }
  }

  // reset the array and then push rule name and comment for it.
  // it is used to update the five table
  private setDataForParent(): void {
    this.ruleNameAndCommentForParent.length = 0
    this.ruleNameAndCommentForParent.push(this.pickedRuleName)
    this.ruleNameAndCommentForParent.push(this.commentInput)
    this.ruleNameAndCommentForParent.push(this.comment2Input)
  }

  public confirmChangeRuleAndComment(): void {
    console.log(this.ruleFormControl.value)
    console.log(this.commentFormControl.value)
    if (this.ruleFormControl.value == '' || this.commentFormControl.value == '' || this.comment2FormControl.value == '') {
      this.sweetAlert.showSweetAlert('Please select rule and note!')
    } else {
      // console.log(this.pickedRuleId)
      this.commentInput = this.commentFormControl.value
      this.comment2Input = this.comment2FormControl.value
      // console.log(this.commentInput);
      // console.log(this.data.allFiveData)
      let orderIds: string[] = []
      let ruleIds: number[] = []
      let commentsArray: string[] = []
      let comments2Array: string[] = []
      // orderIds.push(order['OrderId'])
      // ruleIds.push(this.findRuleId(order['orderFormControl'].value))
      // commentsArray.push(order.commentFormControl.value)
      for (let orderNo of this.data.orderNoFromText) {
        let temOrderId = this.getOrderIdByOrderNo(orderNo)
        if (temOrderId != '') {
          orderIds.push(temOrderId)
          ruleIds.push(this.pickedRuleId)
          commentsArray.push(this.commentInput)
          comments2Array.push(this.comment2Input)
        }
      }

      this.setDataForParent()
      Swal.fire({
        text: 'Are you sure to modify rule and note?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '确定',
      }).then((result) => {
        if (result.value) {
          this.warehouseService.updateRuleIdToStockOrders(orderIds, ruleIds, commentsArray, comments2Array).subscribe((res) => {
            this.sweetAlert.showSuccessMessage('Rule and note successfully added!')
            this.dialogRef.close(this.ruleNameAndCommentForParent)
          })
        }
      })
    }
  }

  private getOrderIdByOrderNo(orderNo: string): string {
    let res: string = ''
    for (let order of this.data.allFiveData) {
      if (order.OrderNo == orderNo) {
        res = order.OrderId
        break
      }
    }
    return res
  }
}
