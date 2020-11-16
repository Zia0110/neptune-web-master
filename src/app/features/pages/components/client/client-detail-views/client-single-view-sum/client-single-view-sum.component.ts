import { Component, OnInit, Input } from '@angular/core'
import { from } from 'rxjs'
import { groupBy, mergeMap, toArray } from 'rxjs/operators'

@Component({
  selector: 'app-client-single-view-sum',
  templateUrl: './client-single-view-sum.component.html',
  styleUrls: ['./client-single-view-sum.component.css'],
})
export class ClientSingleViewSumComponent implements OnInit {
  @Input() temSumArrayForChild: any[] = []
  public temSumArrayForBarChart: any[] = []
  public sumResult: any[] = []
  public temArray: any[] = []

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

  public sumPieChart: any[] = []

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    // console.log(this.temSumArrayForChild);
    this.setUpDataForSum()
    // console.log(this.temSumArrayForBarChart)
    this.setUpdataForTable()
  }

  private setUpDataForSum(): void {
    for (let detail of this.temSumArrayForChild) {
      for (let product of detail) {
        this.temArray.push(product)
      }
    }
    this.temSumArrayForBarChart = this.getArrayByDate(this.temArray)
  }

  private setUpdataForTable(): void {
    let newDatas = []
    for (let temRetail of this.temSumArrayForBarChart) {
      let tableObject = {
        name: '',
        value: 0,
      }
      for (let temRetailObject of temRetail) {
        tableObject.name = this.handleTime(temRetailObject.Date)
        tableObject.value += temRetailObject.Price
      }
      newDatas.push(tableObject)
    }

    this.sumResult = this.sortArray(newDatas)
  }

  private sortArray(array) {
    return array.sort((a, b) => parseFloat(a.name.getTime()) - parseFloat(b.name.getTime()))
  }

  private handleTime(date: string): any {
    // let resDate: string
    // let i = date.indexOf('T')
    let resDate = new Date(date)
    return resDate
  }

  private getArrayByDate(productsArray): any[] {
    let res: any[] = []
    const source = from(productsArray)
    source
      .pipe(
        groupBy((stock) => stock['Date']),
        mergeMap((group) => group.pipe(toArray()))
      )

      .subscribe((val) => {
        res.push(val)
      })
    return res
  }

  public sumSelect(event): void {
    // console.log(this.temArray)
    console.log(this.temSumArrayForBarChart)
    console.log(event)
    let temArrayForPieChart: any[] = []

    // for (let temSum of this.temArray) {
    //   if (this.handleTime(temSum.Date) == event.name) {
    //     let tableObject = {
    //       name: '',
    //       value: 0,
    //     }
    //     tableObject.name = temSum.ProductName
    //     tableObject.value += temSum.Price
    //   }
    //   temArrayForPieChart.push(tableObject)
    // }
    let temArray: any[] = []
    for (let tem of this.temSumArrayForBarChart) {
      for (let temObj of tem) {
        if (this.handleTime(temObj.Date).getTime() == event.name.getTime()) {
          temArray.push(temObj)
        }
      }
    }
    // console.log(temArray);
    temArrayForPieChart = this.groupByProduct(temArray)
    // console.log(temArrayForPieChart);

    this.sumPieChart = temArrayForPieChart
    // console.log(this.sumPieChart)
  }

  private groupByProduct(temArray): any[] {
    let res: any[] = []
    // no adding price here, just lots of array, nested array
    const source = from(temArray)
    source
      .pipe(
        groupBy((stock) => stock['ProductId']),
        mergeMap((group) => group.pipe(toArray()))
      )

      .subscribe((val) => {
        res.push(val)
      })

    console.log(res)
    // to loop and put all together
    let temSumArray: any[] = []
    for (let resObject of res) {
      let sum = {
        name: '',
        value: 0,
      }
      for (let resObjectNextLevel of resObject) {
        sum.name = resObjectNextLevel.ProductName
        sum.value += resObjectNextLevel.Price
      }
      temSumArray.push(sum)
    }
    return temSumArray
  }
}
