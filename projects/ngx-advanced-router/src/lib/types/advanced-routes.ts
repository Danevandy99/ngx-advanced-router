import { AdvancedRoute } from "./advanced-route";

export type AdvancedRoutes<AdvancedRouteType extends { [Key in keyof AdvancedRouteType]: AdvancedRoute<any> } = { [key: string]: AdvancedRoute<any> }> = {
  [P in keyof AdvancedRouteType]: AdvancedRouteType[P];
}
