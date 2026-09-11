// Ambient Floating Cyber Embers / Particles
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width = 0;
  let height = 0;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  const PARTICLE_COUNT = Math.min(45, Math.floor(window.innerWidth / 25));
  const colors = [
    'rgba(168, 85, 247, ',   // neon purple
    'rgba(236, 72, 153, ',   // neon pink
    'rgba(121, 40, 202, ',   // violet
    'rgba(99, 102, 241, '    // indigo
  ];

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.size = Math.random() * 2.2 + 0.8;
      this.speedY = -(Math.random() * 0.6 + 0.2);
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.baseAlpha = Math.random() * 0.6 + 0.2;
      this.alpha = this.baseAlpha;
      this.colorBase = colors[Math.floor(Math.random() * colors.length)];
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulseVal = Math.random() * Math.PI * 2;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.pulseVal += this.pulseSpeed;
      this.alpha = this.baseAlpha * (0.6 + 0.4 * Math.sin(this.pulseVal));

      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset(false);
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.colorBase + this.alpha + ')';
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.colorBase + '0.8)';
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let p of particles) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
})();

// Toast Notification System
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
let toastTimer = null;

function showToast(message, iconClass = 'fa-solid fa-circle-check') {
  if (!toast) return;
  toastMessage.textContent = message;
  const icon = toast.querySelector('.toast-icon i');
  if (icon) {
    icon.className = iconClass;
  }
  toast.classList.add('show');
  
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

// Copy to Clipboard Buttons
document.querySelectorAll('[data-copy]').forEach((btn) => {
  btn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const textToCopy = btn.getAttribute('data-copy');
    if (!textToCopy) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for older browsers / insecure context
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      // Visual button feedback
      const originalHtml = btn.innerHTML;
      btn.style.transform = 'scale(0.92)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 150);

      // Informative Toast
      if (textToCopy.includes('@proton.me')) {
        showToast('Copied email: ' + textToCopy + ' 🌶️');
      } else if (textToCopy === '66pepper99') {
        showToast('Copied 66pepper99 to clipboard! 🌶️');
      } else {
        showToast('Copied "' + textToCopy + '" to clipboard! ✨');
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
      showToast('Could not copy to clipboard', 'fa-solid fa-triangle-exclamation');
    }
  });
});

// Share Button
const shareBtn = document.getElementById('share-page-btn');
if (shareBtn) {
  shareBtn.addEventListener('click', async () => {
    const shareData = {
      title: '𝖕𝖊𝖕𝖕𝖊𝖗 | @66pepper99',
      text: 'Check out pepper\'s official links!',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyPageUrl();
        }
      }
    } else {
      copyPageUrl();
    }
  });
}

function copyPageUrl() {
  try {
    navigator.clipboard.writeText(window.location.href);
    showToast('Page link copied to clipboard! 🔗');
  } catch (err) {
    showToast('Page link: ' + window.location.href);
  }
}

// Subtle 3D Card Tilt on Desktop
const card = document.getElementById('profile-card');
if (card && window.matchMedia('(pointer: fine)').matches) {
  const handleMouseMove = (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
  };

  const handleMouseLeave = () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  };

  card.addEventListener('mousemove', handleMouseMove);
  card.addEventListener('mouseleave', handleMouseLeave);
}
