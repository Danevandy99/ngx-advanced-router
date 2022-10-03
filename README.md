# ngx-advanced-router

[![Npm package version](https://badgen.net/npm/v/ngx-advanced-router)](https://npmjs.com/package/ngx-advanced-router)
[![Npm package license](https://badgen.net/npm/license/ngx-advanced-router)](https://npmjs.com/package/ngx-advanced-router)
[![Npm downloads total](https://badgen.net/npm/dt/ngx-advanced-router)](https://npmjs.com/package/ngx-advanced-router)

[![GitHub latest commit](https://badgen.net/github/last-commit/Danevandy99/ngx-advanced-router/main)](https://GitHub.com/Naereen/StrapDown.js/main/)

## Example

[Example code available here](https://github.com/Danevandy99/ngx-advanced-router/tree/main/src)

## Usage

1. Install the package:
```
npm install --save ngx-advanced-router
```

2. Create a service that extends `AdvancedRouteService`. This is where you'll supply your routes.
<br>
While the default Angular router only allows paths to be supplied as strings, `ngx-advanced-router` allows paths to be supplied as either strings **OR** or functions.

```ts
// ...
import { AdvancedRouteService } from 'ngx-advanced-router';

@Injectable({
  providedIn: 'root',
})
export class YourAdvancedRouteService extends AdvancedRouteService {
  public readonly routesConfig = {
    somePath: {
      path: 'some-path',
      component: SomeComponent,
    },
    someLazyLoadedRoute: {
      path: 'some-lazy-loaded-path',
      loadChildren: () =>
        import('../modules/some-lazy-loaded/some-lazy-loaded.module').then(
          (m) => m.SomeLazyLoadedModule
        ),
    },
    someDetailPath: {
      path: (id: string) => `some-path/${id}`,
      component: SomeDetailComponent,
    }
    // ...
    fallBack: {
      path: '**',
      redirectTo: 'some-path',
    },
  };
}
```

3. Import both `RouterModule` and `AdvancedRouteModule` into your `AppModule` (or `AppRoutingModule`).
<br>
<br>
A few of things to note:
<br>
    - The `AdvancedRouteModule` will handle the registering of your routes with the `RouterModule`, so we can pass in an empty array to the `forRoot()` function.
    - While we won't use the `RouterModule.forRoot()` function to register our routes, we still need to use the `forRoot()` function when importing to the RouterModule for the first time.
    - Use the `withRouteService()` function (with the service you created in step #2) when importing the `AdvancedRouterModule` 

```ts
// ...
import { AdvancedRouterModule } from 'ngx-advanced-router';
import { RouterModule } from '@angular/router';
import { YourAdvancedRouteService } from './services/your-advanced-route.service';

@NgModule({
  // ...
  imports: [
    RouterModule.forRoot([]),
    AdvancedRouterModule.withRouteService(YourAdvancedRouteService),
  ],
})
export class AppModule {} // or AppRoutingModule
```

4. Import the route service into any places where you need to access route paths.

```ts
// ...
import { YourAdvancedRouteService } from './services/your-advanced-route.service';
import { LazyLoadedRouteService } from './modules/lazy-loaded/services/lazy-loaded-route.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  constructor(
    // ...
    private yourAdvancedRouteService: YourAdvancedRouteService,
    private router: Router,
  ) {}

  navigateToSomePath(): void {
    const somePath = this.yourAdvancedRouteService.routes.somePath.path;
    this.router.navigate([somePath]);
  }
}
```

## License

MIT
