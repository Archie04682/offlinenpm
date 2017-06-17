import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { MdToolbarModule,
         MdCardModule,
         MdButtonModule,
         MdInputModule,
         MdSelectModule,
         MdProgressSpinnerModule,
         MdProgressBarModule,
         MdListModule } from '@angular/material';

import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';

import { DataService } from './shared/data.service';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot([
      {
        path: '',
        component: SearchComponent
      }
    ]),
    MdToolbarModule,
    MdCardModule,
    MdButtonModule,
    MdInputModule,
    MdSelectModule,
    MdProgressSpinnerModule,
    MdListModule,
    MdProgressBarModule
  ],
  providers: [
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
