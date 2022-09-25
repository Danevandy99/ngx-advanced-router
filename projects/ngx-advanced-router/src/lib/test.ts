import { Route } from "@angular/router";

export type PathType = string | ((...routeParams: string[]) => string)

export type AdvancedRoutes<T extends { [K in keyof T]: AdvancedRoute<U> } = any, U extends AdvancedRouteChildType<T> = any> = {
  [P in keyof T]: AdvancedRoute<U>;
}

export type AdvancedRouteChildType<T> = T extends AdvancedRoute<infer R> ? R : never;

export interface AdvancedRoute<ChildRoutesType extends AdvancedRoutes = any> extends Omit<Route, "path" | "children"> {
  path: PathType,
  children?: AdvancedRoutes<ChildRoutesType>,
}

export abstract class BaseAdvancedRouteService<BaseAdvancedRoutes extends AdvancedRoutes = {}> {
  protected readonly abstract routes: BaseAdvancedRoutes;

  public getAllRoutePaths<T extends typeof this.routes>(): AdvancedRoutePaths<T> {
    return this.getRoutePaths(this.routes);
  }

  private getRoutePaths<T extends AdvancedRoutes<U> = any, U extends AdvancedRouteChildType<T> = any>(routes: T): AdvancedRoutePaths<T> {
    return Object.fromEntries(
      Object.entries(routes).map(([key, value]) => {
        const path = value.path;
        if (typeof(path) === 'string') {
          return [key, new AdvancedRoutePath(path, this.getRoutePaths(value.children))];
        } else {
          // type function

          const functionToReturn = (...args: Parameters<typeof path>) => {
            const stringPathFromFunction = (path as Function)(args);
            return new AdvancedRoutePath(stringPathFromFunction, value.children);
          }

          return [key, functionToReturn];
        }
      })
    )
  }
}

export class ExampleRouteService extends BaseAdvancedRouteService {
  protected readonly routes = {
    admin: {
      path: 'admin',
      children: {
        create: {
          path: 'create'
        },
        edit: {
          path: (id: string) => `edit/${id}`,
          children: {
            users: {
              path: 'users'
            }
          }
        }
      }
    }
  }

  constructor() {
    super();

    this.routes.admin.children.edit.path("22")
  }
}
