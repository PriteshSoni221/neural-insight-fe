import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AppProfitExpensesComponent, profitExpanceChart } from 'src/app/components/profit-expenses/profit-expenses.component';
import { MaterialModule } from 'src/app/material.module';
import { TextSummaryService } from 'src/app/services/text-summary.service';

@Component({
  selector: 'app-insight-page',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule, AppProfitExpensesComponent],
  templateUrl: './insight-page.component.html',
  styleUrl: './insight-page.component.scss'
})
export class InsightPageComponent {
  public review: FormControl<string | null> = new FormControl('');
  public summary: string = ""
  public aspectSentimentChart!: Partial<profitExpanceChart> | any

  constructor(private textSummaryService: TextSummaryService) { }

  public onSummarize(): void {
    console.log("review", this.review.value);

    if (this.review.value) {
      this.textSummaryService.getSummary(this.review.value).subscribe({
        next: (response) => {
          this.summary = response.summary;
          this.aspectSentimentChart = {
            series: [
              {
                name: 'Eanings this month',
                data: [9, 5, 3, 7, 5, 10, 3],
                color: '#0085db',
              },
              {
                name: 'Expense this month',
                data: [6, 3, 9, 5, 4, 6, 4],
                color: '#fb977d',
              },
            ],

            grid: {
              borderColor: 'rgba(0,0,0,0.1)',
              strokeDashArray: 3,
            },
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: '30%',
                borderRadius: 4,
                endingShape: "rounded",
              },
            },
            chart: {
              type: 'bar',
              height: 390,
              offsetY: 10,
              foreColor: '#adb0bb',
              fontFamily: 'inherit',
              toolbar: { show: false },
            },
            dataLabels: { enabled: false },
            markers: { size: 0 },
            legend: { show: false },
            xaxis: {
              type: 'category',
              categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              axisTicks: {
                show: false,
              },
              axisBorder: {
                show: false,
              },
              labels: {
                style: { cssClass: 'grey--text lighten-2--text fill-color' },
              },
            },
            stroke: {
              show: true,
              width: 5,
              colors: ['transparent'],
            },
            tooltip: { theme: 'light' },

            responsive: [
              {
                breakpoint: 600,
                options: {
                  plotOptions: {
                    bar: {
                      borderRadius: 3,
                    },
                  },
                },
              },
            ],
          }
        },
        error: (error) => {
          console.error("error fetching summary", error);
          this.summary = "An error occurred while fetching the summary."
        }
      })
    } else {
      alert("Please enter a review first.")
    }
  }
}
