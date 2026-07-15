import { NgModule, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { SharedModule } from './shared/shared.module';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { OnboardingModule } from './pages/onboarding/onboarding.module';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { DirectorLayout } from './layouts/director-layout/director-layout';
import { DocenteLayout } from './layouts/docente-layout/docente-layout';
import { EstudianteLayout } from './layouts/estudiante-layout/estudiante-layout';

@NgModule({
  declarations: [
    App,
    AdminLayout,
    DirectorLayout,
    DocenteLayout,
    EstudianteLayout,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    SharedModule,
    OnboardingModule,
    AppRoutingModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    { provide: LOCALE_ID, useValue: 'es' },
  ],
  bootstrap: [App],
})
export class AppModule { }
