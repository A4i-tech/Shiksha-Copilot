import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { DropDownConfig } from '../../interfaces/dropdown.interface';
import { DEFAULT_LANGUAGE, LOC_LANGUAGES } from '../../utility/constant.util';
import { DeleteDetailComponent } from '../delete-detail/delete-detail.component';
@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownComponent,DeleteDetailComponent],
})
export class LanguageSwitcherComponent implements OnInit, AfterViewInit {
  @Output() languageChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() loggedInUser: any;

  @ViewChild('languageSwitcher') languageSwitcher: any;

  languageDropdownOptions!: any[];

  showLanguageSwitcher=false;

  selectedLanguage:any;

  languageSwitchConfig = {
    heading:this.translateService.instant('Switch Language'),
    confirmText:''
  }

  languageDropDownConfig: DropDownConfig = {
    isBackground: false,
    placeHolderTxt: 'Select Preferred Language',
    bindLabel: 'name',
    bindValue: 'value',
    clearableOff:true,
    labelTxt: 'Select Preferred Language'
  };

  /**
   * Class constructor
   * @param translateService 
   */
  constructor(private translateService:TranslateService) {
     
  }

  ngOnInit(): void {
    const localLanguage = this.loggedInUser
      ? LOC_LANGUAGES.find((e) => e.state === this.loggedInUser?.state)?.value ?? []
      : LOC_LANGUAGES.flatMap((e) => e.value);
    this.languageDropdownOptions = [...DEFAULT_LANGUAGE, ...localLanguage];
  }

  /**
   * ngafterviewinit hook used here to set the preferred language
   */
  ngAfterViewInit(): void {
     this.languageSwitcher.selectedItem = this.loggedInUser?.preferredLanguage;
  } 

  /**
   * Function trigged on language change
   * @param lang 
   */
  changeLanguage(lang: any) {
    if(lang){
      this.selectedLanguage=lang
      this.languageSwitchConfig.confirmText=`${this.translateService.instant('Are you sure you want to switch the application language')}`
      this.showLanguageSwitcher=true;
    }
  }

  confirmSwitch(val:any){
    if(val === 'ok'){
      this.languageChange.emit(this.selectedLanguage);
    }else{
      this.languageSwitcher.selectedItem = this.loggedInUser?.preferedLanguage;
    }
    this.showLanguageSwitcher=false;
  }
}
