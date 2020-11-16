import { Component, OnChanges, Input, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import * as XLSX from 'xlsx'
import { SweetAlertService } from '../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-upload-excel',
  templateUrl: './upload-excel.component.html',
  styleUrls: [],
})
export class UploadExcelComponent {
  @Input() public label
  @Output() outputData: EventEmitter<any> = new EventEmitter<any>()
  file: File = null
  sheetNames: any
  excelData: XLSX.WorkBook = null

  constructor(private sweetAlertService: SweetAlertService) {}

  submit(data) {
    this.outputData.emit(data)
  }
  reset() {
    this.file = null
    this.sheetNames = null
    this.excelData = null
    document.getElementById('uploadFile')['value'] = ''
  }

  onFileChange(event) {
    console.log(event)
    // let excel = event
    // check if there is a file
    if (event.target.files && event.target.files.length == 0) {
      alert('Please select an Excel file')
      return
    }
    let name = event.target.files[0].name
    // check if file is excel file format
    let fileExetension = name.split('.').pop().toString()
    // console.log(fileExetension)
    if (fileExetension !== 'xlsx' && fileExetension !== 'xls') {
      let excelExtensionMessage = "Please select an Excel file with '.xls' or '.xlsx' extension."
      //alert("Please select an Excel file with '.xls' or '.xlsx' extension.")
      this.sweetAlertService.showSweetAlert(excelExtensionMessage)
      return
    }

    this.onFileChange2(event)
  }

  onFileChange2(excel): void {
    const selectedFile = excel.target.files[0]
    const reader = new FileReader()

    reader.onload = (event) => {
      let data = event.target.result
      let workbook = XLSX.read(data, {
        type: 'binary',
      })
      // Hold excelData temporaryly
      this.excelData = workbook
      this.sheetNames = workbook.SheetNames
    }

    //  If fail to read EXCEL
    reader.onerror = (event) => {
      console.error('File could not be read! Code ' + event.target.error.code)
    }
    reader.readAsBinaryString(selectedFile)
  }

  excelSheetSelected(selectedSheet) {
    console.log(selectedSheet)
    this.parseExceltoJson(selectedSheet)
  }

  parseExceltoJson(selectedSheet) {
    let jsonData = XLSX.utils.sheet_to_json(this.excelData.Sheets[selectedSheet])
    this.submit(jsonData)
    this.resetData()
  }
  resetData() {
    this.excelData = null
    this.sheetNames = null
  }
}
