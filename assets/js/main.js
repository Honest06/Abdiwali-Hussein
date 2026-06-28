/* =========================================
   MMIC - Midnimo Microfinance Institution
   Main JavaScript
   ========================================= */

(function () {
  'use strict';

  /* ===========================
     1. NAVBAR
  =========================== */
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  // Sticky / scroll effect
  function handleNavScroll() {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // Active link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ===========================
     2. ANIMATED COUNTERS
  =========================== */
  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-target'));
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = parseInt(el.getAttribute('data-duration')) || 2000;
    const decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals')) : 0;
    const start = 0;
    const startTime = performance.now();

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      const current = start + (target - start) * eased;

      if (decimals > 0) {
        el.textContent = prefix + current.toFixed(decimals) + suffix;
      } else {
        el.textContent = prefix + Math.round(current).toLocaleString() + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        if (decimals > 0) {
          el.textContent = prefix + target.toFixed(decimals) + suffix;
        } else {
          el.textContent = prefix + target.toLocaleString() + suffix;
        }
      }
    }

    requestAnimationFrame(tick);
  }

  /* ===========================
     3. INTERSECTION OBSERVER
  =========================== */
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  // Fade-up animations
  const fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-fade-up, .animate-fade-in').forEach(function (el) {
    fadeObserver.observe(el);
  });

  // Counter animation
  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(function (el) {
    counterObserver.observe(el);
  });

  // Progress bars
  const progressObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.getAttribute('data-width') || '0%';
        setTimeout(function () {
          fill.style.width = width;
        }, 200);
        progressObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.progress-fill, .dash-bar-fill').forEach(function (el) {
    progressObserver.observe(el);
  });

  /* ===========================
     4. MULTI-STEP APPLY FORM
  =========================== */
  const applyForm = document.getElementById('applyForm');
  if (applyForm) {
    const steps = applyForm.querySelectorAll('.form-step');
    const stepCircles = document.querySelectorAll('.step-circle');
    const stepItems = document.querySelectorAll('.step-item');
    const progressLine = document.querySelector('.step-progress-line');
    const progressBar = document.getElementById('applyProgressBar');
    let currentStep = 0;

    function updateStep(n) {
      steps.forEach(function (s, i) {
        s.classList.toggle('active', i === n);
      });

      stepItems.forEach(function (item, i) {
        item.classList.remove('active', 'completed');
        if (i === n) item.classList.add('active');
        if (i < n) item.classList.add('completed');

        const circle = item.querySelector('.step-circle');
        if (circle) {
          if (i < n) {
            circle.innerHTML = '<i class="fas fa-check"></i>';
          } else {
            circle.textContent = i + 1;
          }
        }
      });

      const pct = (n / (steps.length - 1)) * 80;
      if (progressLine) progressLine.style.width = pct + '%';
      if (progressBar) progressBar.style.width = ((n + 1) / steps.length * 100) + '%';

      currentStep = n;
      window.scrollTo({ top: applyForm.offsetTop - 120, behavior: 'smooth' });
    }

    function validateStep(stepIndex) {
      const step = steps[stepIndex];
      if (!step) return true;
      const required = step.querySelectorAll('[required]');
      let valid = true;

      required.forEach(function (field) {
        const err = field.parentNode.querySelector('.form-error');
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#e53e3e';
          if (err) { err.style.display = 'block'; }
        } else {
          field.style.borderColor = '';
          if (err) { err.style.display = 'none'; }
        }
      });

      return valid;
    }

    // Next buttons
    document.querySelectorAll('.btn-next').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (validateStep(currentStep)) {
          if (currentStep < steps.length - 1) {
            updateStep(currentStep + 1);
          }
        }
      });
    });

    // Back buttons
    document.querySelectorAll('.btn-back').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (currentStep > 0) updateStep(currentStep - 1);
      });
    });

    updateStep(0);

    // Build review
    const reviewBtn = document.getElementById('buildReview');
    if (reviewBtn) {
      reviewBtn.addEventListener('click', function () {
        buildReview();
      });
    }

    function buildReview() {
      const reviewContainer = document.getElementById('reviewContent');
      if (!reviewContainer) return;

      const fields = {
        'Full Name': document.getElementById('fullName'),
        'Gender': document.getElementById('gender'),
        'Age': document.getElementById('age'),
        'ID Number': document.getElementById('idNumber'),
        'Phone': document.getElementById('phone'),
        'Email': document.getElementById('email'),
        'Location': document.getElementById('location'),
        'Business Name': document.getElementById('businessName'),
        'Business Type': document.getElementById('businessType'),
        'Years in Operation': document.getElementById('yearsOp'),
        'Monthly Revenue': document.getElementById('monthlyRevenue'),
        'Finance Product': document.getElementById('financeProduct'),
        'Amount Requested': document.getElementById('amountRequested'),
        'Loan Purpose': document.getElementById('loanPurpose'),
        'Collateral/Guarantor': document.getElementById('collateral')
      };

      let html = '';
      for (const [label, el] of Object.entries(fields)) {
        if (el && el.value) {
          html += '<div class="review-row"><span>' + label + '</span><span>' + el.value + '</span></div>';
        }
      }

      reviewContainer.innerHTML = html;
    }

    // Final submit
    const submitBtn = document.getElementById('submitApplication');
    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        const name = document.getElementById('fullName') ? document.getElementById('fullName').value : '';
        const phone = document.getElementById('phone') ? document.getElementById('phone').value : '';
        const email = document.getElementById('email') ? document.getElementById('email').value : '';
        const product = document.getElementById('financeProduct') ? document.getElementById('financeProduct').value : '';
        const amount = document.getElementById('amountRequested') ? document.getElementById('amountRequested').value : '';
        const purpose = document.getElementById('loanPurpose') ? document.getElementById('loanPurpose').value : '';

        // WhatsApp link
        const msg = encodeURIComponent(
          'Hello MMIC! I would like to apply for financing.\n\n' +
          'Name: ' + name + '\n' +
          'Phone: ' + phone + '\n' +
          'Product: ' + product + '\n' +
          'Amount: $' + amount + '\n' +
          'Purpose: ' + purpose
        );

        const waLink = 'https://wa.me/252XXXXXXXXX?text=' + msg;

        // Show success and offer WhatsApp
        const successMsg = document.getElementById('applySuccess');
        if (successMsg) {
          successMsg.style.display = 'block';
          successMsg.innerHTML = '<i class="fas fa-check-circle" style="color:#27AE60;margin-right:.5rem;"></i> Your application has been prepared! <a href="' + waLink + '" target="_blank" style="color:var(--green);font-weight:700;">Click here to send via WhatsApp</a> or <a href="mailto:info@mmic.so?subject=Financing Application - ' + name + '&body=' + encodeURIComponent('Name: ' + name + '\nPhone: ' + phone + '\nEmail: ' + email + '\nProduct: ' + product + '\nAmount: $' + amount + '\nPurpose: ' + purpose) + '" style="color:var(--navy);font-weight:700;">send by email</a>.';
        }

        window.scrollTo({ top: submitBtn.offsetTop - 150, behavior: 'smooth' });
      });
    }
  }

  /* ===========================
     5. SERVICES FILTER
  =========================== */
  const filterTabs = document.querySelectorAll('.filter-tab');
  if (filterTabs.length > 0) {
    filterTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        filterTabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');

        const filter = tab.getAttribute('data-filter');
        const cards = document.querySelectorAll('.service-detail-card');

        cards.forEach(function (card) {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = '';
            card.style.animation = 'fadeInUp 0.4s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ===========================
     6. FAQ ACCORDION
  =========================== */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = btn.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-question').forEach(function (q) {
        q.classList.remove('open');
        const a = q.closest('.faq-item').querySelector('.faq-answer');
        if (a) a.classList.remove('open');
      });

      // Open clicked
      if (!isOpen) {
        btn.classList.add('open');
        if (answer) answer.classList.add('open');
      }
    });
  });

  /* ===========================
     7. WHATSAPP BUTTON
  =========================== */
  const waBtn = document.getElementById('whatsappBtn');
  if (waBtn) {
    const msg = encodeURIComponent('Hello MMIC, I would like to inquire about your financing products.');
    waBtn.href = 'https://wa.me/252XXXXXXXXX?text=' + msg;
  }

  /* ===========================
     8. SCROLL TO TOP
  =========================== */
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===========================
     9. CONTACT FORM
  =========================== */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      contactForm.querySelectorAll('[required]').forEach(function (field) {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#e53e3e';
        } else {
          field.style.borderColor = '';
        }
      });

      if (valid) {
        const name = contactForm.querySelector('[name="name"]') ? contactForm.querySelector('[name="name"]').value : '';
        const email = contactForm.querySelector('[name="email"]') ? contactForm.querySelector('[name="email"]').value : '';
        const subject = contactForm.querySelector('[name="subject"]') ? contactForm.querySelector('[name="subject"]').value : '';
        const message = contactForm.querySelector('[name="message"]') ? contactForm.querySelector('[name="message"]').value : '';

        window.location.href = 'mailto:info@mmic.so?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);

        const success = document.getElementById('contactSuccess');
        if (success) {
          success.classList.add('show');
          setTimeout(function () { success.classList.remove('show'); }, 6000);
        }

        contactForm.reset();
      }
    });
  }

  /* ===========================
     10. NEWS CATEGORY FILTER
  =========================== */
  const newsTabs = document.querySelectorAll('.news-filter-tab');
  if (newsTabs.length > 0) {
    newsTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        newsTabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');

        const filter = tab.getAttribute('data-filter');
        const cards = document.querySelectorAll('.news-card');

        cards.forEach(function (card) {
          const cat = card.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            card.style.display = '';
            card.style.animation = 'fadeInUp 0.35s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ===========================
     PARTNERSHIP FORM
  =========================== */
  const partnerForm = document.getElementById('partnerForm');
  if (partnerForm) {
    partnerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      partnerForm.querySelectorAll('[required]').forEach(function (field) {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#e53e3e';
        } else {
          field.style.borderColor = '';
        }
      });

      if (valid) {
        const success = document.getElementById('partnerSuccess');
        if (success) {
          success.classList.add('show');
          success.textContent = 'Thank you for your partnership inquiry. Our team will contact you within 2 business days.';
        }
        partnerForm.reset();
      }
    });
  }

  /* ===========================
     CAREER APPLICATION FORM
  =========================== */
  const careerForm = document.getElementById('careerForm');
  if (careerForm) {
    careerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      careerForm.querySelectorAll('[required]').forEach(function (field) {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#e53e3e';
        } else {
          field.style.borderColor = '';
        }
      });

      if (valid) {
        const name = careerForm.querySelector('[name="applicantName"]') ? careerForm.querySelector('[name="applicantName"]').value : '';
        const pos = careerForm.querySelector('[name="position"]') ? careerForm.querySelector('[name="position"]').value : 'Position';
        const email = careerForm.querySelector('[name="applicantEmail"]') ? careerForm.querySelector('[name="applicantEmail"]').value : '';

        window.location.href = 'mailto:careers@mmic.so?subject=' + encodeURIComponent('Job Application: ' + pos + ' - ' + name) + '&body=' + encodeURIComponent('Applicant: ' + name + '\nEmail: ' + email + '\nPosition: ' + pos);

        const success = document.getElementById('careerSuccess');
        if (success) {
          success.classList.add('show');
          success.textContent = 'Application submitted! We will review your application and contact you soon.';
        }
        careerForm.reset();
      }
    });
  }

  /* ===========================
     NEWSLETTER FORMS
  =========================== */
  document.querySelectorAll('.newsletter-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      if (input && input.value.trim()) {
        const btn = form.querySelector('.newsletter-btn');
        if (btn) {
          btn.textContent = 'Subscribed!';
          btn.style.background = '#4ade80';
          setTimeout(function () {
            btn.textContent = 'Subscribe';
            btn.style.background = '';
            input.value = '';
          }, 3000);
        }
      }
    });
  });

  /* ===========================
     SMOOTH SCROLL FOR ANCHORS
  =========================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 90;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

})();

/* =============================================
   MMIC EXTENDED JAVASCRIPT
   ============================================= */

/* === MOBILE MENU (updated selector) === */
(function() {
  const hamburgerBtn = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', function () {
      hamburgerBtn.classList.toggle('active');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });
    document.addEventListener('click', function (e) {
      if (navMenu.classList.contains('open') && !e.target.closest('.navbar')) {
        navMenu.classList.remove('open');
        hamburgerBtn.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    navMenu.querySelectorAll('.nav-link').forEach(function(link) {
      link.addEventListener('click', function() {
        navMenu.classList.remove('open');
        hamburgerBtn.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
})();

/* === SCROLL TO TOP === */
(function() {
  const scrollBtn = document.getElementById('scrollTop');
  if (!scrollBtn) return;
  window.addEventListener('scroll', function () {
    scrollBtn.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });
  scrollBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* === ANIMATED COUNTERS (additional elements) === */
(function() {
  function animateCounter(el) {
    const raw = el.getAttribute('data-count');
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    if (!raw) return;
    const target = parseFloat(raw);
    const isDecimal = raw.includes('.');
    const duration = 2000;
    const start = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.round(current).toLocaleString()) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = '1';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('[data-count]').forEach(function(el) {
    observer.observe(el);
  });
})();

/* === SCROLL ANIMATIONS === */
(function() {
  const animEls = document.querySelectorAll('.animate-on-scroll');
  if (!animEls.length) return;
  const obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry, i) {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 0;
        setTimeout(function() {
          entry.target.classList.add('visible');
        }, parseInt(delay));
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  animEls.forEach(function(el) { obs.observe(el); });
})();

/* === SERVICES FILTER TABS === */
(function() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.service-full-card');
  if (!tabs.length) return;
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      const filter = tab.getAttribute('data-filter');
      cards.forEach(function(card) {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* === NEWS CATEGORY FILTER === */
(function() {
  const filterBtns = document.querySelectorAll('.news-filter-btn');
  const articles = document.querySelectorAll('.news-article');
  if (!filterBtns.length) return;
  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      filterBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      const filter = btn.getAttribute('data-nfilter');
      articles.forEach(function(article) {
        if (filter === 'all' || article.getAttribute('data-ncategory') === filter) {
          article.style.display = '';
        } else {
          article.style.display = 'none';
        }
      });
    });
  });
})();

/* === FAQ ACCORDION === */
(function() {
  const questions = document.querySelectorAll('.faq-question');
  questions.forEach(function(q) {
    q.addEventListener('click', function() {
      const answer = q.nextElementSibling;
      const isOpen = q.classList.contains('open');
      questions.forEach(function(other) {
        other.classList.remove('open');
        if (other.nextElementSibling) other.nextElementSibling.classList.remove('open');
      });
      if (!isOpen) {
        q.classList.add('open');
        if (answer) answer.classList.add('open');
      }
    });
  });
})();

/* === MULTI-STEP APPLY FORM === */
var currentStep = 1;
var formData = {};

function nextStep(step) {
  if (!validateStep(step)) return;
  collectStep(step);
  currentStep = step + 1;
  showStep(currentStep);
  if (currentStep === 4) buildReview();
}

function prevStep(step) {
  currentStep = step - 1;
  showStep(currentStep);
}

function showStep(num) {
  document.querySelectorAll('.apply-step').forEach(function(s) { s.classList.add('hidden'); });
  var el = document.getElementById('step' + num);
  if (el) el.classList.remove('hidden');
  var fill = document.getElementById('apProgressFill');
  if (fill) fill.style.width = (num * 25) + '%';
  document.querySelectorAll('.ap-step').forEach(function(s) {
    var sNum = parseInt(s.getAttribute('data-step'));
    s.classList.remove('active', 'completed');
    if (sNum === num) s.classList.add('active');
    if (sNum < num) s.classList.add('completed');
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateStep(step) {
  var stepEl = document.getElementById('step' + step);
  if (!stepEl) return true;
  var required = stepEl.querySelectorAll('[required]');
  var valid = true;
  required.forEach(function(field) {
    if (!field.value.trim()) {
      field.style.borderColor = '#E53E3E';
      valid = false;
      field.addEventListener('input', function() { field.style.borderColor = ''; }, { once: true });
    }
  });
  if (!valid) {
    var first = stepEl.querySelector('[required]:invalid, [required][style*="E53E3E"]');
    if (first) first.focus();
  }
  return valid;
}

function collectStep(step) {
  var stepEl = document.getElementById('step' + step);
  if (!stepEl) return;
  stepEl.querySelectorAll('input, select, textarea').forEach(function(f) {
    if (f.name) formData[f.name] = f.value;
  });
}

function buildReview() {
  var box = document.getElementById('reviewBox');
  if (!box) return;
  box.innerHTML = '<div class="review-section"><h4>Personal Information</h4>' +
    row('Full Name', formData.fullName) + row('Gender', formData.gender) + row('Age', formData.age) +
    row('Phone', formData.phone) + row('Location', formData.city + ', ' + formData.district) + row('Branch', formData.branch) +
    '</div><div class="review-section"><h4>Business Details</h4>' +
    row('Business Name', formData.bizName || 'N/A') + row('Business Type', formData.bizType) +
    row('Years Operating', formData.yearsOp) + row('Monthly Revenue', formData.monthlyRevenue) +
    '</div><div class="review-section"><h4>Financing Request</h4>' +
    row('Product', formData.product) + row('Amount', formData.amount) +
    row('Purpose', formData.purpose) + row('Repayment', formData.repayment) + row('Collateral', formData.guarantor || 'Not specified') +
    '</div>';
}

function row(label, val) {
  return '<div class="review-item"><strong>' + label + ':</strong><span>' + (val || '—') + '</span></div>';
}

function submitApplyForm() {
  var decl = document.getElementById('aDeclaration');
  if (decl && !decl.checked) { alert('Please confirm the declaration before submitting.'); return; }
  collectStep(4);
  var msg = 'Hello MMIC, I would like to apply for financing.\n\n' +
    'Name: ' + (formData.fullName || '') + '\n' +
    'Phone: ' + (formData.phone || '') + '\n' +
    'Product: ' + (formData.product || '') + '\n' +
    'Amount: ' + (formData.amount || '') + '\n' +
    'Branch: ' + (formData.branch || '') + '\n' +
    'Business: ' + (formData.bizType || '') + '\n\n' +
    'Please contact me to proceed.';
  window.open('https://wa.me/252XXXXXXXXX?text=' + encodeURIComponent(msg), '_blank');
  document.querySelectorAll('.apply-step').forEach(function(s) { s.classList.add('hidden'); });
  var s5 = document.getElementById('step5');
  if (s5) s5.classList.remove('hidden');
}

/* === CONTACT FORM === */
function submitContactForm(e) {
  e.preventDefault();
  var form = e.target;
  var name = form.querySelector('#ctName') ? form.querySelector('#ctName').value : '';
  var email = form.querySelector('#ctEmail') ? form.querySelector('#ctEmail').value : '';
  var subject = form.querySelector('#ctSubject') ? form.querySelector('#ctSubject').value : '';
  var message = form.querySelector('#ctMessage') ? form.querySelector('#ctMessage').value : '';
  var mailtoLink = 'mailto:info@mmic.so?subject=' + encodeURIComponent('[MMIC Website] ' + subject) +
    '&body=' + encodeURIComponent('From: ' + name + ' <' + email + '>\n\n' + message);
  window.location.href = mailtoLink;
  var success = document.getElementById('contactFormSuccess');
  if (success) { success.style.display = 'flex'; form.reset(); }
}

/* === PARTNER FORM === */
function submitPartnerForm(e) {
  e.preventDefault();
  var form = e.target;
  var org = form.querySelector('#pOrgName') ? form.querySelector('#pOrgName').value : '';
  var contact = form.querySelector('#pContactName') ? form.querySelector('#pContactName').value : '';
  var email = form.querySelector('#pEmail') ? form.querySelector('#pEmail').value : '';
  var type = form.querySelector('#pPartnershipType') ? form.querySelector('#pPartnershipType').value : '';
  var message = form.querySelector('#pMessage') ? form.querySelector('#pMessage').value : '';
  var mailtoLink = 'mailto:partnerships@mmic.so?subject=' + encodeURIComponent('[Partnership Inquiry] ' + org) +
    '&body=' + encodeURIComponent('Organization: ' + org + '\nContact: ' + contact + '\nEmail: ' + email + '\nPartnership Type: ' + type + '\n\n' + message);
  window.location.href = mailtoLink;
  var success = document.getElementById('partnerFormSuccess');
  if (success) { success.style.display = 'flex'; form.reset(); }
}

/* === CAREER FORM === */
function submitCareerForm(e) {
  e.preventDefault();
  var form = e.target;
  var name = form.querySelector('#cFullName') ? form.querySelector('#cFullName').value : '';
  var position = form.querySelector('#cPosition') ? form.querySelector('#cPosition').value : '';
  var email = form.querySelector('#cEmail') ? form.querySelector('#cEmail').value : '';
  var phone = form.querySelector('#cPhone') ? form.querySelector('#cPhone').value : '';
  var coverLetter = form.querySelector('#cCoverLetter') ? form.querySelector('#cCoverLetter').value : '';
  var mailtoLink = 'mailto:careers@mmic.so?subject=' + encodeURIComponent('[Application] ' + position + ' – ' + name) +
    '&body=' + encodeURIComponent('Name: ' + name + '\nPosition: ' + position + '\nEmail: ' + email + '\nPhone: ' + phone + '\n\nCover Letter:\n' + coverLetter);
  window.location.href = mailtoLink;
  var success = document.getElementById('careerFormSuccess');
  if (success) { success.style.display = 'flex'; form.reset(); }
}

/* === NEWSLETTER === */
function submitNewsletter(e) {
  e.preventDefault();
  var email = e.target.querySelector('input[type="email"]');
  if (email) {
    alert('Thank you for subscribing! We will send our quarterly updates to ' + email.value);
    e.target.reset();
  }
}
