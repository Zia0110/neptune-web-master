import { Component, Inject, OnInit, Optional } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import * as shape from 'd3-shape'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'
import { FinanceEndpoint } from '../../../../services/endpoints/finance.endpoint'

@Component({
  selector: 'app-price-view-dialog',
  templateUrl: './price-view-dialog.component.html',
  styleUrls: ['./price-view-dialog.component.css'],
})
export class PriceViewDialogComponent implements OnInit {
  multi = []
  view: any[] = [1000, 500]
  isShowChart = false
  // options
  legend = true
  animations = true
  xAxis = true
  yAxis = true
  showYAxisLabel = true
  showXAxisLabel = true
  xAxisLabel = 'Date（mm-dd）'
  yAxisLabel = 'Price（$）'
  timeline = true
  curve = shape.curveBasis
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#ac38ca', '#a8385d', '#aae3f5'],
  }
  // Search Selection Form Control
  productFormControl = new FormControl('')

  constructor(
    public dialogRef: MatDialogRef<PriceViewDialogComponent>,
    private financeEndpoint: FinanceEndpoint,
    private sweetAlertService: SweetAlertService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (!this.data) {
      this.sweetAlertService.successAlert('Select product to view view!')
    } else {
      this.sweetAlertService.successAlert(this.data.name + '：Data extraction succeeded！')
    }
    const now = new Date()
    const currentDateString = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
    // const last365days = new Date(now.setDate(now.getDate() - 365))
    // const startDateString = `${last365days.getFullYear()}-${last365days.getMonth() + 1}-${last365days.getDate()}`
    // console.log('开始日期：' + startDateString)
    // console.log('结束日期：' + currentDateString)
    this.productFormControl.valueChanges.subscribe((value) => {
      this.isShowChart = false
      this.multi = []
      if (value) {
        this.financeEndpoint
          ._GetPriceViewDataById(value, '2000-01-01', currentDateString)
          .toPromise()
          .then((res: any) => {
            if (!res.length) {
              this.sweetAlertService.successAlert(this.data.name + '：no data！')
              return
            }
            res.map((row: any) => {
              const nameString = row.CustomerGroup1Name
              const seriesArray = []
              row.PriceDateRanges.map((priceItem: any) => {
                seriesArray.push({
                  name: new Date(priceItem.Date),
                  value: priceItem.Price,
                })
              })
              this.multi.push({
                name: nameString,
                series: seriesArray,
              })
            })
            const multi = this.multi
            Object.assign(this, { multi })
            this.isShowChart = true
          })
      }
    })
    if (this.data) {
      this.productFormControl.setValue(this.data.id)
    }
  }

  closeDialog(): void {
    this.dialogRef.close()
  }
}
