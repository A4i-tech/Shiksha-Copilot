import { Directive, ElementRef, OnChanges, Input } from '@angular/core';
import { UtilityService } from '../services/utility.service';

@Directive({
  standalone:true,
  selector: '[hasPermission]',
})
export class HasPermissionDirective implements OnChanges {
  @Input('hasPermission') permission!: string[];

  constructor(private el: ElementRef, private utilityService: UtilityService) {}

  ngOnChanges() {
    const result = this.utilityService.hasPermission(this.permission);
    this.el.nativeElement.style.setProperty('display', result ? '' : 'none', 'important');
  }
}
