import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  email: any;
  constructor() { }

  ngOnInit() {
  }

  send(): void {

    alert("Verification has been send to: " + this.email);

  }

}
