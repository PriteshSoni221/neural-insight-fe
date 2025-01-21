import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { TextSummaryService } from 'src/app/services/text-summary.service';

@Component({
  selector: 'app-insight-page',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './insight-page.component.html',
  styleUrl: './insight-page.component.scss'
})
export class InsightPageComponent {
  public review: FormControl<string | null> = new FormControl('');
  public summary: string = ""

  constructor(private textSummaryService: TextSummaryService) { }

  public onSummarize(): void {
    console.log("review", this.review.value);

    if (this.review.value) {
      this.textSummaryService.getSummary(this.review.value).subscribe({
        next: (response) => {
          this.summary = response.summary;
        },
        error: (error) => {
          console.error("error fetching summary", error);
          this.summary = "An error occurred while fetching the summary."
        }
      })
    } else {
      alert("Please enter a review first.")
    }
    // if (this.review.value) {
    //   this.textSummaryService.getSummary(this.review.value).subscribe(response => {
    //     console.log("response", response)
    //   })
    // }
  }
}
