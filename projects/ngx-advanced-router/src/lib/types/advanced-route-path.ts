import { Router } from "@angular/router";
import { AdvancedRoute } from "./advanced-route";
import { AdvancedRouteChildType } from "./advanced-route-child-type";
import { AdvancedRoutePaths } from "./advanced-route-paths";

export class AdvancedRoutePath<T extends AdvancedRoute<any> = any> {
  constructor(
    public path: string,
    public children: AdvancedRoutePaths<AdvancedRouteChildType<T>>
  ) { }

  public navigate(): Promise<boolean> {
    return Promise.resolve(true);
    // return this.router.navigate(
    //   [this.path]
    // );
  }
}
