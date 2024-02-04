import {
  AfterContentInit,
  ApplicationRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ContentChild,
  ElementRef,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ComponentPortal, DomPortalOutlet } from '@angular/cdk/portal';

import { FilterComponent, FilterConfig } from '@firestitch/filter';

import { fromEvent, Subject } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';

import {
  Calendar,
  EventContentArg,
} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

import { CalendarEventDirective } from '../../directives';
import { CalendarView } from '../../enums';
import { CalendarConfig, CalendarEvent } from '../../interfaces';
import { CalendarEventComponent } from '../calendar-event';


@Component({
  selector: 'fs-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit, OnDestroy, AfterContentInit {

  @ContentChild(CalendarEventDirective, { read: TemplateRef })
  public eventTemplate: TemplateRef<CalendarEventDirective>;

  @ViewChild('calendar', { static: true, read: ElementRef })
  public calendarEl;

  @ViewChild(FilterComponent, { static: false })
  public filter: FilterComponent;

  @Input() public config: CalendarConfig;

  public title: string;
  public calendar: Calendar;
  public showWeekends = true;
  public calendarView = CalendarView.Week;
  public CalendarView = CalendarView;
  public toolbarMenuItems = [];
  public filterConfig: FilterConfig;

  private _destroy$ = new Subject();

  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _appRef: ApplicationRef,
    private _injector: Injector,
    private _cdRef: ChangeDetectorRef,
    private _breakpointObserver: BreakpointObserver,
  ) { }

  public ngAfterContentInit(): void {
    this._initCalendar();
  }

  public ngOnInit(): void {
    this._initResize();
    this._initFilterConfig();
    this._initToolbarMenu();
  }

  public today(): void {
    this.calendar.today();
  }

  public calendarPrev(): void {
    this.calendar.prev();
  }

  public calendarNext(): void {
    this.calendar.next();
  }

  public calendarViewChange(value: CalendarView): void {
    this.calendarView = value;
    this.calendar.changeView(value);
  }

  public toolbarMenuItemClick(toolbarMenuItem): void {
    toolbarMenuItem.click();
  }

  public weekendToggle(): void {
    this.showWeekends = !this.showWeekends;
    this.calendar.setOption('weekends', this.showWeekends);
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public updateEvent(event: CalendarEvent): void {
    let eventImpl = this.calendar.getEventById(event.id);

    if(eventImpl) {
      eventImpl.setDates(eventImpl.start, eventImpl.end, { allDay: eventImpl.allDay });
    } else {
      eventImpl = this.calendar.addEvent(event);
    }

    Object.keys(event.data)
      .forEach((name) => {
        eventImpl.setExtendedProp(name, event.data[name]);
      });
  }

  private _initResize(): void {
    this._breakpointObserver.observe([
      '(max-width: 599px)',
    ])
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((result: BreakpointState) => {
        if (result.breakpoints['(max-width: 599px)']) {
          if (this.calendar) {
            this.calendarViewChange(CalendarView.Day);
            this._cdRef.markForCheck();
          }
        }
      });

    fromEvent(window, 'resize')
      .pipe(
        debounceTime(300),
        takeUntil(this._destroy$),
      )
      .subscribe((e: any) => {
        this.calendar.render();
      });
  }

  private _initFilterConfig(): void {
    if(this.config.filterConfig) {
      this.filterConfig = {
        ...this.config.filterConfig,
        change: () => {
          this.calendar.refetchEvents();
        },
      };
    }
  }

  private _initToolbarMenu(): void {
    this.toolbarMenuItems = this.config.toolbarMenuItems || [];
  }

  private _initCalendar(): void {
    this.calendar = new Calendar(this.calendarEl.nativeElement, {
      headerToolbar: false,
      editable: true,
      contentHeight: 'auto',
      allDaySlot: false,
      firstDay: 0,
      initialView: 'timeGridWeek',
      stickyHeaderDates: true,
      nowIndicator: true,
      weekends: this.showWeekends,
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      views: {
        dayGridMonth: {
          displayEventEnd: true,
        },
      },
      eventClassNames: (arg) => {
        return [];
      },
      eventDrop:() => {

      },
      selectable: false,
      eventContent: (arg: EventContentArg) => {
        const el = document.createElement('div');
        el.classList.add('calendar-event');

        const injector = Injector.create({
          parent: this._injector,
          providers: [
            {
              provide: 'eventContentArg',
              useValue: arg,
            },
            {
              provide: 'eventTemplate',
              useValue: this.eventTemplate,
            },
          ],
        });

        const componentPortal = new ComponentPortal(CalendarEventComponent, null, injector);

        new DomPortalOutlet(
          el,
          this._componentFactoryResolver,
          this._appRef,
          this._injector,
        ).attach(componentPortal);

        return { domNodes: [el] };
      },
      events: (info) => {
        if(this.config.eventsFetch) {
          const query = this.filter?.filterParamsQuery || {};

          return this.config.eventsFetch(info, query)
            .pipe(
              map((events) => {

                return events
                  .map((event) => ({
                    ...event,
                    extendedProps: event.data,
                    data: undefined,
                  }),
                  );
              }),
              takeUntil(this._destroy$),
            )
            .toPromise();
        }
      },
      dayHeaderContent : (e) => {
        return { html: `
          <div class="name">${e.date.toLocaleString('en-US', { weekday: 'short' })}</div>
          <div class="number">${e.date.getDate()}</div>
          `,
        };
      },
      ...this.config.fullcalendarConfig,
      eventsSet: (data) => {
        if(this.config.fullcalendarConfig?.eventsSet) {
          this.config.fullcalendarConfig.eventsSet(data);
        }

        const startMonth = this.calendar.view.activeStart
          .toLocaleString('default', { month: 'long' });

        const endMonth = this.calendar.view.activeEnd
          .toLocaleString('default', { month: 'long' });

        const month = startMonth === endMonth ? startMonth : `${startMonth} - ${endMonth}`;

        this.title = `${month} ${this.calendar.view.activeStart.getFullYear()}`;
      },
    });

    this.calendar.render();
  }

}
