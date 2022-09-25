import { AdvancedRoutePaths } from "./advanced-route-paths";
import { AdvancedRoutes } from "./advanced-routes";

export type AdvancedRoutePathChildren<T> = { [P in keyof T]: T extends AdvancedRoutes<infer R> ? AdvancedRoutePaths<R> : AdvancedRoutePaths<any> }
