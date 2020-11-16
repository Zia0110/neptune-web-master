import { Component, OnInit, Inject, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { TransportEndpoint } from '../../../services/endpoints/transport.endpoint'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'

@Component({
  selector: 'app-transport-arrive-confirm-dialog',
  templateUrl: './transport-arrive-confirm-dialog.component.html',
  styleUrls: ['./transport-arrive-confirm-dialog.component.css'],
})
export class TransportArriveConfirmDialogComponent implements OnInit {
  transportFormIsDisabled = true
  confirmData = {
    transportId: null,
    arrivedComments: '',
    arrivalTime: null,
  }
  formWarehouseId: number

  @ViewChild('transportTable') transportTable
  @ViewChild('transportPlanEdit') transportPlanEdit

  constructor(
    private transportEndpoint: TransportEndpoint,
    private sweetAlert: SweetAlertService,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<TransportArriveConfirmDialogComponent>
  ) {}

  datepickerOutput($event) {
    this.confirmData.arrivalTime = $event
  }

  ngOnInit() {
    console.log(this.data)
    this.confirmData.transportId = this.data.TransportId
  }

  clearChanges() {
    this.transportFormIsDisabled = true
  }

  save() {
    let transportData = this.transportPlanEdit.checkSubmitDetails()
    if (this.confirmData.arrivalTime) {
      this.updateToApi(this.confirmData)
    } else {
      this.sweetAlert.showSweetAlert('No change information')
    }
  }

  getFormWarehouseId(data) {
    console.log(data)
    this.formWarehouseId = data.FromWarehouseId
  }

  updateToApi(data) {
    console.log(data)
    this.transportEndpoint._updateTransportConfirmArrival(data).subscribe((res) => {
      console.log(res), this.sweetAlert.showSuccessMessage('Successful change')
      this.dialogRef.close()
      this.updateNewDataOnSucessUpdate(data.transportId)
    })
  }

  updateNewDataOnSucessUpdate(transportId) {
    this.transportEndpoint._getTransportPlanById(transportId).subscribe((res) => {
      this.data = res
    })
  }
}
