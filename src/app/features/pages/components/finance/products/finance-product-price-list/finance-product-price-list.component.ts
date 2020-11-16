import { Component, OnInit, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import * as moment from 'moment'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'
import { AppConfigStore } from '../../../../../../core/services/app-config.store'
import { ExportExcelComponent } from '../../../../../../shared/common-components/export-excel/export-excel.component'
import { UploadExcelComponent } from '../../../../../../shared/common-components/upload-excel/upload-excel.component'
import { FinanceEndpoint } from '../../../../services/endpoints/finance.endpoint'
import { ProductPriceExcelMapping } from '../../../../services/mappings/product-price-excel-mapping'
import { PriceViewDialogComponent } from '../price-view-dialog/price-view-dialog.component'
import { SendProductEmailComponent } from '../send-product-email/send-product-email.component'
import { SpecialCustomerDialogComponent } from '../special-customer-dialog/special-customer-dialog.component'
import { PriceExportDialogComponent } from './price-export-dialog/price-export-dialog.component'
import { PriceSelectionDialogComponent } from './price-selection-dialog/price-selection-dialog.component'
import { PriceUpdateDialogComponent } from './price-update-dialog/price-update-dialog.component'

@Component({
  selector: 'app-finance-product-price-list',
  templateUrl: './finance-product-price-list.component.html',
  styleUrls: ['./finance-product-price-list.component.css'],
})
export class FinanceProductPriceListComponent implements OnInit {
  @ViewChild('uploadExcel') child: UploadExcelComponent
  // 原始拿来的
  oldEffectiveDate: any
  newEffectiveDate: null
  beginDate: any
  endDate: any
  date = new FormControl(new Date())
  serializedDate = new FormControl(new Date().toISOString(), Validators.required)
  priceList: any
  priceListFA = new FormArray([])

  Form: any
  customPriceList: any

  // appconfig get mapping productCode list
  mappingProductCode: any

  submitData = {} as any
  submitExcelData = {} as any

  excelExportValue = []

  infoMessage = ''
  excelMapping: any
  // 数据从后台来时为 1
  // 数据从excel来时为2
  dataFrom: number
  // 保存table子组件的数据
  tableData: any
  // 是否展示table
  isShowTable = true
  allCustomers = []
  customerGroup: any
  submitEffectiveDate: any
  isEnableSave = false
  tableTypeColumns = []

  constructor(
    private financeEndpoint: FinanceEndpoint,
    private appConfigStore: AppConfigStore,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit(): void {
    this.customerGroup = this.appConfigStore.appSettings.Mapping.CustomerGroup1
    this.customerGroup.map((group: any) => {
      this.financeEndpoint
        ._getCustomerGroupEmailAddress(group.CutomerGroupId1)
        .toPromise()
        .then((value: any) => {
          value.map((item) => {
            this.allCustomers.push(item)
          })
        })
    })
    this.GetData(true, true, true, true, true)
  }

  priceUpdate() {
    const dialogRef = this.dialog.open(PriceUpdateDialogComponent, {
      data: {
        beginDate: this.beginDate,
        endDate: this.endDate,
      },
      width: '30%',
      autoFocus: false,
    })
    dialogRef.componentInstance.outputData.subscribe((result) => {
      if (result) {
        this.GetData(true, true, true, true, true)
      }
    })
  }

  priceSelection() {
    this.financeEndpoint
      ._GetPriceListHistoryDate()
      .toPromise()
      .then((res) => {
        const dialogRef = this.dialog.open(PriceSelectionDialogComponent, {
          data: res,
        })
        dialogRef.componentInstance.outputData.subscribe((result) => {
          if (result !== 'current') {
            this.beginDate = result.EffectiveDate
            this.endDate = result.ExpiryDate
          } else {
            this.beginDate = ''
            this.endDate = ''
          }
          this.GetData(true, true, true, true, true)
        })
      })
  }

  GetData(isRetial, isDg, isVip, isSvip, isUnknown) {
    this.dataFrom = 1
    this.priceListFA = new FormArray([])
    if (this.beginDate && this.endDate) {
      this.financeEndpoint._GetAllProductsPriceListHistoryByDate(this.beginDate, this.endDate).subscribe((res: any) => {
        this.sweetAlert.successAlert('Data extracted successfully！')
        if (res.length) {
          const typeArray = []
          res[0].PriceListDtos.map((value: any) => typeArray.push(value.CustomerGroupName))
          this.tableTypeColumns = typeArray
        }
        this.priceList = res
        console.log(this.priceList)
        this.getEffectiveDate()
        this.putDataIntoTable(this.priceList, isRetial, isDg, isVip, isSvip, isUnknown)
      })
    } else {
      this.financeEndpoint._getProductPriceList().subscribe((res: any) => {
        this.sweetAlert.successAlert('Data extracted successfully！')
        if (res.length) {
          const typeArray = []
          res[0].PriceListDtos.map((value: any) => typeArray.push(value.CustomerGroupName))
          this.tableTypeColumns = typeArray
        }
        this.priceList = res
        console.log(this.priceList)
        this.getEffectiveDate()
        this.putDataIntoTable(this.priceList, isRetial, isDg, isVip, isSvip, isUnknown)
      })
    }
  }

  getEffectiveDate() {
    this.dataFrom = 1
    this.oldEffectiveDate = this.getLocateDateString(this.priceList[0].PriceListDtos[0].EffectiveDate)
    console.log(this.oldEffectiveDate)
  }

  getLocateDateString(date) {
    return new Date(date.replace('T', ' ') + ' UTC')
  }

  // 后台数据进table
  putDataIntoTable(data, isRetial, isDg, isVip, isSvip, isUnknown) {
    // console.log(data)
    const tableContent = []
    this.mappingProductCode = this.appConfigStore.appSettings.ProductInfo.Products
    for (const i of data) {
      const ob = {} as any
      ob.effectiveDate = this.date
      ob.name = i.ProductName
      ob.productId = i.ProductId
      for (let q of i.PriceListDtos) {
        q = q.PriceHistories ? { Cin7Code: q.Cin7Code, CustomerGroupName: q.CustomerGroupName, ...q.PriceHistories[0] } : q
        ob.productEffectiveDate = this.getLocateDateString(q.EffectiveDate)
        // console.log(ob.productEffectiveDate)
        // console.log(ob.productExp)
        // console.log(q.ProductExp)
        ob.productExp = ob.productExp ? ob.productExp : q.ProductExp ? this.getLocateDateString(q.ProductExp) : ''
        // console.log(ob.productExp)
        // console.log('---------------------')
        ob.cinCode = q.Cin7Code
        if (q.CustomerGroupName === 'SVIP') {
          ob.SVIP = q.Price
        } else if (q.CustomerGroupName === 'DG') {
          ob.DG = q.Price
        } else if (q.CustomerGroupName === 'VIP') {
          ob.VIP = q.Price
        } else if (q.CustomerGroupName === 'Retail') {
          ob.Retail = q.Price
        } else if (q.CustomerGroupName === 'unknown') {
          ob.unknown = q.Price
        }
      }
      for (const n of this.mappingProductCode) {
        if (i.ProductId === n.ProductId) {
          ob.productCode = n.ProductCode
        }
      }
      tableContent.push(ob)
    }
    // console.log(tableContent)
    tableContent.forEach((e) => {
      this.priceListFA.push(this.buildFormTest(e))
    })
    this.tableData = this.priceListFA.controls
    // console.log(this.tableData)
    // 给table子组件传值
    this.isShowTable = false
    setTimeout(() => {
      this.isShowTable = true
    })
    this.excelExport(this.priceListFA.value, isRetial, isDg, isVip, isSvip, isUnknown)
  }

  buildFormTest(data) {
    this.Form = this.fb.group({
      name: [{ value: data.name, disabled: false }],
      productId: [{ value: data.productId, disabled: false }],
      productCode: [{ value: data.productCode, disabled: false }],
      cinCode: [data.cinCode ? data.cinCode : null],
      retail: [data.Retail === '停接' ? 0 : data.Retail],
      dg: [data.DG === '停接' ? 0 : data.DG],
      vip: [data.VIP === '停接' ? 0 : data.VIP],
      svip: [data.SVIP === '停接' ? 0 : data.SVIP],
      unknown: [data.unknown === '停接' ? 0 : data.unknown],
      date: [data.effectiveDate, Validators.required],
      productEffectiveDate: [data.productEffectiveDate],
      productExp: [data.productExp],
    })

    return this.Form
  }

  saveForm() {
    const dialogRef = this.dialog.open(PriceSelectionDialogComponent, {
      data: {
        isSaveForm: true,
      },
    })
    dialogRef.componentInstance.outputDataDate.subscribe((result) => {
      // 通过选择得出生效日期
      this.submitEffectiveDate = result
      // console.log(this.priceListFA)
      // console.log(this.priceList)
      // console.log(this.dataFrom)
      // 存后台数据
      if (this.dataFrom === 1) {
        this.manageData(this.priceListFA)
        this.financeEndpoint._updateProductPriceList(this.submitData).subscribe((_) => {
          this.sweetAlert.showSuccessMessage('Saved successfully！')
          this.GetData(true, true, true, true, true)
        })
      }
      // 存excel数据进后台
      if (this.dataFrom === 2) {
        this.mapPriceId(this.priceListFA)
        console.log(this.priceListFA.value)
        console.log(this.submitExcelData)
        this.financeEndpoint._updateProductPriceList(this.submitExcelData).subscribe((_) => {
          this.sweetAlert.showSuccessMessage('Saved successfully！')
          this.GetData(true, true, true, true, true)
        })
      }
    })
  }

  // servers data to servers
  manageData(data) {
    console.log(data)
    this.submitData.effectiveDate = ''
    this.submitData.updatePriceListDtos = []
    // console.log(data.value)
    for (const n of data.value) {
      const s = moment(n.date.value).utcOffset(720).format().substr(0, 10)
      this.submitData.effectiveDate = s
      for (const i of this.priceList) {
        if (i.ProductId === n.productId) {
          for (const k of Object.keys(n)) {
            const updatePrice = {} as any
            for (const q of i.PriceListDtos) {
              if (k.toUpperCase() === q.CustomerGroupName.toUpperCase()) {
                updatePrice.priceId = q.PriceId
                updatePrice.price = n[k]
                this.submitData.updatePriceListDtos.push(updatePrice)
              }
            }
          }
        }
      }
    }
    // console.log(this.submitData)
  }

  openSendEmail() {
    const dialogRef = this.dialog.open(SendProductEmailComponent, {
      width: '100%',
      height: '97%',
      data: this.allCustomers,
    })

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog was closed')
    })
  }

  openSpecialCustomer() {
    this.dialog.open(SpecialCustomerDialogComponent, {
      width: '100%',
      height: '97%',
    })
  }

  openPriceView() {
    this.dialog.open(PriceViewDialogComponent, {
      width: '100%',
      height: '97%',
      autoFocus: false,
    })
  }

  getUTCdate(dateString) {
    return dateString ? new Date(dateString).toISOString().replace(/\..+/, '') : dateString
  }

  excelDateConvertor(excelDate) {
    const date = new Date((excelDate - (25567 + 2)) * 86400 * 1000)
    let formatDate = this.getUTCdate(date)
    // 0723修改地方
    formatDate = formatDate.replace(/T\d\d/, 'T00')
    return formatDate
  }

  // excel表mapping进table
  excelOutput(event) {
    if (event.length) {
      this.isEnableSave = true
    }
    // console.log(event)
    this.dataFrom = 2
    this.priceListFA = new FormArray([])
    this.excelMapping = new ProductPriceExcelMapping()
    // event.map(row => {
    //   row['有效期'] = this.getUTCdate(row['有效期'])
    //   row['过期日期'] = this.getUTCdate(row['有效期'])
    // })
    for (const item of event) {
      if (typeof item['有效期'] === 'string' && item['有效期']) {
        // console.log('无效', item['有效期'])
        this.sweetAlert.showSweetAlert('Please change the type of 有效期Column from General to Date in Excel file!')
        return
      } else {
        // console.log(item['有效期'])
        item['有效期'] = item['有效期'] ? this.excelDateConvertor(item['有效期']) : item['有效期']
        // console.log(item['有效期'])
        // console.log('-------------')
      }
      if (typeof item['过期日期'] === 'string' && item['过期日期']) {
        // console.log('无效', item['过期日期'])
        this.sweetAlert.showSweetAlert('Please change the type of 过期日期Column from General to Date in Excel file!')
        return
      } else {
        // console.log(item['过期日期'])
        item['过期日期'] = item['过期日期'] ? this.excelDateConvertor(item['过期日期']) : item['过期日期']
        // console.log(item['过期日期'])
        // console.log('------过期日期-------')
      }
    }
    const list = this.excelMapping.mapping(event)
    // console.log(list)
    for (const i of list) {
      i.effectiveDate = this.date.value
    }
    // console.log(list)
    list.forEach((e) => {
      this.priceListFA.push(this.buildFormTest(e))
    })
    this.tableData = this.priceListFA.controls
    // 给table子组件传值
    // console.log(this.tableData)
    this.isShowTable = false
    setTimeout(() => {
      this.isShowTable = true
    })
    this.excelExport(this.priceListFA.value, true, true, true, true, true)
  }

  // excel data to servers
  mapPriceId(data) {
    console.log(data)
    // console.log(data.value)
    // console.log(this.priceList)
    // console.log(this.mappingProductCode)
    this.submitExcelData = {} as any
    this.submitExcelData.effectiveDate = this.submitEffectiveDate
    this.submitExcelData.updatePriceListDtos = []
    for (const n of data.value) {
      // const s = moment(n.date).utcOffset(720).format().substr(0, 10)
      // this.submitExcelData.effectiveDate = s
      // console.log(n)

      for (const m of this.mappingProductCode) {
        if (m.Cin7Code === n['Cin Code']) {
          const productId = m.ProductId
          // console.log(productId)
          for (const i of this.priceList) {
            // console.log(i)
            if (productId === i.ProductId) {
              for (const k of Object.keys(n)) {
                const updatePrice = {} as any
                for (const q of i.PriceListDtos) {
                  // console.log(q)
                  // console.log(k.toUpperCase())
                  // console.log(q.CustomerGroupName.toUpperCase())
                  // console.log('-----------')
                  if (
                    k.toUpperCase() === q.CustomerGroupName.toUpperCase() ||
                    (k.toUpperCase() === 'WFTB' && q.CustomerGroupName.toUpperCase() === 'UNKNOWN') ||
                    (k.toUpperCase() === '零售' && q.CustomerGroupName.toUpperCase() === 'RETAIL')
                  ) {
                    // console.log('sdfsdf')
                    if (n[k]) {
                      updatePrice.priceId = q.PriceId
                      updatePrice.price = n[k]
                      updatePrice.productExp = n['过期日期']
                      this.submitExcelData.updatePriceListDtos.push(updatePrice)
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    // console.log(this.submitExcelData)
  }

  excelExport(exportData, isRetial, isDg, isVip, isSvip, isUnknown) {
    // const currentDate = moment(new Date()).utcOffset(720).format().substr(0, 10)
    // exportData.splice(0, 0, {
    //   name: '纽币账户：  公司名称：Dairy Associate Limitd   银行账号：02-0290-0466975-000   银行：BNZ Bank',
    //   productCode: '',
    //   cinCode: '',
    //   retail: isRetial ? '零售' : '',
    //   dg: isDg ? 'DG' : '',
    //   vip: isVip ? 'VIP' : '',
    //   svip: isSvip ? 'SVIP' : '',
    //   unknown: isUnknown ? 'WFTB' : '',
    //   productEffectiveDate: '人民币二维码',
    // })
    // exportData.splice(1, 0, {
    //   name: currentDate,
    //   productCode: '从第四行开始正式导入数据',
    //   cinCode: '',
    //   retail: isRetial ? '零售' : '',
    //   dg: isDg ? 'DG' : '',
    //   vip: isVip ? 'VIP' : '',
    //   svip: isSvip ? 'SVIP' : '',
    //   unknown: isUnknown ? 'WFTB' : '',
    //   productEffectiveDate: '',
    // })

    for (const i of exportData) {
      delete i.date
      delete i.productId
      i['产品名称'] = i['name']
      delete i['name']
      // i['Product Code'] = i['productCode']
      delete i['productCode']
      i['Cin Code'] = i['cinCode']
      delete i['cinCode']
      if (isRetial) {
        i['零售'] = i['retail']
      }
      delete i['retail']
      if (isDg) {
        i['DG'] = i['dg']
      }
      delete i['dg']
      if (isVip) {
        i['VIP'] = i['vip']
      }
      delete i['vip']
      if (isSvip) {
        i['SVIP'] = i['svip']
      }
      delete i['svip']
      if (isUnknown) {
        i['WFTB'] = i['unknown']
      }
      delete i['unknown']
      i['有效期'] = i['productEffectiveDate']
      delete i['productEffectiveDate']
      i['过期日期'] = i['productExp']
      delete i['productExp']
    }

    this.excelExportValue = exportData
    console.log(exportData)
  }

  exportFileDialog() {
    if (!this.priceListFA.value.length) {
      this.sweetAlert.showSweetAlert('Price list is empty！')
      return
    }
    this.dialog.open(PriceExportDialogComponent, {
      data: this.priceListFA.value,
    })
  }
}
