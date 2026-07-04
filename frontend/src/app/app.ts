import { Component } from '@angular/core';
import { ToastService } from './core/services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  constructor(public toastService: ToastService) {}
}
