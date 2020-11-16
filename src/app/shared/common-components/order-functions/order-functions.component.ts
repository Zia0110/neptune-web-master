/*
 *   @Created Date: 14/04/2020
 *   @Modified Date: 22/04/2020
 *   @Author: Kenneth
 *   @Place: Auckland
 *
 *   - 控件使用说明：
 *     - 关于@Output() filteredValue：
 *       - 是包括在此控件4个Filter的信息的Json数据，被父组件具体的filter所引用
 *     - 关于@Input() isShowUpload = true 默认true
 *           @Input() isShowCustomer = true 默认true
 *           @Input() isShowStockCustomer = true 默认true
 *           @Input() isShowProject = false 默认false
 *           @Input() isShowProduct = true 默认true:
 *       - 可以选择是否需要批量搜索、客户、产品或者订单类型
 *     - 关于@Input() isExpand = false 默认是false合拢:
 *       - 可以选择默认是展开是合拢
 *     - 关于@Input() isSqueeze = true 默认true被压缩:
 *       - 可以选择是否横向压缩
 *
 *   - 例子：
 *     - in the html:
 *         <app-order-functions (filteredValue)="getFilteredValue($event)"></app-order-functions>
 *     - in the class:
 *         getFilteredValue(value: any) {
 *           if (this.dataSource) {
 *             this.dataSource.filter = value;
 *           }
 *         }
 *     - 在父组件内使用material table自带的filterPredicate方法来对接这个组件：
 *         this.dataSource.filterPredicate = this.createFilter();
 *     - createFilter函数的例子如下：
 *       -  这里的data指的是table里面1个row的数据。所以这里定义的是每个row的里面的搜索规则。
 *         createFilter(): (data: any, filter: string) => boolean {
 *           return function (data: any, filter: any): boolean {
 *             const searchTerms = JSON.parse(filter);
 *             return (
 *                (
 *                  data.position.toString().toLowerCase().indexOf(searchTerms.searchString) !== -1 ||
 *                  data.order.Concat.toString().toLowerCase().indexOf(searchTerms.searchString)
 *                ) !== -1
 *             );
 *           };
 *         }
 * */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatOption } from '@angular/material/core'
import { SweetAlertService } from '../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-order-functions',
  templateUrl: './order-functions.component.html',
  styleUrls: ['./order-functions.component.scss'],
})
export class OrderFunctionsComponent implements OnInit, OnChanges {
  @Input() isShowUpload = true
  @Input() isShowCustomer = true
  @Input() isShowStockCustomer = true
  @Input() isShowProject = false
  @Input() isShowProduct = true
  @Input() isShowGeneral = true
  @Input() isShowDatePicker = false
  @Input() isExpand = false
  @Input() isSqueeze = true
  @Input() isNewDate = true
  @Input() isFinance = false
  @Input() financeData = null
  @Input() financeCustomerArray = []
  @Input() dateLabel = ''
  @Input() isCin7Export = false
  @Input() isShowBatchSelection = true
  @Input() comment1Array = []
  @Input() comment2Array = []
  @Input() comment3Array = []
  @Input() isModifyPreDistribution = false
  divWith = 'width: 7%'
  @Output() filteredValue = new EventEmitter<any>()
  allFilter = new FormControl('')
  orderProjectNameFilter = new FormControl('')
  productIdSelected = new FormControl('')
  customerIdSelected = new FormControl('')
  stockCustomerIdSelected = new FormControl('')
  financeCustomers = new FormControl()
  comment1Arrays = new FormControl()
  comment2Arrays = new FormControl()
  comment3Arrays = new FormControl()
  isDisplayComment1 = new FormControl()
  isDisplayComment2 = new FormControl()
  isDisplayComment3 = new FormControl()
  isDisplayDispatchComment = new FormControl()
  isDisplayDispatchComment2 = new FormControl()
  isProductCheckEnough = new FormControl()
  isSelfStock = new FormControl()
  batchSelection = new FormControl()
  dateFormControl = new FormControl()

  // suspendedProducts = new FormControl('')
  // creditCondition = new FormControl('')

  creditConditionsArray = new FormControl('')
  productConditionsArray = new FormControl('')
  creditAllSelected = false
  productAllSelected = false
  // creditTypeFilters = [
  //   {
  //     key: 1, value: 'Value 1',
  //   },
  //   {
  //     key: 2, value: 'Value 2',
  //   },
  //   {
  //     key: 3, value: 'Value 3',
  //   },
  //   {
  //     key: 4, value: 'Value 4',
  //   }
  // ];

  orderProjectNameSelected: string
  animation = {
    enterDuration: 200,
    exitDuration: 300,
  }
  isDisplay = false
  filterValues = {
    searchString: '',
    orderProjectNameSelected: null,
    orderProductIdSelected: '',
    orderCustomerIdSelected: '',
    orderStockCustomerIdSelected: '',
    orderSuspendedProducts: '',
    orderCreditCondition: '',
    datePicker: '',
    financeCustomerArray: [],
    comment1Array: [],
    comment2Array: [],
    comment3Array: [],
    uploadTextArray: [],
    batchSelectionArray: [],
    isDisplayComment1: 0,
    isDisplayComment2: 0,
    isDisplayComment3: 0,
    isDisplayDispatchComment: 0,
    isDisplayDispatchComment2: 0,
    isProductCheckEnough: 0,
    isSelfStock: 0,
  }

  constructor(private sweetAlertService: SweetAlertService) {}
  @ViewChild('allSelected') private allSelected: MatOption

  ngOnChanges(changes) {
    if (this.financeData) {
      console.log(this.financeData)
    }
    if (changes.financeCustomerArray && changes.financeCustomerArray.currentValue.length) {
      this.financeCustomerArray = changes.financeCustomerArray.currentValue
    }
    if (changes.comment1Array && changes.comment1Array.currentValue.length) {
      this.comment1Array = changes.comment1Array.currentValue
    }
    if (changes.comment2Array && changes.comment1Array.currentValue.length) {
      this.comment1Array = changes.comment1Array.currentValue
    }
    if (changes.comment3Array && changes.comment1Array.currentValue.length) {
      this.comment1Array = changes.comment1Array.currentValue
    }
  }

  tosslePerOne(all) {
    console.log(this.productConditionsArray)
  }

  toggleAllSelection(control, allSelectValue, filterTarget, filterValue) {
    // console.log(allSelectValue)
    // allSelectValue = 1-allSelectValue
    if (!allSelectValue) {
      control.patchValue([...this.financeData[filterTarget].map((item) => item[filterValue])])
    } else {
      control.patchValue([])
    }
    console.log(this.productConditionsArray)
  }

  async ngOnInit() {
    this.divWith = this.isSqueeze ? 'width: 7%' : ''
    if (!this.isExpand) {
      this.applyDisplayStyle()
    }
    this.allFilter.valueChanges.subscribe((res) => {
      /*
       *   Here res is a string.
       * */
      this.filterValues.searchString = res
      this.filteredValue.emit(JSON.stringify(this.filterValues))
    })
    this.orderProjectNameFilter.valueChanges.subscribe((res) => {
      this.filterValues.orderProjectNameSelected = res ? parseFloat(res) : null
      this.filteredValue.emit(JSON.stringify(this.filterValues))
    })
    this.productIdSelected.valueChanges.subscribe((res) => {
      this.filterValues.orderProductIdSelected = res ? res : ''
      this.filteredValue.emit(JSON.stringify(this.filterValues))
    })
    this.customerIdSelected.valueChanges.subscribe((res) => {
      this.filterValues.orderCustomerIdSelected = res ? res : ''
      this.filteredValue.emit(JSON.stringify(this.filterValues))
    })
    this.stockCustomerIdSelected.valueChanges.subscribe((res) => {
      this.filterValues.orderStockCustomerIdSelected = res ? res : ''
      this.filteredValue.emit(JSON.stringify(this.filterValues))
    })
    this.productConditionsArray.valueChanges.subscribe((res) => {
      this.filterValues.orderSuspendedProducts = res ? res : ''
      this.filteredValue.emit(JSON.stringify(this.filterValues))
    })
    this.creditConditionsArray.valueChanges.subscribe((res) => {
      this.filterValues.orderCreditCondition = res ? res : ''
      this.filteredValue.emit(JSON.stringify(this.filterValues))
    })
    this.financeCustomers.valueChanges.subscribe((res) => {
      this.filterValues.financeCustomerArray = res ? res : []
      this.filteredValue.emit(JSON.stringify(this.filterValues))
    })
    this.comment1Arrays.valueChanges.subscribe((res) => {
      this.filterValues.comment1Array = res ? res : []
      this.filteredValue.emit(JSON.stringify(this.filterValues))
    })
    this.comment2Arrays.valueChanges.subscribe((res) => {
      this.filterValues.comment2Array = res ? res : []
      this.filteredValue.emit(JSON.stringify(this.filterValues))
    })
    this.comment3Arrays.valueChanges.subscribe((res) => {
      this.filterValues.comment3Array = res ? res : []
      this.filteredValue.emit(JSON.stringify(this.filterValues))
    })
    this.isDisplayComment1.valueChanges.subscribe((res) => {
      this.filterValues.isDisplayComment1 = res ? res : 0
      this.filteredValue.emit(JSON.stringify(this.filterValues))
    })
    this.isDisplayComment2.valueChanges.subscribe((res) => {
      this.filterValues.isDisplayComment2 = res ? res : 0
      this.filteredValue.emit(JSON.stringify(this.filterValues))
    })
    this.isDisplayComment3.valueChanges.subscribe((res) => {
      this.filterValues.isDisplayComment3 = res ? res : 0
      this.filteredValue.emit(JSON.stringify(this.filterValues))
    })
    this.isDisplayDispatchComment.valueChanges.subscribe((res) => {
      this.filterValues.isDisplayDispatchComment = res ? res : 0
      this.filteredValue.emit(JSON.stringify(this.filterValues))
    })
    this.isDisplayDispatchComment2.valueChanges.subscribe((res) => {
      this.filterValues.isDisplayDispatchComment2 = res ? res : 0
      this.filteredValue.emit(JSON.stringify(this.filterValues))
    })
    this.isProductCheckEnough.valueChanges.subscribe((res) => {
      this.filterValues.isProductCheckEnough = res ? res : 0
      this.filteredValue.emit(JSON.stringify(this.filterValues))
    })
    this.isSelfStock.valueChanges.subscribe((res) => {
      this.filterValues.isSelfStock = res ? res : 0
      this.filteredValue.emit(JSON.stringify(this.filterValues))
    })
    this.batchSelection.valueChanges.subscribe((res) => {
      this.filterValues.batchSelectionArray = res ? res : []
      this.filteredValue.emit(JSON.stringify(this.filterValues))
    })
    await this.dateFormControl.valueChanges.subscribe((res) => {
      this.filterValues.datePicker = res ? res : ''
      this.filteredValue.emit(JSON.stringify(this.filterValues))
    })
    if (this.isShowDatePicker) {
      if (this.isNewDate) {
        this.dateFormControl.setValue(new Date())
      }
    }
  }

  applyDisplayStyle() {
    if (!this.isDisplay) {
      this.isDisplay = true
      return {
        button: {
          color: 'rgba(0,0,0,1)',
        },
        display: {
          transition: 'max-height 0.1s ease-out',
          'max-height': '0',
          overflow: 'hidden',
          'margin-bottom': '2rem',
        },
      }
    } else {
      this.isDisplay = false
      return {
        button: {
          color: 'rgba(0,0,0,0.6)',
        },
        display: {
          'max-height': '100rem',
          'margin-bottom': '0',
          'transition-duration': '0.2s, 0.2s, 0.03s',
          'transition-property': 'margin-bottom, max-height, border',
        },
      }
    }
  }

  uploadTextToArray(value: any) {
    if (value.length) {
      this.sweetAlertService.successAlert2('Uploaded successfully！')
      this.filterValues.uploadTextArray = value
    } else {
      this.filterValues.uploadTextArray = []
    }
    this.filteredValue.emit(JSON.stringify(this.filterValues))
  }
}
