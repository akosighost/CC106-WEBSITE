'use strict';

/**
 * Navbar Toggle Logic Controller
 */
document.addEventListener("DOMContentLoaded", () => {
  const navOpenBtn = document.querySelector("[data-menu-open-btn]");
  const navCloseBtn = document.querySelector("[data-menu-close-btn]");
  const navbar = document.querySelector("[data-navbar]");
  const overlay = document.querySelector("[data-overlay]");

  const navElemArr = [navOpenBtn, navCloseBtn, overlay];

  navElemArr.forEach(elem => {
    if (elem) {
      elem.addEventListener("click", () => {
        navbar.classList.toggle("active");
        overlay.classList.toggle("active");
        document.body.classList.toggle("active");
      });
    }
  });
});

/**
 * Header Sticky & Scroll To Top Trackers
 */
const header = document.querySelector("[data-header]");
const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", () => {
  if (header) {
    window.scrollY >= 10 ? header.classList.add("active") : header.classList.remove("active");
  }
  if (goTopBtn) {
    window.scrollY >= 500 ? goTopBtn.classList.add("active") : goTopBtn.classList.remove("active");
  }
});

/*-----------------------------------*\
 * #CORE PRODUCTION DATABASE AUTHENTICATION & ENGINE
\*-----------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  // Select All Core Modals & Form Elements
  const signinBtn = document.getElementById('signin-btn');
  const signinModal = document.getElementById('signin-modal-overlay');
  const closeSigninBtn = document.getElementById('close-signin-btn');
  const loginForm = document.getElementById('login-form');

  const signupModal = document.getElementById('signup-modal-overlay');
  const closeSignupBtn = document.getElementById('close-signup-btn');
  const signupForm = document.getElementById('signup-form');

  const resetModal = document.getElementById('reset-modal-overlay');
  const closeResetBtn = document.getElementById('close-reset-btn');
  const resetForm = document.getElementById('reset-password-form');

  const profileModal = document.getElementById('user-profile-modal-overlay');
  const closeProfileBtn = document.getElementById('close-profile-modal-btn');
  const signoutBtn = document.getElementById('profile-signout-btn');
  const profilePasswordInput = document.getElementById('profile-card-password');
  const profilePasswordToggle = document.getElementById('profile-password-toggle-icon');

  const userToken = localStorage.getItem("userToken");
  const storedUsername = localStorage.getItem("username") || "User";

  // A. URL PARAMS CHECK FOR RESET TOKEN
  const urlParams = new URLSearchParams(window.location.search);
  const resetToken = urlParams.get('token');
  if (resetToken && resetModal) {
    const hiddenInput = document.getElementById('reset-token-hidden');
    if (hiddenInput) hiddenInput.value = resetToken;
    resetModal.classList.add('active');
  }

  // B. RENDER ACCOUNT STATUS MATRIX
  if (userToken && signinBtn) {
    signinBtn.className = "btn btn-secondary profile-nav-btn";
    signinBtn.style.borderColor = "var(--citrine)";
    signinBtn.style.padding = "10px 20px";
    signinBtn.style.textTransform = "none";
    signinBtn.innerHTML = `
      <ion-icon name="person-circle-outline" style="font-size: 20px; color: var(--citrine); display: inline-block; vertical-align: middle; margin-right: 5px;"></ion-icon>
      <span style="display: inline-block; vertical-align: middle;">${storedUsername}</span>
    `;

    signinBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (profileModal) {
        document.getElementById('profile-card-username').textContent = localStorage.getItem("username");
        document.getElementById('profile-card-email').textContent = localStorage.getItem("userEmail") || "test@gmail.com";
        document.getElementById('profile-card-password').value = localStorage.getItem("userPassword") || "password123";
        profileModal.classList.add('active');
      }
    });
  } else if (signinBtn && signinModal) {
    signinBtn.addEventListener('click', (e) => {
      e.preventDefault();
      signinModal.classList.add('active');
    });
  }

  // C. MODAL TRANSITION SWITCHES & INTERACTION TRIGGERS
  document.querySelector('.signup-prompt a')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (signinModal) signinModal.classList.remove('active');
    if (signupModal) signupModal.classList.add('active');
  });

  if (closeSigninBtn && signinModal) {
    closeSigninBtn.addEventListener('click', () => signinModal.classList.remove('active'));
  }
  if (closeSignupBtn && signupModal) {
    closeSignupBtn.addEventListener('click', () => signupModal.classList.remove('active'));
  }
  if (closeProfileBtn && profileModal) {
    closeProfileBtn.addEventListener('click', () => profileModal.classList.remove('active'));
  }
  if (closeResetBtn && resetModal) {
    closeResetBtn.addEventListener('click', () => resetModal.classList.remove('active'));
  }

  // Close modals when clicking on background overlays
  [signinModal, signupModal, profileModal, resetModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    }
  });

  // D. FORGOT PASSWORD SIMULATION INTERCEPT
  document.querySelector('.forgot-password-wrapper a')?.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = prompt("Enter your registered email address:");
    if (!email) return;

    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      alert(data.message);
      if (response.ok) {
        window.location.href = data.resetLink;
      }
    } catch (err) {
      alert("Error processing password recovery lookup loop.");
    }
  });

  // E. LIVE LOGIN SUBMISSION PIPELINE
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]').value.trim();
      const password = document.getElementById('login-password').value;
      const submitBtn = this.querySelector('button[type="submit"]');

      try {
        submitBtn.textContent = "Signing In...";
        submitBtn.disabled = true;

        const response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("userToken", data.token);
          localStorage.setItem("username", data.username);
          localStorage.setItem("userEmail", data.email);
          localStorage.setItem("userPassword", data.password);
          window.location.reload();
        } else {
          alert(data.message || "Invalid account matching verification.");
          submitBtn.textContent = "Sign In";
          submitBtn.disabled = false;
        }
      } catch (error) {
        alert("Failed communicating with background Node server. Ensure it's running!");
        submitBtn.textContent = "Sign In";
        submitBtn.disabled = false;
      }
    });
  }

  // F. LIVE SIGN UP RECRUITMENT PIPELINE
  if (signupForm) {
    signupForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const username = document.getElementById('signup-username').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value;

      try {
        const response = await fetch("http://localhost:5000/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();
        alert(data.message);
        if (response.ok) {
          if (signupModal) signupModal.classList.remove('active');
          if (signinModal) signinModal.classList.add('active');
        }
      } catch (err) {
        alert("Registration server pipeline connection fault.");
      }
    });
  }

  // G. LIVE PASSWORD RESET SUBMISSION
  if (resetForm) {
    resetForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const token = document.getElementById('reset-token-hidden').value;
      const newPassword = document.getElementById('reset-new-password').value;

      try {
        const response = await fetch("http://localhost:5000/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword })
        });
        const data = await response.json();
        alert(data.message);
        if (response.ok) {
          window.location.href = "index.html";
        }
      } catch (err) {
        alert("Error updating password record details.");
      }
    });
  }

  // H. ACCOUNT LOGOUT CONTROLLER
  if (signoutBtn) {
    signoutBtn.addEventListener('click', () => {
      localStorage.clear();
      window.location.reload();
    });
  }

  // I. SECURED PROFILE EYE TOGGLE VISIBILITY
  if (profilePasswordToggle && profilePasswordInput) {
    profilePasswordToggle.addEventListener('click', function() {
      if (profilePasswordInput.type === 'password') {
        profilePasswordInput.type = 'text';
        this.setAttribute('name', 'eye-off-outline');
      } else {
        profilePasswordInput.type = 'password';
        this.setAttribute('name', 'eye-outline');
      }
    });
  }
});

/*-----------------------------------*\
 * #LOGIN FORM INPUT ELEMENT VISIBILITY TOGGLE
\*-----------------------------------*/
document.addEventListener('DOMContentLoaded', function() {
  const passwordInput = document.getElementById('login-password');
  const toggleIcon = document.getElementById('password-toggle-icon');

  if (toggleIcon && passwordInput) {
    toggleIcon.addEventListener('click', function() {
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        this.setAttribute('name', 'eye-off-outline');
      } else {
        passwordInput.type = 'password';
        this.setAttribute('name', 'eye-outline');
      }
    });
  }
});

/*-----------------------------------*\
 * #REVIEW RATING CALCULATOR
\*-----------------------------------*/
document.addEventListener('DOMContentLoaded', function() {
  function calculateAverageRating() {
    const cards = document.querySelectorAll('.review-card[data-rating]');
    const totalCards = cards.length;
    let totalScore = 0;
    let starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  
    cards.forEach(card => {
      const ratingAttr = card.getAttribute('data-rating');
      const rating = ratingAttr ? parseFloat(ratingAttr) : 0;
      
      if (!isNaN(rating) && rating > 0) {
        totalScore += rating;
        let roundedRating = Math.round(rating); 
        if(roundedRating < 1) roundedRating = 1;
        if(roundedRating > 5) roundedRating = 5;
        
        starCounts[roundedRating]++;

        const starContainer = card.querySelector('.rating-wrapper');
        if (starContainer) {
            let cardStarHTML = '';
            for (let i = 1; i <= 5; i++) {
                if (rating >= i) {
                    cardStarHTML += '<ion-icon name="star"></ion-icon>';
                } else if (rating >= i - 0.5) {
                    cardStarHTML += '<ion-icon name="star-half-outline"></ion-icon>';
                } else {
                    cardStarHTML += '<ion-icon name="star-outline"></ion-icon>';
                }
            }
            starContainer.innerHTML = cardStarHTML;
        }
      }
    });
  }
  calculateAverageRating();

  // Sorting Functionality
  const filterButtons = document.querySelectorAll('.filter-btn[data-sort]');
  const reviewGrid = document.querySelector('.review-grid');

  if (filterButtons.length > 0 && reviewGrid) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        filterButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    
        const sortType = this.getAttribute('data-sort');
        const cardsArr = Array.from(document.querySelectorAll('.review-card'));
    
        cardsArr.sort((a, b) => {
          const ratingA = parseFloat(a.getAttribute('data-rating')) || 0;
          const ratingB = parseFloat(b.getAttribute('data-rating')) || 0;
          return sortType === 'highest' ? ratingB - ratingA : ratingA - ratingB;
        });
    
        reviewGrid.innerHTML = '';
        cardsArr.forEach(card => reviewGrid.appendChild(card));
      });
    });
  }

  // See More Control Bounds
  const cardsElements = document.querySelectorAll('.review-card');
  cardsElements.forEach(card => {
    const text = card.querySelector('.review-text');
    const btn = card.querySelector('.see-more-btn');

    if (text && btn) {
      if (text.scrollHeight > text.clientHeight) {
        btn.style.display = 'inline-block';
      } else {
        btn.style.display = 'none';
      }

      btn.addEventListener('click', function() {
        text.classList.toggle('expanded');
        this.textContent = text.classList.contains('expanded') ? 'See Less' : 'See More';
      });
    }
  });
});

/*-----------------------------------*\
 * #SCROLL REVEAL ANIMATION LOOP
\*-----------------------------------*/
const revealElements = document.querySelectorAll(".reveal");
const scrollReveal = function () {
  for (let i = 0; i < revealElements.length; i++) {
    const windowHeight = window.innerHeight;
    const elementTop = revealElements[i].getBoundingClientRect().top;
    const elementVisible = 100; 

    if (elementTop < windowHeight - elementVisible) {
      revealElements[i].classList.add("active");
    }
  }
}
window.addEventListener("scroll", scrollReveal);
window.addEventListener("load", scrollReveal);

/*-----------------------------------*\
 * #LOAD EXTERNAL REVIEWS
\*-----------------------------------*/
function loadExternalReviews() {
  const cards = document.querySelectorAll('.review-card[data-review-file]');
  cards.forEach(card => {
    const fileName = card.getAttribute('data-review-file');
    const textElement = card.querySelector('.review-text');
    const btn = card.querySelector('.see-more-btn');

    fetch(`./assets/reviews/${fileName}`)
      .then(response => {
        if (!response.ok) throw new Error("File missing");
        return response.text();
      })
      .then(text => {
        textElement.textContent = text;
        if (textElement.scrollHeight > textElement.clientHeight) {
          btn.style.display = 'inline-block';
        } else {
          btn.style.display = 'none';
        }
      })
      .catch(err => {
        console.error(err);
        textElement.textContent = "Could not load review text.";
      });
  });
}
window.addEventListener('load', loadExternalReviews);

/*-----------------------------------*\
 * #REVIEW POPUP MODAL LOGIC
\*-----------------------------------*/
document.addEventListener('DOMContentLoaded', function() {
  const reviewModalOverlay = document.getElementById('review-modal-overlay');
  const modalUserImg = document.getElementById('modal-user-img');
  const modalUserName = document.getElementById('modal-user-name');
  const modalUserRating = document.getElementById('modal-user-rating');
  const modalReviewText = document.getElementById('modal-review-text');
  const closeReviewBtn = document.querySelector('#review-modal-overlay .close-review-btn');

  if (!reviewModalOverlay) return;

  function toggleReviewModal(show) {
    if (show) {
      reviewModalOverlay.classList.add('active');
      document.body.classList.add('active');
    } else {
      reviewModalOverlay.classList.remove('active');
      document.body.classList.remove('active');
    }
  }

  reviewModalOverlay.addEventListener('click', (e) => {
    if (e.target === reviewModalOverlay) toggleReviewModal(false);
  });

  if (closeReviewBtn) {
    closeReviewBtn.addEventListener('click', () => toggleReviewModal(false));
  }

  const expandBtns = document.querySelectorAll('.expand-btn');
  expandBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const card = this.closest('.review-card');
      const imgSrc = card.querySelector('.avatar img').src;
      const name = card.querySelector('.username').textContent;
      const ratingHtml = card.querySelector('.rating-wrapper').innerHTML;
      const fullText = card.querySelector('.review-text').textContent;

      if(modalUserImg) modalUserImg.src = imgSrc;
      if(modalUserName) modalUserName.textContent = name;
      if(modalUserRating) modalUserRating.innerHTML = ratingHtml;
      if(modalReviewText) modalReviewText.textContent = fullText;

      toggleReviewModal(true);
    });
  });
});

/*-----------------------------------*\
 * #CUSTOM SHARE MODAL LOGIC
\*-----------------------------------*/
const shareModal = document.getElementById('share-modal-overlay');
const shareInput = document.getElementById('share-link-input');
const copyModalBtn = document.getElementById('copy-modal-btn');

const sFb = document.getElementById('s-fb');
const sTw = document.getElementById('s-tw');
const sWa = document.getElementById('s-wa');
const sPin = document.getElementById('s-pin');
const sMail = document.getElementById('s-mail');

function toggleShareModal(show) {
  if (shareModal) {
    show ? shareModal.classList.add('active') : shareModal.classList.remove('active');
  }
}

if (shareModal) {
  shareModal.addEventListener('click', (e) => {
    if (e.target === shareModal) toggleShareModal(false);
  });
}

function initReviewActions() {
  const copyBtns = document.querySelectorAll('.copy-btn');
  const shareBtns = document.querySelectorAll('.share-btn');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const card = this.closest('.review-card');
      const textEl = card.querySelector('.review-text');
      if (!textEl) return;
      
      navigator.clipboard.writeText(textEl.textContent).then(() => {
        const icon = this.querySelector('ion-icon');
        const origName = icon.getAttribute('name');
        icon.setAttribute('name', 'checkmark-outline');
        setTimeout(() => icon.setAttribute('name', origName), 2000);
      });
    });
  });

  shareBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const card = this.closest('.review-card');
      const text = card.querySelector('.review-text').textContent;
      const url = window.location.href; 
      
      if (shareInput) shareInput.value = url;
      const msg = encodeURIComponent(`Check out this review: "${text.substring(0, 100)}..."`);
      const encUrl = encodeURIComponent(url);

      if(sFb) sFb.href = `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`;
      if(sTw) sTw.href = `https://twitter.com/intent/tweet?text=${msg}&url=${encUrl}`;
      if(sWa) sWa.href = `https://api.whatsapp.com/send?text=${msg}%20${encUrl}`;
      if(sPin) sPin.href = `https://pinterest.com/pin/create/button/?url=${encUrl}&description=${msg}`;
      if(sMail) sMail.href = `mailto:?subject=Movie Review&body=${msg}%0A${encUrl}`;

      toggleShareModal(true);
    });
  });
}
window.addEventListener('load', initReviewActions);

if (copyModalBtn && shareInput) {
  copyModalBtn.addEventListener('click', () => {
    shareInput.select();
    navigator.clipboard.writeText(shareInput.value).then(() => {
      copyModalBtn.textContent = "Copied!";
      setTimeout(() => copyModalBtn.textContent = "Copy", 2000);
    });
  });
}

/*-----------------------------------*\
 * #ABOUT FILM, REFERENCES, & MEMBERS MODALS
\*-----------------------------------*/
function setupStaticModal(linkId, modalId, closeId) {
  const link = document.getElementById(linkId);
  const modal = document.getElementById(modalId);
  const closeBtn = document.getElementById(closeId);

  if (link && modal) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      document.body.classList.add('active');
    });
  }
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.classList.remove('active');
    });
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.classList.remove('active');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupStaticModal('about-film-link', 'about-modal-overlay', 'close-about-btn');
  setupStaticModal('references-link', 'references-modal-overlay', 'close-references-btn');
  setupStaticModal('members-link', 'members-modal-overlay', 'close-members-btn');
});

/*-----------------------------------*\
 * #FOOTER LINKS MODAL LOGIC
\*-----------------------------------*/
const footerContent = {
  faq: { title: "Frequently Asked Questions", text: `Q: Is Filmlane free?\nA: Yes, Filmlane is free to use for browsing movie reviews.\n\nQ: How do I download movies?\nA: Click the download button on the specific movie page (if available).\n\nQ: Can I submit a review?\nA: Currently, reviews are curated by our team.` },
  help: { title: "Help Center", text: `Need assistance? Our support team is here to help.\n\nEmail: aisat.natividad@gmail.com\nPhone: +639924560138\nHours: Mon-Fri, 9am - 5pm EST` },
  terms: { title: "Terms of Use", text: `1. Acceptance of Terms\nBy accessing this website, you agree to be bound by these terms.\n\n2. Use License\nPermission is granted to temporarily download one copy of the materials for personal, non-commercial viewing only.\n\n3. Disclaimer\nThe materials on Filmlane's website are provided on an 'as is' basis.` },
  privacy: { title: "Privacy Policy", text: `Your privacy is important to us.\n\n1. Information Collection\nWe only collect information necessary to provide our services.\n\n2. Cookies\nWe use cookies to improve your browsing experience.\n\n3. Data Protection\nWe do not sell your personal data to third parties.` }
};

document.addEventListener('DOMContentLoaded', () => {
  const infoModal = document.getElementById('info-modal-overlay');
  const infoTitle = document.getElementById('info-modal-title');
  const infoText = document.getElementById('info-modal-text');
  const closeInfoBtn = document.getElementById('close-info-btn');

  function openInfoModal(type) {
    const content = footerContent[type];
    if (content && infoModal) {
      infoTitle.textContent = content.title;
      infoText.textContent = content.text;
      infoModal.classList.add('active');
      document.body.classList.add('active');
    }
  }

  document.getElementById('faq-link')?.addEventListener('click', (e) => { e.preventDefault(); openInfoModal('faq'); });
  document.getElementById('help-link')?.addEventListener('click', (e) => { e.preventDefault(); openInfoModal('help'); });
  document.getElementById('terms-link')?.addEventListener('click', (e) => { e.preventDefault(); openInfoModal('terms'); });
  document.getElementById('privacy-link')?.addEventListener('click', (e) => { e.preventDefault(); openInfoModal('privacy'); });

  if (closeInfoBtn && infoModal) {
    closeInfoBtn.addEventListener('click', () => {
      infoModal.classList.remove('active');
      document.body.classList.remove('active');
    });
  }
});

/*-----------------------------------*\
 * #DOWNLOAD BUTTON CHECKER
\*-----------------------------------*/
window.addEventListener('load', () => {
  const downloadBtns = document.querySelectorAll('.service-btn, .download-btn, .social-link');
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const link = this.getAttribute('href');
      if (!link || link === '#' || link === 'javascript:void(0)' || link === 'https://www.facebook.com/aisatcollegedasmaph') {
        e.preventDefault();
        alert("No link available");
      }
    });
  });
});

/*-----------------------------------*\
 * #LANGUAGE TRANSLATION ENGINE
\*-----------------------------------*/
const translations = {
  'EN': { 'home': 'Home', 'about': 'About Film', 'references': 'References', 'members': 'Members' },
  'AU': { 'home': 'Home', 'about': 'About Film', 'references': 'References', 'members': 'Mates' },
  'AR': { 'home': 'الرئيسية', 'about': 'عن الفيلم', 'references': 'المراجع', 'members': 'الأعضاء' },
  'TU': { 'home': 'Ana Sayfa', 'about': 'Film Hakkında', 'references': 'Referanslar', 'members': 'Üyeler' }
};

function changeLanguage(lang) {
  if (!translations[lang]) return;
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) el.textContent = translations[lang][key];
  });
  document.body.setAttribute('dir', lang === 'AR' ? 'rtl' : 'ltr');
}

window.addEventListener('load', () => {
  const langToggle = document.getElementById('lang-toggle');
  const langContainer = document.querySelector('.lang-dropdown');
  const langText = document.getElementById('current-lang-text');
  const langItems = document.querySelectorAll('.lang-item');

  if (langToggle) {
    langToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      langContainer.classList.toggle('active');
    });
  }

  langItems.forEach(item => {
    item.addEventListener('click', function() {
      langItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
      const selectedLang = this.getAttribute('data-lang');
      if (langText) langText.textContent = selectedLang;
      changeLanguage(selectedLang);
      langContainer.classList.remove('active');
    });
  });

  document.addEventListener('click', (e) => {
    if (langContainer && !langContainer.contains(e.target)) {
      langContainer.classList.remove('active');
    }
  });
});

/*-----------------------------------*\
 * #SINGLE MEMBER DETAILS MODAL POPUP
\*-----------------------------------*/
document.addEventListener('DOMContentLoaded', function() {
  const detailModal = document.getElementById('member-detail-modal-overlay');
  const detailImg = document.getElementById('detail-img');
  const detailName = document.getElementById('detail-name');
  const detailRole = document.getElementById('detail-role');
  const closeDetailBtn = document.getElementById('close-detail-btn');

  document.addEventListener('click', function(e) {
    const memberItem = e.target.closest('.member-item');
    if (memberItem) {
      const img = memberItem.querySelector('img').src;
      const name = memberItem.querySelector('h4').textContent;
      const roleText = memberItem.querySelector('p').textContent;
      const role = roleText.replace('BC5MD', '').trim(); 

      if (!detailModal) return;
      if(detailImg) detailImg.src = img;
      if(detailName) detailName.textContent = name;
      if(detailRole) detailRole.textContent = role.replace('|', '').trim();
      detailModal.classList.add('active');
      document.body.classList.add('active');
    }
  });

  if (closeDetailBtn && detailModal) {
    closeDetailBtn.addEventListener('click', () => {
      detailModal.classList.remove('active');
      document.body.classList.remove('active');
    });
  }
});

/*-----------------------------------*\
 * #SEARCH LOGIC FILTER
\*-----------------------------------*/
document.addEventListener('DOMContentLoaded', function() {
  const searchBtn = document.querySelector('.search-btn');
  const searchModal = document.getElementById('search-modal-overlay');
  const searchInput = document.getElementById('search-input');
  const closeSearchBtn = document.getElementById('close-search-btn');

  if (searchBtn && searchModal) {
    searchBtn.addEventListener('click', () => {
      searchModal.classList.add('active');
      if (searchInput) searchInput.focus();
      document.body.classList.add('active');
    });
  }

  if (closeSearchBtn && searchModal) {
    closeSearchBtn.addEventListener('click', () => {
      searchModal.classList.remove('active');
      document.body.classList.remove('active');
    });
  }
});

/*-----------------------------------*\
 * #J. UPLOAD MOVIE REVIEW MASTER CONTROLLER & PREVIEW LAYER
\*-----------------------------------*/
document.addEventListener('DOMContentLoaded', () => {
  const uploadReviewBtn = document.getElementById('upload-review-btn');
  const uploadModal = document.getElementById('upload-review-modal-overlay');
  const closeUploadBtn = document.getElementById('close-upload-modal-btn');
  const uploadForm = document.getElementById('upload-review-form');

  const uploadZone = document.getElementById('thumb-upload-zone');
  const fileInput = document.getElementById('review-movie-image');
  const previewImg = document.getElementById('upload-preview-img');
  const uploadPrompt = document.getElementById('upload-zone-prompt');
  
  const reviewsGrid = document.getElementById('user-reviews-grid');
  const audienceGrid = document.getElementById('audience-reviews-grid'); // New Global Grid Hook

  let base64ImageString = ""; 

  // 1. private user review loader engine
  async function fetchAndRenderUserReviews() {
    if (!reviewsGrid) return;
    
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      reviewsGrid.innerHTML = `<p style="color: #678; font-size: 13px; grid-column: span 6; text-align: center; padding: 20px;">Sign in to view your custom uploaded movie reviews collection.</p>`;
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/reviews/user?email=${encodeURIComponent(userEmail)}`);
      const reviews = await response.json();

      if (reviews.length === 0) {
        reviewsGrid.innerHTML = `<p style="color: #678; font-size: 13px; grid-column: span 6; text-align: center; padding: 20px;">You haven't uploaded any movie reviews yet! Click the button above to start.</p>`;
        return;
      }

      reviewsGrid.innerHTML = reviews.map(item => `
        <div class="premium-box-card">
          <div class="poster-wrapper">
            <img src="${item.image_data || './assets/images/obs.jpg'}" alt="${item.movie_name}" />
          </div>
          <div class="poster-footer">
            <span class="reviewer-name">${item.movie_name}</span>
            <div class="card-meta">
              <span class="stars-indicator">★★★★★</span>
              <span class="review-date">${item.publish_date}</span>
            </div>
          </div>
        </div>
      `).join('');

    } catch (err) {
      console.error("Error drawing profile dashboard nodes:", err);
    }
  }

  // 2. GLOBAL AUDIENCE REVIEWS LOADER ENGINE (SHOWS EVERYTHING TO EVERYONE)
  async function fetchAndRenderAudienceReviews() {
    if (!audienceGrid) return;

    try {
      const response = await fetch("http://localhost:5000/api/reviews/all");
      const reviews = await response.json();

      if (reviews.length === 0) {
        audienceGrid.innerHTML = `<p style="color: #678; font-size: 13px; grid-column: span 6; text-align: center; padding: 20px;">No audience reviews have been published yet.</p>`;
        return;
      }

      audienceGrid.innerHTML = reviews.map(item => `
        <div class="premium-box-card" style="border-bottom: 3px solid var(--citrine);">
          <div class="poster-wrapper">
            <img src="${item.image_data || './assets/images/obs.jpg'}" alt="${item.movie_name}" />
          </div>
          <div class="poster-footer">
            <span class="reviewer-name">${item.movie_name}</span>
            <div class="card-meta">
              <span class="stars-indicator" style="color: var(--citrine); font-size: 11px;">By: ${item.username}</span>
              <span class="review-date">${item.publish_date}</span>
            </div>
          </div>
        </div>
      `).join('');

    } catch (err) {
      console.error("Error drawing global audience grid nodes:", err);
    }
  }

  // Boot up both query arrays immediately when page is loaded
  fetchAndRenderUserReviews();
  fetchAndRenderAudienceReviews();

  // 3. MODAL CONTROLS
  if (uploadReviewBtn && uploadModal) {
    uploadReviewBtn.addEventListener('click', () => {
      if (!localStorage.getItem("userToken")) {
        alert("Please sign in to upload a movie review!");
        document.getElementById('signin-modal-overlay')?.classList.add('active');
      } else {
        uploadModal.classList.add('active');
        document.body.classList.add('active');
      }
    });
  }

  if (closeUploadBtn && uploadModal) {
    closeUploadBtn.addEventListener('click', () => {
      uploadModal.classList.remove('active');
      document.body.classList.remove('active');
    });
  }

  if (uploadModal) {
    uploadModal.addEventListener('click', (e) => {
      if (e.target === uploadModal) {
        uploadModal.classList.remove('active');
        document.body.classList.remove('active');
      }
    });
  }

  if (uploadZone && fileInput) {
    uploadZone.addEventListener('click', () => fileInput.click());
  }

  if (fileInput && previewImg && uploadPrompt) {
    fileInput.addEventListener('change', function() {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.addEventListener('load', function() {
          previewImg.src = this.result;
          previewImg.style.display = 'block';
          uploadPrompt.style.opacity = '0';
          base64ImageString = this.result; 
        });
        reader.readAsDataURL(file);
      }
    });
  }

  // 4. PIPELINE NETWORK FORM TRANSMISSION SUBMIT
  if (uploadForm) {
    uploadForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const movieName = document.getElementById('review-movie-name').value.trim();
      const publishDate = document.getElementById('review-movie-date').value.trim();
      const reviewText = document.getElementById('review-movie-text').value.trim();
      const userEmail = localStorage.getItem("userEmail");
      const submitBtn = this.querySelector('button[type="submit"]');

      try {
        submitBtn.textContent = "Publishing Package...";
        submitBtn.disabled = true;

        const response = await fetch("http://localhost:5000/api/reviews/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            movieName: movieName,
            publishDate: publishDate,
            reviewText: reviewText,
            imageData: base64ImageString
          })
        });

        const data = await response.json();
        alert(data.message);

        if (response.ok) {
          uploadForm.reset();
          previewImg.src = "";
          previewImg.style.display = 'none';
          uploadPrompt.style.opacity = '1';
          base64ImageString = "";

          uploadModal.classList.remove('active');
          document.body.classList.remove('active');

          // CRITICAL: Refreshes both rows instantly without reloading the browser window!
          await fetchAndRenderUserReviews();
          await fetchAndRenderAudienceReviews();
        }

      } catch (err) {
        alert("Pipeline error communicating with backend server.");
      } finally {
        submitBtn.textContent = "Publish Review";
        submitBtn.disabled = false;
      }
    });
  }
});