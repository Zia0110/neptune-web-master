import { Component, OnChanges } from '@angular/core';

@Component({
    selector: 'app-common-chart',
    templateUrl: './common-chart.component.html',
    styleUrls: ['./common-chart.component.css']
})

export class CommonChartComponent implements OnChanges {

    constructor() {
        console.log('stella')
    }
    ngOnChanges() {

    }
}