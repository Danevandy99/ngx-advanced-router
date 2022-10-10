import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttributesComponent } from './components/attributes/attributes.component';
import { NestedLazyLoadedRouteService } from './services/nested-lazy-loaded-route.service';
import { AdvancedRouterModule } from 'ngx-advanced-router';

@NgModule({
  declarations: [AttributesComponent],
  imports: [
    CommonModule,
    AdvancedRouterModule.forChild(NestedLazyLoadedRouteService),
  ],
})
export class NestedLazyLoadedModule {}
