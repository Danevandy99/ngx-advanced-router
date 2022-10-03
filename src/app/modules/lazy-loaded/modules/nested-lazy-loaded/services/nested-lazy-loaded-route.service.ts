import { AttributesComponent } from './../components/attributes/attributes.component';
import { LazyLoadedRouteService } from './../../../services/lazy-loaded-route.service';
import { AdvancedRouteService } from 'ngx-advanced-router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NestedLazyLoadedRouteService extends AdvancedRouteService {
  protected override parentPath =
    this.lazyLoadedRouteService.routes.nestedLazyLoaded.path;

  public readonly routesConfig = {
    attributes: {
      path: 'attributes',
      component: AttributesComponent,
    },
  };

  constructor(private lazyLoadedRouteService: LazyLoadedRouteService) {
    super();
  }
}
