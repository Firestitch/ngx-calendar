import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { FsFilterModule, ButtonStyle } from '@firestitch/filter';
import { provideRouter, Routes } from '@angular/router';
import { ExamplesComponent } from './app/components';
import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';
import { AppComponent } from './app/app.component';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
];



if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(CommonModule, BrowserModule, FormsModule, FsFilterModule.forRoot({
            case: 'camel',
            queryParam: true,
            chips: true,
            buttonStyle: ButtonStyle.Flat,
        }), FsExampleModule.forRoot(), FsMessageModule.forRoot()),
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {
                appearance: 'outline',
            },
        },
        provideAnimations(),
        provideRouter(routes),
    ]
})
  .catch(err => console.error(err));

