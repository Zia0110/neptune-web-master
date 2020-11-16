import { Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation, OnInit, IterableDiffers, IterableDiffer } from '@angular/core'
import { NgxChartsModule } from '@swimlane/ngx-charts'
import { FormControl } from '@angular/forms'
import * as moment from 'moment'

@Component({
  selector: 'app-client-dashboard-chart',
  templateUrl: './client-dashboard-chart.component.html',
  styleUrls: ['./client-dashboard-chart.component.css'],
})
export class ClientDashboardChartComponent implements OnInit {
  @Input() pieChartData
  @Input() lineChartData

  retailPieData: any
  wholesalePieData: any
  retailLineData: any
  wholesaleLineData: any
  generalPieData: any
  generalLineData: any

  // view: any[] = [600, 400];
  legend: boolean = true
  gradient: boolean = true
  showLegend: boolean = true
  showLabels: boolean = true
  isDoughnut: boolean = false
  xAxis: boolean = true
  yAxis: boolean = true
  showYAxisLabel: boolean = true
  showXAxisLabel: boolean = true
  xAxisLabel: string = 'Date'
  yAxisLabel: string = 'Price'
  timeline: boolean = true
  autoScale: boolean = true

  public pieChart: any
  public lineChart: any

  private iterableDiffer: IterableDiffer<string> | null

  constructor(private iterableDiffers: IterableDiffers) {
    this.iterableDiffer = iterableDiffers.find([]).create(null)
  }

  ngOnInit(): void {
    // console.log(this.pieChartData)
    // console.log(this.lineChartData)
  }

  ngOnChanges(changes): void {
    // console.log("ngOnChanges");
    if (changes.pieChartData.currentValue) {
      // console.log(this.pieChartData)
      // console.log(this.lineChartData)
      // console.log("in the if");
      this.pieChart = this.pieChartData
      this.lineChart = this.lineChartData
    }
  }

  // ngDoCheck() {
  //   console.log("ngDoCheck");
  //   let pieChanges = this.iterableDiffer.diff(this.pieChartData);
  //   let lineChanges = this.iterableDiffer.diff(this.lineChartData);
  //   if (pieChanges || lineChanges) {
  //     console.log('pieChartData detected!');
  //     this.pieChart = this.pieChartData
  //     this.lineChart = this.lineChartData
  //   }
  // }

  colorScheme = {
    domain: ['#fcba03', '#fa5d02', '#fa0202', '#b3ff00', '#40ff00', '#00ffae', '#00b7ff', '#1e00ff', '#6f00ff', '#ff03ff'],
  }

  yAxisFormat(val) {
    return '$' + val
  }

  xAxisFormat(val) {
    return moment(val).format('YYYY-MM-DD')
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
}
