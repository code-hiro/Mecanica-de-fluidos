function calcularReynolds() {
  const rho = parseFloat(document.getElementById("rho").value) || 0;
  const vel = parseFloat(document.getElementById("velocidad").value) || 0;
  const L = parseFloat(document.getElementById("longitud").value) || 0;
  const mu = parseFloat(document.getElementById("viscosidad").value) || 1;
  const Re = (rho * vel * L) / mu;
  let tipo = (Re < 2300) ? "laminar" : "turbulento";
  document.getElementById("resultado-reynolds").textContent =
    `Reynolds = ${Re.toFixed(0)} → Flujo ${tipo}`;
}

function calcularBernoulli() {
  const P1 = parseFloat(document.getElementById("p1").value) || 0;
  const h1 = parseFloat(document.getElementById("h1").value) || 0;
  const h2 = parseFloat(document.getElementById("h2").value) || 0;
  const rho = parseFloat(document.getElementById("densidad").value) || 0;
  const g = 9.81; // gravedad (m/s^2)
  // Suponiendo velocidad constante: P1 + rho*g*h1 = P2 + rho*g*h2 => P2 = P1 + rho*g*(h1 - h2)
  const P2 = P1 + rho * g * (h1 - h2);
  document.getElementById("resultado-bernoulli").textContent =
    `Presión P₂ = ${P2.toFixed(2)} Pa`;
}
