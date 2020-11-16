import { NgModule } from '@angular/core'

import { DemoMaterialModule } from '../styles/demo-material-module'
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2'

import { MockData } from './mock-data'
import { AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective } from './accordion'
import { FormValidationDirective } from './directives/form-validation.directive'

import { DynamicTableComponent } from './presentational-components/dynamic-table/dynamic-table.component'
import { InputComponent } from './mirco-components/forms/input/input.component'
import { ButtonComponent } from './mirco-components/forms/button/button.component'
import { SelectComponent } from './mirco-components/forms/select/select.component'
import { DateComponent } from './mirco-components/forms/date/date.component'
import { RadiobuttonComponent } from './mirco-components/forms/radiobutton/radiobutton.component'
import { CheckboxComponent } from './mirco-components/forms/checkbox/checkbox.component'
import { DynamicFieldDirective } from './mirco-components/dynamic-field.directive'
import { DynamicFormComponent } from './presentational-components/dynamic-form/dynamic-form.component'
import { DynamicChartComponent } from './presentational-components/dynamic-chart/dynamic-chart.component'
import { DynamicButtonComponent } from './presentational-components/dynamic-button/dynamic-button.component'
import { SearchInputComponent } from './common-components/search-input/search-input.component'

import { SearchSelectionComponent } from './common-components/search-selection/search-selection.component'
import { from } from 'rxjs'
import { CardProductComponent } from './common-components/card-product/card-product.component'
import { CardCustomerComponent } from './common-components/card-customer/card-customer.component'
import { CardWarehouseComponent } from './common-components/card-warehouse/card-warehouse.component'
import { UploadTextComponent } from './common-components/upload-text/upload-text.component'
import { UploadExcelComponent } from './common-components/upload-excel/upload-excel.component'
import { SearchDatepickerComponent } from './common-components/search-datepicker/search-datepicker.component'
import { OrderTypePipe } from './pipes/order-type.pipe'
import { CreditTypePipe } from './pipes/credit-type.pipe'
import { OrderCurrencyPipe } from './pipes/order-currency.pipe'
import { OrderStatusPipe } from './pipes/order-status.pipe'
import { OrderProjectPipe } from './pipes/order-project.pipe'
import { CustomerCodePipe } from './pipes/customer-code.pipe'
import { WarehousePipe } from './pipes/warehouse.pipe'
import { ExportExcelComponent } from './common-components/export-excel/export-excel.component'
import { CommonChartComponent } from './common-chart/common-chart.component'
import { SimpleDropdownComponent } from './common-components/simple-dropdown/simple-dropdown.component'
import { OrderFunctionsComponent } from './common-components/order-functions/order-functions.component'
import { CustomMediumDatePipe } from './pipes/medium-date.pipe'
import { ImgPresentComponent } from './common-components/img-present/img-present.component'
import { TransportStatusPipe } from './pipes/transport-status.pipe'
import { TransportTypePipe } from './pipes/transport-type.pipe'
import { UtcToLocalDatePipe } from './pipes/utc-to-local-date.pipe'
import { WholesaleOrderComponent } from './common-components/wholesale-order/wholesale-order.component'
import { PlaceOfOriginPipe } from './pipes/place-of-origin-type.pipe'
import { AssignUserComponent } from './common-components/assign-user/assign-user.component'
import { CommentDialogComponent } from './common-components/comment-dialog/comment-dialog.component'
import { SearchDateRangePickerComponent } from './common-components/search-date-range-picker/search-date-range-picker.component'
import { ShowImagesComponent } from './common-components/show-images/show-images.component'
import { DeleteDialogComponent } from './common-components/delete-dialog/delete-dialog.component'
import { ClientPipe } from './pipes/client.pipe'
import { ProductPipe } from './pipes/product.pipe'
import { CardInventoryViewComponent } from './common-components/card-inventory-view/card-inventory-view.component'
import { ZoomSingleImageComponent } from './common-components/show-images/zoom-single-image/zoom-single-image.component'
import { BaseProductPipe } from './pipes/base-product.pipe'

@NgModule({
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    DynamicTableComponent,
    InputComponent,
    ButtonComponent,
    SelectComponent,
    DateComponent,
    RadiobuttonComponent,
    CheckboxComponent,
    DynamicFieldDirective,
    DynamicFormComponent,
    DynamicChartComponent,
    DynamicButtonComponent,
    SearchInputComponent,
    SearchSelectionComponent,
    UploadTextComponent,
    UploadExcelComponent,
    CardProductComponent,
    CardCustomerComponent,
    CardWarehouseComponent,
    CommonChartComponent,
    SearchDatepickerComponent,
    ImgPresentComponent,
    OrderTypePipe,
    OrderCurrencyPipe,
    CustomerCodePipe,
    WarehousePipe,
    OrderStatusPipe,
    OrderProjectPipe,
    ExportExcelComponent,
    SimpleDropdownComponent,
    OrderFunctionsComponent,
    CustomMediumDatePipe,
    TransportStatusPipe,
    TransportTypePipe,
    UtcToLocalDatePipe,
    PlaceOfOriginPipe,
    WholesaleOrderComponent,
    AssignUserComponent,
    SearchDateRangePickerComponent,
    CommentDialogComponent,
    ShowImagesComponent,
    CreditTypePipe,
    ClientPipe,
    ProductPipe,
    DeleteDialogComponent,
    CardInventoryViewComponent,
    ZoomSingleImageComponent,
    BaseProductPipe,
  ],

  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    DynamicTableComponent,
    DemoMaterialModule,
    SearchInputComponent,
    SearchSelectionComponent,
    FlexLayoutModule,
    DynamicFormComponent,
    DynamicButtonComponent,
    ImgPresentComponent,
    CardProductComponent,
    CardCustomerComponent,
    CardWarehouseComponent,
    CardInventoryViewComponent,
    UploadTextComponent,
    UploadExcelComponent,
    UploadTextComponent,
    CommonChartComponent,
    SearchDatepickerComponent,
    OrderTypePipe,
    OrderCurrencyPipe,
    OrderProjectPipe,
    OrderStatusPipe,
    CustomerCodePipe,
    WarehousePipe,
    ExportExcelComponent,
    SimpleDropdownComponent,
    OrderFunctionsComponent,
    CustomMediumDatePipe,
    TransportStatusPipe,
    PlaceOfOriginPipe,
    TransportTypePipe,
    UtcToLocalDatePipe,
    AssignUserComponent,
    SearchDateRangePickerComponent,
    CommentDialogComponent,
    CreditTypePipe,
    ShowImagesComponent,
    DeleteDialogComponent,
    ClientPipe,
    ProductPipe,
    BaseProductPipe,
  ],

  imports: [DemoMaterialModule, FlexLayoutModule, CommonModule, FormsModule, ReactiveFormsModule],

  providers: [MockData, FormValidationDirective],

  entryComponents: [
    DeleteDialogComponent,
    ShowImagesComponent,
    InputComponent,
    ButtonComponent,
    SelectComponent,
    DateComponent,
    RadiobuttonComponent,
    CheckboxComponent,
    CommentDialogComponent,
  ],
})
export class SharedModule {}
