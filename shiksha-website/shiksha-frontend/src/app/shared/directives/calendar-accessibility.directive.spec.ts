import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CalendarAccessibilityDirective } from './calendar';

@Component({
  template: `
    <div appCalendarAccessibility>
      <div class="cal-week-view" role="grid">
        <div role="application" tabindex="0" aria-label="Event 1"></div>
        <div role="application" tabindex="0" aria-label="Event 2"></div>
      </div>
    </div>
  `,
  imports: [CalendarAccessibilityDirective],
  standalone: true,
})
class TestHostComponent {}

describe('CalendarAccessibilityDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    host = fixture.nativeElement;
  });

  it('removes role="grid" from .cal-week-view', () => {
    const weekView = host.querySelector('.cal-week-view');
    expect(weekView?.getAttribute('role')).toBeNull();
  });

  it('converts role="application" to role="button" on events', () => {
    const events = host.querySelectorAll('[role]');
    events.forEach((el) => {
      expect(el.getAttribute('role')).toBe('button');
    });
  });

  it('does not repeatedly mutate DOM — roles stay patched after second detectChanges', () => {
    const weekView = host.querySelector('.cal-week-view');
    const setSpy = spyOn(weekView as Element, 'removeAttribute').and.callThrough();

    fixture.detectChanges();

    // removeAttribute should not be called again because role="grid" is already gone
    expect(setSpy).not.toHaveBeenCalled();
  });

  it('patches late-arriving event nodes via MutationObserver', fakeAsync(() => {
    const container = host.querySelector('.cal-week-view') as HTMLElement;
    const newEvent = document.createElement('div');
    newEvent.setAttribute('role', 'application');
    newEvent.setAttribute('tabindex', '0');
    container.appendChild(newEvent);

    tick(); // allow MutationObserver microtask to fire

    expect(newEvent.getAttribute('role')).toBe('button');
  }));
});
