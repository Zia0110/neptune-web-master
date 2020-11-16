import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core'
import { UserState } from '../../../core/user/user.state'
import { SweetAlertService } from '../../../core/alert/sweet-alert.service'
import { FormControl } from '@angular/forms'

@Component({
  selector: 'app-upload-text',
  templateUrl: './upload-text.component.html',
  styleUrls: ['./upload-text.component.css'],
})
export class UploadTextComponent implements OnInit {
  file: File = null
  fileContent: any
  parseResult = []
  isValidFile = false
  fileFormControl = new FormControl('')
  fileName: string

  @Output() outputTextFileData: EventEmitter<any> = new EventEmitter<any>()

  constructor(private userState: UserState, private sweetAlertService: SweetAlertService) {}

  ngOnInit() {}

  // Accept uplaoded file and process content for parsing
  txtUploadHandler(event) {
    // console.log(event.target.files);
    // Only accepting txt file with plain text
    if (event.target.files[0]) {
      if (event.target.files[0].type == 'text/plain') {
        this.file = event.target.files[0]
        // Reads txt file then output a stirng of numbers
        let reader = new FileReader()
        reader.onload = () => {
          this.fileContent = reader.result
          // console.log('Content of File:', this.fileContent);
          this.isValidFile = true
          this.parse()
          // '\filename.txt'
          const splitFileAddress = this.fileFormControl.value.split(/\\/)
          this.fileName = splitFileAddress[splitFileAddress.length - 1]
        }
        reader.readAsText(this.file)
      } else {
        this.sweetAlertService.showSweetAlert('Please upload txt file!')
      }
    }
  }

  // parse() is fired when upload button is clicked
  parse() {
    if (!this.file) {
      this.sweetAlertService.showSweetAlert('No selection!')
      return
    } else {
      let contentString = this.fileContent.replace(/\r\n/g, '\n').split('\n')
      this.parseResult = []
      contentString = contentString.filter((value) => value !== '')
      console.log(contentString)
      // Take each element of stirng then push into array individually
      for (let i = 0; i < contentString.length; i++) {
        let reg = /^\s*[a-zA-Z]*\d+[a-zA-Z]*\s*$/
        // console.log(contentString[i]);
        if (contentString[i].match(/^[ ]*$/)) {
          console.log('this string is all space or empty')
          contentString.splice(i, 1)
          i++
          continue
        }
        if (reg.test(contentString[i])) {
          this.parseResult.push(contentString[i])
        } else {
          this.sweetAlertService.showSweetAlert('Unlawful letters exist in the file!')
          return
        }
      }
      // console.log('parseResult:', this.parseResult, typeof(this.parseResult));

      this.outputTextFileData.emit(this.parseResult)
    }
  }

  removeFile() {
    this.fileFormControl.setValue('')
    this.outputTextFileData.emit([])
    this.fileName = ''
    this.isValidFile = false
  }
}
