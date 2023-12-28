import {
  ROUTES,
  RouterModule,
  provideRouter,
  RouterFeatures,
} from '@angular/router';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ModuleWithProviders,
  NgModule,
  Type,
} from '@angular/core';
import { AdvancedRouteService } from './advanced-route.service';
import { AdvancedRouterLinkDirective } from './advanced-router-link.directive';

@NgModule({
  imports: [RouterModule],
  exports: [RouterModule],
  providers: [
    {
      provide: ROUTES,
      useFactory: (advancedRouteService: AdvancedRouteService) => {
        return advancedRouteService.routesForRouter;
      },
      deps: [AdvancedRouteService],
      multi: true,
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AdvancedRouterLinkDirective
  ],
})
export class AdvancedRouterModule {
  public static forRoot<T extends AdvancedRouteService>(
    routeService: Type<T>,
    ...routerFeatures: RouterFeatures[]
  ): ModuleWithProviders<AdvancedRouterModule> {
    return {
      ngModule: AdvancedRouterModule,
      providers: [
        { provide: AdvancedRouteService, useClass: routeService },
        provideRouter([], ...routerFeatures),
      ],
    };
  }

  public static forChild<T extends AdvancedRouteService>(
    routeService: Type<T>
  ): ModuleWithProviders<AdvancedRouterModule> {
    return {
      ngModule: AdvancedRouterModule,
      providers: [{ provide: AdvancedRouteService, useClass: routeService }],
    };
  }
}
