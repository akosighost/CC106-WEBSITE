'use strict';

/**
 * navbar variables
 */

const navOpenBtn = document.querySelector("[data-menu-open-btn]");
const navCloseBtn = document.querySelector("[data-menu-close-btn]");
const navbar = document.querySelector("[data-navbar]");
const overlay = document.querySelector("[data-overlay]");

const navElemArr = [navOpenBtn, navCloseBtn, overlay];

for (let i = 0; i < navElemArr.length; i++) {

  navElemArr[i].addEventListener("click", function () {

    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("active");

  });

}



/**
 * header sticky
 */

const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {

  window.scrollY >= 10 ? header.classList.add("active") : header.classList.remove("active");

});



/**
 * go top
 */

const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", function () {

  window.scrollY >= 500 ? goTopBtn.classList.add("active") : goTopBtn.classList.remove("active");

});

/*-----------------------------------*\
 * #REVIEW RATING CALCULATOR
\*-----------------------------------*/

/**
 * Filmlane Official Script
 * Includes: Rating Calculation, Sorting, and See More/Less
 */

document.addEventListener('DOMContentLoaded', function() {

  /* ======================================================
     1. CALCULATE AVERAGE RATING & PROGRESS BARS
     ====================================================== */
  function calculateAverageRating() {
    // 1. Select ONLY cards that actually have data inside
    const cards = document.querySelectorAll('.review-card[data-rating]');
    const totalCards = cards.length;
    
    // Reset Counts
    let totalScore = 0;
    let starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  
    // Loop through cards to gather data
    cards.forEach(card => {
      const ratingAttr = card.getAttribute('data-rating');
      const rating = ratingAttr ? parseFloat(ratingAttr) : 0;
      
      if (!isNaN(rating) && rating > 0) {
        totalScore += rating;
        
        let roundedRating = Math.round(rating); 
        if(roundedRating < 1) roundedRating = 1;
        if(roundedRating > 5) roundedRating = 5;
        
        starCounts[roundedRating]++;

        // Update individual card stars to match data-rating
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
  
    // Update Left Side (Average)
    const avgScoreElement = document.getElementById('avg-score');
    const avgStarsElement = document.getElementById('avg-stars');
    const totalCountElement = document.getElementById('total-reviews-count');
  
    if (avgScoreElement && totalCards > 0) {
      const average = (totalScore / totalCards).toFixed(1); // e.g. "4.5"
      avgScoreElement.textContent = average;
      totalCountElement.textContent = `${totalCards} Ratings`;
  
      // --- NEW: LOGIC FOR HALF STARS ---
      let starHTML = '';
      for (let i = 1; i <= 5; i++) {
        if (average >= i) {
          // Full Star (e.g., if avg is 4.5, i=1,2,3,4 are full)
          starHTML += '<ion-icon name="star"></ion-icon>';
        } else if (average >= i - 0.5) {
          // Half Star (e.g., if avg is 4.5, i=5 is half)
          starHTML += '<ion-icon name="star-half-outline"></ion-icon>';
        } else {
          // Empty Star
          starHTML += '<ion-icon name="star-outline"></ion-icon>';
        }
      }
      avgStarsElement.innerHTML = starHTML;
      // ---------------------------------

    } else if (avgScoreElement) {
      avgScoreElement.textContent = "0.0";
      totalCountElement.textContent = "No Ratings";
    }
  
    // Update Right Side (Blue Bars)
    for (let i = 1; i <= 5; i++) {
      const bar = document.getElementById(`bar-${i}`);
      if (bar) {
        if (totalCards > 0) {
          const percentage = (starCounts[i] / totalCards) * 100;
          bar.style.width = `${percentage}%`;
        } else {
          bar.style.width = '0%';
        }
      }
    }
  }
  
  // Run calculation immediately
  calculateAverageRating();


  /* ======================================================
     2. SORTING FUNCTIONALITY (Highest / Lowest)
     ====================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn[data-sort]');
  const reviewGrid = document.querySelector('.review-grid');

  if (filterButtons.length > 0 && reviewGrid) {
    
    filterButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        
        // Visual: Update active button
        filterButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    
        // Logic: Sort the cards
        const sortType = this.getAttribute('data-sort');
        const cards = Array.from(document.querySelectorAll('.review-card'));
    
        cards.sort((a, b) => {
          const ratingA = parseFloat(a.getAttribute('data-rating')) || 0;
          const ratingB = parseFloat(b.getAttribute('data-rating')) || 0;
    
          if (sortType === 'highest') {
            return ratingB - ratingA; // High to Low
          } else {
            return ratingA - ratingB; // Low to High
          }
        });
    
        // Clear grid and re-append in new order
        reviewGrid.innerHTML = '';
        cards.forEach(card => {
          reviewGrid.appendChild(card);
        });

      });
    });
  }


  /* ======================================================
     3. "SEE MORE" BUTTON LOGIC
     ====================================================== */
  const cards = document.querySelectorAll('.review-card');

  cards.forEach(card => {
    const text = card.querySelector('.review-text');
    const btn = card.querySelector('.see-more-btn');

    if (text && btn) {
      // Check if text is long enough to need a button
      if (text.scrollHeight > text.clientHeight) {
        btn.style.display = 'inline-block';
      } else {
        btn.style.display = 'none';
      }

      // Click event
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
    
    // Height of the window
    const windowHeight = window.innerHeight;
    // Distance from top of viewport to the element
    const elementTop = revealElements[i].getBoundingClientRect().top;
    // How much of the element must be visible before triggering (100px)
    const elementVisible = 100; 

    if (elementTop < windowHeight - elementVisible) {
      revealElements[i].classList.add("active");
    }
  }
}

// Listen for scroll events
window.addEventListener("scroll", scrollReveal);
// Trigger once on load to show elements already on screen
window.addEventListener("load", scrollReveal);

/*-----------------------------------*\
 * #LOAD EXTERNAL REVIEWS
\*-----------------------------------*/

function loadExternalReviews() {
  // 1. Find all cards that have a 'data-review-file' attribute
  const cards = document.querySelectorAll('.review-card[data-review-file]');

  cards.forEach(card => {
    const fileName = card.getAttribute('data-review-file');
    const textElement = card.querySelector('.review-text');
    const btn = card.querySelector('.see-more-btn');

    // 2. Fetch the text file
    fetch(`./assets/reviews/${fileName}`)
      .then(response => {
        if (!response.ok) throw new Error("Review file not found");
        return response.text();
      })
      .then(text => {
        // 3. Inject the text into the HTML
        textElement.textContent = text;

        // 4. IMPORTANT: Re-check if we need the "See More" button
        // We do this here because the text size just changed!
        if (textElement.scrollHeight > textElement.clientHeight) {
          btn.style.display = 'inline-block';
        } else {
          btn.style.display = 'none';
        }
      })
      .catch(error => {
        console.error('Error:', error);
        textElement.textContent = "Could not load review text.";
      });
  });
}

// Run this function when the page loads
window.addEventListener('load', loadExternalReviews);

/*-----------------------------------*\
 * #REVIEW POPUP MODAL LOGIC
\*-----------------------------------*/

document.addEventListener('DOMContentLoaded', function() {
  
  // Define variables INSIDE this function so we know HTML is ready
  const reviewModalOverlay = document.getElementById('review-modal-overlay');
  const modalUserImg = document.getElementById('modal-user-img');
  const modalUserName = document.getElementById('modal-user-name');
  const modalUserRating = document.getElementById('modal-user-rating');
  const modalReviewText = document.getElementById('modal-review-text');
  const closeReviewBtn = document.querySelector('.close-review-btn');

  // Safety Check: If modal doesn't exist, stop to prevent errors
  if (!reviewModalOverlay) return;

  // Function to open/close modal
  function toggleReviewModal(show) {
    if (show) {
      reviewModalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; 
    } else {
      reviewModalOverlay.classList.remove('active');
      document.body.style.overflow = 'visible'; 
    }
  }

  // Close when clicking outside
  reviewModalOverlay.addEventListener('click', (e) => {
    if (e.target === reviewModalOverlay) toggleReviewModal(false);
  });

  // Close when clicking the X button
  if (closeReviewBtn) {
    closeReviewBtn.addEventListener('click', () => toggleReviewModal(false));
  }

  // Initialize Expand Buttons
  function initExpandButtons() {
    const expandBtns = document.querySelectorAll('.expand-btn');

    expandBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const card = this.closest('.review-card');
        
        // Extract Data
        const imgSrc = card.querySelector('.avatar img').src;
        const name = card.querySelector('.username').textContent;
        const ratingHtml = card.querySelector('.rating-wrapper').innerHTML;
        const fullText = card.querySelector('.review-text').textContent;

        // Populate Modal
        if(modalUserImg) modalUserImg.src = imgSrc;
        if(modalUserName) modalUserName.textContent = name;
        if(modalUserRating) modalUserRating.innerHTML = ratingHtml;
        if(modalReviewText) modalReviewText.textContent = fullText;

        // Show Modal
        toggleReviewModal(true);
      });
    });
  }

  // Run initialization
  initExpandButtons();
});

/*-----------------------------------*\
 * #CUSTOM SHARE MODAL LOGIC
\*-----------------------------------*/

// Variables for the Share Modal
const shareModal = document.getElementById('share-modal-overlay');
const shareInput = document.getElementById('share-link-input');
const copyModalBtn = document.getElementById('copy-modal-btn');

// Social Link Elements
const sFb = document.getElementById('s-fb');
const sTw = document.getElementById('s-tw');
const sWa = document.getElementById('s-wa');
const sPin = document.getElementById('s-pin');
const sMail = document.getElementById('s-mail');

// Toggle Modal Visibility (Required for the Close Button X)
function toggleShareModal(show) {
  if (show) {
    shareModal.classList.add('active');
  } else {
    shareModal.classList.remove('active');
  }
}

// Close modal when clicking outside the box
if (shareModal) {
  shareModal.addEventListener('click', (e) => {
    if (e.target === shareModal) toggleShareModal(false);
  });
}

// Initialize Share & Copy Actions
function initReviewActions() {
  const copyBtns = document.querySelectorAll('.copy-btn');
  const shareBtns = document.querySelectorAll('.share-btn');

  // 1. SIMPLE COPY BUTTON (On the card itself)
  copyBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const card = this.closest('.review-card');
      // Fallback: if review text is loading, don't copy
      const textEl = card.querySelector('.review-text');
      if (!textEl) return;
      
      const text = textEl.textContent;
      
      // Use Clipboard API
      navigator.clipboard.writeText(text).then(() => {
        const icon = this.querySelector('ion-icon');
        const originalIcon = icon.getAttribute('name');
        
        // Visual Feedback
        icon.setAttribute('name', 'checkmark-outline');
        setTimeout(() => icon.setAttribute('name', originalIcon), 2000);
      }).catch(err => console.error('Copy failed:', err));
    });
  });

  // 2. SHARE BUTTON (Opens the Modal)
  shareBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const card = this.closest('.review-card');
      const text = card.querySelector('.review-text').textContent;
      
      // Get current page URL
      const url = window.location.href; 
      
      // Set the input value in the modal
      if (shareInput) shareInput.value = url;

      // Update Social Links dynamically
      const msg = encodeURIComponent(`Check out this review: "${text.substring(0, 100)}..."`);
      const encUrl = encodeURIComponent(url);

      if(sFb) sFb.href = `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`;
      if(sTw) sTw.href = `https://twitter.com/intent/tweet?text=${msg}&url=${encUrl}`;
      if(sWa) sWa.href = `https://api.whatsapp.com/send?text=${msg}%20${encUrl}`;
      if(sPin) sPin.href = `https://pinterest.com/pin/create/button/?url=${encUrl}&description=${msg}`;
      if(sMail) sMail.href = `mailto:?subject=Movie Review&body=${msg}%0A${encUrl}`;

      // Open Modal
      toggleShareModal(true);
    });
  });
}

// 3. COPY BUTTON INSIDE MODAL
if (copyModalBtn) {
  copyModalBtn.addEventListener('click', () => {
    shareInput.select();
    shareInput.setSelectionRange(0, 99999); // Mobile compatibility
    navigator.clipboard.writeText(shareInput.value).then(() => {
      copyModalBtn.textContent = "Copied!";
      copyModalBtn.classList.add('copied');
      setTimeout(() => {
        copyModalBtn.textContent = "Copy";
        copyModalBtn.classList.remove('copied');
      }, 2000);
    });
  });
}

/*-----------------------------------*\
 * #ABOUT FILM POPUP LOGIC
\*-----------------------------------*/

// 1. Select Elements
const aboutLink = document.getElementById('about-film-link');
const aboutModal = document.getElementById('about-modal-overlay');
const closeAboutBtn = document.getElementById('close-about-btn');

// 2. Open Modal Function
if (aboutLink && aboutModal) {
  aboutLink.addEventListener('click', function(e) {
    e.preventDefault(); // Stop page from jumping to top
    aboutModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop background scroll
  });
}

// 3. Close Modal Function (X button)
if (closeAboutBtn) {
  closeAboutBtn.addEventListener('click', function() {
    aboutModal.classList.remove('active');
    document.body.style.overflow = 'visible';
  });
}

// 4. Close when clicking background
if (aboutModal) {
  aboutModal.addEventListener('click', function(e) {
    if (e.target === aboutModal) {
      aboutModal.classList.remove('active');
      document.body.style.overflow = 'visible';
    }
  });
}


/*-----------------------------------*\
 * #REFERENCES POPUP LOGIC
\*-----------------------------------*/

// 1. Select Elements
const refsLink = document.getElementById('references-link');
const refsModal = document.getElementById('references-modal-overlay');
const closeRefsBtn = document.getElementById('close-references-btn');

// 2. Open Modal Function
if (refsLink && refsModal) {
  refsLink.addEventListener('click', function(e) {
    e.preventDefault(); 
    refsModal.classList.add('active');
    document.body.style.overflow = 'hidden'; 
  });
}

// 3. Close Modal Function (X button)
if (closeRefsBtn) {
  closeRefsBtn.addEventListener('click', function() {
    refsModal.classList.remove('active');
    document.body.style.overflow = 'visible';
  });
}

// 4. Close when clicking background
if (refsModal) {
  refsModal.addEventListener('click', function(e) {
    if (e.target === refsModal) {
      refsModal.classList.remove('active');
      document.body.style.overflow = 'visible';
    }
  });
}

/*-----------------------------------*\
 * #MEMBERS POPUP LOGIC
\*-----------------------------------*/

// 1. Select Elements
const memLink = document.getElementById('members-link');
const memModal = document.getElementById('members-modal-overlay');
const closeMemBtn = document.getElementById('close-members-btn');

// 2. Open Modal Function
if (memLink && memModal) {
  memLink.addEventListener('click', function(e) {
    e.preventDefault(); 
    memModal.classList.add('active');
    document.body.style.overflow = 'hidden'; 
  });
}

// 3. Close Modal Function (X button)
if (closeMemBtn) {
  closeMemBtn.addEventListener('click', function() {
    memModal.classList.remove('active');
    document.body.style.overflow = 'visible';
  });
}

// 4. Close when clicking background
if (memModal) {
  memModal.addEventListener('click', function(e) {
    if (e.target === memModal) {
      memModal.classList.remove('active');
      document.body.style.overflow = 'visible';
    }
  });
}

/*-----------------------------------*\
 * #FOOTER LINKS MODAL LOGIC
\*-----------------------------------*/

// Data for the modals
const footerContent = {
  faq: {
    title: "Frequently Asked Questions",
    text: `Q: Is Filmlane free?\nA: Yes, Filmlane is free to use for browsing movie reviews.\n\nQ: How do I download movies?\nA: Click the download button on the specific movie page (if available).\n\nQ: Can I submit a review?\nA: Currently, reviews are curated by our team.`
  },
  help: {
    title: "Help Center",
    text: `Need assistance? Our support team is here to help.\n\nEmail: aisat.natividad@gmail.com\nPhone: +639924560138\nHours: Mon-Fri, 9am - 5pm EST`
  },
  terms: {
    title: "Terms of Use",
    text: `1. Acceptance of Terms\nBy accessing this website, you agree to be bound by these terms.\n\n2. Use License\nPermission is granted to temporarily download one copy of the materials for personal, non-commercial viewing only.\n\n3. Disclaimer\nThe materials on Filmlane's website are provided on an 'as is' basis.`
  },
  privacy: {
    title: "Privacy Policy",
    text: `Your privacy is important to us.\n\n1. Information Collection\nWe only collect information necessary to provide our services.\n\n2. Cookies\nWe use cookies to improve your browsing experience.\n\n3. Data Protection\nWe do not sell your personal data to third parties.`
  }
};

// Select Elements
const infoModal = document.getElementById('info-modal-overlay');
const infoTitle = document.getElementById('info-modal-title');
const infoText = document.getElementById('info-modal-text');
const closeInfoBtn = document.getElementById('close-info-btn');

// Function to open Info Modal
function openInfoModal(type) {
  const content = footerContent[type];
  if (content) {
    infoTitle.textContent = content.title;
    infoText.textContent = content.text;
    infoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

// Event Listeners for Links
document.getElementById('faq-link')?.addEventListener('click', (e) => { e.preventDefault(); openInfoModal('faq'); });
document.getElementById('help-link')?.addEventListener('click', (e) => { e.preventDefault(); openInfoModal('help'); });
document.getElementById('terms-link')?.addEventListener('click', (e) => { e.preventDefault(); openInfoModal('terms'); });
document.getElementById('privacy-link')?.addEventListener('click', (e) => { e.preventDefault(); openInfoModal('privacy'); });

// Close Logic
if (closeInfoBtn) {
  closeInfoBtn.addEventListener('click', () => {
    infoModal.classList.remove('active');
    document.body.style.overflow = 'visible';
  });
}

if (infoModal) {
  infoModal.addEventListener('click', (e) => {
    if (e.target === infoModal) {
      infoModal.classList.remove('active');
      document.body.style.overflow = 'visible';
    }
  });
}




// Run on load
window.addEventListener('load', initReviewActions);


/*-----------------------------------*\
 * #SIGN IN POPUP LOGIC
\*-----------------------------------*/

// 1. Select Elements
const signinBtn = document.getElementById('signin-btn');
const signinModal = document.getElementById('signin-modal-overlay');
const closeSigninBtn = document.getElementById('close-signin-btn');
const loginForm = document.getElementById('login-form');

// 2. Open Modal Function
if (signinBtn && signinModal) {
  signinBtn.addEventListener('click', function(e) {
    e.preventDefault();
    signinModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
}

// 3. Close Modal Function
if (closeSigninBtn) {
  closeSigninBtn.addEventListener('click', function() {
    signinModal.classList.remove('active');
    document.body.style.overflow = 'visible';
  });
}

// 4. Close on background click
if (signinModal) {
  signinModal.addEventListener('click', function(e) {
    if (e.target === signinModal) {
      signinModal.classList.remove('active');
      document.body.style.overflow = 'visible';
    }
  });
}

// 5. Handle Form Submit (Simulation)
if (loginForm) {
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Stop page reload
    
    // Simulate Fake signing in...
    const btn = this.querySelector('button');
    const originalText = btn.textContent;
    
    btn.textContent = "Signing In...";
    btn.style.opacity = "0.7";
    
    setTimeout(() => {
      alert("Successfully Signed In! (Demo)");
      btn.textContent = originalText;
      btn.style.opacity = "1";
      signinModal.classList.remove('active');
      document.body.style.overflow = 'visible';
    }, 1500);
  });
}



/*-----------------------------------*\
 * #DOWNLOAD BUTTON CHECKER
\*-----------------------------------*/

function initDownloadCheck() {
  // Select the service button (and any other download buttons you want to check)
  const downloadBtns = document.querySelectorAll('.service-btn, .download-btn, .social-link');

  downloadBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const link = this.getAttribute('href');

      // Check if the link is missing, empty, a placeholder '#', a javascript void, or a known placeholder facebook URL
      if (!link || link === '#' || link === 'javascript:void(0)' || link === 'https://www.facebook.com/aisatcollegedasmaph') {
        e.preventDefault(); // Stop the browser from doing anything
        alert("No link available"); // Show the popup message
      }
    });
  });
}

// Run on load
window.addEventListener('load', initDownloadCheck);

/*-----------------------------------*\
 * #LANGUAGE DROPDOWN LOGIC
\*-----------------------------------*/

function initLanguageDropdown() {
  const langToggle = document.getElementById('lang-toggle');
  const langList = document.getElementById('lang-list');
  const langContainer = document.querySelector('.lang-dropdown');
  const langText = document.getElementById('current-lang-text');
  const langItems = document.querySelectorAll('.lang-item');

  // 1. Toggle Dropdown
  if (langToggle) {
    langToggle.addEventListener('click', (e) => {
      e.stopPropagation(); // Stop click from reaching document
      langContainer.classList.toggle('active');
    });
  }

  // 2. Select Language
  langItems.forEach(item => {
    item.addEventListener('click', function() {
      // Remove active class from all
      langItems.forEach(i => i.classList.remove('active'));
      // Add active to clicked
      this.classList.add('active');
      
      // Update the button text (EN, AU, etc.)
      langText.textContent = this.getAttribute('data-lang');
      
      // Close dropdown
      langContainer.classList.remove('active');
    });
  });

  // 3. Close when clicking outside
  document.addEventListener('click', (e) => {
    if (langContainer && !langContainer.contains(e.target)) {
      langContainer.classList.remove('active');
    }
  });
}

// Run on load
window.addEventListener('load', initLanguageDropdown);

/*-----------------------------------*\
 * #LANGUAGE TRANSLATION LOGIC
\*-----------------------------------*/

const translations = {
  'EN': {
    'home': 'Home',
    'movie': 'Movie',
    'tv_show': 'TV Show',
    'web_series': 'Web Series',
    'pricing': 'Pricing',
    'about': 'About Film',
    'references': 'References',
    'members': 'Members',
    'hero_subtitle': 'Movie Review',
    'watch_now': 'Watch now',
    'signin': 'Sign in'
  },
  'AU': {
    'home': 'Home',
    'movie': 'Flicks',
    'tv_show': 'Telly',
    'web_series': 'Web Series',
    'pricing': 'Pricing',
    'about': 'About Film',
    'references': 'References',
    'members': 'Mates',
    'hero_subtitle': 'Movie Review',
    'watch_now': 'Watch now',
    'signin': 'Sign in'
  },
  'AR': {
    'home': 'الرئيسية',
    'movie': 'أفلام',
    'tv_show': 'برامج تلفزيونية',
    'web_series': 'مسلسلات ويب',
    'pricing': 'الأسعار',
    'about': 'عن الفيلم',
    'references': 'المراجع',
    'members': 'الأعضاء',
    'hero_subtitle': 'مراجعة الفيلم',
    'watch_now': 'شاهد الآن',
    'signin': 'تسجيل الدخول'
  },
  'TU': {
    'home': 'Ana Sayfa',
    'movie': 'Film',
    'tv_show': 'TV Şovları',
    'web_series': 'Web Dizileri',
    'pricing': 'Fiyatlandırma',
    'about': 'Film Hakkında',
    'references': 'Referanslar',
    'members': 'Üyeler',
    'hero_subtitle': 'Film İncelemesi',
    'watch_now': 'Şimdi İzle',
    'signin': 'Giriş Yap'
  }
};

function changeLanguage(lang) {
  // 1. Check if translations exist for this language
  if (!translations[lang]) return;

  // 2. Select all elements with data-i18n attribute
  const elements = document.querySelectorAll('[data-i18n]');

  // 3. Loop through and update text
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // 4. Handle Right-to-Left (RTL) for Arabic
  if (lang === 'AR') {
    document.body.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'ar');
  } else {
    document.body.setAttribute('dir', 'ltr');
    document.documentElement.setAttribute('lang', 'en');
  }
}

function initLanguageDropdown() {
  const langToggle = document.getElementById('lang-toggle');
  const langList = document.getElementById('lang-list');
  const langContainer = document.querySelector('.lang-dropdown');
  const langText = document.getElementById('current-lang-text');
  const langItems = document.querySelectorAll('.lang-item');

  // Toggle Dropdown
  if (langToggle) {
    langToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      langContainer.classList.toggle('active');
    });
  }

  // Handle Selection
  langItems.forEach(item => {
    item.addEventListener('click', function() {
      // Visual updates
      langItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
      
      const selectedLang = this.getAttribute('data-lang');
      langText.textContent = selectedLang;
      
      // CALL THE TRANSLATION FUNCTION HERE
      changeLanguage(selectedLang);
      
      langContainer.classList.remove('active');
    });
  });

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (langContainer && !langContainer.contains(e.target)) {
      langContainer.classList.remove('active');
    }
  });
}

window.addEventListener('load', initLanguageDropdown);

/*-----------------------------------*\
 * #SINGLE MEMBER POPUP LOGIC
\*-----------------------------------*/

document.addEventListener('DOMContentLoaded', function() {
  
  const detailModal = document.getElementById('member-detail-modal-overlay');
  const detailImg = document.getElementById('detail-img');
  const detailName = document.getElementById('detail-name');
  const detailRole = document.getElementById('detail-role');
  const closeDetailBtn = document.getElementById('close-detail-btn');

  function openMemberDetail(imgSrc, name, role) {
    if (!detailModal) return;
    if(detailImg) detailImg.src = imgSrc;
    if(detailName) detailName.textContent = name;
    if(detailRole) detailRole.textContent = role.replace('|', '').trim();
    detailModal.classList.add('active');
  }

  document.addEventListener('click', function(e) {
    const memberItem = e.target.closest('.member-item');
    if (memberItem) {
      const img = memberItem.querySelector('img').src;
      const name = memberItem.querySelector('h4').textContent;
      const roleText = memberItem.querySelector('p').textContent;
      const role = roleText.replace('BC5MD', '').trim(); 

      openMemberDetail(img, name, role);
    }
  });

  if (closeDetailBtn) {
    closeDetailBtn.addEventListener('click', () => {
      detailModal.classList.remove('active');
    });
  }

  if (detailModal) {
    detailModal.addEventListener('click', (e) => {
      if (e.target === detailModal) {
        detailModal.classList.remove('active');
      }
    });
  }
});

/*-----------------------------------*\
 * #SEARCH FUNCTIONALITY
\*-----------------------------------*/

document.addEventListener('DOMContentLoaded', function() {
  const searchBtn = document.querySelector('.search-btn');
  const searchModal = document.getElementById('search-modal-overlay');
  const searchInput = document.getElementById('search-input');
  const closeSearchBtn = document.getElementById('close-search-btn');
  const searchStatus = document.getElementById('search-status');
  
  // All movie cards on the page
  const allMovieCards = document.querySelectorAll('.movie-card');

  // Open Search
  if (searchBtn && searchModal) {
    searchBtn.addEventListener('click', () => {
      searchModal.classList.add('active');
      searchInput.focus(); // Auto focus on input
      document.body.style.overflow = 'hidden';
    });
  }

  // Close Search
  function closeSearch() {
    searchModal.classList.remove('active');
    document.body.style.overflow = 'visible';
    // Optional: Reset hidden movies
    allMovieCards.forEach(card => card.closest('li').style.display = 'block');
  }

  if (closeSearchBtn) closeSearchBtn.addEventListener('click', closeSearch);
  
  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) closeSearch();
    });
  }

  // Real-time Filter Logic
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const query = this.value.toLowerCase().trim();
      let matchCount = 0;

      if (query === '') {
        searchStatus.textContent = "Type to search...";
        // Reset all
        allMovieCards.forEach(card => card.closest('li').style.display = 'block');
        return;
      }

      allMovieCards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const parentLi = card.closest('li');

        if (title.includes(query)) {
          parentLi.style.display = 'block'; // Show
          matchCount++;
        } else {
          parentLi.style.display = 'none'; // Hide
        }
      });

      if (matchCount === 0) {
        searchStatus.textContent = `No movies found for "${query}"`;
      } else {
        searchStatus.textContent = `Found ${matchCount} matches. Close this box to see them.`;
      }
    });
  }
});