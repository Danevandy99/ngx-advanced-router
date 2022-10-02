import { AdvancedRoutes } from './advanced-routes';
import { Route } from '@angular/router';

export interface AdvancedRoute<
  ChildRoutesType extends AdvancedRoutes<any> = {
    [key: string]: AdvancedRoute<any>;
  }
> extends Omit<Route, 'path' | 'children'> {
  path: string | ((...routeParams: string[]) => string);
  children: AdvancedRoutes<ChildRoutesType>;
}
