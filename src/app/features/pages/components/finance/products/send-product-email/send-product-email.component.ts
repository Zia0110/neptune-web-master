import { Component, Inject, OnInit, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { AppConfigStore } from '../../../../../../core/services/app-config.store'
import { FinanceEndpoint } from '../../../../services/endpoints/finance.endpoint'

@Component({
  selector: 'app-send-product-email',
  templateUrl: './send-product-email.component.html',
  styleUrls: ['./send-product-email.component.css'],
})
export class SendProductEmailComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  ELEMENT_DATA = []
  displayedColumns: string[] = ['position', 'name', 'group', 'email', 'handle']
  dataSource = new MatTableDataSource(this.ELEMENT_DATA)

  constructor(
    public dialogRef: MatDialogRef<SendProductEmailComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public appConfigStore: AppConfigStore,
    private financeEndpoint: FinanceEndpoint
  ) {}

  ngOnInit() {
    this.data
      .filter((row: any) => {
        const emailArray = []
        if (row.Email) {
          emailArray.push(row.Email)
        }
        if (row.ExtraEmails.length) {
          row.ExtraEmails.map((email) => emailArray.push(email.Email))
        }
        return row.CustomerId && row.CustomerCode && row.CustomerName && emailArray.length
      })
      .map((value: any, index: number) => {
        const emailArray = []
        if (value.Email) {
          emailArray.push(value.Email)
        }
        if (value.ExtraEmails.length) {
          value.ExtraEmails.map((email) => emailArray.push(email.Email))
        }
        this.ELEMENT_DATA.push({
          position: index + 1,
          name: {
            id: value.CustomerId,
            name: '（' + value.CustomerCode + '）' + value.CustomerName,
          },
          group: value.CustomerGroupName,
          email: emailArray,
          handle: '',
        })
      })
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA)
    this.dataSource.paginator = this.paginator
  }
}
