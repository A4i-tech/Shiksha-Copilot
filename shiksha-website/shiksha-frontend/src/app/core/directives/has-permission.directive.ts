import { Directive, ElementRef, OnChanges, OnDestroy, OnInit, Input } from '@angular/core';
import { UtilityService } from '../services/utility.service';

@Directive({
  standalone:true,
  selector: '[hasPermission]',
})
export class HasPermissionDirective implements OnInit, OnChanges, OnDestroy {
  @Input('hasPermission') permission!: string[];
  private permissionsChanged = () => this.apply();

  constructor(private el: ElementRef, private utilityService: UtilityService) {}

  ngOnInit() {
    window.addEventListener('permissionsChanged', this.permissionsChanged);
    this.apply();
  }

  ngOnChanges() {
    this.apply();
  }

  ngOnDestroy() {
    window.removeEventListener('permissionsChanged', this.permissionsChanged);
  }

  apply() {
    const result = this.utilityService.hasPermission(this.permission);
    this.el.nativeElement.style.setProperty('display', result ? '' : 'none', 'important');
  }
}
