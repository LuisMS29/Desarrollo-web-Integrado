import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

export interface NavItem {
  label: string;
  route: string;
  icon: string;
  end?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  standalone: false,
})
export class Sidebar {
  @Input() sections: NavSection[] = [];
  @Input() open = false;
  @Input() brandSub = '';
  @Output() close = new EventEmitter<void>();

  constructor(
    public auth: AuthService,
    public router: Router
  ) {}

  isActive(route: string, end?: boolean): boolean {
    if (end) return this.router.url === route;
    return this.router.url.startsWith(route);
  }

  onLogout(): void {
    this.auth.logout();
  }
}
