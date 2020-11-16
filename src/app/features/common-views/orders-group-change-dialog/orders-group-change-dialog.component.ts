import { Component, OnChanges, Input, ViewChild, Output, EventEmitter, Inject, OnInit } from '@angular/core'
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { FinanceEndpoint } from '../../pages/services/endpoints/finance.endpoint'
import { SweetAlertService } from '../../../core/alert/sweet-alert.service'
import { AppConfigStore } from '../../../core/services/app-config.store'
import { UserEndpoint } from '../../../core/endpoints/user.endpoint'
import * as moment from 'moment'

@Component({
  selector: 'app-orders-group-change-dialog',
  templateUrl: './orders-group-change-dialog.component.html',
})
export class OrdersGroupChangeDialogComponent implements OnInit {
  orderDatas: any
  statInfo = {}
  form: FormGroup
  stockCustomerSelection = []
  viewRendered = false
  newPrice = []
  stockAvaliablity = []
  selectedProductId: any
  totalStockNeeded = []
  productShow = false
  clientShow = false
  configData: any
  currentProductInfo: Object
  currentStockCustomerInfo: Object

  constructor(
    private formBuilder: FormBuilder,
    private appConfigStore: AppConfigStore,
    private userEndpoint: UserEndpoint,
    private sweetAlert: SweetAlertService,
    private financeEndpoint: FinanceEndpoint,
    public dialogRef: MatDialogRef<OrdersGroupChangeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.configData = appConfigStore.appSettings
    this.totalStockNeeded = []
    this.stockAvaliablity = []
    this.newPrice = []
    this.statInfo = {}
    this.stockCustomerSelection = []
  }

  ngOnInit() {
    console.log({ orderDataChange: this.data })
    const data = this.data
    this.orderDatas = data
    let clientDatas = this.orderGroup(this.orderDatas, 'BillingCustomerId')
    this.statInfo['clients'] = clientDatas['ordersArray']
    this.statInfo['clientTypes'] = clientDatas['rawTypes']

    let productDatas = this.orderGroup(this.orderDatas, 'ProductId')
    this.statInfo['product'] = productDatas['ordersArray']
    this.statInfo['productTypes'] = productDatas['rawTypes']

    // if (this.statInfo['productTypes'].length == 1) {

    // }

    console.log(this.statInfo)
    this.ordersEditFormInit()
  }

  ordersEditFormInit() {
    this.form = this.formBuilder.group({
      newStockCustomerId: [{ value: null, disabled: false }],
      newProductId: [{ value: null, disabled: false }],
      addedPrice: [{ value: 0, disabled: false }, [Validators.max(9999), Validators.min(-99)]],
      newComment3: [{ value: '', disabled: false }, [Validators.maxLength(999)]],
    })

    this.form.controls.newProductId.valueChanges.subscribe((res) => {
      if (res) {
        this.selectedProductId = res
        this.productChangePriceUpdate(res)
      }
    })
    this.form.controls.addedPrice.valueChanges.subscribe((res) => {
      setTimeout(() => {
        this.orderChangeProductPrices()
      }, 1000)
    })
    this.form.controls.newStockCustomerId.valueChanges.subscribe((res) => {
      this.getStockCustomerDetails()
    })
  }

  productChangePriceUpdate(productId) {
    let queryDatas = {
      productId: productId,
      date: moment().format('YYYY-MM-DD'),
      customerIds: this.statInfo['clientTypes'],
    }

    this.financeEndpoint._getFinanceBatchChangeProductPricesByClientIds(queryDatas).subscribe((res: []) => {
      console.log(res)
      if (res) {
        this.newPrice = res
        this.productChangeStockUpdate()
        this.orderChangeProductPrices()
        this.getProductDetails()
      }
    })
  }

  orderChangeProductPrices() {
    for (let clientOrders of this.statInfo['clients']) {
      for (let order of clientOrders) {
        for (let price of this.newPrice) {
          if (order.BillingCustomerId == price.CustomerId) {
            // order.Uom = price.Uom
            // order.UnitPrice = price.UnitPrice
            order.NewPrice = price.currentPrice
            order.OrderPrice = price.currentPrice + this.form.controls.addedPrice.value
          }
        }
      }
    }
  }

  productChangeStockUpdate() {
    this.financeEndpoint._getFinanceBatchChangeStockByProductId(this.selectedProductId).subscribe((res: [{}]) => {
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
    this.financeEndpoint._getFinanceProductPackageDetails(this.selectedProductId).subscribe((res) => {
      let productDetails = res
      this.productStockCalculate(availableStock, productDetails)
    })
  }

  productStockCalculate(availableStock, productPackageDetails) {
    // Array of based products stock needed
    let totalNeeded = []
    const orderAmount = this.data.length

    // Calculate total amount needed for
    for (let baseProduct of productPackageDetails) {
      let requiredAmount = 0
      if (baseProduct.Uom) {
        requiredAmount = baseProduct.Uom * orderAmount
      } else if (baseProduct.Quantity) {
        requiredAmount = baseProduct.Quantity * orderAmount
      }
      totalNeeded.push({ baseProductId: baseProduct.BaseProductId, productRequired: requiredAmount, productName: baseProduct.ProductName })
    }
    this.totalStockNeeded = totalNeeded
    console.log(totalNeeded)
    console.log(availableStock)

    for (let stockCustomer in availableStock) {
      for (let stock of availableStock[stockCustomer]) {
        for (let stockNeeded of totalNeeded) {
          if (stock.BaseProductId == stockNeeded.baseProductId) {
            if (stock.Sum < stockNeeded.productRequired) {
              stock['StockError'] = '库存不足'
            }
          }
        }
      }
      this.stockCustomerSelection.push(availableStock[stockCustomer])
    }
    console.log(this.stockCustomerSelection)
  }

  orderGroup(datas, groupByProperty) {
    let ordersArray = []
    let obInQ = []
    let newData = datas.reduce((acc, obj) => {
      const key = obj[groupByProperty]
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(obj)
      return acc
    }, {})

    for (let x in newData) {
      ordersArray.push(newData[x])
      obInQ.push(x)
    }
    return { ordersArray: ordersArray, rawTypes: obInQ }
  }

  saveChanges() {
    for (let data of this.data) {
      // Price and Product
      if (this.newPrice.length) {
        for (let price of this.newPrice) {
          if (data.BillingCustomerId == price.CustomerId) {
            // Products
            if (this.form.controls.newProductId.value) {
              data.ProductId = this.form.controls.newProductId.value
              data.ProductName = this.currentProductInfo['ProductName']
              data.ProductCode = this.currentProductInfo['ProductCode']
              data.Uom = price.Uom
            }
            // Prices
            if (this.form.controls.newProductId.value) {
              data.TotalPrice = price.currentPrice
              data.UnitPrice = price.UnitPrice
              data.OrderPrice = price.currentPrice + this.form.controls.addedPrice.value
            }
          }
        }
      } else {
        data.OrderPrice = data.OrderPrice + this.form.controls.addedPrice.value
      }
      // Stock customer
      if (this.form.controls.newStockCustomerId.value) {
        data.StockCustomerId = this.form.controls.newStockCustomerId.value
        data.StockCustomerInfo = this.currentStockCustomerInfo['CustomerName']
        data.StockCustomerFirstName = this.currentStockCustomerInfo['FirstName']
        data.StockCustomerCode = this.currentStockCustomerInfo['CustomerCode']
      }
      // Comment
      if (this.form.controls.newComment3.value) {
        data.Comment3 = this.form.controls.newComment3.value
      }
    }

    console.log({ newData: this.data })
    this.dialogRef.close({ changed: true })
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.viewRendered = true
    }, 300)
  }

  getProductDetails() {
    this.financeEndpoint._getProductDetails(this.form.controls.newProductId.value).subscribe((res) => {
      this.currentProductInfo = res
    })
  }

  getStockCustomerDetails() {
    this.financeEndpoint._getClientDetails(this.form.controls.newStockCustomerId.value).subscribe((res) => {
      this.currentStockCustomerInfo = res
    })
  }

  // Controls the disabled button
  isFormSavable() {
    if (this.form.valid && this.form.dirty) {
      // Stock customer selection, check for stock validalty
      if (this.form.controls.newProductId.value && !this.form.controls.newStockCustomerId.value) {
        return false
      }
      // for (let xs of this.stockCustomerSelection) {
      //   for (let x of xs) {
      //     if (this.form.controls.newStockCustomerId.value == x.CustomerId) {
      //       if (x.StockError) {
      //         return false
      //       }
      //     }
      //   }
      // }
      return true
    } else {
      return false
    }
  }
}
