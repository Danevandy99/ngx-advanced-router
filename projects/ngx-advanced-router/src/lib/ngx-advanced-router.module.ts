import { RouterModule, ROUTES } from '@angular/router';
import { NgModule, Type, ModuleWithProviders } from '@angular/core';
import { AdvancedRouteService } from './ngx-advanced-route.service';

@NgModule({
  imports: [
    RouterModule
  ],
  exports: [],
  providers: [
    {
      provide: ROUTES,
      useFactory: (advancedRouteService: AdvancedRouteService) => {
        return advancedRouteService.routesForRouter;
      },
      deps: [AdvancedRouteService],
      multi: true,
    }
  ]
})
export class AdvancedRouterModule {
  static withRouteService<T extends AdvancedRouteService>(routeService: Type<T>): ModuleWithProviders<AdvancedRouterModule> {
    return {
      ngModule: AdvancedRouterModule,
      providers: [
        { provide: AdvancedRouteService, useClass: routeService },
      ]
    }
  }
}
