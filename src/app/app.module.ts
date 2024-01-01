import { AppAdvancedRouteService } from './services/app-advanced-route.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {
  AdvancedRouterModule,
  RootRoute,
  Route,
  Router,
} from 'ngx-advanced-router';
import { AdminComponent } from './components/admin/admin.component';
import { AdminCreateComponent } from './components/admin/components/admin-create/admin-create.component';
import { AdminEditComponent } from './components/admin/components/admin-edit/admin-edit.component';
import { AdminEditUsersComponent } from './components/admin/components/admin-edit/components/admin-edit-users/admin-edit-users.component';
import { RouterModule, Routes } from '@angular/router';
import { LinkComponent, LinkComponent2 } from './library/types/link';

const rootRoute = new RootRoute();

const adminRoute = new Route({
  path: 'admin',
  getParentRoute: () => rootRoute,
});

const adminCreateRoute = new Route({
  path: 'create',
  getParentRoute: () => adminRoute,
});

const adminEditRoute = new Route({
  path: 'edit/:adminId',
  getParentRoute: () => adminRoute,
});

const adminEditUsersRoute = new Route({
  path: 'users',
  getParentRoute: () => adminEditRoute,
});

const routeTree = rootRoute.addChildren([
  adminRoute,
  adminCreateRoute,
  adminEditRoute,
  adminEditUsersRoute,
]);

const router = new Router({ routeTree });

const ROUTES: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: 'create',
        component: AdminCreateComponent,
      },
      {
        path: 'edit/:adminId',
        component: AdminEditComponent,
        children: [
          {
            path: 'users',
            component: AdminEditUsersComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'lazy-loaded',
    loadChildren: () =>
      import('./modules/lazy-loaded/lazy-loaded.module').then(
        (m) => m.LazyLoadedModule
      ),
  },
  {
    path: '**',
    redirectTo: 'admin',
  },
];

export interface Register {
  router: typeof router;
}

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
    RouterModule.forRoot(ROUTES),
    LinkComponent,
    LinkComponent2,
    AdvancedRouterModule.forRoot(AppAdvancedRouteService),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
