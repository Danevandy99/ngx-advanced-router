import { ProductDetailComponent } from './../components/product-detail/product-detail.component';
import { ProductsComponent } from './../components/products/products.component';
import { AppAdvancedRouteService } from './../../../services/app-advanced-route.service';
import { AdvancedRouteService } from 'ngx-advanced-router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LazyLoadedRouteService extends AdvancedRouteService {
  protected override parentPath =
    this.appAdvancedRouteService.routes.lazyLoaded.path;

  public routesConfig = {
    products: {
      path: 'products',
      component: ProductsComponent,
    },
    productsDetail: {
      path: (productId: string) => `product-detail/${productId}`,
      component: ProductDetailComponent,
    },
    nestedLazyLoaded: {
      path: 'nested-lazy-loaded',
      loadChildren: () =>
        import('../modules/nested-lazy-loaded/nested-lazy-loaded.module').then(
          (x) => x.NestedLazyLoadedModule
        ),
    },
  };

  constructor(private appAdvancedRouteService: AppAdvancedRouteService) {
    super();
  }
}
