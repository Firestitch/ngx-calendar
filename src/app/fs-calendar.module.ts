import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FsFilterModule } from '@firestitch/filter';
import { FsMenuModule } from '@firestitch/menu';
import { FsSelectButtonModule } from '@firestitch/selectbutton';

import { CalendarComponent, CalendarEventComponent } from './components';
import { CalendarEventDirective, CalendarToolbarLeftDirective } from './directives';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,

    FsFilterModule,
    FsMenuModule,
    FsSelectButtonModule,
  ],
  declarations: [
    CalendarComponent,
    CalendarEventDirective,
    CalendarEventComponent,
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
