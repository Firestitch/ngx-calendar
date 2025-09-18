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

import { ActionMode, FilterComponent, FilterConfig } from '@firestitch/filter';
import { FsMenuComponent } from '@firestitch/menu';

import { fromEvent, Subject } from 'rxjs';
import { map, takeUntil, throttleTime } from 'rxjs/operators';

import {
  Calendar,
  EventContentArg,
} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

import { CalendarEventDirective, CalendarToolbarLeftDirective } from '../../directives';
import { CalendarView } from '../../enums';
import { CalendarConfig, CalendarEvent, ToolbarMenuItem } from '../../interfaces';
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

  @ContentChild(CalendarToolbarLeftDirective, { read: TemplateRef })
  public toolbarLeftTemplate: TemplateRef<CalendarToolbarLeftDirective>;

  @ViewChild('calendar', { static: true, read: ElementRef })
  public calendarEl;

  @ViewChild(FilterComponent, { static: false })
  public filter: FilterComponent;

  @ViewChild(FsMenuComponent)
  public menu: FsMenuComponent;

  @Input() public config: CalendarConfig;

  public title: string;
  public calendar: Calendar;
  public showWeekends = true;
  public calendarView: CalendarView;
  public CalendarView = CalendarView;
  public toolbarMenuItems: ToolbarMenuItem[] = [];
  public filterConfig: FilterConfig;

  private _destroy$ = new Subject();

  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _appRef: ApplicationRef,
    private _injector: Injector,
    private _cdRef: ChangeDetectorRef,
    private _el: ElementRef,
    private _breakpointObserver: BreakpointObserver,
  ) { }

  public ngAfterContentInit(): void {
    setTimeout(() => {
      this._initCalendar();
    });
  }

  public ngOnInit(): void {
    this._initConfig(this.config);
    this._initResize();
    this._initFilterConfig();
    this._initToolbarMenu();
  }

  public today(): void {
    this.calendar.gotoDate(new Date());
  }

  public calendarPrev(): void {
    this.calendar.prev();
  }

  public calendarNext(): void {
    this.calendar.next();
  }

  public calendarViewChange(value: CalendarView): void {
    if(!this.config.weekends) {
      if((value === CalendarView.Month || value === CalendarView.Week)) {
        this.calendar.setOption('weekends',false);
      } else {
        this.calendar.setOption('weekends',true);
      }
    }

    this.calendarView = value;
    this.calendar.changeView(value);
  }

  public toolbarMenuItemClick(toolbarMenuItem): void {
    toolbarMenuItem.click();
  }

  public weekendToggle(): void {
    this.showWeekends = !this.showWeekends;
    this.calendar.setOption('weekends', this.showWeekends);
    this.calendar.refetchEvents();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public filterClosed(): void {
    setTimeout(() => {
      this.calendar.render();
    });
  }

  public filterOpened(): void {
    setTimeout(() => {
      this.calendar.render();
    });
  }

  public updateEvent(event: CalendarEvent): void {
    let eventImpl = this.calendar.getEventById(event.id);
    const data = event.data;
    event.data = undefined;

    if (eventImpl) {
      eventImpl.setDates(event.start, event.end, { allDay: event.allDay });

      [
        'groupId', 'allDay', 'title', 'url', 'classNames', 'editable',
        'startEditable', 'durationEditable', 'resourceEditable', 'display',
        'overlap', 'constraint', 'backgroundColor', 'borderColor',
        'textColor', 'source',
      ]
        .filter((name) => event[name] !== undefined)
        .forEach((name) => {
          eventImpl.setProp(name, event[name]);
        });

    } else {
      Object.keys(data)
        .forEach((name) => {
          event[name] = data[name];
        });

      eventImpl = this.calendar.addEvent(event);
    }

    Object.keys(data)
      .forEach((name) => {
        eventImpl.setExtendedProp(name, data[name]);
      });
  }

  private _initConfig(config: CalendarConfig): void {
    this.config = {
      ...config,
      initialView: config.initialView || CalendarView.Week,
      weekends: config.weekends ?? true,
      views: config.views || [
        CalendarView.Day,
        CalendarView.Week,
        CalendarView.Month,
      ],
      defaultView: this.config.initialView,
    };

    this.calendarView = this.config.defaultView;
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
        throttleTime(100),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.calendar.render();
      });
  }

  private _initFilterConfig(): void {
    if (this.config.filterConfig) {
      const actions = [];
      const values = [
        { name: 'Day', value: CalendarView.Day },
        { name: 'Week', value: CalendarView.Week },
        { name: 'Month', value: CalendarView.Month },
      ]
        .filter((view) => {
          return this.config.views.indexOf(view.value) !== -1;
        });

      if (values.length > 1) {
        actions.push({
          mode: ActionMode.SelectButton,
          label: 'View',
          primary: false,
          default: this.calendarView,
          change: (value) => {
            this.calendarViewChange(value);
          },
          values,
        });
      }

      this.filterConfig = {
        ...this.config.filterConfig,
        change: () => {
          this.calendar.refetchEvents();
        },
        actions: [
          ...actions,
          ...(this.config.filterConfig?.actions || []),
        ],
      };
    }
  }

  private _initToolbarMenu(): void {
    this.toolbarMenuItems = this.config.toolbarMenuItems || [];
    if (this.config.weekendToggle) {
      this.toolbarMenuItems
        .push({
          label: 'Show weekends',
          click: () => {
            this.weekendToggle();
          },
          show: () => {
            return !this.showWeekends;
          },
        });

      this.toolbarMenuItems
        .push({
          label: 'Hide weekends',
          click: () => {
            this.weekendToggle();
          },
          show: () => {
            return this.showWeekends;
          },
        });
    }
  }

  private _initCalendar(): void {
    this.showWeekends = this.config.fullcalendarConfig.weekends === undefined || this.config.fullcalendarConfig.weekends === null
      ? true
      : this.config.fullcalendarConfig.weekends;

    this.calendar = new Calendar(this.calendarEl.nativeElement, {
      headerToolbar: false,
      editable: true,
      contentHeight: 'auto',
      allDaySlot: false,
      firstDay: 0,
      initialView: this.config.initialView,
      initialDate: this.config.initialDate,
      stickyHeaderDates: true,
      nowIndicator: true,
      weekends: this.showWeekends,
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      views: {
        dayGridMonth: {
          displayEventEnd: true,
        },
      },
      eventClassNames: () => {
        return [];
      },
      eventDrop: () => {
        //
      },
      viewDidMount: ({ el, view }) => {
        const allDayText = view.calendar.getOption('allDayText');
        view.calendar.setOption('allDayText', 'All day');
        const table = el.firstElementChild;
        let thead = table.querySelector(':scope > thead');

        if (!thead) {
          thead = document.createElement('thead');
          table.append(thead);
        }

        const tbodys = table.querySelectorAll(':scope > tbody');
        tbodys.forEach((tbody) => {
          if (tbody.innerHTML.indexOf(allDayText) !== -1) {
            const tr = tbody.querySelector('tr');
            tr.classList.add('all-day-row');
            thead.append(tr);
          }
        });
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
        if (this.config.eventsFetch) {
          const query = this.filter?.query || {};

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
      dayHeaderContent: (e) => {
        const timezone = this.calendar.getOption('timeZone');
        const name = timezone === 'local' ? format(e.date, 'E') : formatInTimeZone(e.date, 'UTC', 'E');
        let html = `<div class="name">${name}</div>`;

        if (this.calendarView !== CalendarView.Month) {
          const number = timezone === 'local' ? format(e.date, 'd') : formatInTimeZone(e.date, 'UTC', 'd');
          html += `<div class="number">${number}</div>`;
        }

        return { html };
      },
      ...this.config.fullcalendarConfig,
      eventsSet: (data) => {
        if (this.config.fullcalendarConfig?.eventsSet) {
          this.config.fullcalendarConfig.eventsSet(data);
        }

        const startMonth = this.calendar.view.activeStart
          .toLocaleString('default', { month: 'long' });

        const endMonth = this.calendar.view.activeEnd
          .toLocaleString('default', { month: 'long' });

        const month = startMonth === endMonth ? startMonth : `${startMonth} - ${endMonth}`;

        this.title = `${month} ${this.calendar.view.activeStart.getFullYear()}`;
        this._cdRef.markForCheck();
      },
    });

    this.calendar.render();

    setTimeout(() => {
      

      if(this.config.initialDate) {
        this.calendar.gotoDate(this.config.initialDate);  
      }
      if (this.config.initialized) {
        this.config.initialized();
      }

      if (this.config.weekScrollToTime) {
        this._weekScrollToTime(this.config.weekScrollToTime);
      }
    });
  }

  private _weekScrollToTime(time): void {
    const el: any = this._el.nativeElement.querySelector(`td[data-time="${time}"]`);
    if (el) {
      const cal: any = this._el.nativeElement.querySelector('.calendar');
      cal?.scrollTo({ top: el.offsetTop });
    }
  }

}
