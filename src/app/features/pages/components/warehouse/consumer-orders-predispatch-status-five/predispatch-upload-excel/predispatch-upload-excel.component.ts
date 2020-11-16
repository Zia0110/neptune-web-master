import { Component, OnInit, EventEmitter, Output } from '@angular/core'
import { SweetAlertService } from '../../../../../../core/alert/sweet-alert.service'
import { MatTableDataSource } from '@angular/material/table'
import * as XLSX from 'xlsx'

import { ViewChild } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { FinanceEndpoint } from '../../../../services/endpoints/finance.endpoint'

@Component({
  selector: 'app-predispatch-upload-excel',
  templateUrl: './predispatch-upload-excel.component.html',
  styleUrls: ['./predispatch-upload-excel.component.css'],
})
export class PredispatchUploadExcelComponent implements OnInit {
  @Output() outputData: EventEmitter<any> = new EventEmitter<any>()
  constructor(private sweetAlertService: SweetAlertService, private financeEndpoint: FinanceEndpoint) {}

  ngOnInit(): void {}

  excelOutput(event) {
    console.log(event)
    if (event.length) {
      this.sweetAlertService.successAlert('Uploaded successfully！')
      this.outputData.emit(event)
    } else {
      this.sweetAlertService.showSweetAlert('Uploaded file is empty, please upload again！')
    }
  }

  // onSubmit() {
  //   this.financeEndpoint._postCin7Import(this.ELEMENT_DATA).subscribe((_) => {
  //     this.sweetAlertService.successAlert('Saved successfully！')
  //     this.ELEMENT_DATA = []
  //     // this.dataSource = new MatTableDataSource(this.ELEMENT_DATA)
  //     // this.dataSource.paginator = this.paginator
  //     // this.isShowNotice = true
  //   })
  // }
}

// export class PredispatchUploadExcelComponent implements OnInit {
//   // @Input() public label
//   @Output() outputData: EventEmitter<any> = new EventEmitter<any>()
//   file: File = null
//   sheetNames: any
//   excelData: XLSX.WorkBook = null

//   constructor(private sweetAlertService: SweetAlertService) {}

//   ngOnInit(): void {

//   }

//   submit(data) {
//     this.outputData.emit(data)
//   }
//   reset() {
//     this.file = null
//     this.sheetNames = null
//     this.excelData = null
//     document.getElementById('uploadFile')['value'] = ''
//   }

//   onFileChange(event) {
//     console.log(event)
//     // let excel = event
//     // check if there is a file
//     if (event.target.files && event.target.files.length == 0) {
//       alert('Please select an Excel file')
//       return
//     }
//     let name = event.target.files[0].name
//     // check if file is excel file format
//     let fileExetension = name.split('.').pop().toString()
//     // console.log(fileExetension)
//     if (fileExetension !== 'xlsx' && fileExetension !== 'xls') {
//       let excelExtensionMessage = "Please select an Excel file with '.xls' or '.xlsx' extension."
//       //alert("Please select an Excel file with '.xls' or '.xlsx' extension.")
//       this.sweetAlertService.showSweetAlert(excelExtensionMessage)
//       return
//     }

//     this.onFileChange2(event)
//   }

//   onFileChange2(excel): void {
//     const selectedFile = excel.target.files[0]
//     const reader = new FileReader()

//     reader.onload = (event) => {
//       let data = event.target.result
//       let workbook = XLSX.read(data, {
//         type: 'binary',
//       })
//       // Hold excelData temporaryly
//       this.excelData = workbook
//       this.sheetNames = workbook.SheetNames
//     }

//     //  If fail to read EXCEL
//     reader.onerror = (event) => {
//       console.error('File could not be read! Code ' + event.target.error.code)
//     }
//     reader.readAsBinaryString(selectedFile)
//   }

//   excelSheetSelected(selectedSheet) {
//     console.log(selectedSheet)
//     this.parseExceltoJson(selectedSheet)
//   }

//   parseExceltoJson(selectedSheet) {
//     let jsonData = XLSX.utils.sheet_to_json(this.excelData.Sheets[selectedSheet])
//     console.log(jsonData)
//     this.submit(jsonData)
//     this.resetData()
//   }
//   resetData() {
//     this.excelData = null
//     this.sheetNames = null
//   }
// }
