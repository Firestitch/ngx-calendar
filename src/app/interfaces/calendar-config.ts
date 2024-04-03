
import { FilterConfig } from '@firestitch/filter';

import { Observable } from 'rxjs';

import { CalendarOptions, DurationInput, EventSourceFuncArg } from '@fullcalendar/core';
import { CalendarView } from '../enums';
import { ToolbarMenuItem } from './toolbar-menu-item';

export interface CalendarConfig {
  eventsFetch?: (data: EventSourceFuncArg, query?) => Observable<CalendarEvent[]>;
  filterConfig?: FilterConfig;
  fullcalendarConfig?: CalendarOptions;
  weekendToggle?: boolean;
  dayToday?: boolean;
  weekScrollToTime?: string;
  initialized?: () => void;
  toolbarMenuItems?: ToolbarMenuItem[];
  views?: CalendarView[];
  defaultView?: CalendarView;
}


export interface CalendarEvent {
  id?: string;
  title?: string;
  start: Date|string;
  groupId?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  classNames?: string[];
  end?: Date|string;
  data?: { [key: string]: any };
  allDay?: boolean;
  editable?: boolean;
  resourceEditable?: boolean;
  startEditable?: boolean;
  durationEditable?: boolean;
  display?: 'auto' | 'block' | 'list-item' | 'background' | 'inverse-background' | 'none';
  duration?: DurationInput;

}
