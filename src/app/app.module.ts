import { AppAdvancedRouteService } from './services/app-advanced-route.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AdvancedRouterModule, AdvancedRouteService } from 'ngx-advanced-router';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]),
    AdvancedRouterModule
  ],
  providers: [
    { provide: AdvancedRouteService, useClass: AppAdvancedRouteService },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
