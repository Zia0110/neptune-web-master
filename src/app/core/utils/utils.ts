// import { Swal } from 'sweetalert2';
import { SweetAlertService } from '../../core/alert/sweet-alert.service'
import { AppConfigStore } from '../services/app-config.store'
import { global } from '@angular/compiler/src/util'

export default class Utils {
  constructor(private sweetAlertService: SweetAlertService) {}
  alertHttpError = (err) => {
    if (err.error) {
      this.sweetAlertService.showSweetAlert(err.error['title'])
    } else this.sweetAlertService.showSweetAlert(err['message'])
  }
}

// export const debounce = () => {
//   let timeout = null
//   return (fn, delay) => {
//     if (timeout) {
//       clearTimeout(timeout)
//     }
//     timeout = setTimeout(() => {
//       fn()
//     }, delay)
//   }
// }
export const debounce = (time) => {
  if (!time) time = 800
  setTimeout(() => {}, time)
}

// use localStorage to store the authority info, which might be sent from server in actual project.
// export const getUserId = () => {
//   return sessionStorage.getItem('_userId')
// }

// export const setUserId = (_userId) => {
//   return sessionStorage.setItem('_userId', _userId)
// }

//use for table filtering
export const findStringInObj = (obj: object, str: string): boolean => {
  for (let [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') if (value.includes(str)) return true
  }
  return false
}

export const tableFilterFinanceOrderAuthorise = (data: any, filter: any): boolean => {
  // console.log(data, filter)
  const currentValue = data
  const selfStock =
    currentValue.StockInfos.filter((item) => currentValue.StockCustomerId === 446 && item.CustomerId === currentValue.BillingCustomerId)[0] &&
    currentValue.StockInfos.filter((item) => currentValue.StockCustomerId === 446 && item.CustomerId === currentValue.BillingCustomerId)[0].Sum
  const searchTerms = JSON.parse(filter)

  if (searchTerms.searchString != '') {
    if (!findStringInObj(currentValue, searchTerms.searchString)) return false
  }

  if (searchTerms.uploadTextArray.length) if (!searchTerms.uploadTextArray.includes(currentValue.OrderNo)) return false
  if (searchTerms.isProductCheckEnough === 1) if (!currentValue.IsEnoughStock) return false
  if (searchTerms.isProductCheckEnough === 2) if (currentValue.IsEnoughStock) return false
  if (searchTerms.isSelfStock === 1) if (selfStock === undefined || selfStock <= 0) return false
  if (searchTerms.isSelfStock === 2) if (selfStock === undefined || selfStock > 0) return false

  if (searchTerms.financeCustomerArray.length) if (!searchTerms.financeCustomerArray.includes(currentValue.BillingCustomerId)) return false

  if (searchTerms.orderProductIdSelected)
    if (searchTerms.orderProductIdSelected != '') if (currentValue.ProductId != searchTerms.orderProductIdSelected) return false

  if (searchTerms.datePicker)
    if (searchTerms.datePicker != '')
      if (currentValue.BillingDate != new Date(searchTerms.datePicker.replace(/T\d\d/, 'T12').slice(0, 19) + '-12:00').toISOString().slice(0, 19))
        return false

  if (searchTerms.orderProjectNameSelected)
    if (searchTerms.projectName != '') if (currentValue.ProjectId != searchTerms.orderProjectNameSelected) return false

  if (searchTerms.orderCustomerIdSelected)
    if (searchTerms.billingCustomerId != '') if (currentValue.BillingCustomerId != searchTerms.orderCustomerIdSelected) return false

  if (searchTerms.orderStockCustomerIdSelected)
    if (searchTerms.billingCustomerId != '') if (currentValue.StockCustomerId != searchTerms.orderStockCustomerIdSelected) return false

  if (searchTerms.orderSuspendedProducts.length) {
    if (!searchTerms.orderSuspendedProducts.includes(currentValue.ProductId) || currentValue.StockCustomerId != 446) {
      return false
    }
  }

  if (searchTerms.orderCreditCondition.length) {
    if (!searchTerms.orderCreditCondition.includes(currentValue.BillingCustomerId) || currentValue.StockCustomerId != 446) {
      return false
    }
  }

  // if (searchTerms.orderSuspendedProducts) {
  //   if (searchTerms.orderSuspendedProducts == '1') {
  //     if (!currentValue.ProductStatus || currentValue.ProductStatus != '停卖') {
  //       return false
  //     }
  //   }
  //   if (searchTerms.orderSuspendedProducts == '2') {
  //     if (currentValue.ProductStatus && currentValue.ProductStatus == '停卖') {
  //       return false
  //     }
  //   }
  // }

  // if (searchTerms.orderCreditCondition) {
  //   if (searchTerms.orderCreditCondition == '1') {
  //     if (!currentValue.CurrentCredit || !(currentValue.CurrentCredit < 0)) {
  //       return false
  //     }
  //   }
  //   if (searchTerms.orderCreditCondition == '2') {
  //     if (currentValue.CurrentCredit && currentValue.CurrentCredit < 0) {
  //       return false
  //     }
  //   }
  // }

  return true
}

export const tableFilterConsumerSearch = (data: any, filter: any): boolean => {
  // console.log(data, filter)
  const currentValue = data
  const searchTerms = JSON.parse(filter)

  if (searchTerms.searchString != '') {
    if (!findStringInObj(currentValue, searchTerms.searchString)) return false
  }

  if (searchTerms.uploadTextArray.length) if (!searchTerms.uploadTextArray.includes(currentValue.OrderNo)) return false

  if (searchTerms.comment1Array.length) if (!searchTerms.comment1Array.includes(currentValue.Comment1)) return false
  if (searchTerms.comment2Array.length) if (!searchTerms.comment2Array.includes(currentValue.Comment2)) return false
  if (searchTerms.comment3Array.length) if (!searchTerms.comment3Array.includes(currentValue.Comment3)) return false
  if (searchTerms.batchSelectionArray.length)
    if (!searchTerms.batchSelectionArray.includes('-' + currentValue.Reference[currentValue.Reference.length - 1])) return false

  if (searchTerms.orderProductIdSelected)
    if (searchTerms.orderProductIdSelected != '') if (currentValue.ProductId != searchTerms.orderProductIdSelected) return false

  if (searchTerms.orderProjectNameSelected)
    if (searchTerms.projectName != '') if (currentValue.ProjectId != searchTerms.orderProjectNameSelected) return false

  if (searchTerms.orderCustomerIdSelected)
    if (searchTerms.billingCustomerId != '') if (currentValue.BillingCustomerId != searchTerms.orderCustomerIdSelected) return false

  if (searchTerms.orderStockCustomerIdSelected)
    if (searchTerms.billingCustomerId != '') if (currentValue.StockCustomerId != searchTerms.orderStockCustomerIdSelected) return false

  return true
}

export const predispatchStatusFourSingleTable = (data: any, filter: any): boolean => {
  // console.log(data, filter)
  const currentValue = data
  const searchTerms = JSON.parse(filter)

  if (searchTerms.searchString != '') {
    if (!findStringInObj(currentValue, searchTerms.searchString)) return false
  }

  if (searchTerms.uploadTextArray.length) if (!searchTerms.uploadTextArray.includes(currentValue.OrderNo)) return false

  if (searchTerms.orderProductIdSelected)
    if (searchTerms.orderProductIdSelected != '') if (currentValue.ProductId != searchTerms.orderProductIdSelected) return false

  if (searchTerms.orderStockCustomerIdSelected)
    if (searchTerms.billingCustomerId != '') if (currentValue.StockCustomerId != searchTerms.orderStockCustomerIdSelected) return false

  return true
}

export const predispatchStatusFourGroupTable = (data: any, filter: any): boolean => {
  console.log(data, filter)
  const currentValue = data
  const searchTerms = JSON.parse(filter)

  if (searchTerms.searchString != '') {
    if (!findStringInObj(currentValue, searchTerms.searchString)) return false
  }

  if (searchTerms.orderProductIdSelected)
    if (searchTerms.orderProductIdSelected != '') if (currentValue.ProductId != searchTerms.orderProductIdSelected) return false

  if (searchTerms.orderStockCustomerIdSelected)
    if (searchTerms.billingCustomerId != '') if (currentValue.StockCustomerId != searchTerms.orderStockCustomerIdSelected) return false

  return true
}

export const predispatchStatusFiveSingleTable = (data: any, filter: any): boolean => {
  // console.log(data, filter)
  const currentValue = data
  const searchTerms = JSON.parse(filter)

  if (searchTerms.searchString != '') {
    if (!findStringInObj(currentValue, searchTerms.searchString)) return false
  }

  if (searchTerms.comment1Array.length) if (!searchTerms.comment1Array.includes(currentValue.Comment1)) return false
  if (searchTerms.comment2Array.length) if (!searchTerms.comment2Array.includes(currentValue.Comment2)) return false
  if (searchTerms.comment3Array.length) if (!searchTerms.comment3Array.includes(currentValue.Comment3)) return false
  if (searchTerms.isDisplayComment1 === 1) if (!currentValue.Comment1) return false
  if (searchTerms.isDisplayComment1 === 2) if (currentValue.Comment1) return false
  if (searchTerms.isDisplayComment2 === 1) if (!currentValue.Comment2) return false
  if (searchTerms.isDisplayComment2 === 2) if (currentValue.Comment2) return false
  if (searchTerms.isDisplayComment3 === 1) if (!currentValue.Comment3) return false
  if (searchTerms.isDisplayComment3 === 2) if (currentValue.Comment3) return false
  if (searchTerms.isDisplayDispatchComment === 1) if (!currentValue.DispatchComment) return false
  if (searchTerms.isDisplayDispatchComment === 2) if (currentValue.DispatchComment) return false
  if (searchTerms.isDisplayDispatchComment2 === 1) if (!currentValue.DispatchComment2) return false
  if (searchTerms.isDisplayDispatchComment2 === 2) if (currentValue.DispatchComment2) return false

  if (searchTerms.uploadTextArray.length) if (!searchTerms.uploadTextArray.includes(currentValue.OrderNo)) return false

  if (searchTerms.orderProductIdSelected)
    if (searchTerms.orderProductIdSelected != '') if (currentValue.ProductId != searchTerms.orderProductIdSelected) return false

  if (searchTerms.orderStockCustomerIdSelected)
    if (searchTerms.billingCustomerId != '') if (currentValue.StockCustomerId != searchTerms.orderStockCustomerIdSelected) return false

  return true
}

export const predispatchStatusFiveGroupTable = (data: any, filter: any): boolean => {
  const currentValue = data
  const searchTerms = JSON.parse(filter)

  if (searchTerms.searchString != '') {
    if (!findStringInObj(currentValue, searchTerms.searchString)) return false
  }

  if (searchTerms.orderProductIdSelected)
    if (searchTerms.orderProductIdSelected != '') if (currentValue.ProductId != searchTerms.orderProductIdSelected) return false

  if (searchTerms.orderStockCustomerIdSelected)
    if (searchTerms.billingCustomerId != '') if (currentValue.StockCustomerId != searchTerms.orderStockCustomerIdSelected) return false

  return true
}

export const tableOrderPaperReceiveSearch = (data: any, filter: any): boolean => {
  const currentValue = data
  const searchTerms = JSON.parse(filter)

  if (searchTerms.searchString != '') {
    if (!findStringInObj(currentValue, searchTerms.searchString)) return false
  }

  if (searchTerms.warehouse) if (searchTerms.warehouse != '') if (currentValue.WarehouseId != searchTerms.warehouse) return false

  if (searchTerms.batchStatus) if (searchTerms.batchStatus != '') if (currentValue.Status != searchTerms.batchStatus) return false

  return true
}

// Filters and selects only datas with the required value in column
// This requires The array of table-data, the column name for filtering, the required value
export const filterColumn = (tableData, column, requiredValue) => {
  let newDatas = []
  for (let data of tableData) {
    if (data[column] && data[column] == requiredValue) {
      newDatas.push(data)
    }
  }
  return newDatas
}
