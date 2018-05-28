import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginStatus: boolean;

  constructor(private router: Router) { }

  ngOnInit() {
    this.login();
  }
  login(){
    const accessToken = localStorage.getItem('jsforce0_access_token');
    if (accessToken != null) {
      this.loginStatus = false;
      this.router.navigate(['scheduler']);
    }
    else{
      this.loginStatus = true;
      this.router.navigate(['/'])
    }
  }

}
