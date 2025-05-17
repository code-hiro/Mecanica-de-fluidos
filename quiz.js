// ==== Quiz Interactivo Mejorado ====
class InteractiveQuiz {
  constructor() {
    this.questions = [
      {
        question: '¿Qué es un fluido?',
        options: [
          'Sólido deformable', 
          'Sustancia que fluye', 
          'Material rígido', 
          'Gas en equilibrio'
        ],
        correct: 1,
        explanation: 'Un fluido es cualquier sustancia que puede fluir y adaptarse al recipiente que lo contiene, incluyendo líquidos y gases.'
      },
      {
        question: '¿Qué representa la densidad?',
        options: [
          'Volumen por masa', 
          'Masa por volumen', 
          'Área por fuerza', 
          'Velocidad por tiempo'
        ],
        correct: 1,
        explanation: 'La densidad (ρ) es una propiedad intensiva definida como la masa (m) por unidad de volumen (V): ρ = m/V.'
      },
      {
        question: '¿Qué mide la viscosidad?',
        options: [
          'Presión del fluido', 
          'Flotabilidad', 
          'Resistencia al flujo', 
          'Velocidad angular'
        ],
        correct: 2,
        explanation: 'La viscosidad cuantifica la resistencia interna de un fluido a fluir, relacionando el esfuerzo cortante con el gradiente de velocidad.'
      },
      {
        question: '¿Cuál es la unidad de presión en el SI?',
        options: [
          'Newton', 
          'Pascal', 
          'Joule', 
          'Watt'
        ],
        correct: 1,
        explanation: 'El Pascal (Pa) es la unidad de presión en el SI, equivalente a 1 Newton por metro cuadrado (N/m²).'
      },
      {
        question: '¿Qué indica un número de Reynolds bajo?',
        options: [
          'Turbulencia alta', 
          'Flujo laminar', 
          'Velocidad constante', 
          'Densidad mínima'
        ],
        correct: 1,
        explanation: 'Un número de Reynolds bajo (Re < 2300) indica que predominan las fuerzas viscosas, resultando en flujo laminar ordenado.'
      }
    ];
    
    this.currentQuestion = 0;
    this.score = 0;
    this.quizContainer = document.getElementById("quiz-container");
    this.resultContainer = document.getElementById("quiz-result");
    this.submitBtn = document.getElementById("submit-quiz");
    this.resetBtn = document.getElementById("reset-quiz");
    
    this.initQuiz();
  }
  
  initQuiz() {
    this.renderQuestion();
    this.setupEventListeners();
  }
  
  renderQuestion() {
    if (this.currentQuestion >= this.questions.length) {
      this.showResults();
      return;
    }
    
    const question = this.questions[this.currentQuestion];
    let html = `
      <div class="question-card">
        <div class="question-header">
          <span class="question-number">Pregunta ${this.currentQuestion + 1}/${this.questions.length}</span>
          <span class="score">Puntuación: ${this.score}/${this.questions.length}</span>
        </div>
        <h3 class="question-text">${question.question}</h3>
        <div class="options-container">
    `;
    
    question.options.forEach((option, index) => {
      html += `
        <div class="option">
          <input type="radio" name="q${this.currentQuestion}" id="q${this.currentQuestion}o${index}" value="${index}">
          <label for="q${this.currentQuestion}o${index}">${option}</label>
        </div>
      `;
    });
    
    html += `</div></div>`;
    this.quizContainer.innerHTML = html;
  }
  
  setupEventListeners() {
    this.submitBtn.addEventListener('click', () => this.checkAnswer());
    this.resetBtn.addEventListener('click', () => this.resetQuiz());
  }
  
  checkAnswer() {
    const selectedOption = document.querySelector(`input[name="q${this.currentQuestion}"]:checked`);
    
    if (!selectedOption) {
      alert('Por favor selecciona una respuesta');
      return;
    }
    
    const selectedValue = parseInt(selectedOption.value);
    const question = this.questions[this.currentQuestion];
    const options = document.querySelectorAll(`input[name="q${this.currentQuestion}"]`);
    
    // Mostrar retroalimentación
    options.forEach((option, index) => {
      const label = option.nextElementSibling;
      if (index === question.correct) {
        label.classList.add('correct');
      } else if (index === selectedValue && index !== question.correct) {
        label.classList.add('incorrect');
      }
      option.disabled = true;
    });
    
    // Actualizar puntuación
    if (selectedValue === question.correct) {
      this.score++;
    }
    
    // Mostrar explicación
    const explanationDiv = document.createElement('div');
    explanationDiv.className = 'explanation';
    explanationDiv.innerHTML = `<p><strong>Explicación:</strong> ${question.explanation}</p>`;
    document.querySelector('.question-card').appendChild(explanationDiv);
    
    // Habilitar botón para siguiente pregunta
    this.submitBtn.textContent = 'Siguiente pregunta';
    this.submitBtn.onclick = () => {
      this.currentQuestion++;
      this.renderQuestion();
      this.submitBtn.textContent = 'Enviar respuesta';
      this.submitBtn.onclick = () => this.checkAnswer();
    };
  }
  
  showResults() {
    const percentage = Math.round((this.score / this.questions.length) * 100);
    let message = '';
    
    if (percentage >= 80) {
      message = '¡Excelente trabajo! Dominas los conceptos fundamentales.';
    } else if (percentage >= 60) {
      message = 'Buen intento, pero hay algunos conceptos por reforzar.';
    } else {
      message = 'Sigue estudiando, revisa los conceptos y vuelve a intentarlo.';
    }
    
    this.quizContainer.innerHTML = `
      <div class="results-card">
        <h3>Resultados del Quiz</h3>
        <div class="score-circle" style="background: conic-gradient(#4CAF50 0% ${percentage}%, #f0f0f0 ${percentage}% 100%)">
          <span>${percentage}%</span>
        </div>
        <p>Has acertado ${this.score} de ${this.questions.length} preguntas.</p>
        <p class="feedback-message">${message}</p>
        <button id="try-again" class="retry-btn">Intentar de nuevo</button>
      </div>
    `;
    
    document.getElementById('try-again').addEventListener('click', () => this.resetQuiz());
  }
  
  resetQuiz() {
    this.currentQuestion = 0;
    this.score = 0;
    this.renderQuestion();
    this.submitBtn.textContent = 'Enviar respuesta';
    this.submitBtn.onclick = () => this.checkAnswer();
  }
}

// Inicializar el quiz cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
  new InteractiveQuiz();
});