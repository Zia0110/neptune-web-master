import { Component, OnInit, ViewChild } from '@angular/core'
import { WarehouseEndpoint } from '../../../services/endpoints/warehouse.endpoint'
import { FormControl } from '@angular/forms'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { PredispatchOrderTableComponent } from './predispatch-order-table/predispatch-order-table.component'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-consumer-orders-predispatch-new',
  templateUrl: './consumer-orders-predispatch-new.component.html',
  styleUrls: ['./consumer-orders-predispatch-new.component.css'],
})
export class ConsumerOrdersPredispatchNewComponent implements OnInit {
  public rulesData: any
  public statusFourFromBackEnd: any
  @ViewChild('preDispatchTable') preDispatchTable
  public filteredValue: null

  constructor(private warehouseService: WarehouseEndpoint, private sweetAlertService: SweetAlertService) {}

  ngOnInit(): void {
    this.getStatusFourData()
    this.getRulesData()
  }

  public getStatusFourData(): void {
    this.warehouseService.getPreDispatchStatusFour().subscribe((value) => {
      this.statusFourFromBackEnd = value
    })
  }

  public getRulesData(): void {
    this.warehouseService.getWarehouseRules().subscribe((value) => {
      this.rulesData = value
    })
  }

  public autoAssign(): void {
    this.preDispatchTable.assignRulesToAllOrders()
  }

  public confirmRules(): void {
    let resultArrays = this.preDispatchTable.handleRulesAndOrders()
    console.log(resultArrays)

    Swal.fire({
      text: 'Sure save and submit？',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm',
    }).then((result) => {
      if (result.value) {
        this.warehouseService
          .updateRuleIdToStockOrders(
            resultArrays['orderIds'],
            resultArrays['ruleIds'],
            resultArrays['dispatchComment'],
            resultArrays['dispatchComment2']
          )
          .subscribe((res) => {
            this.sweetAlertService.showSuccessMessage('Save Successful！')
            this.getStatusFourData() //refresh two tables
          })
      }
    })
  }

  passFilteredValue($event) {
    this.filteredValue = $event
  }
}
