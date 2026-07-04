import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

export interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  standalone: false,
})
export class Sidebar {
  @Input() navItems: NavItem[] = [];
  @Input() open = false;
  @Output() close = new EventEmitter<void>();

  constructor(
    public auth: AuthService,
    public router: Router
  ) {}

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  onLogout(): void {
    this.auth.logout();
  }
}
