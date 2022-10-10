import { AppAdvancedRouteService } from './services/app-advanced-route.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AdvancedRouterModule } from 'ngx-advanced-router';
import { AdminComponent } from './components/admin/admin.component';
import { AdminCreateComponent } from './components/admin/components/admin-create/admin-create.component';
import { AdminEditComponent } from './components/admin/components/admin-edit/admin-edit.component';
import { AdminEditUsersComponent } from './components/admin/components/admin-edit/components/admin-edit-users/admin-edit-users.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    AdminCreateComponent,
    AdminEditComponent,
    AdminEditUsersComponent,
  ],
  imports: [
    BrowserModule,
    AdvancedRouterModule.forRoot(AppAdvancedRouteService),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
