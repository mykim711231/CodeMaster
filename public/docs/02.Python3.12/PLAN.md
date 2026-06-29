# Python 3.12 Learning Pack - Documentation Mapping Plan

## Progress Tracking System
This document includes a built-in progress tracking system to allow you to pause and resume work after interruptions (like PC restarts).

### How to Track Your Progress
1. **Update the Status column** as you work on each section:
   - `[ ]` = Not Started (default)
   - `[/]` = In Progress (currently working on this)
   - `[x]` = Completed (finished this section)

2. **Save the file regularly** (Ctrl+S) to preserve your progress
3. **To resume work**: Simply reopen this file and look for items marked `[/]` or `[ ]`

### Progress Summary (Manual Update)
As you mark items as completed, you can manually update these counters:
- **Completed Sections**: Count of `[x]` items
- **Total Sections**: 94 sections across 15 levels
- **Progress Percentage**: (Completed Sections ÷ 94) × 100

### Quick Status Reference
- Look for `[/]` to see what you were last working on
- Look for `[ ]` to find remaining work
- Completed sections `[x]` are finished

---

## ⚡ Rate Limiting & API Error Prevention
**Prevent "ResourceExhausted: Worker local total request limit reached" errors:**

### When Accessing Documentation URLs
- **Add delays**: Wait 2-5 seconds between consecutive URL requests
- **Use sessions**: Reuse HTTP connections (keep-alive) instead of new connections
- **Set proper headers**: Include `User-Agent` with your project identifier
- **Cache results**: Save downloaded HTML/content locally to avoid re-fetching
- **Batch processing**: Process URLs in small batches (3-5 at a time) with pauses

### Example Python Rate Limiter
```python
import time
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

session = requests.Session()
retry_strategy = Retry(
    total=3,
    backoff_factor=2,
    status_forcelist=[429, 500, 502, 503, 504],
)
adapter = HTTPAdapter(max_retries=retry_strategy)
session.mount("http://", adapter)
session.mount("https://", adapter)

def fetch_with_rate_limit(url, delay=3):
    time.sleep(delay)  # Respectful delay
    response = session.get(url, headers={"User-Agent": "CodeMaster-DocMapper/1.0"})
    response.raise_for_status()
    return response.text
```

### Best Practices
| Practice | Benefit |
|----------|---------|
| `time.sleep(3)` between requests | Avoids 429 Too Many Requests |
| Exponential backoff on 429 | Auto-recovers from rate limits |
| Local file cache (`docs/cache/`) | Zero network calls for repeats |
| Process 5 URLs, then 30s pause | Stays within typical rate limits |
| Use `requests.Session()` | Connection reuse, cookie persistence |

---

This document outlines the official documentation sources for each section of the Python AI learning pack.
All URLs point to the official documentation of the respective projects or Python standard library.

## Legend
- **Level**: The learning pack level number and name.
- **Section**: Specific topic within the level.
- **Official Documentation**: The primary source (e.g., Python Docs, NumPy Docs, etc.).
- **URL**: Direct link to the relevant documentation section.
- **Status**: Progress tracking for each item ([ ] = Not Started, [/] = In Progress, [x] = Completed)

## Mapping Table

| Level | Section | Topic | Official Documentation URL | Status |
|-------|---------|-------|----------------------------|--------|
| 1 - Python Core | Python Language Basics | Syntax, Data Types, Control Flow | https://docs.python.org/3/tutorial/ | [ ] |
| 1 - Python Core | Data Structures | Lists, Tuples, Sets, Dictionaries | https://docs.python.org/3/tutorial/datastructures.html | [ ] |
| 1 - Python Core | Functions & Modules | Defining Functions, Modules, Packages | https://docs.python.org/3/tutorial/modules.html | [ ] |
| 1 - Python Core | File I/O | Reading/Writing Files, Context Managers | https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files | [ ] |
| 1 - Python Core | Object-Oriented Programming | Classes, Inheritance, Polymorphism | https://docs.python.org/3/tutorial/classes.html | [ ] |
| 1 - Python Core | Standard Library Overview | os, sys, json, csv, datetime, etc. | https://docs.python.org/3/library/ | [ ] |
| 2 - Async | Asyncio Fundamentals | Event Loop, Coroutines, Tasks | https://docs.python.org/3/library/asyncio.html | [ ] |
| 2 - Async | Async/Await Syntax | Defining and Awaiting Coroutines | https://docs.python.org/3/reference/expressions.html#await | [ ] |
| 2 - Async | Asyncio Streams | StreamReader, StreamWriter, open_connection | https://docs.python.org/3/library/asyncio-stream.html | [ ] |
| 2 - Async | Synchronization | Locks, Semaphores, Conditions, Events | https://docs.python.org/3/library/asyncio-sync.html | [ ] |
| 2 - Async | Subprocesses | create_subprocess_exec, create_subprocess_shell | https://docs.python.org/3/library/asyncio-subprocess.html | [ ] |
| 3 - Data | NumPy Basics | Arrays, Array Creation, Indexing | https://numpy.org/doc/stable/ | [ ] |
| 3 - Data | NumPy Operations | Linear Algebra, Fourier Transforms, Random Sampling | https://numpy.org/doc/stable/reference/ | [ ] |
| 3 - Data | Pandas Essentials | DataFrames, Series, GroupBy, Time Series | https://pandas.pydata.org/docs/ | [ ] |
| 3 - Data | Pandas IO | CSV, Excel, SQL, Parquet, HDF5 | https://pandas.pydata.org/docs/user_guide/io.html | [ ] |
| 3 - Data | Data Visualization | Matplotlib, Seaborn, Plotly Basics | https://matplotlib.org/stable/tutorials/introductory/pyplot.html | [ ] |
| 4 - Machine Learning | Scikit-learn Overview | Estimators, Predictors, Transformers | https://scikit-learn.org/stable/tutorial/ | [ ] |
| 4 - Machine Learning | Supervised Learning | Classification, Regression, Model Evaluation | https://scikit-learn.org/stable/supervised_learning.html | [ ] |
| 4 - Machine Learning | Unsupervised Learning | Clustering, Dimensionality Reduction, Density Estimation | https://scikit-learn.org/stable/unsupervised_learning.html | [ ] |
| 4 - Machine Learning | Model Persistence | Joblib, Pickle, ONNX Conversion | https://scikit-learn.org/stable/model_persistence.html | [ ] |
| 5 - Deep Learning | TensorFlow 2.x Basics | Tensors, Operations, Automatic Differentiation | https://www.tensorflow.org/guide | [ ] |
| 5 - Deep Learning | Keras API | Sequential/Model Subclassing, Layers, Callbacks | https://www.tensorflow.org/guide/keras | [ ] |
| 5 - Deep Learning | PyTorch Basics | Tensors, Autograd, NN Module | https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html | [ ] |
| 5 - Deep Learning | PyTorch nn.Module | Custom Layers, Parameter Management | https://pytorch.org/tutorials/beginner/nn_tutorial.html | [ ] |
| 6 - LLM | Hugging Face Transformers | Pipeline API, Model Classes, Tokenizers | https://huggingface.co/docs/transformers/index | [ ] |
| 6 - LLM | Prompt Engineering Basics | Zero-shot, Few-shot, Chain-of-Thought Prompting | https://www.promptingguide.ai/ | [ ] |
| 6 - LLM | OpenAI API (if applicable) | Chat Completions, Embeddings, Fine-tuning | https://platform.openai.com/docs/api-reference | [ ] |
| 7 - RAG | Retrieval-Augmented Generation | Vector Stores, Embedding Models, RAG Pipelines | https://www.pinecone.io/learn/vector-database/ | [ ] |
| 7 - RAG | Vector Similarity Search | Approximate Nearest Neighbor (ANN) Algorithms | https://github.com/erikbern/ann-benchmarks | [ ] |
| 7 - RAG | LangChain Basics | LLMs, Prompts, Chains, Agents | https://python.langchain.com/docs/get_started/introduction.html | [ ] |
| 8 - AI Agent | Agent Architectures | ReAct, Plan-and-Execute, Self-Reflection | https://www.philschmid.de/ai-agents-survey | [ ] |
| 8 - AI Agent | LangGraph | State Graphs, Conditional Execution, Human-in-the-loop | https://langchain-ai.github.io/langgraph/ | [ ] |
| 8 - AI Agent | AutoGPT / BabyAGI | Goal Decomposition, Task Management, Memory | https://github.com/Significant-Gravitas/AutoGPT | [ ] |
| 9 - Framework | FastAPI Basics | Path Operations, Dependency Injection, Validation | https://fastapi.tiangolo.com/tutorial/ | [ ] |
| 9 - FastAPI | Async Support | Background Tasks, WebSockets, Lifespan Events | https://fastapi.tiangolo.com/tutorial/background-tasks/ | [ ] |
| 9 - Framework | Django Essentials | Models, Views, Templates, ORM, Admin | https://docs.djangoproject.com/en/4.2/intro/tutorial01/ | [ ] |
| 9 - Framework | Flask Basics | Routing, Templates, Extensions, Blueprints | https://flask.palletsprojects.com/ | [ ] |
| 10 - Production AI | Model Serving | TensorFlow Serving, TorchServe, Triton Inference Server | https://github.com/triton-inference-server/server | [ ] |
| 10 - Production AI | MLflow | Experiment Tracking, Model Registry, Projects | https://mlflow.org/docs/latest/index.html | [ ] |
| 10 - Production AI | Experiment Tracking | Weights & Biases, Comet.ml, Azure ML | https://wandb.ai/site | [ ] |
| 10 - Production AI | Containerization | Docker Images, Multi-stage Builds, SBOM | https://docs.docker.com/get-started/ | [ ] |
| 11 - Vector Store | FAISS | Index Types, GPU Support, Batch Search | https://faiss.ai/index.html | [ ] |
| 11 - Vector Store | Annoy | Forest Construction, Querying, Disk Indexes | https://github.com/spotify/annoy | [ ] |
| 11 - Vector Store | Milvus | Collection Management, Partitioning, Hybrid Search | https://milvus.io/docs/ | [ ] |
| 11 - Vector Store | Pinecone | Index Creation, Metadata Filtering, Pod Types | https://www.pinecone.io/learn/series/pinecone-101/ | [ ] |
| 12 - LLM Serving/Optimization | vLLM | PagedAttention, Continuous Batching, Async Engine | https://docs.vllm.ai/en/latest/ | [ ] |
| 12 - LLM Serving/Optimization | Hugging Face TGI | Text Generation Inference, Language Support, Batching | https://huggingface.co/docs/text-generation-inference/index | [ ] |
| 12 - LLM Serving/Optimization | TensorRT-LLM | Quantization, Kernel Fusion, Multi-GPU | https://developer.nvidia.com/blog/tensorrt-llm/ | [ ] |
| 13 - Prompt & Structured Output | Guidance | LLMs as Constrained Generation, Regex Control | https://guidance.ai/ | [ ] |
| 13 - Prompt & Structured Output | Outlines | Structured Generation via Pydantic, Regex, CFG | https://outlines-dev.github.io/outlines/ | [ ] |
| 13 - Prompt & Structured Output | LMQL | Query Language for LLMs with Constraints | https://lmql.ai/ | [ ] |
| 14 - Fine-tuning & MLOps | Parameter-Efficient Finetuning (PEFT) | LoRA, AdaLoRA, IA³, Prompt Tuning | https://huggingface.co/docs/peft/index | [ ] |
| 14 - Finetuning & MLOps | Quantization | 4-bit, 8-bit, Dynamic & Static Quantization | https://huggingface.co/docs/transformers/main_classes/quantization | [ ] |
| 14 - Fine-tuning & MLOps | MLOps Pipelines | Kubeflow Pipelines, TFX, ZenML | https://www.kubeflow.org/docs/components/pipelines/introduction/ | [ ] |
| 14 - Fine-tuning & MLOps | Experiment Tracking | MLflow, Weights & Biases, DVC | https://dvc.org/doc | [ ] |
| 15 - AI Quality/Monitoring/Security | Model Monitoring | Data Drift, Concept Drift, Performance Degradation | https://www.whylabs.ai/ | [ ] |
| 15 - AI Quality/Monitoring/Security | Explainability | SHAP, LIME, Counterfactuals, Integrated Gradients | https://shap.readthedocs.io/en/latest/ | [ ] |
| 15 - AI Quality/Monitoring/Security | Bias & Fairness | Disparate Impact, Equal Opportunity, Demographic Parity | https://aif360.mybluemix.net/ | [ ] |
| 15 - AI Quality/Monitoring/Security | Prompt Injection Defense | Input Sanitization, Output Validation, Sandboxing | https://learnprompting.org/docs/prompt_hacking/injection | [ ] |
| 15 - AI Quality/Monitoring/Security | Privacy-Preserving ML | Differential Privacy, Federated Learning, Homomorphic Encryption | https://www.tensorflow.org/research/privacy | [ ] |