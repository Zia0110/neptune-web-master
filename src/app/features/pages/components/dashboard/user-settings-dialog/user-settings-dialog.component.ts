import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'
import { MatStepper } from '@angular/material/stepper'
import { AppConfigStore } from '../../../../../core/services/app-config.store'

@Component({
  selector: 'app-user-settings-dialog',
  templateUrl: './user-settings-dialog.component.html',
  styleUrls: ['./user-settings-dialog.component.css'],
})
export class UserSettingsDialogComponent implements OnInit {
  data: any
  constructor(private appConfigSettings: AppConfigStore) {}

  ngOnInit() {
    this.data = this.appConfigSettings.appSettings
  }

  ngAfterViewInit() {}
}
