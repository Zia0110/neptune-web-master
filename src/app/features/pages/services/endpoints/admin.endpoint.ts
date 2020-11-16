import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../../environments/environment'

@Injectable()
export class AdminEndPoint {
  baseUrl = environment.baseUrl
  gzipBaseUrl = environment.gzipBaseUrl
  constructor(private http: HttpClient) {}

  _getAdminUsers() {
    return this.http.get(this.baseUrl + '/api/User/GetAllAppUsers')
  }

  _getDepartment() {
    return this.http.get(this.baseUrl + '/api/Dept')
  }

  _newDept(dept) {
    return this.http.post(this.baseUrl + '/api/Dept/', dept)
  }

  _deleteDept(deptId) {
    return this.http.delete(this.baseUrl + '/api/Dept/' + deptId)
  }

  _updateAdminAccount(user, userId) {
    return this.http.put(this.baseUrl + '/api/User/UpdateAppUserByUserId/' + userId, user)
  }

  _newAdminAccount(user) {
    return this.http.post(this.baseUrl + '/api/User/Register', user)
  }

  _deletUser(userId) {
    return this.http.delete(this.baseUrl + '/api/User/' + userId)
  }

  _reset(userId) {
    return this.http.put(this.baseUrl + '/api/User/ForgotPassword/' + userId, null)
  }

  // Get all roles and their info
  _getRoles() {
    return this.http.get(this.baseUrl + '/api/Role')
  }
  // Create new role
  _newRole(data) {
    return this.http.post(this.baseUrl + '/api/Role', data)
  }
  _updateRole(roleId, data) {
    return this.http.put(this.baseUrl + '/api/Role/' + roleId, data)
  }
  _deleteRole(roleId) {
    return this.http.delete(this.baseUrl + '/api/Role/' + roleId)
  }
  _newRolePage(data) {
    return this.http.post(this.baseUrl + '/api/RolePageMapping/', data)
  }
  _deleteRolePage(mappingId) {
    return this.http.delete(this.baseUrl + '/api/RolePageMapping/DeleteRolePageMapping/' + mappingId)
  }
  _getAllPages() {
    return this.http.get(this.baseUrl + '/api/PageGroup')
  }

  _getAllPageGroup() {
    return this.http.get(this.baseUrl + '/api/PageGroup')
  }

  _newPageGroup(data) {
    return this.http.post(this.baseUrl + '/api/PageGroup', data)
  }

  _updatePageGroup(id, data) {
    return this.http.put(this.baseUrl + '/api/PageGroup/' + id, data)
  }

  _deletePageGroup(id) {
    return this.http.delete(this.baseUrl + '/api/PageGroup/' + id)
  }

  _newPage(data) {
    return this.http.post(this.baseUrl + '/api/Page', data)
  }

  _updatePage(id, data) {
    return this.http.put(this.baseUrl + '/api/Page/' + id, data)
  }

  // Admin Notification
  _getEventType() {
    return this.http.get(this.baseUrl + '/api/EventType/GetAllEventType')
  }

  _getSubscriptions() {
    return this.http.get(this.baseUrl + '/api/Subscription')
  }

  _subscribe(data) {
    return this.http.post(this.baseUrl + '/api/Subscription/CreateSubscription', data)
  }

  _unsbscribe(subscriptionId) {
    return this.http.delete(this.baseUrl + '/api/Subscription?subscriptionId=' + subscriptionId)
  }
}
