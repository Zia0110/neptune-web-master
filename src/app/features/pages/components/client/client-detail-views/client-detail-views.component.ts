import { Component, NgModule, OnInit, ViewChild, Inject, Input, ViewEncapsulation } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ClientEndpoint } from '../../../services/endpoints/client.endpoint'
import * as moment from 'moment'
import { NgxChartsModule } from '@swimlane/ngx-charts'
import { from } from 'rxjs'
import { groupBy, mergeMap, toArray } from 'rxjs/operators'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { FormControl } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { ClientDetailSingleViewExcelComponent } from './client-detail-single-view-excel/client-detail-single-view-excel.component'

@Component({
  selector: 'app-client-detail-views',
  templateUrl: './client-detail-views.component.html',
  styleUrls: ['./client-detail-views.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ClientDetailViewsComponent implements OnInit {
  @Input() clientData
  @Input() beginDate
  @Input() endDate
  selected = new FormControl(0)
  single: any[] = []
  multi: any[] = []
  backgroundColor = 'primary'
  color = 'accent'

  // options
  showXAxis = true
  showYAxis = true
  gradient = false
  showLegend = true
  showXAxisLabel = true
  xAxisLabel = 'Sales details'
  showYAxisLabel = true
  yAxisLabel = 'Sales'
  public legendTitle = 'Classification'
  public showDataLabel = true

  colorScheme = {
    domain: ['#fcba03', '#fa5d02', '#fa0202', '#b3ff00', '#40ff00', '#00ffae', '#00b7ff', '#1e00ff', '#6f00ff', '#ff03ff'],
  }

  public temRetailsArrayForChild: any[] = []
  public temWholeSalesArrayForChild: any[] = []
  public temSumArrayForChild: any[] = []
  constructor(private clientEndpoint: ClientEndpoint, private sweetalert: SweetAlertService, public dialog: MatDialog) {}

  ngOnInit() {
    console.log(this.clientData)
    if (!this.clientData.Retails && !this.clientData.WholeSales) {
      this.sweetalert.showSweetAlert('No sales and wholesale data available')
    } else {
      // this.setUpDataForSingle()
      this.setUpRetailWholeSaleSumDataForChildren()
      this.setUpDataForMulti()
    }
  }

  private setUpDataForMulti(): void {
    this.setUpRetailData()
    this.setUpWholeSaleData()
    this.setUpSumData()
    console.log(this.multi)
  }

  yAxisFormat(val) {
    return '$' + val
  }

  // to set up retails data
  private setUpRetailData(): void {
    let retailsForMulti = {
      name: '零售',
      series: [],
    }
    let temRetailProducts: any[] = []
    temRetailProducts = this.getProductsFromRetailAndWholesale(true)
    let temRetailArray: any[] = []
    temRetailArray = this.getArrayByProductId(temRetailProducts)
    retailsForMulti.series = this.setDataForRetailAndWholeSaleSeries(temRetailArray)
    this.multi.push(retailsForMulti)
  }

  // to set up WholeSales data
  private setUpWholeSaleData(): void {
    let wholeSalesForMulti = {
      name: '批发',
      series: [],
    }
    let temWholeSaleProducts: any[] = []
    temWholeSaleProducts = this.getProductsFromRetailAndWholesale(false)
    let temWholeSaleArray: any[] = []
    temWholeSaleArray = this.getArrayByProductId(temWholeSaleProducts)
    wholeSalesForMulti.series = this.setDataForRetailAndWholeSaleSeries(temWholeSaleArray)
    this.multi.push(wholeSalesForMulti)
  }

  //to set up sum data
  private setUpSumData(): void {
    let res: any[] = []
    for (let result of this.multi) {
      const source = from(result.series)
      source
        .pipe(
          groupBy((stock) => stock['ProductId']),
          mergeMap((group) => group.pipe(toArray()))
        )

        .subscribe((val) => {
          res.push(val)
        })
    }
    let sumForMulti = {
      name: '总额',
      series: [],
    }

    // to loop and put all together
    let temSumArray: any[] = []
    for (let resObject of res) {
      for (let resObjectNextLevel of resObject) {
        temSumArray.push(resObjectNextLevel)
      }
    }
    sumForMulti.series = this.setDataForSumSeries(temSumArray)
    this.multi.push(sumForMulti)
  }

  private setDataForSumSeries(temSumArray): any[] {
    let res: any[] = []
    for (let temOb of temSumArray) {
      let sumProduct = {
        name: '',
        value: 0,
      }
      sumProduct.name = temOb.name
      sumProduct.value += temOb.value
      res.push(sumProduct)
    }
    return res
  }

  //assign them into the table needed series
  // for retail wholesale
  private setDataForRetailAndWholeSaleSeries(temRetailAndWholeSaleArray): any[] {
    let res: any[] = []
    for (let temOb of temRetailAndWholeSaleArray) {
      let retailOrWholeSaleProduct = {
        name: '',
        value: 0,
      }
      for (let product of temOb) {
        retailOrWholeSaleProduct.name = product.ProductName
        retailOrWholeSaleProduct.value += product.Price
      }
      res.push(retailOrWholeSaleProduct)
    }
    return res
  }

  // make all retail or whole data into array before grouping them
  private getProductsFromRetailAndWholesale(isRetail: boolean): any[] {
    let res: any[] = []
    if (isRetail) {
      if (this.clientData.Retails) {
        for (let retail of this.clientData.Retails) {
          for (let product of retail.Products) {
            res.push(product)
          }
        }
      }
    } else {
      if (this.clientData.WholeSales) {
        for (let wholeSale of this.clientData.WholeSales) {
          for (let product of wholeSale.Products) {
            res.push(product)
          }
        }
      }
    }
    return res
  }

  // group them by product it
  private getArrayByProductId(a_array): any[] {
    let res: any[] = []
    const retailSource = from(a_array)
    retailSource
      .pipe(
        groupBy((stock) => stock['ProductId']),
        mergeMap((group) => group.pipe(toArray()))
      )

      .subscribe((val) => {
        res.push(val)
      })
    return res
  }

  private setUpDataForSingle(): void {
    let sumOfRetail = 0
    if (this.clientData.Retails) {
      for (let retail of this.clientData.Retails) {
        for (let product of retail.Products) {
          sumOfRetail += product.Price
        }
      }
    }

    let sumOfWholeSale = 0
    if (this.clientData.WholeSales) {
      for (let wholeSale of this.clientData.WholeSales) {
        for (let product of wholeSale.Products) {
          sumOfWholeSale += product.Price
        }
      }
    }

    let sumOfAll = sumOfRetail + sumOfWholeSale
    this.single = [
      {
        name: '零售',
        value: sumOfRetail,
      },
      {
        name: '批发',
        value: sumOfWholeSale,
      },
      {
        name: '总额',
        value: sumOfAll,
      },
    ]
  }

  public onSelect(event): void {
    console.log(event)
  }

  //for the three child components
  private setUpRetailWholeSaleSumDataForChildren(): void {
    this.buildRetailDataForChild()
    this.buildWholeSaleDataForChild()
    this.buildSumDataForChild()
  }

  private buildRetailDataForChild(): void {
    if (this.clientData.Retails) {
      let productsArrayOfRetails: any[] = []
      for (let retail of this.clientData.Retails) {
        for (let product of retail.Products) {
          productsArrayOfRetails.push(product)
        }
      }
      this.temRetailsArrayForChild = this.getArrayByDate(productsArrayOfRetails)
    }
  }

  private buildWholeSaleDataForChild(): void {
    if (this.clientData.WholeSales) {
      let productsArrayOfWholeSales: any[] = []
      for (let retail of this.clientData.WholeSales) {
        for (let product of retail.Products) {
          productsArrayOfWholeSales.push(product)
        }
      }
      this.temWholeSalesArrayForChild = this.getArrayByDate(productsArrayOfWholeSales)
    }
  }

  private buildSumDataForChild(): void {
    for (let detail of this.temRetailsArrayForChild) {
      this.temSumArrayForChild.push(detail)
    }

    for (let detail of this.temWholeSalesArrayForChild) {
      this.temSumArrayForChild.push(detail)
    }
    console.log(this.temSumArrayForChild)
  }

  private getArrayByDate(productsArray): any[] {
    let res: any[] = []
    const retailSource = from(productsArray)
    retailSource
      .pipe(
        groupBy((stock) => stock['Date']),
        mergeMap((group) => group.pipe(toArray()))
      )

      .subscribe((val) => {
        res.push(val)
      })
    return res
  }

  public showExcel(dataArray: any[], retailOrWholeSale: boolean): void {
    // console.log(dataArray);
    // console.log(retailOrWholeSale)
    if (dataArray.length == 0) {
      this.sweetalert.showSweetAlert('No data！')
    } else {
      const dialogRef = this.dialog.open(ClientDetailSingleViewExcelComponent, {
        width: '1500px',
        height: '95%',
        data: {
          dataArray: dataArray,
          isRetail: retailOrWholeSale,
          customerName: this.clientData.CustomerInfo.CustomerName,
        },
      })
    }
  }
}
