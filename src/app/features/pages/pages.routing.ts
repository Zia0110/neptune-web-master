import { Routes } from '@angular/router'
import { FinanceInvoiceGenerateComponent } from './components/finance/invoice/finance-invoice-generate/finance-invoice-generate.component'
import { FinanceInvoiceSalesComponent } from './components/finance/invoice/finance-invoice-sales/finance-invoice-sales.component'
import { FinanceOrderAuthoriseComponent } from './components/finance/orders/finance-order-authorise/finance-order-authorise.component'
import { FinanceProductPriceListComponent } from './components/finance/products/finance-product-price-list/finance-product-price-list.component'
import { InventoryClientDashboardComponent } from './components/inventory/inventory-client-dashboard/inventory-client-dashboard.component'
import { InventoryInquiryComponent } from './components/inventory/inventory-inquiry/inventory-inquiry.component'
import { InventoryTransferConfirmComponent } from './components/inventory/inventory-transfer-confirm/inventory-transfer-confirm.component'
import { WarehouseConfirmationComponent } from './components/warehouse/warehouse-confirmation/warehouse-confirmation.component'
import { WarehouseListComponent } from './components/warehouse/warehouse-list/warehouse-list.component'
import { ConsumerOrdersPaperComponent } from './components/warehouse/consumer-orders-paper/consumer-orders-paper.component'
import { ConsumerOrdersPredispatchComponent } from './components/warehouse/consumer-orders-predispatch/consumer-orders-predispatch.component'
import { ConsumerOrdersPaperReceiveComponent } from './components/warehouse/consumer-orders-paper-receive/consumer-orders-paper-receive.component'
import { BusinessTransferGenerateComponent } from './components/warehouse/business-transfer-generate/business-transfer-generate.component'
import { BusinessTransferSettingComponent } from './components/warehouse/business-transfer-setting/business-transfer-setting.component'
import { WarehouseOutboundComponent } from './components/warehouse/warehouse-outbound/warehouse-outbound.component'
import { OrderConsumerGenerateComponent } from './components/order/order-consumer-generate/order-consumer-generate.component'
import { OrderConsumerCancelComponent } from './components/order/order-consumer-cancel/order-consumer-cancel.component'
import { OrderConsumerImportComponent } from './components/order/order-consumer-import/order-consumer-import.component'
import { OrderConsumerTransferComponent } from './components/order/order-consumer-transfer/order-consumer-transfer.component'
import { OrderConsumerListComponent } from './components/order/order-consumer-list/order-consumer-list.component'
import { OrderConsumerSearchEditComponent } from './components/order/order-consumer-search-edit/order-consumer-search-edit.component'
import { ProductListComponent } from './components/product/product-list/product-list.component'
import { ClientDetailDashboardComponent } from './components/client/client-detail-dashboard/client-detail-dashboard.component'
import { ClientDetailNewComponent } from './components/client/client-detail-new/client-detail-new.component'
import { ClientDetailPreferenceComponent } from './components/client/client-detail-preference/client-detail-preference.component'
import { ClientDetailTurnoverComponent } from './components/client/client-detail-turnover/client-detail-turnover.component'
import { ClientDetailInventoryComponent } from './components/client/client-detail-inventory/client-detail-inventory.component'
import { ClientDetailEditComponent } from './components/client/client-detail-edit/client-detail-edit.component'
import { ClientListComponent } from './components/client/client-list/client-list.component'
import { ManagementInventoryDashboardComponent } from './components/management/management-inventory-dashboard/management-inventory-dashboard.component'
import { DashboardComponent } from './components/dashboard/dashboard.component'
import { AdminUserAccessSettingComponent } from './components/admin/admin-user-access-settings/admin-user-access-settings.component'
import { OrderConsumerSearchComponent } from './components/order/order-consumer-search/order-consumer-search.component'
import { WarehouseInventoryTransferComponent } from './components/warehouse/warehouse-inventory-transfer/warehouse-inventory-transfer.component'
import { FinanceInvoicePaymentComponent } from './components/finance/invoice/finance-invoice-payment/finance-invoice-payment.component'
import { TransportPlanNewComponent } from './components/transport/transport-plan-new/transport-plan-new.component'
import { AdminUsersListComponent } from './components/admin/admin-users-list/admin-users-list.component'
import { WarehousePickupOrderComponent } from './components/warehouse/warehouse-pickup-order/warehouse-pickup-order.component'
import { TransportPlanListComponent } from './components/transport/transport-plan-list/transport-plan-list.component'
import { WarehouseOutboundUndoComponent } from './components/warehouse/warehouse-outbound-undo/warehouse-outbound-undo.component'
import { OrderTicketListComponent } from './components/order/order-ticket/order-ticket-list/order-ticket-list.component'
import { ClientDetailViewsComponent } from './components/client/client-detail-views/client-detail-views.component'
import { FinanceOrderCin7ExportComponent } from './components/finance/orders/finance-order-cin7-export/finance-order-cin7-export.component'
import { WarehouseDamageLoseComponent } from './components/warehouse/warehouse-damage-lose/warehouse-damage-lose.component'
import { FinanceCreditManagementListComponent } from './components/finance/credit/finance-credit-management-list/finance-credit-management-list.component'
import { PurchaseOrderCreateComponent } from './components/finance/purchase/purchase-order-create/purchase-order-create.component'
import { PurchaseOrderStockinComponent } from './components/finance/purchase/purchase-order-stockin/purchase-order-stockin.component'
import { ConsumerOrdersPredispatchNewComponent } from './components/warehouse/consumer-orders-predispatch-new/consumer-orders-predispatch-new.component'
import { ConsumerOrdersPredispatchStatusFiveComponent } from './components/warehouse/consumer-orders-predispatch-status-five/consumer-orders-predispatch-status-five.component'
import { FinanceCreditImportComponent } from './components/finance/credit/finance-credit-import/finance-credit-import.component'
import { FinanceOrderCin7ImportComponent } from './components/finance/orders/finance-order-cin7-import/finance-order-cin7-import.component'
import { FinanceInvoiceUpdateComponent } from './components/finance/invoice/finance-invoice-update/finance-invoice-update.component'
import { WarehouseInventoryTransferNoticeComponent } from './components/warehouse/warehouse-inventory-transfer-notice/warehouse-inventory-transfer-notice.component'
import { BusinessTransferShowComponent } from './components/warehouse/business-transfer-show/business-transfer-show.component'
import { ClientDashboardComponent } from './components/client/client-dashboard/client-dashboard.component'
import { ProductNameManagementComponent } from './components/product/product-name-management/product-name-management.component'
import { ClientNameManagementComponent } from './components/client/client-name-management/client-name-management.component'
import { NameManagementComponent } from './components/management/name-management/name-management.component'
import { UserAccessPageGuard } from '../../core/guard/user-access-page.guard'
import { InventoryViewComponent } from './components/inventory/inventory-view/inventory-view.component'
import { InventoryClientPurchaseComponent } from './components/inventory/inventory-client-purchase/inventory-client-purchase.component'
import { TransportLogisticsInvoiceListComponent } from './components/transport/transport-logistics-invoice-list/transport-logistics-invoice-list.component'
import { CustomerGroupManagementComponent } from './components/management/customer-group-management/customer-group-management.component'
import { OrderHistorySearchComponent } from './components/order/order-history-search/order-history-search.component'
import { SupplierManagementComponent } from './components/management/supplier-management/supplier-management.component'
import { PlaceOfOrginManagementComponent } from './components/management/place-of-orgin-management/place-of-orgin-management.component'
import { DistributionRuleManagementComponent } from './components/management/distribution-rule-management/distribution-rule-management.component'
import { PageGroupManagementComponent } from './components/management/page-group-management/page-group-management.component'
import { StockCustomerMappingManagementComponent } from './components/management/stock-customer-mapping-management/stock-customer-mapping-management.component'
import { ProductCategoryManagementComponent } from './components/management/product-category-management/product-category-management.component'
import { NotificationConfigurationManagementComponent } from './components/management/notification-configuration-management/notification-configuration-management.component'
import { TrackingInfoBatchUploadComponent } from './components/finance/tracking-info-batch-upload/tracking-info-batch-upload.component'
import { InventorySnapshotComponent } from './components/inventory/inventory-snapshot/inventory-snapshot.component'
import { WarehouseListFormarrayComponent } from './components/warehouse/warehouse-list-formarray/warehouse-list-formarray.component'

export const PagesRoutes: Routes = [
  // Dashboard
  { path: '', component: DashboardComponent, data: { title: 'Home' } },

  // finance
  {
    path: 'finance/invoice/generate',
    canActivate: [UserAccessPageGuard],
    component: FinanceInvoiceGenerateComponent,
    data: { title: 'Wholesale invoice create' },
  },
  // { path: 'finance/invoice/sales', canActivate: [UserAccessPageGuard], component: FinanceInvoiceSalesComponent, data: { title: '' } },
  {
    path: 'finance/order/authorise',
    canActivate: [UserAccessPageGuard],
    component: FinanceOrderAuthoriseComponent,
    data: { title: 'Order accounts authorise' },
  },
  {
    path: 'finance/order/authorise-customer',
    canActivate: [UserAccessPageGuard],
    component: FinanceOrderAuthoriseComponent,
    data: { title: 'Order accounts authorise Customer' },
  },
  {
    path: 'finance/products',
    canActivate: [UserAccessPageGuard],
    component: FinanceProductPriceListComponent,
    data: { title: 'Product Price Control' },
  },
  {
    path: 'finance/invoice/payment',
    canActivate: [UserAccessPageGuard],
    component: FinanceInvoicePaymentComponent,
    data: { title: 'Wholesale Payment' },
  },
  {
    path: 'finance/cin7import',
    canActivate: [UserAccessPageGuard],
    component: FinanceOrderCin7ImportComponent,
    data: { title: 'Cin7 import Excel' },
  },
  { path: 'finance/cin7export', canActivate: [UserAccessPageGuard], component: FinanceOrderCin7ExportComponent, data: { title: 'Cin7 export' } },
  {
    path: 'finance/credit/import',
    canActivate: [UserAccessPageGuard],
    component: FinanceCreditImportComponent,
    data: { title: 'Credit import Excel' },
  },
  {
    path: 'finance/credit/list',
    canActivate: [UserAccessPageGuard],
    component: FinanceCreditManagementListComponent,
    data: { title: 'Credit list' },
  },
  {
    path: 'finance/order-history-search',
    canActivate: [UserAccessPageGuard],
    component: OrderHistorySearchComponent,
    data: { title: 'Operation history' },
  },
  {
    path: 'finance/tracking-info-batch-upload',
    canActivate: [UserAccessPageGuard],
    component: TrackingInfoBatchUploadComponent,
    data: { title: 'Tracking Info Batch Upload' },
  },
  {
    path: 'finance/purchase-order/create',
    canActivate: [UserAccessPageGuard],
    component: PurchaseOrderCreateComponent,
    data: { title: 'Purchased stock in' },
  },
  {
    path: 'finance/purchase-order/check',
    canActivate: [UserAccessPageGuard],
    component: PurchaseOrderStockinComponent,
    data: { title: 'Purchase order search' },
  },

  // inventory
  // { path: 'inventory/client/dashboard', canActivate: [UserAccessPageGuard], component: InventoryClientDashboardComponent },
  { path: 'inventory/inquiry', canActivate: [UserAccessPageGuard], component: InventoryInquiryComponent, data: { title: 'Inventory search' } },
  { path: 'inventory/view', canActivate: [UserAccessPageGuard], component: InventoryViewComponent, data: { title: 'Inventory dashboard' } },
  // { path: 'inventory/transfer', canActivate: [UserAccessPageGuard], component: InventoryTransferConfirmComponent },
  {
    path: 'inventory/snapshot',
    canActivate: [UserAccessPageGuard],
    component: InventorySnapshotComponent,
    data: { title: 'Inventory Snapshot' },
  },
  {
    path: 'inventory/client/purchase',
    canActivate: [UserAccessPageGuard],
    component: InventoryClientPurchaseComponent,
    data: { title: 'Customer self purchase' },
  },

  // warehouse
  { path: 'warehouse/list', canActivate: [UserAccessPageGuard], component: WarehouseListFormarrayComponent, data: { title: 'Warehouse list' } },
  {
    path: 'warehouse/orders-paper',
    canActivate: [UserAccessPageGuard],
    component: ConsumerOrdersPaperComponent,
    data: { title: 'Paper orders dispatch' },
  },
  // {
  //   path: 'warehouse/pre-dispatch',
  //   canActivate: [UserAccessPageGuard],
  //   component: ConsumerOrdersPredispatchComponent,
  //   data: { title: 'Pre warehousiing' },
  // },
  {
    path: 'warehouse/pre-dispatch-new',
    canActivate: [UserAccessPageGuard],
    component: ConsumerOrdersPredispatchNewComponent,
    data: { title: 'Order pre-distribute' },
  },
  {
    path: 'warehouse/pre-dispatch-status-five',
    canActivate: [UserAccessPageGuard],
    component: ConsumerOrdersPredispatchStatusFiveComponent,
    data: { title: 'Order pre-distribute edit' },
  },
  {
    path: 'warehouse/orders-paper-receive',
    canActivate: [UserAccessPageGuard],
    component: ConsumerOrdersPaperReceiveComponent,
    data: { title: 'Paper orders receive' },
  },
  {
    path: 'warehouse/business-transfer-show',
    canActivate: [UserAccessPageGuard],
    component: BusinessTransferShowComponent,
    data: { title: 'Customer inventory transfer search' },
  },
  {
    path: 'warehouse/inventory-transfer-notice',
    canActivate: [UserAccessPageGuard],
    component: WarehouseInventoryTransferNoticeComponent,
    data: { title: 'Inventory Transfer Notice' },
  },
  // {
  //   path: 'warehouse/business-transfer-settings',
  //   canActivate: [UserAccessPageGuard],
  //   component: BusinessTransferSettingComponent,
  //   data: { title: '' },
  // },
  {
    path: 'warehouse/confirmation',
    canActivate: [UserAccessPageGuard],
    component: WarehouseConfirmationComponent,
    data: { title: 'Wholesale warehouse selection' },
  },
  { path: 'warehouse/pickup-order', canActivate: [UserAccessPageGuard], component: WarehousePickupOrderComponent, data: { title: 'Order sorting' } },
  { path: 'warehouse/outbound', canActivate: [UserAccessPageGuard], component: WarehouseOutboundComponent, data: { title: 'Order outbound' } },
  {
    path: 'warehouse/outbound-undo',
    canActivate: [UserAccessPageGuard],
    component: WarehouseOutboundUndoComponent,
    data: { title: 'Order outbound reverse' },
  },
  {
    path: 'warehouse/inventory-transfer',
    canActivate: [UserAccessPageGuard],
    component: WarehouseInventoryTransferComponent,
    data: { title: 'Inventory transfer' },
  },
  {
    path: 'warehouse/warehouse-damage-lose',
    canActivate: [UserAccessPageGuard],
    component: WarehouseDamageLoseComponent,
    data: { title: '仓库报损和本地销售' },
  },
  {
    path: 'warehouse/warehouse-dal-damage-lose',
    canActivate: [UserAccessPageGuard],
    component: WarehouseDamageLoseComponent,
    data: { title: '仓库报损和本地销售' },
  },
  {
    path: 'warehouse/invoice-update',
    canActivate: [UserAccessPageGuard],
    component: FinanceInvoiceUpdateComponent,
    data: { title: '批发订单仓库修改' },
  },

  // orders
  { path: 'order/consumer-generate', canActivate: [UserAccessPageGuard], component: OrderConsumerGenerateComponent, data: { title: '' } },
  { path: 'order/consumer-cancel', canActivate: [UserAccessPageGuard], component: OrderConsumerCancelComponent, data: { title: '' } },
  { path: 'order/consumer-import', canActivate: [UserAccessPageGuard], component: OrderConsumerImportComponent, data: { title: '订单批量导入' } },
  { path: 'order/consumer-transfer', canActivate: [UserAccessPageGuard], component: OrderConsumerTransferComponent, data: { title: '' } },
  { path: 'order/consumer-list', canActivate: [UserAccessPageGuard], component: OrderConsumerListComponent, data: { title: '订单 识别' } },
  { path: 'order/consumer-search-edit', canActivate: [UserAccessPageGuard], component: OrderConsumerSearchEditComponent, data: { title: '' } },
  {
    path: 'order/consumer-search/:usertype',
    canActivate: [UserAccessPageGuard],
    component: OrderConsumerSearchComponent,
    data: { title: '订单搜索' },
  },
  { path: 'order/ticket-list', canActivate: [UserAccessPageGuard], component: OrderTicketListComponent, data: { title: 'Ticket列表' } },

  // product
  { path: 'product', canActivate: [UserAccessPageGuard], component: ProductListComponent, data: { title: '产品列表' } },
  { path: 'product/name-management', canActivate: [UserAccessPageGuard], component: ProductNameManagementComponent, data: { title: '产品名称管理' } },
  { path: 'product/supplier-management', canActivate: [UserAccessPageGuard], component: SupplierManagementComponent, data: { title: '供应商管理' } },

  // Client
  { path: 'client/dashboard/:clientId', canActivate: [UserAccessPageGuard], component: ClientDashboardComponent, data: { title: '客户情报' } },
  { path: 'client/detail/dashboard', canActivate: [UserAccessPageGuard], component: ClientDetailDashboardComponent, data: { title: '' } },
  { path: 'client/detail/create', canActivate: [UserAccessPageGuard], component: ClientDetailNewComponent, data: { title: '' } },
  { path: 'client/detail/preference', canActivate: [UserAccessPageGuard], component: ClientDetailPreferenceComponent, data: { title: '' } },
  { path: 'client/detail/turnover', canActivate: [UserAccessPageGuard], component: ClientDetailTurnoverComponent, data: { title: '' } },
  { path: 'client/detail/inventory', canActivate: [UserAccessPageGuard], component: ClientDetailInventoryComponent, data: { title: '' } },
  { path: 'client/detail/edit', canActivate: [UserAccessPageGuard], component: ClientDetailEditComponent },
  { path: 'client', canActivate: [UserAccessPageGuard], component: ClientListComponent, data: { title: '客户列表' } },
  { path: 'client/dashboardview/:clientId', canActivate: [UserAccessPageGuard], component: ClientDetailViewsComponent, data: { title: '' } },
  { path: 'client/name-management', canActivate: [UserAccessPageGuard], component: ClientNameManagementComponent, data: { title: '客户名称管理' } },

  // Management
  { path: 'management/users', canActivate: [UserAccessPageGuard], component: AdminUsersListComponent, data: { title: 'Admin users' } },
  { path: 'management/inventory', canActivate: [UserAccessPageGuard], component: ManagementInventoryDashboardComponent, data: { title: '' } },
  {
    path: 'management/staff/authorization',
    canActivate: [UserAccessPageGuard],
    component: AdminUserAccessSettingComponent,
    data: { title: 'Admin user authorisation' },
  },
  { path: 'management/name', canActivate: [UserAccessPageGuard], component: NameManagementComponent, data: { title: '标准名称管理' } },
  {
    path: 'management/customer-group',
    canActivate: [UserAccessPageGuard],
    component: CustomerGroupManagementComponent,
    data: { title: '客户组管理' },
  },
  {
    path: 'management/place-of-origin',
    canActivate: [UserAccessPageGuard],
    component: PlaceOfOrginManagementComponent,
    data: { title: '原产地管理' },
  },
  {
    path: 'management/distribution-rule',
    canActivate: [UserAccessPageGuard],
    component: DistributionRuleManagementComponent,
    data: { title: '分仓规则管理' },
  },
  {
    path: 'management/page-group',
    canActivate: [UserAccessPageGuard],
    component: PageGroupManagementComponent,
    data: { title: '页面表管理' },
  },
  {
    path: 'management/product-category',
    canActivate: [UserAccessPageGuard],
    component: ProductCategoryManagementComponent,
    data: { title: '产品类型管理' },
  },
  {
    path: 'management/notification-configuration',
    canActivate: [UserAccessPageGuard],
    component: NotificationConfigurationManagementComponent,
    data: { title: 'Notification配置管理' },
  },
  {
    path: 'management/stock-customer-mapping',
    canActivate: [UserAccessPageGuard],
    component: StockCustomerMappingManagementComponent,
    data: { title: '库存客户映射关系管理' },
  },
  // Transport
  { path: 'transport/plan/new', canActivate: [UserAccessPageGuard], component: TransportPlanNewComponent },
  { path: 'transport/plan/list/:status', canActivate: [UserAccessPageGuard], component: TransportPlanListComponent },
  {
    path: 'transport/logistics/invoice',
    canActivate: [UserAccessPageGuard],
    component: TransportLogisticsInvoiceListComponent,
    data: { title: '物流发票查询' },
  },
]
