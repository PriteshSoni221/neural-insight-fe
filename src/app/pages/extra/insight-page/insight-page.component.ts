import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AppProfitExpensesComponent, profitExpanceChart } from 'src/app/components/profit-expenses/profit-expenses.component';
import { AppTrafficDistributionComponent, trafficdistributionChart } from 'src/app/components/traffic-distribution/traffic-distribution.component';
import { MaterialModule } from 'src/app/material.module';
import { TextSummaryService } from 'src/app/services/text-summary.service';
import { APIScoreByAspect, Review, ReviewOutput } from '../review-upload-page/review-upload-page.component';

@Component({
  selector: 'app-insight-page',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule, AppProfitExpensesComponent, AppTrafficDistributionComponent],
  templateUrl: './insight-page.component.html',
  styleUrl: './insight-page.component.scss'
})
export class InsightPageComponent {
  public review: FormControl<string | null> = new FormControl("The item arrived before I expected, but unfortunately the manual wasn't included in the box.");
  public reviewOutput: ReviewOutput | null = null
  public aspectSentimentChart!: Partial<profitExpanceChart> | any
  public trafficdistributionChart!: Partial<trafficdistributionChart> | any;
  public isLoading: boolean = false

  public sentimentScore: APIScoreByAspect = {
    positive: [],
    negative: [],
    neutral: []
  }

  constructor(private textSummaryService: TextSummaryService) { }

  public onSummarize(): void {
    console.log("review", this.review.value);

    if (this.review.value) {
      this.isLoading = true;
      
      this.textSummaryService.getSummary(this.review.value).subscribe({
        next: (response) => {
          this.reviewOutput = response.output;
          this.calculateSentimentCounts(response)
          this.isLoading = false;
        },
        error: (error) => {
          console.error("error fetching summary", error);
          this.reviewOutput = null
          this.isLoading = false;
          alert("Error fetching summary. Please try again.")
        }
      })
    } else {
      alert("Please enter a review first.")
    }
  }

  public calculateSentimentCounts(response: Review): void {
    const categories = ['price', 'quality', 'delivery', 'packaging', 'service'];

    const sentimentCounts: any = {
      positive: Array(categories.length).fill(0),
      negative: Array(categories.length).fill(0),
      neutral: Array(categories.length).fill(0)
    };

      categories.forEach((category, index) => {
        const reviewItem: any = response
        const sentiment: string = reviewItem['output'][`${category}`]?.sentiment;
        if (sentiment) {
          sentimentCounts[sentiment][index]++;
        }
      });

    this.sentimentScore = {
      positive: sentimentCounts.positive,
      negative: sentimentCounts.negative,
      neutral: sentimentCounts.neutral
    };

    this.loadChart()
    this.loadDistributionChart()
  }

  private loadChart(): void {
    this.aspectSentimentChart = {
      series: [
        {
          name: 'Number of positive ratings',
          data: this.sentimentScore.positive,
          color: '#0085db',
        },
        {
          name: 'Number of negative ratings',
          data: this.sentimentScore.negative,
          color: '#fb977d',
        },
        {
          name: 'Number of neutral ratings',
          data: this.sentimentScore.neutral,
          color: '#f8c076',
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
        height: 290,
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
      series: [this.sentimentScore.positive.reduce((accumulator, currentValue) => accumulator + currentValue, 0),
      this.sentimentScore.negative.reduce((accumulator, currentValue) => accumulator + currentValue, 0),
      this.sentimentScore.neutral.reduce((accumulator, currentValue) => accumulator + currentValue, 0)],
      labels: ['positive', 'negative', 'neutral'],
      chart: {
        type: 'donut',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
        height: 180,
      },
      colors: ['#0085db', '#fb977d', '#f8c076',],
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
        enabled: true,
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
