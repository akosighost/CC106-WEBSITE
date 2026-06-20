'use strict';



// 1. Define your base URL FIRST so the code knows what it is
const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
  ? "${API_BASE_URL}" 
  : "https://reavon-backend.onrender.com";

console.log("Current API URL:", API_BASE_URL);

// 2. Now you can safely use it. 
// I changed '/api/movies' to '/api/reviews/all' because that route actually exists in your server.js
fetch(`${API_BASE_URL}/api/reviews/all`) 
  .then(response => response.json())
  .then(data => {
    console.log("Data from backend:", data);
  })
  .catch(error => console.error("Error fetching data:", error));

console.log("Current API URL:", API_BASE_URL);

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
      const response = await fetch("${API_BASE_URL}/api/auth/forgot-password", {
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

        const response = await fetch("${API_BASE_URL}/api/auth/login", {
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
          
          // FIX: Ensure this line exists to save your role to the browser session!
          localStorage.setItem("isAdmin", data.is_admin); 
          
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
        const response = await fetch("${API_BASE_URL}/api/auth/signup", {
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
        const response = await fetch("${API_BASE_URL}/api/auth/reset-password", {
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
  const audienceGrid = document.getElementById('audience-reviews-grid');
  const featuredGrid = document.getElementById('featured-reviews-grid');
  const recommendationsGrid = document.getElementById('recommendations-reviews-grid');

  // Movie Details & Edit UI Selectors
  const detailModal = document.getElementById('movie-detail-modal-overlay');
  const closeDetailModalBtn = document.getElementById('close-detail-modal-btn');
  const commentForm = document.getElementById('detail-comment-form');
  
  let base64ImageString = ""; 
  let currentActiveReviewId = null;
  let activeSelectedRating = 0; 

 // TIMESTAMP FORMATTING HELPER
  function parseSystemTimestampToLocal(isoString) {
    if (!isoString) return "";
    const dateInstance = new Date(isoString);
    return dateInstance.toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true
    });
  }
  

  // 1. PRIVATE USER REVIEW LOADER ENGINE (ADDED BY YOU)
  async function fetchAndRenderUserReviews() {
    if (!reviewsGrid) return;
    const userContainer = document.getElementById('user-reviews-container');
    const userEmail = localStorage.getItem("userEmail");
    
    if (!userEmail) {
      if (userContainer) userContainer.style.display = 'none';
      return;
    } else {
      if (userContainer) userContainer.style.display = 'block';
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews/user?email=${encodeURIComponent(userEmail)}`);
      const reviews = await response.json();

      if (reviews.length === 0) {
        reviewsGrid.innerHTML = `<p style="color: #678; font-size: 13px; grid-column: span 6; text-align: center; padding: 20px;">You haven't uploaded any movie reviews yet! Click the button above to start.</p>`;
        return;
      }

      reviewsGrid.innerHTML = reviews.map(item => {
        const ratingCount = parseInt(item.rating_count) || 0;
        const avgRating = parseFloat(item.avg_rating) || 0;
        const starText = ratingCount > 0 ? "★".repeat(Math.round(avgRating)) + "☆".repeat(5 - Math.round(avgRating)) : "☆☆☆☆☆";

        return `
          <div class="premium-box-card review-click-target-node" data-review-id="${item.review_id}" style="cursor: pointer;">
            <div class="poster-wrapper">
              <img src="${item.image_data || './assets/images/obs.jpg'}" alt="${item.movie_name}" />
            </div>
            <div class="poster-footer">
              <span class="reviewer-name">${item.movie_name}</span>
              <div class="card-meta">
                <span class="stars-indicator" style="color: #00e054;">${starText}</span>
                <span class="review-date">${item.publish_date}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');

    } catch (err) {
      console.error("Error drawing profile dashboard nodes:", err);
    }
  }


  // 1B. NEW: FEATURED REVIEWS LOADER ENGINE ("NEW ON REAV-ON")
  async function fetchAndRenderFeaturedReviews() {
    if (!featuredGrid) return;

    

    try {
      const response = await fetch("${API_BASE_URL}/api/reviews/featured");
      const reviews = await response.json();

      if (reviews.length === 0) {
        featuredGrid.innerHTML = `<p style="color: #678; font-size: 13px; grid-column: span 6; text-align: center; padding: 20px;">No featured movie highlights published yet.</p>`;
        return;
      }
      

      featuredGrid.innerHTML = reviews.map(item => {
        const ratingCount = parseInt(item.rating_count) || 0;
        const avgRating = parseFloat(item.avg_rating) || 0;
        const starText = ratingCount > 0 ? "★".repeat(Math.round(avgRating)) + "☆".repeat(5 - Math.round(avgRating)) : "☆☆☆☆☆";

        return `
          <div class="premium-box-card review-click-target-node" data-review-id="${item.review_id}" style="border-bottom: 3px solid var(--citrine); cursor: pointer;">
            <div class="poster-wrapper">
              <img src="${item.image_data || './assets/images/obs.jpg'}" alt="${item.movie_name}" />
            </div>
            <div class="poster-footer">
              <span class="reviewer-name">${item.movie_name}</span>
              <span style="color: var(--citrine); font-size: 11px; margin-top: -2px; font-weight: 500;">By Admin: ${item.username}</span>
              <div class="card-meta">
                <span class="stars-indicator" style="color: var(--citrine);">${starText}</span>
                <span class="review-date">${item.publish_date}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');

    } catch (err) {
      console.error("Error drawing featured reviews grid nodes:", err);
    }
  }

  // 1C. NEW: RECOMMENDATIONS REVIEWS LOADER ENGINE (4-5 STARS ONLY)
  async function fetchAndRenderRecommendations() {
    if (!recommendationsGrid) return;

    try {
      const response = await fetch("${API_BASE_URL}/api/reviews/recommendations");
      const reviews = await response.json();

      if (reviews.length === 0) {
        recommendationsGrid.innerHTML = `<p style="color: #678; font-size: 13px; grid-column: span 6; text-align: center; padding: 20px;">No high-rated community picks recommended yet.</p>`;
        return;
      }

      recommendationsGrid.innerHTML = reviews.map(item => {
        const ratingCount = parseInt(item.rating_count) || 0;
        const avgRating = parseFloat(item.avg_rating) || 0;
        const starText = "★".repeat(Math.round(avgRating)) + "☆".repeat(5 - Math.round(avgRating));

        return `
          <div class="premium-box-card review-click-target-node" data-review-id="${item.review_id}" style="cursor: pointer;">
            <div class="poster-wrapper">
              <img src="${item.image_data || './assets/images/obs.jpg'}" alt="${item.movie_name}" />
            </div>
            <div class="poster-footer">
              <span class="reviewer-name">${item.movie_name}</span>
              <span style="color: #678; font-size: 11px; margin-top: -2px; font-weight: 500;">By: ${item.username}</span>
              <div class="card-meta">
                <span class="stars-indicator" style="color: #00e054;">${starText}</span>
                <span class="review-date">${item.publish_date}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');

    } catch (err) {
      console.error("Error drawing recommendations grid nodes:", err);
    }
  }

  // Make sure to call it on page load alongside your other grids
  // Trigger on load alongside your other active grids
  fetchAndRenderFeaturedReviews();
  fetchAndRenderUserReviews();
  fetchAndRenderAudienceReviews();
  fetchAndRenderRecommendations(); // FIX: Added initialization step

  // 2. GLOBAL AUDIENCE REVIEWS LOADER ENGINE
  async function fetchAndRenderAudienceReviews() {
    if (!audienceGrid) return;

    try {
      const response = await fetch("${API_BASE_URL}/api/reviews/all");
      const reviews = await response.json();

      if (reviews.length === 0) {
        audienceGrid.innerHTML = `<p style="color: #678; font-size: 13px; grid-column: span 6; text-align: center; padding: 20px;">No audience reviews have been published yet.</p>`;
        return;
      }

      audienceGrid.innerHTML = reviews.map(item => {
        const ratingCount = parseInt(item.rating_count) || 0;
        const avgRating = parseFloat(item.avg_rating) || 0;
        const starText = ratingCount > 0 ? "★".repeat(Math.round(avgRating)) + "☆".repeat(5 - Math.round(avgRating)) : "☆☆☆☆☆";

        return `
          <div class="premium-box-card review-click-target-node" data-review-id="${item.review_id}" style="border-bottom: 3px solid var(--citrine); cursor: pointer;">
            <div class="poster-wrapper">
              <img src="${item.image_data || './assets/images/obs.jpg'}" alt="${item.movie_name}" />
            </div>
            <div class="poster-footer">
              <span class="reviewer-name">${item.movie_name}</span>
              <span style="color: var(--citrine); font-size: 11px; margin-top: -2px; font-weight: 500;">By: ${item.username}</span>
              <div class="card-meta">
                <span class="stars-indicator" style="color: var(--citrine);">${starText}</span>
                <span class="review-date">${item.publish_date}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');

    } catch (err) {
      console.error("Error drawing global audience grid nodes:", err);
    }
  }

  fetchAndRenderUserReviews();
  fetchAndRenderAudienceReviews();

  // Helper visibility layout control switcher
  function toggleEditFormState(showEditForm) {
    const viewStyle = showEditForm ? 'none' : 'block';
    const inlineViewStyle = showEditForm ? 'none' : 'inline-block';
    const editStyle = showEditForm ? 'block' : 'none';

    document.getElementById('title-view-wrapper').style.display = viewStyle;
    document.getElementById('title-edit-wrapper').style.display = editStyle;
    document.getElementById('date-view-wrapper').style.display = inlineViewStyle;
    document.getElementById('date-edit-wrapper').style.display = editStyle;
    document.getElementById('text-view-wrapper').style.display = viewStyle;
    document.getElementById('text-edit-wrapper').style.display = editStyle;
    
    document.getElementById('edit-actions-utilities-bar').style.display = showEditForm ? 'flex' : 'none';
    document.getElementById('detail-modal-comments-block-wrapper').style.display = viewStyle; 
  }

  // Rewrite function to cleanly render aggregate ratings and interactive header stars
  function updateModalHeaderStars(avgRating, ratingCount, userRating = null) {
    const ratingBox = document.getElementById('detail-average-rating-box');
    if (!ratingBox) return;

    const averageScore = parseFloat(avgRating) || 0;
    let ratingHTML = `<div class="rating-display-row" style="display: flex; align-items: center; gap: 4px;">`;

    for (let i = 1; i <= 5; i++) {
      if (averageScore >= i) ratingHTML += '<img src="data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 512 512\'><path fill=\'%23e5b800\' d=\'M256 39.37l68.75 139.32 153.75 22.33-111.25 108.45 26.25 153.13-137.5-72.29-137.5 72.29 26.25-153.13-111.25-108.45 153.75-22.33L256 39.37z\'/></svg>" style="width:16px; height:16px;" />';
      else if (averageScore >= i - 0.5) ratingHTML += '<img src="data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 512 512\'><path fill=\'%23e5b800\' d=\'M256 39.37l68.75 139.32 153.75 22.33-111.25 108.45 26.25 153.13-137.5-72.29V39.37z\'/></svg>" style="width:16px; height:16px;" />';
      else ratingHTML += '<img src="data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 512 512\'><path fill=\'none\' stroke=\'%23667788\' stroke-width=\'32\' d=\'M256 39.37l68.75 139.32 153.75 22.33-111.25 108.45 26.25 153.13-137.5-72.29-137.5 72.29 26.25-153.13-111.25-108.45 153.75-22.33L256 39.37z\'/></svg>" style="width:16px; height:16px;" />';
    }

    ratingHTML += `
      <span class="average-score-text" style="color: var(--white); font-weight: 700; margin-left: 6px;">
        ${averageScore > 0 ? `${averageScore} / 5 (${ratingCount} user${ratingCount === 1 ? '' : 's'} rated)` : 'No ratings left yet'}
      </span>
    </div>`;

    // Inject the interactive 1-time selector row underneath
    ratingHTML += `
      <div class="interactive-user-rating-line" style="margin-top: 12px; display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.02); padding: 6px 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.05); width: max-content;">
        <span style="color: #678; font-size: 12px; font-weight: 600;">${userRating ? 'Your Rating:' : 'Click to Rate:'}</span>
        <div class="interactive-header-stars" style="display: flex; gap: 4px; font-size: 18px;">
          ${[1, 2, 3, 4, 5].map(num => {
            const isSelect = userRating && num <= userRating;
            return `<ion-icon name="${isSelect ? 'star' : 'star-outline'}" data-value="${num}" class="${isSelect ? 'selected-star' : ''}" style="cursor: pointer; color: ${isSelect ? 'var(--citrine)' : '#678'}; transition: color 0.1s;"></ion-icon>`;
          }).join('')}
        </div>
      </div>
    `;

    ratingBox.innerHTML = ratingHTML;
    setupHeaderStarListeners();
  }

  // Handle high-performance click listeners for header stars
  function setupHeaderStarListeners() {
    const container = document.querySelector('.interactive-header-stars');
    if (!container) return;

    const stars = Array.from(container.querySelectorAll('ion-icon'));
    const userEmail = localStorage.getItem("userEmail");

    stars.forEach(star => {
      star.addEventListener('mouseenter', function() {
        const val = parseInt(this.getAttribute('data-value'), 10);
        stars.forEach((s, idx) => s.style.color = idx < val ? 'var(--citrine)' : '#678');
      });

      star.addEventListener('mouseleave', function() {
        stars.forEach(s => s.style.color = s.classList.contains('selected-star') ? 'var(--citrine)' : '#678');
      });

      star.addEventListener('click', async function() {
        if (!userEmail) { alert("Please sign in to rate this movie!"); return; }
        const ratingVal = parseInt(this.getAttribute('data-value'), 10);

        try {
          const response = await fetch(`${API_BASE_URL}/api/reviews/rate/${currentActiveReviewId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: userEmail, rating: ratingVal })
          });

          if (response.ok) {
            const refreshRes = await fetch(`${API_BASE_URL}/api/reviews/details/${currentActiveReviewId}?email=${encodeURIComponent(userEmail)}`);
            const refreshData = await refreshRes.json();
            updateModalHeaderStars(refreshData.review.avg_rating, refreshData.review.rating_count, refreshData.user_rating);
            await fetchAndRenderUserReviews();
            await fetchAndRenderAudienceReviews();
          }
        } catch (err) { console.error(err); }
      });
    });
  }

  /// 3. FULL-STACK PROFILE DETAILS RENDERING & INTERACTIVE EDIT SUBSYSTEM
  async function openReviewDetailsViewport(reviewId) {
    if (!document.getElementById('detail-movie-title')) return;
    currentActiveReviewId = reviewId;
    const userEmail = localStorage.getItem("userEmail") || "";

    const modalContainer = document.querySelector('.movie-detail-modal-container') || document.querySelector('.full-page-thread-wrapper');
    if (modalContainer) modalContainer.classList.remove('is-editing-mode');
    toggleEditFormState(false);
    
    // 1. Show the loading screen
    const loader = document.getElementById('loading-overlay');
    if (loader) loader.style.display = 'flex';

    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews/details/${reviewId}?email=${encodeURIComponent(userEmail)}`);
      if (!response.ok) throw new Error("Packet unresolved.");
      const data = await response.json();

      const moviePosterImg = document.getElementById('detail-movie-poster');
      moviePosterImg.src = data.review.image_data || './assets/images/obs.jpg';
      document.getElementById('detail-movie-title').textContent = data.review.movie_name;
      document.getElementById('detail-movie-date').textContent = data.review.publish_date;
      document.getElementById('detail-movie-author').textContent = data.review.username;
      document.getElementById('detail-view-count').textContent = data.review.view_count || 0;
      document.getElementById('detail-review-text').textContent = data.review.review_text;

      

      updateModalHeaderStars(data.review.avg_rating, data.review.rating_count, data.user_rating);
      const timePlaceholder = document.getElementById('detail-upload-time');
      if (timePlaceholder && data.review.created_at) {
        timePlaceholder.textContent = `• Uploaded: ${parseSystemTimestampToLocal(data.review.created_at)}`;
      }

      // ============================================================
      // BULLETPROOF GENRE DATA NORMALIZER & PILL RENDERER
      // ============================================================
      let processedGenres = [];
      
      if (Array.isArray(data.review.genres)) {
        // If it's already a clean JavaScript array, use it directly
        processedGenres = data.review.genres;
      } else if (typeof data.review.genres === 'string' && data.review.genres.trim() !== '') {
        // If it's returned as a raw Postgres array string literal like "{Action,Horror}", parse it safely
        processedGenres = data.review.genres
          .replace(/[{}]/g, '') // Strip brackets
          .split(',')           // Split by comma divisions
          .map(g => g.trim().replace(/^"|"$/g, '')) // Clean out loose quotes
          .filter(g => g !== ''); // Drop empty string fragments
      }

      const dynamicGenreWrapper = document.getElementById('detail-movie-genres');
      if (dynamicGenreWrapper) {
        if (processedGenres && processedGenres.length > 0) {
          dynamicGenreWrapper.innerHTML = processedGenres.map(g => `<span class="imdb-genre-pill">${g}</span>`).join('');
        } else {
          dynamicGenreWrapper.innerHTML = `<span class="imdb-genre-pill" style="color: #567; border-color: #1a282d;">Uncategorized</span>`;
        }
      }

      // REMOVED: The broken "updateModalHeaderStars(data.comments);" line that was clearing the UI

      // ============================================================
      // SECURE REVIEW CONTENT MANAGEMENT CONTROL VISIBILITY GATE
      // ============================================================
      const editBtn = document.getElementById('detail-edit-review-btn');
      const deleteBtn = document.getElementById('detail-delete-review-btn');
      let temporaryBase64PosterString = "";

      // Explicitly check boolean conditions from backend response packet arrays
      const isAuthorizedToModify = data.review.is_owner === true || data.is_admin === true;

      if (isAuthorizedToModify) {
        // Reveal control tools to authorized sessions
        if (editBtn) editBtn.style.display = 'flex';
        if (deleteBtn) deleteBtn.style.display = 'flex';

        const cleanEditBtn = editBtn.cloneNode(true);
        editBtn.parentNode.replaceChild(cleanEditBtn, editBtn);

        const posterOverlayBtn = document.getElementById('poster-edit-overlay-btn');
        const editFileInput = document.getElementById('edit-movie-image-input');

        if (posterOverlayBtn) posterOverlayBtn.onclick = () => editFileInput?.click();
        
        if (editFileInput) {
          editFileInput.onchange = function() {
            const file = this.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = function() {
                moviePosterImg.src = this.result;
                temporaryBase64PosterString = this.result;
              };
              reader.readAsDataURL(file);
            }
          };
        }

        cleanEditBtn.addEventListener('click', () => {
          if (modalContainer) modalContainer.classList.add('is-editing-mode');
          toggleEditFormState(true);
          temporaryBase64PosterString = ""; 

          document.getElementById('edit-movie-name-field').value = document.getElementById('detail-movie-title').textContent;
          document.getElementById('edit-movie-date-field').value = document.getElementById('detail-movie-date').textContent;
          document.getElementById('edit-movie-text-field').value = document.getElementById('detail-review-text').textContent;
        });

        const saveBtn = document.getElementById('edit-save-btn');
        if (saveBtn) {
          saveBtn.onclick = async () => {
            const updatedName = document.getElementById('edit-movie-name-field').value.trim();
            const updatedDate = document.getElementById('edit-movie-date-field').value.trim();
            const updatedText = document.getElementById('edit-movie-text-field').value.trim();

            if(!updatedName || !updatedDate || !updatedText) {
              alert("All values are required!");
              return;
            }

            try {
              saveBtn.textContent = "Saving Changes...";
              saveBtn.disabled = true;

              const updateResponse = await fetch(`${API_BASE_URL}/api/reviews/${currentActiveReviewId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: userEmail,
                  movieName: updatedName,
                  publishDate: updatedDate,
                  reviewText: updatedText,
                  imageData: temporaryBase64PosterString || null
                })
              });
              
              const updateData = await updateResponse.json();

              if (updateResponse.ok) {
                // Select custom edit success alert component nodes
                const editOverlay = document.getElementById('edit-success-overlay');
                const editMsgText = document.getElementById('edit-success-message');
                const editAlertBtn = document.getElementById('edit-success-btn');

                if (editOverlay && editAlertBtn) {
                  if (editMsgText) editMsgText.textContent = updateData.message || "Movie review updated successfully!";
                  
                  // Reveal your custom modal box overlay interface
                  editOverlay.style.display = 'flex';

                  // Refresh your page rows ONLY after the user acknowledges the click
                  editAlertBtn.onclick = function() {
                    editOverlay.style.display = 'none';
                    window.location.reload();
                  };
                } else {
                  // Safe fallback if components are missing from DOM branch targets
                  alert(updateData.message);
                  window.location.reload();
                }
              } else {
                alert(updateData.message || "Failed updating record parameters.");
                saveBtn.textContent = "Save Changes";
                saveBtn.disabled = false;
              }
            } catch (err) {
              console.error(err);
              alert("Network link failure writing update logs.");
              saveBtn.textContent = "Save Changes";
              saveBtn.disabled = false;
            }
          };
        }

        const cancelBtn = document.getElementById('edit-cancel-btn');
        if (cancelBtn) {
          cancelBtn.onclick = () => {
            if (modalContainer) modalContainer.classList.remove('is-editing-mode');
            toggleEditFormState(false);
            moviePosterImg.src = data.review.image_data || './assets/images/obs.jpg'; 
          };
        }

        // ============================================================
        // UPDATED SECURED SYSTEM REVIEW TERMINATION MODAL
        // ============================================================
        const cleanDeleteBtn = deleteBtn.cloneNode(true);
        deleteBtn.parentNode.replaceChild(cleanDeleteBtn, deleteBtn);
        
        cleanDeleteBtn.addEventListener('click', () => {
          // Select custom review deletion layout element hooks safely
          const reviewDeleteOverlay = document.getElementById('review-delete-overlay');
          const confirmDeleteBtn = document.getElementById('review-delete-confirm-btn');
          const cancelDeleteBtn = document.getElementById('review-delete-cancel-btn');

          if (reviewDeleteOverlay && confirmDeleteBtn && cancelDeleteBtn) {
            // Open your custom modal component view frame
            reviewDeleteOverlay.style.display = 'flex';

            // Close the warning box harmlessly if canceled
            cancelDeleteBtn.onclick = function() {
              reviewDeleteOverlay.style.display = 'none';
            };

            // Dispatch network payload request to API endpoints upon confirmation
            confirmDeleteBtn.onclick = async function() {
              reviewDeleteOverlay.style.display = 'none';
              
              try {
                const delResponse = await fetch(`${API_BASE_URL}/api/reviews/${currentActiveReviewId}`, {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: userEmail })
                });
                
                if (delResponse.ok) {
                  // Direct clean routing straight back to index landing page catalog
                  window.location.href = "index.html";
                } else {
                  const delData = await delResponse.json();
                  alert(delData.message || "Unauthorized execution context.");
                }
              } catch (err) {
                console.error(err);
                alert("Network link error communicating with execution server database.");
              }
            };
          }
        });

      } else {
        // FORCE HIDDEN: Strictly strip control visibility from unauthorized standard audience views
        if (editBtn) editBtn.style.setProperty('display', 'none', 'important');
        if (deleteBtn) deleteBtn.style.setProperty('display', 'none', 'important');
      }




      renderCommentsListCollection(data.comments, data.is_admin);
      resetStarSelectorInterfaceNode();

      if (detailModal) {
        detailModal.classList.add('active');
        document.body.classList.add('active');
      }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        // 2. Hide the loading screen whether it succeeds or fails
        if (loader) loader.style.display = 'none';
    }
  }

  // Helper visibility layout control switcher
  function toggleEditFormState(showEditForm) {
    const viewStyle = showEditForm ? 'none' : 'block';
    const inlineViewStyle = showEditForm ? 'none' : 'inline-block';
    const editStyle = showEditForm ? 'block' : 'none';

    document.getElementById('title-view-wrapper').style.display = viewStyle;
    document.getElementById('title-edit-wrapper').style.display = editStyle;
    document.getElementById('date-view-wrapper').style.display = inlineViewStyle;
    document.getElementById('date-edit-wrapper').style.display = editStyle;
    document.getElementById('text-view-wrapper').style.display = viewStyle;
    document.getElementById('text-edit-wrapper').style.display = editStyle;
    
    document.getElementById('edit-actions-utilities-bar').style.display = showEditForm ? 'flex' : 'none';
    document.getElementById('detail-modal-comments-block-wrapper').style.display = viewStyle; // Hide comments while editing
  }

  function renderCommentsListCollection(comments, isAdmin = false) {
    const listContainer = document.getElementById('modal-comments-list');
    if (!listContainer) return;

    if (!comments || comments.length === 0) {
      listContainer.innerHTML = `<p id="no-comments-fallback-text" style="color: #678; font-size: 13px; text-align: center; padding-block: 10px;">No community thoughts posted yet. Be the first to share details!</p>`;
      return;
    }

    const currentActiveSessionUser = localStorage.getItem("username");

    // Separate flat database rows into categorized arrays
    const rootComments = comments.filter(c => !c.parent_comment_id);
    const replyComments = comments.filter(c => c.parent_comment_id);

    // Recursive function loop to generate infinite child node depths cleanly
    function buildCommentHTML(c, isReply = false) {
      const upvoteIconName = c.user_has_liked ? "arrow-up" : "arrow-up-outline";
      const downvoteIconName = c.user_has_disliked ? "arrow-down" : "arrow-down-outline";
      const upvoteClass = c.user_has_liked ? "upvoted-active" : "";
      const downvoteClass = c.user_has_disliked ? "downvoted-active" : "";
      const isCommentOwner = currentActiveSessionUser && (c.username === currentActiveSessionUser);
      
      const childReplies = replyComments.filter(r => Number(r.parent_comment_id) === Number(c.comment_id));

      return `
        <div class="reddit-comment-block-wrapper" style="margin-top: 12px; margin-left: ${isReply ? '36px' : '0px'};">
          <div class="reddit-comment-node">
            <div class="reddit-comment-sidebar">
              <div class="reddit-avatar-sm">
                <ion-icon name="person-circle-outline"></ion-icon>
              </div>
              <div class="reddit-thread-line"></div>
            </div>
            <div class="reddit-comment-main">
              <div class="reddit-comment-header">
                <span class="reddit-username">${c.username}</span>
                
                ${c.comment_user_is_admin ? `<span class="reddit-admin-user-badge">Admin</span>` : ''}
                
                ${c.is_verified ? `
                  <span class="reddit-admin-verified-text-badge" title="Verified by Platform Management">
                    <ion-icon name="shield-checkmark"></ion-icon>
                    <span>comment verified by admin</span>
                  </span>
                ` : ''}
                
                <span class="reddit-bullet">•</span>
                <span class="reddit-timestamp">${parseSystemTimestampToLocal(c.created_at)}</span>
              </div>
              <div class="reddit-comment-body">
                <p id="comment-body-text-${c.comment_id}">${c.comment_text}</p>
              </div>
              <div class="reddit-comment-footer">
                <div class="reddit-voting-wrapper">
                  <button class="reddit-vote-btn reddit-upvote comment-like-trigger-node ${upvoteClass}" data-comment-id="${c.comment_id}">
                    <ion-icon name="${upvoteIconName}"></ion-icon>
                  </button>
                  <span class="reddit-vote-count ${upvoteClass} ${downvoteClass}">${c.upvote_score || 0}</span>
                  <button class="reddit-vote-btn reddit-downvote comment-downvote-trigger-node ${downvoteClass}" data-comment-id="${c.comment_id}">
                    <ion-icon name="${downvoteIconName}"></ion-icon>
                  </button>
                </div>
                
                ${!isReply ? `
                  <button class="reddit-action-btn comment-reply-trigger-node" data-comment-id="${c.comment_id}">
                    <ion-icon name="chatbox-outline"></ion-icon>
                    <span>Reply</span>
                  </button>
                ` : ''}

                ${(isCommentOwner || isAdmin) ? `
                  <button class="reddit-action-btn comment-edit-action-trigger-node" data-comment-id="${c.comment_id}">
                    <ion-icon name="create-outline"></ion-icon>
                    <span>Edit</span>
                  </button>
                ` : ''}
                
                ${(isCommentOwner || isAdmin) ? `
                  <button class="reddit-action-btn comment-delete-trigger-action-node" data-comment-id="${c.comment_id}">
                    <ion-icon name="trash-outline"></ion-icon>
                    <span>Delete</span>
                  </button>
                ` : ''}

                ${isAdmin ? `
                  <button class="reddit-action-btn comment-verify-action-trigger-node" data-comment-id="${c.comment_id}" style="color: ${c.is_verified ? '#00e054' : '#678'}; font-weight: 700;">
                    <ion-icon name="${c.is_verified ? 'checkmark-circle' : 'checkmark-circle-outline'}"></ion-icon>
                    <span>${c.is_verified ? 'Verified' : 'Verify'}</span>
                  </button>
                ` : ''}
              </div>
            </div>
          </div>
          
          <div class="reddit-reply-box-container" id="reply-container-${c.comment_id}">
            ${childReplies.map(child => buildCommentHTML(child, true)).join('')}
          </div>
        </div>
      `;
    }

    listContainer.innerHTML = rootComments.map(root => buildCommentHTML(root)).join('');
  }

  // Intercept grid wrapper clicks to route targeted item indexes
  [reviewsGrid, audienceGrid].forEach(grid => {
    if (grid) {
      grid.addEventListener('click', (e) => {
        const targetedCard = e.target.closest('.review-click-target-node');
        if (targetedCard) {
          const id = targetedCard.getAttribute('data-review-id');
          openReviewDetailsViewport(id);
        }
      });
    }
  });

  // Close Detail Layer Panel Actions
  if (closeDetailModalBtn && detailModal) {
    closeDetailModalBtn.addEventListener('click', () => {
      detailModal.classList.remove('active');
      document.body.classList.remove('active');
    });
  }

  // ============================================================
  // 4. DISCUSSION FORUM FORM MANAGEMENT SUBMISSIONS PIPELINE (XHR UPGRADE)
  // ============================================================
  if (commentForm) {
    commentForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) { alert("Please sign in to participate in discussion threads!"); return; }

      const commentField = document.getElementById('comment-field-text');
      const submitBtn = this.querySelector('.comment-submit-btn-override') || this.querySelector('button[type="submit"]');
      
      // Target localized progress UI variables
      const progressWrapper = document.getElementById('comment-progress-wrapper');
      const progressBar = document.getElementById('comment-progress-bar');
      const progressPercent = document.getElementById('comment-progress-percent');

      try {
        submitBtn.textContent = "Sending..."; 
        submitBtn.disabled = true;

        // Initialize progress nodes
        if (progressWrapper) progressWrapper.style.display = 'block';
        if (progressBar) progressBar.style.width = '0%';
        if (progressPercent) progressPercent.textContent = '0%';

        // Initialize XMLHttpRequest transaction sequence
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${API_BASE_URL}/api/reviews/details/${currentActiveReviewId}/comments`);
        xhr.setRequestHeader("Content-Type", "application/json");

        // Listen for active data stream progress frames
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            if (progressBar) progressBar.style.width = `${percentComplete}%`;
            if (progressPercent) progressPercent.textContent = `${percentComplete}%`;
          }
        });

        // Parse return data payload on close response hooks
        xhr.onload = async function() {
          submitBtn.textContent = "Post Comment";
          submitBtn.disabled = false;
          
          // Clear visual loader rows out of view layout dynamically
          if (progressWrapper) progressWrapper.style.display = 'none';

          if (xhr.status >= 200 && xhr.status < 300) {
            commentField.value = ""; 
            resetStarSelectorInterfaceNode();
            
            // Re-fetch clean active lists from PostgreSQL backend rows
            const refreshRes = await fetch(`${API_BASE_URL}/api/reviews/details/${currentActiveReviewId}?email=${encodeURIComponent(userEmail)}`);
            const refreshData = await refreshRes.json(); 
            
            renderCommentsListCollection(refreshData.comments, refreshData.is_admin);
            updateModalHeaderStars(refreshData.review.avg_rating, refreshData.review.rating_count, refreshData.user_rating);
            
            await fetchAndRenderUserReviews();
            await fetchAndRenderAudienceReviews();
          } else {
            alert("Error processing community message packets.");
          }
        };

        xhr.onerror = function() {
          alert("Network execution failure attempting link communication.");
          submitBtn.textContent = "Post Comment";
          submitBtn.disabled = false;
          if (progressWrapper) progressWrapper.style.display = 'none';
        };

        // Dispatch text stream across the active pipeline network gateway
        xhr.send(JSON.stringify({ 
          email: userEmail, 
          commentText: commentField.value.trim(), 
          rating: null 
        }));

      } catch (err) { 
        console.error(err);
        submitBtn.textContent = "Post Comment";
        submitBtn.disabled = false;
        if (progressWrapper) progressWrapper.style.display = 'none';
      }
    });
  }

  // 5. GLOBAL INTERACTIVE EVENT DELEGATION CAPTURE FOR COMMUNITY ELEMENTS
  document.addEventListener('click', async (e) => {
    const userEmail = localStorage.getItem("userEmail");

    // ============================================================
    // A. INLINE RECENT COMMENT DELETE HANDLER (CUSTOM MODAL UPGRADE)
    // ============================================================
    const trashBtn = e.target.closest('.comment-delete-trigger-action-node');
    if (trashBtn) {
      e.preventDefault();
      const commentId = trashBtn.getAttribute('data-comment-id');
      
      // Select the layout confirmation modal elements safely
      const deleteOverlay = document.getElementById('delete-confirm-overlay');
      const confirmDeleteBtn = document.getElementById('delete-confirm-btn');
      const cancelDeleteBtn = document.getElementById('delete-cancel-btn');
      
      if (deleteOverlay && confirmDeleteBtn && cancelDeleteBtn) {
        // Force reveal the custom dark alert component overlay
        deleteOverlay.style.display = 'flex';
        
        // Dissolve dialogue window panel harmlessly if dismissed
        cancelDeleteBtn.onclick = function() {
          deleteOverlay.style.display = 'none';
        };
        
        // Dispatch backend network package parameters on verified confirmation click
        confirmDeleteBtn.onclick = async function() {
          deleteOverlay.style.display = 'none';
          
          try {
            const response = await fetch(`${API_BASE_URL}/api/comments/${commentId}`, {
              method: "DELETE", 
              headers: { "Content-Type": "application/json" }, 
              body: JSON.stringify({ email: userEmail })
            });
            
            if (response.ok) {
              const refreshRes = await fetch(`${API_BASE_URL}/api/reviews/details/${currentActiveReviewId}?email=${encodeURIComponent(userEmail || '')}`);
              const refreshData = await refreshRes.json(); 
              
              // Cleanly map fresh data tree layers instantly onto feed positions
              renderCommentsListCollection(refreshData.comments, refreshData.is_admin);
              updateModalHeaderStars(refreshData.review.avg_rating, refreshData.review.rating_count, refreshData.user_rating);
              
              await fetchAndRenderUserReviews();
              await fetchAndRenderAudienceReviews();
            }
          } catch (err) { 
            console.error("Error dispatching comment removal:", err); 
          }
        };
      }
      return;
    }

    // B. INLINE COMMENT UPVOTE HANDLER
    const upvoteBtn = e.target.closest('.comment-like-trigger-node');
    if (upvoteBtn) {
      e.preventDefault();
      if (!userEmail) { alert("Please sign in to upvote comments!"); return; }
      try {
        const response = await fetch(`${API_BASE_URL}/api/comments/like/${upvoteBtn.getAttribute('data-comment-id')}`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: userEmail })
        });
        const data = await response.json();
        if (data.success) {
          const refreshRes = await fetch(`${API_BASE_URL}/api/reviews/details/${currentActiveReviewId}?email=${encodeURIComponent(userEmail)}`);
          const refreshData = await refreshRes.json();
          // FIX: Added refreshData.is_admin here
          renderCommentsListCollection(refreshData.comments, refreshData.is_admin);
        }
      } catch (err) { console.error(err); }
      return;
    }

    // C. INLINE COMMENT DOWNVOTE PERSISTENCE HANDLER
    const downvoteBtn = e.target.closest('.comment-downvote-trigger-node');
    if (downvoteBtn) {
      e.preventDefault();
      if (!userEmail) { alert("Please sign in to downvote comments!"); return; }
      try {
        const response = await fetch(`${API_BASE_URL}/api/comments/dislike/${downvoteBtn.getAttribute('data-comment-id')}`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: userEmail })
        });
        if (response.ok) {
          const refreshRes = await fetch(`${API_BASE_URL}/api/reviews/details/${currentActiveReviewId}?email=${encodeURIComponent(userEmail)}`);
          const refreshData = await refreshRes.json();
          // FIX: Added refreshData.is_admin here
          renderCommentsListCollection(refreshData.comments, refreshData.is_admin);
        }
      } catch (err) { console.error(err); }
      return;
    }

    // D. DYNAMIC REDDIT-STYLE INLINE REPLY INPUT BOX INJECTION
    const replyBtn = e.target.closest('.comment-reply-trigger-node');
    if (replyBtn) {
      e.preventDefault();
      const commentId = replyBtn.getAttribute('data-comment-id');
      const targetContainer = document.getElementById(`reply-container-${commentId}`);
      if (!targetContainer) return;

      const existingBox = targetContainer.querySelector('.reddit-inline-reply-box');
      if (existingBox) {
        existingBox.remove();
      } else {
        const inputFrame = document.createElement('div');
        inputFrame.className = 'reddit-inline-reply-box';
        inputFrame.style = "margin-block: 10px; display: flex; flex-direction: column; gap: 8px; background: #132226; padding: 12px; border-radius: 8px; border: 1px solid #243337; margin-left: 36px;";
        inputFrame.innerHTML = `
          <textarea id="reply-field-${commentId}" placeholder="Type a community response reply..." class="login-input comment-textarea" style="min-height: 50px; height: 50px; padding: 8px !important; background: #0b1416 !important; color: white !important;"></textarea>
          <div style="display: flex; justify-content: flex-end; gap: 8px;">
            <button class="btn comment-reply-cancel-action-btn" style="padding: 4px 12px; font-size: 11px; border-color: #243337; color: white;">Cancel</button>
            <button class="signin-submit-btn comment-reply-submit-action-btn" style="width: auto; margin-top: 0; padding: 4px 14px; font-size: 11px; border-radius: 20px;" data-comment-id="${commentId}">Reply</button>
          </div>
        `;
        targetContainer.insertBefore(inputFrame, targetContainer.firstChild);
        document.getElementById(`reply-field-${commentId}`)?.focus();
      }
      return;
    }

    // E. INLINE REPLY FORM SUBMISSION ROUTE PIPELINE
    const submitReplyBtn = e.target.closest('.comment-reply-submit-action-btn');
    if (submitReplyBtn) {
      e.preventDefault();
      const commentId = submitReplyBtn.getAttribute('data-comment-id');
      const replyField = document.getElementById(`reply-field-${commentId}`);
      if (!replyField || !replyField.value.trim()) return;
      if (!userEmail) { alert("Please sign in to reply!"); return; }

      try {
        const response = await fetch(`${API_BASE_URL}/api/reviews/details/${currentActiveReviewId}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            commentText: replyField.value.trim(),
            rating: null,
            // FIX: Explicitly cast the commentId to a clean integer before transmission
            parentCommentId: commentId ? parseInt(commentId, 10) : null
          })
        });

        if (response.ok) {
          const refreshRes = await fetch(`${API_BASE_URL}/api/reviews/details/${currentActiveReviewId}?email=${encodeURIComponent(userEmail)}`);
          const refreshData = await refreshRes.json(); 
          // FIX: Added refreshData.is_admin here
          renderCommentsListCollection(refreshData.comments, refreshData.is_admin);
          updateModalHeaderStars(refreshData.review.avg_rating, refreshData.review.rating_count, refreshData.user_rating);
          await fetchAndRenderUserReviews();
          await fetchAndRenderAudienceReviews();
        }
      } catch (err) { console.error(err); }
      return;
    }

    // F. INLINE REPLY BOX CLOSURE DISMISSAL
    if (e.target.closest('.comment-reply-cancel-action-btn')) {
      e.preventDefault();
      e.target.closest('.reddit-inline-reply-box')?.remove();
    }

    // ============================================================
    // G. ADMIN/OWNER ACTION: LIVE INLINE COMMENT EDITING WORKSPACE
    // ============================================================
    const commentEditBtn = e.target.closest('.comment-edit-action-trigger-node');
    if (commentEditBtn) {
      e.preventDefault();
      const commentId = commentEditBtn.getAttribute('data-comment-id');
      const textContainer = document.getElementById(`comment-body-text-${commentId}`);
      if (!textContainer) return;

      // Guard check: prevent duplicate editor instances from stacking
      const parentBody = textContainer.parentElement;
      if (parentBody.querySelector('.reddit-inline-edit-box')) return;

      const currentText = textContainer.textContent.trim();
      
      // Temporarily conceal original static paragraph row
      textContainer.style.display = 'none';

      // Inject professional inline editing panel workspace matching system specs
      const editBox = document.createElement('div');
      editBox.className = 'reddit-inline-edit-box';
      editBox.style = "margin-top: 10px; display: flex; flex-direction: column; gap: 10px; background: #0b1416; padding: 12px; border-radius: 6px; border: 1px solid #243337; width: 100%;";
      editBox.innerHTML = `
        <textarea id="edit-field-${commentId}" class="login-input comment-textarea" style="min-height: 75px; height: 75px; padding: 10px !important; background: #132226 !important; border-color: #243337 !important; color: white !important; width: 100%; border-radius: 4px; resize: vertical; font-family: var(--ff-poppins); font-size: 13px; line-height: 1.5;">${currentText}</textarea>
        <div style="display: flex; justify-content: flex-end; gap: 8px;">
          <button type="button" class="btn comment-edit-cancel-action-btn" data-comment-id="${commentId}" style="padding: 6px 16px; font-size: 11px; border: 1px solid #243337; color: white; background: transparent; cursor: pointer; border-radius: 4px; font-weight: 600;">Cancel</button>
          <button type="button" class="signin-submit-btn comment-edit-save-action-btn" data-comment-id="${commentId}" style="width: auto; margin-top: 0; padding: 6px 20px; font-size: 11px; border-radius: 4px; background: var(--citrine); color: black; font-weight: 700; border: none; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px;">Save</button>
        </div>
      `;
      
      parentBody.appendChild(editBox);
      
      // Auto focus the input frame and place cursor at end of character row
      const textarea = document.getElementById(`edit-field-${commentId}`);
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
      }
      return;
    }

    // ============================================================
    // G1. INLINE EDIT WORKSPACE CANCEL DISMISSAL HANDLER
    // ============================================================
    const cancelEditBtn = e.target.closest('.comment-edit-cancel-action-btn');
    if (cancelEditBtn) {
      e.preventDefault();
      const commentId = cancelEditBtn.getAttribute('data-comment-id');
      const textContainer = document.getElementById(`comment-body-text-${commentId}`);
      
      // Restore standard comment view visibility
      if (textContainer) textContainer.style.display = 'block';
      
      // Purge the editor from DOM paths
      e.target.closest('.reddit-inline-edit-box')?.remove();
      return;
    }

    // ============================================================
    // G2. INLINE EDIT WORKSPACE SAVE UPDATE DISPATCH PIPELINE
    // ============================================================
    const saveEditBtn = e.target.closest('.comment-edit-save-action-btn');
    if (saveEditBtn) {
      e.preventDefault();
      const commentId = saveEditBtn.getAttribute('data-comment-id');
      const editField = document.getElementById(`edit-field-${commentId}`);
      if (!editField || !editField.value.trim()) return;

      try {
        saveEditBtn.textContent = "Saving...";
        saveEditBtn.disabled = true;

        const response = await fetch(`${API_BASE_URL}/api/comments/${commentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail, commentText: editField.value.trim() })
        });
        
        if (response.ok) {
          // Re-hydrate the live forum list entries seamlessly from active datasets
          const refreshRes = await fetch(`${API_BASE_URL}/api/reviews/details/${currentActiveReviewId}?email=${encodeURIComponent(userEmail || '')}`);
          const refreshData = await refreshRes.json();
          renderCommentsListCollection(refreshData.comments, refreshData.is_admin);
        } else {
          alert("Unauthorized modification or missing packet parameters.");
          saveEditBtn.textContent = "Save";
          saveEditBtn.disabled = false;
        }
      } catch (err) { 
        console.error(err); 
        saveEditBtn.textContent = "Save";
        saveEditBtn.disabled = false;
      }
      return;
    }

    // H. ADMIN EXCLUSIVE ACTION: PERSISTENT COMMENT VERIFICATION BADGE TOGGLE
    const commentVerifyBtn = e.target.closest('.comment-verify-action-trigger-node');
    if (commentVerifyBtn) {
      e.preventDefault();
      const commentId = commentVerifyBtn.getAttribute('data-comment-id');
      try {
        const response = await fetch(`${API_BASE_URL}/api/comments/verify/${commentId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail })
        });
        if (response.ok) {
          const refreshRes = await fetch(`${API_BASE_URL}/api/reviews/details/${currentActiveReviewId}?email=${encodeURIComponent(userEmail || '')}`);
          const refreshData = await refreshRes.json();
          renderCommentsListCollection(refreshData.comments, refreshData.is_admin);
        }
      } catch (err) { console.error(err); }
      return;
    }
  });

  // 6. INTERACTIVE STAR SELECTION NODE RULES
  const starContainer = document.getElementById('comment-star-selector');
  if (starContainer) {
    const starsArr = Array.from(starContainer.querySelectorAll('.star-nodes ion-icon'));
    starsArr.forEach(star => {
      star.addEventListener('mouseenter', function() {
        const val = parseInt(this.getAttribute('data-value'));
        starsArr.forEach((s, idx) => s.classList.toggle('hovered-star', idx < val));
      });
      star.addEventListener('mouseleave', function() { starsArr.forEach(s => s.classList.remove('hovered-star')); });
      star.addEventListener('click', function() {
        activeSelectedRating = parseInt(this.getAttribute('data-value'));
        starsArr.forEach((s, idx) => {
          s.classList.toggle('selected-star', idx < activeSelectedRating);
          s.setAttribute('name', idx < activeSelectedRating ? 'star' : 'star-outline');
        });
      });
    });
  }

  function resetStarSelectorInterfaceNode() {
    activeSelectedRating = 0;
    const starContainer = document.getElementById('comment-star-selector');
    if (starContainer) {
      starContainer.querySelectorAll('.star-nodes ion-icon').forEach(s => {
        s.classList.remove('selected-star', 'hovered-star'); s.setAttribute('name', 'star-outline');
      });
    }
  }

 if (uploadReviewBtn && uploadModal) {
    uploadReviewBtn.addEventListener('click', () => {
      if (!localStorage.getItem("userToken")) {
        alert("Please sign in to upload a movie review!");
        document.getElementById('signin-modal-overlay')?.classList.add('active');
      } else { 
        uploadModal.classList.add('active'); 
        document.body.classList.add('active'); 
        
        // FIX: Look for the checkbox wrapper and turn it on if the user is an admin
        const adminCheckbox = document.getElementById('admin-feature-checkbox-wrapper');
        if (adminCheckbox) {
          adminCheckbox.style.display = localStorage.getItem("isAdmin") === "true" ? "flex" : "none";
        }
      }
    });
  }
  if (closeUploadBtn && uploadModal) { closeUploadBtn.addEventListener('click', () => { uploadModal.classList.remove('active'); document.body.classList.remove('active'); }); }
  if (uploadModal) { uploadModal.addEventListener('click', (e) => { if (e.target === uploadModal) { uploadModal.classList.remove('active'); document.body.classList.remove('active'); } }); }
  if (uploadZone && fileInput) { uploadZone.addEventListener('click', () => fileInput.click()); }
  if (fileInput && previewImg && uploadPrompt) {
    fileInput.addEventListener('change', function() {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.addEventListener('load', function() {
          previewImg.src = this.result; previewImg.style.display = 'block'; uploadPrompt.style.opacity = '0'; base64ImageString = this.result; 
        });
        reader.readAsDataURL(file);
      }
    });
  }

  if (uploadForm) {
    uploadForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // FIX 3: Trim incoming field data values right at intercept edge
      const movieName = document.getElementById('review-movie-name').value.trim();
      const rawDateSelected = document.getElementById('review-movie-date').value;
      const reviewText = document.getElementById('review-movie-text').value.trim();
      
      const userEmail = localStorage.getItem("userEmail");
      const submitBtn = this.querySelector('button[type="submit"]');
      const featuredCheckbox = document.getElementById('review-is-featured');
      const isFeaturedChecked = featuredCheckbox ? featuredCheckbox.checked : false;
      const checkedGenrePills = Array.from(document.querySelectorAll('.genre-checkbox-item:checked')).map(cb => cb.value);

      // ANTI-SPAM PROTECTION GUARD: Detects and rejects empty spaces or blank text blocks
      if (!movieName || !rawDateSelected || !reviewText) {
        alert("Submission Rejected! Workspace text blocks cannot be empty or contain only blank spaces.");
        return;
      }

      // DATE CONVERSION HELPER: Converts native format "YYYY-MM-DD" to your established style "Jun 20, 2026"
      const dateFormattingInstance = new Date(rawDateSelected);
      const formattedPublishDateString = dateFormattingInstance.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      // Select layout progress UI components
      const progressWrapper = document.getElementById('upload-progress-wrapper');
      const progressBar = document.getElementById('upload-progress-bar');
      const progressPercent = document.getElementById('upload-progress-percent');
      const statusText = document.getElementById('upload-status-text');

      try {
        submitBtn.textContent = "Processing..."; 
        submitBtn.disabled = true;

        if (progressWrapper) progressWrapper.style.display = 'block';
        if (progressBar) progressBar.style.width = '0%';
        if (progressPercent) progressPercent.textContent = '0%';
        if (statusText) statusText.textContent = 'Connecting to upload stream node...';

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "${API_BASE_URL}/api/reviews/upload");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            if (progressBar) progressBar.style.width = `${percentComplete}%`;
            if (progressPercent) progressPercent.textContent = `${percentComplete}%`;
            
            if (percentComplete < 50) {
              if (statusText) statusText.textContent = 'Streaming payload binary packets...';
            } else {
              if (statusText) statusText.textContent = 'Completing data payload file transfer...';
            }
          }
        });

        xhr.onload = function() {
          submitBtn.textContent = "Publish Review Package";
          submitBtn.disabled = false;
          
          try {
            const data = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) {
              const successOverlay = document.getElementById('success-alert-overlay');
              const successMsg = document.getElementById('success-alert-message');
              const successBtn = document.getElementById('success-alert-btn');
              
              if (successOverlay && successBtn) {
                if (successMsg) successMsg.textContent = data.message;
                successOverlay.classList.add('active');
                
                successBtn.onclick = function() {
                  successOverlay.classList.remove('active');
                  uploadForm.reset();
                  window.location.href = "index.html";
                };
              } else {
                window.location.href = "index.html";
              }
            } else {
              alert(data.message || "Upload process failure tracking files.");
              if (progressWrapper) progressWrapper.style.display = 'none';
            }
          } catch (err) {
            alert("Server validation processing failure logs.");
            if (progressWrapper) progressWrapper.style.display = 'none';
          }
        };

        xhr.send(JSON.stringify({ 
          email: userEmail, 
          movieName: movieName, 
          publishDate: formattedPublishDateString, // Passes cleanly parsed readable date strings to DB indexes
          reviewText: reviewText, 
          imageData: base64ImageString,
          isFeatured: isFeaturedChecked,
          genres: checkedGenrePills
        }));

      } catch (err) { 
        alert("Pipeline error communicating with backend server."); 
        submitBtn.textContent = "Publish Review Package"; 
        submitBtn.disabled = false;
        if (progressWrapper) progressWrapper.style.display = 'none';
      }
    });
  }


  // ==========================================
  // 7. BASE REVIEW FILEREADER UPLOAD LAYER CONTROLS (STANDALONE WIDGET)
  // ==========================================
  if (uploadReviewBtn) {
    uploadReviewBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Guard entry: force sign-in prompt modal if no active browser token is detected
      if (!localStorage.getItem("userToken")) {
        alert("Please sign in to upload a movie review!");
        document.getElementById('signin-modal-overlay')?.classList.add('active');
      } else { 
        // Redirect seamlessly out to the dedicated review workspace page
        window.location.href = "upload-review.html";
      }
    });
  }

  // Dedicated check condition executed exclusively when opening upload-review.html
  if (window.location.pathname.includes('upload-review.html')) {
    // Session Verification Guard
    if (!localStorage.getItem("userToken")) {
      alert("Unauthorized entry. Please sign in first.");
      window.location.href = "index.html";
    }

    // Auto-reveal premium management checkbox options strictly for Admin sessions
    const adminCheckbox = document.getElementById('admin-feature-checkbox-wrapper');
    if (adminCheckbox) {
      adminCheckbox.style.display = localStorage.getItem("isAdmin") === "true" ? "flex" : "none";
    }
  }



  // ==========================================
  // 8. SECURE FULL-PAGE ROUTING & HYDRATION (IMDb PAGE ROUTER)
  // ==========================================
  // FIX: Added recommendationsGrid into the target array array tracking loops
  [featuredGrid, recommendationsGrid, reviewsGrid, audienceGrid].forEach(grid => {
    if (grid) {
      grid.addEventListener('click', async (e) => {
        const targetedCard = e.target.closest('.review-click-target-node');
        if (targetedCard) {
          const id = targetedCard.getAttribute('data-review-id');
          // Uses the base URL variable dynamically
          await fetch(`${API_BASE_URL}/api/reviews/view/${id}`, { method: "POST" }).catch(err => console.error(err));
          window.location.href = `view-review.html?id=${id}`;
        }
      });
    }
  });

  // Automatically check URL parameters and build data if sitting on view-review.html
  if (window.location.pathname.includes('view-review.html')) {
    const pageUrlParams = new URLSearchParams(window.location.search);
    const activeRouteId = pageUrlParams.get('id');
    if (activeRouteId) {
      openReviewDetailsViewport(activeRouteId);
    }
  }
}); // Secures main master wrapper block structure