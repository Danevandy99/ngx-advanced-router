import { AdvancedRoute } from './advanced-route';
import { AdvancedRoutePath } from './advanced-route-path';
import { AdvancedRoutes } from './advanced-routes';

export type AdvancedRoutePaths<
  T extends AdvancedRoutes = { [key: string]: AdvancedRoute<any> }
> = {
  [K in keyof T]: T[K]['path'] extends (...args: any) => any
    ? (...args: Parameters<T[K]['path']>) => AdvancedRoutePath<T[K]>
    : AdvancedRoutePath<T[K]>;
};
