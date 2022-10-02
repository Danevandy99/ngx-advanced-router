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
    this.appAdvancedRouteService.routes.lazyLoaded.absolutePath;

  public routesConfig = {
    products: {
      path: 'products',
      component: ProductsComponent,
    },
    productsDetail: {
      path: (productId: string) => `product-detail/${productId}`,
      component: ProductDetailComponent,
    },
  };

  constructor(private appAdvancedRouteService: AppAdvancedRouteService) {
    super();
  }
}
