export const COURSES = [
  { id: 'caltech_cs156',   title: 'Learning from Data',                      instructor: 'Caltech (Yaser Abu-Mostafa)', category: 'Machine Learning',   level: 'Beginner',     duration: '18 lectures',   price: 110, description: 'Introductory ML covering VC Dimension, bias-variance tradeoff, SVMs, kernels, and fundamental learning principles.', url: 'https://www.youtube.com/playlist?list=PLD63A284B7615313A' },
  { id: 'stanford_cs229',  title: 'CS229: Machine Learning',                 instructor: 'Stanford University',         category: 'Machine Learning',   level: 'Intermediate', duration: '20+ lectures',  price: 199, description: "Stanford's legendary ML course: linear regression, SVMs, kernels, decision trees, neural networks, and debugging ML models.", url: 'https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU' },
  { id: 'tubingen_intro',  title: 'Introduction to Machine Learning',        instructor: 'University of Tübingen',       category: 'Machine Learning',   level: 'Beginner',     duration: 'Full semester', price: 129, description: 'Regression, classification, optimization, regularization, clustering, and dimensionality reduction from first principles.', url: 'https://www.youtube.com/playlist?list=PL05umP7R6ij35ShKLDqccJSDntugY4FQT' },
  { id: 'cs231n_cv',       title: 'CS231N: Convolutional Neural Networks',   instructor: 'Stanford University',         category: 'Deep Learning',      level: 'Advanced',     duration: 'Spring 2017',   price: 229, description: "Stanford's famous vision course: image classification, CNN architectures, RNNs, detection, segmentation, and generative models.", url: 'https://www.youtube.com/playlist?list=PL3FW7Lu3i5JvHM8ljYj-zLfQRF3EO8sYv' },
  { id: 'karpathy_zero',   title: 'Neural Networks: Zero to Hero',           instructor: 'Andrej Karpathy',             category: 'Deep Learning',      level: 'Beginner',     duration: '7+ hours',      price: 159, description: 'Build neural nets from scratch: micrograd → makemore → GPT. Deep backpropagation and language modeling intuition.', url: 'https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ' },
  { id: 'fastai_dl',       title: 'Practical Deep Learning for Coders',      instructor: 'fast.ai (Jeremy Howard)',     category: 'Deep Learning',      level: 'Beginner',     duration: 'Part 1 & 2',    price: 139, description: 'Top-down pragmatic deep learning with PyTorch, fastai, and Hugging Face. Covers CV, NLP, tabular, and diffusion models.', url: 'https://www.youtube.com/playlist?list=PLfYUBJiXbdtSvpQjSnJJ_PmDQB_VyT5iU' },
  { id: 'cs224n_nlp',      title: 'CS224N: NLP with Deep Learning',          instructor: 'Stanford University',         category: 'Generative AI',      level: 'Advanced',     duration: 'Full semester', price: 239, description: 'Transformers, BERT, T5, Large Language Models, Question Answering, and the future of NLP.', url: 'https://www.youtube.com/playlist?list=PLoROMvodv4rOSH4v6133s9LFPRHjEmbmJ' },
  { id: 'stanford_cs25',   title: 'CS25: Transformers United',               instructor: 'Stanford University',         category: 'Generative AI',      level: 'Intermediate', duration: 'Seminar',       price: 189, description: 'Deep dive into Transformers: GPT, Codex, Vision Transformers, RL, Scaling, and Interpretability.', url: 'https://www.youtube.com/playlist?list=PLoROMvodv4rNiJRchCzutFw5ItR_Z27CM' },
  { id: 'hf_nlp_course',   title: 'NLP Course by Hugging Face',              instructor: 'Hugging Face',                 category: 'Generative AI',      level: 'Beginner',     duration: 'Self-paced',    price: 119, description: 'Transfer Learning, BPE Tokenization, fine-tuning models, embeddings, semantic search, and evaluation.', url: 'https://www.youtube.com/playlist?list=PLo2EIpI_JMQvWfQndUesu0nPBAtZ9gP1o' },
  { id: 'prompt_dev',      title: 'ChatGPT Prompt Engineering for Devs',     instructor: 'DeepLearning.AI',              category: 'Prompt Engineering', level: 'Beginner',     duration: 'Short course',  price: 110, description: 'Zero-shot, few-shot, chain-of-thought, and structured output prompting.', url: 'https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/' },
  { id: 'langchain_dev',   title: 'LangChain for LLM App Dev',               instructor: 'DeepLearning.AI',              category: 'Prompt Engineering', level: 'Intermediate', duration: 'Short course',  price: 149, description: 'Models, Prompts, Parsers, Memories, Chains, Q&A over Documents, and Agents with LangChain.', url: 'https://www.deeplearning.ai/short-courses/langchain-for-llm-application-development/' },
  { id: 'llmops_apps',     title: 'LLMOps: Real-World LLM Apps',             instructor: 'Comet ML',                     category: 'AI Applications',    level: 'Intermediate', duration: 'Self-paced',    price: 159, description: 'Build modern software with LLMs: prompt management, eval pipelines, deployment, and monitoring.', url: 'https://www.comet.com/site/llm-course/' },
];

export const CATEGORIES = [
  'All', 'Machine Learning', 'Deep Learning', 'Generative AI', 'Prompt Engineering', 'AI Applications',
];

const BASE_REELS = [
  { id: 'r1', creator: 'Data Expertise', handle: '@data_expertise', avatar: 'DE', title: 'Neural Networks Explained', likes: '12K', comments: '240', youtubeId: '04XBrv4OxNM', hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000', tags: ['ml', 'neuralnets'] },
  { id: 'r2', creator: 'Ram Naresh',     handle: '@ramnaresh',      avatar: 'RN', title: 'Alpha-Beta Pruning',        likes: '45K', comments: '510', youtubeId: 'oFuNxc49et0', hlsUrl: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8', posterUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000', tags: ['algorithms', 'ai'] },
  { id: 'r3', creator: 'Microlearn',     handle: '@micro_ai',       avatar: 'ML', title: 'Start Your AI Career Right', likes: '82K', comments: '1.2K', youtubeId: 'cArcHKeM7xg', hlsUrl: 'https://test-streams.mux.dev/test_001/stream.m3u8', posterUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1000', tags: ['career', 'strategy'] },
  { id: 'r4', creator: 'Data Enthusiast',handle: '@data_enthusiast',avatar: 'DH', title: '2024 ML Roadmap',           likes: '124K',comments: '2.4K', youtubeId: 'PGuKUCS0A9A', tags: ['roadmap', 'learning'] },
  { id: 'r5', creator: 'Bear Kids AI',   handle: '@bear_ai',        avatar: 'BK', title: 'Defining ML Simply',        likes: '310K',comments: '18K',  youtubeId: '2U3-fG_VlLY', tags: ['basics', 'ml'] },
  { id: 'r6', creator: 'Aisha Learns AI', handle: '@aisha.codes',   avatar: 'AL', title: '3 AI Projects For Freshers', likes: '26K', comments: '830', youtubeId: 'fN8Q6k5k6xA', tags: ['projects', 'career'] },
  { id: 'r7', creator: 'Prompt Monk',     handle: '@prompt_monk',   avatar: 'PM', title: 'Prompt Patterns That Work',  likes: '19K', comments: '402', youtubeId: 'R8Y-4x9f6e4', tags: ['prompts', 'genai'] },
];

const DEMO_CREATORS = [
  ['NeuralNinja', '@neuralninja', 'NN'],
  ['VisionVeda', '@vision_veda', 'VV'],
  ['TokenTales', '@token_tales', 'TT'],
  ['PromptPilot', '@promptpilot', 'PP'],
  ['DataDrift', '@data_drift', 'DD'],
  ['AgentCraft', '@agentcraft', 'AC'],
  ['LearnLoop', '@learnloop', 'LL'],
  ['ModelMint', '@model_mint', 'MM'],
];

const DEMO_TOPICS = [
  'Transformer Attention in 30 Seconds',
  'Backprop Animation: Why Gradients Matter',
  'Fine-Tuning vs Prompting Explained',
  'RAG Pipeline Visual Walkthrough',
  'How Diffusion Models Paint Images',
  'CNN Filters Visualized for Beginners',
  'Tokenization Tricks for Better Prompts',
  'AI Agent Loop: Plan, Act, Reflect',
  'Embeddings: Semantic Search Fast Track',
  'Overfitting Fixes You Can Use Today',
];

const DEMO_HLS = [
  'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  'https://test-streams.mux.dev/test_001/stream.m3u8',
  'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8',
];

const DEMO_YT = [
  '04XBrv4OxNM', 'oFuNxc49et0', 'cArcHKeM7xg', 'PGuKUCS0A9A', '2U3-fG_VlLY',
  'x6Q7c9RyMzk', 'kCc8FmEb1nY', 'aircAruvnKk', 'TkwXa7Cvfr8', 'm8pOnJxOcqY',
];

export const GENERATED_REELS = Array.from({ length: 100 }, (_, i) => {
  const c = DEMO_CREATORS[i % DEMO_CREATORS.length];
  const title = DEMO_TOPICS[i % DEMO_TOPICS.length];
  const likes = `${10 + (i % 90)}K`;
  const comments = `${120 + i * 7}`;
  return {
    id: `g${i + 1}`,
    creator: c[0],
    handle: c[1],
    avatar: c[2],
    title: `${title} · Ep ${i + 1}`,
    likes,
    comments,
    youtubeId: DEMO_YT[i % DEMO_YT.length],
    hlsUrl: DEMO_HLS[i % DEMO_HLS.length],
    posterUrl: `https://picsum.photos/seed/ai-reel-${i + 1}/900/1600`,
    tags: ['ai', 'learning', 'animated'],
  };
});

export const REELS = [...BASE_REELS, ...GENERATED_REELS];

export const MODELS = [
  { id: 'gpt4o',    name: 'GPT-4o',     org: 'OpenAI',     color: '#10a37f' },
  { id: 'claude35', name: 'Claude 3.5', org: 'Anthropic',  color: '#d4a27f' },
  { id: 'gemini',   name: 'Gemini Pro', org: 'Google',     color: '#4285f4' },
  { id: 'mistral',  name: 'Mistral 7B', org: 'Mistral AI', color: '#ff6b35' },
  { id: 'llama3',   name: 'Llama 3',    org: 'Meta',       color: '#0082fb' },
];

export const API_BASE = 'https://aipramgram.vercel.app';
// CMS is hosted on Render for production.
// Override in env if your Render URL is different.
export const CMS_BASE = process.env.EXPO_PUBLIC_CMS_BASE_URL
  || 'https://eduai-cms-api.onrender.com';
