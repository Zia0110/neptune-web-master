import { Component, OnInit, ViewChild } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { AppConfigStore } from '../../../../../core/services/app-config.store'
import { TransportEndpoint } from '../../../services/endpoints/transport.endpoint'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { FormValidationDirective } from '../../../../../shared/directives/form-validation.directive'
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router'

@Component({
  selector: 'app-transport-plan-list',
  templateUrl: './transport-plan-list.component.html',
  styleUrls: ['./transport-plan-list.component.css'],
})
export class TransportPlanListComponent implements OnInit {
  transportData = null
  filterData = null
  warehouseList = []
  currentStatus: string

  constructor(
    private route: ActivatedRoute,
    private sweetAlert: SweetAlertService,
    private appConfigData: AppConfigStore,
    private transportEndpoint: TransportEndpoint
  ) {}

  ngOnInit() {
    for (let x of this.appConfigData.appSettings.Mapping.TransportStatus) {
      let y = {
        value: x.Status,
        view: x.StatusName,
      }
      this.warehouseList.push(y)
    }

    let qp = 'status=1&status=2&status=3&status=4'

    this.route.paramMap.subscribe((paramMap) => {
      this.currentStatus = paramMap.get('status')
      if (this.currentStatus) {
        qp = 'status=' + this.currentStatus
      }
      this.getTransportListApi(qp)
    })

    // this.currentStatus = this.route.snapshot.paramMap.get('status')
    // console.log(this.currentStatus)
    // if (this.currentStatus) {
    //   qp = 'status=' + this.currentStatus
    // }
  }

  warehouseSelectSearch($event) {
    let qp = 'status=' + $event
    this.getTransportListApi(qp)
  }

  getTransportListApi(status) {
    this.transportEndpoint._getTransportPlanByStatus(status).subscribe((res) => {
      console.log(res), (this.transportData = res)
    })
  }

  ngAfterViewInit() {}

  applyFilter(data) {
    // console.log(data)
    this.filterData = data
  }

  async deleteRow(data) {
    const saveAlert = await this.sweetAlert.saveAlert('Please note that you are about to delete this line！')
    if (!saveAlert.value) {
      return
    }
    this.transportEndpoint.deleteDeleteTransport(data).subscribe((_) => {
      this.sweetAlert.successAlert('Delete Successfully!')
      this.getTransportListApi(this.currentStatus)
    })
  }
}
