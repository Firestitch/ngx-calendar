import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';

import { CalendarComponent, CalendarConfig, CalendarEvent, CalendarView } from '@firestitch/calendar';
import { ItemType } from '@firestitch/filter';

import { of } from 'rxjs';

import { EventSourceFuncArg } from '@fullcalendar/core';
import { addDays, addHours } from 'date-fns';


@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleComponent implements OnInit {

  @ViewChild(CalendarComponent)
  public calendar: CalendarComponent;

  public config: CalendarConfig;

  public ngOnInit(): void {
    setTimeout(() => {
      this.calendar.updateEvent({
        id: '1',
        start: new Date(),
        end: addHours(new Date(), 5),
        data: {
          name: 'Billy Bob',
        },
        backgroundColor: 'pink',
        borderColor: 'pink',
      });
    }, 1000);

    this.config = {
      weekendToggle: true,
      initialized: () => {
        //
      },
      initialView: CalendarView.Day,
      initialDate: new Date(),
      weekScrollToTime: '08:00:00',
      weekends: false,
      eventsFetch: (data: EventSourceFuncArg) => {
        const events: CalendarEvent[] = [
          {
            id: '1',
            start: new Date(),
            end: addHours(new Date(), 5),
            data: {
              name: 'Billy Bob',
            },
          },
          {
            id: '2',
            // start: format(addDays(new Date(),1),'yyyy-MM-dd'),
            // end: format(addDays(new Date(),2),'yyyy-MM-dd'),
            start: addDays(new Date(), 1),
            end: addDays(new Date(), 2),
            allDay: true,
            data: {
              name: 'Jane Smith',
            },
          },
        ];

        return of(events);
      },
      fullcalendarConfig: {
        slotDuration: '00:15:00',
        selectable: true,
        allDaySlot: true,
        //timeZone: 'America/Toronto',
      },
      filterConfig: {
        items: [
          {
            type: ItemType.Text,
            label: 'Search',
            name: 'search',
          },
        ],
      },
      // views: [
      //   CalendarView.Week,
      // ],
      toolbarMenuItems: [
        {
          label: 'Do Something',
          click: () => {
            //
          },
        },
      ],
    };
  }

}
