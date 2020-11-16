import { Component, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { NgxChartsModule } from '@swimlane/ngx-charts'
import * as XLSX from 'xlsx'
import { JsonPipe } from '@angular/common'
@Component({
  selector: 'app-client-detail-turnover',
  templateUrl: './client-detail-turnover.component.html',
  styleUrls: ['./client-detail-turnover.component.css'],
})
export class ClientDetailTurnoverComponent {
  // view: any[] = [700, 300];
  multi = [
    {
      name: '今年销售量',
      series: [
        {
          name: '1月',
          value: 620,
        },
        {
          name: '2月',
          value: 730,
        },
        {
          name: '3月',
          value: 894,
        },
        {
          name: '4月',
          value: 620,
        },
        {
          name: '5月',
          value: 730,
        },
        {
          name: '6月',
          value: 894,
        },
      ],
    },
    {
      name: '去年销售量',
      series: [
        {
          name: '1月',
          value: 520,
        },
        {
          name: '2月',
          value: 730,
        },
        {
          name: '3月',
          value: 994,
        },
        {
          name: '4月',
          value: 1220,
        },
        {
          name: '5月',
          value: 330,
        },
        {
          name: '6月',
          value: 694,
        },
        {
          name: '7月',
          value: 920,
        },
        {
          name: '8月',
          value: 1130,
        },
        {
          name: '9月',
          value: 694,
        },
        {
          name: '10月',
          value: 620,
        },
        {
          name: '11月',
          value: 830,
        },
        {
          name: '12月',
          value: 894,
        },
      ],
    },
  ]

  single = [
    {
      name: '总体周转率',
      value: 1,
    },
    {
      name: '奥克兰',
      value: 2,
    },
    {
      name: 'France',
      value: 3,
    },
    {
      name: 'UK',
      value: 2,
    },
    {
      name: 'Italy',
      value: 4,
    },
    {
      name: 'Spain',
      value: 1,
    },
  ]
  view: any[] = []
  // options
  legend: boolean = true
  showLabels: boolean = true
  animations: boolean = false
  xAxis: boolean = true
  yAxis: boolean = true
  showYAxisLabel: boolean = true
  showXAxisLabel: boolean = true
  xAxisLabel: string = '月份'
  yAxisLabel: string = '销售量'
  timeline: boolean = true
  legendPosition: string = 'below'
  min: number = 0
  max: number = 5

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'],
  }

  constructor() {
    Object.assign(this.single)
    Object.assign(this.multi)
  }

  onSelect(data): void {
    // console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    // console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  // XLSX to JSON part

  onFileChange2(evt) {
    const selectedFile = evt.target.files[0]
    const reader = new FileReader()
    reader.onload = (event) => {
      let data = event.target.result
      let workbook = XLSX.read(data, {
        type: 'binary',
      })
      workbook.SheetNames.forEach((sheetName) => {
        const XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
        const json_object = JSON.stringify(XL_row_object)
        document.getElementById('jsonObject').innerHTML = json_object
        let e = JSON.parse(json_object)
        console.log(e)
      })
    }
    reader.onerror = (event) => {
      console.error('File could not be read! Code ' + event.target.error.code)
    }
    reader.readAsBinaryString(selectedFile)
  }

  mergeJsonToObject(jsonObject) {}
}
