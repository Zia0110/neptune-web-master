import { Component, Input, OnChanges, OnInit } from '@angular/core'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import { SweetAlertService } from '../../../core/alert/sweet-alert.service'

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
const EXCEL_EXTENSION = '.xlsx'

@Component({
  selector: 'app-export-excel',
  templateUrl: './export-excel.component.html',
  styleUrls: [],
})
export class ExportExcelComponent implements OnInit, OnChanges {
  @Input() public data
  @Input() isExportToTxt = false
  @Input() public label = 'Generate Excel'
  @Input() isShowLabel = true
  // nothingInData: boolean = true;
  @Input() public fileName = ''

  constructor(private sweetAlertService: SweetAlertService) {}

  ngOnInit(): void {
    if (!this.isShowLabel) {
      this.label = ''
    }
  }

  ngOnChanges(changes) {
    console.log(changes)
  }

  exportAsXLSX(excelData?): void {
    if (this.isExportToTxt) {
      this.exportAsTxt(this.data)
    } else {
      console.log(excelData)
      console.log(this.data)
      this.exportAsExcelFile(
        typeof excelData !== 'string' && typeof excelData !== 'undefined' ? excelData : this.data,
        this.fileName ? this.fileName : 'sample'
      )
    }
  }

  exportAsTxt(data: any[]) {
    let content = ''
    if (data && data.length) {
      data.map((item) => (content += item + '\n'))
    } else {
      this.sweetAlertService.showSweetAlert('No exported data!')
      return
    }
    this.createDownloadLink((this.fileName ? this.fileName : 'export') + '.txt', content).click()
  }

  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json)
    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] }
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    this.saveAsExcelFile(excelBuffer, excelFileName)
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE })
    FileSaver.saveAs(data, fileName + '-export' + EXCEL_EXTENSION)
  }

  createDownloadLink(filename: string, data: string) {
    const dataUri = 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(data)
    const anchor = document.createElement('a')
    anchor.setAttribute('href', dataUri)
    anchor.setAttribute('download', filename)
    return anchor
  }
}
