import { Component, OnChanges, Input, ViewChild, Output, EventEmitter, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { FinanceEndpoint } from '../../pages/services/endpoints/finance.endpoint'
import { SweetAlertService } from '../../../core/alert/sweet-alert.service'
import { AppConfigStore } from '../../../core/services/app-config.store'
import { UserEndpoint } from '../../../core/endpoints/user.endpoint'
import * as moment from 'moment'

@Component({
  selector: 'app-order-change',
  templateUrl: './order-change.component.html',
})
export class OrderChangeComponent implements OnInit {
  form: FormGroup
  stockCustomerSelection = null
  displayStockCustomer = null
  @Input() data: any
  productList: any
  newProductDetails: any
  changeData = {}
  currentProductInfo: Object
  totalStockNeeded: any[]
  stockCustomerSelectable = []
  isNonDalProduct = false

  constructor(
    private formBuilder: FormBuilder,
    private appConfigStore: AppConfigStore,
    private userEndpoint: UserEndpoint,
    private sweetAlert: SweetAlertService,
    private financeEndpoint: FinanceEndpoint // @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit() {
    console.log(this.data)
    this.orderEditFormInit(this.data)
    console.log(this.appConfigStore.appSettings.ProductInfo.Products)
    this.isNonDalProduct =
      this.appConfigStore.appSettings.ProductInfo.Products.filter((row) => row.ProductId === this.data.ProductId)[0].ProductTypeId === 2
    // console.log('是否是Non-DAL：', this.isNonDalProduct)

    this.userEndpoint._getProductsList().subscribe((res) => {
      this.productList = res
    })
    this.getClientParentCompanyApi()

    this.form.controls.productId.valueChanges.subscribe((value) => {
      if (value) {
        this.isNonDalProduct = this.appConfigStore.appSettings.ProductInfo.Products.filter((row) => row.ProductId === value)[0].ProductTypeId === 2
        this.onProductChange(this.data.BillingCustomerId, value)
      }
    })
    this.form.controls.stockCustomerId.valueChanges.subscribe((value) => {
      if (value) this.onStockCustomerChange(this.stockCustomerSelection, value)
    })
  }

  onProductChange(customerId, productId) {
    let x = 'customerId=' + customerId + '&productId=' + productId + '&date=' + moment().format('YYYY-MM-DD')

    this.getProductPriceApiOnProductChange(x)
    // this.getStockApiOnProductChange(productId)
  }

  onStockCustomerChange(stockCustomers, value) {
    for (let sc in stockCustomers) {
      if (stockCustomers[sc].CustomerId == value) {
        this.displayStockCustomer = sc
        this.changeData['StockCustomerCode'] = stockCustomers[sc].CustomerCode
        this.changeData['StockCustomerInfo'] = stockCustomers[sc].CustomerName
      }
    }
  }

  // Create form
  orderEditFormInit(order) {
    this.form = this.formBuilder.group({
      stockCustomerId: [{ value: order.StockCustomerId, disabled: false }, Validators.required],
      productId: [{ value: order.ProductId, disabled: false }, Validators.required],
      orderPrice: [{ value: order.OrderPrice, disabled: false }, Validators.required],
      totalPrice: [{ value: order.TotalPrice, disabled: false }],
      // comment1: [{ value: order.Comment1, disabled: false }],
      // comment2: [{ value: order.Comment2, disabled: false }],
      comment3: [{ value: order.Comment3, disabled: false }],
      comment1: [{ value: order.Comment1, disabled: false }],
    })
    setTimeout(() => {
      this.productChangeStockUpdate()
    }, 400)
  }

  getProductPriceApiOnProductChange(x) {
    this.financeEndpoint._getOrderProductCustomerPrice(x).subscribe(
      (res) => {
        // console.log(res)
        if (!res) {
          if (!this.isNonDalProduct) {
            this.sweetAlert.showSweetAlert('Unable to find related product prices')
          }
        } else {
          this.resetPriceOnProductChange(res)
          this.getProductDetails()
          this.productChangeStockUpdate()
        }
      },
      (err) => {
        this.sweetAlert.showSweetAlert('Unable to find related product prices')
      }
    )
  }

  productChangeStockUpdate() {
    this.financeEndpoint._getFinanceBatchChangeStockByProductId(this.form.controls.productId.value).subscribe((res: [{}]) => {
      this.stockCustomerSelection = []
      // console.log(res)
      let xs = res.reduce((rv, x) => {
        ;(rv[x['CustomerId']] = rv[x['CustomerId']] || []).push(x)
        return rv
      }, {})
      this.getProductPackageDetails(xs)
    })
  }

  getProductPackageDetails(availableStock) {
    this.financeEndpoint._getFinanceProductPackageDetails(this.form.controls.productId.value).subscribe((res) => {
      let productDetails = res
      this.productStockCalculate(availableStock, productDetails)
    })
  }

  productStockCalculate(availableStock, productPackageDetails) {
    console.log({ availableStock: availableStock })
    console.log({ productPackageDetails: productPackageDetails })

    for (let stockCustomer in availableStock) {
      for (let stock of availableStock[stockCustomer]) {
        if (!stock.Sum) {
          stock['StockError'] = '库存不足'
        }
      }
      this.stockCustomerSelection.push(availableStock[stockCustomer])
    }

    // for (let stockCustomer in availableStock) {
    //   for (let stock of availableStock[stockCustomer]) {
    //     for (let stockNeeded of totalNeeded) {
    //       if (stock.BaseProductId == stockNeeded.baseProductId) {
    //         if (stock.Sum < stockNeeded.productRequired) {
    //           stock['StockError'] = '库存不足'
    //         }
    //       }
    //     }
    //   }
    //   this.stockCustomerSelection.push(availableStock[stockCustomer])
    // }
    console.log(this.stockCustomerSelection)
    this.processStockCustomerSelections()
  }

  processStockCustomerSelections() {
    for (let stockCustomer of this.stockCustomerSelection) {
      for (let customerId of this.data['ParentCustomerId']) {
        if (
          stockCustomer[0].CustomerId == customerId ||
          stockCustomer[0].CustomerId == this.data.StockCustomerId ||
          stockCustomer[0].CustomerId == this.data.BillingCustomerId ||
          stockCustomer[0].CustomerId == 446
        ) {
          this.stockCustomerSelectable.push(stockCustomer)
        }
      }
    }
    console.log(this.stockCustomerSelectable)

    // this.stockCustomerSelectable = [...new Set(this.stockCustomerSelectable.map(item => item[0].CustomerId))]

    this.stockCustomerSelectable = this.stockCustomerSelectable.filter((obj, pos, arr) => {
      return arr.map((mapObj) => mapObj[0].CustomerId).indexOf(obj[0].CustomerId) === pos
    })
    console.log(this.stockCustomerSelectable)
  }

  getClientParentCompanyApi() {
    this.data['ParentCustomerId'] = []
    this.financeEndpoint._getClientParentDetails(this.data['BillingCustomerId']).subscribe((res: []) => {
      console.log(res)
      for (let x of res) {
        this.data['ParentCustomerId'].push(x['CustomerId'])
      }
      // this.data['ParentCustomerId']
    })
  }

  getProductDetails() {
    this.financeEndpoint._getProductDetails(this.form.controls.productId.value).subscribe((res) => {
      this.currentProductInfo = res
    })
  }

  // getStockApiOnProductChange(productId) {
  //   this.financeEndpoint._getStocksByProductId(productId).subscribe((res) => {
  //     console.log(res)
  //     this.resetStockCustomer(res)
  //   })
  // }

  // resetStockCustomer(stockCustomers) {
  //   for (let cus in stockCustomers) {
  //     stockCustomers[cus]['stockAmount'] = 0
  //     if (this.form.controls.stockCustomerId.value == stockCustomers[cus]['CustomerId']) this.displayStockCustomer = cus
  //     for (let warehouse of stockCustomers[cus].StockInfos) {
  //       stockCustomers[cus]['stockAmount'] += warehouse.AvaliableQuantity
  //     }
  //   }
  //   this.stockCustomerSelection = stockCustomers
  //   console.log(this.stockCustomerSelection)
  //   console.log(this.form.controls.stockCustomerId)
  //   this.form.controls.stockCustomerId.setValue(this.form.controls.stockCustomerId.value)
  // }

  resetPriceOnProductChange(newProductData) {
    // this.newProductInfo = {}
    console.log(newProductData)
    this.newProductDetails = newProductData
    this.form.controls.totalPrice.setValue(newProductData.currentPrice)
    if (!this.isNonDalProduct) {
      this.form.controls.orderPrice.setValue(newProductData.currentPrice)
    } else {
      this.form.controls.orderPrice.setValue(null)
    }

    // this.newProductInfo['Uom'] = newProductData.Uom
    // this.newProductInfo['UnitPrice'] = newProductData.UnitPrice
  }

  saveData() {
    console.log(this.form)

    // this.changeData['Comment1'] = this.form.controls.comment1.value
    // this.changeData['Comment2'] = this.form.controls.comment2.value
    this.changeData['Comment3'] = this.form.controls.comment3.value
    this.changeData['Comment1'] = this.form.controls.comment1.value

    this.changeData['ProductId'] = this.form.controls.productId.value.value
      ? this.form.controls.productId.value.value
      : this.form.controls.productId.value
    this.changeData['OrderPrice'] = this.form.controls.orderPrice.value === null ? null : parseInt(this.form.controls.orderPrice.value, 10)
    this.changeData['TotalPrice'] = this.form.controls.totalPrice.value

    this.changeData['StockCustomerId'] = this.form.controls.stockCustomerId.value.value
      ? this.form.controls.stockCustomerId.value.value
      : this.form.controls.stockCustomerId.value

    this.changeData['IsChecked'] = +this.data.IsChecked
    this.changeData['IsApproved'] = +this.data.IsApproved

    if (this.newProductDetails) {
      for (let x of this.productList) {
        if (this.changeData['ProductId'] == x.ProductId) {
          this.changeData['ProductCode'] = x.ProductCode
          this.changeData['ProductName'] = x.ProductName
          this.changeData['Uom'] = this.newProductDetails.Uom
          this.changeData['UnitPrice'] = this.newProductDetails.UnitPrice
          break
        }
      }
    }

    return this.changeData
  }
}
