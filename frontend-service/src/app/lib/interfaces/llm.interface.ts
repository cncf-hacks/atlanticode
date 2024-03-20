export interface LLM {
    id: string;
    name: string
    type: string
    domain:string
    modelName:string
    description: string
    lastUpdated: string
    popularity: string 
 
    trainingProcess?: string
    testingProcess?:string
    architecture?:string
    nrOfParams:string
    datasets?:string
    computationalRes?:string
    performanceMetrics?:string
    modelsize?:string
    datasize?:string

  };
  
  const tinyLlama: LLM = {
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
    modelsize:"Layers: 22, Heads: 32, Query Groups: 4, Embedding Size: 2048, Intermediate Size(Swiglu):5632",
    datasize: "950B tokens",
    computationalRes: "Can be run on devices with limited computational resources, including older smartphones and small cloud instances.",
    performanceMetrics: "Achieves competitive results on benchmark tasks like text classification, sentiment analysis, and question-answering within its resource constraints."
};