import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-error-state',
  templateUrl: './error-state.html',
  standalone: false,
})
export class ErrorState {
  @Input() message = '';
  @Output() retry = new EventEmitter<void>();
}
