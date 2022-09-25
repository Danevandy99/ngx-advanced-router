import { Injectable } from '@angular/core';
import { AdvancedRouteService } from 'projects/ngx-advanced-router/src/lib/ngx-advanced-route.service';

@Injectable({
  providedIn: 'root'
})
export class AppAdvancedRouteService extends AdvancedRouteService {
  public readonly routes = {
    admin: {
      path: 'admin',
      children: {
        create: {
          path: 'create'
        },
        edit: {
          path: (adminId: string) => `edit/${adminId}`,
          children: {
            users: {
              path: 'users'
            }
          }
        }
      }
    }
  }
}
