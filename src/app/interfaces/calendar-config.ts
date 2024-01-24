import { FilterConfig } from '@firestitch/filter';

import { Observable } from 'rxjs';

import { CalendarOptions, EventSourceFuncArg } from '@fullcalendar/core';

export interface CalendarConfig {
  eventsFetch?: (data: EventSourceFuncArg, query?) => Observable<{ start: Date; end: Date }[]>;
  filterConfig?: FilterConfig;
  fullcalendarConfig?: CalendarOptions;
  weekendToggle?: boolean;
  toolbarMenuItems?: {
    label: string;
    click?: () => void;
  }[];
}
