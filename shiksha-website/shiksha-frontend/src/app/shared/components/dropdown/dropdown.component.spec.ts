import { FormControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownComponent } from './dropdown.component';

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), DropdownComponent]
    });
    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    component.config = { isBackground: false, height: 'auto', placeHolderTxt: 'Test' };
    component.dropDownCtrl = new FormControl();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
