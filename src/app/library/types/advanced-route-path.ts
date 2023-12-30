import { AdvancedRoute } from './advanced-route';
import { AdvancedRouteChildType } from './advanced-route-child-type';
import { AdvancedRoutePaths } from './advanced-route-paths';

export class AdvancedRoutePath<T extends AdvancedRoute<any> = any> {
  constructor(
    public segment: string,
    public path: string,
    public children: AdvancedRoutePaths<AdvancedRouteChildType<T>>
  ) {}
}
