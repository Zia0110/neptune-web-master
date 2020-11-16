import { Component, OnInit, Inject, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { from } from 'rxjs'
import { groupBy, mergeMap, toArray } from 'rxjs/operators'
import { MatTableDataSource } from '@angular/material/table'
import { ClientDetailSingleViewMapping } from '../../../../services/mappings/client-detail-single-view.mapping'

@Component({
  selector: 'app-client-dashboard-excel',
  templateUrl: './client-dashboard-excel.component.html',
  styleUrls: ['./client-dashboard-excel.component.css'],
})
export class ClientDashboardExcelComponent implements OnInit {
  public fileName: string
  public dataFromParent: any
  public isRetail: boolean
  public displayedColumns: string[] = []
  public dataSource: any
  public dataForTable: any[] = []
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator

  public excelExportMapping: ClientDetailSingleViewMapping
  public excelExportValue = null
  @ViewChild('excelExporter') excelExporter

  constructor(@Inject(MAT_DIALOG_DATA) public data) {}

  ngOnInit(): void {
    this.initData()
    // console.log(this.dataFromParent)
    // console.log(this.isRetail)
    // console.log(this.displayedColumns)
    this.handleDataForTable()
    this.buildTable()
  }

  private initData(): void {
    this.excelExportMapping = new ClientDetailSingleViewMapping()
    this.dataFromParent = this.data.dataArray
    this.isRetail = this.data.isRetail
    this.initFileName()
    this.trimDateAndBuildColumns()
  }

  private buildTable(): void {
    // console.log(this.dataForTable)
    this.dataSource = new MatTableDataSource<any>(this.dataForTable)
    this.dataSource.paginator = this.paginator
  }

  private initFileName(): void {
    this.fileName = this.isRetail ? '零售情报汇总' : '批发情报汇总'
  }

  // from Wed Jun 03 2020 00:00:00 GMT+1200 (New Zealand Standard Time) to 2020-06-03
  private trimDateAndBuildColumns(): void {
    this.displayedColumns.push('date')
    for (let client of this.dataFromParent) {
      if (!this.displayedColumns.includes(client.name)) {
        this.displayedColumns.push(client.name)
      }
      for (let record of client.series) {
        record.name = this.handleDate(record.name)
      }
    }
  }

  private handleDate(date): string {
    var a_date = new Date(date),
      mnth = ('0' + (a_date.getMonth() + 1)).slice(-2),
      day = ('0' + a_date.getDate()).slice(-2)
    return [a_date.getFullYear(), mnth, day].join('-')
  }

  private handleDataForTable(): void {
    let temClientData: any[] = []
    temClientData = this.groupAllData()
    // console.log(temClientData);
    let temDataGroupByDate: any[] = []
    temDataGroupByDate = this.groupByDate(temClientData)
    // console.log(temDataGroupByDate)
    let temDataForTable: any[] = []
    temDataForTable = this.groupForTable(temDataGroupByDate)
    // console.log(temDataForTable);
    this.dataForTable = temDataForTable
  }

  private groupAllData(): any[] {
    let res: any[] = []

    for (let record of this.dataFromParent) {
      let temClientName = record.name
      for (let singleData of record.series) {
        let temClient = {
          client: '',
          date: '',
          price: 0,
        }
        temClient.client = temClientName
        temClient.date = singleData.name
        temClient.price = singleData.value
        res.push(temClient)
      }
    }
    return res
  }

  private groupByDate(temClientData): any[] {
    let res: any[] = []
    const source = from(temClientData)
    source
      .pipe(
        groupBy((singleData) => singleData['date']),
        mergeMap((group) => group.pipe(toArray()))
      )

      .subscribe((val) => {
        res.push(val)
      })
    return res
  }

  private groupForTable(temDataGroupByDate): any[] {
    let res: any[] = []
    for (let record of temDataGroupByDate) {
      let dataForTable = {}
      for (let singleRecord of record) {
        dataForTable['date'] = singleRecord.date
        dataForTable[singleRecord.client] = singleRecord.price
      }
      res.push(dataForTable)
    }
    return res
  }

  public exportToExcel(): void {
    let data = this.dataForTable
    let dataExport = this.excelExportMapping.mapping(data, this.displayedColumns)
    this.excelExportValue = dataExport
    setTimeout(() => {
      this.excelExporter.exportAsXLSX()
    }, 400)
  }
}
