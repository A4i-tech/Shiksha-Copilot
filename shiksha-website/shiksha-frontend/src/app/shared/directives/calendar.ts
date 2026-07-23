import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';

// Patches angular-calendar's hardcoded role="grid"/"application" attrs that
// can't be changed via templates. Safe no-op on month view.
@Directive({
  selector: '[appCalendarAccessibility]',
  standalone: true,
})
export class CalendarAccessibilityDirective implements AfterViewInit, OnDestroy {
  private _observer: MutationObserver | null = null;

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this._patchSubtree(this.el.nativeElement);
    this._observer = new MutationObserver((mutations) => {
      for (const { addedNodes } of mutations) {
        addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            this._patchSubtree(node);
          }
        });
      }
    });
    this._observer.observe(this.el.nativeElement, {
      childList: true,
      subtree: true,
    });
  }

  ngOnDestroy(): void {
    this._observer?.disconnect();
    this._observer = null;
  }

  private _patchSubtree(root: HTMLElement): void {
    if (root.classList?.contains('cal-week-view') && root.getAttribute('role') === 'grid') {
      root.removeAttribute('role');
    }
    if (root.getAttribute('role') === 'application') {
      root.setAttribute('role', 'button');
    }
    // .cal-day-headers[role=row] holds role=columnheader children (needs a `row` ancestor —
    // satisfied), but its own parent has no grid/table/rowgroup role, so `row` itself is
    // orphaned (aria-required-parent). Give its direct parent role="grid": a self-contained
    // header-only grid (one row child), without touching the broader week-view body markup.
    this._patchDayHeaderParent(root);
    root.querySelectorAll('.cal-week-view[role="grid"]').forEach((g) => g.removeAttribute('role'));
    root.querySelectorAll('[role="application"]').forEach((e) => e.setAttribute('role', 'button'));
    root.querySelectorAll('.cal-day-headers[role="row"]').forEach((h) => this._patchDayHeaderParent(h));
  }

  private _patchDayHeaderParent(el: Element): void {
    if (el.classList?.contains('cal-day-headers') && el.getAttribute('role') === 'row') {
      const parent = el.parentElement;
      if (parent && !parent.getAttribute('role')) {
        parent.setAttribute('role', 'grid');
      }
    }
  }
}
