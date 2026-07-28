import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { HttpConfigInterceptor } from './core/interceptors/http-config.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { HttpLoaderFactory } from './shared/utility/common.util';
import { LanguageSwitcherComponent } from './shared/components/language-switcher/language-switcher.component';
import { ToastrModule } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { NgIdleModule } from '@ng-idle/core';
import { DeleteDetailComponent } from './shared/components/delete-detail/delete-detail.component';
import { ReactiveFormsModule } from '@angular/forms';


// Material
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

// Components
import { BaselineSurveyComponent } from './shared/components/baseline-survey/baseline-survey.component';
import { EndlineSurveyComponent } from './shared/components/endline-survey/endline-survey.component';
import { DropdownComponent } from './shared/components/dropdown/dropdown.component';

// Services
import { BaselineSurveyDialogService } from './core/services/baseline-survey-dialog.service';

@NgModule({
  declarations: [AppComponent, BaselineSurveyComponent, EndlineSurveyComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    HttpClientModule,
    ReactiveFormsModule,
// Material
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    LanguageSwitcherComponent,
    DropdownComponent,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
    }),
    NgIdleModule.forRoot(),
    DeleteDetailComponent
  ],
  providers: [
    { 
      provide:HTTP_INTERCEPTORS,
      useClass:HttpConfigInterceptor,
      multi:true
    },
    DatePipe,
    BaselineSurveyDialogService

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {
  /**
   * Class constructor
   * @param translateService 
   */
  constructor(private translateService: TranslateService) {
    const data: string = localStorage.getItem('userData') ?? '';
    const preferredLanguage = data ? JSON.parse(data)?.preferredLanguage : undefined;
    if (preferredLanguage) {
      this.translateService.use(preferredLanguage);
    } else {
      this.translateService.use(this.mapBrowserLanguage(navigator.language));
    }
  }

  /**
   * Maps a browser locale (e.g. 'en-US', 'kn-IN', 'te-IN') to a supported app
   * language code. Note the app uses 'tg' for Telugu, not the ISO 'te'.
   */
  private mapBrowserLanguage(browserLang: string): string {
    const prefix = browserLang?.split('-')[0];
    const supported: Record<string, string> = { en: 'en', kn: 'kn', te: 'tg' };
    return supported[prefix] ?? 'en';
  }
}
