import { Injectable } from '@angular/core'
import { Observable, BehaviorSubject, Subject } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { UserEndpoint } from '../endpoints/user.endpoint'
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr'

@Injectable()
export class NotificationService {
  public _hubConnection: HubConnection
  msgs = []

  constructor() {
    this.buildConnect()
  }
  buildConnect() {
    this._hubConnection = new HubConnectionBuilder().withUrl('http://45.76.123.59:5050/api/User/Login').build()

    this._hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch((err) => console.log('Error while establishing connection :('))

    this._hubConnection.on('SendMsg', (type: string, payload: string) => {
      this.msgs.push({ severity: type, summary: payload })
    })
  }
}
