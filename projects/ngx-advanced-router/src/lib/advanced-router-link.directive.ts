import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[advancedRouterLink]',
})
export class AdvancedRouterLinkDirective {

  @Input({ required: true }) link!: string;
}
