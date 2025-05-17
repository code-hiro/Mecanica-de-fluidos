// === SIMULACIÓN DE FLUJO MEJORADA ===
class FlowSimulation {
  constructor(canvasId, particleCount = 150) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.velocity = 1;
    this.animationId = null;
    this.particleCount = particleCount;
    this.colors = ['#0066cc', '#0080ff', '#00a2ff', '#4db8ff'];
    
    this.initCanvas();
    this.createParticles();
    this.setupEventListeners();
  }
  
  initCanvas() {
    this.canvas.width = Math.min(800, window.innerWidth - 40);
    this.canvas.height = 300;
    this.ctx.imageSmoothingEnabled = true;
  }
  
  createParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        r: 2 + Math.random() * 2,
        speed: 0.5 + Math.random() * 1.5,
        color: this.colors[Math.floor(Math.random() * this.colors.length)]
      });
    }
  }
  
  setupEventListeners() {
    const velSlider = document.getElementById("velSlider");
    velSlider.addEventListener("input", (e) => {
      this.velocity = parseFloat(e.target.value);
    });
    
    window.addEventListener("resize", () => {
      this.initCanvas();
    });
  }
  
  drawParticles() {
    // Fondo con gradiente
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, "#e6f2ff");
    gradient.addColorStop(1, "#cce0ff");
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Dibujar partículas
    for (let p of this.particles) {
      // Perfil parabólico de velocidad (más rápido en centro)
      const centerY = this.canvas.height / 2;
      const normalizedY = (p.y - centerY) / centerY;
      const perfil = 1.5 - normalizedY * normalizedY;
      
      p.x += this.velocity * perfil * p.speed;
      if (p.x > this.canvas.width) p.x = -p.r * 2;
      if (p.x < -p.r * 2) p.x = this.canvas.width;
      
      // Sombra para efecto de profundidad
      this.ctx.shadowColor = 'rgba(0,0,0,0.2)';
      this.ctx.shadowBlur = 5;
      this.ctx.shadowOffsetY = 2;
      
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();
      
      // Resetear sombra
      this.ctx.shadowColor = 'transparent';
    }
  }
  
  animate() {
    this.drawParticles();
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  start() {
    if (!this.animationId) {
      this.animate();
    }
  }
  
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}

// === QUIZ INTERACTIVO MEJORADO ===
class InteractiveQuiz {
  constructor(questions) {
    this.questions = questions;
    this.currentIndex = 0;
    this.score = 0;
    this.quizContainer = document.getElementById('quiz-container');
    this.resultContainer = document.getElementById('quiz-result');
    
    this.initQuiz();
  }
  
  initQuiz() {
    if (!this.quizContainer) return;
    
    this.quizContainer.innerHTML = '';
    this.showQuestion();
  }
  
  showQuestion() {
    const question = this.questions[this.currentIndex];
    
    const questionHTML = `
      <div class="question-box">
        <h3>Pregunta ${this.currentIndex + 1} de ${this.questions.length}</h3>
        <p class="question-text">${question.q}</p>
        <div class="options-container">
          ${question.opciones.map((opcion, i) => `
            <button class="option-btn" data-index="${i}">${opcion}</button>
          `).join('')}
        </div>
        <div id="feedback" class="feedback"></div>
      </div>
    `;
    
    this.quizContainer.innerHTML = questionHTML;
    
    // Agregar event listeners a los botones
    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.checkAnswer(e));
    });
  }
  
  checkAnswer(e) {
    const selectedIndex = parseInt(e.target.dataset.index);
    const correctIndex = this.questions[this.currentIndex].correcta;
    const feedback = document.getElementById('feedback');
    
    if (selectedIndex === correctIndex) {
      feedback.textContent = '✅ Correcto!';
      feedback.style.color = '#2e8b57';
      this.score++;
    } else {
      feedback.textContent = `❌ Incorrecto. La respuesta correcta es: ${this.questions[this.currentIndex].opciones[correctIndex]}`;
      feedback.style.color = '#dc143c';
    }
    
    // Deshabilitar botones después de responder
    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.disabled = true;
    });
    
    // Mostrar siguiente pregunta después de un breve retraso
    setTimeout(() => {
      this.nextQuestion();
    }, 1500);
  }
  
  nextQuestion() {
    this.currentIndex++;
    
    if (this.currentIndex < this.questions.length) {
      this.showQuestion();
    } else {
      this.showResults();
    }
  }
  
  showResults() {
    const percentage = Math.round((this.score / this.questions.length) * 100);
    
    this.quizContainer.innerHTML = `
      <div class="results-box">
        <h3>Resultados del Quiz</h3>
        <p>Obtuviste ${this.score} de ${this.questions.length} respuestas correctas (${percentage}%)</p>
        <div class="progress-container">
          <div class="progress-bar" style="width: ${percentage}%"></div>
        </div>
        <button id="restart-quiz" class="restart-btn">Reintentar Quiz</button>
      </div>
    `;
    
    document.getElementById('restart-quiz').addEventListener('click', () => {
      this.currentIndex = 0;
      this.score = 0;
      this.initQuiz();
    });
  }
}

// === DIAGRAMA DE MOODY INTERACTIVO MEJORADO ===
class MoodyDiagram {
  constructor() {
    this.plotElement = document.getElementById('moody-plot');
    this.roughnessSelect = document.getElementById('rugosidadSelect');
    this.initialized = false;
    
    if (this.plotElement && this.roughnessSelect) {
      this.init();
    }
  }
  
  init() {
    this.setupEventListeners();
    this.updatePlot();
    this.initialized = true;
  }
  
  setupEventListeners() {
    this.roughnessSelect.addEventListener('change', () => this.updatePlot());
    
    window.addEventListener('resize', () => {
      if (this.initialized) {
        this.updatePlot();
      }
    });
  }
  
  colebrook(f, Re, eps_D) {
    return 1 / Math.sqrt(f) + 2.0 * Math.log10(eps_D / 3.7 + 2.51 / (Re * Math.sqrt(f)));
  }
  
  solveColebrook(Re, eps_D) {
    let f = 0.02;
    for (let i = 0; i < 50; i++) {
      const df = (this.colebrook(f + 1e-6, Re, eps_D) - this.colebrook(f, Re, eps_D)) / 1e-6;
      f = f - this.colebrook(f, Re, eps_D) / df;
      if (Math.abs(this.colebrook(f, Re, eps_D)) < 1e-6) break;
    }
    return f;
  }
  
  generateData(eps_D) {
    const Re = [];
    const f = [];
    
    // Zona laminar
    for (let i = 2; i <= 3.3; i += 0.05) {
      const R = Math.pow(10, i);
      Re.push(R);
      f.push(64 / R);
    }
    
    // Zona de transición (punto intermedio)
    Re.push(2300);
    f.push(64 / 2300);
    
    // Zona turbulenta
    for (let i = 3.5; i <= 8; i += 0.05) {
      const R = Math.pow(10, i);
      Re.push(R);
      f.push(this.solveColebrook(R, eps_D));
    }
    
    return { Re, f };
  }
  
  updatePlot() {
    const eps_D = parseFloat(this.roughnessSelect.value);
    const data = this.generateData(eps_D);
    
    const trace = {
      x: data.Re,
      y: data.f,
      mode: 'lines',
      name: `ε/D = ${eps_D}`,
      line: {
        color: '#0066cc',
        width: 3,
        shape: 'spline'
      },
      hoverinfo: 'x+y'
    };
    
    // Añadir línea de flujo laminar
    const laminarTrace = {
      x: [10, 2300],
      y: [64/10, 64/2300],
      mode: 'lines',
      name: 'Flujo laminar (f=64/Re)',
      line: {
        color: '#2e8b57',
        width: 2,
        dash: 'dot'
      }
    };
    
    // Añadir línea de transición
    const transitionTrace = {
      x: [2000, 4000],
      y: [64/2000, 0.035], // Valores aproximados
      mode: 'lines',
      name: 'Zona de transición',
      line: {
        color: '#ff8c00',
        width: 1,
        dash: 'dash'
      },
      fill: 'tonexty',
      fillcolor: 'rgba(255,140,0,0.1)'
    };
    
    const layout = {
      title: {
        text: '<b>Diagrama de Moody Interactivo</b>',
        font: {
          size: 18
        }
      },
      xaxis: {
        title: {
          text: '<b>Número de Reynolds (Re)</b>',
          font: {
            size: 14
          }
        },
        type: 'log',
        range: [2, 8],
        gridcolor: '#f0f0f0',
        tickvals: [1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8],
        ticktext: ['10²', '10³', '10⁴', '10⁵', '10⁶', '10⁷', '10⁸']
      },
      yaxis: {
        title: {
          text: '<b>Factor de Fricción (f)</b>',
          font: {
            size: 14
          }
        },
        type: 'log',
        range: [-2, 0],
        gridcolor: '#f0f0f0'
      },
      margin: { t: 60, b: 70, l: 70, r: 30 },
      legend: {
        x: 0.05,
        y: 1.1,
        orientation: 'h'
      },
      hovermode: 'closest',
      plot_bgcolor: 'rgba(240,248,255,0.8)',
      paper_bgcolor: 'rgba(255,255,255,0.9)',
      annotations: [
        {
          x: 3.5,
          y: -1.2,
          text: `Rugosidad relativa: ε/D = ${eps_D}`,
          showarrow: false,
          font: {
            size: 12,
            color: '#0066cc'
          }
        }
      ]
    };
    
    Plotly.newPlot(this.plotElement, [trace, laminarTrace, transitionTrace], layout, {
      responsive: true,
      displayModeBar: true
    });
  }
}

// === INICIALIZACIÓN AL CARGAR LA PÁGINA ===
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar simulador de flujo
  const flowSimulation = new FlowSimulation('flowCanvas');
  flowSimulation.start();
  
  // Configurar botones de control de simulación
  document.getElementById('startSim').addEventListener('click', () => {
    flowSimulation.start();
  });
  
  document.getElementById('stopSim').addEventListener('click', () => {
    flowSimulation.stop();
  });
  
  // Inicializar quiz
  const quizQuestions = [
    {
      q: '¿Qué representa el número de Reynolds?',
      opciones: [
        'Relación entre fuerzas inerciales y fuerzas viscosas',
        'Coeficiente de fricción en tuberías',
        'Velocidad crítica para cambio de régimen'
      ],
      correcta: 0,
      explicacion: 'El número de Reynolds (Re) es un número adimensional que relaciona las fuerzas inerciales con las fuerzas viscosas en un fluido.'
    },
    {
      q: '¿Qué mide la rugosidad relativa en tuberías?',
      opciones: [
        'El tamaño de partículas en el fluido',
        'La relación entre la rugosidad superficial y el diámetro de la tubería',
        'La densidad relativa del fluido'
      ],
      correcta: 1,
      explicacion: 'La rugosidad relativa (ε/D) es la relación entre la altura promedio de las irregularidades de la superficie (ε) y el diámetro interno de la tubería (D).'
    },
    {
      q: '¿En qué régimen el flujo es laminar?',
      opciones: [
        'Re < 2300',
        'Re > 4000',
        '2000 < Re < 4000'
      ],
      correcta: 0,
      explicacion: 'El flujo laminar ocurre típicamente para números de Reynolds menores a 2300 en tuberías, donde las fuerzas viscosas dominan sobre las inerciales.'
    },
    {
      q: '¿Qué ecuación describe la pérdida de presión por fricción en tuberías?',
      opciones: [
        'Ecuación de Bernoulli',
        'Ecuación de Darcy-Weisbach',
        'Ecuación de continuidad'
      ],
      correcta: 1,
      explicacion: 'La ecuación de Darcy-Weisbach (Δp = f·(L/D)·(ρv²/2)) calcula las pérdidas por fricción en tuberías, donde f es el factor de fricción.'
    },
    {
      q: '¿Qué representa el término ½ρv² en la ecuación de Bernoulli?',
      opciones: [
        'Presión estática',
        'Presión dinámica',
        'Presión hidrostática'
      ],
      correcta: 1,
      explicacion: 'El término ½ρv² representa la presión dinámica, que es la energía cinética por unidad de volumen del fluido en movimiento.'
    }
  ];
  
  const interactiveQuiz = new InteractiveQuiz(quizQuestions);
  
  // Inicializar diagrama de Moody
  const moodyDiagram = new MoodyDiagram();
});