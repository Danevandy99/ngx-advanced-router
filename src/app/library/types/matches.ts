import { ToOptions } from './link';
import { AnyRoute } from './route';
import {
  FullSearchSchema,
  ParseRoute,
  RouteById,
  RouteIds,
  RoutePaths,
} from './route-info';
import { RegisteredRouter, RouterState } from './router';

export interface RouteMatch<
  TRouteTree extends AnyRoute = AnyRoute,
  TRouteId extends RouteIds<TRouteTree> = ParseRoute<TRouteTree>['id']
> {
  id: string;
  routeId: TRouteId;
  pathname: string;
  params: RouteById<TRouteTree, TRouteId>['types']['allParams'];
  status: 'pending' | 'success' | 'error';
  isFetching: boolean;
  showPending: boolean;
  error: unknown;
  paramsError: unknown;
  searchError: unknown;
  updatedAt: number;
  loadPromise?: Promise<void>;
  loaderData?: RouteById<TRouteTree, TRouteId>['types']['loaderData'];
  routeContext: RouteById<TRouteTree, TRouteId>['types']['routeContext'];
  context: RouteById<TRouteTree, TRouteId>['types']['allContext'];
  search: FullSearchSchema<TRouteTree> &
    RouteById<TRouteTree, TRouteId>['types']['fullSearchSchema'];
  fetchCount: number;
  abortController: AbortController;
  cause: 'preload' | 'enter' | 'stay';
  loaderDeps: RouteById<TRouteTree, TRouteId>['types']['loaderDeps'];
  preload: boolean;
  invalid: boolean;
}

export type AnyRouteMatch = RouteMatch<any, any>;

export interface MatchRouteOptions {
  pending?: boolean;
  caseSensitive?: boolean;
  includeSearch?: boolean;
  fuzzy?: boolean;
}

export type UseMatchRouteOptions<
  TRouteTree extends AnyRoute = RegisteredRouter['routeTree'],
  TFrom extends RoutePaths<TRouteTree> = '/',
  TTo extends string = '',
  TMaskFrom extends RoutePaths<TRouteTree> = '/',
  TMaskTo extends string = ''
> = ToOptions<AnyRoute, TFrom, TTo, TMaskFrom, TMaskTo> & MatchRouteOptions;

export function getRenderedMatches(state: RouterState) {
  return state.pendingMatches?.some((d) => d.showPending)
    ? state.pendingMatches
    : state.matches;
}
