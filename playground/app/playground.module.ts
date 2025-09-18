import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { FsCalendarModule } from '@firestitch/calendar';
import { FsExampleModule } from '@firestitch/example';
import { ButtonStyle, FsFilterModule } from '@firestitch/filter';
import { FsMessageModule } from '@firestitch/message';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import {
  ExampleComponent,
  ExamplesComponent,
} from './components';
import { AppMaterialModule } from './material.module';


const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FsCalendarModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    FsFilterModule.forRoot({
      case: 'camel',
      queryParam: true,
      chips: true,
      buttonStyle: ButtonStyle.Flat,
    }),
    RouterModule.forRoot(routes, {}),
    FsExampleModule.forRoot(),
    FsMessageModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    ExampleComponent,
  ],
  providers: [
    { 
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline',
      },
    },
  ],
})
export class PlaygroundModule {
}
