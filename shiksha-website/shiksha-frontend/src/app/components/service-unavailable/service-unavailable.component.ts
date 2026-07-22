import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-unavailable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-unavailable.component.html',
  styleUrls: ['./service-unavailable.component.scss']
})
export class ServiceUnavailableComponent {
  constructor(private router: Router) {}

  retry(): void {
    this.router.navigateByUrl('/');
  }
}
