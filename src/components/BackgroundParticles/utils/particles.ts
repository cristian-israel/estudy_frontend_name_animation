// components/BackgroundParticles/utils/particles.ts
export interface Particle {
  x: number;
  y: number;
  radius: number;
  baseRadius: number;
  vx: number;
  vy: number;
}

export function initParticles(count: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const radius = Math.random() * 1.5 + 0.5;
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius,
      baseRadius: radius,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
    });
  }
  return particles;
}

export function updateParticles(
  particles: Particle[],
  mouse: React.MutableRefObject<{ x: number; y: number }>,
  isMouseDown: boolean
) {
  for (const p of particles) {
    const dx = p.x - mouse.current.x;
    const dy = p.y - mouse.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const forceRadius = isMouseDown ? 150 : 100;

    if (dist < forceRadius) {
      const angle = Math.atan2(dy, dx);
      const pushPull = isMouseDown ? -0.5 : 0.25;
      p.vx += Math.cos(angle) * pushPull;
      p.vy += Math.sin(angle) * pushPull;
    }

    // Pulsar efeito nas proximidades do mouse
    const pulseRange = 120;
    const pulseSpeed = 0.03;
    if (dist < pulseRange) {
      const scale = 1 + 0.3 * Math.sin(Date.now() * pulseSpeed);
      p.radius = p.baseRadius * scale;
    } else {
      p.radius += (p.baseRadius - p.radius) * 0.05;
    }

    // Movimento suave
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.92;
    p.vy *= 0.92;

    // Reposiciona se sair da tela
    if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
    if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;
  }
}

export function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  mouse: React.MutableRefObject<{ x: number; y: number }>
) {
  for (const p of particles) {
    const dx = p.x - mouse.current.x;
    const dy = p.y - mouse.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    const baseColor = dist < 100 ? "255,255,255" : "200,200,255";
    const opacity = dist < 100 ? 0.4 : 0.15;
    ctx.fillStyle = `rgba(${baseColor},${opacity})`;
    ctx.fill();
  }
}
