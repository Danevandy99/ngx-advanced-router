// import { useMatch } from './matches';
import { Routes } from '@angular/router';
import { AnyRoute, RootRoute, Route } from './route';
import { ParseRoute, RouteIds, RoutesById } from './route-info';
import { RegisteredRouter, Router } from './router';

export type NoInfer<T> = [T][T extends any ? 0 : never];
export type IsAny<T, Y, N = T> = 1 extends 0 & T ? Y : N;
export type IsAnyBoolean<T> = 1 extends 0 & T ? true : false;
export type IsKnown<T, Y, N> = unknown extends T ? N : Y;
export type PickAsRequired<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;
export type PickAsPartial<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
export type PickUnsafe<T, K> = K extends keyof T ? Pick<T, K> : never;
export type PickExtra<T, K> = {
  [TKey in keyof K as string extends TKey
    ? never
    : TKey extends keyof T
    ? never
    : TKey]: K[TKey];
};

export type PickRequired<T> = {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};

export type Expand<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: O[K] }
    : never
  : T;

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => any
  ? I
  : never;

export type Assign<Left, Right> = Omit<Left, keyof Right> & Right;

export type AssignAll<T extends any[]> = T extends [infer Left, ...infer Right]
  ? Right extends any[]
    ? Assign<Left, AssignAll<Right>>
    : Left
  : {};

export type Values<O> = O[ValueKeys<O>];
export type ValueKeys<O> = Extract<keyof O, PropertyKey>;

export type DeepAwaited<T> = T extends Promise<infer A>
  ? DeepAwaited<A>
  : T extends Record<infer A, Promise<infer B>>
  ? { [K in A]: DeepAwaited<B> }
  : T;

export type PathParamMask<TRoutePath extends string> =
  TRoutePath extends `${infer L}/:${infer _C}/${infer R}`
    ? PathParamMask<`${L}/${string}/${R}`>
    : TRoutePath extends `${infer L}/:${infer _C}`
    ? PathParamMask<`${L}/${string}`>
    : TRoutePath;

export type OptionalIfNotPresent<T> = {
  [K in keyof T]-?: T extends Record<K, any>
    ? OptionalIfNotPresent<T[K]> // Recursive call for nested types
    : K extends keyof T
    ? T[K]
    : T[K] | undefined;
};

// eslint-disable-next-line no-undef
export type Timeout = ReturnType<typeof setTimeout>;

export type Updater<TPrevious, TResult = TPrevious> =
  | TResult
  | ((prev?: TPrevious) => TResult);

export type NonNullableUpdater<TPrevious, TResult = TPrevious> =
  | TResult
  | ((prev: TPrevious) => TResult);

export type PickExtract<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

export type PickExclude<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

// from https://github.com/type-challenges/type-challenges/issues/737
type LastInUnion<U> = UnionToIntersection<
  U extends unknown ? (x: U) => 0 : never
> extends (x: infer L) => 0
  ? L
  : never;
export type UnionToTuple<U, Last = LastInUnion<U>> = [U] extends [never]
  ? []
  : [...UnionToTuple<Exclude<U, Last>>, Last];

//

export const isServer = typeof document === 'undefined';

export function last<T>(arr: T[]) {
  return arr[arr.length - 1];
}

function isFunction(d: any): d is Function {
  return typeof d === 'function';
}

export function functionalUpdate<TResult>(
  updater: Updater<TResult> | NonNullableUpdater<TResult>,
  previous: TResult
): TResult {
  if (isFunction(updater)) {
    return updater(previous as TResult);
  }

  return updater;
}

export function pick<T, K extends keyof T>(parent: T, keys: K[]): Pick<T, K> {
  return keys.reduce((obj: any, key: K) => {
    obj[key] = parent[key];
    return obj;
  }, {} as any);
}

/**
 * This function returns `a` if `b` is deeply equal.
 * If not, it will replace any deeply equal children of `b` with those of `a`.
 * This can be used for structural sharing between immutable JSON values for example.
 * Do not use this with signals
 */
export function replaceEqualDeep<T>(prev: any, _next: T): T {
  if (prev === _next) {
    return prev;
  }

  const next = _next as any;

  const array = Array.isArray(prev) && Array.isArray(next);

  if (array || (isPlainObject(prev) && isPlainObject(next))) {
    const prevSize = array ? prev.length : Object.keys(prev).length;
    const nextItems = array ? next : Object.keys(next);
    const nextSize = nextItems.length;
    const copy: any = array ? [] : {};

    let equalItems = 0;

    for (let i = 0; i < nextSize; i++) {
      const key = array ? i : nextItems[i];
      copy[key] = replaceEqualDeep(prev[key], next[key]);
      if (copy[key] === prev[key]) {
        equalItems++;
      }
    }

    return prevSize === nextSize && equalItems === prevSize ? prev : copy;
  }

  return next;
}

// Copied from: https://github.com/jonschlinkert/is-plain-object
export function isPlainObject(o: any) {
  if (!hasObjectPrototype(o)) {
    return false;
  }

  // If has modified constructor
  const ctor = o.constructor;
  if (typeof ctor === 'undefined') {
    return true;
  }

  // If has modified prototype
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }

  // If constructor does not have an Object-specific method
  // eslint-disable-next-line no-prototype-builtins
  if (!prot.hasOwnProperty('isPrototypeOf')) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

function hasObjectPrototype(o: any) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

export function deepEqual(a: any, b: any, partial: boolean = false): boolean {
  if (a === b) {
    return true;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (isPlainObject(a) && isPlainObject(b)) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    if (!partial && aKeys.length !== bKeys.length) {
      return false;
    }

    return !bKeys.some(
      (key) => !(key in a) || !deepEqual(a[key], b[key], partial)
    );
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    return !a.some((item, index) => !deepEqual(item, b[index], partial));
  }

  return false;
}

export function shallow<T>(objA: T, objB: T) {
  if (Object.is(objA, objB)) {
    return true;
  }

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  if (keysA.length !== Object.keys(objB).length) {
    return false;
  }

  for (let i = 0; i < keysA.length; i++) {
    if (
      !Object.prototype.hasOwnProperty.call(objB, keysA[i] as string) ||
      !Object.is(objA[keysA[i] as keyof T], objB[keysA[i] as keyof T])
    ) {
      return false;
    }
  }
  return true;
}

export type StrictOrFrom<TFrom> =
  | {
      from: TFrom;
      strict?: true;
    }
  | {
      from?: never;
      strict: false;
    };

export type RouteFromIdOrRoute<
  T,
  TRouteTree extends AnyRoute = RegisteredRouter['routeTree']
> = T extends ParseRoute<TRouteTree>
  ? T
  : T extends RouteIds<TRouteTree>
  ? RoutesById<TRouteTree>[T]
  : T extends string
  ? RouteIds<TRouteTree>
  : never;

export type PickAndFlatten<T, K extends keyof T> = UnionToIntersection<T[K]>;

export type RemoveIntersection<T> = T extends infer U & infer V ? U | V : T;

// export function useRouteContext<
//   TRouteTree extends AnyRoute = RegisteredRouter['routeTree'],
//   TFrom extends RouteIds<TRouteTree> = RouteIds<TRouteTree>,
//   TStrict extends boolean = true,
//   TRouteContext = RouteById<TRouteTree, TFrom>['types']['allContext'],
//   TSelected = TRouteContext
// >(
//   opts: StrictOrFrom<TFrom> & {
//     select?: (search: TRouteContext) => TSelected;
//   }
// ): TStrict extends true ? TSelected : TSelected | undefined {
//   return useMatch({
//     ...(opts as any),
//     select: (match: RouteMatch) =>
//       opts?.select
//         ? opts.select(match.context as TRouteContext)
//         : match.context,
//   });
// }

export function escapeJSON(jsonString: string) {
  return jsonString
    .replace(/\\/g, '\\\\') // Escape backslashes
    .replace(/'/g, "\\'") // Escape single quotes
    .replace(/"/g, '\\"'); // Escape double quotes
}

export function convertToAdvancedRoutes(routes: Routes): Router {
  const rootRoute = new RootRoute();

  const routeTree = rootRoute.addChildren(
    convertChildrenToAdvancedRoutes(routes, rootRoute)
  );

  return new Router({ routeTree });
}

function convertChildrenToAdvancedRoutes(
  routes: Routes,
  parentRoute: AnyRoute
): AnyRoute[] {
  return routes.map((angularRoute) => {
    const route = new Route({
      path: angularRoute.path!,
      getParentRoute: () => parentRoute,
    });

    if (angularRoute.children) {
      return route.addChildren(
        convertChildrenToAdvancedRoutes(angularRoute.children, route)
      );
    }

    return route;
  });
}
