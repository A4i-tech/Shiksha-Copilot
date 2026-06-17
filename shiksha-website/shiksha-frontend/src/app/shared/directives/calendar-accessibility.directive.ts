import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';

/**
 * Accessibility fix for angular-calendar's week/day views.
 *
 * The library hardcodes `role="grid"` on `.cal-week-view` and `role="application"`
 * on each event. A `grid` requires `row`/`gridcell` children, so `application`
 * children trigger axe's "aria-required-children" violation (WCAG 1.3.1).
 *
 * We cannot edit the library template, so we neutralise the roles in the DOM:
 *  - drop `role="grid"` (this view isn't a real data grid) — clears the violation
 *  - convert each clickable event's `role="application"` to `role="button"`
 *    (events are `tabindex="0"`, have a click handler and an `aria-label`).
 *
 * A MutationObserver handles late-arriving nodes (events loaded after init)
 * without running on every change-detection cycle.
 *
 * Reusable: drop `appCalendarAccessibility` on any `mwl-calendar-week-view` /
 * `mwl-calendar-day-view` (day view also renders `.cal-week-view`). It is a
 * no-op on views that don't emit these roles (e.g. month view), so it is safe
 * to apply to every calendar instance. Import the directive into the consuming
 * NgModule (or component `imports`).
 */
@Directive({
  selector: '[appCalendarAccessibility]',
  standalone: true,
})
export class CalendarAccessibilityDirective implements AfterViewInit, OnDestroy {
  private _observer: MutationObserver | null = null;

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this._patchRoles();
    this._observer = new MutationObserver(() => this._patchRoles());
    this._observer.observe(this.el.nativeElement, {
      childList: true,
      subtree: true,
    });
  }

  ngOnDestroy(): void {
    this._observer?.disconnect();
    this._observer = null;
  }

  private _patchRoles(): void {
    const host = this.el.nativeElement;

    host
      .querySelectorAll('.cal-week-view[role="grid"]')
      .forEach((grid) => grid.removeAttribute('role'));

    host
      .querySelectorAll('[role="application"]')
      .forEach((event) => event.setAttribute('role', 'button'));
  }
}
