import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../material.module';
import {
  AppProfitExpensesComponent,
  profitExpanceChartInterface,
} from 'src/app/components/profit-expenses/profit-expenses.component';
import {
  AppTrafficDistributionComponent,
  trafficdistributionChart,
} from 'src/app/components/traffic-distribution/traffic-distribution.component';
import {
  APIScoreByAspect,
  ProductCategoryInterface,
} from '../extra/review-upload-page/review-upload-page.component';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TextSummaryService } from 'src/app/services/text-summary.service';
import { productNames } from 'src/assets/constants/productNames';
import { ProductNameInterface } from 'src/assets/interface/productsInterface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import IS_DUMMY from 'src/assets/constants/dummyBoolean';
import { productCategories } from 'src/assets/constants/categoryNames';

type Sentiment = 'positive' | 'negative' | 'neutral';

type AnalyzedReview = {
  DeliverySentiment: Sentiment;
  DeliveryText: string;
  PackagingSentiment: Sentiment;
  PackagingText: string;
  PriceSentiment: Sentiment;
  PriceText: string;
  Product_id: number;
  QualitySentiment: Sentiment;
  QualityText: string;
  ServiceSentiment: Sentiment;
  ServiceText: string;
  Text: string;
  _id: string;
};

interface AnalyzedReviewsResponse {
  analyzed_reviews: AnalyzedReview[];
  summary: string;
  productID: number;
}

@Component({
  selector: 'app-starter',
  standalone: true,
  imports: [
    MaterialModule,
    AppProfitExpensesComponent,
    AppTrafficDistributionComponent,
    CommonModule,
    MatSelectModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './starter.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './starter.component.scss',
})
export class StarterComponent {
  public trafficdistributionChart!: Partial<trafficdistributionChart> | any;
  public aspectSentimentChart!: Partial<profitExpanceChartInterface> | any;

  public selectedProductCategory: string | null = null;
  public selectedProductName: number;
  public analyzed_reviews: AnalyzedReview[] = []
  public summary: string | null = ""
  public isLoading: boolean = false

  public sentimentScore: APIScoreByAspect = {
    positive: [],
    negative: [],
    neutral: []
  }

  private IS_DUMMY: boolean = IS_DUMMY

  public productCategories: ProductCategoryInterface[] = productCategories;

  public productNames: ProductNameInterface[] = productNames

  constructor(private textSummaryService: TextSummaryService) {
    this.loadDistributionChart();
    this.loadChart();
  }

  public updateProductNames() {
    this.productNames = productNames.filter((product) => product.category === this.selectedProductCategory);
  }

  public onSubmit(): void {

    if ((this.selectedProductCategory && this.selectedProductName)) {

      if (this.IS_DUMMY) {
        this.selectedProductName = 0
      }
      this.isLoading = true;

      this.textSummaryService.getReviewsByProduct(this.selectedProductName).subscribe({
        next: (response) => {
          const APIResponse: AnalyzedReviewsResponse = response;
          this.analyzed_reviews = APIResponse.analyzed_reviews;

          this.calculateSentimentCounts(APIResponse)
          this.summary = APIResponse.summary;

          this.isLoading = false;
        },
        error: (error) => {
          console.error("error uploading reviews", error);
          this.analyzed_reviews = []
          alert("Error fetching reviews")
          this.isLoading = false;
        }
      })
    } else {
      alert("Please enter a Product category and name")
    }
  }

  calculateSentimentCounts(response: AnalyzedReviewsResponse) {
    const categories = ['Price', 'Quality', 'Delivery', 'Packaging', 'Service'];

    const sentimentCounts: any = {
      positive: Array(categories.length).fill(0),
      negative: Array(categories.length).fill(0),
      neutral: Array(categories.length).fill(0)
    };

    response.analyzed_reviews.forEach(review => {
      categories.forEach((category, index) => {
        const sentimentKey = `${category}Sentiment` as keyof AnalyzedReview;
        const sentiment: any = review[sentimentKey];
        if (sentiment) {
          sentimentCounts[sentiment][index]++;
        }
      });
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
          endingShape: 'rounded',
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
    };
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
