import { Component, EventEmitter, Inject, OnInit, Optional, Output } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { SweetAlertService } from '../../../../../../../core/alert/sweet-alert.service'
import { FinanceEndpoint } from '../../../../../services/endpoints/finance.endpoint'

@Component({
  selector: 'app-price-update-dialog',
  templateUrl: './price-update-dialog.component.html',
  styleUrls: ['./price-update-dialog.component.css'],
})
export class PriceUpdateDialogComponent implements OnInit {
  @Output() outputData = new EventEmitter()
  productFormControl = new FormControl()
  isCustomerStock = true
  // price class models
  SVIP: any
  DG: any
  VIP: any
  Retail: any
  unknown: any
  // Response Data
  resData: any

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private sweetAlertService: SweetAlertService,
    public dialogRef: MatDialogRef<PriceUpdateDialogComponent>,
    private financeEndpoint: FinanceEndpoint
  ) {}

  ngOnInit(): void {
    this.productFormControl.valueChanges.subscribe((id) => {
      if (!id) {
        this.isCustomerStock = true
        this.SVIP = null
        this.DG = null
        this.VIP = null
        this.Retail = null
        this.unknown = null
        return
      }
      const beginDate = this.data.beginDate ? this.data.beginDate : '2020-01-01'
      const endDate = this.data.endDate ? this.data.endDate : '2020-01-01'
      this.financeEndpoint
        ._GetAllProductsPriceListHistoryByDate(beginDate, endDate, id)
        .toPromise()
        .then((res: any) => {
          if (!res.length) {
            this.isCustomerStock = true
            this.sweetAlertService.successAlert('This product belongs to customer stock, so there is no price!')
            this.SVIP = null
            this.DG = null
            this.VIP = null
            this.Retail = null
            this.unknown = null
          } else if (!this.data.beginDate && !this.data.endDate) {
            this.isCustomerStock = false
            this.resData = res[0].PriceListDtos
            this.sweetAlertService.successAlert('Lastest price extracted Successfully!')
            this.SVIP = res[0].PriceListDtos.filter((row) => row.CustomerGroupName === 'SVIP')[0].Price
            this.DG = res[0].PriceListDtos.filter((row) => row.CustomerGroupName === 'DG')[0].Price
            this.VIP = res[0].PriceListDtos.filter((row) => row.CustomerGroupName === 'VIP')[0].Price
            this.Retail = res[0].PriceListDtos.filter((row) => row.CustomerGroupName === 'Retail')[0].Price
            this.unknown = res[0].PriceListDtos.filter((row) => row.CustomerGroupName === 'unknown')[0].Price
          } else {
            this.isCustomerStock = false
            this.resData = res[0].PriceListDtos
            this.sweetAlertService.successAlert('History price extracted Successfully!')
            this.SVIP = res[0].PriceListDtos.filter((row) => row.CustomerGroupName === 'SVIP')[0].PriceHistories[0].Price
            this.DG = res[0].PriceListDtos.filter((row) => row.CustomerGroupName === 'DG')[0].PriceHistories[0].Price
            this.VIP = res[0].PriceListDtos.filter((row) => row.CustomerGroupName === 'VIP')[0].PriceHistories[0].Price
            this.Retail = res[0].PriceListDtos.filter((row) => row.CustomerGroupName === 'Retail')[0].PriceHistories[0].Price
            this.unknown = res[0].PriceListDtos.filter((row) => row.CustomerGroupName === 'unknown')[0].PriceHistories[0].Price
          }
        })
    })
  }

  async onClose(isSave?) {
    if (!isSave) {
      this.dialogRef.close()
    } else {
      const saveAlert = await this.sweetAlertService.saveAlert('Sure to confirm?')
      if (!saveAlert.value) {
        return
      }
      const postData = []
      this.resData.map((item: any) => {
        if (!this.data.beginDate && !this.data.endDate) {
          switch (item.CustomerGroupName) {
            case 'SVIP':
              postData.push({
                priceId: item.PriceId,
                price: this.SVIP,
              })
              break
            case 'DG':
              postData.push({
                priceId: item.PriceId,
                price: this.DG,
              })
              break
            case 'VIP':
              postData.push({
                priceId: item.PriceId,
                price: this.VIP,
              })
              break
            case 'Retail':
              postData.push({
                priceId: item.PriceId,
                price: this.Retail,
              })
              break
            case 'unknown':
              postData.push({
                priceId: item.PriceId,
                price: this.unknown,
              })
              break
          }
        } else {
          switch (item.CustomerGroupName) {
            case 'SVIP':
              postData.push({
                historyId: item.PriceHistories[0].HistoryId,
                price: this.SVIP,
              })
              break
            case 'DG':
              postData.push({
                historyId: item.PriceHistories[0].HistoryId,
                price: this.DG,
              })
              break
            case 'VIP':
              postData.push({
                historyId: item.PriceHistories[0].HistoryId,
                price: this.VIP,
              })
              break
            case 'Retail':
              postData.push({
                historyId: item.PriceHistories[0].HistoryId,
                price: this.Retail,
              })
              break
            case 'unknown':
              postData.push({
                historyId: item.PriceHistories[0].HistoryId,
                price: this.unknown,
              })
              break
          }
        }
      })
      this.financeEndpoint.UpdatePrice(postData).subscribe((_) => {
        this.sweetAlertService.successAlert('Update successfully!')
        this.outputData.emit(true)
      })
      this.dialogRef.close()
    }
  }
}
