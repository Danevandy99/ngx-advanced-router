import { AdvancedRoute } from "./advanced-route";

export type AdvancedRouteChildType<T> = T extends AdvancedRoute<infer R> ? R : never;
