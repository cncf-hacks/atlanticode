import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/lib/components/shared-module';
import { TuiBadgeModule, TuiCheckboxModule, TuiInputModule } from '@taiga-ui/kit';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { LLM } from 'src/app/lib/interfaces/llm.interface';
import { TuiButtonModule, TuiFormatNumberPipeModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiDay, tuiPure } from '@taiga-ui/cdk';
import { TuiFilterModule } from '@taiga-ui/kit';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { TuiCalendarModule } from '@taiga-ui/core';
import { TuiInputRangeModule } from '@taiga-ui/kit';
import { TuiPaginationModule } from '@taiga-ui/kit';
import { DescriptionModalComponent } from '../description-modal/description-modal.component';

const llmList: LLM[] = [
  {
    id: "blip2001",
    name: "BLIP2-Insight",
    type: "Image Understanding",
    domain: "Visual Perception",
    nrOfParams: "3.5B",
    modelName: "BLIP2",
    description: "BLIP2 is an advanced image understanding model that bridges the gap between visual perception and language understanding. Designed for efficiency and accuracy, BLIP2 can interpret complex images and provide detailed descriptions, insights, and even answer questions about the visual content it sees. It's optimized for real-time analysis and can be deployed in various scenarios, from mobile apps to cloud-based services.",
    lastUpdated: "2024-02-15",
    popularity: "2000000",

    trainingProcess: "Vision Transformer architecture, contrastive learning for image-text pairs, and advanced regularization techniques. Utilizes a large-scale, diverse dataset of images and texts for training.",
    architecture: "Hybrid of Transformers and Convolutional Neural Networks, optimized for both performance and efficiency in processing visual data.",
    datasets: "Extensive collection from ImageNet, COCO, Visual Genome, and custom curated datasets for specific domains.",
    modelsize: "Layers: 48, Heads: 16, Embedding Size: 1024, Feature Size: 2048",
    datasize: "Over 1.2 billion image-text pairs",
    computationalRes: "Designed to be flexible across a wide range of computational settings, from high-end GPUs to mobile devices with optimized inference.",
    performanceMetrics: "Sets new state-of-the-art benchmarks on tasks such as image captioning, visual question answering, and object detection, demonstrating unparalleled understanding of complex visual scenes."
  },
  {
    id: "tinyllama001",
    name: "TinyLlama-Chat",
    type: "Conversational",
    domain: "General Purpose",
    nrOfParams: "1.1B",
    modelName: "tinyllama",
    description: "TinyLlama is a compact, efficient language model designed for low-resource environments, offering capabilities similar to larger models but with significantly reduced computational requirements. It's optimized for quick responses and can perform a wide range of NLP tasks.",
    lastUpdated: "2024-01-20",
    popularity: "200000",

    trainingProcess: "Transformer based, subword tokenization, SGD, dropout and mixed precision. Learning rate cosine with 2000 warmup steps.",
    architecture: "Transformers-based, with optimizations for size and speed.",
    datasets: "Github subset of Slimpajama; Sampled starcoderdata.",
    modelsize: "Layers: 22, Heads: 32, Query Groups: 4, Embedding Size: 2048, Intermediate Size(Swiglu):5632",
    datasize: "950B tokens",
    computationalRes: "Can be run on devices with limited computational resources, including older smartphones and small cloud instances.",
    performanceMetrics: "Achieves competitive results on benchmark tasks like text classification, sentiment analysis, and question-answering within its resource constraints."
  },
  {
    id: "llama207B",
    name: "LLaMA2-7B",
    type: "General Purpose",
    domain: "Multi-Domain",
    nrOfParams: "7B",
    modelName: "LLaMA2-7B",
    description: "The LLaMA2-7B model is a versatile, general-purpose language model designed with a balance between computational efficiency and advanced capabilities. With 7 billion parameters, it is positioned to offer high-quality natural language understanding and generation across a variety of tasks and domains, including conversational AI, content creation, and more, while remaining accessible for deployment on a wide range of hardware platforms.",
    lastUpdated: "2024-03-10",
    popularity: "100000",

    trainingProcess: "Utilizes an advanced Transformer architecture with efficient training techniques, including adaptive learning rates and a focused curriculum learning approach to maximize learning from diverse datasets.",
    architecture: "Optimized Transformer with enhancements in parameter efficiency and processing speed, facilitating deep understanding and rapid response generation.",
    datasets: "A curated blend of text from web pages, books, scientific articles, and specialized domains to ensure comprehensive language coverage and domain adaptability.",
    modelsize: "Layers: 24, Heads: 16, Embedding Size: 2048, Model Parameters: 7 billion",
    datasize: "Processed over 2 trillion tokens for training, with careful selection to maximize diversity and relevance.",
    computationalRes: "Engineered for scalability, it can be effectively run on a variety of computing environments from server-grade CPUs to GPUs, ensuring wide accessibility.",
    performanceMetrics: "Demonstrates strong performance across multiple benchmarks in language understanding, text generation, and specialized tasks, proving its capability as a highly effective tool for a range of NLP challenges."
  },
{
    id: "clinicalBERT001",
    name: "MedicalAI/ClinicalBERT",
    type: "Domain Specific",
    domain: "Healthcare",
    nrOfParams: "110M",
    modelName: "ClinicalBERT",
    description: "ClinicalBERT is a specialized version of BERT adapted for the healthcare industry, focusing on understanding and generating medical text. It is trained on a large corpus of clinical notes, medical journals, and patient records, enabling it to provide insights, support diagnosis, and assist in patient care with a high degree of accuracy. ClinicalBERT is an essential tool for medical professionals, researchers, and healthcare AI applications, aiming to improve patient outcomes through better data analysis.",
    lastUpdated: "2024-03-15",
    popularity: "100000",

    trainingProcess: "Fine-tuned on a diverse set of medical texts, including EHRs, clinical trial reports, and medical literature, using techniques to handle domain-specific terminology and context.",
    architecture: "BERT-based model with enhancements for handling medical terminology and understanding complex clinical narratives.",
    datasets: "Extensive medical datasets including MIMIC-III, PubMed, and proprietary hospital patient notes, ensuring comprehensive coverage of medical knowledge.",
    modelsize: "Layers: 12, Heads: 12, Embedding Size: 768, Model Parameters: 110 million",
    datasize: "Over 3 billion tokens from specialized medical texts",
    computationalRes: "Optimized for efficient inference on medical data platforms, supporting integration into electronic health records (EHR) systems and telehealth applications.",
    performanceMetrics: "Achieves state-of-the-art performance on tasks such as medical entity recognition, patient triage, and clinical outcome prediction, significantly enhancing decision-making in healthcare settings."
}

];

@Component({
  standalone: true,
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  imports: [CommonModule, RouterModule, SharedModule, FormsModule, TuiInputModule, ReactiveFormsModule,TuiFormatNumberPipeModule, TuiSvgModule, TuiBadgeModule, TuiCheckboxModule, TuiFilterModule, TuiInputRangeModule, TuiCalendarModule, TuiPaginationModule, TuiButtonModule, DescriptionModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class HomepageComponent {
parse(arg0: string): number {
return parseInt(arg0)
}
  mobileMenuOpen = false;
  organizationName: string | null = null;
  filtredLLMS: LLM[] = llmList
  paginatedLLMS: LLM[] = this.filtredLLMS.slice(0, 3);
  value = '';
  searchInputValue: string = '';
  pickedFilters: string[] = []
  nameQueryForFilters: string = ''
  popularityQuery: string[] = []
  index: number = 0
  ratingsPopularity = llmList.map(llm => parseFloat(llm.popularity));
  day: TuiDay | null = null;
  isModalOpen: boolean = false;
  llmName: string | null = ""
  llmDescription: string | null = ""
  maxRating = Math.max(...this.ratingsPopularity);
  minRating = Math.min(...this.ratingsPopularity);
  readonly sliderStep = 1;
  readonly steps = (this.maxRating - this.minRating) / this.sliderStep;
  readonly quantum = 0.000001;

  readonly control = new FormControl([this.minRating, this.maxRating]);
  items: string[] = [
    'General Purpose',
    'Image Understanding',
    'Conversational',
    'Text-to-Image',

  ];
  constructor(private route: ActivatedRoute,) { }

  handleModalClose() {
    this.isModalOpen = false;
    console.log('Modal closed!');
  }

  openDetailsModal(llmName: string, llmDescription: string) {
    this.llmName = llmName
    this.llmDescription = llmDescription
    this.isModalOpen = true;

  }

  goToPage(index: number): void {
    this.index = index;
    console.log(index)
    this.paginatedLLMS = this.paginate(index + 1, 3)

  }

  paginate(pageNumber: number, itemsPerPage: number) {
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const paginatedItems = this.filtredLLMS.slice(startIndex, startIndex + itemsPerPage);

    return paginatedItems;
  }

  onDayClick(day: TuiDay): void {
    this.day = day;
    if (this.day !== null) {
      this.filtredLLMS = llmList.filter((llm) => this.isTheDayBefore(llm)
      );
      this.applyFiltersForName()
      this.applyFiltersForType()
      this.applyFiltersForPopularity()
      this.applyPagination()
    }

  }

  readonly testForm = new FormGroup({
    testValue: new FormControl(),
  });

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  get menuIcon() {
    return this.mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7";
  }

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe(params => {
      this.organizationName = params.get('organizationName');
    });

  }

  updateInput(llmName: string) {
    this.searchInputValue = `${llmName}`;
    this.filtredLLMS = []
  }

  searchByName(queryEvent: Event): void {
    const query = (queryEvent.target as HTMLInputElement).value;
    this.nameQueryForFilters = query;
    if (query !== '') {


      this.filtredLLMS = llmList.filter((llm) => llm.name.toLowerCase().includes(this.nameQueryForFilters.toLowerCase())
      );
      this.applyFiltersForDay()
      this.applyFiltersForType()
      this.applyFiltersForPopularity()
      this.applyPagination()
    }

  }

  readonly form = new FormGroup({
    filters: new FormControl(['LLMType']),
  });

  getNrOfPages(): number {
    if (this.filtredLLMS.length % 3 == 0) {
      return this.filtredLLMS.length / 3
    } else {
      return this.filtredLLMS.length / 3 + 1
    }
  }

  readonly filters$ = new BehaviorSubject<readonly string[]>([]);

  @tuiPure
  get model$(): Observable<readonly string[]> {
    return this.filters$.pipe(
      map(value => (value.length === this.items.length ? [] : value)),
    );
  }

  onModelChange(model: string[]): void {
    this.filters$.next(model);
    this.pickedFilters = model;
    if (model.length > 0) {


      this.filtredLLMS = llmList.filter(llm => this.pickedFilters.some(llmType => llm.type.toLowerCase() === llmType.toLowerCase()
      )
      );
      this.applyFiltersForDay()
      this.applyFiltersForName()
      this.applyFiltersForPopularity()
      this.applyPagination()


    }
  }
  onPopularityQueryChange(model: string[]): void {
    this.popularityQuery = model

    if (this.popularityQuery.length > 0) {
      this.filtredLLMS = llmList.filter((llm) => parseFloat(llm.popularity) >= parseFloat(this.popularityQuery[0]) && parseFloat(llm.popularity) <= parseFloat(this.popularityQuery[1]));
      this.applyFiltersForDay()
      this.applyFiltersForName()
      this.applyFiltersForType()
      this.applyPagination()
    }



  }
  applyPagination() {
    this.paginatedLLMS = this.filtredLLMS.slice(0, 3);
  }

  private applyFiltersForType() {
    if (this.pickedFilters.length > 0) {
      this.filtredLLMS = this.filtredLLMS.filter(llm => this.pickedFilters.some(llmType => llm.type.toLowerCase() === llmType.toLowerCase()
      )
      );
    }
  }

  private applyFiltersForDay() {
    if (this.day !== null) {
      this.filtredLLMS = this.filtredLLMS.filter((llm) => this.isTheDayBefore(llm)
      );
    }
  }

  private applyFiltersForPopularity() {
    if (this.popularityQuery.length > 0) {
      this.filtredLLMS = this.filtredLLMS.filter((llm) => parseFloat(llm.popularity) >= parseFloat(this.popularityQuery[0]) && parseFloat(llm.popularity) <= parseFloat(this.popularityQuery[1]));
    }
  }

  private applyFiltersForName() {
    if (this.nameQueryForFilters !== '') {
      this.filtredLLMS = this.filtredLLMS.filter((llm) => llm.name.toLowerCase().includes(this.nameQueryForFilters.toLowerCase())
      );
      this.nameQueryForFilters = this.nameQueryForFilters;
    }
  }

  isTheDayBefore(llm: LLM) {
    const [year, month, day] = llm.lastUpdated.split('-').map(num => parseInt(num, 10));
    const llmDay = new TuiDay(year, month, day)
    return this.day?.dayBefore(llmDay)
  }


}

