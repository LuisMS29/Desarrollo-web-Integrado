import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  templateUrl: './loading-state.html',
  standalone: false,
})
export class LoadingState {
  @Input() label = 'Cargando...';
}
