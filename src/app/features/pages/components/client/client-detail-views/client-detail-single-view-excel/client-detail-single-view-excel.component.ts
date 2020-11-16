import { Component, OnInit, Inject, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { from } from 'rxjs'
import { groupBy, mergeMap, toArray } from 'rxjs/operators'
import { ClientDetailSingleViewMapping } from '../../../../services/mappings/client-detail-single-view.mapping'

@Component({
  selector: 'app-client-detail-single-view-excel',
  templateUrl: './client-detail-single-view-excel.component.html',
  styleUrls: ['./client-detail-single-view-excel.component.css'],
})
export class ClientDetailSingleViewExcelComponent implements OnInit {
  public isRetail: boolean
  public dataArray: any[] = [] // retail or wholesale
  public displayedColumns: string[] = []
  public dataForTable: any[] = []
  public dataSource: any
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  // @ViewChild(MatSort, { static: true }) sort: MatSort
  public excelExportMapping: ClientDetailSingleViewMapping
  public excelExportValue = null
  @ViewChild('excelExporter') excelExporter

  constructor(@Inject(MAT_DIALOG_DATA) public data) {}

  ngOnInit(): void {
    this.initDataFromParent()
    this.initColmuns()
    // console.log(this.displayedColmuns)
    this.initDataForTable()
    // console.log(this.dataForTable);
    this.setUpTable()
  }

  private initDataFromParent(): void {
    this.isRetail = this.data.isRetail
    this.dataArray = this.data.dataArray
    console.log(this.isRetail)
    console.log(this.dataArray)
    this.excelExportMapping = new ClientDetailSingleViewMapping()
  }

  //          kej
  //set up the column title without duplicate
  private initColmuns(): void {
    this.displayedColumns.push('date') // for the first column
    for (let dataInOneDay of this.dataArray) {
      for (let singleData of dataInOneDay) {
        if (!this.displayedColumns.includes(singleData.ProductName)) {
          this.displayedColumns.push(singleData.ProductName)
        }
      }
    }
  }

  private initDataForTable(): void {
    for (let dataInOneDay of this.dataArray) {
      let rowForTable = {
        date: '',
      }
      for (let singleData of dataInOneDay) {
        rowForTable.date = this.handleTime(singleData.Date)
        let temProductName = singleData.ProductName
        rowForTable[temProductName] = singleData.Price + '/' + singleData.Quantity
      }
      this.dataForTable.push(rowForTable)
    }
  }

  private setUpTable(): void {
    console.log(this.dataForTable)
    this.dataSource = new MatTableDataSource<any>(this.dataForTable)
    this.dataSource.paginator = this.paginator
  }

  private handleTime(date: string): string {
    let resDate: string
    let i = date.indexOf('T')
    resDate = date.slice(0, i)
    return resDate
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

// export class ClientDetailSingleViewExcelComponent implements OnInit {
//   public isRetail: boolean
//   public dataArray: any[] = [] // retail or wholesale
//   public displayedColumns: string[] = []
//   public dataForTable: any[] = []
//   public dataSource: any
//   @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
//   // @ViewChild(MatSort, { static: true }) sort: MatSort
//   public excelExportMapping: ClientDetailSingleViewMapping
//   public excelExportValue = null
//   @ViewChild('excelExporter') excelExporter

//   constructor(@Inject(MAT_DIALOG_DATA) public data) {}

//   ngOnInit(): void {
//     this.initDataFromParent()
//     this.initColmuns()
//     console.log(this.displayedColumns)
//     this.initDataForTable()
//     // console.log(this.dataForTable);
//     this.setUpTable()
//   }

//   private initDataFromParent(): void {
//     this.isRetail = this.data.isRetail
//     this.dataArray = this.data.dataArray
//     console.log(this.isRetail)
//     console.log(this.dataArray)
//     this.excelExportMapping = new ClientDetailSingleViewMapping()
//   }

//   //          kej
//   //set up the column title without duplicate
//   private initColmuns(): void {
//     this.displayedColumns.push('ProductName') // for the first column
//     for (let dataInOneDay of this.dataArray) {
//       for (let singleData of dataInOneDay) {
//         if (!this.displayedColumns.includes(singleData.Date)) {
//           this.displayedColumns.push(singleData.Date)
//         }
//       }
//     }
//   }

//   private initDataForTable(): void {
//     let temSumArray: any[] = []
//     temSumArray = this.combineAllData()
//     let arrayGroupedByProductId: any[] = []
//     arrayGroupedByProductId = this.groupArrayByProductId(temSumArray)
//     console.log(arrayGroupedByProductId)
//     this.dataForTable = this.filterData(arrayGroupedByProductId)
//   }

//   //combine all data into one array
//   private combineAllData(): any[] {
//     let res: any[] = []
//     for (let dataInOneDay of this.dataArray) {
//       for (let singleData of dataInOneDay) {
//         res.push(singleData)
//       }
//     }
//     return res
//   }

//   /*
//   coz we want:
//   {
//     productName: A4
//     5-31: 100/200
//     6-1: 20/100
//     ..
//     ..
//     ..
//   }
//   */
//   private groupArrayByProductId(temSumArray): any[] {
//     let res: any[] = []
//     const source = from(temSumArray)
//     source
//       .pipe(
//         groupBy((singleData) => singleData['ProductId']),
//         mergeMap((group) => group.pipe(toArray()))
//       )

//       .subscribe((val) => {
//         res.push(val)
//       })
//     return res
//   }

//   private filterData(arrayGroupedByProductId): any[] {
//     let res: any[] = []
//     for (let groupData of arrayGroupedByProductId) {
//       let rowForTable = {}
//       for (let singleData of groupData) {
//         rowForTable['ProductName'] = singleData.ProductName
//         let temDate = singleData.Date
//         rowForTable[temDate] = singleData.Price + '/' + singleData.Quantity
//       }
//       res.push(rowForTable)
//     }
//     return res
//   }

//   private setUpTable(): void {
//     this.dataSource = new MatTableDataSource<any>(this.dataForTable)
//     this.dataSource.paginator = this.paginator
//   }

//   public exportToExcel(): void {
//     let data = this.dataForTable
//     let dataExport = this.excelExportMapping.mapping(data, this.displayedColumns)
//     this.excelExportValue = dataExport
//     setTimeout(() => {
//       this.excelExporter.exportAsXLSX()
//     }, 400)
//   }
// }

/*
 DO NOT DELETE PLEASE!
 this is up side down lol

*/
