import { Injectable } from '@angular/core'
import { Observable, BehaviorSubject, Subject } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { UserEndpoint } from '../endpoints/user.endpoint'
// import { CookieService } from 'ngx-cookie-service'
import * as cookies from 'js-cookie'

// App configuration state, this is required on admin initialisatiion
// This service must only be called once user has logged in

@Injectable()
export class AppConfigStore {
  public navItems = null

  public appSettings = null

  public rolePages = null
  // OrderPipe configuration data
  public configOrderMapping = null

  // Customer Group
  public customerGroup1 = null

  // Warehouse selection list
  public warehouseSelectionList = []

  // Order statuses selection list
  public orderStatusSelectionList = []

  public userID: string
  public userName: string

  public ownerID = 446

  public superUser = '384063f8-dde8-48f3-875a-e063a025ff0d'

  constructor(
    private userEndpoint: UserEndpoint //  private cookieService: CookieService
  ) {
    this.userID = cookies.get('_userId')
    this.userName = cookies.get('_userName')

    this.adminAppLoadConfig()
  }

  // Prepare config data, get and pass fresh userID
  adminAppLoadConfig() {
    this.userEndpoint._userDataPrep(this.userID).subscribe((res) => {
      this.setAdminConfigProperties(res)
      // console.log(res)
    })
  }

  setAdminConfigProperties(data) {
    console.log({ configData: data })
    this.appSettings = data
    this.rolePages = data.RolePages
    this.navItems = data.Sidebar
    this.configOrderMapping = data.Mapping.RetailOrderTableMapping
    this.customerGroup1 = data.Mapping.CustomerGroup1

    // this.adminReturnWarehouseSelection()
    this.adminReturnOrderStatusSelection()
  }

  // Live load product list
  adminAppLoadProduct() {
    let x = this.userEndpoint._getProductsList()
    return x
  }

  // Live load client list
  adminAppLoadCustomer() {
    let x = this.userEndpoint._getClientsList()
    return x
  }

  // Provides selection list of warehouses (Use appSettings)
  // adminReturnWarehouseSelection(){
  //     for ( let value of (this.appSettings.Mapping.RetailOrderTableMapping.RetailOrderStatus)) {
  //         this.warehouseSelectionList.push({value: value.Status, view: value.StatusName})
  //     }
  // }

  // Provides selection list of order status (Use appSettings)
  adminReturnOrderStatusSelection() {
    for (let value of this.appSettings.Mapping.RetailOrderTableMapping.RetailOrderStatus) {
      this.orderStatusSelectionList.push({ value: value.Status, view: value.StatusName })
    }
  }
  isFinancial() {
    if (this.appSettings['UserInfo'].RoleName == '财务' || this.appSettings['UserInfo'].RoleName == '管理') {
      return true
    }
    return false
  }
}
