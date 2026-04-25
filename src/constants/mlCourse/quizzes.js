export const QUIZ_1 = {
  id: 'ml_quiz1',
  title: 'Fun Quiz #1: ML Foundations Showdown',
  subtitle: 'Test your Weeks 1–4 knowledge — 10 questions · pass with 60%',
  passingScore: 60,
  icon: '🎯',
  questions: [
    { q: 'Which of the following BEST describes Machine Learning?', options: ['Manually writing every rule for a computer', 'Letting computers learn patterns from data without explicit rules', 'A type of database management', 'A programming language'], correct: 1 },
    { q: "What does a 'feature' represent in an ML dataset?", options: ['The output we want to predict', 'An input variable used for predictions', 'A bug in the data', 'The number of rows in the dataset'], correct: 1 },
    { q: 'Which type of ML has training data WITH correct answer labels?', options: ['Unsupervised Learning', 'Reinforcement Learning', 'Supervised Learning', 'Clustering'], correct: 2 },
    { q: "What does 'overfitting' mean?", options: ['Model is too simple and misses patterns', 'Model memorizes training data and fails on new data', 'Dataset is too large', 'Algorithm runs out of memory'], correct: 1 },
    { q: 'The train/test split is used to:', options: ['Make training faster', 'Estimate how well the model generalises to new data', 'Clean the data', 'Choose the algorithm'], correct: 1 },
    { q: 'Linear Regression is best suited for predicting:', options: ['A category (spam vs not spam)', 'A continuous number (house price, temperature)', 'A cluster group', 'A probability tree'], correct: 1 },
    { q: 'What does MSE (Mean Squared Error) measure?', options: ['Model accuracy in %', 'Average squared distance between predicted and real values', 'Number of training examples', 'Dataset quality score'], correct: 1 },
    { q: 'Gradient descent is used to:', options: ['Maximise the loss function', 'Minimise the loss function by adjusting model weights', 'Generate more training data', 'Split data into train/test'], correct: 1 },
    { q: 'Which problem type is predicting whether a patient has cancer?', options: ['Regression', 'Clustering', 'Classification', 'Dimensionality Reduction'], correct: 2 },
    { q: 'Feature engineering means:', options: ['Deleting all features', 'Creating better input variables from existing data to improve model accuracy', 'Adding more rows to a dataset', 'Writing the ML algorithm from scratch'], correct: 1 },
  ],
};

export const QUIZ_2 = {
  id: 'ml_quiz2',
  title: 'Fun Quiz #2: Algorithm Master Challenge',
  subtitle: 'Test your Weeks 5–8 knowledge — 10 questions · pass with 60%',
  passingScore: 60,
  icon: '⚡',
  questions: [
    { q: 'Logistic Regression outputs values between 0 and 1 using which function?', options: ['ReLU function', 'Sigmoid function', 'Softmax function', 'Tanh function'], correct: 1 },
    { q: 'What does regularization do to a machine learning model?', options: ['Makes the model more complex', 'Increases training time', 'Penalises complexity to reduce overfitting', 'Removes features from the dataset'], correct: 2 },
    { q: 'K-Nearest Neighbors classifies a point based on:', options: ['The centre of all clusters', 'The K closest training examples by majority vote', 'A decision tree', 'A neural network'], correct: 1 },
    { q: "In a confusion matrix, a 'False Positive' means:", options: ['Predicted negative, actual negative', 'Predicted positive, actual positive', 'Predicted positive, actual negative — a false alarm', 'Predicted negative, actual positive'], correct: 2 },
    { q: 'Which technique rotates through K different test splits to get a fairer score?', options: ['Bootstrapping', 'K-Fold Cross Validation', 'Batch Normalisation', 'Feature Scaling'], correct: 1 },
    { q: 'L1 regularization (Lasso) is special because:', options: ['It does nothing', 'It can shrink some feature weights to exactly zero — auto feature selection', 'It always outperforms L2', 'It speeds up training'], correct: 1 },
    { q: 'Random Forest is a combination of:', options: ['K-Means clusters voted together', 'Many Decision Trees trained on random data subsets — their votes are combined', 'One neural network with random weights', 'Multiple logistic regressions'], correct: 1 },
    { q: 'A hospital model tags 100 patients as positive. 90 actually have the disease. What is Precision?', options: ['90%', '10%', '95%', '100%'], correct: 0 },
    { q: 'High bias in a model means:', options: ['Overfitting — memorised the training data', 'Underfitting — too simple to capture the real pattern', 'The model is perfectly calibrated', 'The dataset has errors'], correct: 1 },
    { q: "Why isn't accuracy always the best metric for classification?", options: ["It's too complex to calculate", 'With imbalanced classes, you can score 99% by always predicting the majority class', 'Accuracy and F1 are identical', 'More data always fixes accuracy'], correct: 1 },
  ],
};
