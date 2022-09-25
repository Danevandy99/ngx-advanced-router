import { AppAdvancedRouteService } from './services/app-advanced-route.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngx-advanced-router-demo';

  constructor(
    private advancedRouter: AppAdvancedRouteService,
    private router: Router
  ) {
    console.log(advancedRouter.routePaths.admin.children?.edit("22"));
    console.log(advancedRouter.routesForRouter);
    console.log(router.config);
  }
}
