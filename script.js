document.addEventListener('DOMContentLoaded', () => {


  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1400);
    document.body.style.overflow = 'hidden';
  }

  
  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

 
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
      
      const spans = hamburger.querySelectorAll('span');
      if (open) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });

  
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => {
          s.style.transform = ''; s.style.opacity = '';
        });
      });
    });
  }

  
  const currentPage = window.location.pathname.split('/').pop() || 'main.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'main.html')) {
      a.classList.add('active');
    }
  });


  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  }

  
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    heroBg.classList.add('loaded');
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroBg.style.transform = `scale(1) translateY(${scrolled * 0.3}px)`;
    }, { passive: true });
  }

  
  const track = document.querySelector('.marquee-track');
  if (track) {
    track.innerHTML += track.innerHTML;
  }

  const cursor     = document.createElement('div');
  const cursorDot  = document.createElement('div');
  cursor.id    = 'cursor';
  cursorDot.id = 'cursor-dot';

  cursor.style.cssText = `
    position: fixed; width: 32px; height: 32px;
    border: 1.5px solid rgba(200,146,42,0.7);
    border-radius: 50%; pointer-events: none; z-index: 99999;
    transform: translate(-50%,-50%);
    transition: width 0.3s, height 0.3s, opacity 0.3s, background 0.3s;
    mix-blend-mode: difference;
    display: none;
  `;

  cursorDot.style.cssText = `
    position: fixed; width: 5px; height: 5px;
    background: var(--gold, #C8922A); border-radius: 50%;
    pointer-events: none; z-index: 99999;
    transform: translate(-50%,-50%);
    transition: transform 0.1s;
    display: none;
  `;

  document.body.appendChild(cursor);
  document.body.appendChild(cursorDot);


  if (window.matchMedia('(pointer: fine)').matches) {
    cursor.style.display = 'block';
    cursorDot.style.display = 'block';

    let mx = 0, my = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursorDot.style.left = mx + 'px';
      cursorDot.style.top  = my + 'px';
    });

    const animateCursor = () => {
      cx += (mx - cx) * 0.15;
      cy += (my - cy) * 0.15;
      cursor.style.left = cx + 'px';
      cursor.style.top  = cy + 'px';
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    document.querySelectorAll('a, button, .card, .item-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width   = '52px';
        cursor.style.height  = '52px';
        cursor.style.background = 'rgba(200,146,42,0.1)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width   = '32px';
        cursor.style.height  = '32px';
        cursor.style.background = 'transparent';
      });
    });
  }

  
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    let current = 0;
    const step  = Math.ceil(target / 60);
    const suffix = el.dataset.suffix || '';
    const timer  = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current.toLocaleString() + suffix;
      if (current >= target) clearInterval(timer);
    }, 25);
  }

  const statNums = document.querySelectorAll('.stat-num[data-count]');
  if (statNums.length) {
    const sio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          sio.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    statNums.forEach(el => sio.observe(el));
  }

 
  document.querySelectorAll('img[data-src]').forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.6s ease';

    const imgObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          img.src = img.dataset.src;
          img.onload = () => { img.style.opacity = '1'; };
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    imgObserver.observe(img);
  });

  const links = document.querySelectorAll('a[href]');
  const transition = document.getElementById('page-transition');

  if (transition) {
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('http') && href.endsWith('.html')) {
        link.addEventListener('click', e => {
          e.preventDefault();
          transition.classList.add('active');
          setTimeout(() => { window.location.href = href; }, 400);
        });
      }
    });

    window.addEventListener('pageshow', () => {
      setTimeout(() => transition.classList.remove('active'), 100);
    });
  }

});

const style = document.createElement('style');
style.textContent = `
  #page-transition {
    position: fixed;
    inset: 0;
    background: var(--charcoal, #1C1410);
    z-index: 99998;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.4s ease;
  }
  #page-transition.active {
    opacity: 1;
    pointer-events: all;
  }
`;
document.head.appendChild(style);


document.addEventListener('DOMContentLoaded', () => {
  const t = document.createElement('div');
  t.id = 'page-transition';
  document.body.appendChild(t);
});
