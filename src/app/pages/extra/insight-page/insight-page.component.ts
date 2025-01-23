import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AppProfitExpensesComponent, profitExpanceChart } from 'src/app/components/profit-expenses/profit-expenses.component';
import { AppTrafficDistributionComponent, trafficdistributionChart } from 'src/app/components/traffic-distribution/traffic-distribution.component';
import { MaterialModule } from 'src/app/material.module';
import { TextSummaryService } from 'src/app/services/text-summary.service';

@Component({
  selector: 'app-insight-page',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule, AppProfitExpensesComponent, AppTrafficDistributionComponent],
  templateUrl: './insight-page.component.html',
  styleUrl: './insight-page.component.scss'
})
export class InsightPageComponent {
  public review: FormControl<string | null> = new FormControl('');
  public summary: string = ""
  public aspectSentimentChart!: Partial<profitExpanceChart> | any
  public trafficdistributionChart!: Partial<trafficdistributionChart> | any;

  constructor(private textSummaryService: TextSummaryService) { }

  public onSummarize(): void {
    console.log("review", this.review.value);

    if (this.review.value) {
      this.textSummaryService.getSummary(this.review.value).subscribe({
        next: (response) => {
          this.summary = response.summary;
          this.loadChart()
          this.loadDistributionChart()
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

  private loadChart(): void {
    this.aspectSentimentChart = {
      series: [
        {
          name: 'Number of positive ratings',
          data: [1, 1, 0, 0, 1],
          color: '#0085db',
        },
        {
          name: 'Number of negative ratings',
          data: [0, 1, 1, 1, 1],
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
      legend: { show: true },
      xaxis: {
        type: 'category',
        categories: ['Price', 'Quality', 'Delivery', 'Packaging', 'Service'],
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
  }

  private loadDistributionChart(): void {
    this.trafficdistributionChart = {
      series: [12, 8, 15],
      labels: ['neutral', 'negative', 'positive'],
      chart: {
        type: 'donut',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
        height: 160,
      },
      colors: ['#f8c076', '#fb977d', '#0085db'],
      plotOptions: {
        pie: {
          donut: {
            size: '80%',
            background: 'none',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '12px',
                color: undefined,
                offsetY: 5,
              },
              value: {
                show: true,
                color: '#98aab4',
              },
            },
          },
        },
      },
      stroke: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: true,
      },
      responsive: [
        {
          breakpoint: 491,
          options: {
            chart: {
              width: 120,
            },
          },
        },
      ],
      tooltip: {
        enabled: false,
      },
    };
  }
}
