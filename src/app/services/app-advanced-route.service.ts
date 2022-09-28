import { AdminEditUsersComponent } from './../components/admin/components/admin-edit/components/admin-edit-users/admin-edit-users.component';
import { AdminEditComponent } from './../components/admin/components/admin-edit/admin-edit.component';
import { AdminComponent } from './../components/admin/admin.component';
import { Injectable } from '@angular/core';
import { AdvancedRouteService } from 'ngx-advanced-router';
import { AdminCreateComponent } from '../components/admin/components/admin-create/admin-create.component';

@Injectable({
  providedIn: 'root'
})
export class AppAdvancedRouteService extends AdvancedRouteService {

  public readonly routesConfig = {
    admin: {
      path: 'admin',
      component: AdminComponent,
      children: {
        create: {
          path: 'create',
          component: AdminCreateComponent,
        },
        edit: {
          path: (adminId: string) => `edit/${adminId}`,
          component: AdminEditComponent,
          children: {
            users: {
              path: 'users',
              component: AdminEditUsersComponent,
            }
          }
        }
      }
    },
    lazyLoaded: {
      path: 'lazy-loaded',
      loadChildren: () => import('../modules/lazy-loaded/lazy-loaded.module').then(m => m.LazyLoadedModule)
    },
    fallBack: {
      path: '**',
      redirectTo: 'admin',
    }
  }
}
