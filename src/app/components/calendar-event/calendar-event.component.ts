import { ChangeDetectionStrategy, Component, OnDestroy, TemplateRef, inject } from '@angular/core';

import { Subject } from 'rxjs';

import { EventContentArg } from '@fullcalendar/core';

import { CalendarEventDirective } from '../../directives';
import { NgTemplateOutlet } from '@angular/common';


@Component({
    selector: 'app-calendar-event',
    templateUrl: './calendar-event.component.html',
    styleUrls: ['./calendar-event.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgTemplateOutlet],
})
export class CalendarEventComponent implements OnDestroy {
  eventContentArg = inject<EventContentArg>('eventContentArg' as any);
  eventTemplate = inject<TemplateRef<CalendarEventDirective>>('eventTemplate' as any);


  private _destroy$ = new Subject();

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }


}
