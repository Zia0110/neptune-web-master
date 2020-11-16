/*
 *   @Created Date: 14/04/2020
 *   @Modified Data: 13/05/2020
 *   @Author: Kenneth
 *   @Place: Auckland
 *
 *   - 介绍：
 *     - 此控件可供选择的数据资源类型有5种：
 *          1.产品、
 *          2.所有客户、
 *          3.Stock客户、
 *          4.所有仓库、
 *          5.通过ProductId来得到的对应的Stock仓库。
 *     - 此控件是懒加载控件，全app只需要请求一次api，页面直接切换也不受影响，不会重新请求api，提高了用户体验。
 *   - 控件使用说明：
 *     - 关于@Input data的类型：
 *       -  [data]='1' 表示 Product，
 *       -  [data]='2' 表示 Customer，
 *       -  [data]='3' 表示 Warehouse，
 *     - 关于@Input isStockCustomer：
 *       - 表示在[data]='2'的情况下，客户的类型是否属于StockCustomer，
 *       - 默认false
 *     - 关于@Input() isShowLabel：
 *       - 表示是否需要显示placeholder，
 *       - 有些情况下需要，如Filter；
 *       - 有些情况不需要，如Table里
 *       - 默认true
 *     - 关于@Input() isStockWarehouse：
 *       - 表示是否在批发的情况下使用仓库，
 *       - 默认false
 *     - 关于@Input() productIdStockWarehouse：
 *       - 如果isStockWarehouse为true，原则上此属性也应该需要
 *       - 如果需要同页面里的其他组件值的依赖，如依赖于product selection组件，
 *       - 则可以考虑使用*ngIf来实时传输值到attribute
 *     - 关于@Input() isReadOnly：
 *       - 如果需求是只读，可以考虑使用
 *     - 关于@Input() selectionPlaceholder：
 *       - 如果需要为用户显示提前设置好的名字，可以使用这个attribute
 *       - in the html
 *         <div *ngIf="selectionProduct.value">
 *           <app-search-selection
 *              [data]='3'
 *              [selectionPlaceholder]="'AwaRua儿童奶x3罐'"
 *              [isStockWarehouse]="true"
 *              [productIdStockWarehouse]="selectionProduct.value"
 *              [formControl]="selectionWarehouse"
 *           ></app-search-selection>
 *        </div>
 *     - 关于@Input() isRequiredValidator: 可以设置是否需要Form Control的Required Validator
 *     - 关于@Input() isBaseProduct: 是否是基础产品
 *     - @Input() isShowAllBaseProduct = false; 一般都是不显示baseId为0和1的
 *     - @Input() isOnlyShowChinaWarehouse = false; 是否只显示中国仓库
 *     - @Input() isOnlyShowAuAklWarehouse = false; 是否只显示澳洲和新西兰仓库
 *     - @Input() isOnlyDAL =  0; 0、全部  1、是否只显示DAL  2、或者非DAL
 *
 *
 *   - 例子
 *     - in the html:
 *       <app-search-selection
 *         [data]='2'
 *         [isStockCustomer]="true"
 *         [isShowLabel]="false"
 *         [formControl]="stockCustomerFormControl"
 *       ></app-search-selection>
 *
 *     - in the class
 *       stockCustomerFormControl = new FormControl('');
 *
 *     - then get the value of this form control
 *       console.log(this.stockCustomerFormControl.value)
 *
 * */
import { Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewEncapsulation } from '@angular/core'
import { AbstractControl, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms'
import { Observable } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
import { AppConfigStore } from '../../../core/services/app-config.store'
import { Customer } from './customer'
import { Product } from './product'
import { SearchSelectionServiceService } from './search-selection-service.service'
import { Warehouse } from './warehouse'

declare let Pinyin: any

@Component({
  selector: 'app-search-selection',
  templateUrl: './search-selection.component.html',
  styleUrls: ['./search-selection.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchSelectionComponent),
      multi: true,
    },
  ],
})
export class SearchSelectionComponent implements OnInit, ControlValueAccessor {
  @Input() data: number
  @Input() isStockCustomer = false
  @Input() isStockCustomerAvailableStock = false
  @Input() baseProductIdStockCustomerAvailableStock: number
  @Input() warehouseIdStockCustomerAvailableStock: number
  @Output() customerStock = new EventEmitter()
  @Input() isStockWarehouse = false
  @Input() productIdStockWarehouse: number
  @Input() baseProductIdStockWarehouse: number
  @Input() fromCustomerIdStockWarehouse: number
  @Input() isShowLabel = true
  @Input() selectionPlaceholder = ''
  @Input() pickedCustomerId: number
  @Input() isReadOnly = false
  @Input() isRequiredValidator = false
  @Input() errorStyles = false
  @Input() isBaseProduct = false
  @Input() isShowAllBaseProduct = false
  @Input() isOnlyShowChinaWarehouse = false
  @Input() isOnlyShowAuAklWarehouse = false
  @Input() isShowTransport = true
  @Input() isOnlyDal = 0
  isProduct = false
  isCustomer = false
  isWarehouse = false
  placeHolder: string
  isRequest = false
  public productsArray: Product[]
  public customersArray: Customer[]
  public warehousesArray: Warehouse[]
  searchBox = new FormControl('')
  productFilteredOptions: Observable<any>
  customerFilteredOptions: Observable<any>
  warehouseFilteredOptions: Observable<any>
  // tslint:disable-next-line:no-input-rename
  @Input('value') _value: any
  onChange: any = () => {}
  onTouched: any = () => {}

  get value() {
    return this._value
  }

  set value(val) {
    this._value = val
    this.onChange(val)
    this.onTouched()
  }

  constructor(private searchSelectionServiceService: SearchSelectionServiceService, public appConfigStore: AppConfigStore) {}

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  writeValue(value: any): void {
    if (value) {
      this.value = value
    }
  }

  ngOnInit() {
    if (this.isRequiredValidator) {
      this.searchBox.setValidators([Validators.required, this.modelRangeValidator])
    } else {
      this.searchBox.setValidators([this.modelRangeValidator])
    }
    this.searchBox.valueChanges.subscribe((res) => {
      if (res.CustomerId) {
        if (this.isStockCustomerAvailableStock) {
          this.value = res
        } else {
          this.value = res.CustomerId
        }
        this.customerStock.emit(res)
      } else if (res.ProductId || res.ProductId === 0) {
        this.value = res.ProductId
      } else if (res.WarehouseId) {
        this.value = this.isStockWarehouse
          ? {
              WarehouseId: res.WarehouseId,
              TransportId: res.TransportId || null,
            }
          : res.WarehouseId
      } else {
        this.value = ''
      }
    })
    switch (this.data) {
      case 1:
        this.isProduct = true
        this.isCustomer = false
        this.isWarehouse = false
        this.placeHolder = 'Select a product...'
        break
      case 2:
        this.isProduct = false
        this.isCustomer = true
        this.isWarehouse = false
        this.placeHolder = 'Select a customer...'
        break
      case 3:
        this.isProduct = false
        this.isCustomer = false
        this.isWarehouse = true
        this.placeHolder = 'Select a warehouse...'
        break
      default:
        break
    }
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnChanges(changes) {
    // console.log(this.errorStyles)
    if (changes['pickedCustomerId']) {
      const previousCustomerId = changes['pickedCustomerId']['previousValue']
      const currentCustomerId = changes['pickedCustomerId']['currentValue']
      if (previousCustomerId !== currentCustomerId) {
        this.searchBox.setValue('')
      }
    }
  }

  modelRangeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (
      control.value.BaseProductId ||
      control.value.BaseProductId === 0 ||
      control.value.ProductId ||
      control.value.ProductId === 0 ||
      control.value.CustomerId ||
      control.value.WarehouseId ||
      control.value.TransportId ||
      !control.value ||
      control.value === ' '
    ) {
      return null
    }
    return { modelRange: true }
  }

  async getData() {
    if (!this.isRequest) {
      this.isRequest = true
      switch (this.data) {
        case 1:
          let products: any = []
          if (this.isBaseProduct) {
            products = this.searchSelectionServiceService.getBaseProductData()
            if (!products.length) {
              await this.searchSelectionServiceService
                .getBaseProductDataPromise()
                .toPromise()
                .then((res) => {
                  products = res
                })
            }
            if (!this.isShowAllBaseProduct) {
              products = products.filter((row) => row.BaseProductId !== 0 && row.BaseProductId !== 1)
            }
            this.productsArray = this.convertJsonObjsToProducts(products)
            this.productFilteredOptions = this.searchBox.valueChanges.pipe(
              startWith(''),
              map((searchedValue: string) => {
                if (searchedValue === ' ') {
                  return this.productFilter('')
                }
                return this.productFilter(searchedValue)
              })
            )
          } else {
            products = this.searchSelectionServiceService.getProductData()
            if (!products.length) {
              await this.searchSelectionServiceService
                .getProductDataPromise()
                .toPromise()
                .then((res) => {
                  products = res
                })
            }
            this.productsArray = this.convertJsonObjsToProducts(products)
            this.productFilteredOptions = this.searchBox.valueChanges.pipe(
              startWith(''),
              map((searchedValue: string) => {
                if (searchedValue === ' ') {
                  return this.productFilter('')
                }
                return this.productFilter(searchedValue)
              })
            )
          }
          break
        case 2:
          let customers: any = []
          if (!this.isStockCustomer) {
            customers = this.searchSelectionServiceService.getCustomerData()
            if (!customers.length) {
              await this.searchSelectionServiceService
                .getCustomerDataPromise()
                .toPromise()
                .then((res) => {
                  customers = res
                })
            }
          } else {
            if (this.isStockCustomerAvailableStock) {
              if (!this.baseProductIdStockCustomerAvailableStock || !this.warehouseIdStockCustomerAvailableStock) {
                break
              }
              await this.searchSelectionServiceService
                .getStockByBaseProductId(this.baseProductIdStockCustomerAvailableStock)
                .toPromise()
                .then((res: any) => {
                  res.map((row: any) => {
                    if (row.StockInfos.filter((item) => item.WarehouseId === this.warehouseIdStockCustomerAvailableStock)[0]) {
                      customers.push({
                        FirstName: row.FirstName ? row.FirstName : 'First Name',
                        Stock: row.StockInfos.filter((item) => item.WarehouseId === this.warehouseIdStockCustomerAvailableStock)[0].AvaliableQuantity,
                        ...row,
                      })
                    }
                  })
                  console.log(customers)
                })
            } else {
              customers = this.searchSelectionServiceService.getStockCustomerData()
              if (!customers.length) {
                await this.searchSelectionServiceService
                  .getStockCustomerDataPromise()
                  .toPromise()
                  .then((res) => {
                    customers = res
                  })
              }
            }
          }
          let tempCustomer = customers
          if (this.isOnlyDal === 1) {
            tempCustomer = customers.filter((e) => e.CustomerId === 446)
          } else if (this.isOnlyDal === 2) {
            tempCustomer = customers.filter((e) => e.CustomerId !== 446)
          }
          this.customersArray = this.convertJsonObjsToCustomers(tempCustomer)
          this.customerFilteredOptions = this.searchBox.valueChanges.pipe(
            startWith(''),
            map((searchedValue: string) => {
              if (searchedValue === ' ') {
                return this.customerFilter('')
              }
              return this.customerFilter(searchedValue)
            })
          )
          break
        case 3:
          let warehouses: any = []
          if (!this.isStockWarehouse) {
            warehouses = this.searchSelectionServiceService.getWarehouseData()
            if (!warehouses.length) {
              await this.searchSelectionServiceService
                .getWarehouseDataPromise()
                .toPromise()
                .then((res) => {
                  warehouses = res
                })
            }
            if (this.isOnlyShowChinaWarehouse && !this.isOnlyShowAuAklWarehouse) {
              warehouses = warehouses.filter((row) => row.WarehouseTypeId === 1)
            }
            if (this.isOnlyShowAuAklWarehouse && !this.isOnlyShowChinaWarehouse) {
              warehouses = warehouses.filter((row) => row.WarehouseTypeId !== 1)
            }
          } else {
            if (this.productIdStockWarehouse) {
              await this.searchSelectionServiceService
                .getStockWarehouseDataPromise(this.productIdStockWarehouse)
                .toPromise()
                .then((res: any) => {
                  if (!this.isShowTransport) {
                    res.Transports = []
                  }
                  warehouses = res
                })
            } else if (this.baseProductIdStockWarehouse && this.fromCustomerIdStockWarehouse) {
              await this.searchSelectionServiceService
                .getStockWarehouseByBaseProductIdAndCustomerId(this.baseProductIdStockWarehouse, this.fromCustomerIdStockWarehouse)
                .toPromise()
                .then((res) => {
                  warehouses = res
                })
            } else {
              break
            }
          }
          this.warehousesArray = this.convertJsonObjsToWarehouses(warehouses)
          this.warehouseFilteredOptions = this.searchBox.valueChanges.pipe(
            startWith(''),
            map((searchedValue: string) => {
              if (searchedValue === ' ') {
                return this.warehouseFilter('')
              }
              return this.warehouseFilter(searchedValue)
            })
          )
          break
        default:
          break
      }
    }
  }

  // Convert json objects to Special Objects
  convertJsonObjsToWarehouses(jsonObjs): Warehouse[] {
    const res: Warehouse[] = []
    if (!this.isStockWarehouse) {
      for (const warehouse of jsonObjs) {
        const a_warehouse = new Warehouse()
        a_warehouse.WarehouseId = warehouse['WarehouseId']
        a_warehouse.WarehouseName = warehouse['WarehouseName']
        a_warehouse.WarehousePinyinFirstLetter = Pinyin.GetJP(warehouse.WarehouseName)
        a_warehouse.WarehouseFullPinyin = Pinyin.GetQP(warehouse.WarehouseName)
        res.push(a_warehouse)
      }
    } else {
      for (const warehouse of jsonObjs.Stock) {
        const a_warehouse = new Warehouse()
        a_warehouse.WarehouseId = warehouse['WarehouseId']
        a_warehouse.WarehouseName = warehouse['WarehouseName']
        a_warehouse.AvaliableStock = warehouse['AvaliableStock']
        a_warehouse.Quantity = warehouse['Quantity']
        a_warehouse.WarehousePinyinFirstLetter = Pinyin.GetJP(warehouse.WarehouseName)
        a_warehouse.WarehouseFullPinyin = Pinyin.GetQP(warehouse.WarehouseName)
        res.push(a_warehouse)
      }
      for (const warehouse of jsonObjs.Transports) {
        const a_warehouse = new Warehouse()
        a_warehouse.WarehouseId = warehouse['WarehouseId']
        // a_warehouse.WarehouseName = (warehouse['TransportNo'] + warehouse['TransportTypeName']).toString()
        a_warehouse.WarehouseName = warehouse['TransportNo'].toString()
        a_warehouse.TransportId = warehouse['TransportId']
        a_warehouse.Quantity = warehouse['Quantity']
        a_warehouse.AvaliableStock = warehouse['Quantity']
        a_warehouse.WarehousePinyinFirstLetter = Pinyin.GetJP(warehouse.TransportTypeName)
        a_warehouse.WarehouseFullPinyin = Pinyin.GetQP(warehouse.TransportTypeName)
        res.push(a_warehouse)
      }
    }
    return res
  }
  convertJsonObjsToProducts(jsonObjs): Product[] {
    const res: Product[] = []
    for (const product of jsonObjs) {
      const a_product = new Product()
      a_product.ProductId = this.isBaseProduct ? product['BaseProductId'] : product['ProductId']
      a_product.ProductName = product['ProductName']
      a_product.ProductCode = product['ProductCode']
      a_product.ProductPinyinFirstLetter = Pinyin.GetJP(product.ProductName)
      a_product.ProductFullPinyin = Pinyin.GetQP(product.ProductName)
      res.push(a_product)
    }
    return res
  }
  convertJsonObjsToCustomers(jsonObjs): Customer[] {
    const res: Customer[] = []
    for (const customer of jsonObjs) {
      if (!customer.CustomerName || !customer.FirstName) {
        continue
      }
      const a_customer = new Customer()
      a_customer.CustomerId = customer['CustomerId']
      a_customer.CustomerName = customer['CustomerName']
      a_customer.CustomerCode = customer['CustomerCode']
      a_customer.FirstName = customer['FirstName']
      if (this.isStockCustomerAvailableStock) {
        a_customer.Stock = customer['Stock']
      }
      a_customer.CustomerPinyinFirstLetter = Pinyin.GetJP(customer.CustomerName)
      a_customer.CustomerFirstNamePinyinFirstLetter = Pinyin.GetJP(customer.FirstName)
      a_customer.CustomerFullPinyin = Pinyin.GetQP(customer.CustomerName)
      a_customer.CustomerFirstNameFullPinyin = Pinyin.GetQP(customer.FirstName)
      res.push(a_customer)
    }
    return res
  }

  // To show the search result in the input
  showSearchResult(option: any) {
    // console.log(option)
    if (!option) {
      return ''
    }
    if (option.ProductId || option.ProductId === 0) {
      return option.ProductCode + ' -- ' + option.ProductName
    } else if (option.CustomerId) {
      console.log(this.isStockCustomerAvailableStock)
      if (this.isStockCustomerAvailableStock) {
        return option.CustomerCode + '（Stock：' + option.Stock + '） -- ' + option.FirstName + ' -- ' + option.CustomerName
      }
      return option.CustomerCode + ' -- ' + option.FirstName + ' -- ' + option.CustomerName
    } else if (option.WarehouseId) {
      return option.WarehouseName
    }
  }

  // To filter the user input
  warehouseFilter(searchedValue: string): any[] {
    return this.warehousesArray.filter((warehouse) => {
      const nameWarehouse = this.warehouseNameFilter(searchedValue, warehouse)
      const firstLetterOfPinyinWarehouse = this.warehouseFirstLetterOfPinyinFilter(searchedValue, warehouse)
      const fullPinyinWarehouse = this.warehouseFullPinyinFilter(searchedValue, warehouse)
      return nameWarehouse || firstLetterOfPinyinWarehouse || fullPinyinWarehouse
    })
  }
  productFilter(searchedValue: string): any[] {
    return this.productsArray.filter((product) => {
      const codeProduct = this.productNameAndCodeFilter(searchedValue, product)
      const firstLetterOfPinyinProduct = this.productFirstLetterOfPinyinFilter(searchedValue, product)
      const fullPinyinProduct = this.productFullPinyinFilter(searchedValue, product)
      return codeProduct || firstLetterOfPinyinProduct || fullPinyinProduct
    })
  }
  customerFilter(searchedValue: string): any[] {
    return this.customersArray.filter((customer) => {
      if (customer.CustomerName && customer.FirstName) {
        const codeCustomer = this.customerNameAndFnFilter(searchedValue, customer)
        const firstLetterOfPinyinCustomer = this.customerFirstLetterOfPinyinFilter(searchedValue, customer)
        const firstLetterOfPinyinCustomerFirstName = this.customerFirstNameFirstLetterOfPinyinFilter(searchedValue, customer)
        const fullPinyinCustomer = this.customerFullPinyinFilter(searchedValue, customer)
        const fullPinyinCustomerFirstName = this.customerFirstNameFullPinyinFilter(searchedValue, customer)
        return (
          codeCustomer || firstLetterOfPinyinCustomer || firstLetterOfPinyinCustomerFirstName || fullPinyinCustomer || fullPinyinCustomerFirstName
        )
      }
    })
  }

  // User searches full or part Name(English or Pinyin)
  warehouseNameFilter(searchedValue: string, warehouse: Warehouse) {
    const eachWarehouseName = warehouse.WarehouseName
    let resultWarehouse: any
    if (eachWarehouseName.includes(searchedValue) || eachWarehouseName.toLowerCase().includes(searchedValue)) {
      resultWarehouse = warehouse
    } else {
      resultWarehouse = ''
    }
    return resultWarehouse
  }
  productNameAndCodeFilter(searchedValue: string, product: Product) {
    const eachProductName = product.ProductName
    const eachProductCode = product.ProductCode
    let resultProduct: any
    if (
      eachProductName.includes(searchedValue) ||
      eachProductName.toLowerCase().includes(searchedValue) ||
      eachProductCode.includes(searchedValue) ||
      eachProductCode.toLowerCase().includes(searchedValue)
    ) {
      resultProduct = product
    } else {
      resultProduct = ''
    }
    return resultProduct
  }
  customerNameAndFnFilter(searchedValue: string, customer: Customer) {
    const eachCustomerName = customer.CustomerName
    const eachCustomerCode = customer.CustomerCode
    const eachCustomerFirstName = customer.FirstName
    let resultCustomer: any
    if (
      eachCustomerName.includes(searchedValue) ||
      eachCustomerName.toLowerCase().includes(searchedValue) ||
      eachCustomerCode.includes(searchedValue) ||
      eachCustomerCode.toLowerCase().includes(searchedValue) ||
      eachCustomerFirstName.includes(searchedValue) ||
      eachCustomerFirstName.toLowerCase().includes(searchedValue)
    ) {
      resultCustomer = customer
    } else {
      resultCustomer = ''
    }
    return resultCustomer
  }

  // Process for First Letter of Pinyin Filter
  warehouseFirstLetterOfPinyinFilter(searchedValue: string, warehouse: Warehouse) {
    return warehouse.WarehousePinyinFirstLetter.includes(searchedValue) ? warehouse : ''
  }
  productFirstLetterOfPinyinFilter(searchedValue: string, product: Product) {
    return product.ProductPinyinFirstLetter.includes(searchedValue) ? product : ''
  }
  customerFirstNameFirstLetterOfPinyinFilter(searchedValue: string, customer: Customer) {
    return customer.CustomerFirstNamePinyinFirstLetter.includes(searchedValue) ? customer : ''
  }
  customerFirstLetterOfPinyinFilter(searchedValue: string, customer: Customer) {
    return customer.CustomerPinyinFirstLetter.includes(searchedValue) ? customer : ''
  }

  // Process for Full Pinyin Filter
  warehouseFullPinyinFilter(searchedValue: string, warehouse: Warehouse) {
    return warehouse.WarehouseFullPinyin.toLowerCase().includes(searchedValue) || warehouse.WarehouseFullPinyin.includes(searchedValue)
      ? warehouse
      : ''
  }
  productFullPinyinFilter(searchedValue: string, product: Product) {
    return product.ProductFullPinyin.toLowerCase().includes(searchedValue) || product.ProductFullPinyin.includes(searchedValue) ? product : ''
  }
  customerFullPinyinFilter(searchedValue: string, customer: Customer) {
    return customer.CustomerFullPinyin.toLowerCase().includes(searchedValue) || customer.CustomerFullPinyin.includes(searchedValue) ? customer : ''
  }
  customerFirstNameFullPinyinFilter(searchedValue: string, customer: Customer) {
    return customer.CustomerFirstNameFullPinyin.toLowerCase().includes(searchedValue) || customer.CustomerFirstNameFullPinyin.includes(searchedValue)
      ? customer
      : ''
  }
}
