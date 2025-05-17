// ==== Simulación de Flujo Mejorada ====
class FlowSimulation {
  constructor() {
    this.canvas = document.getElementById("simCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.animationId = null;
    this.frameCount = 0;
    this.flowType = 'laminar'; // 'laminar' o 'turbulent'
    this.particles = [];
    
    this.initCanvas();
    this.createParticles();
    this.setupControls();
    this.startSimulation();
  }
  
  initCanvas() {
    this.canvas.width = Math.min(800, window.innerWidth - 40);
    this.canvas.height = 300;
    this.pipeWidth = this.canvas.width - 100;
    this.pipeHeight = 100;
    this.pipeX = 50;
    this.pipeY = (this.canvas.height - this.pipeHeight) / 2;
  }
  
  createParticles() {
    // Crear partículas para la visualización
    for (let i = 0; i < 200; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: this.pipeY + 10 + Math.random() * (this.pipeHeight - 20),
        size: 1 + Math.random() * 2,
        speed: 1 + Math.random() * 2,
        color: `hsl(${200 + Math.random() * 40}, 80%, 60%)`
      });
    }
  }
  
  setupControls() {
    const flowTypeSelect = document.getElementById("flowType");
    const startBtn = document.getElementById("startSim");
    const stopBtn = document.getElementById("stopSim");
    
    flowTypeSelect.addEventListener('change', (e) => {
      this.flowType = e.target.value;
    });
    
    startBtn.addEventListener('click', () => this.startSimulation());
    stopBtn.addEventListener('click', () => this.stopSimulation());
    
    window.addEventListener('resize', () => {
      this.initCanvas();
    });
  }
  
  startSimulation() {
    if (!this.animationId) {
      this.frameCount = 0;
      this.animate();
    }
  }
  
  stopSimulation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawPipe();
    
    if (this.flowType === 'laminar') {
      this.drawLaminarFlow();
    } else {
      this.drawTurbulentFlow();
    }
    
    this.drawParticles();
    this.drawLabels();
    
    this.frameCount++;
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  drawPipe() {
    // Fondo del tubo con gradiente
    const gradient = this.ctx.createLinearGradient(0, this.pipeY, 0, this.pipeY + this.pipeHeight);
    gradient.addColorStop(0, '#0066cc');
    gradient.addColorStop(1, '#004080');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(this.pipeX, this.pipeY, this.pipeWidth, this.pipeHeight);
    
    // Bordes del tubo
    this.ctx.strokeStyle = '#003366';
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(this.pipeX, this.pipeY, this.pipeWidth, this.pipeHeight);
  }
  
  drawLaminarFlow() {
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    this.ctx.lineWidth = 1.5;
    
    // Dibujar líneas de flujo parabólicas
    for (let i = 0; i < 15; i++) {
      const y = this.pipeY + 10 + i * ((this.pipeHeight - 20) / 14);
      this.ctx.beginPath();
      
      for (let x = this.pipeX; x <= this.pipeX + this.pipeWidth; x += 5) {
        // Perfil parabólico de velocidad
        const centerY = this.pipeY + this.pipeHeight / 2;
        const normalizedY = (y - centerY) / (this.pipeHeight / 2);
        const velocityProfile = 1 - Math.pow(normalizedY, 2);
        const offset = velocityProfile * 5 * Math.sin(x / 30 + this.frameCount / 15);
        
        this.ctx.lineTo(x, y + offset);
      }
      
      this.ctx.stroke();
    }
  }
  
  drawTurbulentFlow() {
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    this.ctx.lineWidth = 1;
    
    // Dibujar líneas de flujo turbulentas
    for (let i = 0; i < 25; i++) {
      const y = this.pipeY + 10 + i * ((this.pipeHeight - 20) / 24);
      this.ctx.beginPath();
      
      for (let x = this.pipeX; x <= this.pipeX + this.pipeWidth; x += 4) {
        const base = 1.5 * Math.sin(x / 10 + this.frameCount / 7 + i);
        const noise = (Math.random() - 0.5) * 0.7;
        const offset = base * 5 + noise * 5;
        
        this.ctx.lineTo(x, y + offset);
      }
      
      this.ctx.stroke();
    }
  }
  
  drawParticles() {
    this.particles.forEach(p => {
      // Mover partículas según el tipo de flujo
      if (this.flowType === 'laminar') {
        // Perfil laminar - más rápido en el centro
        const centerY = this.pipeY + this.pipeHeight / 2;
        const normalizedY = (p.y - centerY) / (this.pipeHeight / 2);
        const velocityProfile = 1 - Math.pow(normalizedY, 2);
        p.x += p.speed * velocityProfile * 2;
      } else {
        // Flujo turbulento - movimiento más aleatorio
        p.x += p.speed * (0.8 + Math.random() * 0.4);
        p.y += (Math.random() - 0.5) * 1.5;
      }
      
      // Reiniciar posición si salen del tubo
      if (p.x > this.pipeX + this.pipeWidth) {
        p.x = this.pipeX;
        p.y = this.pipeY + 10 + Math.random() * (this.pipeHeight - 20);
      }
      
      // Mantener partículas dentro del tubo verticalmente
      if (p.y < this.pipeY + 5) p.y = this.pipeY + 5;
      if (p.y > this.pipeY + this.pipeHeight - 5) p.y = this.pipeY + this.pipeHeight - 5;
      
      // Dibujar partícula
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();
    });
  }
  
  drawLabels() {
    this.ctx.fillStyle = "white";
    this.ctx.font = "bold 18px Arial";
    this.ctx.textAlign = "center";
    
    if (this.flowType === 'laminar') {
      this.ctx.fillText("Flujo Laminar (Re < 2300)", this.canvas.width / 2, 30);
    } else {
      this.ctx.fillText("Flujo Turbulento (Re > 4000)", this.canvas.width / 2, 30);
    }
    
    // Añadir información adicional
    this.ctx.font = "14px Arial";
    this.ctx.fillText("Número de Reynolds: Re = ρvD/μ", this.canvas.width / 2, this.canvas.height - 15);
  }
}

// Inicializar la simulación al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  new FlowSimulation();
});