import { NavigateOptions, ResolveRelativePath, ToOptions } from './link';
import { ParsedLocation } from './location';
import { AnyRoute } from './route';
import { RouteById, RoutePaths } from './route-info';
import { RegisteredRouter, Router, RouterOptions, RouterState } from './router';
import { NoInfer } from './utils';
import { MatchRouteOptions } from './matches';
import { RouteMatch } from './matches';

export interface CommitLocationOptions {
  replace?: boolean;
  resetScroll?: boolean;
  startTransition?: boolean;
}

export interface MatchLocation {
  to?: string | number | null;
  fuzzy?: boolean;
  caseSensitive?: boolean;
  from?: string;
}

export type NavigateFn<TRouteTree extends AnyRoute> = <
  TFrom extends RoutePaths<TRouteTree> = '/',
  TTo extends string = '',
  TMaskFrom extends RoutePaths<TRouteTree> = TFrom,
  TMaskTo extends string = ''
>(
  opts: NavigateOptions<TRouteTree, TFrom, TTo, TMaskFrom, TMaskTo>
) => Promise<void>;

export type MatchRouteFn<TRouteTree extends AnyRoute> = <
  TFrom extends RoutePaths<TRouteTree> = '/',
  TTo extends string = '',
  TResolved = ResolveRelativePath<TFrom, NoInfer<TTo>>
>(
  location: ToOptions<TRouteTree, TFrom, TTo>,
  opts?: MatchRouteOptions
) => false | RouteById<TRouteTree, TResolved>['types']['allParams'];

export type BuildLocationFn<TRouteTree extends AnyRoute> = (
  opts: ToOptions<TRouteTree>
) => ParsedLocation;

export type InjectedHtmlEntry = string | (() => Promise<string> | string);

// export let routerContext = React.createContext<Router<any>>(null!);

// if (typeof document !== 'undefined') {
//   if (window.__TSR_ROUTER_CONTEXT__) {
//     routerContext = window.__TSR_ROUTER_CONTEXT__
//   } else {
//     window.__TSR_ROUTER_CONTEXT__ = routerContext as any
//   }
// }

// export function RouterProvider<
//   TRouteTree extends AnyRoute = RegisteredRouter['routeTree'],
//   TDehydrated extends Record<string, any> = Record<string, any>,
// >({ router, ...rest }: RouterProps<TRouteTree, TDehydrated>) {
//   // Allow the router to update options on the router instance
//   router.update({
//     ...router.options,
//     ...rest,
//     context: {
//       ...router.options.context,
//       ...rest?.context,
//     },
//   } as any)

//   const matches = router.options.InnerWrap ? (
//     <router.options.InnerWrap>
//       <Matches />
//     </router.options.InnerWrap>
//   ) : (
//     <Matches />
//   )

//   const provider = (
//     <routerContext.Provider value={router}>
//       {matches}
//       <Transitioner />
//     </routerContext.Provider>
//   )

//   if (router.options.Wrap) {
//     return <router.options.Wrap>{provider}</router.options.Wrap>
//   }

//   return provider
// }

// function Transitioner() {
//   const mountLoadCount = React.useRef(0)
//   const router = useRouter()
//   const routerState = useRouterState({
//     select: (s) =>
//       pick(s, ['isLoading', 'location', 'resolvedLocation', 'isTransitioning']),
//   })

//   const [isTransitioning, startReactTransition] = React.useTransition()

//   router.startReactTransition = startReactTransition

//   React.useEffect(() => {
//     if (isTransitioning) {
//       router.__store.setState((s) => ({
//         ...s,
//         isTransitioning,
//       }))
//     }
//   }, [isTransitioning])

//   const tryLoad = () => {
//     const apply = (cb: () => void) => {
//       if (!routerState.isTransitioning) {
//         startReactTransition(() => cb())
//       } else {
//         cb()
//       }
//     }

//     apply(() => {
//       try {
//         router.load()
//       } catch (err) {
//         console.error(err)
//       }
//     })
//   }

//   useLayoutEffect(() => {
//     const unsub = router.history.subscribe(() => {
//       router.latestLocation = router.parseLocation(router.latestLocation)
//       if (routerState.location !== router.latestLocation) {
//         tryLoad()
//       }
//     })

//     const nextLocation = router.buildLocation({
//       search: true,
//       params: true,
//       hash: true,
//       state: true,
//     })

//     if (routerState.location.href !== nextLocation.href) {
//       router.commitLocation({ ...nextLocation, replace: true })
//     }

//     return () => {
//       unsub()
//     }
//   }, [router.history])

//   useLayoutEffect(() => {
//     if (
//       routerState.isTransitioning &&
//       !isTransitioning &&
//       !routerState.isLoading &&
//       routerState.resolvedLocation !== routerState.location
//     ) {
//       router.emit({
//         type: 'onResolved',
//         fromLocation: routerState.resolvedLocation,
//         toLocation: routerState.location,
//         pathChanged:
//           routerState.location!.href !== routerState.resolvedLocation?.href,
//       })

//       if ((document as any).querySelector) {
//         if (routerState.location.hash !== '') {
//           const el = document.getElementById(
//             routerState.location.hash,
//           ) as HTMLElement | null
//           if (el) {
//             el.scrollIntoView()
//           }
//         }
//       }

//       router.__store.setState((s) => ({
//         ...s,
//         isTransitioning: false,
//         resolvedLocation: s.location,
//       }))
//     }
//   }, [
//     routerState.isTransitioning,
//     isTransitioning,
//     routerState.isLoading,
//     routerState.resolvedLocation,
//     routerState.location,
//   ])

//   useLayoutEffect(() => {
//     if (!window.__TSR_DEHYDRATED__ && !mountLoadCount.current) {
//       mountLoadCount.current++
//       tryLoad()
//     }
//   }, [])

//   return null
// }

export function getRouteMatch<TRouteTree extends AnyRoute>(
  state: RouterState<TRouteTree>,
  id: string
): undefined | RouteMatch<TRouteTree> {
  return [
    ...state.cachedMatches,
    ...(state.pendingMatches ?? []),
    ...state.matches,
  ].find((d) => d.id === id);
}

// export function useRouterState<
//   TSelected = RouterState<RegisteredRouter['routeTree']>
// >(opts?: {
//   select: (state: RouterState<RegisteredRouter['routeTree']>) => TSelected;
// }): TSelected {
//   const router = useRouter();
//   return useStore(router.__store, opts?.select as any);
// }

export type RouterProps<
  TRouteTree extends AnyRoute = RegisteredRouter['routeTree'],
  TDehydrated extends Record<string, any> = Record<string, any>
> = Omit<RouterOptions<TRouteTree, TDehydrated>, 'context'> & {
  router: Router<TRouteTree>;
  context?: Partial<RouterOptions<TRouteTree, TDehydrated>['context']>;
};

// export function useRouter<
//   TRouteTree extends AnyRoute = RegisteredRouter['routeTree']
// >(): Router<TRouteTree> {
//   const resolvedContext =
//     typeof document !== 'undefined'
//       ? window.__TSR_ROUTER_CONTEXT__ || routerContext
//       : routerContext;
//   const value = React.useContext(resolvedContext);
//   warning(value, 'useRouter must be used inside a <RouterProvider> component!');
//   return value as any;
// }
