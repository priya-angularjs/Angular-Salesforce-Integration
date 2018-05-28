import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ScheduleService} from '../service/schedule.service';
import {APP_CONFIG, IAppConfig} from '../app.config';
import * as moment from 'moment';
import {SelectComponent} from "ng2-select";
import swal from "sweetalert2";

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit {
  @ViewChild('dropdown') public ngSelect: SelectComponent;
  updateEventForm: FormGroup;
  header: any;
  options: any;
  calendarData: any[];
  calendarArray = [];
  selectedNames = [];
  aliasNameArray = [];
  timeZoneOffset;
  title: string;
  startDate: string;
  endDate: string;
  intervalEnd: string;
  intervalStart: string;
  aliasId = [];
  display = false;
  userList: any;
  minDate;
  maxDate;

  constructor(private fb: FormBuilder, private http: HttpClient, private scheduleService: ScheduleService, @Inject(APP_CONFIG) private config: IAppConfig) {
  }

  ngOnInit() {
    this.getEvent(this.aliasId);
    /* Initialize the formcontrol value which binds the updated data */
    this.updateEventForm = this.fb.group({
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      createdBy: [''],
      assignedTo: [''],
      eventId: [''],
      endDate: ['', Validators.required]
    });
    this.header = {
      left: 'prev,next today refresh',
      center: 'title',
      right: 'month,agendaWeek,agendaDay',
    };
    /*custom configurations for calendar buttons*/
    this.options = {
      views: {
        month: {
          buttonText: 'Month'
        },
        agendaWeek: {
          buttonText: 'Week'
        },
        agendaDay: {
          buttonText: 'Day'
        },
      },
      buttonText: {
        today: 'Today'
      },
    };
  }

  /*Events rendered in calendar*/
  eventRender(event, element) {
    const start = moment(event.start).format('LT');
    element[0].innerHTML = start + ' ' + event.title + ' -- ' + event.assignedName;
  }

  /* click events for calendar button-it fetches the data based on date*/
  onViewRender(event) {
    localStorage.setItem('intervalStart', event.view.intervalStart._d);
    localStorage.setItem('intervalEnd', event.view.intervalEnd._d);
    this.calendarArray = [];
    this.getEvent(this.aliasId);
  }

  /*Triggered when the user clicks an event.*/
  onEventClick(event) {
    this.updateEventForm.reset();
    this.title = event.calEvent.title;
    this.startDate = event.calEvent.start._d;
    let maxDate = new Date(this.startDate);
    let day = maxDate.getDate();
    this.maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), day + 13, maxDate.getHours(), maxDate.getMinutes(), maxDate.getSeconds());

    if (event.calEvent.end === null) {
      this.endDate = '';
      this.updateEventForm.controls['endDate'].patchValue(this.startDate);
    }
    else {
      this.endDate = event.calEvent.end._d;
      this.updateEventForm.controls['endDate'].patchValue(this.endDate);
    }
    this.updateEventForm.controls['eventId'].patchValue(event.calEvent.id);
    this.updateEventForm.controls['title'].patchValue(event.calEvent.title);
    this.updateEventForm.controls['startDate'].patchValue(this.startDate);
    var minDateValue = this.updateEventForm.controls['startDate'].value;
    this.minDate = new Date(minDateValue.getFullYear(), minDateValue.getMonth(), minDateValue.getDate());


    this.updateEventForm.controls['createdBy'].patchValue(event.calEvent.createdBy);
    this.updateEventForm.controls['assignedTo'].patchValue(event.calEvent.assignedName);
    this.display = true;
  }

  /*get all the events from salesforce */
  getEvents() {
    this.aliasId = [];
    this.aliasNameArray = [];
    this.selectedNames = [];
    this.getEvent(this.aliasId);
  }

  /*get events based on aliasId(User alias name) from salesforce*/
  getEvent(aliasId) {
    this.timeZoneOffset = localStorage.getItem('timeZoneOffset');
    this.intervalStart = localStorage.getItem('intervalStart');
    this.intervalEnd = localStorage.getItem('intervalEnd');
    this.calendarArray = [];
    this.calendarData = [];
    this.userList = [];

    if (aliasId.length === 0 || this.aliasId === null) {
      this.scheduleService.getEventSearch(this.intervalStart, this.intervalEnd).subscribe(Res => {
        this.scheduleService.getUser().subscribe(UserList => {
          this.userList = UserList.records;
          this.calendarArray = [];
          this.calendarData = [];
          this.calendarArray = Res.records;
          this.aliasNameArray = [];

          for (let i = 0; i < this.calendarArray.length; i++) {
            for (let j = 0; j < this.userList.length; j++) {
              if (this.userList[j].Id === this.calendarArray[i].OwnerId) {
                this.calendarData.push({
                  id: this.calendarArray[i].Id, title: this.calendarArray[i].Subject,
                  start: moment(this.calendarArray[i].StartDateTime).utcOffset(this.timeZoneOffset),
                  end: moment(this.calendarArray[i].EndDateTime).utcOffset(this.timeZoneOffset),
                  Alias: this.userList[j].Alias, assignedName: this.userList[j].Name,
                  assignedTo: this.calendarArray[i].OwnerId,
                  allDay: this.calendarArray[i].IsAllDayEvent
                });
              }
            }
          }
          if (this.userList.length !== 0) {
            for (let j = 0; j < this.userList.length; j++) {
              this.aliasNameArray.push({
                  value: this.userList[j].Id, label: this.userList[j].Alias
                }
              );
            }
          } else {
          }

        });
      });
    }
    else {
      this.scheduleService.getEventbyAlias(this.intervalStart, this.intervalEnd, aliasId).subscribe(Res => {
        this.scheduleService.getUser().subscribe(UserList => {
          this.userList = UserList.records;
          this.calendarArray = [];
          this.calendarData = [];
          this.calendarArray = Res.records;
          this.aliasNameArray = [];
          for (let i = 0; i < this.calendarArray.length; i++) {
            for (let j = 0; j < this.userList.length; j++) {
              if (this.userList[j].Id === this.calendarArray[i].OwnerId) {
                this.calendarData.push({
                  id: this.calendarArray[i].Id, title: this.calendarArray[i].Subject,
                  start: moment(this.calendarArray[i].StartDateTime).utcOffset(this.timeZoneOffset),
                  end: moment(this.calendarArray[i].EndDateTime).utcOffset(this.timeZoneOffset),
                  Alias: this.userList[j].Alias, assignedName: this.userList[j].Name,
                  assignedTo: this.calendarArray[i].OwnerId,
                  allDay: this.calendarArray[i].IsAllDayEvent
                });
              }
            }
          }
          if (this.userList.length !== 0) {
            for (let j = 0; j < this.userList.length; j++) {
              this.aliasNameArray.push({
                  value: this.userList[j].Id, label: this.userList[j].Alias
                }
              );
            }
          }
          else {
            this.aliasNameArray = [];
          }
        });
      });
    }
  }

  /*Update events to salesforce*/
  updateEvents(model: FormGroup) {
    this.scheduleService.updateEvent(model.value).subscribe(Res => {
        this.getEvent(this.aliasId);
        this.display = false;
        swal({
          type: 'success',
          title: 'Your Event has been Updated',
          showConfirmButton: false,
          timer: 1500
        });
      },
      error => {
        this.display = false;
        swal({
          type: 'error',
          title: 'Your Event has not Saved',
          showConfirmButton: false,
          timer: 1500
        });
      });
  }

  /*select aliasid-which retriews events based on that selected aliasId*/
  selected(event: any) {
    this.aliasId = event.value;
    this.calendarData = [];
    this.calendarArray = [];
    if (this.aliasId.length !== 0) {
      this.scheduleService.getEventbyAlias(this.intervalStart, this.intervalEnd, this.aliasId).subscribe(Res => {
        this.calendarArray = Res.records;
        for (let k = 0; k < this.calendarArray.length; k++) {
          for (let j = 0; j < this.userList.length; j++) {
            if (this.userList[j].Id === this.calendarArray[k].OwnerId) {
              this.calendarData.push({
                id: this.calendarArray[k].Id, title: this.calendarArray[k].Subject,
                start: moment(this.calendarArray[k].StartDateTime).utcOffset(this.timeZoneOffset),
                end: moment(this.calendarArray[k].EndDateTime).utcOffset(this.timeZoneOffset),
                Alias: this.userList[j].Alias, assignedName: this.userList[j].Name,
                assignedTo: this.calendarArray[k].OwnerId,
                allDay: this.calendarArray[k].IsAllDayEvent
              });
            }
          }

        }
      });
    }

    else {
      this.aliasId = [];
      this.getEvent(this.aliasId);
    }

  }

  /*Validation handles for startdate*/
  selectStartDate(event) {
    this.minDate = event;
    let day = event.getDate();
    this.minDate = new Date(event.getFullYear(), event.getMonth(), day);
    console.log("minDate2: "+ this.minDate);
    this.maxDate = new Date(event.getFullYear(), event.getMonth(), day + 13, event.getHours(), event.getMinutes(), event.getSeconds());
    if (moment(event).isSame(this.updateEventForm.controls['endDate'].value)) {
      this.updateEventForm.controls['startDate'].patchValue(this.startDate);
      swal({
        type: 'warning',
        title: 'Start Date and End Date should not be same',
        showConfirmButton: false,
        timer: 2000
      });
    }

    if (moment(event).diff(this.updateEventForm.controls['endDate'].value, 'days') <= -14 ||
      moment(event).diff(this.updateEventForm.controls['endDate'].value, 'days') > 0) {
      this.updateEventForm.controls['endDate'].patchValue('');
    }
    else {
      this.updateEventForm.controls['startDate'].patchValue(event);
      this.updateEventForm.controls['endDate'].patchValue('');
    }


  }

  /*Validation handles for Enddate*/
  selectEndDate(event) {
    if (moment(event).isSame(this.updateEventForm.controls['startDate'].value)) {
      console.log(this.endDate);
      this.updateEventForm.controls['endDate'].patchValue(this.endDate);
      swal({
        type: 'warning',
        title: 'Start Date and End Date should not be same',
        showConfirmButton: false,
        timer: 2000
      });
    }
    else {
      let day = event.getDate();
      let dateValue = new Date(event.getFullYear(), event.getMonth(), day, event.getHours(), event.getMinutes(), event.getSeconds());
      this.updateEventForm.controls['endDate'].patchValue(dateValue);
    }
  }

  /*Cancel the update event*/
  cancel() {
    this.display = false;
    this.updateEventForm.reset();
  }
}

