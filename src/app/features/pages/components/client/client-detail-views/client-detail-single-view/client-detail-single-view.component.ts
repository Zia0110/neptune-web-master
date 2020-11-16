import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'app-client-detail-single-view',
  templateUrl: './client-detail-single-view.component.html',
  styleUrls: ['./client-detail-single-view.component.css'],
})
export class ClientDetailSingleViewComponent implements OnInit {
  @Input() temRetailsArrayForChild
  @Input() temWholeSalesArrayForChild
  @Input() isRetail

  //for bar chart
  public retailResult: any[] = []
  public wholeSaleResult: any[] = []
  //for bar chart
  public retailPieChart: any[] = []
  public wholeSalePieChart: any[] = []
  colorScheme = {
    domain: ['#fcba03', '#fa5d02', '#fa0202', '#b3ff00', '#40ff00', '#00ffae', '#00b7ff', '#1e00ff', '#6f00ff', '#ff03ff'],
  }

  // view: any[] = [600, 400]
  legend: boolean = true
  gradient: boolean = true
  showLegend: boolean = true
  showLabels: boolean = true
  isDoughnut: boolean = false
  xAxis: boolean = true
  yAxis: boolean = true
  showYAxisLabel: boolean = true
  showXAxisLabel: boolean = true
  showXAxis: boolean = true
  showYAxis: boolean = true
  xAxisLabel: string = 'Date'
  yAxisLabel: string = 'Sales'
  timeline: boolean = true
  showDataLabel: boolean = true
  public legendTitle = 'Classification'

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (this.isRetail) {
      // console.log(this.temRetailsArrayForChild)
      this.buildDataForRetailGraph()
    } else {
      // console.log(this.temWholeSalesArrayForChild);
      this.buildDataForWholeSaleGraph()
    }
  }

  private buildDataForRetailGraph(): void {
    let newData = []
    for (let temRetail of this.temRetailsArrayForChild) {
      let tableObject = {
        name: '',
        value: 0,
      }
      for (let temRetailObject of temRetail) {
        tableObject.name = this.handleTime(temRetailObject.Date)
        tableObject.value += temRetailObject.Price
      }
      newData.push(tableObject)
    }
    this.retailResult = this.sortArray(newData)
  }

  private buildDataForWholeSaleGraph(): void {
    let newData = []
    for (let temWholeSale of this.temWholeSalesArrayForChild) {
      let tableObject = {
        name: '',
        value: 0,
      }
      for (let temWholeSaleObject of temWholeSale) {
        tableObject.name = this.handleTime(temWholeSaleObject.Date)
        tableObject.value += temWholeSaleObject.Price
      }
      newData.push(tableObject)
    }
    this.wholeSaleResult = this.sortArray(newData)
  }

  private sortArray(array) {
    return array.sort((a, b) => parseFloat(a.name.getTime()) - parseFloat(b.name.getTime()))
  }

  public retailSelect(event): void {
    console.log(this.temRetailsArrayForChild)
    console.log(event)
    let temArrayForPieChart: any[] = []
    for (let temRetail of this.temRetailsArrayForChild) {
      // if (this.handleTime(temRetail[0].Date) == event.name){

      for (let temRetailObject of temRetail) {
        let tableObject = {
          name: '',
          value: 0,
        }
        if (this.handleTime(temRetailObject.Date).getTime() != event.name.getTime()) {
          break
        } else {
          tableObject.name = temRetailObject.ProductName
          tableObject.value += temRetailObject.Price
        }
        temArrayForPieChart.push(tableObject)
      }
    }
    this.retailPieChart = temArrayForPieChart
    console.log(this.retailPieChart)
  }

  public wholeSaleSelect(event): void {
    console.log(this.temRetailsArrayForChild)
    console.log(event)
    let temArrayForPieChart: any[] = []
    for (let temWholeSale of this.temWholeSalesArrayForChild) {
      for (let temWholeSaleObject of temWholeSale) {
        let tableObject = {
          name: '',
          value: 0,
        }
        if (this.handleTime(temWholeSaleObject.Date).getTime() != event.name.getTime()) {
          break
        } else {
          tableObject.name = temWholeSaleObject.ProductName
          tableObject.value += temWholeSaleObject.Price
        }
        temArrayForPieChart.push(tableObject)
      }
    }
    this.wholeSalePieChart = temArrayForPieChart
  }

  private handleTime(date: string): any {
    // let resDate: string
    // let i = date.indexOf('T')
    // resDate = date.slice(0, i)
    let resDate = new Date(date)
    return resDate
  }
}
