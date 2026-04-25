export const QUIZ_1 = {
  id: 'quiz1',
  title: 'Fun Quiz #1: Prompt Foundations Showdown',
  subtitle: 'Test your Month 1 knowledge — 10 questions · pass with 60%',
  passingScore: 60,
  icon: '🎯',
  questions: [
    { q: "What does a 'token' represent in AI?", options: ['A complete sentence', 'A piece of a word (≈0.75 words)', 'A paragraph', 'A character'], correct: 1 },
    { q: 'What does RTF stand for in prompt engineering?', options: ['Real-Time Feedback', 'Role, Task, Format', 'Request, Transfer, Finish', 'Read, Think, Formulate'], correct: 1 },
    { q: "Which prompting technique asks AI to 'think step by step'?", options: ['Zero-shot', 'Few-shot', 'Chain-of-thought', 'Persona prompting'], correct: 2 },
    { q: "In few-shot prompting, what's the ideal number of examples?", options: ['10-15', '1', '2-3', 'As many as possible'], correct: 2 },
    { q: "What happens when you DON'T set constraints in a prompt?", options: ['AI gives perfect output', 'AI may produce overly long or unfocused responses', 'AI refuses to respond', 'Nothing changes'], correct: 1 },
    {
      q: 'Which is a BETTER prompt?',
      options: [
        'Write something about marketing',
        'Act as a senior marketer. Write 3 Instagram captions for a coffee brand targeting millennials. Keep each under 150 characters.',
        'Please help me with marketing stuff',
        'Marketing ideas please',
      ],
      correct: 1,
    },
    { q: "What is 'zero-shot' prompting?", options: ['A prompt with no context at all', 'A prompt with instructions but no examples', 'A failed prompt', 'A prompt that costs zero tokens'], correct: 1 },
    { q: "Why do AI models sometimes 'hallucinate'?", options: ["They're broken", 'They predict the most likely next word, which may not be factually true', "They're trying to be creative", 'Bad internet connection'], correct: 1 },
    { q: "What's the first step in the CRISP framework?", options: ['Instructions', 'Context', 'Style', 'Role'], correct: 1 },
    { q: 'Which is more expensive in tokens: input or output?', options: ['Input is always more expensive', 'Output is typically more expensive per token', 'They cost the same', 'Neither costs anything'], correct: 1 },
  ],
};

export const QUIZ_2 = {
  id: 'quiz2',
  title: 'Fun Quiz #2: Token Master Challenge',
  subtitle: 'Test your Month 2 knowledge — 10 questions · pass with 60%',
  passingScore: 60,
  icon: '⚡',
  questions: [
    { q: 'Approximately how many words equal 1 token?', options: ['0.25 words', '0.5 words', '0.75 words', '2 words'], correct: 2 },
    { q: 'Which saves the MOST tokens?', options: ["Saying 'please' and 'thank you'", 'Writing in paragraphs', 'Using structured, concise prompts', 'Adding more context'], correct: 2 },
    { q: "What is a 'context window'?", options: ['The browser window', 'The maximum tokens AI can process in one conversation', 'A type of prompt', "The AI's memory"], correct: 1 },
    { q: 'When should you use a smaller, cheaper AI model?', options: ['Never, always use the best', 'For simple tasks like formatting or basic Q&A', 'Only for testing', 'When the internet is slow'], correct: 1 },
    { q: "What is 'prompt chaining'?", options: ['Using multiple AI tools at once', 'Connecting the output of one prompt as input to the next', 'Writing very long prompts', 'Repeating the same prompt'], correct: 1 },
    { q: 'Which token-saving strategy has the biggest impact?', options: ['Removing emojis', 'Prompt compression — cutting unnecessary words', 'Using dark mode', 'Typing faster'], correct: 1 },
    { q: 'A system prompt is best described as:', options: ['The first message you type', "Persistent instructions that shape AI's behavior across responses", 'A debugging tool', "The AI's source code"], correct: 1 },
    { q: "What's the 'good enough' principle in model selection?", options: ['Always accept the first response', 'Use the cheapest model that produces acceptable quality for the task', 'Never optimize', "Quality doesn't matter"], correct: 1 },
    { q: "In a content creation chain, what's the ideal step order?", options: ['Write → Edit → Research → Publish', 'Research → Outline → Draft → Edit', 'Edit → Draft → Outline → Research', 'Publish → Write → Edit → Research'], correct: 1 },
    { q: 'Custom instructions in Claude/ChatGPT help save tokens by:', options: ['Making AI faster', 'Eliminating the need to repeat preferences every conversation', "Reducing the AI's vocabulary", 'Compressing the internet'], correct: 1 },
  ],
};
