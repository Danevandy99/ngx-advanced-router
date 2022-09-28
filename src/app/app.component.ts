import { AppAdvancedRouteService } from './services/app-advanced-route.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadedRouteService } from './modules/lazy-loaded/services/lazy-loaded-route.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngx-advanced-router-demo';

  constructor(
    protected appAdvancedRouter: AppAdvancedRouteService,
    protected lazyLoadedRoute: LazyLoadedRouteService,
    private router: Router
  ) {
    console.log(lazyLoadedRoute.routesForRouter);
    console.log(router.config);
  }
}
