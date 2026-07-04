import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoadingState } from './components/loading-state/loading-state';
import { ErrorState } from './components/error-state/error-state';
import { ConfirmModal } from './components/confirm-modal/confirm-modal';
import { Sidebar } from './components/sidebar/sidebar';
import { NotificacionesDropdown } from './components/notificaciones-dropdown/notificaciones-dropdown';
import { ComunicadosFeed } from './components/comunicados-feed/comunicados-feed';
import { EntityCrudPage } from './components/entity-crud-page/entity-crud-page';

@NgModule({
  declarations: [LoadingState, ErrorState, ConfirmModal, Sidebar, NotificacionesDropdown, ComunicadosFeed, EntityCrudPage],
  imports: [CommonModule, RouterModule, FormsModule],
  exports: [LoadingState, ErrorState, ConfirmModal, Sidebar, NotificacionesDropdown, ComunicadosFeed, EntityCrudPage],
})
export class SharedModule { }
