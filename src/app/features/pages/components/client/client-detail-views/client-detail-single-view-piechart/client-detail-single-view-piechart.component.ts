import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'app-client-detail-single-view-piechart',
  templateUrl: './client-detail-single-view-piechart.component.html',
  styleUrls: ['./client-detail-single-view-piechart.component.css'],
})
export class ClientDetailSingleViewPiechartComponent implements OnInit {
  @Input() retailPieChart: any[] = []
  @Input() wholeSalePieChart: any[] = []
  @Input() sumPieChart: any[] = []
  // public dataForPieChart;
  public view: boolean = true
  public colorScheme = {
    domain: ['#fcba03', '#fa5d02', '#fa0202', '#b3ff00', '#40ff00', '#00ffae', '#00b7ff', '#1e00ff', '#6f00ff', '#ff03ff'],
  }
  public gradient: boolean = true

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(): void {}
}
