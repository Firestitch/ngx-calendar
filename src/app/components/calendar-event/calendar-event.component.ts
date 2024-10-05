import {
  ChangeDetectionStrategy,
  Component,
  Inject, OnDestroy,
  TemplateRef,
} from '@angular/core';

import { Subject } from 'rxjs';

import { EventContentArg } from '@fullcalendar/core';

import { CalendarEventDirective } from '../../directives';


@Component({
  selector: 'app-calendar-event',
  templateUrl: './calendar-event.component.html',
  styleUrls: ['./calendar-event.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarEventComponent implements OnDestroy {

  private _destroy$ = new Subject();

  constructor(
    @Inject('eventContentArg') public eventContentArg: EventContentArg,
    @Inject('eventTemplate') public eventTemplate: TemplateRef<CalendarEventDirective>,
  ) {}

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }


}
