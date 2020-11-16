import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core'
import { AdminEndPoint } from '../../../features/pages/services/endpoints/admin.endpoint'

@Component({
  selector: 'app-assign-user',
  templateUrl: './assign-user.component.html',
  styleUrls: ['./assign-user.component.css'],
})
export class AssignUserComponent implements OnInit {
  @Input() public label
  @Output() outputData: EventEmitter<any> = new EventEmitter<any>()
  public allUsers: any
  public selected: number = 0

  constructor(private adminService: AdminEndPoint) {}

  ngOnInit(): void {
    this.adminService._getAdminUsers().subscribe((value) => {
      // console.log(value)
      // this.allUsers = value
      this.dataFilter(value)
    })
  }

  dataFilter(datas) {
    let newArray = []
    for (let data of datas) {
      if (data.IsActive) newArray.push(data)
    }
    this.allUsers = newArray
  }

  public submit(): void {
    this.outputData.emit(this.selected)
  }
}
