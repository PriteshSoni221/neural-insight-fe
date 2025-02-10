import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="branding">
      <a [routerLink]="['/']">
        <!-- src="./assets/images/logos/dark-logo.svg" -->
        <!-- class="align-middle m-2" -->
        <img
        src="./assets/images/logos/logo.jpeg"
          alt="logo"
          width="250"
          />
          <!-- height="250" -->
      </a>
    </div>
  `,
})
export class BrandingComponent {
  constructor() {}
}
