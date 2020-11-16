import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { SweetAlertService } from '../../core/alert/sweet-alert.service'
import { AuthService } from '../../core/auth/auth.service'
import { AppConfigStore } from '../../core/services/app-config.store'
import { UserPasswordResetDialogComponent } from '../../features/pages/components/dashboard/user-password-reset/user-password-reset-dialog.component'
import { UserSettingsDialogComponent } from '../../features/pages/components/dashboard/user-settings-dialog/user-settings-dialog.component'
import { SearchSelectionServiceService } from '../../shared/common-components/search-selection/search-selection-service.service'
import { MenuItems } from '../menu-items'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class AppHeaderComponent implements OnInit {
  mobile = false
  currentMenuItems: Array<
    | { Url: string; type: string; PageName: string; Icon: string; GroupName?: undefined; Children?: undefined }
    | {
        GroupName: string
        type: string
        Icon: string
        Url: string
        Children: Array<{ Url: string; type: string; PageName: string; Icon: string }>
        PageName?: undefined
      }
  >

  constructor(
    private searchSelectionServiceService: SearchSelectionServiceService,
    public dialog: MatDialog,
    private authService: AuthService,
    public menuItems: MenuItems,
    public appConfigStore: AppConfigStore,
    public sweetAlertService: SweetAlertService
  ) {
    // this.currentMenuItems = menuItems.getMenuitem()
    this.currentMenuItems = appConfigStore.navItems
  }

  ngOnInit() {
    this.screenSizeDetermine()
    window.matchMedia('(max-width: 960px)').addEventListener('change', (res) => {
      this.screenSizeDetermine()
    })
  }

  screenSizeDetermine() {
    // console.log(window.innerWidth)
    if (window.innerWidth < 960) {
      // 768px portrait
      this.mobile = true
      // console.log('mobile')
    } else {
      this.mobile = false
      // console.log('computer')
    }
  }

  ngAfterViewInit() {}

  // Log user out
  logout() {
    this.authService.logoutCurrentUser()
  }

  openUserSettings() {
    const dialogRef = this.dialog.open(UserSettingsDialogComponent, {
      width: '600px',
      // data: ,
    })
  }

  userResetPassword() {
    const dialogRef = this.dialog.open(UserPasswordResetDialogComponent, {
      width: '600px',
      // data: ,
    })
  }

  resetProductAndCustomerData() {
    this.searchSelectionServiceService.products = []
    this.searchSelectionServiceService.baseProducts = []
    this.searchSelectionServiceService.customers = []
    this.searchSelectionServiceService.stockCustomers = []
    this.searchSelectionServiceService.warehouses = []
    if (
      !this.searchSelectionServiceService.products.length &&
      !this.searchSelectionServiceService.baseProducts.length &&
      !this.searchSelectionServiceService.customers.length &&
      !this.searchSelectionServiceService.stockCustomers.length &&
      !this.searchSelectionServiceService.warehouses.length
    ) {
      this.sweetAlertService.successAlert('Data source reset successfully!')
    } else {
      this.sweetAlertService.showSweetAlert('Data updated failed. Please contact admin to inspect.')
    }
  }
}
