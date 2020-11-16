import { Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'
import { AppConfigStore } from '../../../../../../core/services/app-config.store'
import { FinanceEndpoint } from '../../../../services/endpoints/finance.endpoint'

@Component({
  selector: 'app-purchase-order-create',
  templateUrl: './purchase-order-create.component.html',
  styleUrls: ['./purchase-order-create.component.css'],
})
export class PurchaseOrderCreateComponent implements OnInit {
  // 定义上面的Input的ngModel
  suppliers = []
  supplierValue: number
  contactPerson = ''
  contactEmail = ''
  contactPhone = ''
  purchaseComment = 'Comment Content...'
  // 刷新table
  isShowTable = true
  warehouse = new FormControl()

  constructor(public appConfigStore: AppConfigStore, private sweetAlertService: SweetAlertService, private financeEndpoint: FinanceEndpoint) {}

  ngOnInit(): void {
    this.suppliers = this.appConfigStore.appSettings.Mapping.Supplier
  }

  private reset() {
    this.contactPerson = ''
    this.contactEmail = ''
    this.contactPhone = ''
    this.purchaseComment = 'Comment Info...'
  }

  getTableResultEmit(value: any) {
    if (!this.supplierValue || !this.purchaseComment || !this.warehouse.value) {
      this.sweetAlertService.showSweetAlert('Please fill in the purchase instructions of suppliers, warehouses and contacts before saving！')
    } else {
      this.financeEndpoint
        ._createPurchaseOrderPOST({
          applyComments: this.purchaseComment,
          supplierId: this.supplierValue,
          contactPerson: this.contactPerson,
          phone: this.contactPhone,
          email: this.contactEmail,
          warehouseId: this.warehouse.value,
          purchaseOrderDetailModels: value,
        })
        .toPromise()
        .then((res) => {
          this.isShowTable = false
          setTimeout(() => {
            this.isShowTable = true
          })
          this.sweetAlertService.showSuccessMessage('Saved successfully！')
          this.reset()
        })
    }
  }
}
