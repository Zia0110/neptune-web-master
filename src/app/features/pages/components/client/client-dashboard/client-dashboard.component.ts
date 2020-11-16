import { Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation, OnInit, ChangeDetectorRef } from '@angular/core'
import { NgxChartsModule } from '@swimlane/ngx-charts'
import { BrowserModule } from '@angular/platform-browser'
import { MatTableDataSource } from '@angular/material/table'
import { ClientEndpoint } from '../../../services/endpoints/client.endpoint'
import { FormControl } from '@angular/forms'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { ActivatedRoute } from '@angular/router'
import { MatTabGroup } from '@angular/material/tabs'
import { UserState } from '../../../../../core/user/user.state'
import * as moment from 'moment'
import { ClientDetailSingleViewExcelComponent } from '../client-detail-views/client-detail-single-view-excel/client-detail-single-view-excel.component'
import { MatDialog } from '@angular/material/dialog'
import { ClientDashboardExcelComponent } from './client-dashboard-excel/client-dashboard-excel.component'

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css'],
  // encapsulation: ViewEncapsulation.None
})
export class ClientDashboardComponent implements OnInit {
  retailPieData: any
  retailLineData: any

  wholesaleLineData: any
  wholesalePieData: any

  generalPieData: any
  generalLineData: any

  clientDatas = []

  selected = new FormControl(0)
  clientSelect = new FormControl(0)

  beginDate = moment(new Date()).subtract(3, 'months').format('YYYY-MM-DD')
  endDate = moment(new Date()).format('YYYY-MM-DD')

  @ViewChild('tabs', { static: false }) tabs: MatTabGroup

  public toDrawGeneralPieData: any[] = []
  public toDrawGeneralLineData: any[] = []

  public toDrawRetailPieData: any[] = []
  public toDrawRetailLineData: any[] = []

  public toDrawWholeSalePieData: any[] = []
  public toDrawWholeSaleLineData: any[] = []

  constructor(
    private userState: UserState,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private clientEndpoint: ClientEndpoint,
    private sweetalert: SweetAlertService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    let clientId = this.route.snapshot.paramMap.get('clientId')
    if (clientId && clientId != '0') {
      this.getClientIndiviualDataApi(clientId)
    } else {
      this.getClientsSellsDataApi()
    }
  }

  generalDateRangePickerOutput($event) {
    this.beginDate = $event.begin
    this.endDate = $event.end
    this.getClientsSellsDataApi()
  }

  clientDateRangePickerOutput($event) {
    this.beginDate = $event.begin
    this.endDate = $event.end
    let x = this.clientSelect.value
    this.clientSelect.patchValue(0)

    this.getClientIndiviualDataApi(x)
  }

  getClientsSellsDataApi() {
    let qp = 'beginDate=' + this.getUTCdate(this.beginDate) + '&endDate=' + this.getUTCdate(this.endDate)
    this.clientEndpoint._getClientsStats(qp).subscribe((res) => {
      if (!res['Retails'] && !res['WholeSales']) {
        return this.sweetalert.showSuccessMessage('No information on the day')
      }
      this.allClientsDataPrep(res)
    })
  }

  getUTCdate(dateString) {
    return new Date(dateString).toISOString().replace(/\..+/, '')
  }

  getClientIndiviualDataApi(clientId) {
    let qp = 'beginDate=' + this.getUTCdate(this.beginDate) + '&endDate=' + this.getUTCdate(this.endDate)
    this.clientEndpoint._getClientDashboardViewDetail(clientId, qp).subscribe((res) => {
      // console.log(res)
      this.clientDatas.push(res)
      this.tabNavigate()
    })
  }

  removeTab(index: number) {
    this.clientDatas.splice(index, 1)
  }

  removeWholesale() {
    this.wholesaleLineData = null
    this.wholesalePieData = null
  }

  removeRetail() {
    this.retailPieData = null
    this.retailLineData = null
  }

  removeGeneral() {
    this.generalPieData = null
    this.generalLineData = null
  }

  tabNavigate() {
    if (!this.tabs || !(this.tabs instanceof MatTabGroup)) return

    const tabCount = this.tabs._tabs.length

    this.tabs['_indexToSelect'] = tabCount
    this.cdr.detectChanges()

    // console.log(this.tabs)
  }

  reduceArray(datas) {
    let x = {}
    for (let data of datas) {
      if (data.CustomerId) {
        if (!x[data.CustomerId]) x[data.CustomerId] = []
        x[data.CustomerId].push(data)
      }
    }
    return x
  }

  allClientsDataPrep(datas) {
    // console.log(datas)

    let combinedData = []
    if (datas.WholeSales && datas.WholeSales.length && datas.Retails && datas.Retails.length) {
      combinedData = [...datas.WholeSales, ...datas.Retails]
    } else if (datas.WholeSales && datas.WholeSales.length) {
      combinedData = datas.WholeSales
    } else if (datas.Retails && datas.Retails.length) {
      combinedData = datas.Retails
    } else {
      return this.sweetalert.showSweetAlert('Time period No sales information！')
    }
    // if (datas.WholeSales.length ){combinedData.concat(datas.WholeSales)}
    // if (datas.Retails.length ){combinedData.concat(datas.Retails)}
    // console.log(combinedData)

    let generalGroup = this.reduceArray(combinedData)
    // let generalGroup = combinedData.reduce((res, obj) => {
    //   // if (obj.CustomerId) {
    //     res[obj.CustomerId] = [...(res[obj.CustomerId] || []), obj]
    //     return res
    //   // }
    // }, {})

    // console.log(generalGroup)

    let retailGroup = this.reduceArray(datas.Retails)
    // let retailGroup = datas.Retails.reduce((res, obj) => {
    //   // if (obj.CustomerId) {
    //   res[obj.CustomerId] = [...(res[obj.CustomerId] || []), obj]
    //   return res
    //   // }
    // }, {})
    // console.log(retailGroup)

    let wholesaleGroup = this.reduceArray(datas.WholeSales)
    // let wholesaleGroup = datas.WholeSales.reduce((res, obj) => {
    //   // if (obj.CustomerId) {
    //   res[obj.CustomerId] = [...(res[obj.CustomerId] || []), obj]
    //   return res
    //   // }
    // }, {})
    // console.log(wholesaleGroup)

    let generalGroupTotals = []
    let generalLineDatas = []
    for (let general in generalGroup) {
      if (generalGroup[general].length) {
        let nna = 0
        let eea = { name: generalGroup[general][0].CustomerName, series: [] }

        for (let x of generalGroup[general]) {
          nna += x.Prices
          eea.series.push({ name: new Date(x['Date']), value: x['Prices'] })
        }
        generalLineDatas.push(eea)
        generalGroupTotals.push({ name: generalGroup[general][0].CustomerName, value: nna })
      }
    }
    // console.log(generalGroupTotals)
    this.generalPieData = generalGroupTotals
    this.generalLineData = generalLineDatas

    //james
    // this.allGeneralPieData = generalGroupTotals
    // this.allGeneralLineData = generalLineDatas
    this.toDrawGeneralPieData = this.generalPieData
    this.toDrawGeneralLineData = this.generalLineData

    let retailGroupTotals = []
    let retailLineDatas = []
    for (let retail in retailGroup) {
      if (retailGroup[retail].length) {
        let nna = 0
        let eea = { name: retailGroup[retail][0].CustomerName, series: [] }

        for (let x of retailGroup[retail]) {
          nna += x.Prices
          eea.series.push({ name: new Date(x['Date']), value: x['Prices'] })
        }
        retailLineDatas.push(eea)
        retailGroupTotals.push({ name: retailGroup[retail][0].CustomerName, value: nna })
      }
    }
    // console.log(retailGroupTotals)
    this.retailPieData = retailGroupTotals
    this.retailLineData = retailLineDatas

    this.toDrawRetailPieData = this.retailPieData
    this.toDrawRetailLineData = this.retailLineData

    //james
    // this.allRetailPieData = retailGroupTotals
    // this.allRetailLineData = retailLineDatas
    // console.log(this.retailLineData)

    let wholesaleGroupTotals = []
    let wholesaleLineDatas = []
    for (let wholeSale in wholesaleGroup) {
      if (wholesaleGroup[wholeSale].length) {
        let nna = 0
        let eea = { name: wholesaleGroup[wholeSale][0].CustomerName, series: [] }
        for (let x of wholesaleGroup[wholeSale]) {
          nna += x.Prices
          eea.series.push({ name: new Date(x['Date']), value: x['Prices'] })
        }
        wholesaleLineDatas.push(eea)
        wholesaleGroupTotals.push({ name: wholesaleGroup[wholeSale][0].CustomerName, value: nna })
      }
    }
    // console.log(wholesaleGroupTotals)
    this.wholesalePieData = wholesaleGroupTotals
    this.wholesaleLineData = wholesaleLineDatas

    this.toDrawWholeSalePieData = this.wholesalePieData
    this.toDrawWholeSaleLineData = this.wholesaleLineData
    //james
    // this.allWholesalePieData = wholesaleGroupTotals
    // this.allWholesaleLineData = wholesaleLineDatas
  }

  //James, to add table and excel
  public showExcel(dataArray: any[], isRetail): void {
    // console.log(dataArray);
    // console.log(retailOrWholeSale)
    if (dataArray.length == 0) {
      this.sweetalert.showSweetAlert('No data！')
    } else {
      const dialogRef = this.dialog.open(ClientDashboardExcelComponent, {
        width: '1500px',
        height: '95%',
        data: {
          dataArray: dataArray,
          isRetail: isRetail,
        },
      })
    }
  }

  // public getUpdatedData(dataArray, type): void {
  //   console.log(dataArray)
  //   if (type == 'general') {
  //     console.log(type)
  //     this.generalPieData = dataArray[0];
  //     this.generalLineData = dataArray[1];
  //   } else if (type == 'retail') {
  //     console.log(type)
  //     this.retailPieData = dataArray[0];
  //     this.retailLineData = dataArray[1];
  //   } else {
  //     console.log(type)
  //     this.wholesalePieData = dataArray[0];
  //     this.wholesaleLineData = dataArray[1];
  //   }
  // }

  public getUpdatedData(dataArray, type): void {
    console.log(dataArray)
    if (type == 'general') {
      console.log(type)
      this.updateGeneralArray(dataArray)
      // this.toDrawGeneralPieData = dataArray[0];
      // this.toDrawGeneralLineData = dataArray[1];
    } else if (type == 'retail') {
      console.log(type)
      this.updateRetailArray(dataArray)
      // this.retailPieData = dataArray[0];
      // this.retailLineData = dataArray[1];
    } else {
      console.log(type)
      this.updateWholeSaleArray(dataArray)
      // this.justATest();
      // this.wholesalePieData = dataArray[0];
      // this.wholesaleLineData = dataArray[1];
    }
  }

  private updateGeneralArray(dataArray) {
    this.toDrawGeneralPieData = []
    this.toDrawGeneralLineData = []
    for (let eachData of dataArray[0]) {
      this.toDrawGeneralPieData.push(eachData)
    }
    for (let eachData of dataArray[1]) {
      this.toDrawGeneralLineData.push(eachData)
    }
  }

  private updateRetailArray(dataArray) {
    this.toDrawRetailPieData = []
    this.toDrawRetailLineData = []
    for (let eachData of dataArray[0]) {
      this.toDrawRetailPieData.push(eachData)
    }
    for (let eachData of dataArray[1]) {
      this.toDrawRetailLineData.push(eachData)
    }
  }

  private updateWholeSaleArray(dataArray): void {
    this.toDrawWholeSalePieData = []
    this.toDrawWholeSaleLineData = []
    for (let eachData of dataArray[0]) {
      this.toDrawWholeSalePieData.push(eachData)
    }
    for (let eachData of dataArray[1]) {
      this.toDrawWholeSaleLineData.push(eachData)
    }
  }

  private justATest(): void {
    var foo = [1, 2, 3]
    var bar = [1, 2, 3]
    var foo2 = foo
    var bar2 = bar
    foo = []
    bar.length = 0
    console.log(foo, bar, foo2, bar2)

    /*
    James
    answer: [] [] [1, 2, 3] []

    now foo has a new reference which means it has located a new memory. foo2 has no relationship with foo.
    this is the reason foo2 is still [1, 2, 3]

    bar.length = 0, it just clears the values in the array, the reference is not changing.
    this is why bar2 is empty coz bar has no values!
    they are pointing the same memory

    */

    /*
    James
    ngOnChanges only checks the reference, so when Input() array changes, it might not trigger it

    ngDoCheck checks everything, but it is triggered after we build the component. this is the reason why

    the variable's values have been changed but the table is not refreshing.

    */
  }
}
