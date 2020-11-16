import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { WarehouseEndpoint } from '../../../services/endpoints/warehouse.endpoint'
import { DistributionRuleDialogComponent } from './distribution-rule-dialog/distribution-rule-dialog.component'

@Component({
  selector: 'app-distribution-rule-management',
  templateUrl: './distribution-rule-management.component.html',
  styleUrls: ['./distribution-rule-management.component.css'],
})
export class DistributionRuleManagementComponent implements OnInit {
  displayedColumns: string[] = ['position', 'type', 'name', 'warehouse', 'handle']
  dataSource = new MatTableDataSource()

  constructor(public dialog: MatDialog, private warehouseEndpoint: WarehouseEndpoint, private sweetAlertService: SweetAlertService) {}

  ngOnInit(): void {
    this.getAllData()
  }

  getAllData() {
    this.warehouseEndpoint
      ._getAllWarehouseRule()
      .toPromise()
      .then((res: any) => {
        this.dataSource.data = res
      })
  }

  openItemDialog(element?) {
    const dialogRef = this.dialog.open(DistributionRuleDialogComponent, {
      autoFocus: false,
      data: element ? element : '',
    })
    dialogRef.componentInstance.outputData.subscribe((result) => {
      if (result) {
        if (!element) {
          this.warehouseEndpoint
            ._newWarehouseRule({
              RuleType: result.RuleType,
              RuleName: result.RuleName,
              WarehouseId: result.WarehouseId,
            })
            .subscribe((_) => {
              this.sweetAlertService.successAlert('Add succeeded!')
              this.getAllData()
            })
        } else {
          this.warehouseEndpoint
            ._updateWarehouseRule(element.RuleId, {
              RuleId: element.RuleId,
              RuleType: result.RuleType,
              RuleName: result.RuleName,
              WarehouseId: result.WarehouseId,
            })
            .subscribe((_) => {
              this.sweetAlertService.successAlert('Modified succeeded！')
              this.getAllData()
            })
        }
      }
    })
  }
}
