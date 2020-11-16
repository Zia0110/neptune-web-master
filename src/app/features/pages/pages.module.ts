import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'

import { CdkTableModule } from '@angular/cdk/table'

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { PagesRoutes } from './pages.routing'
//import { AdminPageRoutes } from './admin-pages.routing'

import { NgxChartsModule } from '@swimlane/ngx-charts'
import { SharedModule } from '../../shared/shared.module'
import { CommonComponentsModule } from '../common-views/common-views.module'

// All page Endpoints
import { ClientEndpoint } from './services/endpoints/client.endpoint'
import { OrderEndpoint } from './services/endpoints/order.endpoint'
import { ProductEndpoint } from './services/endpoints/product.endpoint'
import { WarehouseEndpoint } from './services/endpoints/warehouse.endpoint'
import { FinanceEndpoint } from './services/endpoints/finance.endpoint'
import { InventoryEndpoint } from './services/endpoints/inventory.endpoint'
import { TableHelperService } from './services/helpers/table-helper.service'
import { AdminEndPoint } from './services/endpoints/admin.endpoint'

// All page components
import { ClientDetailDashboardComponent } from './components/client/client-detail-dashboard/client-detail-dashboard.component'
import { ClientDetailTurnoverComponent } from './components/client/client-detail-turnover/client-detail-turnover.component'
import { ClientDetailInventoryComponent } from './components/client/client-detail-inventory/client-detail-inventory.component'
import { ClientDetailPreferenceComponent } from './components/client/client-detail-preference/client-detail-preference.component'
import { ClientDetailNewComponent } from './components/client/client-detail-new/client-detail-new.component'
import { ClientDetailEditComponent } from './components/client/client-detail-edit/client-detail-edit.component'
import { ClientListComponent } from './components/client/client-list/client-list.component'
// import { InventoryClientDashboardComponent } from './components/inventory/inventory-client-dashboard/inventory-client-dashboard.component'
import { InventoryClientPurchaseComponent } from './components/inventory/inventory-client-purchase/inventory-client-purchase.component'
import { InventoryInquiryComponent } from './components/inventory/inventory-inquiry/inventory-inquiry.component'
// import { InventoryTransferConfirmComponent } from './components/inventory/inventory-transfer-confirm/inventory-transfer-confirm.component'
import { OrderConsumerGenerateComponent } from './components/order/order-consumer-generate/order-consumer-generate.component'
import { OrderConsumerCancelComponent } from './components/order/order-consumer-cancel/order-consumer-cancel.component'
import { OrderConsumerTransferComponent } from './components/order/order-consumer-transfer/order-consumer-transfer.component'
import { OrderConsumerListComponent } from './components/order/order-consumer-list/order-consumer-list.component'
import { OrderConsumerDetailCustomerServiceComponent } from './components/order/order-consumer-detail-dialog/order-consumer-detail-customer-service/order-consumer-detail-customer-service.component'
import { OrderConsumerSearchEditComponent } from './components/order/order-consumer-search-edit/order-consumer-search-edit.component'
import { OrderConsumerImportComponent } from './components/order/order-consumer-import/order-consumer-import.component'
import { OrderPresentComponent } from './components/order/order-consumer-search-edit/order-present/order-present.component'
import { WarehouseListComponent } from './components/warehouse/warehouse-list/warehouse-list.component'
import { TransferListComponent } from './components/warehouse/transfer-list/transfer-list.component'
import { ConsumerOrdersPaperComponent } from './components/warehouse/consumer-orders-paper/consumer-orders-paper.component'
// import { ConsumerOrdersPredispatchComponent } from './components/warehouse/consumer-orders-predispatch/consumer-orders-predispatch.component'
// import { BusinessTransferSettingComponent } from './components/warehouse/business-transfer-setting/business-transfer-setting.component'
import { BusinessTransferGenerateComponent } from './components/warehouse/business-transfer-generate/business-transfer-generate.component'
import { ConsumerOrdersPaperReceiveComponent } from './components/warehouse/consumer-orders-paper-receive/consumer-orders-paper-receive.component'
import { WarehouseOutboundComponent } from './components/warehouse/warehouse-outbound/warehouse-outbound.component'
import { WarehouseListDialogComponent } from './components/warehouse/warehouse-list/warehouse-list-dialog/warehouse-list-dialog.component'
import { ProductListComponent } from './components/product/product-list/product-list.component'
import { ProductDetailEditComponent } from './components/product/product-detail-edit/product-detail-edit.component'
import { ManagementInventoryDashboardComponent } from './components/management/management-inventory-dashboard/management-inventory-dashboard.component'
import { DashboardComponent } from './components/dashboard/dashboard.component'
// import { FinanceInvoiceSalesComponent } from './components/finance/invoice/finance-invoice-sales/finance-invoice-sales.component'
import { FinanceOrderAuthoriseComponent } from './components/finance/orders/finance-order-authorise/finance-order-authorise.component'
import { FinanceProductPriceListComponent } from './components/finance/products/finance-product-price-list/finance-product-price-list.component'
import { FinanceInvoiceGenerateComponent } from './components/finance/invoice/finance-invoice-generate/finance-invoice-generate.component'
import { AdminUserAccessSettingComponent } from './components/admin/admin-user-access-settings/admin-user-access-settings.component'
import { WarehouseInventoryTransferComponent } from './components/warehouse/warehouse-inventory-transfer/warehouse-inventory-transfer.component'
import { OrderConsumerSearchComponent } from './components/order/order-consumer-search/order-consumer-search.component'
import { WarehouseConfirmationComponent } from './components/warehouse/warehouse-confirmation/warehouse-confirmation.component'
import { WholesaleOrderTableComponent } from './components/warehouse/warehouse-component/wholesale-order-table/wholesale-order-table.component'
import { FinanceInvoicePaymentComponent } from './components/finance/invoice/finance-invoice-payment/finance-invoice-payment.component'
import { TransportPlanNewComponent } from './components/transport/transport-plan-new/transport-plan-new.component'
import { DashboardUserInstructionComponent } from './components/dashboard/dashboard-user-instructions/dashboard-user-instructions.component'
import { OrderConsumerDetailDialogComponent } from './components/order/order-consumer-detail-dialog/order-consumer-detail-dialog.component'
import { OrderConsumerDetailEditComponent } from './components/order/order-consumer-detail-dialog/order-consumer-detail-edit/order-consumer-detail-edit.component'
import { InventoryInquiryHistoryComponent } from './components/inventory/inventory-inquiry-history/inventory-inquiry-history.component'

import { OrderConsumerDetailPhotocopyComponent } from './components/order/order-consumer-detail-dialog/order-consumer-detail-photocopy/order-consumer-detail-photocopy.component'
import { UserSettingsDialogComponent } from './components/dashboard/user-settings-dialog/user-settings-dialog.component'
import { AdminUserEditDialogComponent } from './components/admin/admin-user-edit-dialog/admin-user-edit-dialog.component'
import { PagesRepository } from './services/repository/pages.repository'
import { TransportPlanEditDialogComponent } from './components/transport/transport-plan-edit-dialog/transport-plan-edit-dialog.component'
import { InventoryInquiryOrderDetailComponent } from './components/inventory/inventory-inquiry-order-detail/inventory-inquiry-order-detail.component'
import { WarehousePickupOrderComponent } from './components/warehouse/warehouse-pickup-order/warehouse-pickup-order.component'
import { OrderConsumerDetailCancelDialogComponent } from './components/order/order-consumer-detail-cancel/order-consumer-detail-cancel-dialog.component'
import { TransportEndpoint } from './services/endpoints/transport.endpoint'
import { TransportPlanListComponent } from './components/transport/transport-plan-list/transport-plan-list.component'
import { WarehouseOutboundUndoComponent } from './components/warehouse/warehouse-outbound-undo/warehouse-outbound-undo.component'

import { MatTreeModule } from '@angular/material/tree'
import { AdminUsersListComponent } from './components/admin/admin-users-list/admin-users-list.component'
import { CdkTreeModule } from '@angular/cdk/tree'
import { TransportArriveConfirmDialogComponent } from './components/transport/transport-arrive-confirm-dialog/transport-arrive-confirm-dialog.component'
import { OrderTicketListComponent } from './components/order/order-ticket/order-ticket-list/order-ticket-list.component'
import { OrderTicketProcessDetailDialogComponent } from './components/order/order-ticket/order-ticket-process-detail-dialog/order-ticket-process-detail-dialog.component'
import { ClientDetailViewsComponent } from './components/client/client-detail-views/client-detail-views.component'
import { PickupOrderDialogComponent } from './components/warehouse/warehouse-component/pickup-order-dialog/pickup-order-dialog.component'
import { FinanceOrderCin7ExportComponent } from './components/finance/orders/finance-order-cin7-export/finance-order-cin7-export.component'
import { WarehouseDamageLoseComponent } from './components/warehouse/warehouse-damage-lose/warehouse-damage-lose.component'
import { NewLostEventComponent } from './components/warehouse/warehouse-damage-lose/new-lost-event/new-lost-event.component'
import { ProductQuantityComponent } from './components/warehouse/warehouse-damage-lose/new-lost-event/product-quantity/product-quantity.component'
import { OrderTicketCompleteDialogComponent } from './components/order/order-ticket/order-ticket-complete-dialog/order-ticket-complete-dialog.component'
import { OrderTicketNewDialogComponent } from './components/order/order-ticket/order-ticket-new/order-ticket-new-dialog.component'
import { NewTicketImageComponent } from './components/order/order-ticket/order-ticket-new/new-ticket-image/new-ticket-image.component'
import { OrderNumberInputComponent } from './components/order/order-ticket/order-ticket-new/order-number-input/order-number-input.component'
import { NewProductComponent } from './components/warehouse/warehouse-damage-lose/new-lost-event/new-product/new-product.component'
import { FinanceCreditManagementListComponent } from './components/finance/credit/finance-credit-management-list/finance-credit-management-list.component'
import { PurchaseOrderCreateComponent } from './components/finance/purchase/purchase-order-create/purchase-order-create.component'
import { PurchaseOrderStockinComponent } from './components/finance/purchase/purchase-order-stockin/purchase-order-stockin.component'
import { DatePipe } from '@angular/common'
import { FinanceOrderDialogComponent } from './components/finance/orders/finance-order-dialog/finance-order-dialog.component'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { SendProductEmailComponent } from './components/finance/products/send-product-email/send-product-email.component'
import { PurchaseOrderDialogComponent } from './components/inventory/inventory-inquiry-dialog/purchase-order-dialog/purchase-order-dialog.component'
import { WholesaleOrderDialogComponent } from './components/inventory/inventory-inquiry-dialog/wholesale-order-dialog/wholesale-order-dialog.component'
import { PropertyDialogComponent } from './components/inventory/inventory-inquiry-dialog/property-dialog/property-dialog.component'
import { TransportDialogComponent } from './components/inventory/inventory-inquiry-dialog/transport-dialog/transport-dialog.component'
import { BusinessTransferGenerateNewProductComponent } from './components/warehouse/business-transfer-generate/business-transfer-generate-new-product/business-transfer-generate-new-product.component'
import { ConsumerOrdersPredispatchNewComponent } from './components/warehouse/consumer-orders-predispatch-new/consumer-orders-predispatch-new.component'
import { SingleOrderTableComponent } from './components/warehouse/consumer-orders-predispatch-new/single-order-table/single-order-table.component'
import { GroupOrderTableComponent } from './components/warehouse/consumer-orders-predispatch-new/group-order-table/group-order-table.component'
import { PredispatchOrderTableComponent } from './components/warehouse/consumer-orders-predispatch-new/predispatch-order-table/predispatch-order-table.component'
import { ConsumerOrdersPredispatchStatusFiveComponent } from './components/warehouse/consumer-orders-predispatch-status-five/consumer-orders-predispatch-status-five.component'
import { SpecialCustomerDialogComponent } from './components/finance/products/special-customer-dialog/special-customer-dialog.component'
import { SpecialCustomerTableComponent } from './components/finance/products/special-customer-dialog/special-customer-table/special-customer-table.component'
import { SpecialCustomerItemDialogComponent } from './components/finance/products/special-customer-dialog/special-customer-item-dialog/special-customer-item-dialog.component'
import { PredispatchOrderFiveTableComponent } from './components/warehouse/consumer-orders-predispatch-status-five/predispatch-order-five-table/predispatch-order-five-table.component'
import { FinanceOrderCin7ImportComponent } from './components/finance/orders/finance-order-cin7-import/finance-order-cin7-import.component'
import { FinanceCreditImportComponent } from './components/finance/credit/finance-credit-import/finance-credit-import.component'
import { FinanceInvoiceUpdateComponent } from './components/finance/invoice/finance-invoice-update/finance-invoice-update.component'
import { InvoiceUpdateTableComponent } from './components/finance/invoice/finance-invoice-update/invoice-update-table/invoice-update-table.component'
import { InvoiceUpdateItemDialogComponent } from './components/finance/invoice/finance-invoice-update/invoice-update-item-dialog/invoice-update-item-dialog.component'
import { PriceSelectionDialogComponent } from './components/finance/products/finance-product-price-list/price-selection-dialog/price-selection-dialog.component'
import { WarehouseInventoryTransferNoticeComponent } from './components/warehouse/warehouse-inventory-transfer-notice/warehouse-inventory-transfer-notice.component'
import { TransportStockRealtimeDialogComponent } from './components/transport/transport-stock-realtime-dialog/transport-stock-realtime-dialog.component'
import { BusinessTransferShowComponent } from './components/warehouse/business-transfer-show/business-transfer-show.component'
import { OrderConsumerDetailInfoComponent } from './components/order/order-consumer-detail-dialog/order-consumer-detail-info/order-consumer-detail-info.component'
import { PriceExportDialogComponent } from './components/finance/products/finance-product-price-list/price-export-dialog/price-export-dialog.component'
import { ClientDashboardComponent } from './components/client/client-dashboard/client-dashboard.component'
import { TransferApplicationDialogComponent } from './components/inventory/inventory-inquiry-dialog/transfer-application-dialog/transfer-application-dialog.component'
import { BusinessTransferChangeComponent } from './components/warehouse/business-transfer-show/business-transfer-change/business-transfer-change.component'
import { ProductNameManagementComponent } from './components/product/product-name-management/product-name-management.component'
import { ClientNameManagementComponent } from './components/client/client-name-management/client-name-management.component'
import { NameManagementComponent } from './components/management/name-management/name-management.component'
import { ClientDetailSingleViewComponent } from './components/client/client-detail-views/client-detail-single-view/client-detail-single-view.component'
import { ClientDetailSingleViewPiechartComponent } from './components/client/client-detail-views/client-detail-single-view-piechart/client-detail-single-view-piechart.component'
import { EmailManagementDialogComponent } from './components/client/client-list/email-management-dialog/email-management-dialog.component'
import { ClientEmailItemDialogComponent } from './components/client/client-list/client-email-item-dialog/client-email-item-dialog.component'
import { AddressManagementDialogComponent } from './components/client/client-list/address-management-dialog/address-management-dialog.component'
import { AddressItemDialogComponent } from './components/client/client-list/address-item-dialog/address-item-dialog.component'
import { ClientSingleViewSumComponent } from './components/client/client-detail-views/client-single-view-sum/client-single-view-sum.component'
import { UserPasswordResetDialogComponent } from './components/dashboard/user-password-reset/user-password-reset-dialog.component'
import { BusinessTransferWarehouseListComponent } from './components/warehouse/business-transfer-generate/business-transfer-warehouse-list/business-transfer-warehouse-list.component'
import { PriceViewDialogComponent } from './components/finance/products/price-view-dialog/price-view-dialog.component'
import { BusinessTransferChangeWarehouseListComponent } from './components/warehouse/business-transfer-show/business-transfer-change-warehouse-list/business-transfer-change-warehouse-list.component'
import { InventoryViewComponent } from './components/inventory/inventory-view/inventory-view.component'
import { SelfGoodDialogComponent } from './components/inventory/inventory-inquiry-dialog/self-good-dialog/self-good-dialog.component'
import { InventoryClientPurchaseCreateDialogComponent } from './components/inventory/inventory-client-purchase-create-dialog/inventory-client-purchase-create-dialog.component'
import { TransportLogisticsInvoiceListComponent } from './components/transport/transport-logistics-invoice-list/transport-logistics-invoice-list.component'
import { CustomerGroupManagementComponent } from './components/management/customer-group-management/customer-group-management.component'
import { CustomerGroupNameDialogComponent } from './components/management/customer-group-management/customer-group-name-dialog/customer-group-name-dialog.component'
import { OrderHistorySearchComponent } from './components/order/order-history-search/order-history-search.component'
import { ClientDetailSingleViewExcelComponent } from './components/client/client-detail-views/client-detail-single-view-excel/client-detail-single-view-excel.component'
import { RuleCommentFromTextComponent } from './components/warehouse/consumer-orders-predispatch-status-five/rule-comment-from-text/rule-comment-from-text.component'
import { InventoryOutputManagementComponent } from './components/inventory/inventory-output-management/inventory-output-management.component'
import { ClientDashboardExcelComponent } from './components/client/client-dashboard/client-dashboard-excel/client-dashboard-excel.component'
import { ClientDashboardDescendingComponent } from './components/client/client-dashboard/client-dashboard-descending/client-dashboard-descending.component'
import { SupplierManagementComponent } from './components/management/supplier-management/supplier-management.component'
import { SupplierItemDialogComponent } from './components/management/supplier-management/supplier-item-dialog/supplier-item-dialog.component'
import { BaseProductMappingDialogComponent } from './components/product/base-product-mapping-dialog/base-product-mapping-dialog.component'
import { PlaceOfOrginManagementComponent } from './components/management/place-of-orgin-management/place-of-orgin-management.component'
import { DistributionRuleManagementComponent } from './components/management/distribution-rule-management/distribution-rule-management.component'
import { DistributionRuleDialogComponent } from './components/management/distribution-rule-management/distribution-rule-dialog/distribution-rule-dialog.component'
import { PageGroupManagementComponent } from './components/management/page-group-management/page-group-management.component'
import { PageGroupDialogComponent } from './components/management/page-group-management/page-group-dialog/page-group-dialog.component'
import { StockCustomerMappingManagementComponent } from './components/management/stock-customer-mapping-management/stock-customer-mapping-management.component'
import { StockCustomerMappingDialogComponent } from './components/management/stock-customer-mapping-management/stock-customer-mapping-dialog/stock-customer-mapping-dialog.component'
import { ProductCategoryManagementComponent } from './components/management/product-category-management/product-category-management.component'
import { NotificationConfigurationManagementComponent } from './components/management/notification-configuration-management/notification-configuration-management.component'
import { PageManagementDialogComponent } from './components/management/page-group-management/page-management-dialog/page-management-dialog.component'
import { PageManagementItemDialogComponent } from './components/management/page-group-management/page-management-dialog/page-management-item-dialog/page-management-item-dialog.component'
import { PredispatchUploadExcelComponent } from './components/warehouse/consumer-orders-predispatch-status-five/predispatch-upload-excel/predispatch-upload-excel.component'
import { TransferWarehouseTransportComponent } from './components/warehouse/business-transfer-generate/transfer-warehouse-transport/transfer-warehouse-transport.component'
import { PriceUpdateDialogComponent } from './components/finance/products/finance-product-price-list/price-update-dialog/price-update-dialog.component'
import { BulkCommentsModifyDialogComponent } from './components/warehouse/consumer-orders-predispatch-status-five/bulk-comments-modify-dialog/bulk-comments-modify-dialog.component'
import { TrackingInfoBatchUploadComponent } from './components/finance/tracking-info-batch-upload/tracking-info-batch-upload.component'
import { InvoiceUpdateDialogComponent } from './components/finance/invoice/finance-invoice-payment/invoice-update-dialog/invoice-update-dialog.component'
import { ChangeCustomerDialogComponent } from './components/order/order-consumer-detail-dialog/order-consumer-detail-edit/change-customer-dialog/change-customer-dialog.component'
import { WholesaleUpdateCommentDialogComponent } from './components/finance/invoice/finance-invoice-payment/wholesale-update-comment-dialog/wholesale-update-comment-dialog.component'
import { InventorySnapshotComponent } from './components/inventory/inventory-snapshot/inventory-snapshot.component';
import { WarehouseListFormarrayComponent } from './components/warehouse/warehouse-list-formarray/warehouse-list-formarray.component'

@NgModule({
  declarations: [
    ClientDetailDashboardComponent,
    ClientDetailTurnoverComponent,
    ClientDetailInventoryComponent,
    ClientDetailPreferenceComponent,
    ClientDetailNewComponent,
    ClientListComponent,
    ClientDetailEditComponent,
    ClientDetailViewsComponent,

    // InventoryClientDashboardComponent,
    InventoryClientPurchaseComponent,
    InventoryInquiryComponent,
    // InventoryTransferConfirmComponent,

    OrderConsumerGenerateComponent,
    OrderConsumerCancelComponent,
    OrderConsumerListComponent,
    OrderConsumerTransferComponent,
    OrderConsumerImportComponent,
    OrderConsumerSearchEditComponent,
    OrderConsumerDetailDialogComponent,
    OrderConsumerDetailEditComponent,
    OrderPresentComponent,
    OrderConsumerSearchComponent,
    OrderConsumerDetailCustomerServiceComponent,
    OrderConsumerDetailCancelDialogComponent,
    OrderTicketCompleteDialogComponent,
    OrderTicketNewDialogComponent,
    NewTicketImageComponent,

    WarehouseListComponent,
    TransferListComponent,
    ConsumerOrdersPaperComponent,
    // ConsumerOrdersPredispatchComponent,
    BusinessTransferGenerateComponent,
    // BusinessTransferSettingComponent,
    ConsumerOrdersPaperReceiveComponent,
    WarehouseListDialogComponent,
    WarehouseOutboundComponent,
    WarehouseInventoryTransferComponent,

    // FinanceInvoiceSalesComponent,
    FinanceOrderAuthoriseComponent,
    FinanceProductPriceListComponent,
    FinanceInvoicePaymentComponent,
    FinanceInvoiceGenerateComponent,
    FinanceOrderCin7ExportComponent,
    FinanceCreditManagementListComponent,
    FinanceOrderDialogComponent,

    ProductListComponent,
    ProductDetailEditComponent,

    ManagementInventoryDashboardComponent,

    AdminUserAccessSettingComponent,

    DashboardComponent,
    DashboardUserInstructionComponent,

    WarehouseConfirmationComponent,

    WholesaleOrderTableComponent,

    TransportPlanNewComponent,
    TransportPlanListComponent,

    TransportArriveConfirmDialogComponent,
    TransportPlanEditDialogComponent,
    TransportStockRealtimeDialogComponent,

    InventoryInquiryHistoryComponent,
    SendProductEmailComponent,

    OrderConsumerDetailPhotocopyComponent,
    AdminUsersListComponent,
    AdminUserEditDialogComponent,
    InventoryInquiryOrderDetailComponent,
    WarehousePickupOrderComponent,
    WarehouseOutboundUndoComponent,
    OrderTicketListComponent,
    OrderTicketProcessDetailDialogComponent,
    PickupOrderDialogComponent,
    WarehouseDamageLoseComponent,
    NewLostEventComponent,
    ProductQuantityComponent,
    OrderNumberInputComponent,
    NewProductComponent,
    PurchaseOrderCreateComponent,
    PurchaseOrderStockinComponent,
    WarehouseInventoryTransferNoticeComponent,
    PurchaseOrderDialogComponent,
    WholesaleOrderDialogComponent,
    PropertyDialogComponent,
    TransportDialogComponent,
    BusinessTransferGenerateNewProductComponent,
    ConsumerOrdersPredispatchNewComponent,
    SingleOrderTableComponent,
    GroupOrderTableComponent,
    PredispatchOrderTableComponent,
    ConsumerOrdersPredispatchStatusFiveComponent,
    SpecialCustomerDialogComponent,
    SpecialCustomerTableComponent,
    SpecialCustomerItemDialogComponent,
    PredispatchOrderFiveTableComponent,
    FinanceOrderCin7ImportComponent,
    FinanceCreditImportComponent,
    FinanceInvoiceUpdateComponent,
    InvoiceUpdateTableComponent,
    InvoiceUpdateItemDialogComponent,
    PriceSelectionDialogComponent,
    BusinessTransferShowComponent,
    OrderConsumerDetailInfoComponent,
    PriceExportDialogComponent,
    ClientDashboardComponent,
    TransferApplicationDialogComponent,
    BusinessTransferChangeComponent,
    ProductNameManagementComponent,
    ClientNameManagementComponent,
    NameManagementComponent,
    ClientDetailSingleViewComponent,
    ClientDetailSingleViewPiechartComponent,
    EmailManagementDialogComponent,
    ClientEmailItemDialogComponent,
    AddressManagementDialogComponent,
    AddressItemDialogComponent,
    UserSettingsDialogComponent,
    ClientSingleViewSumComponent,
    UserPasswordResetDialogComponent,
    BusinessTransferWarehouseListComponent,
    PriceViewDialogComponent,
    BusinessTransferChangeWarehouseListComponent,
    InventoryViewComponent,
    InventoryClientPurchaseCreateDialogComponent,
    SelfGoodDialogComponent,
    TransportLogisticsInvoiceListComponent,
    CustomerGroupManagementComponent,
    CustomerGroupNameDialogComponent,
    OrderHistorySearchComponent,
    ClientDetailSingleViewExcelComponent,
    RuleCommentFromTextComponent,
    InventoryOutputManagementComponent,
    ClientDashboardExcelComponent,
    ClientDashboardDescendingComponent,
    SupplierManagementComponent,
    SupplierItemDialogComponent,
    BaseProductMappingDialogComponent,
    PlaceOfOrginManagementComponent,
    DistributionRuleManagementComponent,
    DistributionRuleDialogComponent,
    PageGroupManagementComponent,
    PageGroupDialogComponent,
    StockCustomerMappingManagementComponent,
    StockCustomerMappingDialogComponent,
    ProductCategoryManagementComponent,
    NotificationConfigurationManagementComponent,
    PageManagementDialogComponent,
    PageManagementItemDialogComponent,
    PredispatchUploadExcelComponent,
    TransferWarehouseTransportComponent,
    PriceUpdateDialogComponent,
    BulkCommentsModifyDialogComponent,
    TrackingInfoBatchUploadComponent,
    InvoiceUpdateDialogComponent,
    ChangeCustomerDialogComponent,
    WholesaleUpdateCommentDialogComponent,
    InventorySnapshotComponent,
    WarehouseListFormarrayComponent,
  ],

  entryComponents: [
    InventoryClientPurchaseCreateDialogComponent,
    TransportPlanEditDialogComponent,
    TransportArriveConfirmDialogComponent,
    UserSettingsDialogComponent,
    ClientDetailEditComponent,
    OrderConsumerDetailDialogComponent,
    AdminUserEditDialogComponent,
    OrderConsumerDetailCancelDialogComponent,
    PickupOrderDialogComponent,
    OrderTicketCompleteDialogComponent,
    OrderTicketNewDialogComponent,
    FinanceOrderDialogComponent,
    TransportStockRealtimeDialogComponent,
    EmailManagementDialogComponent,
    ClientEmailItemDialogComponent,
    AddressManagementDialogComponent,
    AddressItemDialogComponent,
    UserPasswordResetDialogComponent,
    PriceViewDialogComponent,
    SelfGoodDialogComponent,
    CustomerGroupNameDialogComponent,
  ],

  providers: [
    ClientEndpoint,
    FinanceEndpoint,
    OrderEndpoint,
    ProductEndpoint,
    WarehouseEndpoint,
    InventoryEndpoint,
    AdminEndPoint,
    TransportEndpoint,
    PagesRepository,
    TableHelperService,
    DatePipe,
  ],

  imports: [
    CommonModule,
    RouterModule.forChild(PagesRoutes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CdkTableModule,
    NgxChartsModule,
    CommonComponentsModule,
    CdkTreeModule,
    MatTreeModule,
    DragDropModule,
  ],
})
export class PagesComponentsModule {}
