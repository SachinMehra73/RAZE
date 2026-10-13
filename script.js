/**
 * Sachin Mehra - Personal Portfolio JavaScript
 * Interactive Silicon Circuit Canvas, Modal System, Filter Engine, Contact Handler
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Set current year in footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Initialize interactive components
  initThemeToggle();
  initMobileMenu();
  initCircuitCanvas();
  initProjectFilters();
  initScrollSpy();
  initClockSimulation();
});

/* ==========================================================================
   THEME TOGGLE (Dark / Light Mode)
   ========================================================================== */
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');
  const html = document.documentElement;

  // Check stored theme or default to dark
  const storedTheme = localStorage.getItem('sachin-portfolio-theme') || 'dark';
  setTheme(storedTheme);

  function setTheme(theme) {
    if (theme === 'dark') {
      html.classList.add('dark');
      if (sunIcon) sunIcon.classList.remove('hidden');
      if (moonIcon) moonIcon.classList.add('hidden');
    } else {
      html.classList.remove('dark');
      if (sunIcon) sunIcon.classList.add('hidden');
      if (moonIcon) moonIcon.classList.remove('hidden');
    }
    localStorage.setItem('sachin-portfolio-theme', theme);
  }

  function toggle() {
    const isDark = html.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
  }

  if (themeToggle) themeToggle.addEventListener('click', toggle);
  if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggle);
}

/* ==========================================================================
   MOBILE MENU DRAWER
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const closeIcon = document.getElementById('close-icon');

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.contains('hidden');
    if (isHidden) {
      mobileMenu.classList.remove('hidden');
      if (hamburgerIcon) hamburgerIcon.classList.add('hidden');
      if (closeIcon) closeIcon.classList.remove('hidden');
    } else {
      mobileMenu.classList.add('hidden');
      if (hamburgerIcon) hamburgerIcon.classList.remove('hidden');
      if (closeIcon) closeIcon.classList.add('hidden');
    }
  });

  // Close menu when clicking any mobile nav link
  const links = mobileMenu.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      if (hamburgerIcon) hamburgerIcon.classList.remove('hidden');
      if (closeIcon) closeIcon.classList.add('hidden');
    });
  });
}

/* ==========================================================================
   INTERACTIVE SILICON CIRCUIT CANVAS ANIMATION
   ========================================================================== */
function initCircuitCanvas() {
  const canvas = document.getElementById('circuit-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  const particleCount = 45;
  const maxDistance = 140;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Mouse tracking
  let mouse = { x: -1000, y: -1000 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
      this.isGate = Math.random() > 0.7; // some render as square silicon logic nodes
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse subtle pull
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        this.x -= (dx / dist) * 0.8;
        this.y -= (dy / dist) * 0.8;
      }
    }

    draw() {
      ctx.fillStyle = this.isGate ? '#06b6d4' : '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#06b6d4';

      if (this.isGate) {
        ctx.fillRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting circuit traces
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const alpha = (1 - distance / maxDistance) * 0.25;
          ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
          ctx.lineWidth = 1;

          // Manhattan-style circuit right angles
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   PROJECT FILTER ENGINE
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active styling
      filterBtns.forEach(b => {
        b.classList.remove('active', 'border-cyan-500', 'bg-cyan-500/20', 'text-cyan-300');
        b.classList.add('border-slate-800', 'bg-slate-900/60', 'text-slate-400');
      });

      btn.classList.add('active', 'border-cyan-500', 'bg-cyan-500/20', 'text-cyan-300');
      btn.classList.remove('border-slate-800', 'bg-slate-900/60', 'text-slate-400');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.classList.add('animate-fade-in');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   PROJECT DETAILS MODAL SYSTEM
   ========================================================================== */
const projectDetails = {
  raze: {
    title: 'RAZE - High Performance Repository',
    category: 'GitHub Open Source / Systems',
    subtitle: 'Maintained by Sachin Mehra (SachinMehra73/RAZE)',
    badge: 'Active Project',
    description: `RAZE represents Sachin Mehra's commitment to structured programming, clean modular architecture, and real-world software design. Built with rigorous version control on GitHub, RAZE explores algorithmic execution, state management, and streamlined workflows.`,
    highlights: [
      'Engineered with clear separation of concerns and reproducible modules.',
      'Active GitHub repository illustrating git commit hygiene and documentation standards.',
      'Designed to scale toward hardware-software co-simulation and systems experimentation.'
    ],
    techStack: ['Git / GitHub', 'Systems Architecture', 'Algorithmic Optimization', 'Modular Code'],
    link: 'https://github.com/SachinMehra73/RAZE'
  },
  alu: {
    title: '4-Bit Arithmetic Logic Unit (ALU)',
    category: 'Digital Logic & Computer Architecture',
    subtitle: 'VLSI & Microprocessor Core Component',
    badge: 'Hardware Logic',
    description: `Designed and simulated a functional 4-bit Arithmetic Logic Unit capable of performing fundamental arithmetic and boolean logic operations. Serves as a cornerstone for understanding Central Processing Unit (CPU) datapath execution and register transfers.`,
    highlights: [
      'Executes ADD, SUB, AND, OR, and XOR operations controlled by 3-bit opcodes.',
      'Includes carry generation, overflow detection, and zero-flag indicators.',
      'Simulated gate propagation delays and logic minimization via Karnaugh Maps.'
    ],
    techStack: ['Digital Electronics', 'Boolean Algebra', 'Combinational Logic', 'Computer Architecture'],
    link: 'https://github.com/SachinMehra73/RAZE'
  },
  sensor: {
    title: 'Embedded Microcontroller Sensor Hub',
    category: 'Embedded Systems & Telemetry',
    subtitle: 'Real-Time Hardware Interfacing',
    badge: 'Embedded Hardware',
    description: `Prototyped a responsive sensor hub interfacing multiple analog and digital peripherals to a central microcontroller. Focuses on low-power sensor polling, ADC conversion, and serialized telemetry transmission.`,
    highlights: [
      'Real-time analog signal conditioning and analog-to-digital conversion (ADC).',
      'UART communication stream for debugging and telemetry logging.',
      'Demonstrates hardware breadboard assembly and embedded firmware programming.'
    ],
    techStack: ['Embedded C', 'Microcontroller Interfacing', 'ADC / DAC', 'UART / Serial Protocol'],
    link: 'https://github.com/SachinMehra73/RAZE'
  },
  genai: {
    title: 'GenAI Hardware RTL Synthesizer',
    category: 'Generative AI & EDA Workflow',
    subtitle: 'Next-Gen Prompt Engineering for Digital Circuits',
    badge: 'AI in Engineering',
    description: `An experimental workflow leveraging Generative AI models (LLMs) to formulate synthesizable Verilog/HDL code, generate comprehensive testbenches, and catch structural race conditions in hardware designs.`,
    highlights: [
      'Structured prompt engineering strategies tailored for hardware logic generation.',
      'Automated testbench generation for combinational and sequential modules.',
      'Exploration of AI-assisted verification workflows in the modern semiconductor sector.'
    ],
    techStack: ['Generative AI', 'Prompt Engineering', 'HDL / Verilog Concepts', 'Hardware Verification'],
    link: 'https://github.com/SachinMehra73/RAZE'
  },
  foundry: {
    title: 'Silicon Foundry Manufacturing Flow',
    category: 'Semiconductor Fabrication',
    subtitle: 'From Ingot to Packaged Integrated Circuit',
    badge: 'Fab Process',
    description: `A comprehensive academic and visual case study on the semiconductor fabrication pipeline. Traces high-purity silicon crystal ingot growth (Czochralski process), wafer slicing, EUV photolithography, ion implantation, metallization, wafer dicing, and wire bonding.`,
    highlights: [
      'Deep dive into cleanroom standards (ISO Class 1) and contamination prevention.',
      'Photolithography mask alignment and nanometer scale resolution techniques.',
      'Comparison between planar MOSFETs and modern 3D FinFET/GAA architectures.'
    ],
    techStack: ['Semiconductor Physics', 'Photolithography', 'Nanotechnology', 'IC Packaging'],
    link: 'https://github.com/SachinMehra73/RAZE'
  }
};

window.openProjectModal = function(key) {
  const modal = document.getElementById('project-modal');
  const content = document.getElementById('modal-content');
  const data = projectDetails[key];
  if (!modal || !content || !data) return;

  content.innerHTML = `
    <div class="space-y-5">
      <div>
        <span class="inline-block px-2.5 py-1 rounded text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold mb-2">
          ${data.category}
        </span>
        <h3 class="text-2xl font-heading font-bold text-white">${data.title}</h3>
        <p class="text-xs font-mono text-cyan-400 mt-1">${data.subtitle}</p>
      </div>

      <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-300 leading-relaxed">
        ${data.description}
      </div>

      <div class="space-y-2">
        <h4 class="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">Key Highlights & Specifications:</h4>
        <ul class="space-y-2">
          ${data.highlights.map(h => `
            <li class="flex items-start gap-2 text-xs text-slate-300">
              <i data-lucide="check" class="w-4 h-4 text-cyan-400 shrink-0 mt-0.5"></i>
              <span>${h}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <div>
        <h4 class="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">Technologies & Domains:</h4>
        <div class="flex flex-wrap gap-1.5">
          ${data.techStack.map(t => `
            <span class="px-2.5 py-1 rounded bg-slate-800 text-cyan-300 text-xs font-mono border border-slate-700">${t}</span>
          `).join('')}
        </div>
      </div>

      <div class="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
        <button onclick="closeProjectModal()" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-mono transition-colors">
          Close
        </button>
        <a href="${data.link}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-semibold text-xs shadow-md shadow-cyan-500/20 hover:brightness-110 transition-all">
          <i data-lucide="github" class="w-3.5 h-3.5"></i>
          <span>Visit GitHub / Repo</span>
        </a>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
};

window.closeProjectModal = function() {
  const modal = document.getElementById('project-modal');
  if (modal) modal.classList.add('hidden');
};

// Close modal on Escape or backdrop click
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeProjectModal();
});

const modalContainer = document.getElementById('project-modal');
if (modalContainer) {
  modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer) closeProjectModal();
  });
}

/* ==========================================================================
   CLIPBOARD & TOAST SYSTEM
   ========================================================================== */
window.copyEmailToClipboard = function() {
  const email = 'sachinmehra00073@gmail.com';
  navigator.clipboard.writeText(email).then(() => {
    showToast('Email copied to clipboard: ' + email);
  }).catch(() => {
    showToast('Official Email: ' + email);
  });
};

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast) return;

  if (toastMsg) toastMsg.textContent = message;

  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 3500);
}

/* ==========================================================================
   CONTACT FORM SUBMISSION HANDLER
   ========================================================================== */
window.handleContactSubmit = function(event) {
  event.preventDefault();

  const name = document.getElementById('sender-name').value.trim();
  const email = document.getElementById('sender-email').value.trim();
  const subject = document.getElementById('sender-subject').value.trim();
  const message = document.getElementById('sender-message').value.trim();

  if (!name || !email || !subject || !message) {
    showToast('Please complete all form fields.');
    return;
  }

  // Construct mailto URL
  const recipient = 'sachinmehra00073@gmail.com';
  const mailSubject = encodeURIComponent(`[Portfolio Contact] ${subject} - from ${name}`);
  const mailBody = encodeURIComponent(
    `Hello Sachin,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n---\nSent via your portfolio website`
  );

  const mailtoUrl = `mailto:${recipient}?subject=${mailSubject}&body=${mailBody}`;

  showToast('Launching email client for sachinmehra00073@gmail.com...');
  
  // Trigger mailto link
  window.location.href = mailtoUrl;
};

/* ==========================================================================
   SCROLL SPY / NAV HIGHLIGHT
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('text-cyan-400', 'bg-slate-800/60');
            link.classList.remove('text-slate-300');
          } else {
            link.classList.remove('text-cyan-400', 'bg-slate-800/60');
            link.classList.add('text-slate-300');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   DYNAMIC CLOCK SPEED SIMULATION IN CHIP DIE
   ========================================================================== */
function initClockSimulation() {
  const clockEl = document.getElementById('clock-speed');
  if (!clockEl) return;

  setInterval(() => {
    const base = 3.20;
    const variation = (Math.random() * 0.14 - 0.07).toFixed(2);
    const speed = (base + parseFloat(variation)).toFixed(2);
    clockEl.textContent = `${speed} GHz`;
  }, 2500);
}
