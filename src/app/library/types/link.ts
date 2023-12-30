import { ActivatedRoute } from '@angular/router';
/* eslint-disable no-unused-vars */
import { Component, Directive, Input, signal } from '@angular/core';
import { Trim } from './file-route';
import { AnyRoute } from './route';
import {
  AllParams,
  FullSearchSchema,
  RouteByPath,
  RouteIds,
  RoutePaths,
} from './route-info';
import { RegisteredRouter } from './router';
import {
  Expand,
  NoInfer,
  PickRequired,
  UnionToIntersection,
  Updater,
} from './utils';
import { Router, RouterModule } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';

export type CleanPath<T extends string> = T extends `${infer L}//${infer R}`
  ? CleanPath<`${CleanPath<L>}/${CleanPath<R>}`>
  : T extends `${infer L}//`
  ? `${CleanPath<L>}/`
  : T extends `//${infer L}`
  ? `/${CleanPath<L>}`
  : T;

export type Split<S, TIncludeTrailingSlash = true> = S extends unknown
  ? string extends S
    ? string[]
    : S extends string
    ? CleanPath<S> extends ''
      ? []
      : TIncludeTrailingSlash extends true
      ? CleanPath<S> extends `${infer T}/`
        ? [...Split<T>, '/']
        : CleanPath<S> extends `/${infer U}`
        ? Split<U>
        : CleanPath<S> extends `${infer T}/${infer U}`
        ? [...Split<T>, ...Split<U>]
        : [S]
      : CleanPath<S> extends `${infer T}/${infer U}`
      ? [...Split<T>, ...Split<U>]
      : S extends string
      ? [S]
      : never
    : never
  : never;

export type ParsePathParams<T extends string> = keyof {
  [K in Trim<Split<T>[number], '_'> as K extends `:${infer L}` ? L : never]: K;
};

export type Join<T, Delimiter extends string = '/'> = T extends []
  ? ''
  : T extends [infer L extends string]
  ? L
  : T extends [infer L extends string, ...infer Tail extends [...string[]]]
  ? CleanPath<`${L}${Delimiter}${Join<Tail>}`>
  : never;

export type Last<T extends any[]> = T extends [...infer _, infer L] ? L : never;

export type RelativeToPathAutoComplete<
  AllPaths extends string,
  TFrom extends string,
  TTo extends string,
  SplitPaths extends string[] = Split<AllPaths, false>
> = TTo extends `..${infer _}`
  ? SplitPaths extends [
      ...Split<ResolveRelativePath<TFrom, TTo>, false>,
      ...infer TToRest
    ]
    ? `${CleanPath<
        Join<
          [
            ...Split<TTo, false>,
            ...(
              | TToRest
              | (Split<
                  ResolveRelativePath<TFrom, TTo>,
                  false
                >['length'] extends 1
                  ? never
                  : ['../'])
            )
          ]
        >
      >}`
    : never
  : TTo extends `./${infer RestTTo}`
  ? SplitPaths extends [
      ...Split<TFrom, false>,
      ...Split<RestTTo, false>,
      ...infer RestPath
    ]
    ? `${TTo}${Join<RestPath>}`
    : never
  :
      | (TFrom extends `/`
          ? never
          : SplitPaths extends [...Split<TFrom, false>, ...infer RestPath]
          ? Join<RestPath> extends { length: 0 }
            ? never
            : './'
          : never)
      | (TFrom extends `/` ? never : '../')
      | AllPaths;

export type NavigateOptions<
  TRouteTree extends AnyRoute = RegisteredRouter['routeTree'],
  TFrom extends RoutePaths<TRouteTree> = '/',
  TTo extends string = '',
  TMaskFrom extends RoutePaths<TRouteTree> = TFrom,
  TMaskTo extends string = ''
> = ToOptions<TRouteTree, TFrom, TTo, TMaskFrom, TMaskTo> & {
  // `replace` is a boolean that determines whether the navigation should replace the current history entry or push a new one.
  replace?: boolean;
  resetScroll?: boolean;
  // If set to `true`, the link's underlying navigate() call will be wrapped in a `React.startTransition` call. Defaults to `true`.
  startTransition?: boolean;
};

export type ToOptions<
  TRouteTree extends AnyRoute = RegisteredRouter['routeTree'],
  TFrom extends RoutePaths<TRouteTree> = '/',
  TTo extends string = '',
  TMaskFrom extends RoutePaths<TRouteTree> = '/',
  TMaskTo extends string = ''
> = ToSubOptions<TRouteTree, TFrom, TTo> & {
  mask?: ToMaskOptions<TRouteTree, TMaskFrom, TMaskTo>;
};

export type ToMaskOptions<
  TRouteTree extends AnyRoute = RegisteredRouter['routeTree'],
  TMaskFrom extends RoutePaths<TRouteTree> = '/',
  TMaskTo extends string = ''
> = ToSubOptions<TRouteTree, TMaskFrom, TMaskTo> & {
  unmaskOnReload?: boolean;
};

export type ToSubOptions<
  TRouteTree extends AnyRoute = RegisteredRouter['routeTree'],
  TFrom extends RoutePaths<TRouteTree> = '/',
  TTo extends string = '',
  TResolved = ResolveRelativePath<TFrom, NoInfer<TTo>>
> = {
  to?: ToPathOption<TRouteTree, TFrom, TTo>;
  // The new has string or a function to update it
  hash?: true | Updater<string>;
  // State to pass to the history stack
  //state?: true | NonNullableUpdater<HistoryState>;
  // The source route path. This is automatically set when using route-level APIs, but for type-safe relative routing on the router itself, this is required
  from?: TFrom;
  // // When using relative route paths, this option forces resolution from the current path, instead of the route API's path or `from` path
} & CheckPath<TRouteTree, NoInfer<TResolved>, {}> &
  SearchParamOptions<TRouteTree, TFrom, TTo, TResolved> &
  PathParamOptions<TRouteTree, TFrom, TResolved>;

export type SearchParamOptions<
  TRouteTree extends AnyRoute,
  TFrom,
  TTo,
  TResolved = ResolveRelativePath<TFrom, NoInfer<TTo>>,
  TFromSearchEnsured = '/' extends TFrom
    ? FullSearchSchema<TRouteTree>
    : Expand<
        PickRequired<
          RouteByPath<TRouteTree, TFrom>['types']['fullSearchSchema']
        >
      >,
  TFromSearchOptional = Omit<
    FullSearchSchema<TRouteTree>,
    keyof TFromSearchEnsured
  >,
  TFromSearch = Expand<TFromSearchEnsured & TFromSearchOptional>,
  TToSearch = '' extends TTo
    ? FullSearchSchema<TRouteTree>
    : Expand<RouteByPath<TRouteTree, TResolved>['types']['fullSearchSchema']>
> = keyof PickRequired<TToSearch> extends never
  ? {
      search?: true | SearchReducer<TFromSearch, TToSearch>;
    }
  : {
      search: TFromSearchEnsured extends PickRequired<TToSearch>
        ? true | SearchReducer<TFromSearch, TToSearch>
        : SearchReducer<TFromSearch, TToSearch>;
    };

type SearchReducer<TFrom, TTo> = TTo | ((current: TFrom) => TTo);

export type PathParamOptions<
  TRouteTree extends AnyRoute,
  TFrom,
  TTo,
  TFromParamsEnsured = Expand<
    UnionToIntersection<
      PickRequired<RouteByPath<TRouteTree, TFrom>['types']['allParams']>
    >
  >,
  TFromParamsOptional = Omit<AllParams<TRouteTree>, keyof TFromParamsEnsured>,
  TFromParams = Expand<TFromParamsOptional & TFromParamsEnsured>,
  TToParams = Expand<RouteByPath<TRouteTree, TTo>['types']['allParams']>
> = never extends TToParams
  ? {
      params?: true | ParamsReducer<Partial<TFromParams>, Partial<TFromParams>>;
    }
  : keyof PickRequired<TToParams> extends never
  ? {
      params?: true | ParamsReducer<TFromParams, TToParams>;
    }
  : {
      params: TFromParamsEnsured extends PickRequired<TToParams>
        ? true | ParamsReducer<TFromParams, TToParams>
        : ParamsReducer<TFromParams, TToParams>;
    };

// export type PathParamOptions<
//   TRouteTree extends AnyRoute,
//   TFrom,
//   TTo,
//   TFromParamsEnsured = Expand<
//     UnionToIntersection<
//       PickRequired<RouteByPath<TRouteTree, TFrom>['types']['allParams']>
//     >
//   >,
//   TFromParamsOptional = Omit<AllParams<TRouteTree>, keyof TFromParamsEnsured>,
//   TFromParams = Expand<TFromParamsOptional & TFromParamsEnsured>,
//   TToParams = Expand<RouteByPath<TRouteTree, TTo>['types']['allParams']>
// > = {
//   params: never extends TToParams
//     ?
//         | true
//         | ParamsReducer<Partial<TFromParams>, Partial<TFromParams>>
//         | undefined
//     : keyof PickRequired<TToParams> extends never
//     ? true | ParamsReducer<TFromParams, TToParams> | undefined
//     : TFromParamsEnsured extends PickRequired<TToParams>
//     ? true | ParamsReducer<TFromParams, TToParams>
//     : ParamsReducer<TFromParams, TToParams>;
// };

type ParamsReducer<TFrom, TTo> = TTo | ((current: TFrom) => TTo);

export type ToPathOption<
  TRouteTree extends AnyRoute = AnyRoute,
  TFrom extends RoutePaths<TRouteTree> = '/',
  TTo extends string = ''
> =
  | TTo
  | RelativeToPathAutoComplete<
      RoutePaths<TRouteTree>,
      NoInfer<TFrom> extends string ? NoInfer<TFrom> : '',
      NoInfer<TTo> & string
    >;

export type ToIdOption<
  TRouteTree extends AnyRoute = AnyRoute,
  TFrom extends RoutePaths<TRouteTree> = '/',
  TTo extends string = ''
> =
  | TTo
  | RelativeToPathAutoComplete<
      RouteIds<TRouteTree>,
      NoInfer<TFrom> extends string ? NoInfer<TFrom> : '',
      NoInfer<TTo> & string
    >;

export interface ActiveOptions {
  exact?: boolean;
  includeHash?: boolean;
  includeSearch?: boolean;
}

export type LinkOptions<
  TRouteTree extends AnyRoute = RegisteredRouter['routeTree'],
  TFrom extends RoutePaths<TRouteTree> = '/',
  TTo extends string = '',
  TMaskFrom extends RoutePaths<TRouteTree> = TFrom,
  TMaskTo extends string = ''
> = NavigateOptions<TRouteTree, TFrom, TTo, TMaskFrom, TMaskTo> & {
  // The standard anchor tag target attribute
  target?: HTMLAnchorElement['target'];
  // Defaults to `{ exact: false, includeHash: false }`
  activeOptions?: ActiveOptions;
  // If set, will preload the linked route on hover and cache it for this many milliseconds in hopes that the user will eventually navigate there.
  preload?: false | 'intent';
  // Delay intent preloading by this many milliseconds. If the intent exits before this delay, the preload will be cancelled.
  preloadDelay?: number;
  // If true, will render the link without the href attribute
  disabled?: boolean;
};

export type CheckRelativePath<
  TRouteTree extends AnyRoute,
  TFrom,
  TTo
> = TTo extends string
  ? TFrom extends string
    ? ResolveRelativePath<TFrom, TTo> extends RoutePaths<TRouteTree>
      ? {}
      : {
          Error: `${TFrom} + ${TTo} resolves to ${ResolveRelativePath<
            TFrom,
            TTo
          >}, which is not a valid route path.`;
          'Valid Route Paths': RoutePaths<TRouteTree>;
        }
    : {}
  : {};

export type CheckPath<TRouteTree extends AnyRoute, TPath, TPass> = Exclude<
  TPath,
  RoutePaths<TRouteTree>
> extends never
  ? TPass
  : CheckPathError<TRouteTree, Exclude<TPath, RoutePaths<TRouteTree>>>;

export type CheckPathError<TRouteTree extends AnyRoute, TInvalids> = {
  to: RoutePaths<TRouteTree>;
};

export type CheckId<TRouteTree extends AnyRoute, TPath, TPass> = Exclude<
  TPath,
  RouteIds<TRouteTree>
> extends never
  ? TPass
  : CheckIdError<TRouteTree, Exclude<TPath, RouteIds<TRouteTree>>>;

export type CheckIdError<TRouteTree extends AnyRoute, TInvalids> = {
  Error: `${TInvalids extends string
    ? TInvalids
    : never} is not a valid route ID.`;
  'Valid Route IDs': RouteIds<TRouteTree>;
};

export type ResolveRelativePath<TFrom, TTo = '.'> = TFrom extends string
  ? TTo extends string
    ? TTo extends '.'
      ? TFrom
      : TTo extends `./`
      ? Join<[TFrom, '/']>
      : TTo extends `./${infer TRest}`
      ? ResolveRelativePath<TFrom, TRest>
      : TTo extends `/${infer TRest}`
      ? TTo
      : Split<TTo> extends ['..', ...infer ToRest]
      ? Split<TFrom> extends [...infer FromRest, infer FromTail]
        ? ToRest extends ['/']
          ? Join<[...FromRest, '/']>
          : ResolveRelativePath<Join<FromRest>, Join<ToRest>>
        : never
      : Split<TTo> extends ['.', ...infer ToRest]
      ? ToRest extends ['/']
        ? Join<[TFrom, '/']>
        : ResolveRelativePath<TFrom, Join<ToRest>>
      : CleanPath<Join<['/', ...Split<TFrom>, ...Split<TTo>]>>
    : never
  : never;

// type LinkCurrentTargetElement = {
//   preloadTimeout?: null | ReturnType<typeof setTimeout>;
// };

// const preloadWarning = 'Error preloading route! ☝️';

// export function useLinkProps<
//   TRouteTree extends AnyRoute = RegisteredRouter['routeTree'],
//   TFrom extends RoutePaths<TRouteTree> = '/',
//   TTo extends string = '',
//   TMaskFrom extends RoutePaths<TRouteTree> = '/',
//   TMaskTo extends string = ''
// >({
//   _from,
//   ...options
// }: UseLinkPropsOptions<
//   TRouteTree,
//   TFrom,
//   TTo,
//   TMaskFrom,
//   TMaskTo
// >): React.AnchorHTMLAttributes<HTMLAnchorElement> {
//   const router = useRouter();
//   const matchPathname = useMatch({
//     strict: false,
//     select: (s) => s.pathname,
//   });

//   const {
//     // custom props
//     children,
//     target,
//     activeProps = () => ({ className: 'active' }),
//     inactiveProps = () => ({}),
//     activeOptions,
//     disabled,
//     hash,
//     search,
//     params,
//     to,
//     state,
//     mask,
//     preload: userPreload,
//     preloadDelay: userPreloadDelay,
//     replace,
//     startTransition,
//     resetScroll,
//     // element props
//     style,
//     className,
//     onClick,
//     onFocus,
//     onMouseEnter,
//     onMouseLeave,
//     onTouchStart,
//     ...rest
//   } = options;

//   // If this link simply reloads the current route,
//   // make sure it has a new key so it will trigger a data refresh

//   // If this `to` is a valid external URL, return
//   // null for LinkUtils

//   const dest = {
//     from: options.to ? matchPathname : undefined,
//     ...options,
//   };

//   let type: 'internal' | 'external' = 'internal';

//   try {
//     new URL(`${to}`);
//     type = 'external';
//   } catch {}

//   if (type === 'external') {
//     return {
//       href: to,
//     };
//   }

//   const next = router.buildLocation(dest as any);
//   const preload = userPreload ?? router.options.defaultPreload;
//   const preloadDelay =
//     userPreloadDelay ?? router.options.defaultPreloadDelay ?? 0;

//   const isActive = useRouterState({
//     select: (s) => {
//       // Compare path/hash for matches
//       const currentPathSplit = s.location.pathname.split('/');
//       const nextPathSplit = next.pathname.split('/');
//       const pathIsFuzzyEqual = nextPathSplit.every(
//         (d, i) => d === currentPathSplit[i]
//       );
//       // Combine the matches based on user router.options
//       const pathTest = activeOptions?.exact
//         ? s.location.pathname === next.pathname
//         : pathIsFuzzyEqual;
//       const hashTest = activeOptions?.includeHash
//         ? s.location.hash === next.hash
//         : true;
//       const searchTest =
//         activeOptions?.includeSearch ?? true
//           ? deepEqual(s.location.search, next.search, !activeOptions?.exact)
//           : true;

//       // The final "active" test
//       return pathTest && hashTest && searchTest;
//     },
//   });

//   // The click handler
//   const handleClick = (e: MouseEvent) => {
//     if (
//       !disabled &&
//       !isCtrlEvent(e) &&
//       !e.defaultPrevented &&
//       (!target || target === '_self') &&
//       e.button === 0
//     ) {
//       e.preventDefault();

//       // All is well? Navigate!
//       router.commitLocation({ ...next, replace, resetScroll, startTransition });
//     }
//   };

//   // The click handler
//   const handleFocus = (e: MouseEvent) => {
//     if (preload) {
//       router.preloadRoute(dest as any).catch((err) => {
//         console.warn(err);
//         console.warn(preloadWarning);
//       });
//     }
//   };

//   const handleTouchStart = (_: TouchEvent) => {
//     if (preload) {
//       router.preloadRoute(dest as any).catch((err) => {
//         console.warn(err);
//         console.warn(preloadWarning);
//       });
//     }
//   };

//   const handleEnter = (e: MouseEvent) => {
//     const target = (e.target || {}) as LinkCurrentTargetElement;

//     if (preload) {
//       if (target.preloadTimeout) {
//         return;
//       }

//       target.preloadTimeout = setTimeout(() => {
//         target.preloadTimeout = null;
//         router.preloadRoute(dest as any).catch((err) => {
//           console.warn(err);
//           console.warn(preloadWarning);
//         });
//       }, preloadDelay);
//     }
//   };

//   const handleLeave = (e: MouseEvent) => {
//     const target = (e.target || {}) as LinkCurrentTargetElement;

//     if (target.preloadTimeout) {
//       clearTimeout(target.preloadTimeout);
//       target.preloadTimeout = null;
//     }
//   };

// const composeHandlers =
//   (handlers: (undefined | ((e: any) => void))[]) =>
//   (e: React.SyntheticEvent) => {
//     if (e.persist) e.persist();
//     handlers.filter(Boolean).forEach((handler) => {
//       if (e.defaultPrevented) return;
//       handler!(e);
//     });
//   };

// Get the active props
// const resolvedActiveProps: React.HTMLAttributes<HTMLAnchorElement> = isActive
//   ? functionalUpdate(activeProps as any, {}) ?? {}
//   : {};

// Get the inactive props
//   const resolvedInactiveProps: React.HTMLAttributes<HTMLAnchorElement> =
//     isActive ? {} : functionalUpdate(inactiveProps, {}) ?? {};

//   return {
//     ...resolvedActiveProps,
//     ...resolvedInactiveProps,
//     ...rest,
//     href: disabled
//       ? undefined
//       : next.maskedLocation
//       ? next.maskedLocation.href
//       : next.href,
//     onClick: composeHandlers([onClick, handleClick]),
//     onFocus: composeHandlers([onFocus, handleFocus]),
//     onMouseEnter: composeHandlers([onMouseEnter, handleEnter]),
//     onMouseLeave: composeHandlers([onMouseLeave, handleLeave]),
//     onTouchStart: composeHandlers([onTouchStart, handleTouchStart]),
//     target,
//     style: {
//       ...style,
//       ...resolvedActiveProps.style,
//       ...resolvedInactiveProps.style,
//     },
//     className:
//       [
//         className,
//         resolvedActiveProps.className,
//         resolvedInactiveProps.className,
//       ]
//         .filter(Boolean)
//         .join(' ') || undefined,
//     ...(disabled
//       ? {
//           role: 'link',
//           'aria-disabled': true,
//         }
//       : undefined),
//     ['data-status']: isActive ? 'active' : undefined,
//   };
// }

// export interface LinkComponent<TProps extends Record<string, any> = {}> {
//   <
//     TRouteTree extends AnyRoute = RegisteredRouter['routeTree'],
//     TFrom extends RoutePaths<TRouteTree> = '/',
//     TTo extends string = '',
//     TMaskFrom extends RoutePaths<TRouteTree> = '/',
//     TMaskTo extends string = ''
//   >(
//     props: LinkProps<TRouteTree, TFrom, TTo, TMaskFrom, TMaskTo> &
//       TProps &
//       React.RefAttributes<HTMLAnchorElement>
//   ): ReactNode;
// }

// export const Link: LinkComponent = React.forwardRef((props: any, ref) => {
//   const linkProps = useLinkProps(props)

//   return (
//     <a
//       {...{
//         ref: ref as any,
//         ...linkProps,
//         children:
//           typeof props.children === 'function'
//             ? props.children({
//                 isActive: (linkProps as any)['data-status'] === 'active',
//               })
//             : props.children,
//       }}
//     />
//   )
// }) as any

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'advanced-router-link',
  templateUrl: './link.component.html',
  standalone: true,
  imports: [RouterModule, NgIf, AsyncPipe],
})
export class LinkComponent<
  TRouteTree extends AnyRoute = RegisteredRouter['routeTree'],
  TFrom extends RoutePaths<TRouteTree> = '/',
  TTo extends string = '',
  TMaskFrom extends RoutePaths<TRouteTree> = '/',
  TMaskTo extends string = ''
> {
  protected options = signal<LinkOptions<
    TRouteTree,
    TFrom,
    TTo,
    TMaskFrom,
    TMaskTo
  > | null>(null);

  protected queryParams$ = toObservable(this.options).pipe(
    map((options) => {
      const queryParams = options?.search;
      if (queryParams === true) {
        return {};
      } else if (typeof queryParams === 'function') {
        // @ts-ignore
        return queryParams({});
      } else if (queryParams) {
        return queryParams;
      } else {
        return null;
      }
    }),
    switchMap((queryParams) => {
      if (queryParams) {
        return of(queryParams);
      } else {
        return this.activatedRoute.queryParams;
      }
    })
  );

  protected routerLink$ = toObservable(this.options).pipe(
    map((options) => {
      if (!options) {
        return null;
      }

      const params = options.params;
      let to = String(options.to);

      if (!params || typeof params !== 'object') {
        return to;
      }

      for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
          const value = String(params[key as keyof typeof params]);

          to = to.replace(`:${key}`, value ?? '');
        }
      }

      return to;
    }),
    filter(Boolean)
  );

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input({ required: true, alias: 'options' }) public set setOptions(
    value: LinkOptions<TRouteTree, TFrom, TTo, TMaskFrom, TMaskTo>
  ) {
    this.options.set(value);
  }

  constructor(
    private router: Router,
    protected activatedRoute: ActivatedRoute
  ) {}
}

function isCtrlEvent(e: MouseEvent) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
