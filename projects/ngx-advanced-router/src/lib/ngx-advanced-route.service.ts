import { Directive } from "@angular/core";
import { Routes } from "@angular/router";
import { AdvancedRoute } from "./types/advanced-route";
import { AdvancedRouteChildType } from "./types/advanced-route-child-type";
import { AdvancedRoutePath } from "./types/advanced-route-path";
import { AdvancedRoutePaths } from "./types/advanced-route-paths";
import { AdvancedRoutes } from "./types/advanced-routes";

@Directive()
export abstract class AdvancedRouteService {

  public readonly abstract routes: AdvancedRoutes<any>;

  public get routePaths(): AdvancedRoutePaths<AdvancedRoutes<this["routes"]>> {
    return this.getRoutePaths("", this.routes);
  }

  public get routesForRouter(): Routes {
    return this.transformToRoutesForRouter(this.routes);
  }

  private transformToRoutesForRouter<T extends AdvancedRoutes = { [key: string]: AdvancedRoute<any> }>(routes: T): Routes {
    if (!routes) {
      return [];
    } else {
      return Object.entries(routes).map(([key, value]) => {
        if (typeof(value.path) === 'string') {
          const path: string = value.path;

          return {
            ...value,
            path: path,
            children: this.transformToRoutesForRouter(value.children)
          };
        } else {
          const argumentsForFunction = this.getArgumentNamesForFunction(value.path);
          const argumentsWithColonPrefix = argumentsForFunction.map(x => `:${x}`);

          const path: string = (value.path as Function)(argumentsWithColonPrefix);

          return {
            ...value,
            path: path,
            children: this.transformToRoutesForRouter(value.children)
          };
        }
      });
    }
  }

  private getRoutePaths<T extends AdvancedRoutes = { [key: string]: AdvancedRoute<any> }>(basePath: string, routes: T): AdvancedRoutePaths<T> {
    if (!routes) {
      return <AdvancedRoutePaths<T>>{};
    } else {
      return Object.fromEntries(
        Object.entries(routes).map(([key, value]) => {
          const path = value.path;
          const children = value.children as AdvancedRoutes<AdvancedRouteChildType<T>>;
          if (typeof(path) === 'string') {
            const combinedPath = this.buildPath(basePath, path);
            return [key, new AdvancedRoutePath(combinedPath, this.getRoutePaths(combinedPath, children))];
          } else {
            // type function
            const functionToReturn = (...args: Parameters<typeof path>) => {
              const stringPathFromFunction = (path as Function)(args);
              const combinedPath = this.buildPath(basePath, stringPathFromFunction);
              return new AdvancedRoutePath(combinedPath, this.getRoutePaths(combinedPath, children));
            }

            return [key, functionToReturn];
          }
        })
      );
    }
  }

  // Taken from https://stackoverflow.com/a/31194949
  private getArgumentNamesForFunction(fn: (...args: any) => any): string[] {
    return (fn + '')
      .replace(/[/][/].*$/mg,'') // strip single-line comments
      .replace(/\s+/g, '') // strip white space
      .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments
      .split(/\)[\{=]/, 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters
      .replace(/=[^,]+/g, '') // strip any ES6 defaults
      .split(',').filter(Boolean); // split & filter [""]
  }

  protected buildPath(...parts: string[]): string {
    return parts.join('/');
  }
}
