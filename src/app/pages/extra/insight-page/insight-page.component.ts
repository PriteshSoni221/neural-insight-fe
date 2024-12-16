import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-insight-page',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './insight-page.component.html',
  styleUrl: './insight-page.component.scss'
})
export class InsightPageComponent {
  public DEMO_REVIEW: string = "ex. I was a bit unsettled at first after the negative reviews, but the Asus Vivobook 15 Pro OLED equipped with AMD Ryzen 9 7940 HS and Nvidia RTX 4060 as well as 32GB RAM has consistently pleasantly surprised me."
}
