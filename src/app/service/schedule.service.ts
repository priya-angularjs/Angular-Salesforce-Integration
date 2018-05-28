import {Injectable, Inject} from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {APP_CONFIG, IAppConfig} from '../app.config';
import * as moment from 'moment';

@Injectable()
export class ScheduleService {
  private eventUrl = `${this.config.apiEndpoint}`;
  private userUrl = `${this.config.apiEndpoint}`;
  private query = 'query?q=select id,Subject,StartDateTime,EndDateTime,Location,CreatedById,OwnerId,IsAllDayEvent from Event ORDER BY StartDateTime DESC';
  private updateUrl = `${this.config.apiEndpoint}/sobjects/Event`;

  constructor(@Inject(APP_CONFIG) private config: IAppConfig, private http: HttpClient) {
  }

  public getEventSearch(StartDateTime, EndDateTime): Observable<any> {
    const start = moment.utc(StartDateTime).subtract(1, 'days').format();
    const end = moment.utc(EndDateTime).add(1, 'day').format();
    const query = `select id,Subject,StartDateTime,EndDateTime,OwnerId,IsAllDayEvent from Event where StartDateTime>=${start} and StartDateTime<=${end}`;

    return this.http.get(`${this.eventUrl}/query?q=${query}`,
      {responseType: 'text'}).map(res => {
      return JSON.parse(res);
    });
  }

  public getEventbyAlias(StartDateTime, EndDateTime, alaisId): Observable<any> {
    const start = moment.utc(StartDateTime).subtract(1, 'days').format();
    const end = moment.utc(EndDateTime).add(1, 'day').format();
    //'0057F000002u9VFQAY','0057F00000331MVQAY'
    const query = `select id,Subject,StartDateTime,EndDateTime,OwnerId,IsAllDayEvent from Event where StartDateTime>=${start} and StartDateTime<=${end} and OwnerId IN (${alaisId.map((el) => "'" + el + "'")})`;

    return this.http.get(`${this.eventUrl}/query?q=${query}`,
      {responseType: 'text'}).map(res => {
      return JSON.parse(res);
    });
  }

  getUser(): Observable<any> {
   
     const userQuery = `select id,Name,Alias from user`;
    return this.http.get(`${this.userUrl}/query?q=${userQuery}`, {responseType: 'text'}).map(res => {
      return JSON.parse(res);
    });
  }

  public updateEvent(updateEventFrom): Observable<any> {
    const options = {
      StartDateTime: updateEventFrom.startDate,
      EndDateTime: updateEventFrom.endDate,
      Subject: updateEventFrom.title
    };
    return this.http.patch(`${this.updateUrl}/${updateEventFrom.eventId}`, options,
      {responseType: 'text'}).map(res => {
      return res;
    });
  }
}
