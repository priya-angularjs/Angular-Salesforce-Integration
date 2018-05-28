import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {MenuComponent} from "../menu/menu.component";
import {SchedulerComponent} from "../scheduler/scheduler.component";
import {LoginComponent} from "../login/login.component";

const routes: Routes = [
  {path: '', component: MenuComponent,
  children: [{ path: 'scheduler', component: SchedulerComponent },
    {path: '', component: LoginComponent}]}
];

@NgModule({
  imports: [
    CommonModule, RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
