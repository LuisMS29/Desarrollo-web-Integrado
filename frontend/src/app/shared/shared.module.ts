import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoadingState } from './components/loading-state/loading-state';
import { ErrorState } from './components/error-state/error-state';
import { ConfirmModal } from './components/confirm-modal/confirm-modal';
import { Sidebar } from './components/sidebar/sidebar';
import { NotificacionesDropdown } from './components/notificaciones-dropdown/notificaciones-dropdown';
import { NotificacionesPanel } from './components/notificaciones-dropdown/notificaciones-panel';
import { BuzonDropdown } from './components/buzon-dropdown/buzon-dropdown';
import { ComunicadosFeed } from './components/comunicados-feed/comunicados-feed';
import { EntityCrudPage } from './components/entity-crud-page/entity-crud-page';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

@NgModule({
  declarations: [LoadingState, ErrorState, ConfirmModal, Sidebar, NotificacionesDropdown, NotificacionesPanel, BuzonDropdown, ComunicadosFeed, EntityCrudPage, SafeHtmlPipe],
  imports: [CommonModule, RouterModule, FormsModule],
  exports: [LoadingState, ErrorState, ConfirmModal, Sidebar, NotificacionesDropdown, NotificacionesPanel, BuzonDropdown, ComunicadosFeed, EntityCrudPage, SafeHtmlPipe],
})
export class SharedModule { }
