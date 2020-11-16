import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

import { FormsModule } from '@angular/forms'

import { CdkTableModule } from '@angular/cdk/table'
import { SharedModule } from '../../shared/shared.module'
import { OrderTableComponent } from './order-table/order-table.component'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { WarehouseInventoryTableComponent } from './warehouse-inventory-table/warehouse-inventory-table.component'
import { TransportProductTableComponent } from './transport-product-table/transport-product-table.component'
import { FinanceOrderTableComponent } from './finance-order-table/finance-order-table.component'
import { FinanceOrderTableEditDialogComponent } from './finance-order-table/finance-order-table-edit/finance-order-table-edit-dialog.component'
import { FinanceProductPriceTableComponent } from './finance-product-table/finance-product-price-table.component'
import { OrderChangeComponent } from './order-change/order-change.component'
import { TransportPlanTableComponent } from './transport-plan-table/transport-plan-table.component'
import { TransportPlanEditComponent } from './transport-plan-edit/transport-plan-edit.component'
import { FinanceCin7TableComponent } from './finance-cin7-table/finance-cin7-table.component'
import { FinanceCreditTableComponent } from './finance-credit-table/finance-credit-table.component'
import { FinancePurchaseCreateTableComponent } from './finance-purchase-create-table/finance-purchase-create-table.component'
import { WarehouseInventoryTransferNoticeTableComponent } from './warehouse-inventory-transfer-notice-table/warehouse-inventory-transfer-notice-table.component'
import { NameManagementTableComponent } from './name-management-table/name-management-table.component'
import { NameManagementDialogComponent } from './name-management-table/name-management-dialog/name-management-dialog.component'
import { ClientDashboardChartComponent } from './client-dashboard-chart/client-dashboard-chart.component'
import { NgxChartsModule } from '@swimlane/ngx-charts'
import { InventoryClientPurchaseTableComponent } from './inventory-client-purchase-table/inventory-client-purchase-table.component'
import { TransportLogisticsInvoiceTableComponent } from './transport-logistics-invoice-table/transport-logistics-invoice-table.component'
import { OrdersGroupChangeDialogComponent } from './orders-group-change-dialog/orders-group-change-dialog.component'
import { BatchCancelDialogComponent } from './order-table/batch-cancel-dialog/batch-cancel-dialog.component'

@NgModule({
  declarations: [
    FinanceOrderTableComponent,
    OrderTableComponent,
    WarehouseInventoryTableComponent,
    TransportProductTableComponent,
    FinanceOrderTableEditDialogComponent,
    FinanceProductPriceTableComponent,
    OrderChangeComponent,
    TransportPlanTableComponent,
    TransportPlanEditComponent,
    FinanceCin7TableComponent,
    FinanceCreditTableComponent,
    FinancePurchaseCreateTableComponent,
    WarehouseInventoryTransferNoticeTableComponent,
    NameManagementTableComponent,
    NameManagementDialogComponent,
    ClientDashboardChartComponent,
    TransportLogisticsInvoiceTableComponent,
    InventoryClientPurchaseTableComponent,
    OrdersGroupChangeDialogComponent,
    BatchCancelDialogComponent,
  ],
  imports: [NgxChartsModule, CommonModule, FormsModule, SharedModule, CdkTableModule, DragDropModule],
  exports: [
    FinanceProductPriceTableComponent,
    FinanceOrderTableComponent,
    OrderTableComponent,
    WarehouseInventoryTableComponent,
    TransportProductTableComponent,
    OrderChangeComponent,
    TransportPlanTableComponent,
    TransportPlanEditComponent,
    FinanceCin7TableComponent,
    FinanceCreditTableComponent,
    FinancePurchaseCreateTableComponent,
    WarehouseInventoryTransferNoticeTableComponent,
    NameManagementTableComponent,
    ClientDashboardChartComponent,
    InventoryClientPurchaseTableComponent,
    TransportLogisticsInvoiceTableComponent,
    OrdersGroupChangeDialogComponent,
  ],
  providers: [],
  entryComponents: [FinanceOrderTableEditDialogComponent, OrdersGroupChangeDialogComponent],
})
export class CommonComponentsModule {}
