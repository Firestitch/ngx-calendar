import { Directive } from '@angular/core';

import { ViewApi } from '@fullcalendar/core';
import { EventImpl } from '@fullcalendar/core/internal';


@Directive({
  selector: '[fsCalendarEvent]',
})
export class CalendarEventDirective {

  public static ngTemplateContextGuard(
    directive: CalendarEventDirective,
    context: unknown,
  ): context is CalendarEventContext {
    return true;
  }
}

interface CalendarEventContext {
  data: any;
  view: ViewApi;
  event: EventImpl;
  timeText: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  isDraggable: boolean;
  isStartResizable: boolean;
  isEndResizable: boolean;
  isStart: boolean;
  isEnd: boolean;
  isPast: boolean;
  isFuture: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDragging: boolean;
  isResizing: boolean;
}
