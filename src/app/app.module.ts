import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgModule} from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
/*Component*/
import {AppComponent} from './app.component';
import {SchedulerComponent} from './scheduler/scheduler.component';
import {MenuComponent} from './menu/menu.component';
import {LoginComponent} from './login/login.component';

/*Modules*/
import {AppRoutingModule} from "./app-routing/app-routing.module";
import {
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatChipsModule
} from "@angular/material";
import {MediaMatcher} from '@angular/cdk/layout';
import {ScheduleModule} from 'primeng/schedule';
import {DialogModule} from 'primeng/dialog';
import {CalendarModule} from 'primeng/calendar';
import {SelectModule} from 'ng2-select';
import {TooltipModule} from 'primeng/tooltip';
import {InputTextModule} from 'primeng/inputtext';
import {MultiSelectModule} from 'primeng/multiselect';

/*Services*/
import {ScheduleService} from "./service/schedule.service";
import {APP_CONFIG, AppConfig} from './app.config';
import {HttpLogInterceptor} from "./http.interceptor";


@NgModule({
  declarations: [
    AppComponent,
    SchedulerComponent,
    MenuComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    AppRoutingModule, MatToolbarModule,
    MatSidenavModule, MatIconModule,
    MatCardModule, MatChipsModule,
    MatButtonModule, HttpClientModule,
    ScheduleModule, FormsModule,
    ReactiveFormsModule, SelectModule,
    TooltipModule, DialogModule, CalendarModule,
    InputTextModule, MultiSelectModule


  ],
  providers: [MediaMatcher, ScheduleService, {provide: APP_CONFIG, useValue: AppConfig},
    {provide: HTTP_INTERCEPTORS, useClass: HttpLogInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
