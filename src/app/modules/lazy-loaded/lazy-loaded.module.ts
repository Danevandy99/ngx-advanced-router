import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { AdvancedRouterModule } from 'ngx-advanced-router';
import { LazyLoadedRouteService } from './services/lazy-loaded-route.service';

@NgModule({
  declarations: [ProductsComponent, ProductDetailComponent],
  imports: [
    CommonModule,
    AdvancedRouterModule.forChild(LazyLoadedRouteService),
  ],
})
export class LazyLoadedModule {}
