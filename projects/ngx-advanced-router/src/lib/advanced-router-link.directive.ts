import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[advancedRouterLink]',
})
export class AdvancedRouterLinkDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input({ required: true, alias: 'advancedRouterLink' }) to!: string;

  @Input() from?: string;

}
