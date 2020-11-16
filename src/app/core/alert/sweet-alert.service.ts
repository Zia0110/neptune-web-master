import { Injectable } from '@angular/core'
import { Component, AfterViewInit } from '@angular/core'
import { AppConfigStore } from '../../core/services/app-config.store'
import { UserState } from '../../core/user/user.state'
import { UserEndpoint } from '../../core/endpoints/user.endpoint'
import Swal from 'sweetalert2'
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
/*
  When using this service, just call the showSweetAlert(customError: boolean, errorMessage?: string) method,
  if you would like to use you own error message, then customError = true;
  e.x.
  let excelExtensionMessage = "Please select an Excel file with '.xls' or '.xlsx' extension.";
  this.sweetAlertService.showSweetAlert(true, excelExtensionMessage);

  if just a http response error, just use false for customError and leave errorMessage empty
  e.x. this.sweetAlertService.showSweetAlert(false);

*/
export class SweetAlertService {
  public httpResponseMessage: any
  private _style = `
    <style>
    .tooltip {
      position: relative;
      display: inline-block;
      border-bottom: 1px dotted black;
      opacity:50;
    }

    .tooltip .tooltiptext {
      visibility: hidden;
      width: auto;
      background-color: black;
      color: #fff;
      text-align: center;
      border-radius: 6px;
      padding: 5px 0;

      /* Position the tooltip */
      position: absolute;
      z-index: 1;
      bottom: 100%;
      left: 50%;
      margin-left: -450px;
    }

    .tooltip:hover .tooltiptext {
      visibility: visible;
    }
    </style>


    <div class="tooltip">See Details
      <span class="tooltiptext">ToBeReplaced</span>
    </div>
    `

  constructor(private userState: UserState) {
    this.userState.errorLog.subscribe((value) => (this.httpResponseMessage = value))
  }
  // Use this for success messages
  showSuccessMessage(message: string) {
    if (message) {
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'success',
        title: 'Success',
        timer: 3600,
        text: message,
      })
    } else {
      Swal.fire('Unknown Error!')
      Swal.fire({
        toast: true,
        timer: 3600,
        position: 'top',
        icon: 'success',
        title: 'Success',
        text: 'Successful!',
      })
    }
  }
  successAlert2(message): any {
    Swal.fire({
      toast: true,
      position: 'top',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 3600,
    })
  }
  successAlert(message?): any {
    Swal.fire({
      toast: true,
      position: 'top',
      icon: 'success',
      title: message ? message : 'Saved!',
      showConfirmButton: false,
      timer: 3600,
    })
  }

  // Use this for api error messages
  showSweetAlert(errorMessage: string): void {
    if (errorMessage) {
      Swal.fire({
        // icon: 'error',
        title: `Oops...`,
        padding: '0.5rem ',
        text: errorMessage,
        customClass: {
          icon: 'swal-icon-class',
          popup: 'swal-popup-class',
          container: 'swal-container-class',
          title: 'swal-title-class',
          content: 'swal-content-class',
          confirmButton: 'swal-confirm-button-class',
          closeButton: 'swal-confirm-button-class',
          cancelButton: 'swal-confirm-button-class',
        },
      })
    } else {
      Swal.fire('Unknown Error!')
      Swal.fire({
        // icon: 'error',
        title: 'Oops...',
        padding: '0.5rem ',
        text: 'Unknown Error!',
        customClass: {
          icon: 'swal-icon-class',
          popup: 'swal-popup-class',
          container: 'swal-container-class',
          title: 'swal-title-class',
          content: 'swal-content-class',
          confirmButton: 'swal-confirm-button-class',
          closeButton: 'swal-confirm-button-class',
          cancelButton: 'swal-confirm-button-class',
        },
      })
    }
  }

  showSweetAlert2(errorMessage: string, detailMessage: string, isHtml?): void {
    if (isHtml) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        html: errorMessage,
        footer: this._style.replace('ToBeReplaced', detailMessage),
      })
      return
    }
    if (errorMessage) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
        footer: this._style.replace('ToBeReplaced', detailMessage),
        // customClass: {
        //   icon: 'swal-icon-alert',
        //   popup: 'swal-popup-alert',
        //   container:'swal-container-class',
        //   title:'swal-title-alert',
        //   content: 'swal-content-class',
        //   confirmButton: 'swal-confirm-button-class',
        //   closeButton: 'swal-confirm-button-class',
        //   cancelButton: 'swal-confirm-button-class',
        // }
      })
    } else {
      Swal.fire('Unknown Error!')
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Unknown Error!',
        // customClass: {
        //   icon: 'swal-icon-alert',
        //   popup: 'swal-popup-alert',
        //   container:'swal-container-class',
        //   title:'swal-title-alert',
        //   content: 'swal-content-class',
        //   confirmButton: 'swal-confirm-button-class',
        //   closeButton: 'swal-confirm-button-class',
        //   cancelButton: 'swal-confirm-button-class',
        // }
      })
    }
  }
  // Use this for confirmation messages
  saveAlert(text?: string): any {
    return Swal.fire({
      title: 'Confirm?',
      text: text ? text : 'Your data will be saved!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
    })
  }
  saveAlert2(title, message): any {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
    })
  }
  saveAlertHtml(text?: string): any {
    return Swal.fire({
      title: 'Confirm?',
      html: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
    })
  }
}
