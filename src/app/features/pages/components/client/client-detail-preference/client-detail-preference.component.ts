import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-client-detail-preference',
  templateUrl: './client-detail-preference.component.html',
  styleUrls: ['./client-detail-preference.component.css'],
})
export class ClientDetailPreferenceComponent implements OnInit {
  view: any[] = [1200, 600]

  // options for the chart
  showXAxis = true
  showYAxis = true
  gradient = false
  showLegend = true
  showXAxisLabel = true
  xAxisLabel = 'years'
  showYAxisLabel = true
  yAxisLabel = 'Number'
  timeline = true

  colorScheme = {
    domain: [
      '#2A5784',
      '#43719F',
      '#5B8DB8',
      '#7AAAD0',
      '#9BC7E4',
      '#BADDF1',
      '#E1575A',
      '#EE7423',
      '#F59D3D',
      '#FFC686',
      '#9D7760',
      '#F1CF63',
      '#7C4D79',
      '#9B6A97',
      '#BE89AC',
      '#D5A5C4',
      '#D5A5C4',
      '#BBB1AC',
      '#24693D',
      '#398949',
      '#61AA57',
      '#7DC470',
      '#B4E0A7',
    ],
  }

  //pie
  showLabels = true

  // data goes here

  public multi = [
    {
      name: '1971',
      series: [
        {
          name: 'A',
          value: 66666,
        },
        {
          name: 'B',
          value: 22222,
        },
        {
          name: 'C',
          value: 33333,
        },
        {
          name: 'D',
          value: 8888,
        },
      ],
    },

    {
      name: '1972',
      series: [
        {
          name: 'A',
          value: 33333,
        },
        {
          name: 'B',
          value: 53253,
        },
        {
          name: 'C',
          value: 32132,
        },
        {
          name: 'D',
          value: 22223,
        },
        {
          name: 'E',
          value: 22246,
        },
      ],
    },

    {
      name: '1973',
      series: [
        {
          name: 'B',
          value: 32253,
        },
        {
          name: 'C',
          value: 67132,
        },
        {
          name: 'D',
          value: 52223,
        },
        {
          name: 'E',
          value: 12246,
        },
        {
          name: 'F',
          value: 41246,
        },
      ],
    },

    {
      name: '1974',
      series: [
        {
          name: 'B',
          value: 12253,
        },
        {
          name: 'C',
          value: 57132,
        },
        {
          name: 'D',
          value: 52223,
        },
        {
          name: 'F',
          value: 12246,
        },
        {
          name: 'G',
          value: 41246,
        },
      ],
    },

    {
      name: '1975',
      series: [
        {
          name: 'C',
          value: 32253,
        },
        {
          name: 'D',
          value: 47132,
        },
        {
          name: 'F',
          value: 22223,
        },
        {
          name: 'E',
          value: 32246,
        },
        {
          name: 'G',
          value: 61246,
        },
        {
          name: 'H',
          value: 32246,
        },
      ],
    },

    {
      name: '1976',
      series: [
        {
          name: 'F',
          value: 22253,
        },
        {
          name: 'E',
          value: 57132,
        },
        {
          name: 'G',
          value: 62223,
        },
        {
          name: 'H',
          value: 12246,
        },
        {
          name: 'I',
          value: 21246,
        },
        {
          name: 'J',
          value: 12246,
        },
      ],
    },
    {
      name: '1977',
      series: [
        {
          name: 'F',
          value: 12253,
        },
        {
          name: 'E',
          value: 47132,
        },
        {
          name: 'G',
          value: 32223,
        },
        {
          name: 'H',
          value: 42246,
        },
        {
          name: 'I',
          value: 61246,
        },
        {
          name: 'J',
          value: 52246,
        },
      ],
    },
    {
      name: '1978',
      series: [
        {
          name: 'E',
          value: 37132,
        },
        {
          name: 'G',
          value: 42223,
        },
        {
          name: 'H',
          value: 52246,
        },
        {
          name: 'I',
          value: 71246,
        },
        {
          name: 'J',
          value: 32246,
        },
      ],
    },
    {
      name: '1979',
      series: [
        {
          name: 'E',
          value: 37132,
        },
        {
          name: 'G',
          value: 22223,
        },
        {
          name: 'H',
          value: 52246,
        },
        {
          name: 'I',
          value: 71246,
        },
        {
          name: 'J',
          value: 82246,
        },
        {
          name: 'K',
          value: 82246,
        },
      ],
    },
    {
      name: '1980',
      series: [
        {
          name: 'G',
          value: 22223,
        },
        {
          name: 'H',
          value: 22246,
        },
        {
          name: 'I',
          value: 31246,
        },
        {
          name: 'J',
          value: 42246,
        },
        {
          name: 'K',
          value: 92246,
        },
        {
          name: 'L',
          value: 52246,
        },
      ],
    },
    {
      name: '1981',
      series: [
        {
          name: 'G',
          value: 12223,
        },
        {
          name: 'H',
          value: 22246,
        },
        {
          name: 'I',
          value: 11246,
        },
        {
          name: 'J',
          value: 22246,
        },
        {
          name: 'K',
          value: 102246,
        },
        {
          name: 'L',
          value: 92246,
        },
      ],
    },
    {
      name: '1982',
      series: [
        {
          name: 'H',
          value: 12246,
        },
        {
          name: 'I',
          value: 11246,
        },
        {
          name: 'J',
          value: 12246,
        },
        {
          name: 'K',
          value: 72246,
        },
        {
          name: 'L',
          value: 62246,
        },
        {
          name: 'M',
          value: 72246,
        },
      ],
    },
    {
      name: '1983',
      series: [
        {
          name: 'I',
          value: 21246,
        },
        {
          name: 'J',
          value: 22246,
        },
        {
          name: 'K',
          value: 52246,
        },
        {
          name: 'L',
          value: 82246,
        },
        {
          name: 'M',
          value: 92246,
        },
        {
          name: 'N',
          value: 72246,
        },
      ],
    },
  ]

  constructor() {}

  ngOnInit() {}
}
