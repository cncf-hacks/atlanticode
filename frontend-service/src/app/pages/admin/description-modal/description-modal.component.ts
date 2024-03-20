import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TuiButtonModule } from '@taiga-ui/core';
import { SharedModule } from 'src/app/lib/components/shared-module';
import { LLM } from 'src/app/lib/interfaces/llm.interface';
import { TuiTableModule } from '@taiga-ui/addon-table';

@Component({
  standalone: true,
  selector: 'app-description-modal',
  imports: [CommonModule, SharedModule, TuiButtonModule, TuiTableModule],
  templateUrl: './description-modal.component.html',
  styleUrls: ['./description-modal.component.css']
})
export class DescriptionModalComponent {
  constructor(private router: Router) { }
  @Input() isOpen: boolean = false;
  @Input() llmName: string | null = ''
  @Input() llmDescription: string | null = ''
  @Input() organizationName: string | null = ''
  @Output() onClose = new EventEmitter<void>();
  closeModal() {
    this.isOpen = false;
    this.onClose.emit();
  }

  applicationProcessSteps = [
    {
      title: 'Respect Privacy',
      details: "When inputting data or information into LLMs, be mindful of privacy concerns. Avoid sharing sensitive, personal, or confidential information that could compromise individuals' privacy or security."
    },
    {
      title: 'Prevent Misuse',
      details: "Use LLMs to foster positive outcomes, such as education, research, and creative endeavors. Refrain from deploying these models in ways that could harm individuals, spread misinformation, or propagate harmful biases.."
    },
    {
      title: 'Acknowledge Limitations',
      details: "Understand that LLMs, while advanced, are not infallible. They can produce errors, inaccuracies, or biased outputs. Approach the information and content generated with critical thinking and a questioning mindset."
    },
    {
      title: 'Promote Fairness and Inclusivity',
      details: "Be aware of the potential for biases in the outputs of LLMs and strive to use these tools in a way that promotes inclusivity and fairness. Challenge biases when encountered and seek diverse perspectives."
    },
    {
      title: 'Engage in Open Dialogue',
      details: "Participate in discussions about the ethical use of LLMs and the impact of AI on society. Sharing experiences, concerns, and insights can contribute to a more informed and responsible community of users."
    },
  ];

  tinyLlama: LLM = {
    id: "tinyllama001",
    name: "TinyLlama-Chat",
    type: "Conversational",
    domain: "General Purpose",
    nrOfParams: "1.1B",
    modelName: "tinyllama",
    description: "TinyLlama is a compact, efficient language model designed for low-resource environments, offering capabilities similar to larger models but with significantly reduced computational requirements. It's optimized for quick responses and can perform a wide range of NLP tasks.",
    lastUpdated: "2024-01-20",
    popularity: "Moderate",

    trainingProcess: "Transformer based, subword tokenization, SGD, dropout and mixed precision. Learning rate cosine with 2000 warmup steps.",
    architecture: "Transformers-based, with optimizations for size and speed.",
    datasets: "Github subset of Slimpajama; Sampled starcoderdata.",
    modelsize: "Layers: 22, Heads: 32, Query Groups: 4, Embedding Size: 2048, Intermediate Size(Swiglu):5632",
    datasize: "950B tokens",
    computationalRes: "Can be run on devices with limited computational resources, including older smartphones and small cloud instances.",
    performanceMetrics: "Achieves competitive results on benchmark tasks like text classification, sentiment analysis, and question-answering within its resource constraints."
  };
  readonly data = [
    {
      name: 'Alex Inkin',
      balance: 1323525,
    },
    {
      name: 'Roman Sedov',
      balance: 423242,
    },
  ] as const;
  readonly tableData = [
    {
      name: 'Training process',
      value: "Transformer based, subword tokenization, SGD, dropout and mixed precision. Learning rate cosine with 2000 warmup steps.",
    },
    {
      name: 'Architecture',
      value: "Transformers-based, with optimizations for size and speed.",
    },
    {
      name: 'Training datasets ',
      value: "Github subset of Slimpajama; Sampled starcoderdata.",
    },
    {
      name: 'Model size',
      value: "Layers: 22, Heads: 32, Query Groups: 4, Embedding Size: 2048, Intermediate Size(Swiglu):5632",
    },
    {
      name: 'Data size',
      value: '950B tokens',
    },
    {
      name: 'Computational resources ',
      value: "Can be run on devices with limited computational resources, including older smartphones and small cloud instances.",
    },
    {
      name: 'Performance metrics ',
      value: "Achieves competitive results on benchmark tasks like text classification, sentiment analysis, and question-answering within its resource constraints.",
    },
  ] as const;

  readonly columns = Object.keys(this.tableData[0]);
  navigateToCofigForm() {
    this.router.navigate(['config/' + this.organizationName + '/' + this.llmName]);
  }
}
