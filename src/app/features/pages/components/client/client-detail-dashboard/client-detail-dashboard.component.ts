import { Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation, OnInit } from '@angular/core'
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms'
import * as d3 from 'd3'
import { NgxChartsModule } from '@swimlane/ngx-charts'
import { BrowserModule } from '@angular/platform-browser'
import { barChartData } from './data'
import { gaugeChartData } from './data'
import { gaugeChart2Data } from './data'
import { MatTableDataSource } from '@angular/material/table'
import { MockData } from '../../../../../shared/mock-data'

@Component({
  selector: 'app-client-detail-dashboard',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './client-detail-dashboard.component.html',
  styleUrls: ['./client-detail-dashboard.component.css'],
})
export class ClientDetailDashboardComponent implements OnInit {
  //   Forms
  clientDetailForm: FormGroup
  UnhandledOrderForm = new FormArray([])
  RecentOrderForm = new FormArray([])
  HistoryOrderForm = new FormArray([])
  UnhandledOrders: {
    OrderDate: string
    OrderType: string
    OrderStatus: string
    OrderContact: string
    OrderAmount: number
    OrderAction: string
  }[]
  RecentOrders: {
    OrderDate: string
    OrderType: string
    OrderStatus: string
    OrderContact: string
    OrderAmount: number
    OrderAction: string
  }[]
  HistoryOrders: {
    OrderDate: string
    OrderType: string
    OrderStatus: string
    OrderContact: string
    OrderAmount: number
    OrderAction: string
  }[]

  // Charts
  barChartData: any
  gaugeChartData: any
  gaugeChart2Data: any
  barChartView: any[] = [350, 250]
  gaugeChartView: any[] = [350, 250]

  // BarChart Options
  showXAxis = true
  showYAxis = true
  gradient = false
  showLegend = false
  showXAxisLabel = true
  xAxisLabel = '月份'
  showYAxisLabel = true
  yAxisLabel = '销售额'

  // GaugeChart Options
  legend: boolean = false
  units = '%'
  smallSegments = 2

  barChartColorScheme = {
    domain: ['#26c6da'],
  }
  gaugeChartColorScheme1 = {
    domain: ['#26c6da'],
  }
  gaugeChartColorScheme2 = {
    domain: ['#B22222'],
  }

  //   Table
  displayedColumnsUnhandled: string[] = ['OrderDate', 'OrderType', 'OrderStatus', 'OrderContact', 'OrderAmount', 'OrderAction']
  displayedColumnsRecentMonth: string[] = ['OrderDate', 'OrderType', 'OrderStatus', 'OrderContact', 'OrderAmount', 'OrderAction']
  displayedColumnsHistory: string[] = ['OrderDate', 'OrderType', 'OrderStatus', 'OrderContact', 'OrderAmount', 'OrderAction']
  dataSourceOfUnhandledOrders: MatTableDataSource<unknown>
  dataSourceOfRecentOrders: MatTableDataSource<unknown>

  constructor(private fb: FormBuilder, public mockDataAPIService: MockData) {
    Object.assign(this, { barChartData })
    Object.assign(this, { gaugeChartData })
    Object.assign(this, { gaugeChart2Data })
  }

  ngOnInit(): void {
    this.getApiData()
    this.dataSourceOfUnhandledOrders = new MatTableDataSource(this.UnhandledOrderForm.controls)
    this.dataSourceOfRecentOrders = new MatTableDataSource(this.RecentOrderForm.controls)

    this.clientDetailForm = this.fb.group({
      clientName: [''],
      clientContact: [''],
      clientPhone: [''],
      clientEmail: [''],
      clientAddress: [''],
      clientBackupPhone: [''],
      clientComments: [''],
    })
  }

  getApiData() {
    this.UnhandledOrders = this.mockDataAPIService.getUnhandledOrders()
    this.RecentOrders = this.mockDataAPIService.getRecentOrders()
    this.getElementUnhandledOrders(this.UnhandledOrders)
    this.getElementRecentOrders(this.RecentOrders)
  }

  getElementUnhandledOrders(data) {
    data.forEach((element) => {
      console.log(element)
      this.UnhandledOrderForm.push(this.UnhandledOrderFormControl(element))
    })
  }

  getElementRecentOrders(data) {
    data.forEach((element) => {
      console.log(element)
      this.RecentOrderForm.push(this.RecentOrderFormControl(element))
    })
  }

  UnhandledOrderFormControl(formData1): FormGroup {
    return this.fb.group({
      OrderDate: { value: formData1.OrderDate, disabled: false },
      OrderType: { value: formData1.OrderType, disabled: false },
      OrderStatus: { value: formData1.OrderStatus, disabled: false },
      OrderContact: { value: formData1.OrderContact, disabled: false },
      OrderAmount: { value: formData1.OrderAmount, disabled: false },
      OrderAction: { value: formData1.OrderAction, disabled: false },
    })
  }

  RecentOrderFormControl(formData2): FormGroup {
    return this.fb.group({
      OrderDate: { value: formData2.OrderDate, disabled: false },
      OrderType: { value: formData2.OrderType, disabled: false },
      OrderStatus: { value: formData2.OrderStatus, disabled: false },
      OrderContact: { value: formData2.OrderContact, disabled: false },
      OrderAmount: { value: formData2.OrderAmount, disabled: false },
      OrderAction: { value: formData2.OrderAction, disabled: false },
    })
  }

  addRow() {
    this.UnhandledOrderForm.controls.push(
      this.fb.group({
        OrderDate: { value: '', disabled: false },
        OrderType: { value: '', disabled: false },
        OrderStatus: { value: '', disabled: false },
        OrderContact: { value: '', disabled: false },
        OrderAmount: { value: '', disabled: false },
        OrderAction: { value: '', disabled: false },
      })
    )
  }
}
