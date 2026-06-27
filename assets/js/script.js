"use strict";

// 1. Define your base URL FIRST so the code knows what it is
const API_BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://reav-on-api.onrender.com";
    
console.log("Current API URL:", API_BASE_URL);

// --- PASTE THE SPINNER RIGHT HERE ---
// A reusable loading spinner for the data grids
const loadingSpinnerHTML = `
  <div style="grid-column: 1 / -1; display: flex; justify-content: center; padding: 60px 0;">
    <div style="width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.05); border-top-color: var(--citrine); border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
  </div>
  <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
`;
// ------------------------------------

// --- FULL SCREEN PAGE TRANSITION POPUP ---
const pageTransitionOverlay = document.createElement("div");
pageTransitionOverlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(11, 20, 22, 0.85); backdrop-filter: blur(5px); z-index: 9999; display: none; justify-content: center; align-items: center; flex-direction: column;";
pageTransitionOverlay.innerHTML = `
  <div style="width: 50px; height: 50px; border: 4px solid rgba(255,255,255,0.05); border-top-color: var(--citrine); border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
  <p style="color: var(--citrine); margin-top: 20px; font-weight: 600; font-size: 14px; letter-spacing: 1px;">LOADING MOVIE...</p>
`;
document.body.appendChild(pageTransitionOverlay);
// -----------------------------------------

// 2. Now you can safely use it.
// I changed '/api/movies' to '/api/reviews/all' because that route actually exists in your server.js

fetch(`${API_BASE_URL}/api/reviews/all`)
  .then((response) => response.json())
  .then((data) => {
    console.log("Data from backend:", data);
  })
  .catch((error) => console.error("Error fetching data:", error));

console.log("Current API URL:", API_BASE_URL);

// --- MAINTENANCE MODE TOGGLE ---
const IS_MAINTENANCE_MODE = false; // Set to true when you need maintenance

document.addEventListener("DOMContentLoaded", () => {
  // Check if user is an admin
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // Only show maintenance if mode is ON AND user is NOT an admin
  if (IS_MAINTENANCE_MODE && !isAdmin) {
    const maintenanceModal = document.getElementById("maintenance-modal");
    if (maintenanceModal) {
      maintenanceModal.style.display = "flex";
      document.body.style.overflow = "hidden"; // Disable scroll
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const whatsNewModal = document.getElementById("whats-new-modal");
  const whatsNewBtn = document.getElementById("whats-new-btn");

  // Check if the user has already seen the popup
  if (!localStorage.getItem("whatsNewShown")) {
    if (whatsNewModal) {
      whatsNewModal.style.display = "flex";
      document.body.style.overflow = "hidden"; // Stop scrolling
    }
  }

  // Handle clicking "Got it"
  if (whatsNewBtn) {
    whatsNewBtn.addEventListener("click", () => {
      whatsNewModal.style.display = "none";
      document.body.style.overflow = "auto"; // Resume scrolling
      
      // Save the flag so it never shows again
      localStorage.setItem("whatsNewShown", "true");
    });
  }
});

/**
 * Navbar Toggle Logic Controller
 */
document.addEventListener("DOMContentLoaded", () => {
  const navOpenBtn = document.querySelector("[data-menu-open-btn]");
  const navCloseBtn = document.querySelector("[data-menu-close-btn]");
  const navbar = document.querySelector("[data-navbar]");
  const overlay = document.querySelector("[data-overlay]");
  
  // 1. Grab all the links inside the sidebar
  const navLinks = document.querySelectorAll(".navbar-link"); 

  const navElemArr = [navOpenBtn, navCloseBtn, overlay];

  navElemArr.forEach((elem) => {
    if (elem) {
      elem.addEventListener("click", () => {
        navbar.classList.toggle("active");
        overlay.classList.toggle("active");
        document.body.classList.toggle("active");
      });
    }
  });

  // 2. Auto-close sidebar and unlock scrolling when a link is clicked
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      // We don't use toggle here, we force it to remove the active state
      if (navbar) navbar.classList.remove("active");
      if (overlay) overlay.classList.remove("active");
      
      // This is the line that fixes your scrolling bug!
      document.body.classList.remove("active"); 
    });
  });
});

/**
 * Header Sticky & Scroll To Top Trackers
 */
const header = document.querySelector("[data-header]");
const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", () => {
  if (header) {
    window.scrollY >= 10
      ? header.classList.add("active")
      : header.classList.remove("active");
  }
  if (goTopBtn) {
    window.scrollY >= 500
      ? goTopBtn.classList.add("active")
      : goTopBtn.classList.remove("active");
  }
});

/*-----------------------------------*\
 * #CORE PRODUCTION DATABASE AUTHENTICATION & ENGINE
\*-----------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  // Select All Core Modals & Form Elements
  const signinBtn = document.getElementById("signin-btn");
  const signinModal = document.getElementById("signin-modal-overlay");
  const closeSigninBtn = document.getElementById("close-signin-btn");
  const loginForm = document.getElementById("login-form");

  const signupModal = document.getElementById("signup-modal-overlay");
  const closeSignupBtn = document.getElementById("close-signup-btn");
  const signupForm = document.getElementById("signup-form");

  const resetModal = document.getElementById("reset-modal-overlay");
  const closeResetBtn = document.getElementById("close-reset-btn");
  const resetForm = document.getElementById("reset-password-form");

  const profileModal = document.getElementById("user-profile-modal-overlay");
  const closeProfileBtn = document.getElementById("close-profile-modal-btn");
  const signoutBtn = document.getElementById("profile-signout-btn");
  const profilePasswordInput = document.getElementById("profile-card-password");
  const profilePasswordToggle = document.getElementById(
    "profile-password-toggle-icon",
  );
  

  const userToken = localStorage.getItem("userToken");
  const storedUsername = localStorage.getItem("username") || "User";
  

  // A. URL PARAMS CHECK FOR RESET TOKEN
  const urlParams = new URLSearchParams(window.location.search);
  const resetToken = urlParams.get("token");

  // --- BIO EDITING ENGINE ---
  const bioDisplayWrapper = document.getElementById("profile-bio-display-wrapper");
  const bioEditWrapper = document.getElementById("profile-bio-edit-wrapper");
  const bioTextDisplay = document.getElementById("profile-card-bio");
  const editBioBtn = document.getElementById("edit-bio-btn");
  const saveBioBtn = document.getElementById("save-bio-btn");
  const cancelBioBtn = document.getElementById("cancel-bio-btn");
  const editBioInput = document.getElementById("edit-bio-input");

  // --- AVATAR UPLOAD ENGINE ---
  const avatarContainer = document.getElementById("profile-avatar-container");
  const avatarUpload = document.getElementById("profile-avatar-upload");
  const avatarImg = document.getElementById("profile-avatar-img");
  const defaultIcon = document.getElementById("profile-default-icon");

  window.loadUserAvatar = function() {
    const savedAvatar = localStorage.getItem("userAvatar");
    
    // 1. Update the Modal Avatar
    if (savedAvatar) {
      if (avatarImg) {
        avatarImg.src = savedAvatar;
        avatarImg.style.display = "block";
      }
      if (defaultIcon) defaultIcon.style.display = "none";
    }

    // 2. Automatically update the Desktop Header & Mobile Sidebar Buttons!
    const desktopProfileBtn = document.getElementById("signin-btn");
    const mobileProfileBtn = document.getElementById("mobile-signin-btn");
    const storedName = localStorage.getItem("username") || "User";

    const iconHtml = savedAvatar 
      ? `<img src="${savedAvatar}" style="width: 20px; height: 20px; border-radius: 50%; object-fit: cover; display: inline-block; vertical-align: middle; margin-right: 5px; border: 1px solid var(--citrine);" />`
      : `<ion-icon name="person-circle-outline" style="font-size: 20px; color: var(--citrine); display: inline-block; vertical-align: middle; margin-right: 5px;"></ion-icon>`;

    if (desktopProfileBtn && localStorage.getItem("userToken")) {
      desktopProfileBtn.innerHTML = `${iconHtml} <span style="display: inline-block; vertical-align: middle;">${storedName}</span>`;
    }
    if (mobileProfileBtn && localStorage.getItem("userToken")) {
      mobileProfileBtn.innerHTML = `${iconHtml} <span>${storedName}</span>`;
    }
  };

  if (avatarContainer && avatarUpload) {
    // Trigger file picker on click
    avatarContainer.addEventListener("click", () => avatarUpload.click());

    avatarUpload.addEventListener("change", function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const img = new Image();
          img.onload = function () {
            // Compress the image to save localStorage space!
            const canvas = document.createElement("canvas");
            const MAX_SIZE = 300; // Small size perfect for avatars
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_SIZE) {
                height *= MAX_SIZE / width;
                width = MAX_SIZE;
              }
            } else {
              if (height > MAX_SIZE) {
                width *= MAX_SIZE / height;
                height = MAX_SIZE;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8);
            
            // Save to browser memory and instantly refresh the UI
            localStorage.setItem("userAvatar", compressedBase64);
            window.loadUserAvatar();
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Helper function to load and display the bio
  window.loadUserBio = function() {
    if (!bioTextDisplay) return;
    const savedBio = localStorage.getItem("userBio");
    if (savedBio && savedBio.trim() !== "") {
      bioTextDisplay.textContent = savedBio;
      bioTextDisplay.style.opacity = "1";
    } else {
      bioTextDisplay.textContent = "Add a bio";
      bioTextDisplay.style.opacity = "0.5"; // Fades it out to look like a placeholder
    }
  };

  if (editBioBtn && saveBioBtn && cancelBioBtn) {
    // 1. Switch to Edit Mode
    editBioBtn.addEventListener("click", () => {
      bioDisplayWrapper.style.display = "none";
      bioEditWrapper.style.display = "flex";
      editBioInput.value = localStorage.getItem("userBio") || "";
      editBioInput.focus();
    });

    // 2. Cancel Editing
    cancelBioBtn.addEventListener("click", () => {
      bioEditWrapper.style.display = "none";
      bioDisplayWrapper.style.display = "flex";
    });

    // 3. Save to LocalStorage and Update UI
    saveBioBtn.addEventListener("click", () => {
      const newBio = editBioInput.value.trim();
      localStorage.setItem("userBio", newBio);
      
      window.loadUserBio();
      bioEditWrapper.style.display = "none";
      bioDisplayWrapper.style.display = "flex";
    });
  }

  if (resetToken && resetModal) {
    const hiddenInput = document.getElementById("reset-token-hidden");
    if (hiddenInput) hiddenInput.value = resetToken;
    resetModal.classList.add("active");
  }

  let returnToMobileMenu = false;
  // B. RENDER ACCOUNT STATUS MATRIX
  const mobileSigninBtn = document.getElementById("mobile-signin-btn");

  if (userToken) {
    // 1. Desktop Profile Button
    if (signinBtn) {
      signinBtn.className = "btn btn-secondary profile-nav-btn";
      signinBtn.style.borderColor = "var(--citrine)";
      signinBtn.style.padding = "10px 20px";
      signinBtn.style.textTransform = "none";
      signinBtn.innerHTML = `
        <ion-icon name="person-circle-outline" style="font-size: 20px; color: var(--citrine); display: inline-block; vertical-align: middle;"></ion-icon>
      `;

      signinBtn.addEventListener("click", (e) => {
        e.preventDefault();
        returnToMobileMenu = false; // Reset flag
        if (profileModal) {
          document.getElementById("profile-card-username").textContent = localStorage.getItem("username");
          document.getElementById("profile-card-email").textContent = localStorage.getItem("userEmail") || "test@gmail.com";
          document.getElementById("profile-card-password").value = localStorage.getItem("userPassword") || "password123";
          if (typeof window.loadUserBio === "function") window.loadUserBio();
          if (typeof window.loadUserAvatar === "function") window.loadUserAvatar();
          profileModal.classList.add("active");
        }
      });
    }

    // 2. Mobile Profile Button
    if (mobileSigninBtn) {
      mobileSigninBtn.innerHTML = `<ion-icon name="person-circle-outline"></ion-icon> <span>${storedUsername}</span>`;
      mobileSigninBtn.addEventListener("click", (e) => {
        e.preventDefault();
        returnToMobileMenu = true; // Set memory flag!
        document.querySelector("[data-menu-close-btn]")?.click(); // Auto-close sidebar
        if (profileModal) {
          document.getElementById("profile-card-username").textContent = localStorage.getItem("username");
          document.getElementById("profile-card-email").textContent = localStorage.getItem("userEmail") || "test@gmail.com";
          document.getElementById("profile-card-password").value = localStorage.getItem("userPassword") || "password123";
          profileModal.classList.add("active");
        }
      });
    }

  } else {
    // 3. Desktop Sign In
    if (signinBtn && signinModal) {
      signinBtn.addEventListener("click", (e) => {
        e.preventDefault();
        returnToMobileMenu = false; // Reset flag
        signinModal.classList.add("active");
      });
    }
    
    // 4. Mobile Sign In
    if (mobileSigninBtn && signinModal) {
      mobileSigninBtn.addEventListener("click", (e) => {
        e.preventDefault();
        returnToMobileMenu = true; // Set memory flag!
        document.querySelector("[data-menu-close-btn]")?.click(); // Auto-close sidebar
        signinModal.classList.add("active");
      });
    }
  }

  // C. MODAL TRANSITION SWITCHES & INTERACTION TRIGGERS
  
  // Helper Engine: Checks memory flag and restores the mobile menu
  function checkReturnToMobileMenu() {
    if (returnToMobileMenu) {
      setTimeout(() => {
        document.querySelector("[data-menu-open-btn]")?.click();
      }, 150); // Tiny delay allows the modal to fade out smoothly first
      returnToMobileMenu = false; // Reset the flag after using it
    }
  }

  document.querySelector(".signup-prompt a")?.addEventListener("click", (e) => {
    e.preventDefault();
    if (signinModal) signinModal.classList.remove("active");
    if (signupModal) signupModal.classList.add("active");
  });

  if (closeSigninBtn && signinModal) {
    closeSigninBtn.addEventListener("click", () => {
      signinModal.classList.remove("active");
      checkReturnToMobileMenu();
    });
  }
  if (closeSignupBtn && signupModal) {
    closeSignupBtn.addEventListener("click", () => {
      signupModal.classList.remove("active");
      checkReturnToMobileMenu();
    });
  }
  if (closeProfileBtn && profileModal) {
    closeProfileBtn.addEventListener("click", () => {
      profileModal.classList.remove("active");
      checkReturnToMobileMenu();
    });
  }
  if (closeResetBtn && resetModal) {
    closeResetBtn.addEventListener("click", () => {
      resetModal.classList.remove("active");
    });
  }

  // Close modals when clicking on background overlays
  [signinModal, signupModal, profileModal, resetModal].forEach((modal) => {
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("active");
          checkReturnToMobileMenu();
        }
      });
    }
  });

  // D. FORGOT PASSWORD SIMULATION INTERCEPT
  document
    .querySelector(".forgot-password-wrapper a")
    ?.addEventListener("click", async (e) => {
      e.preventDefault();
      const email = prompt("Enter your registered email address:");
      if (!email) return;

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/auth/forgot-password`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          },
        );
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
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]').value.trim();
      const password = document.getElementById("login-password").value;
      const submitBtn = this.querySelector('button[type="submit"]');

    

      try {
        submitBtn.textContent = "Signing In...";
        submitBtn.disabled = true;

        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
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
        alert(
          "Failed communicating with background Node server. Ensure it's running!",
        );
        submitBtn.textContent = "Sign In";
        submitBtn.disabled = false;
      }
    });
  }

  // F. LIVE SIGN UP RECRUITMENT PIPELINE
  if (signupForm) {
    signupForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const username = document.getElementById("signup-username").value.trim();
      const email = document.getElementById("signup-email").value.trim();
      const password = document.getElementById("signup-password").value;

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });
        const data = await response.json();
        alert(data.message);
        if (response.ok) {
          if (signupModal) signupModal.classList.remove("active");
          if (signinModal) signinModal.classList.add("active");
        }
      } catch (err) {
        alert("Registration server pipeline connection fault.");
      }
    });
  }

  // G. LIVE PASSWORD RESET SUBMISSION
  if (resetForm) {
    resetForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const token = document.getElementById("reset-token-hidden").value;
      const newPassword = document.getElementById("reset-new-password").value;

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/auth/reset-password`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, newPassword }),
          },
        );
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
    signoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.reload();
    });
  }

  // I. SECURED PROFILE EYE TOGGLE VISIBILITY
  if (profilePasswordToggle && profilePasswordInput) {
    profilePasswordToggle.addEventListener("click", function () {
      if (profilePasswordInput.type === "password") {
        profilePasswordInput.type = "text";
        this.setAttribute("name", "eye-off-outline");
      } else {
        profilePasswordInput.type = "password";
        this.setAttribute("name", "eye-outline");
      }
    });
  }
});

/*-----------------------------------*\
 * #LOGIN FORM INPUT ELEMENT VISIBILITY TOGGLE
\*-----------------------------------*/
document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("login-password");
  const toggleIcon = document.getElementById("password-toggle-icon");

  if (toggleIcon && passwordInput) {
    toggleIcon.addEventListener("click", function () {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        this.setAttribute("name", "eye-off-outline");
      } else {
        passwordInput.type = "password";
        this.setAttribute("name", "eye-outline");
      }
    });
  }
});

/*-----------------------------------*\
 * #REVIEW RATING CALCULATOR
\*-----------------------------------*/
document.addEventListener("DOMContentLoaded", function () {
  function calculateAverageRating() {
    const cards = document.querySelectorAll(".review-card[data-rating]");
    const totalCards = cards.length;
    let totalScore = 0;
    let starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    cards.forEach((card) => {
      const ratingAttr = card.getAttribute("data-rating");
      const rating = ratingAttr ? parseFloat(ratingAttr) : 0;

      if (!isNaN(rating) && rating > 0) {
        totalScore += rating;
        let roundedRating = Math.round(rating);
        if (roundedRating < 1) roundedRating = 1;
        if (roundedRating > 5) roundedRating = 5;

        starCounts[roundedRating]++;

        const starContainer = card.querySelector(".rating-wrapper");
        if (starContainer) {
          let cardStarHTML = "";
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
  const filterButtons = document.querySelectorAll(".filter-btn[data-sort]");
  const reviewGrid = document.querySelector(".review-grid");

  if (filterButtons.length > 0 && reviewGrid) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        filterButtons.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");

        const sortType = this.getAttribute("data-sort");
        const cardsArr = Array.from(document.querySelectorAll(".review-card"));

        cardsArr.sort((a, b) => {
          const ratingA = parseFloat(a.getAttribute("data-rating")) || 0;
          const ratingB = parseFloat(b.getAttribute("data-rating")) || 0;
          return sortType === "highest" ? ratingB - ratingA : ratingA - ratingB;
        });

        reviewGrid.innerHTML = "";
        cardsArr.forEach((card) => reviewGrid.appendChild(card));
      });
    });
  }

  // See More Control Bounds
  const cardsElements = document.querySelectorAll(".review-card");
  cardsElements.forEach((card) => {
    const text = card.querySelector(".review-text");
    const btn = card.querySelector(".see-more-btn");

    if (text && btn) {
      if (text.scrollHeight > text.clientHeight) {
        btn.style.display = "inline-block";
      } else {
        btn.style.display = "none";
      }

      btn.addEventListener("click", function () {
        text.classList.toggle("expanded");
        this.textContent = text.classList.contains("expanded")
          ? "See Less"
          : "See More";
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
};
window.addEventListener("scroll", scrollReveal);
window.addEventListener("load", scrollReveal);

/*-----------------------------------*\
 * #LOAD EXTERNAL REVIEWS
\*-----------------------------------*/
function loadExternalReviews() {
  const cards = document.querySelectorAll(".review-card[data-review-file]");
  cards.forEach((card) => {
    const fileName = card.getAttribute("data-review-file");
    const textElement = card.querySelector(".review-text");
    const btn = card.querySelector(".see-more-btn");

    fetch(`./assets/reviews/${fileName}`)
      .then((response) => {
        if (!response.ok) throw new Error("File missing");
        return response.text();
      })
      .then((text) => {
        textElement.textContent = text;
        if (textElement.scrollHeight > textElement.clientHeight) {
          btn.style.display = "inline-block";
        } else {
          btn.style.display = "none";
        }
      })
      .catch((err) => {
        console.error(err);
        textElement.textContent = "Could not load review text.";
      });
  });
}
window.addEventListener("load", loadExternalReviews);

/*-----------------------------------*\
 * #REVIEW POPUP MODAL LOGIC
\*-----------------------------------*/
document.addEventListener("DOMContentLoaded", function () {
  const reviewModalOverlay = document.getElementById("review-modal-overlay");
  const modalUserImg = document.getElementById("modal-user-img");
  const modalUserName = document.getElementById("modal-user-name");
  const modalUserRating = document.getElementById("modal-user-rating");
  const modalReviewText = document.getElementById("modal-review-text");
  const closeReviewBtn = document.querySelector(
    "#review-modal-overlay .close-review-btn",
  );

  if (!reviewModalOverlay) return;

  function toggleReviewModal(show) {
    if (show) {
      reviewModalOverlay.classList.add("active");
      document.body.classList.add("active");
    } else {
      reviewModalOverlay.classList.remove("active");
      document.body.classList.remove("active");
    }
  }

  reviewModalOverlay.addEventListener("click", (e) => {
    if (e.target === reviewModalOverlay) toggleReviewModal(false);
  });

  if (closeReviewBtn) {
    closeReviewBtn.addEventListener("click", () => toggleReviewModal(false));
  }

  const expandBtns = document.querySelectorAll(".expand-btn");
  expandBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const card = this.closest(".review-card");
      const imgSrc = card.querySelector(".avatar img").src;
      const name = card.querySelector(".username").textContent;
      const ratingHtml = card.querySelector(".rating-wrapper").innerHTML;
      const fullText = card.querySelector(".review-text").textContent;

      if (modalUserImg) modalUserImg.src = imgSrc;
      if (modalUserName) modalUserName.textContent = name;
      if (modalUserRating) modalUserRating.innerHTML = ratingHtml;
      if (modalReviewText) modalReviewText.textContent = fullText;

      toggleReviewModal(true);
    });
  });
});

/*-----------------------------------*\
 * #CUSTOM SHARE MODAL LOGIC
\*-----------------------------------*/
const shareModal = document.getElementById("share-modal-overlay");
const shareInput = document.getElementById("share-link-input");
const copyModalBtn = document.getElementById("copy-modal-btn");

const sFb = document.getElementById("s-fb");
const sTw = document.getElementById("s-tw");
const sWa = document.getElementById("s-wa");
const sPin = document.getElementById("s-pin");
const sMail = document.getElementById("s-mail");

function toggleShareModal(show) {
  if (shareModal) {
    show
      ? shareModal.classList.add("active")
      : shareModal.classList.remove("active");
  }
}

if (shareModal) {
  shareModal.addEventListener("click", (e) => {
    if (e.target === shareModal) toggleShareModal(false);
  });
}

function initReviewActions() {
  const copyBtns = document.querySelectorAll(".copy-btn");
  const shareBtns = document.querySelectorAll(".share-btn");

  copyBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const card = this.closest(".review-card");
      const textEl = card.querySelector(".review-text");
      if (!textEl) return;

      navigator.clipboard.writeText(textEl.textContent).then(() => {
        const icon = this.querySelector("ion-icon");
        const origName = icon.getAttribute("name");
        icon.setAttribute("name", "checkmark-outline");
        setTimeout(() => icon.setAttribute("name", origName), 2000);
      });
    });
  });

  shareBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const card = this.closest(".review-card");
      const text = card.querySelector(".review-text").textContent;
      const url = window.location.href;

      if (shareInput) shareInput.value = url;
      const msg = encodeURIComponent(
        `Check out this review: "${text.substring(0, 100)}..."`,
      );
      const encUrl = encodeURIComponent(url);

      if (sFb)
        sFb.href = `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`;
      if (sTw)
        sTw.href = `https://twitter.com/intent/tweet?text=${msg}&url=${encUrl}`;
      if (sWa)
        sWa.href = `https://api.whatsapp.com/send?text=${msg}%20${encUrl}`;
      if (sPin)
        sPin.href = `https://pinterest.com/pin/create/button/?url=${encUrl}&description=${msg}`;
      if (sMail)
        sMail.href = `mailto:?subject=Movie Review&body=${msg}%0A${encUrl}`;

      toggleShareModal(true);
    });
  });
}
window.addEventListener("load", initReviewActions);

if (copyModalBtn && shareInput) {
  copyModalBtn.addEventListener("click", () => {
    shareInput.select();
    navigator.clipboard.writeText(shareInput.value).then(() => {
      copyModalBtn.textContent = "Copied!";
      setTimeout(() => (copyModalBtn.textContent = "Copy"), 2000);
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
    link.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.add("active");
      document.body.classList.add("active");
    });
  }
  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("active");
      document.body.classList.remove("active");
    });
  }
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
        document.body.classList.remove("active");
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupStaticModal("about-film-link", "about-modal-overlay", "close-about-btn");
  setupStaticModal(
    "references-link",
    "references-modal-overlay",
    "close-references-btn",
  );
  setupStaticModal(
    "members-link",
    "members-modal-overlay",
    "close-members-btn",
  );
});

/*-----------------------------------*\
 * #FOOTER LINKS MODAL LOGIC
\*-----------------------------------*/
const footerContent = {
  faq: {
    title: "Frequently Asked Questions",
    text: `Q: Is Filmlane free?\nA: Yes, Filmlane is free to use for browsing movie reviews.\n\nQ: How do I download movies?\nA: Click the download button on the specific movie page (if available).\n\nQ: Can I submit a review?\nA: Currently, reviews are curated by our team.`,
  },
  help: {
    title: "Help Center",
    text: `Need assistance? Our support team is here to help.\n\nEmail: aisat.natividad@gmail.com\nPhone: +639924560138\nHours: Mon-Fri, 9am - 5pm EST`,
  },
  terms: {
    title: "Terms of Use",
    text: `1. Acceptance of Terms\nBy accessing this website, you agree to be bound by these terms.\n\n2. Use License\nPermission is granted to temporarily download one copy of the materials for personal, non-commercial viewing only.\n\n3. Disclaimer\nThe materials on Filmlane's website are provided on an 'as is' basis.`,
  },
  privacy: {
    title: "Privacy Policy",
    text: `Your privacy is important to us.\n\n1. Information Collection\nWe only collect information necessary to provide our services.\n\n2. Cookies\nWe use cookies to improve your browsing experience.\n\n3. Data Protection\nWe do not sell your personal data to third parties.`,
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const infoModal = document.getElementById("info-modal-overlay");
  const infoTitle = document.getElementById("info-modal-title");
  const infoText = document.getElementById("info-modal-text");
  const closeInfoBtn = document.getElementById("close-info-btn");

  function openInfoModal(type) {
    const content = footerContent[type];
    if (content && infoModal) {
      infoTitle.textContent = content.title;
      infoText.textContent = content.text;
      infoModal.classList.add("active");
      document.body.classList.add("active");
    }
  }

  document.getElementById("faq-link")?.addEventListener("click", (e) => {
    e.preventDefault();
    openInfoModal("faq");
  });
  document.getElementById("help-link")?.addEventListener("click", (e) => {
    e.preventDefault();
    openInfoModal("help");
  });
  document.getElementById("terms-link")?.addEventListener("click", (e) => {
    e.preventDefault();
    openInfoModal("terms");
  });
  document.getElementById("privacy-link")?.addEventListener("click", (e) => {
    e.preventDefault();
    openInfoModal("privacy");
  });

  if (closeInfoBtn && infoModal) {
    closeInfoBtn.addEventListener("click", () => {
      infoModal.classList.remove("active");
      document.body.classList.remove("active");
    });
  }
});

/*-----------------------------------*\
 * #DOWNLOAD BUTTON CHECKER
\*-----------------------------------*/
window.addEventListener("load", () => {
  const downloadBtns = document.querySelectorAll(
    ".service-btn, .download-btn, .social-link",
  );
  downloadBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const link = this.getAttribute("href");
      if (
        !link ||
        link === "#" ||
        link === "javascript:void(0)" ||
        link === "https://www.facebook.com/aisatcollegedasmaph"
      ) {
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
  EN: {
    home: "Home",
    about: "About Film",
    references: "References",
    members: "Members",
  },
  AU: {
    home: "Home",
    about: "About Film",
    references: "References",
    members: "Mates",
  },
  AR: {
    home: "الرئيسية",
    about: "عن الفيلم",
    references: "المراجع",
    members: "الأعضاء",
  },
  TU: {
    home: "Ana Sayfa",
    about: "Film Hakkında",
    references: "Referanslar",
    members: "Üyeler",
  },
};

function changeLanguage(lang) {
  if (!translations[lang]) return;
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang][key]) el.textContent = translations[lang][key];
  });
  document.body.setAttribute("dir", lang === "AR" ? "rtl" : "ltr");
}

window.addEventListener("load", () => {
  const langToggle = document.getElementById("lang-toggle");
  const langContainer = document.querySelector(".lang-dropdown");
  const langText = document.getElementById("current-lang-text");
  const langItems = document.querySelectorAll(".lang-item");

  if (langToggle) {
    langToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      langContainer.classList.toggle("active");
    });
  }

  langItems.forEach((item) => {
    item.addEventListener("click", function () {
      langItems.forEach((i) => i.classList.remove("active"));
      this.classList.add("active");
      const selectedLang = this.getAttribute("data-lang");
      if (langText) langText.textContent = selectedLang;
      changeLanguage(selectedLang);
      langContainer.classList.remove("active");
    });
  });

  document.addEventListener("click", (e) => {
    if (langContainer && !langContainer.contains(e.target)) {
      langContainer.classList.remove("active");
    }
  });
});

/*-----------------------------------*\
 * #SINGLE MEMBER DETAILS MODAL POPUP
\*-----------------------------------*/
document.addEventListener("DOMContentLoaded", function () {
  const detailModal = document.getElementById("member-detail-modal-overlay");
  const detailImg = document.getElementById("detail-img");
  const detailName = document.getElementById("detail-name");
  const detailRole = document.getElementById("detail-role");
  const closeDetailBtn = document.getElementById("close-detail-btn");

  document.addEventListener("click", function (e) {
    const memberItem = e.target.closest(".member-item");
    if (memberItem) {
      const img = memberItem.querySelector("img").src;
      const name = memberItem.querySelector("h4").textContent;
      const roleText = memberItem.querySelector("p").textContent;
      const role = roleText.replace("BC5MD", "").trim();

      if (!detailModal) return;
      if (detailImg) detailImg.src = img;
      if (detailName) detailName.textContent = name;
      if (detailRole) detailRole.textContent = role.replace("|", "").trim();
      detailModal.classList.add("active");
      document.body.classList.add("active");
    }
  });

  if (closeDetailBtn && detailModal) {
    closeDetailBtn.addEventListener("click", () => {
      detailModal.classList.remove("active");
      document.body.classList.remove("active");
    });
  }
});

/*-----------------------------------*\
 * #SEARCH LOGIC FILTER (LIVE ENGINE)
\*-----------------------------------*/
document.addEventListener("DOMContentLoaded", function () {
  const searchBtn = document.querySelector(".search-btn");
  const searchModal = document.getElementById("search-modal-overlay");
  const searchInput = document.getElementById("search-input");
  const closeSearchBtn = document.getElementById("close-search-btn");
  const searchCategory = document.getElementById("search-category-select");
  const resultsContainer = document.getElementById("search-results-container");

  if (searchBtn && searchModal) {
    searchBtn.addEventListener("click", () => {
      searchModal.classList.add("active");
      if (searchInput) {
        searchInput.value = ""; // Clear input on open
        searchInput.focus();
        resultsContainer.innerHTML = '<p id="search-status" style="grid-column: 1 / -1; color: var(--gainsboro); text-align: center; font-size: 14px; margin-top: 20px;">Type a movie name to search...</p>';
      }
      document.body.classList.add("active");
    });
  }

  if (closeSearchBtn && searchModal) {
    closeSearchBtn.addEventListener("click", () => {
      searchModal.classList.remove("active");
      document.body.classList.remove("active");
    });
  }

  // LIVE SEARCH EXECUTION ENGINE
  if (searchInput && searchCategory && resultsContainer) {
    const executeSearch = async () => {
      const query = searchInput.value.trim().toLowerCase();
      const category = searchCategory.value;

      // If the search bar is empty, reset the screen
      if (query.length === 0) {
         resultsContainer.innerHTML = '<p id="search-status" style="grid-column: 1 / -1; color: var(--gainsboro); text-align: center; font-size: 14px; margin-top: 20px;">Type a movie name to search...</p>';
         return;
      }

      // Show spinner while fetching
      resultsContainer.innerHTML = `<div style="grid-column: 1 / -1; display: flex; justify-content: center; padding: 40px;"><div style="width: 30px; height: 30px; border: 3px solid rgba(255,255,255,0.1); border-top-color: var(--citrine); border-radius: 50%; animation: spin 0.8s linear infinite;"></div></div>`;

      try {
        // Determine which database endpoint to check
        let fetchUrl = `${API_BASE_URL}/api/reviews/all`;
        if (category === "featured") fetchUrl = `${API_BASE_URL}/api/reviews/featured`;
        if (category === "recommendations") fetchUrl = `${API_BASE_URL}/api/reviews/recommendations`;

        const response = await fetch(fetchUrl);
        const data = await response.json();

        // Filter the results locally by movie name
        const filteredData = data.filter(movie => movie.movie_name.toLowerCase().includes(query));

        if (filteredData.length === 0) {
          resultsContainer.innerHTML = `<p style="grid-column: 1 / -1; color: #ff4560; text-align: center; font-size: 14px; margin-top: 20px;">No movies found matching "${query}" in this category.</p>`;
          return;
        }

        // Draw the found movies as clickable mini-posters
        resultsContainer.innerHTML = filteredData.map(item => {
          const ratingCount = parseInt(item.rating_count) || 0;
          const avgRating = parseFloat(item.avg_rating) || 0;
          const starText = ratingCount > 0 ? "★".repeat(Math.round(avgRating)) + "☆".repeat(5 - Math.round(avgRating)) : "☆☆☆☆☆";

          return `
            <div class="premium-box-card" onclick="window.location.href='view-review.html?id=${item.review_id}'" style="border-bottom: 2px solid var(--citrine); cursor: pointer; padding: 8px; background: #132226; border-radius: 6px; transition: transform 0.2s;">
              <div class="poster-wrapper" style="aspect-ratio: 2/3; border-radius: 4px; overflow: hidden; margin-bottom: 8px; background: #0b1416;">
                <img src="${item.image_data || "./assets/images/obs.jpg"}" alt="${item.movie_name}" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
              <div class="poster-footer" style="display: flex; flex-direction: column; gap: 2px;">
                <span style="color: white; font-size: 12px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.movie_name}</span>
                <span style="color: var(--citrine); font-size: 10px;">${starText}</span>
              </div>
            </div>
          `;
        }).join("");

      } catch (err) {
        console.error("Search Error:", err);
        resultsContainer.innerHTML = `<p style="grid-column: 1 / -1; color: #ff4560; text-align: center; margin-top: 20px;">Error performing search.</p>`;
      }
    };

    // DEBOUNCE TIMER: Waits 0.4 seconds after the user stops typing to execute the search
    // This prevents your database from crashing if someone types really fast!
    let debounceTimer;
    searchInput.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(executeSearch, 400); 
    });
    
    // Auto-search again if they change the category dropdown while typing
    searchCategory.addEventListener("change", executeSearch);
  }
});

/*-----------------------------------*\
 * #J. UPLOAD MOVIE REVIEW MASTER CONTROLLER & PREVIEW LAYER
\*-----------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  // MAINTENANCE POP UP
  



  const uploadReviewBtn = document.getElementById("upload-review-btn");
  const uploadModal = document.getElementById("upload-review-modal-overlay");
  const closeUploadBtn = document.getElementById("close-upload-modal-btn");
  const uploadForm = document.getElementById("upload-review-form");

  const uploadZone = document.getElementById("thumb-upload-zone");
  const fileInput = document.getElementById("review-movie-image");
  const previewImg = document.getElementById("upload-preview-img");
  const uploadPrompt = document.getElementById("upload-zone-prompt");

  const reviewsGrid = document.getElementById("user-reviews-grid");
  const audienceGrid = document.getElementById("audience-reviews-grid");
  const featuredGrid = document.getElementById("featured-reviews-grid");
  const recommendationsGrid = document.getElementById(
    "recommendations-reviews-grid",
  );

  // ====== FIXED: Added local definitions for community feed anchors ======
  const communityGrid = document.getElementById("dynamic-community-grid");
  const communityUploadBtn = document.getElementById(
    "community-section-upload-btn",
  );

  // Movie Details & Edit UI Selectors
  const detailModal = document.getElementById("movie-detail-modal-overlay");
  const closeDetailModalBtn = document.getElementById("close-detail-modal-btn");
  const commentForm = document.getElementById("detail-comment-form");

  let base64ImageString = "";
  let currentActiveReviewId = null;
  let activeSelectedRating = 0;

  // TIMESTAMP FORMATTING HELPER
  function parseSystemTimestampToLocal(isoString) {
    if (!isoString) return "";
    const dateInstance = new Date(isoString);
    return dateInstance.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  // 1. PRIVATE USER REVIEW LOADER ENGINE (ADDED BY YOU)

  async function fetchAndRenderUserReviews() {
    if (!reviewsGrid) return;
    const userContainer = document.getElementById("user-reviews-container");
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      if (userContainer) userContainer.style.display = "none";
      return;
    } else {
      if (userContainer) userContainer.style.display = "block";
    }

    try {
      reviewsGrid.innerHTML = loadingSpinnerHTML;
      const response = await fetch(
        `${API_BASE_URL}/api/reviews/user?email=${encodeURIComponent(userEmail)}`,
      );
      const reviews = await response.json();

      if (reviews.length === 0) {
        reviewsGrid.innerHTML = `<p style="color: #678; font-size: 13px; grid-column: span 6; text-align: center; padding: 20px;">You haven't uploaded any movie reviews yet! Click the button above to start.</p>`;
        return;
      }

      // ✅ FIXED: Renders movie posters inside reviewsGrid instead of wiping out the community feed section
      reviewsGrid.innerHTML = reviews
        .map((item) => {
          const ratingCount = parseInt(item.rating_count) || 0;
          const avgRating = parseFloat(item.avg_rating) || 0;
          const starText =
            ratingCount > 0
              ? "★".repeat(Math.round(avgRating)) +
                "☆".repeat(5 - Math.round(avgRating))
              : "☆☆☆☆☆";

          return `
          <div class="premium-box-card review-click-target-node" data-review-id="${item.review_id}" style="border-bottom: 3px solid var(--citrine); style="cursor: pointer;">
            <div class="poster-wrapper">
              <img src="${item.image_data || "./assets/images/obs.jpg"}" alt="${item.movie_name}" />
            </div>
            <div class="poster-footer">
              <span class="reviewer-name">${item.movie_name}</span>
              <div class="card-meta">
                <span class="stars-indicator" style="color: var(--citrine);">${starText}</span>
                <span class="review-date">${item.publish_date}</span>
              </div>
            </div>
          </div>
        `;
        })
        .join("");
    } catch (err) {
      console.error("Error drawing profile dashboard nodes:", err);
    }
  }

  // ============================================================
  // 2. GLOBAL COMMUNITY FEED CORE HYDRATOR (TEXT POSTS GRID)
  // ============================================================
  async function fetchAndRenderCommunityFeed(forcedEmail = null) {
    if (!communityGrid) return;

    try {
      if (communityGrid) communityGrid.innerHTML = loadingSpinnerHTML;
      // ✅ FIX: Force check localStorage dynamically during call execution if forcedEmail isn't provided
      const userEmail = forcedEmail || localStorage.getItem("userEmail") || "";

      const response = await fetch(
        `${API_BASE_URL}/api/community/feed?email=${encodeURIComponent(userEmail)}`,
      );
      const comments = await response.json();

      if (comments.length === 0) {
        communityGrid.innerHTML = `<p style="color: #678; font-size: 13px; text-align: center; width: 100%; padding: 40px;">No community discussion thoughts posted yet.</p>`;
        return;
      }

      window.cachedCommunityComments = comments;
      renderCommunityCardsLayout(comments);
    } catch (err) {
      console.error("Error pulling live community data streams:", err);
    }
  }

  function renderCommunityCardsLayout(items) {
    const currentUsername = localStorage.getItem("username"); // Get logged-in user
    const communityGrid = document.getElementById("dynamic-community-grid");

    if (!communityGrid) return;

    if (!items || items.length === 0) return;

    communityGrid.innerHTML = items
      .map((c) => {
        const isOwner = c.username === currentUsername; // Check if current user is the owner
        const isAdmin = localStorage.getItem("isAdmin") === "true"; // Check if user is admin

        const score = parseFloat(c.rating) || 4;
        let starHTML = "";
        for (let i = 1; i <= 5; i++) {
          starHTML += `<ion-icon name="${score >= i ? "star" : "star-outline"}"></ion-icon>`;
        }

        // ✅ FIXED: Explicitly look for the property name and parse it safely
        let rawCount = 0;
        if (c.hasOwnProperty("likes_count") && c.likes_count !== null) {
          rawCount = c.likes_count;
        } else if (c.hasOwnProperty("like_count") && c.like_count !== null) {
          rawCount = c.like_count;
        } else if (c.hasOwnProperty("count") && c.count !== null) {
          rawCount = c.count;
        }

        const initialLikes = parseInt(rawCount, 10) || 0;

        // Safety fallbacks to read user interaction states cleanly
        const hasLiked =
          c.user_has_liked === true || c.liked === true || c.has_liked === true;
        const heartIcon = hasLiked ? "heart" : "heart-outline";
        const heartColor = hasLiked
          ? "color: #ef4444 !important; border-color: #ef4444 !important;"
          : "color: #78909c; border-color: #1a282d;";

        // Parse a clean 4-digit display year fallback
        let displayYear = "";
        if (c.publish_date) {
          const parsedYear = c.publish_date.match(/\d{4}/);
          displayYear = parsedYear ? parsedYear[0] : c.publish_date;
        }

        return `
        <div class="review-card card-blue community-feed-card review-click-target-node" data-review-id="${c.review_id}" data-comment-id="${c.comment_id}" style="cursor: pointer; margin-bottom: 20px; padding: 25px; background: var(--rich-black-fogra-29); border: 1px solid #1a282d; border-top: 4px solid #3b82f6; border-radius: 8px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);">
          
          <div class="card-top-row" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; width: 100%;">
            <div class="review-header" style="display: flex; align-items: center; gap: 12px; border: none; padding: 0; margin: 0;">
              <div class="avatar" style="flex-shrink: 0;">
                <ion-icon name="person-circle-outline" style="font-size: 40px; color: var(--citrine);"></ion-icon>
              </div>
              <div class="user-info">
                <h3 class="username" style="font-size: 15px; font-weight: 600; color: white; margin: 0;">${c.username}</h3>
                <div class="rating-wrapper" style="display: flex; gap: 2px; color: var(--citrine); margin-top: 4px; font-size: 12px;">${starHTML}</div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; text-align: right;">
              <div style="max-width: 180px;">
                <h4 style="font-size: 14px; font-weight: 600; margin: 0; color: white; line-height: 1.3; white-space: normal; word-break: break-word;">${c.movie_name}</h4>
                <span style="font-size: 11px; color: #667788; font-weight: 500;">${displayYear}</span>
              </div>
              <div style="width: 65px; height: 90px; border-radius: 4px; overflow: hidden; background: #0b1416; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 2px 8px rgba(0,0,0,0.4);">
                <img src="${c.image_data || "./assets/images/obs.jpg"}" alt="Poster" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
            </div>
          </div>

          <div style="margin-bottom: 12px; position: relative; text-align: left;">
            <p class="review-text" style="white-space: pre-wrap;font-size: 13.5px; line-height: 1.6; color: #cfd8dc; font-style: italic; margin: 0; max-height: 4.8em; overflow: hidden; text-indent: 0; text-align: left; word-break: break-word; transition: max-height 0.3s ease; -webkit-mask-image: linear-gradient(to bottom, black 60%, transparent 100%); mask-image: linear-gradient(to bottom, black 60%, transparent 100%);">"${c.comment_text}"</p>
            <span class="see-more-btn" style="color: var(--citrine); font-size: 13px; font-weight: 700; display: inline-block; margin-top: 6px; text-decoration: underline; transition: opacity 0.2s;">See More</span>
          </div>

          <div class="card-footer" style="margin-top: 15px; border-top: 1px solid #1a282d; padding-top: 12px; width: 100%;">
            <div class="card-actions-row" style="display: flex; justify-content: space-between; align-items: center;">
              <div class="left-interactions" style="display: flex; gap: 10px; align-items: center;">
                
                <button type="button" class="feed-interaction-btn feed-heart-btn" data-comment-id="${c.comment_id}" style="background: rgba(255,255,255,0.02); display: flex; align-items: center; gap: 6px; cursor: pointer; padding: 6px 14px; border-radius: 20px; font-family: inherit; transition: all 0.2s; ${heartColor}">
                  <ion-icon name="${heartIcon}" style="font-size: 16px; pointer-events: none;"></ion-icon>
                  <span class="heart-counter-text" style="font-size: 12px; font-weight: 600; pointer-events: none;">${initialLikes}</span>
                </button>
                
                <button type="button" class="feed-interaction-btn feed-comment-btn" data-review-id="${c.review_id}" style="background: rgba(255,255,255,0.02); border: 1px solid #1a282d; color: #78909c; display: flex; align-items: center; gap: 6px; cursor: pointer; padding: 6px 14px; border-radius: 20px; font-family: inherit;">
                 <ion-icon name="chatbubble-outline" style="font-size: 15px; pointer-events: none;"></ion-icon>
                 <span style="font-size: 12px; font-weight: 600; pointer-events: none;">${c.comments_count || 0}</span>
                </button>
              </div>
              
              <div class="right-utilities" style="display: flex; gap: 8px; align-items: center;">
  
              ${
                isOwner || isAdmin
                  ? `
                <button type="button" class="feed-interaction-btn feed-delete-btn" 
                 data-comment-id="${c.comment_id}">
                 <ion-icon name="trash-outline" style="font-size: 15px; pointer-events: none;"></ion-icon>
                </button>
                `
                  : ""
              }
                <button type="button" class="feed-interaction-btn feed-expand-btn" style="width: 32px; height: 32px; display: flex; justify-content: center; align-items: center; background: rgba(255,255,255,0.02); border: 1px solid #1a282d; color: #78909c; border-radius: 50%; cursor: pointer; padding: 0;">
                  <ion-icon name="scan-outline" style="font-size: 15px; pointer-events: none;"></ion-icon>
                </button>
                <button type="button" class="feed-interaction-btn feed-copy-btn" style="width: 32px; height: 32px; display: flex; justify-content: center; align-items: center; background: rgba(255,255,255,0.02); border: 1px solid #1a282d; color: #78909c; border-radius: 50%; pointer-events: auto; cursor: pointer; padding: 0;">
                  <ion-icon name="copy-outline" style="font-size: 15px; pointer-events: none;"></ion-icon>
                </button>
                <button type="button" class="feed-interaction-btn feed-share-btn" style="width: 32px; height: 32px; display: flex; justify-content: center; align-items: center; background: rgba(255,255,255,0.02); border: 1px solid #1a282d; color: #78909c; border-radius: 50%; cursor: pointer; padding: 0;">
                  <ion-icon name="share-social-outline" style="font-size: 15px; pointer-events: none;"></ion-icon>
                </button>
              </div>

            </div>
          </div>

        </div>
      `;
      })
      .join("");

    // ... keep bottom see-more snippet unchanged ...

    // ... Keep your bottom scrollHeight see-more analyzer loop completely untouched ...

    // ... Keep your bottom scrollHeight analyzer loop below this completely untouched ...

    // Automatically analyze scroll-height to hide the "See More" link if text fits easily
    communityGrid.querySelectorAll(".community-feed-card").forEach((card) => {
      const text = card.querySelector(".review-text");
      const btn = card.querySelector(".see-more-btn");
      if (text && btn) {
        if (text.scrollHeight <= 68) {
          btn.style.display = "none";
          text.style.maskImage = "none";
          text.style.webkitMaskImage = "none";
        }
      }
    });
  }

  // 1B. NEW: FEATURED REVIEWS LOADER ENGINE ("NEW ON REAV-ON")
  async function fetchAndRenderFeaturedReviews() {
    if (!featuredGrid) return;

    try {
      if (featuredGrid) featuredGrid.innerHTML = loadingSpinnerHTML;
      const response = await fetch(
        `${API_BASE_URL}/api/reviews/featured`,
      );
      const reviews = await response.json();

      if (reviews.length === 0) {
        featuredGrid.innerHTML = `<p style="color: #678; font-size: 13px; grid-column: span 6; text-align: center; padding: 20px;">No featured movie highlights published yet.</p>`;
        return;
      }

      featuredGrid.innerHTML = reviews
        .map((item) => {
          const ratingCount = parseInt(item.rating_count) || 0;
          const avgRating = parseFloat(item.avg_rating) || 0;
          const starText =
            ratingCount > 0
              ? "★".repeat(Math.round(avgRating)) +
                "☆".repeat(5 - Math.round(avgRating))
              : "☆☆☆☆☆";

          return `
          <div class="premium-box-card review-click-target-node" data-review-id="${item.review_id}" style="border-bottom: 3px solid var(--citrine); cursor: pointer;">
            <div class="poster-wrapper">
              <img src="${item.image_data || "./assets/images/obs.jpg"}" alt="${item.movie_name}" />
            </div>
            <div class="poster-footer">
              <span class="reviewer-name">${item.movie_name}</span>
              <span style="color: var(--citrine); font-size: 11px; margin-top: -2px; font-weight: 500;">Posted By Admin: ${item.username}</span>
              <div class="card-meta">
                <span class="stars-indicator" style="color: var(--citrine);">${starText}</span>
                <span class="review-date">${item.publish_date}</span>
              </div>
            </div>
          </div>
        `;
        })
        .join("");
    } catch (err) {
      console.error("Error drawing featured reviews grid nodes:", err);
    }
  }

  // 1C. NEW: RECOMMENDATIONS REVIEWS LOADER ENGINE (4-5 STARS ONLY)
  async function fetchAndRenderRecommendations() {
    if (!recommendationsGrid) return;

    try {
      if (recommendationsGrid) recommendationsGrid.innerHTML = loadingSpinnerHTML;
      const response = await fetch(
        `${API_BASE_URL}/api/reviews/recommendations`,
      );
      const reviews = await response.json();

      if (reviews.length === 0) {
        recommendationsGrid.innerHTML = `<p style="color: #678; font-size: 13px; grid-column: span 6; text-align: center; padding: 20px;">No high-rated community picks recommended yet.</p>`;
        return;
      }

      recommendationsGrid.innerHTML = reviews
        .map((item) => {
          const ratingCount = parseInt(item.rating_count) || 0;
          const avgRating = parseFloat(item.avg_rating) || 0;
          const starText =
            "★".repeat(Math.round(avgRating)) +
            "☆".repeat(5 - Math.round(avgRating));

          return `
          <div class="premium-box-card review-click-target-node" data-review-id="${item.review_id}" style="border-bottom: 3px solid var(--citrine); style="cursor: pointer;">
            <div class="poster-wrapper">
              <img src="${item.image_data || "./assets/images/obs.jpg"}" alt="${item.movie_name}" />
            </div>
            <div class="poster-footer">
              <span class="reviewer-name">${item.movie_name}</span>
              <span style="color: #678; font-size: 11px; margin-top: -2px; font-weight: 500;">Posted By: ${item.username}</span>
              <div class="card-meta">
                <span class="stars-indicator" style="color: var(--citrine)">${starText}</span>
                <span class="review-date">${item.publish_date}</span>
              </div>
            </div>
          </div>
        `;
        })
        .join("");
    } catch (err) {
      console.error("Error drawing recommendations grid nodes:", err);
    }
  }

  if (communityUploadBtn) {
    communityUploadBtn.addEventListener("click", async function () {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        alert("Please sign in to write a community comment thought!");
        document
          .getElementById("signin-modal-overlay")
          ?.classList.add("active");
        return;
      }

      const uploadModalOverlay = document.getElementById(
        "upload-review-modal-overlay",
      );
      const dropdownSelect = document.getElementById(
        "comment-target-review-id",
      );

      if (uploadModalOverlay && dropdownSelect) {
        // 1. SAVE ORIGINAL STATE AND TRIGGER LOADING UI
        const originalHTML = this.innerHTML;
        this.innerHTML = '<ion-icon name="sync-outline" style="animation: spin 0.8s linear infinite; font-size: 16px;"></ion-icon> <span>LOADING...</span>';
        this.style.pointerEvents = "none"; // Prevent double-clicking
        this.style.opacity = "0.8";

        try {
          // Fetch live movies from your active backend database
          const response = await fetch(`${API_BASE_URL}/api/reviews/all`);
          const publicMovies = await response.json();

          const featuredResponse = await fetch(
            `${API_BASE_URL}/api/reviews/featured`,
          );
          const featuredMovies = await featuredResponse.json();

          const allAvailableMovies = [...featuredMovies, ...publicMovies];

          // Re-populate options cleanly
          dropdownSelect.innerHTML =
            '<option value="" disabled selected style="background: #132226; color: #678;">Choose a movie review thread...</option>';

          allAvailableMovies.forEach((movie) => {
            const opt = document.createElement("option");
            opt.value = movie.review_id;
            opt.textContent = movie.movie_name;
            opt.style.background = "#132226";
            opt.style.color = "white";
            dropdownSelect.appendChild(opt);
          });

          uploadModalOverlay.classList.add("active");
          document.body.classList.add("active");
        } catch (err) {
          console.error("Error populating review list dropdown:", err);
          alert("Network error: Could not load the movie list.");
        } finally {
          // 2. RESTORE THE BUTTON ONCE MODAL OPENS (OR IF IT FAILS)
          this.innerHTML = originalHTML;
          this.style.pointerEvents = "auto";
          this.style.opacity = "1";
        }
      }
    });
  }

  // Handle the form submission to post data straight to comments endpoint mapping
  const communityCommentForm = document.getElementById(
    "community-comment-feed-form",
  );
  if (communityCommentForm) {
    communityCommentForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const targetReviewId = document.getElementById(
        "comment-target-review-id",
      ).value;
      const commentMessage = document
        .getElementById("comment-feed-message-text")
        .value.trim();
      const userEmail = localStorage.getItem("userEmail");
      const submitBtn = this.querySelector('button[type="submit"]');

      if (!targetReviewId || !commentMessage) {
        alert("Please fill out all required workspace data fields.");
        return;
      }

      try {
        submitBtn.textContent = "POSTING PACKETS...";
        submitBtn.disabled = true;

        const response = await fetch(
          `${API_BASE_URL}/api/reviews/details/${targetReviewId}/comments`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: userEmail,
              commentText: commentMessage,
              rating: 4,
              type: "community", // ✅ FIX: Declare this as a global community post
            }),
          },
        );

        if (response.ok) {
          alert("Your thought has been posted straight to the Community Feed!");

          document
            .getElementById("upload-review-modal-overlay")
            .classList.remove("active");
          document.body.classList.remove("active");
          this.reset();

          // ✅ FIXED: Trigger an immediate, forced re-render of the feed grid
          // This pulls the latest counts from the database and updates the DOM instantly
          const activeStartupEmail = localStorage.getItem("userEmail") || "";
          await fetchAndRenderCommunityFeed(activeStartupEmail);

          if (typeof fetchAndRenderCommunityFeed === "function") {
            await fetchAndRenderCommunityFeed();
          } else {
            window.location.reload();
          }
        } else {
          const errData = await response.json();
          alert(errData.message || "Failed posting your thought.");
        }
      } catch (err) {
        console.error("Submission failed:", err);
        alert("Network fault attempting to log comment onto database server.");
      } finally {
        if (submitBtn) {
          submitBtn.textContent = "Post to Community Feed";
          submitBtn.disabled = false;
        }
      }
    });
  }

  // Automatically check URL parameters and build data if sitting on view-review.html
  if (window.location.pathname.includes("view-review.html")) {
    const pageUrlParams = new URLSearchParams(window.location.search);
    const activeRouteId = pageUrlParams.get("id");
    if (activeRouteId) {
      openReviewDetailsViewport(activeRouteId);
    }
  }

  // 2. GLOBAL AUDIENCE REVIEWS LOADER ENGINE
  async function fetchAndRenderAudienceReviews() {
    if (!audienceGrid) return;

    try {
      if (audienceGrid) audienceGrid.innerHTML = loadingSpinnerHTML;
      const response = await fetch(`${API_BASE_URL}/api/reviews/all`);
      const reviews = await response.json();

      if (reviews.length === 0) {
        audienceGrid.innerHTML = `<p style="color: #678; font-size: 13px; grid-column: span 6; text-align: center; padding: 20px;">No audience reviews have been published yet.</p>`;
        return;
      }

      audienceGrid.innerHTML = reviews
        .map((item) => {
          const ratingCount = parseInt(item.rating_count) || 0;
          const avgRating = parseFloat(item.avg_rating) || 0;
          const starText =
            ratingCount > 0
              ? "★".repeat(Math.round(avgRating)) +
                "☆".repeat(5 - Math.round(avgRating))
              : "☆☆☆☆☆";

          return `
          <div class="premium-box-card review-click-target-node" data-review-id="${item.review_id}" style="border-bottom: 3px solid var(--citrine); cursor: pointer;">
            <div class="poster-wrapper">
              <img src="${item.image_data || "./assets/images/obs.jpg"}" alt="${item.movie_name}" />
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
        })
        .join("");
    } catch (err) {
      console.error("Error drawing global audience grid nodes:", err);
    }
  }

  // Helper visibility layout control switcher
  function toggleEditFormState(showEditForm) {
    const viewStyle = showEditForm ? "none" : "block";
    const inlineViewStyle = showEditForm ? "none" : "inline-block";
    const editStyle = showEditForm ? "block" : "none";

    document.getElementById("title-view-wrapper").style.display = viewStyle;
    document.getElementById("title-edit-wrapper").style.display = editStyle;
    document.getElementById("date-view-wrapper").style.display =
      inlineViewStyle;
    document.getElementById("date-edit-wrapper").style.display = editStyle;
    document.getElementById("text-view-wrapper").style.display = viewStyle;
    document.getElementById("text-edit-wrapper").style.display = editStyle;

    document.getElementById("edit-actions-utilities-bar").style.display =
      showEditForm ? "flex" : "none";
    document.getElementById(
      "detail-modal-comments-block-wrapper",
    ).style.display = viewStyle;
  }

  function updateModalHeaderStars(avgRating, ratingCount, userRating = null) {
    const ratingBox = document.getElementById("detail-average-rating-box");
    if (!ratingBox) return;

    const averageScore = parseFloat(avgRating) || 0;
    let ratingHTML = `<div class="rating-display-row" style="display: flex; align-items: center;">`;

    for (let i = 1; i <= 5; i++) {
      if (averageScore >= i) {
        ratingHTML += '<ion-icon name="star" style="color: var(--citrine); font-size: 16px; margin: 0;"></ion-icon>';
      } else if (averageScore >= i - 0.5) {
        ratingHTML += '<ion-icon name="star-half" style="color: var(--citrine); font-size: 16px; margin: 0;"></ion-icon>';
      } else {
        ratingHTML += '<ion-icon name="star-outline" style="color: #667788; font-size: 16px; margin: 0;"></ion-icon>';
      }
    }

    ratingHTML += `
      <span class="average-score-text" style="color: var(--white); font-weight: 700; margin-left: 6px;">
        ${averageScore > 0 ? `${averageScore} / 5 (${ratingCount} user${ratingCount === 1 ? "" : "s"} rated)` : "No ratings left yet"}
      </span>
    </div>`;

    // Inject the interactive 1-time selector row underneath
    ratingHTML += `
      <div class="interactive-user-rating-line" style="margin-top: 12px; display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.02); padding: 6px 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.05); width: max-content;">
        <span style="color: #678; font-size: 12px; font-weight: 600;">${userRating ? "Your Rating:" : "Click to Rate:"}</span>
        <div class="interactive-header-stars" style="display: flex; gap: 4px; font-size: 18px;">
          ${[1, 2, 3, 4, 5]
            .map((num) => {
              const isSelect = userRating && num <= userRating;
              return `<ion-icon name="${isSelect ? "star" : "star-outline"}" data-value="${num}" class="${isSelect ? "selected-star" : ""}" style="cursor: pointer; color: ${isSelect ? "var(--citrine)" : "#678"}; transition: color 0.1s;"></ion-icon>`;
            })
            .join("")}
        </div>
      </div>
    `;

    ratingBox.innerHTML = ratingHTML;
    setupHeaderStarListeners();
  }

  function setupHeaderStarListeners() {
    const container = document.querySelector(".interactive-header-stars");
    if (!container) return;

    const stars = Array.from(container.querySelectorAll("ion-icon"));
    const userEmail = localStorage.getItem("userEmail");

    stars.forEach((star) => {
      star.addEventListener("mouseenter", function () {
        const val = parseInt(this.getAttribute("data-value"), 10);
        stars.forEach(
          (s, idx) => (s.style.color = idx < val ? "var(--citrine)" : "#678"),
        );
      });

      star.addEventListener("mouseleave", function () {
        stars.forEach(
          (s) =>
            (s.style.color = s.classList.contains("selected-star")
              ? "var(--citrine)"
              : "#678"),
        );
      });

      star.addEventListener("click", async function () {
        if (!userEmail) {
          alert("Please sign in to rate this movie!");
          return;
        }
        const ratingVal = parseInt(this.getAttribute("data-value"), 10);

        try {
          const response = await fetch(
            `${API_BASE_URL}/api/reviews/rate/${currentActiveReviewId}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: userEmail, rating: ratingVal }),
            },
          );

          if (response.ok) {
            const refreshRes = await fetch(
              `${API_BASE_URL}/api/reviews/details/${currentActiveReviewId}?email=${encodeURIComponent(userEmail)}`,
            );
            const refreshData = await refreshRes.json();
            updateModalHeaderStars(
              refreshData.review.avg_rating,
              refreshData.review.rating_count,
              refreshData.user_rating,
            );
            await fetchAndRenderUserReviews();
            await fetchAndRenderAudienceReviews();
          }
        } catch (err) {
          console.error(err);
        }
      });
    });
  }

  async function openReviewDetailsViewport(reviewId) {
    if (!document.getElementById("detail-movie-title")) return;
    currentActiveReviewId = reviewId;
    const userEmail = localStorage.getItem("userEmail") || "";

    const modalContainer =
      document.querySelector(".movie-detail-modal-container") ||
      document.querySelector(".full-page-thread-wrapper");
    if (modalContainer) modalContainer.classList.remove("is-editing-mode");
    toggleEditFormState(false);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/reviews/details/${reviewId}?email=${encodeURIComponent(userEmail)}`,
      );
      if (!response.ok) throw new Error("Packet unresolved.");
      const data = await response.json();

      const moviePosterImg = document.getElementById("detail-movie-poster");
      moviePosterImg.src = data.review.image_data || "./assets/images/obs.jpg";
      document.getElementById("detail-movie-title").textContent =
        data.review.movie_name;
      document.getElementById("detail-movie-date").textContent =
        data.review.publish_date;
      document.getElementById("detail-movie-author").textContent =
        data.review.username;
      document.getElementById("detail-view-count").textContent =
        data.review.view_count || 0;
      document.getElementById("detail-review-text").textContent =
        data.review.review_text;

      updateModalHeaderStars(
        data.review.avg_rating,
        data.review.rating_count,
        data.user_rating,
      );
      const timePlaceholder = document.getElementById("detail-upload-time");
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
      } else if (
        typeof data.review.genres === "string" &&
        data.review.genres.trim() !== ""
      ) {
        // If it's returned as a raw Postgres array string literal like "{Action,Horror}", parse it safely
        processedGenres = data.review.genres
          .replace(/[{}]/g, "") // Strip brackets
          .split(",") // Split by comma divisions
          .map((g) => g.trim().replace(/^"|"$/g, "")) // Clean out loose quotes
          .filter((g) => g !== ""); // Drop empty string fragments
      }

      const dynamicGenreWrapper = document.getElementById(
        "detail-movie-genres",
      );
      if (dynamicGenreWrapper) {
        if (processedGenres && processedGenres.length > 0) {
          dynamicGenreWrapper.innerHTML = processedGenres
            .map((g) => `<span class="imdb-genre-pill">${g}</span>`)
            .join("");
        } else {
          dynamicGenreWrapper.innerHTML = `<span class="imdb-genre-pill" style="color: #567; border-color: #1a282d;">Uncategorized</span>`;
        }
      }

      // REMOVED: The broken "updateModalHeaderStars(data.comments);" line that was clearing the UI

      // ============================================================
      // SECURE REVIEW CONTENT MANAGEMENT CONTROL VISIBILITY GATE
      // ============================================================
      const editBtn = document.getElementById("detail-edit-review-btn");
      const deleteBtn = document.getElementById("detail-delete-review-btn");
      let temporaryBase64PosterString = "";

      // Explicitly check boolean conditions from backend response packet arrays
      const isAuthorizedToModify =
        data.review.is_owner === true || data.is_admin === true;

      if (isAuthorizedToModify) {
        // Reveal control tools to authorized sessions
        if (editBtn) editBtn.style.display = "flex";
        if (deleteBtn) deleteBtn.style.display = "flex";

        const cleanEditBtn = editBtn.cloneNode(true);
        editBtn.parentNode.replaceChild(cleanEditBtn, editBtn);

        const posterOverlayBtn = document.getElementById(
          "poster-edit-overlay-btn",
        );
        const editFileInput = document.getElementById("edit-movie-image-input");

        if (posterOverlayBtn)
          posterOverlayBtn.onclick = () => editFileInput?.click();

        if (editFileInput) {
          editFileInput.onchange = function () {
            const file = this.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = function () {
                moviePosterImg.src = this.result;
                temporaryBase64PosterString = this.result;
              };
              reader.readAsDataURL(file);
            }
          };
        }

        cleanEditBtn.addEventListener("click", () => {
          if (modalContainer) modalContainer.classList.add("is-editing-mode");
          toggleEditFormState(true);
          temporaryBase64PosterString = "";

          document.getElementById("edit-movie-name-field").value =
            document.getElementById("detail-movie-title").textContent;
          document.getElementById("edit-movie-date-field").value =
            document.getElementById("detail-movie-date").textContent;
          document.getElementById("edit-movie-text-field").value =
            document.getElementById("detail-review-text").textContent;
        });

        const saveBtn = document.getElementById("edit-save-btn");
        if (saveBtn) {
          saveBtn.onclick = async () => {
            const updatedName = document
              .getElementById("edit-movie-name-field")
              .value.trim();
            const updatedDate = document
              .getElementById("edit-movie-date-field")
              .value.trim();
            const updatedText = document
              .getElementById("edit-movie-text-field")
              .value.trim();

            if (!updatedName || !updatedDate || !updatedText) {
              alert("All values are required!");
              return;
            }

            try {
              saveBtn.textContent = "Saving Changes...";
              saveBtn.disabled = true;

              const updateResponse = await fetch(
                `${API_BASE_URL}/api/reviews/${currentActiveReviewId}`,
                {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email: userEmail,
                    movieName: updatedName,
                    publishDate: updatedDate,
                    reviewText: updatedText,
                    imageData: temporaryBase64PosterString || null,
                  }),
                },
              );

              const updateData = await updateResponse.json();

              if (updateResponse.ok) {
                // Select custom edit success alert component nodes
                const editOverlay = document.getElementById("success-overlay");
                const editTitle = document.getElementById("success-title");
                const editMsgText = document.getElementById("success-message");
                const editBtn = document.getElementById("success-btn");

                if (editOverlay && editBtn) {
                  if (editMsgText) {
                    editMsgText.textContent =updateData.message ||"Movie review updated successfully!";
                  }
                    
                  if (editTitle) {
                    editTitle.textContent = "Updated!";
                  }
                  
                  editOverlay.style.display = "flex";
                  editBtn.onclick = function () {
                    editOverlay.style.display = "none";
                    window.location.reload();
                  };
                } else {
                  alert("Error");
                  window.location.reload();
                }
              } else {
                alert(
                  updateData.message || "Failed updating record parameters.",
                );
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

        const cancelBtn = document.getElementById("edit-cancel-btn");
        if (cancelBtn) {
          cancelBtn.onclick = () => {
            if (modalContainer)
              modalContainer.classList.remove("is-editing-mode");
            toggleEditFormState(false);
            moviePosterImg.src =
              data.review.image_data || "./assets/images/obs.jpg";
          };
        }

        // ============================================================
        // UPDATED SECURED SYSTEM REVIEW TERMINATION MODAL
        // ============================================================
        const cleanDeleteBtn = deleteBtn.cloneNode(true);
        deleteBtn.parentNode.replaceChild(cleanDeleteBtn, deleteBtn);

        cleanDeleteBtn.addEventListener("click", () => {
          const reviewDeleteOverlay = document.getElementById(
            "review-delete-overlay",
          );
          const confirmDeleteBtn = document.getElementById(
            "review-delete-confirm-btn",
          );
          const cancelDeleteBtn = document.getElementById(
            "review-delete-cancel-btn",
          );

          if (reviewDeleteOverlay && confirmDeleteBtn && cancelDeleteBtn) {
            reviewDeleteOverlay.style.display = "flex";
            cancelDeleteBtn.onclick = function () {
              reviewDeleteOverlay.style.display = "none";
            };

            confirmDeleteBtn.onclick = async function () {
              reviewDeleteOverlay.style.display = "none";

              try {
                const delResponse = await fetch(
                  `${API_BASE_URL}/api/reviews/${currentActiveReviewId}`,
                  {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: userEmail }),
                  },
                );

                if (delResponse.ok) {
                  // Direct clean routing straight back to index landing page catalog
                  window.location.href = "index.html";
                } else {
                  const delData = await delResponse.json();
                  alert(delData.message || "Unauthorized execution context.");
                }
              } catch (err) {
                console.error(err);
                alert(
                  "Network link error communicating with execution server database.",
                );
              }
            };
          }
        });
      } else {
        // FORCE HIDDEN: Strictly strip control visibility from unauthorized standard audience views
        if (editBtn) editBtn.style.setProperty("display", "none", "important");
        if (deleteBtn)
          deleteBtn.style.setProperty("display", "none", "important");
      }

      renderCommentsListCollection(data.comments, data.is_admin);
      resetStarSelectorInterfaceNode();

      if (detailModal) {
        detailModal.classList.add("active");
        document.body.classList.add("active");
      }
    } catch (err) {
      console.error("Error contacting dataset detail endpoint nodes:", err);
    }
  }

  // Helper visibility layout control switcher
  function toggleEditFormState(showEditForm) {
    const viewStyle = showEditForm ? "none" : "block";
    const inlineViewStyle = showEditForm ? "none" : "inline-block";
    const editStyle = showEditForm ? "block" : "none";

    document.getElementById("title-view-wrapper").style.display = viewStyle;
    document.getElementById("title-edit-wrapper").style.display = editStyle;
    document.getElementById("date-view-wrapper").style.display =
      inlineViewStyle;
    document.getElementById("date-edit-wrapper").style.display = editStyle;
    document.getElementById("text-view-wrapper").style.display = viewStyle;
    document.getElementById("text-edit-wrapper").style.display = editStyle;

    document.getElementById("edit-actions-utilities-bar").style.display =
      showEditForm ? "flex" : "none";
    document.getElementById(
      "detail-modal-comments-block-wrapper",
    ).style.display = viewStyle; // Hide comments while editing
  }

  function renderCommentsListCollection(comments, isAdmin = false) {
    const listContainer = document.getElementById("modal-comments-list");
    if (!listContainer) return;

    if (!comments || comments.length === 0) {
      listContainer.innerHTML = `<p id="no-comments-fallback-text" style="color: #678; font-size: 13px; text-align: center; padding-block: 10px;">No community thoughts posted yet. Be the first to share details!</p>`;
      return;
    }

    const currentActiveSessionUser = localStorage.getItem("username");

    // Separate flat database rows into categorized arrays
    const rootComments = comments.filter((c) => !c.parent_comment_id);
    const replyComments = comments.filter((c) => c.parent_comment_id);

    // Recursive function loop to generate infinite child node depths cleanly
    function buildCommentHTML(c, isReply = false) {
      const upvoteIconName = c.user_has_liked ? "arrow-up" : "arrow-up-outline";
      const downvoteIconName = c.user_has_disliked
        ? "arrow-down"
        : "arrow-down-outline";
      const upvoteClass = c.user_has_liked ? "upvoted-active" : "";
      const downvoteClass = c.user_has_disliked ? "downvoted-active" : "";
      const isCommentOwner =
        currentActiveSessionUser && c.username === currentActiveSessionUser;

      const childReplies = replyComments.filter(
        (r) => Number(r.parent_comment_id) === Number(c.comment_id),
      );

      return `
        <div class="reddit-comment-block-wrapper" style="margin-top: 12px; margin-left: ${isReply ? "36px" : "0px"};">
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
                
                ${c.comment_user_is_admin ? `<span class="reddit-admin-user-badge">Admin</span>` : ""}
                
                ${
                  c.is_verified
                    ? `
                  <span class="reddit-admin-verified-text-badge" title="Verified by Platform Management">
                    <ion-icon name="shield-checkmark"></ion-icon>
                    <span>comment verified by admin</span>
                  </span>
                `
                    : ""
                }
                
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
                
                ${
                  !isReply
                    ? `
                  <button class="reddit-action-btn comment-reply-trigger-node" data-comment-id="${c.comment_id}">
                    <ion-icon name="chatbox-outline"></ion-icon>
                    <span>Reply</span>
                  </button>
                `
                    : ""
                }

                ${
                  isCommentOwner || isAdmin
                    ? `
                  <button class="reddit-action-btn comment-edit-action-trigger-node" data-comment-id="${c.comment_id}">
                    <ion-icon name="create-outline"></ion-icon>
                    <span>Edit</span>
                  </button>
                `
                    : ""
                }
                
                ${
                  isCommentOwner || isAdmin
                    ? `
                  <button class="reddit-action-btn comment-delete-trigger-action-node" data-comment-id="${c.comment_id}">
                    <ion-icon name="trash-outline"></ion-icon>
                    <span>Delete</span>
                  </button>
                `
                    : ""
                }

                ${
                  isAdmin
                    ? `
                  <button class="reddit-action-btn comment-verify-action-trigger-node" data-comment-id="${c.comment_id}" style="color: ${c.is_verified ? "#00e054" : "#678"}; font-weight: 700;">
                    <ion-icon name="${c.is_verified ? "checkmark-circle" : "checkmark-circle-outline"}"></ion-icon>
                    <span>${c.is_verified ? "Verified" : "Verify"}</span>
                  </button>
                `
                    : ""
                }
              </div>
            </div>
          </div>
          
          <div class="reddit-reply-box-container" id="reply-container-${c.comment_id}">
            ${childReplies.map((child) => buildCommentHTML(child, true)).join("")}
          </div>
        </div>
      `;
    }

    listContainer.innerHTML = rootComments
      .map((root) => buildCommentHTML(root))
      .join("");
  }

  // Intercept grid wrapper clicks to route targeted item indexes
  [reviewsGrid, audienceGrid].forEach((grid) => {
    if (grid) {
      grid.addEventListener("click", (e) => {
        const targetedCard = e.target.closest(".review-click-target-node");
        if (targetedCard) {
          const id = targetedCard.getAttribute("data-review-id");
          openReviewDetailsViewport(id);
        }
      });
    }
  });

  // Close Detail Layer Panel Actions
  if (closeDetailModalBtn && detailModal) {
    closeDetailModalBtn.addEventListener("click", () => {
      detailModal.classList.remove("active");
      document.body.classList.remove("active");
    });
  }

  // ============================================================
  // 4. DISCUSSION FORUM FORM MANAGEMENT SUBMISSIONS PIPELINE (XHR UPGRADE)
  // ============================================================
  if (commentForm) {
    commentForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) {
        alert("Please sign in to participate in discussion threads!");
        return;
      }

      const commentField = document.getElementById("comment-field-text");
      const submitBtn =
        this.querySelector(".comment-submit-btn-override") ||
        this.querySelector('button[type="submit"]');

      // Target localized progress UI variables
      const progressWrapper = document.getElementById(
        "comment-progress-wrapper",
      );
      const progressBar = document.getElementById("comment-progress-bar");
      const progressPercent = document.getElementById(
        "comment-progress-percent",
      );

      try {
        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;

        // Initialize progress nodes
        if (progressWrapper) progressWrapper.style.display = "block";
        if (progressBar) progressBar.style.width = "0%";
        if (progressPercent) progressPercent.textContent = "0%";

        // Initialize XMLHttpRequest transaction sequence
        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          `${API_BASE_URL}/api/reviews/details/${currentActiveReviewId}/comments`,
        );
        xhr.setRequestHeader("Content-Type", "application/json");

        // Listen for active data stream progress frames
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round(
              (event.loaded / event.total) * 100,
            );
            if (progressBar) progressBar.style.width = `${percentComplete}%`;
            if (progressPercent)
              progressPercent.textContent = `${percentComplete}%`;
          }
        });

        // Parse return data payload on close response hooks
        xhr.onload = async function () {
          submitBtn.textContent = "Post Comment";
          submitBtn.disabled = false;

          // Clear visual loader rows out of view layout dynamically
          if (progressWrapper) progressWrapper.style.display = "none";

          if (xhr.status >= 200 && xhr.status < 300) {
            commentField.value = "";
            resetStarSelectorInterfaceNode();

            // Re-fetch clean active lists from PostgreSQL backend rows
            const refreshRes = await fetch(
              `${API_BASE_URL}/api/reviews/details/${currentActiveReviewId}?email=${encodeURIComponent(userEmail)}`,
            );
            const refreshData = await refreshRes.json();

            renderCommentsListCollection(
              refreshData.comments,
              refreshData.is_admin,
            );
            updateModalHeaderStars(
              refreshData.review.avg_rating,
              refreshData.review.rating_count,
              refreshData.user_rating,
            );

            await fetchAndRenderUserReviews();
            await fetchAndRenderAudienceReviews();
          } else {
            alert("Error processing community message packets.");
          }
        };

        xhr.onerror = function () {
          alert("Network execution failure attempting link communication.");
          submitBtn.textContent = "Post Comment";
          submitBtn.disabled = false;
          if (progressWrapper) progressWrapper.style.display = "none";
        };

        // Dispatch text stream across the active pipeline network gateway
        xhr.send(
          JSON.stringify({
            email: userEmail,
            commentText: commentField.value.trim(),
            rating: null,
            type: "review", // ✅ FIX: Declare this as an inner review thread post
          }),
        );
      } catch (err) {
        console.error(err);
        submitBtn.textContent = "Post Comment";
        submitBtn.disabled = false;
        if (progressWrapper) progressWrapper.style.display = "none";
      }
    });
  }

  // 5. GLOBAL INTERACTIVE EVENT DELEGATION CAPTURE FOR COMMUNITY ELEMENTS
  document.addEventListener("click", async (e) => {
    const userEmail = localStorage.getItem("userEmail");

    // ============================================================
    // 🚨 NEW: SUB-REPLY COPY HANDLER
    // ============================================================
    const subReplyCopyBtn = e.target.closest(".sub-reply-copy-btn");
    if (subReplyCopyBtn) {
      e.preventDefault();
      const cardNode = subReplyCopyBtn.closest(".sub-reply-card-node");
      const textToCopy = cardNode?.querySelector("p[id^='sub-reply-text-']")?.textContent.trim();
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy);
        alert("Sub-reply text copied to clipboard!");
      }
      return;
    }

    // ============================================================
    // 🚨 NEW: SUB-REPLY EDIT WORKSPACE INJECTOR
    // ============================================================
    const subReplyEditBtn = e.target.closest(".sub-reply-edit-btn");
    if (subReplyEditBtn) {
      e.preventDefault();
      const commentId = subReplyEditBtn.getAttribute("data-comment-id");
      const textElement = document.getElementById(`sub-reply-text-${commentId}`);
      if (!textElement) return;

      const parentBody = textElement.parentElement;
      if (parentBody.querySelector(".sub-reply-inline-edit-box")) return; // Prevent duplicates

      const currentText = textElement.textContent.trim();
      textElement.style.display = "none"; // Hide original text

      const editBox = document.createElement("div");
      editBox.className = "sub-reply-inline-edit-box";
      editBox.style = "margin-top: 10px; display: flex; flex-direction: column; gap: 8px; width: 100%;";
      editBox.innerHTML = `
        <textarea id="sub-edit-field-${commentId}" class="login-input" style="min-height: 60px; padding: 10px !important; background: #0b1416 !important; border: 1px solid #243337 !important; color: white !important; border-radius: 4px; resize: vertical; font-family: var(--ff-poppins); font-size: 12.5px; line-height: 1.5;">${currentText}</textarea>
        <div style="display: flex; justify-content: flex-end; gap: 8px;">
          <button type="button" class="btn sub-edit-cancel-btn" data-comment-id="${commentId}" style="padding: 4px 12px; font-size: 11px; border: 1px solid #243337; color: white; background: transparent; cursor: pointer; border-radius: 4px; font-weight: 600;">Cancel</button>
          <button type="button" class="signin-submit-btn sub-edit-save-btn" data-comment-id="${commentId}" style="width: auto; margin-top: 0; padding: 4px 14px; font-size: 11px; border-radius: 4px; background: var(--citrine); color: black; font-weight: 700; border: none; cursor: pointer;">Save</button>
        </div>
      `;
      parentBody.appendChild(editBox);
      
      const textarea = document.getElementById(`sub-edit-field-${commentId}`);
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
      }
      return;
    }

    // ============================================================
    // 🚨 NEW: SUB-REPLY EDIT CANCEL HANDLER
    // ============================================================
    const subEditCancelBtn = e.target.closest(".sub-edit-cancel-btn");
    if (subEditCancelBtn) {
      e.preventDefault();
      const commentId = subEditCancelBtn.getAttribute("data-comment-id");
      const textElement = document.getElementById(`sub-reply-text-${commentId}`);
      
      if (textElement) textElement.style.display = "block"; // Restore text
      e.target.closest(".sub-reply-inline-edit-box")?.remove(); // Purge editor
      return;
    }

    // ============================================================
    // 🚨 NEW: SUB-REPLY EDIT SAVE HANDLER
    // ============================================================
    const subEditSaveBtn = e.target.closest(".sub-edit-save-btn");
    if (subEditSaveBtn) {
      e.preventDefault();
      const commentId = subEditSaveBtn.getAttribute("data-comment-id");
      const editField = document.getElementById(`sub-edit-field-${commentId}`);
      
      if (!editField || !editField.value.trim()) return;

      try {
        subEditSaveBtn.textContent = "Saving...";
        subEditSaveBtn.disabled = true;

        const response = await fetch(`${API_BASE_URL}/api/comments/${commentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            commentText: editField.value.trim(),
          }),
        });

        if (response.ok) {
          // Instantly update the DOM so it feels snappy without requiring a reload
          const textElement = document.getElementById(`sub-reply-text-${commentId}`);
          if (textElement) {
            textElement.textContent = editField.value.trim();
            textElement.style.display = "block";
          }
          subEditSaveBtn.closest(".sub-reply-inline-edit-box")?.remove();
        } else {
          alert("Unauthorized modification or missing packet parameters.");
          subEditSaveBtn.textContent = "Save";
          subEditSaveBtn.disabled = false;
        }
      } catch (err) {
        console.error("Error dispatching sub-reply update:", err);
        subEditSaveBtn.textContent = "Save";
        subEditSaveBtn.disabled = false;
      }
      return;
    }

    // ============================================================
    // 🚨 MOVED: DISCUSSION SUB-REPLY DELETE HANDLER (GLOBAL)
    // ============================================================
    const subReplyDeleteBtn = e.target.closest(".sub-reply-delete-btn");
    if (subReplyDeleteBtn) {
      e.preventDefault();
      e.stopPropagation();

      const commentId = subReplyDeleteBtn.getAttribute("data-comment-id");

      // Grab your existing community delete modal
      const deleteOverlay = document.getElementById("community-delete-overlay");
      const confirmBtn = document.getElementById("comm-delete-confirm-btn");
      const cancelBtn = document.getElementById("comm-delete-cancel-btn");

      const titleText = deleteOverlay.querySelector(".delete-modal-title");
      const bodyText = deleteOverlay.querySelector(".delete-modal-text");

      if (deleteOverlay && confirmBtn && cancelBtn) {
        if (titleText) titleText.textContent = "Delete Comment?";
        if (bodyText)
          bodyText.textContent =
            "Are you sure you want to permanently delete this comment? This action cannot be undone.";
        deleteOverlay.classList.add("active"); // Display modal

        cancelBtn.onclick = function () {
          // Query directly to prevent Javascript memory closure bugs
          document
            .getElementById("community-delete-overlay")
            .classList.remove("active");
        };

        confirmBtn.onclick = async function () {
          document
            .getElementById("community-delete-overlay")
            .classList.remove("active");

          try {
            const response = await fetch(
              `${API_BASE_URL}/api/comments/${commentId}`,
              {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail }),
              },
            );

            if (response.ok) {
              // Smoothly clear it right off the viewport card stack list
              const replyCard = subReplyDeleteBtn.closest(
                ".sub-reply-card-node",
              );
              if (replyCard) replyCard.remove();

              // Safely refresh the background main feed metrics
              if (typeof fetchAndRenderCommunityFeed === "function") {
                await fetchAndRenderCommunityFeed(userEmail);
              }
            } else {
              alert("Unauthorized: You can only delete your own replies.");
            }
          } catch (err) {
            console.error("Error deleting sub-reply:", err);
          }
        };
      }
      return;
    }

    // ============================================================
    // A. INLINE RECENT COMMENT DELETE HANDLER (CUSTOM MODAL UPGRADE)
    // ============================================================
    const trashBtn = e.target.closest(".comment-delete-trigger-action-node");
    if (trashBtn) {
      e.preventDefault();
      const commentId = trashBtn.getAttribute("data-comment-id");

      // Select the layout confirmation modal elements safely
      const deleteOverlay = document.getElementById("delete-confirm-overlay");
      const confirmDeleteBtn = document.getElementById("delete-confirm-btn");
      const cancelDeleteBtn = document.getElementById("delete-cancel-btn");

      if (deleteOverlay && confirmDeleteBtn && cancelDeleteBtn) {
        // Force reveal the custom dark alert component overlay
        deleteOverlay.style.display = "flex";

        // Dissolve dialogue window panel harmlessly if dismissed
        cancelDeleteBtn.onclick = function () {
          deleteOverlay.style.display = "none";
        };

        // Dispatch backend network package parameters on verified confirmation click
        confirmDeleteBtn.onclick = async function () {
          deleteOverlay.style.display = "none";

          try {
            const response = await fetch(
              `${API_BASE_URL}/api/comments/${commentId}`,
              {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail }),
              },
            );

            if (response.ok) {
              const refreshRes = await fetch(
                `${API_BASE_URL}/api/reviews/details/${currentActiveReviewId}?email=${encodeURIComponent(userEmail || "")}`,
              );
              const refreshData = await refreshRes.json();

              // Cleanly map fresh data tree layers instantly onto feed positions
              renderCommentsListCollection(
                refreshData.comments,
                refreshData.is_admin,
              );
              updateModalHeaderStars(
                refreshData.review.avg_rating,
                refreshData.review.rating_count,
                refreshData.user_rating,
              );

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
    const upvoteBtn = e.target.closest(".comment-like-trigger-node");
    if (upvoteBtn) {
      e.preventDefault();
      if (!userEmail) {
        alert("Please sign in to upvote comments!");
        return;
      }
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/comments/like/${upvoteBtn.getAttribute("data-comment-id")}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: userEmail }),
          },
        );
        const data = await response.json();
        if (data.success) {
          const refreshRes = await fetch(
            `${API_BASE_URL}/api/reviews/details/${currentActiveReviewId}?email=${encodeURIComponent(userEmail)}`,
          );
          const refreshData = await refreshRes.json();
          // FIX: Added refreshData.is_admin here
          renderCommentsListCollection(
            refreshData.comments,
            refreshData.is_admin,
          );
        }
      } catch (err) {
        console.error(err);
      }
      return;
    }

    // C. INLINE COMMENT DOWNVOTE PERSISTENCE HANDLER
    const downvoteBtn = e.target.closest(".comment-downvote-trigger-node");
    if (downvoteBtn) {
      e.preventDefault();
      if (!userEmail) {
        alert("Please sign in to downvote comments!");
        return;
      }
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/comments/dislike/${downvoteBtn.getAttribute("data-comment-id")}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: userEmail }),
          },
        );
        if (response.ok) {
          const refreshRes = await fetch(
            `${API_BASE_URL}/api/reviews/details/${currentActiveReviewId}?email=${encodeURIComponent(userEmail)}`,
          );
          const refreshData = await refreshRes.json();
          // FIX: Added refreshData.is_admin here
          renderCommentsListCollection(
            refreshData.comments,
            refreshData.is_admin,
          );
        }
      } catch (err) {
        console.error(err);
      }
      return;
    }

    // D. DYNAMIC REDDIT-STYLE INLINE REPLY INPUT BOX INJECTION
    const replyBtn = e.target.closest(".comment-reply-trigger-node");
    if (replyBtn) {
      e.preventDefault();
      const commentId = replyBtn.getAttribute("data-comment-id");
      const targetContainer = document.getElementById(
        `reply-container-${commentId}`,
      );
      if (!targetContainer) return;

      const existingBox = targetContainer.querySelector(
        ".reddit-inline-reply-box",
      );
      if (existingBox) {
        existingBox.remove();
      } else {
        const inputFrame = document.createElement("div");
        inputFrame.className = "reddit-inline-reply-box";
        inputFrame.style =
          "margin-block: 10px; display: flex; flex-direction: column; gap: 8px; background: #132226; padding: 12px; border-radius: 8px; border: 1px solid #243337; margin-left: 36px;";
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
    const submitReplyBtn = e.target.closest(".comment-reply-submit-action-btn");
    if (submitReplyBtn) {
      e.preventDefault();
      const commentId = submitReplyBtn.getAttribute("data-comment-id");
      const replyField = document.getElementById(`reply-field-${commentId}`);
      if (!replyField || !replyField.value.trim()) return;
      if (!userEmail) {
        alert("Please sign in to reply!");
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/reviews/details/${currentActiveReviewId}/comments`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: userEmail,
              commentText: replyField.value.trim(),
              rating: null,
              // FIX: Explicitly cast the commentId to a clean integer before transmission
              parentCommentId: commentId ? parseInt(commentId, 10) : null,
            }),
          },
        );

        if (response.ok) {
          const refreshRes = await fetch(
            `${API_BASE_URL}/api/reviews/details/${currentActiveReviewId}?email=${encodeURIComponent(userEmail)}`,
          );
          const refreshData = await refreshRes.json();
          // FIX: Added refreshData.is_admin here
          renderCommentsListCollection(
            refreshData.comments,
            refreshData.is_admin,
          );
          updateModalHeaderStars(
            refreshData.review.avg_rating,
            refreshData.review.rating_count,
            refreshData.user_rating,
          );
          await fetchAndRenderUserReviews();
          await fetchAndRenderAudienceReviews();
        }
      } catch (err) {
        console.error(err);
      }
      return;
    }

    // F. INLINE REPLY BOX CLOSURE DISMISSAL
    if (e.target.closest(".comment-reply-cancel-action-btn")) {
      e.preventDefault();
      e.target.closest(".reddit-inline-reply-box")?.remove();
    }

    // ============================================================
    // G. ADMIN/OWNER ACTION: LIVE INLINE COMMENT EDITING WORKSPACE
    // ============================================================
    const commentEditBtn = e.target.closest(
      ".comment-edit-action-trigger-node",
    );
    if (commentEditBtn) {
      e.preventDefault();
      const commentId = commentEditBtn.getAttribute("data-comment-id");
      const textContainer = document.getElementById(
        `comment-body-text-${commentId}`,
      );
      if (!textContainer) return;

      // Guard check: prevent duplicate editor instances from stacking
      const parentBody = textContainer.parentElement;
      if (parentBody.querySelector(".reddit-inline-edit-box")) return;

      const currentText = textContainer.textContent.trim();

      // Temporarily conceal original static paragraph row
      textContainer.style.display = "none";

      // Inject professional inline editing panel workspace matching system specs
      const editBox = document.createElement("div");
      editBox.className = "reddit-inline-edit-box";
      editBox.style =
        "margin-top: 10px; display: flex; flex-direction: column; gap: 10px; background: #0b1416; padding: 12px; border-radius: 6px; border: 1px solid #243337; width: 100%;";
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
        textarea.setSelectionRange(
          textarea.value.length,
          textarea.value.length,
        );
      }
      return;
    }

    // ============================================================
    // G1. INLINE EDIT WORKSPACE CANCEL DISMISSAL HANDLER
    // ============================================================
    const cancelEditBtn = e.target.closest(".comment-edit-cancel-action-btn");
    if (cancelEditBtn) {
      e.preventDefault();
      const commentId = cancelEditBtn.getAttribute("data-comment-id");
      const textContainer = document.getElementById(
        `comment-body-text-${commentId}`,
      );

      // Restore standard comment view visibility
      if (textContainer) textContainer.style.display = "block";

      // Purge the editor from DOM paths
      e.target.closest(".reddit-inline-edit-box")?.remove();
      return;
    }

    // ============================================================
    // G2. INLINE EDIT WORKSPACE SAVE UPDATE DISPATCH PIPELINE
    // ============================================================
    const saveEditBtn = e.target.closest(".comment-edit-save-action-btn");
    if (saveEditBtn) {
      e.preventDefault();
      const commentId = saveEditBtn.getAttribute("data-comment-id");
      const editField = document.getElementById(`edit-field-${commentId}`);
      if (!editField || !editField.value.trim()) return;

      try {
        saveEditBtn.textContent = "Saving...";
        saveEditBtn.disabled = true;

        const response = await fetch(
          `${API_BASE_URL}/api/comments/${commentId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: userEmail,
              commentText: editField.value.trim(),
            }),
          },
        );

        if (response.ok) {
          // Re-hydrate the live forum list entries seamlessly from active datasets
          const refreshRes = await fetch(
            `${API_BASE_URL}/api/reviews/details/${currentActiveReviewId}?email=${encodeURIComponent(userEmail || "")}`,
          );
          const refreshData = await refreshRes.json();
          renderCommentsListCollection(
            refreshData.comments,
            refreshData.is_admin,
          );
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
    const commentVerifyBtn = e.target.closest(
      ".comment-verify-action-trigger-node",
    );
    if (commentVerifyBtn) {
      e.preventDefault();
      const commentId = commentVerifyBtn.getAttribute("data-comment-id");
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/comments/verify/${commentId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: userEmail }),
          },
        );
        if (response.ok) {
          const refreshRes = await fetch(
            `${API_BASE_URL}/api/reviews/details/${currentActiveReviewId}?email=${encodeURIComponent(userEmail || "")}`,
          );
          const refreshData = await refreshRes.json();
          renderCommentsListCollection(
            refreshData.comments,
            refreshData.is_admin,
          );
        }
      } catch (err) {
        console.error(err);
      }
      return;
    }
  });

  // 6. INTERACTIVE STAR SELECTION NODE RULES
  const starContainer = document.getElementById("comment-star-selector");
  if (starContainer) {
    const starsArr = Array.from(
      starContainer.querySelectorAll(".star-nodes ion-icon"),
    );
    starsArr.forEach((star) => {
      star.addEventListener("mouseenter", function () {
        const val = parseInt(this.getAttribute("data-value"));
        starsArr.forEach((s, idx) =>
          s.classList.toggle("hovered-star", idx < val),
        );
      });
      star.addEventListener("mouseleave", function () {
        starsArr.forEach((s) => s.classList.remove("hovered-star"));
      });
      star.addEventListener("click", function () {
        activeSelectedRating = parseInt(this.getAttribute("data-value"));
        starsArr.forEach((s, idx) => {
          s.classList.toggle("selected-star", idx < activeSelectedRating);
          s.setAttribute(
            "name",
            idx < activeSelectedRating ? "star" : "star-outline",
          );
        });
      });
    });
  }

  function resetStarSelectorInterfaceNode() {
    activeSelectedRating = 0;
    const starContainer = document.getElementById("comment-star-selector");
    if (starContainer) {
      starContainer.querySelectorAll(".star-nodes ion-icon").forEach((s) => {
        s.classList.remove("selected-star", "hovered-star");
        s.setAttribute("name", "star-outline");
      });
    }
  }

  if (uploadReviewBtn && uploadModal) {
    uploadReviewBtn.addEventListener("click", () => {
      if (!localStorage.getItem("userToken")) {
        alert("Please sign in to upload a movie review!");
        document
          .getElementById("signin-modal-overlay")
          ?.classList.add("active");
      } else {
        uploadModal.classList.add("active");
        document.body.classList.add("active");

        // FIX: Look for the checkbox wrapper and turn it on if the user is an admin
        const adminCheckbox = document.getElementById(
          "admin-feature-checkbox-wrapper",
        );
        if (adminCheckbox) {
          adminCheckbox.style.display =
            localStorage.getItem("isAdmin") === "true" ? "flex" : "none";
        }
      }
    });
  }
  if (closeUploadBtn && uploadModal) {
    closeUploadBtn.addEventListener("click", () => {
      uploadModal.classList.remove("active");
      document.body.classList.remove("active");
    });
  }
  if (uploadModal) {
    uploadModal.addEventListener("click", (e) => {
      if (e.target === uploadModal) {
        uploadModal.classList.remove("active");
        document.body.classList.remove("active");
      }
    });
  }
  if (uploadZone && fileInput) {
    uploadZone.addEventListener("click", () => fileInput.click());
  }
  if (fileInput && previewImg && uploadPrompt) {
    fileInput.addEventListener("change", function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.addEventListener("load", function (e) {
          
          // Create a temporary image object to hold the original file
          const img = new Image();
          img.onload = function () {
            // 1. Set maximum dimensions for a web poster
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 1200;
            let width = img.width;
            let height = img.height;

            // 2. Calculate the new dimensions while keeping the exact aspect ratio
            if (width > height) {
              if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width = Math.round((width * MAX_HEIGHT) / height);
                height = MAX_HEIGHT;
              }
            }

            // 3. Draw the resized image onto a hidden virtual canvas
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            // 4. Compress the image to JPEG format at 70% quality
            const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

            // 5. Update the UI and save the tiny compressed string for upload!
            previewImg.src = compressedBase64;
            previewImg.style.display = "block";
            uploadPrompt.style.opacity = "0";
            base64ImageString = compressedBase64; 
          };
          img.src = e.target.result;
          
        });
        reader.readAsDataURL(file);
      }
    });
  }

  if (uploadForm) {
    uploadForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // FIX 3: Trim incoming field data values right at intercept edge
      const movieName = document
        .getElementById("review-movie-name")
        .value.trim();
      const rawDateSelected =
        document.getElementById("review-movie-date").value;
      const reviewText = document
        .getElementById("review-movie-text")
        // .value.trim();

      const userEmail = localStorage.getItem("userEmail");
      const submitBtn = this.querySelector('button[type="submit"]');
      const featuredCheckbox = document.getElementById("review-is-featured");
      const isFeaturedChecked = featuredCheckbox
        ? featuredCheckbox.checked
        : false;
      const checkedGenrePills = Array.from(
        document.querySelectorAll(".genre-checkbox-item:checked"),
      ).map((cb) => cb.value);

      // ANTI-SPAM PROTECTION GUARD: Detects and rejects empty spaces or blank text blocks
      if (!movieName || !rawDateSelected || !reviewText) {
        alert(
          "Submission Rejected! Workspace text blocks cannot be empty or contain only blank spaces.",
        );
        return;
      }

      // DATE CONVERSION HELPER: Converts native format "YYYY-MM-DD" to your established style "Jun 20, 2026"
      const dateFormattingInstance = new Date(rawDateSelected);
      const formattedPublishDateString =
        dateFormattingInstance.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

      // Select layout progress UI components
      const progressWrapper = document.getElementById(
        "upload-progress-wrapper",
      );
      const progressBar = document.getElementById("upload-progress-bar");
      const progressPercent = document.getElementById(
        "upload-progress-percent",
      );
      const statusText = document.getElementById("upload-status-text");

      try {
        submitBtn.textContent = "Processing...";
        submitBtn.disabled = true;

        if (progressWrapper) progressWrapper.style.display = "block";
        if (progressBar) progressBar.style.width = "0%";
        if (progressPercent) progressPercent.textContent = "0%";
        if (statusText)
          statusText.textContent = "Connecting to upload stream node...";

        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${API_BASE_URL}/api/reviews/upload`);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round(
              (event.loaded / event.total) * 100,
            );
            if (progressBar) progressBar.style.width = `${percentComplete}%`;
            if (progressPercent)
              progressPercent.textContent = `${percentComplete}%`;

            if (percentComplete < 50) {
              if (statusText)
                statusText.textContent = "Streaming payload binary packets...";
            } else {
              if (statusText)
                statusText.textContent =
                  "Completing data payload file transfer...";
            }
          }
        });

        xhr.onload = function () {
          submitBtn.textContent = "Publish Review Package";
          submitBtn.disabled = false;

          try {
            const data = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) {
              const successOverlay = document.getElementById(
                "success-alert-overlay",
              );
              const successMsg = document.getElementById(
                "success-alert-message",
              );
              const successBtn = document.getElementById("success-alert-btn");

              if (successOverlay && successBtn) {
                if (successMsg) successMsg.textContent = data.message;
                successOverlay.classList.add("active");

                successBtn.onclick = function () {
                  successOverlay.classList.remove("active");
                  uploadForm.reset();
                  window.location.href = "index.html";
                };
              } else {
                window.location.href = "index.html";
              }
            } else {
              alert(data.message || "Upload process failure tracking files.");
              if (progressWrapper) progressWrapper.style.display = "none";
            }
          } catch (err) {
            alert("Server validation processing failure logs.");
            if (progressWrapper) progressWrapper.style.display = "none";
          }
        };

        xhr.send(
          JSON.stringify({
            email: userEmail,
            movieName: movieName,
            publishDate: formattedPublishDateString, // Passes cleanly parsed readable date strings to DB indexes
            reviewText: reviewText,
            imageData: base64ImageString,
            isFeatured: isFeaturedChecked,
            genres: checkedGenrePills,
          }),
        );
      } catch (err) {
        alert("Pipeline error communicating with backend server.");
        submitBtn.textContent = "Publish Review Package";
        submitBtn.disabled = false;
        if (progressWrapper) progressWrapper.style.display = "none";
      }
    });
  }

  // ==========================================
  // 7. BASE REVIEW FILEREADER UPLOAD LAYER CONTROLS (STANDALONE WIDGET)
  // ==========================================
  if (uploadReviewBtn) {
    uploadReviewBtn.addEventListener("click", (e) => {
      e.preventDefault();
      // Guard entry: force sign-in prompt modal if no active browser token is detected
      if (!localStorage.getItem("userToken")) {
        alert("Please sign in to upload a movie review!");
        document
          .getElementById("signin-modal-overlay")
          ?.classList.add("active");
      } else {
        // Redirect seamlessly out to the dedicated review workspace page
        window.location.href = "upload-review.html";
      }
    });
  }

  // Dedicated check condition executed exclusively when opening upload-review.html
  if (window.location.pathname.includes("upload-review.html")) {
    // Session Verification Guard
    if (!localStorage.getItem("userToken")) {
      alert("Unauthorized entry. Please sign in first.");
      window.location.href = "index.html";
    }

    // Auto-reveal premium management checkbox options strictly for Admin sessions
    const adminCheckbox = document.getElementById(
      "admin-feature-checkbox-wrapper",
    );
    if (adminCheckbox) {
      adminCheckbox.style.display =
        localStorage.getItem("isAdmin") === "true" ? "flex" : "none";
    }
  }

  // Removed communityGrid from this loop array list!
  [featuredGrid, recommendationsGrid, reviewsGrid, audienceGrid].forEach(
    (grid) => {
      if (grid) {
        grid.addEventListener("click", async (e) => {
          const targetedCard = e.target.closest(".review-click-target-node");
          
          // Guard: Ensure they didn't accidentally click a share/copy button inside the card
          if (targetedCard && !e.target.closest("button")) {
            const id = targetedCard.getAttribute("data-review-id");
            
            // 1. Instantly show the full-screen loading popup!
            pageTransitionOverlay.style.display = "flex";
            
            // 2. Wait for the database to register the +1 view count
            await fetch(`${API_BASE_URL}/api/reviews/view/${id}`, {
              method: "POST",
            }).catch((err) => console.error(err));
            
            // 3. Move to the details page
            window.location.href = `view-review.html?id=${id}`;
          }
        });
      }
    },
  );

  // ============================================================
  // ✅ FIXED: COMMUNITY CARDS SOCIAL ACTION INTERACTION & POPUP CONTROLLER
  // ============================================================
  if (communityGrid) {
    communityGrid.addEventListener("click", async (e) => {
      const userEmail = localStorage.getItem("userEmail");

      // ============================================================
      // 1. LIVE HEART (LIKE) ACTION WITH COLOR TOGGLE & STORAGE COUNT
      // ============================================================
      const heartBtn = e.target.closest(".feed-heart-btn");
      if (heartBtn) {
        if (!userEmail) {
          alert("Please sign in to react to this post!");
          document
            .getElementById("signin-modal-overlay")
            ?.classList.add("active");
          return;
        }

        const commentId = heartBtn.getAttribute("data-comment-id");
        const counterElement = heartBtn.querySelector(".heart-counter-text");
        const iconElement = heartBtn.querySelector("ion-icon");

        try {
          // Send the upvote packet payload to your backend database row
          const response = await fetch(
            `${API_BASE_URL}/api/comments/like/${commentId}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: userEmail }),
            },
          );
          const data = await response.json();

          if (data.success) {
            // ✅ Dynamic Counter Update
            if (counterElement) counterElement.textContent = data.newCount;

            // ✅ Visual State Toggle (Filled Red Heart vs Dark Slate Outline)
            if (iconElement) {
              if (data.liked) {
                iconElement.setAttribute("name", "heart");
                heartBtn.style.setProperty("color", "#ef4444", "important"); // Solid Bright Red
                heartBtn.style.setProperty(
                  "border-color",
                  "#ef4444",
                  "important",
                );
              } else {
                iconElement.setAttribute("name", "heart-outline");
                heartBtn.style.setProperty("color", "#78909c", "important"); // Default Slate Gray
                heartBtn.style.setProperty(
                  "border-color",
                  "#1a282d",
                  "important",
                );
              }
            }
          }
        } catch (err) {
          console.error("Error writing live heart metric update:", err);
        }
        return;
      }

      // DELETE POP UP COMMUNITY
      const deleteBtn = e.target.closest(".feed-delete-btn");
      if (deleteBtn) {
        e.preventDefault();
        const commentId = deleteBtn.getAttribute("data-comment-id");
        const userEmail = localStorage.getItem("userEmail");

        const deleteOverlay = document.getElementById(
          "community-delete-overlay",
        );
        const confirmBtn = document.getElementById("comm-delete-confirm-btn");
        const cancelBtn = document.getElementById("comm-delete-cancel-btn");

        if (deleteOverlay && confirmBtn && cancelBtn) {
          const titleText = deleteOverlay.querySelector(".delete-modal-title");
          const bodyText = deleteOverlay.querySelector(".delete-modal-text");
          if (titleText) titleText.textContent = "Delete Post?";
          if (bodyText)
            bodyText.textContent =
              "Are you sure you want to permanently delete this post? All community discussion comments will be lost.";
          // FIX: Add the "active" class to override the CSS opacity!
          deleteOverlay.classList.add("active");
          // Handle Cancel
          cancelBtn.onclick = function () {
            deleteOverlay.classList.remove("active");
          };
          // Handle Confirm
          confirmBtn.onclick = async function () {
            deleteOverlay.classList.remove("active");

            try {
              const response = await fetch(
                `${API_BASE_URL}/api/comments/${commentId}`,
                {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: userEmail }),
                },
              );

              if (response.ok) {
                // It worked! Refresh the feed
                await fetchAndRenderCommunityFeed(userEmail);
              } else {
                alert("Unauthorized: You can only delete your own posts.");
              }
            } catch (err) {
              console.error("Error deleting post:", err);
            }
          };
        } else {
          console.error(
            "Could not find the community-delete-overlay HTML elements.",
          );
        }
        return;
      }

      // 2. UPDATED: COMMENT BUTTON NOW TRIGGERS THE COMMUNITY MODAL
      const commentBtn = e.target.closest(".feed-comment-btn");
      if (commentBtn) {
        // Find the parent card and trigger its expand logic instead of redirecting
        const cardNode = commentBtn.closest(".community-feed-card");
        const expandBtn = cardNode.querySelector(".feed-expand-btn");
        expandBtn.click(); // Programmatically trigger the expand button's click event
        return;
      }

      // 3. COPY ACTION UTILITY BUTTON
      const copyBtn = e.target.closest(".feed-copy-btn");
      if (copyBtn) {
        const cardNode = copyBtn.closest(".review-click-target-node");
        const textToCopy = cardNode
          ?.querySelector(".review-text")
          ?.textContent.trim()
          .replace(/^"|"$/g, "");
        if (textToCopy) {
          navigator.clipboard.writeText(textToCopy);
          alert("Comment text copied to clipboard successfully!");
        }
        return;
      }

      // 4. SHARE ACTION UTILITY BUTTON
      const shareBtn = e.target.closest(".feed-share-btn");
      if (shareBtn) {
        const cardNode = shareBtn.closest(".review-click-target-node");
        const reviewId = cardNode?.getAttribute("data-review-id");
        if (reviewId) {
          const threadUrl = `${window.location.origin}/view-review.html?id=${reviewId}`;
          navigator.clipboard.writeText(threadUrl);
          alert("Review discussion link copied to clipboard!");
        }
        return;
      }

      // 5. INLINE SEE MORE / SEE LESS TEXT TOGGLER
      const seeMoreBtn = e.target.closest(".see-more-btn");
      if (seeMoreBtn) {
        e.preventDefault();
        e.stopPropagation();
        const cardNode = seeMoreBtn.closest(".community-feed-card");
        const textNode = cardNode?.querySelector(".review-text");
        if (textNode) {
          textNode.classList.toggle("expanded");
          if (textNode.classList.contains("expanded")) {
            seeMoreBtn.textContent = "See Less";
            textNode.style.maxHeight = "none";
            textNode.style.maskImage = "none";
            textNode.style.webkitMaskImage = "none";
          } else {
            seeMoreBtn.textContent = "See More";
            textNode.style.maxHeight = "4.8em";
            textNode.style.maskImage =
              "linear-gradient(to bottom, black 60%, transparent 100%)";
            textNode.style.webkitMaskImage =
              "linear-gradient(to bottom, black 60%, transparent 100%)";
          }
        }
        return;
      }

      // ============================================================
      // 6. POPUP VIEW MODAL DISPATCH WITH ACTIVE SUB-COMMENT DISCUSSION REPLIES
      // ============================================================
      const expandBtn = e.target.closest(".feed-expand-btn");
      const cardNode = e.target.closest(".review-click-target-node");

      if (
        expandBtn ||
        (cardNode && !e.target.closest(".feed-interaction-btn"))
      ) {
        const activeNode =
          cardNode || expandBtn.closest(".review-click-target-node");
        const commentId = activeNode.getAttribute("data-comment-id");
        const parentReviewId = activeNode.getAttribute("data-review-id");

        if (!window.cachedCommunityComments) return;

        const foundComment = window.cachedCommunityComments.find(
          (item) => String(item.comment_id) === String(commentId),
        );
        if (foundComment) {
          // 1. Bind main profile credential data positions safely
          document.getElementById("comm-modal-username").textContent =
            foundComment.username;
          document.getElementById("comm-modal-text").textContent =
            foundComment.comment_text;

          // Render rating stars header context row
          const score = parseFloat(foundComment.rating) || 4;
          let starHTML = "";
          for (let i = 1; i <= 5; i++) {
            starHTML += `<ion-icon name="${score >= i ? "star" : "star-outline"}"></ion-icon>`;
          }
          document.getElementById("comm-modal-stars").innerHTML = starHTML;

          // Save references onto form tracking layout variables
          const replyForm = document.getElementById("comm-modal-reply-form");
          replyForm.setAttribute("data-target-review-id", parentReviewId);
          replyForm.setAttribute("data-target-parent-id", commentId);

          // 2. HELPER FUNCTION: Fetch and render active sub-replies
          const reloadModalSubReplies = async () => {
            const repliesList = document.getElementById(
              "comm-modal-replies-list",
            );
            if (!repliesList) return;

            try {
              const res = await fetch(
                `${API_BASE_URL}/api/reviews/details/${parentReviewId}?email=${encodeURIComponent(userEmail || "")}`,
              );
              const threadData = await res.json();

              const subReplies = threadData.comments.filter(
                (reply) =>
                  Number(reply.parent_comment_id) === Number(commentId),
              );

              // Get current user details for authorization
              const currentUsername = localStorage.getItem("username");
              const isGlobalAdmin = localStorage.getItem("isAdmin") === "true";

              if (subReplies.length === 0) {
                repliesList.innerHTML = `<p style="color: #567; font-size: 12px; font-style: italic; margin: 0; text-align: left;">No discussion responses left here yet.</p>`;
                return;
              }

              repliesList.innerHTML = subReplies
                .map((reply) => {
                  const isOwner = reply.username === currentUsername;
                  const canDelete = isOwner || isGlobalAdmin;

                  return `
            <div class="sub-reply-card-node" style="background: rgba(255,255,255,0.01); border-left: 3px solid var(--citrine); padding: 10px 14px; border-radius: 0 6px 6px 0; border: 1px solid rgba(255,255,255,0.02); text-align: left; margin-bottom: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="font-size: 12px; font-weight: 700; color: #fff;">${reply.username}</span>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 10px; color: #567;">${new Date(reply.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  
                  <button type="button" class="sub-reply-copy-btn" style="background: transparent; border: none; color: #78909c; cursor: pointer; display: flex; align-items: center; padding: 2px; transition: 0.2s;" title="Copy text">
                    <ion-icon name="copy-outline" style="font-size: 14px; pointer-events: none;"></ion-icon>
                  </button>

                  ${
                    canDelete
                      ? `
                  <button type="button" class="sub-reply-edit-btn" data-comment-id="${reply.comment_id}" style="background: transparent; border: none; color: var(--citrine); cursor: pointer; display: flex; align-items: center; padding: 2px; transition: 0.2s;" title="Edit reply">
                    <ion-icon name="create-outline" style="font-size: 14px; pointer-events: none;"></ion-icon>
                  </button>
                  <button type="button" class="sub-reply-delete-btn" data-comment-id="${reply.comment_id}" style="background: transparent; border: none; color: #ff4560; cursor: pointer; display: flex; align-items: center; padding: 2px; transition: 0.2s;" title="Delete reply">
                    <ion-icon name="trash-outline" style="font-size: 14px; pointer-events: none;"></ion-icon>
                  </button>
                  `
                      : ""
                  }
                  
                </div>
              </div>
              <p id="sub-reply-text-${reply.comment_id}" style="font-size: 12.5px; color: #cfd8dc; margin: 0; line-height: 1.5; word-break: break-word;">${reply.comment_text}</p>
            </div>
          `;
                })
                .join("");
            } catch (err) {
              console.error("Failed loading thread map sub-replies:", err);
            }
          };

          await reloadModalSubReplies();

          // 3. UPDATED SECURED REPLY SUBMISSION PIPELINE
          replyForm.onsubmit = async function (formEvent) {
            formEvent.preventDefault();
            const inputField = document.getElementById(
              "comm-modal-reply-input",
            );
            const replyMsg = inputField.value.trim();

            if (!userEmail) {
              alert("Please sign in to reply!");
              return;
            }

            try {
              const response = await fetch(
                `${API_BASE_URL}/api/reviews/details/${parentReviewId}/comments`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email: userEmail,
                    commentText: replyMsg,
                    rating: 5,
                    parentCommentId: parseInt(commentId, 10),
                  }),
                },
              );

              if (response.ok) {
                inputField.value = "";

                await reloadModalSubReplies();

                const activeStartupEmail =
                  localStorage.getItem("userEmail") || "";
                await fetchAndRenderCommunityFeed(activeStartupEmail);

                const successOverlay =
                  document.getElementById("success-overlay");
                const successBtn = document.getElementById("success-btn");
                const successTitle = document.getElementById("success-title");
                const successMsg = document.getElementById("success-message");

                if (successOverlay && successBtn) {
                  successOverlay.classList.add("active");
                  successTitle.textContent = "Reply Posted!";
                  successMsg.textContent =
                    "Your response has been successfully posted to the discussion thread.";

                  // Close the modal when the user clicks OK
                  successBtn.onclick = function () {
                    successOverlay.classList.remove("active");
                  };
                }
              } else {
                const errorData = await response.json();
                alert(errorData.message || "Failed to save comment.");
              }
            } catch (err) {
              console.error("Error posting forum sub-reply:", err);
              alert("Network error. Please try again.");
            }
          };

          // Reveal the modal box overlay interface window layout portal
          const viewModal = document.getElementById(
            "community-view-modal-overlay",
          );
          if (viewModal) {
            viewModal.classList.add("active");
            document.body.classList.add("active");
          }
        }
      }
    });
  }

  // 7. CLOSING HANDLERS FOR THE COMMUNITY POPUP
  const closeCommViewBtn = document.getElementById(
    "close-community-view-modal-btn",
  );
  const commViewModal = document.getElementById("community-view-modal-overlay");
  if (closeCommViewBtn && commViewModal) {
    closeCommViewBtn.addEventListener("click", () => {
      commViewModal.classList.remove("active");
      document.body.classList.remove("active");
    });
  }
  if (commViewModal) {
    commViewModal.addEventListener("click", (e) => {
      if (e.target === commViewModal) {
        commViewModal.classList.remove("active");
        document.body.classList.remove("active");
      }
    });
  }

  // ==========================================
  // 8. "SEE MORE" PAGE DYNAMIC RENDERER
  // ==========================================
  if (window.location.pathname.includes("see-more.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");
    const grid = document.getElementById("see-more-grid");
    const pageTitle = document.getElementById("see-more-page-title");
    const userEmail = localStorage.getItem("userEmail") || "";

    if (grid && pageTitle) {
      grid.innerHTML = loadingSpinnerHTML; // Show spinner immediately

      // 1. Determine Title and API Endpoint
      let fetchUrl = `${API_BASE_URL}/api/reviews/all`; 
      
      if (category === "featured") {
        pageTitle.textContent = "NEW ON REAV-ON";
        fetchUrl = `${API_BASE_URL}/api/reviews/featured`;
      } else if (category === "recommendations") {
        pageTitle.textContent = "RECOMMENDATIONS";
        fetchUrl = `${API_BASE_URL}/api/reviews/recommendations`;
      } else if (category === "user") {
        pageTitle.textContent = "ADDED BY YOU";
        if (!userEmail) {
          grid.innerHTML = `<p style="color: #678; font-size: 14px; grid-column: 1 / -1; text-align: center; padding: 40px;">Please sign in to view your reviews.</p>`;
          return;
        }
        fetchUrl = `${API_BASE_URL}/api/reviews/user?email=${encodeURIComponent(userEmail)}`;
      } else if (category === "audience") {
        pageTitle.textContent = "AUDIENCE REVIEWS";
        fetchUrl = `${API_BASE_URL}/api/reviews/all`;
      }

      // 2. Fetch the Data and Render the Cards
      fetch(fetchUrl)
        .then(response => response.json())
        .then(data => {
          if (!data || data.length === 0) {
            grid.innerHTML = `<p style="color: #678; font-size: 14px; grid-column: 1 / -1; text-align: center; padding: 40px;">No movies found in this category.</p>`;
            return;
          }

          grid.innerHTML = data.map((item) => {
            const ratingCount = parseInt(item.rating_count) || 0;
            const avgRating = parseFloat(item.avg_rating) || 0;
            const starText = ratingCount > 0 ? "★".repeat(Math.round(avgRating)) + "☆".repeat(5 - Math.round(avgRating)) : "☆☆☆☆☆";

            return `
              <div class="premium-box-card review-click-target-node" data-review-id="${item.review_id}" style="border-bottom: 3px solid var(--citrine); cursor: pointer;">
                <div class="poster-wrapper">
                  <img src="${item.image_data || "./assets/images/obs.jpg"}" alt="${item.movie_name}" />
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
          }).join("");
        })
        .catch(err => {
          console.error("Error loading category data:", err);
          grid.innerHTML = `<p style="color: #ff4560; font-size: 14px; grid-column: 1 / -1; text-align: center; padding: 40px;">Error loading database connection.</p>`;
        });
    }
  }

  // ==========================================
  // 🚀 CORE GRID RUNNERS & INITIALIZERS
  // ==========================================
  fetchAndRenderFeaturedReviews();
  fetchAndRenderUserReviews();
  fetchAndRenderAudienceReviews();
  fetchAndRenderRecommendations();

  // ✅ INITIALIZE HERE: Keeps it completely grouped with the other loaders
  const activeStartupEmail = localStorage.getItem("userEmail") || "";
  fetchAndRenderCommunityFeed(activeStartupEmail);

  // Automatically check URL parameters and build data if sitting on view-review.html
  if (window.location.pathname.includes("view-review.html")) {
    const pageUrlParams = new URLSearchParams(window.location.search);
    const activeRouteId = pageUrlParams.get("id");
    if (activeRouteId) {
      openReviewDetailsViewport(activeRouteId);
    }
  }
});




/*-----------------------------------*\
 * #DYNAMIC "SEE MORE" GRID CONTROLLER
\*-----------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  const activityLinks = document.querySelectorAll(".activity-link");
  
  // 1. Handle the Click (Expand / Collapse)
  activityLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      
      const container = this.closest(".container");
      const grid = container.querySelector(".movie-row-grid");
      
      if (grid) {
        // Toggle the expansion class we added in CSS
        grid.classList.toggle("show-all");
        
        if (grid.classList.contains("show-all")) {
          // Change to SEE LESS with an up arrow
          this.innerHTML = '<ion-icon name="chevron-up-outline" style="margin-right:4px; font-size:16px;"></ion-icon> SEE LESS';
        } else {
          // Change back to SEE MORE with a down arrow
          this.innerHTML = '<ion-icon name="chevron-down-outline" style="margin-right:4px; font-size:16px;"></ion-icon> SEE MORE';
          
          // Smoothly scroll back to the section title so the user doesn't get lost at the bottom of the page!
          container.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  // 2. Auto-Hide Tracker (Runs automatically when database data arrives)
  const observer = new MutationObserver(() => {
    document.querySelectorAll(".movie-row-grid").forEach(grid => {
      const container = grid.closest(".container");
      const seeMoreBtn = container?.querySelector(".activity-link");
      
      if (seeMoreBtn) {
        const cards = grid.querySelectorAll(".premium-box-card");
        
        // If there are 6 or fewer movies, completely hide the SEE MORE button
        if (cards.length > 0 && cards.length <= 6) {
          seeMoreBtn.style.display = "none";
        } 
        // If there are MORE than 6 movies, show it and inject the default down arrow
        else if (cards.length > 6 && !seeMoreBtn.hasAttribute("data-initialized")) {
          seeMoreBtn.style.display = "flex";
          seeMoreBtn.innerHTML = '<ion-icon name="chevron-down-outline" style="margin-right:4px; font-size:16px;"></ion-icon> SEE MORE';
          seeMoreBtn.setAttribute("data-initialized", "true"); // Prevent infinite loops
        }
      }
    });
  });
  
  // Start observing the page for database injections
  observer.observe(document.body, { childList: true, subtree: true });
});
