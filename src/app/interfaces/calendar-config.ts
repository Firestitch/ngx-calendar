
import { FilterConfig } from '@firestitch/filter';

import { Observable } from 'rxjs';

import { CalendarOptions, DurationInput, EventSourceFuncArg } from '@fullcalendar/core';

export interface CalendarConfig {
  eventsFetch?: (data: EventSourceFuncArg, query?) => Observable<CalendarEvent[]>;
  filterConfig?: FilterConfig;
  fullcalendarConfig?: CalendarOptions;
  weekendToggle?: boolean;
  toolbarMenuItems?: {
    label: string;
    click?: () => void;
  }[];
}


export interface CalendarEvent {
  id?: string;
  title?: string;
  start: Date;
  end: Date;
  data?: { [key: string]: any };
  allDay?: boolean;
  duration?: DurationInput;
}
