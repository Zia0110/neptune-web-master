import { Component, OnInit } from '@angular/core'
import { AdminEndPoint } from '../../../services/endpoints/admin.endpoint'
import { SweetAlertService } from '../../../../../core/alert/sweet-alert.service'
import { DefaultShowHideDirective } from '@angular/flex-layout'

@Component({
  selector: 'app-notification-configuration-management',
  templateUrl: './notification-configuration-management.component.html',
  styleUrls: ['./notification-configuration-management.component.css'],
})
export class NotificationConfigurationManagementComponent implements OnInit {
  users: any
  events: any
  allSubscriptions: any
  selectedUser: any
  userSelected: boolean = false
  isDisabled: boolean = true
  check: boolean = false
  selectAll: boolean = false
  userSubscriptions = []

  constructor(private adminEndpoint: AdminEndPoint, private popUp: SweetAlertService) {}

  ngOnInit(): void {
    this.getUserList()
    this.getEventTypes()
    this.getSubsList()
  }

  getUserList() {
    this.adminEndpoint._getAdminUsers().subscribe((res) => {
      this.users = res
      console.log('users:', res)
    })
  }

  getEventTypes() {
    this.adminEndpoint._getEventType().subscribe((res) => {
      this.events = res
      console.log('Event Types:', res)
    })
  }

  getSubsList() {
    this.adminEndpoint._getSubscriptions().subscribe((res) => {
      this.allSubscriptions = res
      console.log('Subscriptions:', res)
    })
  }

  trigger(user) {
    if (user) this.isDisabled = false
    this.userSubscriptions = []
    this.selectedUser = user
    this.userSelected = true
    this.allSubscriptions.forEach((element) => {
      if (Object.keys(element.Subscriptoins).length > 0) {
        this.getSubsOfSelectedUser(user, element.Subscriptoins, element.EventType1)
      } else {
        return
      }
    })
    console.log(this.selectedUser.UserName, this.userSubscriptions)
  }

  getSubsOfSelectedUser(user, subs, eventId) {
    subs.forEach((element) => {
      if (user.UserId == element.UserId) {
        element.EventId = eventId
        this.userSubscriptions.push(element)
      }
    })
  }

  ckeckbox(eventId): boolean {
    let keys = Object.keys(this.userSubscriptions)
    if (this.selectedUser && keys.length > 0) {
      return this.checked(eventId)
    }
  }

  checked(eventId): boolean {
    let isChecked: boolean = false
    this.userSubscriptions.forEach((element) => {
      if (eventId == element.EventId) {
        isChecked = true
      }
    })
    return isChecked
  }

  getKey(eventId) {
    const key = Object.keys(this.allSubscriptions)
    for (let i = 0; i < key.length; i++) {
      if (eventId == this.allSubscriptions[i].EventType1) {
        return i
      }
    }
  }

  onCheck(check, event) {
    if (check) {
      this.newSubscription({ eventType: event.EventTypeId, userId: this.selectedUser.UserId })
    } else {
      this.userSubscriptions.forEach((element) => {
        if (event.EventTypeId == element.EventId) {
          console.log(element.SubscriptionId)
          return this.unsbscribe(element.SubscriptionId)
        }
      })
    }
  }

  async onSelectAll(check) {
    if (check) {
      const selectAll = await this.popUp.saveAlert2('全选', '确定选择所有项目？')
      console.log(selectAll.value)
      if (!selectAll.value) {
        return
      }
      this.allSubscriptions.forEach((event) => {
        this.newSubscription({ eventType: event.EventType1, userId: this.selectedUser.UserId })
        /* event.Subscriptoins.forEach((sub) => {
          if ((this.selectedUser.UserId = sub.UserId)) return
          this.newSubscription({ eventType: event.EventTypeId, userId: this.selectedUser.UserId })
          }) */
      })
      this.trigger(this.selectedUser)
    } else {
      const deSelectAll = await this.popUp.saveAlert2('取消全选', '确定取消全选？')
      if (deSelectAll.value == true) {
        this.userSubscriptions.forEach((sub) => {
          this.unsbscribe(sub.SubscriptionId)
        })
        this.trigger(this.selectedUser)
      }
    }
  }

  isSelectAll(): boolean {
    if (this.selectedUser) {
      let userSubsKeyLength = Object.keys(this.userSubscriptions).length
      if (userSubsKeyLength > 1) {
        this.selectAll = true
        return true
      } else {
        return false
      }
    }
  }

  newSubscription(data) {
    this.adminEndpoint._subscribe(data).subscribe((res) => {
      this.trigger(this.selectedUser)
      console.log(res)
    })
  }

  unsbscribe(SubscriptionId) {
    this.adminEndpoint._unsbscribe(SubscriptionId).subscribe((res) => {
      this.trigger(this.selectedUser)
      console.log(res)
    })
  }
  s
}
