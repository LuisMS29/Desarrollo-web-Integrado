import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

const ONBOARDING_ROUTES: Record<string, string> = {
  ESTUDIANTE: '/estudiante/completar-perfil',
  DOCENTE: '/docente/completar-perfil',
};

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.check(route, state);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.check(route, state);
  }

  private check(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.auth.user();
    if (!user) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    const allowedRoles = route.data['allowedRoles'] as string[] | undefined;
    if (allowedRoles && !allowedRoles.includes(user.rol)) {
      this.router.navigate(['/']);
      return false;
    }

    const ignorePerfil = route.data['ignorePerfil'] as boolean | undefined;
    if (!ignorePerfil && user.perfilCompleto === false && ONBOARDING_ROUTES[user.rol]) {
      if (state.url !== ONBOARDING_ROUTES[user.rol]) {
        this.router.navigate([ONBOARDING_ROUTES[user.rol]]);
        return false;
      }
    }

    return true;
  }
}
