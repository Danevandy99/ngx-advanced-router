import { Route } from "@angular/router";
import { AdvancedRoutes } from "./advanced-routes";

export interface AdvancedRoute<ChildRoutesType extends AdvancedRoutes<any> = { [key: string]: AdvancedRoute<any> }> extends Omit<Route, "path" | "children"> {
  path: string | ((...routeParams: string[]) => string),
  children: AdvancedRoutes<ChildRoutesType>,
}
