import {Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {Router, NavigationEnd} from '@angular/router';
import {SchedulerComponent} from "../scheduler/scheduler.component";
import 'rxjs/add/operator/filter';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  @ViewChild(SchedulerComponent)  schedulerComponent: SchedulerComponent;

  private readonly _mobileQueryListener: () => void;
  constructor(private router: Router, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnInit() {

    this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
    });
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
