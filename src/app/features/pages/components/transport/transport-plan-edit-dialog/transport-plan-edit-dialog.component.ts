import { Component, OnInit, Inject, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog'
import { TransportEndpoint } from '../../../services/endpoints/transport.endpoint'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { CommentDialogComponent } from '../../../../../shared/common-components/comment-dialog/comment-dialog.component'

@Component({
  selector: 'app-transport-plan-edit-dialog',
  templateUrl: './transport-plan-edit-dialog.component.html',
  styleUrls: ['./transport-plan-edit-dialog.component.css'],
})
export class TransportPlanEditDialogComponent implements OnInit {
  transportFormIsDisabled = true
  transportIsConfirm = {
    value: 0,
    disabled: false,
  }
  productsDisabled = true

  @ViewChild('transportTable') transportTable
  @ViewChild('transportPlanEdit') transportPlanEdit
  originData: any
  formWarehouseId: number

  constructor(
    public dialog: MatDialog,
    private transportEndpoint: TransportEndpoint,
    private sweetAlert: SweetAlertService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.originData = this.data
    this.originData['version'] = 0
  }

  ngOnInit() {
    console.log(this.data)
    this.statusInit()
  }

  statusInit() {
    if (this.data.Status == 1) {
      this.transportIsConfirm.value = 0
      this.transportIsConfirm.disabled = true
    } else if (this.data.Status == 2) {
      this.transportIsConfirm.value = 0
    } else if (this.data.Status == 3) {
      this.transportIsConfirm.value = 1
      this.transportIsConfirm.disabled = true
    } else if (this.data.Status == 4) {
      this.transportIsConfirm.value = 1
      this.transportIsConfirm.disabled = true
    }
  }

  clearChanges() {
    this.transportFormIsDisabled = true
    this.productsDisabled = true
    this.originData['version']++
    this.data = this.originData

    this.transportPlanEdit.createForm(this.data)
    this.transportTable.prepTable(this.data.FreightInfo)
  }

  enableChanges() {
    this.transportFormIsDisabled = !this.transportFormIsDisabled
    if (this.data.Status != 3 && this.data.Status != 4) this.productsDisabled = !this.productsDisabled
  }

  getLocateDateString(date) {
    return new Date(date.replace('T', ' ') + ' UTC')
  }

  save() {
    if (this.data.Status != 3) {
      this.processUpdateNotConfirmed()
    }
    if (this.data.Status == 3) {
      this.processUpdateInTransit()
    }
  }

  getFormWarehouseId(data) {
    console.log(data)
    this.formWarehouseId = data.FromWarehouseId
  }

  processUpdateNotConfirmed() {
    let transportData = this.transportPlanEdit.checkSubmitDetails()
    if (transportData) {
      transportData.transportForm['transportId'] = this.data.TransportId
      let transportTable = this.transportTable.passData()
      if (transportTable) {
        let newData = {
          isConfirm: Number(this.transportIsConfirm.value),
          transportDto: transportData.transportForm,
          freightDtos: transportTable,
          requirementIds: transportData.transportRequirement,
        }
        console.log(newData)
        this.updateToApiNotConfirmed(newData)
      }
    } else {
      this.sweetAlert.showSweetAlert('No change information')
    }
  }

  processUpdateInTransit() {
    let transportData = this.transportPlanEdit.checkSubmitDetails()
    if (transportData) {
      let passData = {
        transportId: this.data.TransportId,
        warehouseId: transportData.transportForm.warehouseId,
        estimatedArrivalTime: transportData.transportForm.estimatedArrivalTime,
      }
      this.dialog
        .open(CommentDialogComponent, {
          width: '550px',
          // height: '400px',
          data: { label: 'Change comments during transportation' },
        })
        .afterClosed()
        .subscribe((res) => {
          console.log(res)
          passData['updateInTransComments'] = res
          this.updateToAPiInTransit(passData)
        })
    } else {
      this.sweetAlert.showSweetAlert('No change information')
    }
  }

  updateToApiNotConfirmed(data) {
    console.log(data)
    this.transportEndpoint._updateTransportById(data).subscribe((res) => {
      console.log(res), this.sweetAlert.showSuccessMessage('Successful change'), this.updateNewDataOnSucessUpdate(data.transportDto.transportId)
    })
  }

  updateToAPiInTransit(data) {
    console.log(data)
    this.transportEndpoint._updateTransportInTransit(data).subscribe((res) => {
      console.log(res), this.sweetAlert.showSuccessMessage('Successful change'), this.updateNewDataOnSucessUpdate(data.transportId)
    })
  }

  updateNewDataOnSucessUpdate(transportId) {
    this.transportEndpoint._getTransportPlanById(transportId).subscribe((res) => {
      console.log(res)
      this.data = res[0]
      this.statusInit()
    })
  }
}
