import { NgModule } from '@angular/core';

import { CalendarComponent, CalendarEventComponent } from './components';
import { CalendarEventDirective, CalendarToolbarLeftDirective } from './directives';


@NgModule({
  imports: [
    CalendarComponent,
    CalendarEventComponent,
    CalendarEventDirective,
    CalendarToolbarLeftDirective,
  ],
  exports: [
    CalendarComponent,
    CalendarEventDirective,
    CalendarToolbarLeftDirective,
  ],
})
export class FsCalendarModule {
}
