import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AgeTypeComponent } from './age-type/age-type.component';
import { DepressionGdpComponent } from './depression-gdp/depression-gdp.component';
import { SuicideSexScatterComponent } from './suicide-sex-scatter/suicide-sex-scatter.component';
import { DepressionSexAgeComponent } from './depression-sex-age/depression-sex-age.component';
import { GlobalMapComponent } from './global-map/global-map.component';

@NgModule({
  declarations: [
    AppComponent,
    AgeTypeComponent,
    DepressionGdpComponent,
    SuicideSexScatterComponent,
    DepressionSexAgeComponent,
    GlobalMapComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
