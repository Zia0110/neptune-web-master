import { Component, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { NewLostEventComponent } from './new-lost-event/new-lost-event.component'
import { ShowImagesComponent } from '../../../../../shared/common-components/show-images/show-images.component'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { FormControl } from '@angular/forms'
import { WarehouseEndpoint } from '../../../services/endpoints/warehouse.endpoint'
import { DatePipe } from '@angular/common'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import * as moment from 'moment'

@Component({
  selector: 'app-warehouse-damage-lose',
  templateUrl: './warehouse-damage-lose.component.html',
  styleUrls: ['./warehouse-damage-lose.component.css'],
})
export class WarehouseDamageLoseComponent implements OnInit {
  public pickedWarehouseFormControl = new FormControl('')
  public pickedWarehouseId: any
  public pickedStartDate = moment(new Date()).subtract(3, 'months').format('YYYY-MM-DD')
  public pickedEndDate = moment(new Date()).format('YYYY-MM-DD')
  public lostEventData: any
  public dataSource: any
  public displayedColumns: string[] = ['客户', '仓库', '创建时间', '类型', '原因', '创建人', '产品明细', 'handle']
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort

  constructor(
    public dialog: MatDialog,
    public sweetAlert: SweetAlertService,
    public warehouseService: WarehouseEndpoint,
    public datePipe: DatePipe
  ) {}
  ngOnInit(): void {
    this.getPickedWarehouse()
    this.initTable()
  }

  getLocateDateString(date) {
    return date ? new Date(date.replace('T', ' ') + ' UTC') : date
  }

  public getStartDate(startDate): void {
    this.pickedStartDate = startDate
    this.setSearchParas()
  }

  public getEndDate(endDate): void {
    this.pickedEndDate = endDate
    this.setSearchParas()
  }

  public getPickedWarehouse(): void {
    this.pickedWarehouseFormControl.valueChanges.subscribe((value) => {
      setTimeout(() => {
        this.pickedWarehouseId = value
        this.setSearchParas()
        console.log(this.pickedWarehouseId)
      })
    })
  }

  getUTCdate(dateString) {
    return new Date(dateString).toISOString().replace(/\..+/, '')
  }

  // for the first showing X months data
  private initTable(): void {
    let oneMonthAgo: string = this.getInitDate()
    console.log(oneMonthAgo)
    let paraForAPI = 'beginDate=' + this.getUTCdate(oneMonthAgo) + '&endDate=' + this.getUTCdate(this.pickedEndDate)
    this.warehouseService.getLostEvent(paraForAPI).subscribe((value) => {
      console.log(value)
      this.lostEventData = value
      this.buildTable()
    })
  }

  async deleteRow(data) {
    const saveAlert = await this.sweetAlert.saveAlert('Please note that you are about to delete this line！')
    if (!saveAlert.value) {
      return
    }
    this.warehouseService.deleteLostEvent(data).subscribe((_) => {
      this.sweetAlert.successAlert('Delete Successfully!')
      this.initTable()
    })
  }

  private getInitDate(): string {
    let todayDate = Date.now()
    let today = new Date(todayDate)
    let monthsToShowFromToday: number = 3
    today.setMonth(today.getMonth() - monthsToShowFromToday)
    return this.datePipe.transform(today, 'yyyy-MM-dd')
  }

  private setSearchParas(): void {
    let warehousePara = 'warehouseId='
    let startDatePara = 'beginDate='
    let endDatePara = 'endDate='
    warehousePara += this.pickedWarehouseId == '' || this.pickedWarehouseId == undefined ? '' : this.pickedWarehouseId
    startDatePara += this.pickedStartDate == '' ? '' : this.getUTCdate(this.pickedStartDate)
    endDatePara += this.pickedEndDate == '' ? '' : this.getUTCdate(this.pickedEndDate)
    let paraForAPI = warehousePara + '&' + startDatePara + '&' + endDatePara
    this.warehouseService.getLostEvent(paraForAPI).subscribe((value) => {
      this.lostEventData = value
      this.buildTable()
    })
  }

  // both init table and filtered table all call this
  private buildTable(): void {
    if (this.lostEventData.length == 0) {
      this.sweetAlert.showSweetAlert('暂无数据!')
    } else {
      this.dataSource = new MatTableDataSource(this.lostEventData)
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.paginator
    }
  }

  private handleTime(date: string): string {
    let resDate: string
    let i = date.indexOf('T')
    resDate = date.slice(0, i)
    return resDate
  }

  public newLostEvent(): void {
    const dialogRef = this.dialog.open(NewLostEventComponent, {
      width: '95%',
      height: '90%',
    })
    dialogRef.afterClosed().subscribe((result) => {
      this.setSearchParas()
    })
  }

  public test(): void {
    // this.pickedWarehouseId = this.pickedWarehouseFormControl.value;
    // console.log(this.pickedWarehouseId);
  }

  public showImages(property): void {
    // property.LostPropertyImage
    if (property.LostPropertyImage.length == 0) {
      this.sweetAlert.showSweetAlert('暂无上传图片')
    } else {
      console.log(property)
      let urlsArray: string[] = []
      for (let url of property.LostPropertyImage) {
        urlsArray.push(url.Url)
      }
      const dialogRef = this.dialog.open(ShowImagesComponent, {
        width: '95%',
        height: '90%',
        data: {
          urlsArray: urlsArray,
          deleteAllowed: false,
          ProductName: property.ProductName,
          Qty: property.Qty,
        },
      })
    }
  }
}
