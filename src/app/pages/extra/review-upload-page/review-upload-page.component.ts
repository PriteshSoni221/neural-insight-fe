import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AppProfitExpensesComponent, profitExpanceChart } from 'src/app/components/profit-expenses/profit-expenses.component';
import { AppTrafficDistributionComponent, trafficdistributionChart } from 'src/app/components/traffic-distribution/traffic-distribution.component';
import { MaterialModule } from 'src/app/material.module';
import { TextSummaryService, UploadReviewInterface } from 'src/app/services/text-summary.service';
import { productNames } from 'src/assets/constants/productNames';
import { ProductNameInterface } from 'src/assets/interface/productsInterface';

export interface ProductCategoryInterface {
  value: number;
  viewValue: string;
}

// export interface ProductNameInterface {
//   productId: number;
//   category: string;
//   viewValue: string;
// }

export interface ReviewOutput {
  delivery: AspectSentiment;
  quality: AspectSentiment;
  price: AspectSentiment;
  packaging: AspectSentiment;
  service: AspectSentiment;
}

export interface Review {
  input: string;
  output: ReviewOutput;
}

export interface AnalyzedReview {
  _id: string;
  history: any[]; // Adjust the type if history has a specific structure
  input: string;
  output: ReviewOutput
}

interface AspectSentiment {
  sentiment: "positive" | "negative" | "neutral";
  text: string;
}

export interface AnalyzedReviewsResponse {
  analyzed_reviews: AnalyzedReview[];
  summary: string;
  productID: number;
}

export interface APIScoreByAspect {
  positive: number[];
  negative: number[];
  neutral: number[];
}

@Component({
  selector: 'app-review-upload-page',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule, AppProfitExpensesComponent, AppTrafficDistributionComponent, MatSelectModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './review-upload-page.component.html',
  styleUrl: './review-upload-page.component.scss'
})

export class ReviewUploadPageComponent {
  public productCategory: FormControl<string | null> = new FormControl('');
  public productName: FormControl<string | null> = new FormControl('');
  public analyzed_reviews: AnalyzedReview[] = []
  public summary: string | null = ""
  public aspectSentimentChart!: Partial<profitExpanceChart> | any
  public trafficdistributionChart!: Partial<trafficdistributionChart> | any;

  public selectedProductCategory: string;
  public selectedProductId: number;

  public fileContent: Review[] | null = null;

  public productCategories: ProductCategoryInterface[] = [
    { value: 1, viewValue: 'Mouse' },
    { value: 2, viewValue: 'Phone' },
    { value: 3, viewValue: 'Laptop' },
  ];

  public productNames: ProductNameInterface[] = productNames

  private IS_DUMMY: boolean = true
  public sentimentScore: APIScoreByAspect = {
    positive: [],
    negative: [],
    neutral: []
  }

  constructor(private textSummaryService: TextSummaryService) { }

  public onUpload(): void {

    if ((this.selectedProductCategory && this.selectedProductId && this.fileContent)) {
      const body: UploadReviewInterface = {
        productID: this.selectedProductId,
        fileContent: this.fileContent,
        isDummy: this.IS_DUMMY,
      }

      this.textSummaryService.uploadReviews(body).subscribe({
        next: (response) => {
          const APIResponse: AnalyzedReviewsResponse = response;
          this.analyzed_reviews = APIResponse.analyzed_reviews;

          this.calculateSentimentCounts(APIResponse)
          this.summary = APIResponse.summary;
        },
        error: (error) => {
          console.error("error uploading reviews", error);
          this.analyzed_reviews = []
        }
      })
    } else {
      alert("Please enter a Product category, name and upload valid reviews")
    }
  }

  public calculateSentimentCounts(response: AnalyzedReviewsResponse): void {
    const categories = ['price', 'quality', 'delivery', 'packaging', 'service'];

    const sentimentCounts: any = {
      positive: Array(categories.length).fill(0),
      negative: Array(categories.length).fill(0),
      neutral: Array(categories.length).fill(0)
    };

    response.analyzed_reviews.forEach(review => {
      categories.forEach((category, index) => {
        const reviewItem: any = review
        const sentiment: string = reviewItem['output'][`${category}`]?.sentiment;
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


  public onFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validate file type
      if (file.type !== 'application/json') {
        alert('Please upload a valid JSON file.');
        return;
      }

      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          this.fileContent = JSON.parse(e.target?.result as string);
          // console.log('File Content:', this.fileContent);
        } catch (err) {
          console.error('Error parsing JSON:', err);
          alert('Invalid JSON file.');
        }
      };

      reader.onerror = () => {
        console.error('Error reading file.');
        alert('Error reading file.');
      };

      reader.readAsText(file); // Read file as text
    }
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
