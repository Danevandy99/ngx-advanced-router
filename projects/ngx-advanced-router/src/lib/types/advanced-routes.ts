import { AdvancedRoute } from './advanced-route';

export type AdvancedRoutes<
  AdvancedRouteType extends {
    [_ in keyof AdvancedRouteType]: AdvancedRoute<any>;
  } = { [key: string]: AdvancedRoute<any> }
> = {
  [P in keyof AdvancedRouteType]: AdvancedRouteType[P];
};
