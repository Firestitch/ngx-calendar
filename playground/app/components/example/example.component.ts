import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { CalendarConfig } from '@firestitch/calendar';
import { ItemType } from '@firestitch/filter';

import { of } from 'rxjs';

import { EventSourceFuncArg } from '@fullcalendar/core';
import { addHours } from 'date-fns';


@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleComponent implements OnInit {

  public config: CalendarConfig;

  public ngOnInit(): void {
    this.config = {
      eventsFetch: (data: EventSourceFuncArg) => {
        const events = [
          {
            start: new Date(),
            end: addHours(new Date(), 5),
            data: {
              name: 'Billy Bob',
            },
          },
        ];

        return of(events);
      },
      fullcalendarConfig: {
        selectable: true,
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
