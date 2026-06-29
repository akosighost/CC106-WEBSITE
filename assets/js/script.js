"use strict";

// 1. Define your base URL FIRST so the code knows what it is
const API_BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://reav-on-api.onrender.com";
    
console.log("Current API URL:", API_BASE_URL);

// --- GLOBAL CLOUDINARY IMAGE UPLOADER ---
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dlienxiay/image/upload";
const CLOUDINARY_PRESET = "na9nfwgv";


async function uploadImageToCloud(base64Data) {
  // If it's already a clean URL or empty, skip it
  if (!base64Data || !base64Data.startsWith("data:image")) return base64Data; 
  
  const formData = new FormData();
  formData.append("file", base64Data);
  formData.append("upload_preset", CLOUDINARY_PRESET);

  const response = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: formData
  });
  const data = await response.json();
  return data.secure_url; // Returns the tiny URL link!
}
// ----------------------------------------

// --- SKELETON LOADER FOR MOVIE REVIEWS (REDDIT STYLE) ---
const skeletonRedditCommentsHTML = `
  <style>
    .skeleton-pulse { animation: skeleton-pulse-anim 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    @keyframes skeleton-pulse-anim { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
  </style>
  <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 15px; width: 100%;">
    ${[1, 2, 3].map(i => `
    <div class="skeleton-pulse" style="display: flex; gap: 12px; margin-top: 12px;">
      <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
        <div style="width: 32px; height: 32px; border-radius: 50%; background: #1a282d; border: 1px solid var(--citrine); flex-shrink: 0;"></div>
        <div style="width: 2px; height: 40px; background: #1a282d; border-radius: 2px;"></div>
      </div>
      <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 8px; padding-top: 4px;">
        <div style="display: flex; gap: 10px; align-items: center;">
          <div style="width: 120px; height: 12px; border-radius: 4px; background: #243337;"></div>
          <div style="width: 60px; height: 10px; border-radius: 4px; background: #1a282d;"></div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <div style="width: 95%; height: 10px; border-radius: 4px; background: #243337;"></div>
          <div style="width: 70%; height: 10px; border-radius: 4px; background: #243337;"></div>
        </div>
      </div>
    </div>`).join("")}
  </div>
`;

// --- PASTE THE SPINNER RIGHT HERE ---
// A reusable loading spinner for the data grids
const loadingSpinnerHTML = `
  <style>
    .uiverse-loader { width: 112px; height: 112px; position: relative; }
    .uiverse-loader .box1, .uiverse-loader .box2, .uiverse-loader .box3 {
      border: 16px solid var(--citrine); box-sizing: border-box; position: absolute; display: block;
    }
    .uiverse-loader .box1 { width: 112px; height: 48px; margin-top: 64px; margin-left: 0px; animation: abox1 1s 1s forwards ease-in-out infinite; }
    .uiverse-loader .box2 { width: 48px; height: 48px; margin-top: 0px; margin-left: 0px; animation: abox2 1s 1s forwards ease-in-out infinite; }
    .uiverse-loader .box3 { width: 48px; height: 48px; margin-top: 0px; margin-left: 64px; animation: abox3 1s 1s forwards ease-in-out infinite; }

    @keyframes abox1 {
      0% { width: 112px; height: 48px; margin-top: 64px; margin-left: 0px; }
      12.5% { width: 48px; height: 48px; margin-top: 64px; margin-left: 0px; }
      25% { width: 48px; height: 48px; margin-top: 64px; margin-left: 0px; }
      37.5% { width: 48px; height: 48px; margin-top: 64px; margin-left: 0px; }
      50% { width: 48px; height: 48px; margin-top: 64px; margin-left: 0px; }
      62.5% { width: 48px; height: 48px; margin-top: 64px; margin-left: 0px; }
      75% { width: 48px; height: 112px; margin-top: 0px; margin-left: 0px; }
      87.5% { width: 48px; height: 48px; margin-top: 0px; margin-left: 0px; }
      100% { width: 48px; height: 48px; margin-top: 0px; margin-left: 0px; }
    }
    @keyframes abox2 {
      0% { width: 48px; height: 48px; margin-top: 0px; margin-left: 0px; }
      12.5% { width: 48px; height: 48px; margin-top: 0px; margin-left: 0px; }
      25% { width: 48px; height: 48px; margin-top: 0px; margin-left: 0px; }
      37.5% { width: 48px; height: 48px; margin-top: 0px; margin-left: 0px; }
      50% { width: 112px; height: 48px; margin-top: 0px; margin-left: 0px; }
      62.5% { width: 48px; height: 48px; margin-top: 0px; margin-left: 64px; }
      75% { width: 48px; height: 48px; margin-top: 0px; margin-left: 64px; }
      87.5% { width: 48px; height: 48px; margin-top: 0px; margin-left: 64px; }
      100% { width: 48px; height: 48px; margin-top: 0px; margin-left: 64px; }
    }
    @keyframes abox3 {
      0% { width: 48px; height: 48px; margin-top: 0px; margin-left: 64px; }
      12.5% { width: 48px; height: 48px; margin-top: 0px; margin-left: 64px; }
      25% { width: 48px; height: 112px; margin-top: 0px; margin-left: 64px; }
      37.5% { width: 48px; height: 48px; margin-top: 64px; margin-left: 64px; }
      50% { width: 48px; height: 48px; margin-top: 64px; margin-left: 64px; }
      62.5% { width: 48px; height: 48px; margin-top: 64px; margin-left: 64px; }
      75% { width: 48px; height: 48px; margin-top: 64px; margin-left: 64px; }
      87.5% { width: 48px; height: 48px; margin-top: 64px; margin-left: 64px; }
      100% { width: 112px; height: 48px; margin-top: 64px; margin-left: 0px; }
    }
  </style>
  <div style="grid-column: 1 / -1; display: flex; justify-content: center; padding: 60px 0;">
    <div class="uiverse-loader" style="transform: scale(0.35);">
      <div class="box1"></div><div class="box2"></div><div class="box3"></div>
    </div>
  </div>
`;
// ------------------------------------

// --- FULL SCREEN PAGE TRANSITION POPUP ---
const pageTransitionOverlay = document.createElement("div");
pageTransitionOverlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(11, 20, 22, 0.85); backdrop-filter: blur(5px); z-index: 9999; display: none; justify-content: center; align-items: center; flex-direction: column;";
pageTransitionOverlay.innerHTML = `

<style>/* From Uiverse.io by peter_7887 */ 
.spinner {
  position: absolute;
  width: 9px;
  height: 9px;
}

.spinner div {
  position: absolute;
  width: 50%;
  height: 150%;
  background: #667788;
  transform: rotate(calc(var(--rotation) * 1deg))
    translate(0, calc(var(--translation) * 1%));
  animation: spinner-fzua35 1s calc(var(--delay) * 1s) infinite ease;
}

.spinner div:nth-child(1) {
  --delay: 0.1;
  --rotation: 36;
  --translation: 150;
}

.spinner div:nth-child(2) {
  --delay: 0.2;
  --rotation: 72;
  --translation: 150;
}

.spinner div:nth-child(3) {
  --delay: 0.3;
  --rotation: 108;
  --translation: 150;
}

.spinner div:nth-child(4) {
  --delay: 0.4;
  --rotation: 144;
  --translation: 150;
}

.spinner div:nth-child(5) {
  --delay: 0.5;
  --rotation: 180;
  --translation: 150;
}

.spinner div:nth-child(6) {
  --delay: 0.6;
  --rotation: 216;
  --translation: 150;
}

.spinner div:nth-child(7) {
  --delay: 0.7;
  --rotation: 252;
  --translation: 150;
}

.spinner div:nth-child(8) {
  --delay: 0.8;
  --rotation: 288;
  --translation: 150;
}

.spinner div:nth-child(9) {
  --delay: 0.9;
  --rotation: 324;
  --translation: 150;
}

.spinner div:nth-child(10) {
  --delay: 1;
  --rotation: 360;
  --translation: 150;
}

@keyframes spinner-fzua35 {
  0%,
  10%,
  20%,
  30%,
  50%,
  60%,
  70%,
  80%,
  90%,
  100% {
    transform: rotate(calc(var(--rotation) * 1deg))
      translate(0, calc(var(--translation) * 1%));
  }

  50% {
    transform: rotate(calc(var(--rotation) * 1deg))
      translate(0, calc(var(--translation) * 1.5%));
  }
}
</style>


<div class="spinner">
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
</div>

`;
document.body.appendChild(pageTransitionOverlay);
// -----------------------------------------
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
  const creatorModal = document.getElementById("creator-warning-modal");
  const creatorBtn = document.getElementById("creator-warning-btn");
  
  const whatsNewModal = document.getElementById("whats-new-modal");
  const whatsNewBtn = document.getElementById("whats-new-btn");

  const hasSeenCreator = localStorage.getItem("creatorWarningShown");
  const hasSeenWhatsNew = localStorage.getItem("whatsNewShown");

  // 5. Handle "See More" Tech Stack Toggle
  const devSeeMoreBtn = document.getElementById("dev-see-more-btn");
  const devTechStack = document.getElementById("dev-tech-stack");

  if (devSeeMoreBtn && devTechStack) {
    devSeeMoreBtn.addEventListener("click", () => {
      if (devTechStack.style.display === "none") {
        // Show it
        devTechStack.style.display = "block";
        devSeeMoreBtn.textContent = "Hide Tech Stack";
      } else {
        // Hide it
        devTechStack.style.display = "none";
        devSeeMoreBtn.textContent = "View Tech Stack";
      }
    });
  }

  // 1. Show the Developer Note first if they haven't seen it
  if (!hasSeenCreator) {
    if (creatorModal) {
      creatorModal.style.display = "flex";
      document.body.style.overflow = "hidden"; // Stop scrolling
    }
  } 
  // 2. If they already saw the Developer Note, but NOT the What's New popup, show it
  else if (!hasSeenWhatsNew) {
    if (whatsNewModal) {
      whatsNewModal.style.display = "flex";
      document.body.style.overflow = "hidden"; // Stop scrolling
    }
  }

  // 3. Handle clicking "Close" on the Developer Note
  if (creatorBtn) {
    creatorBtn.addEventListener("click", () => {
      creatorModal.style.display = "none";
      localStorage.setItem("creatorWarningShown", "true");

      // Instantly trigger the What's New modal right after!
      if (!hasSeenWhatsNew && whatsNewModal) {
        whatsNewModal.style.display = "flex";
      } else {
        document.body.style.overflow = "auto"; // Resume scrolling
      }
    });
  }

  // 4. Handle clicking "Got it" on the What's New Modal
  if (whatsNewBtn) {
    whatsNewBtn.addEventListener("click", () => {
      whatsNewModal.style.display = "none";
      document.body.style.overflow = "auto"; // Resume scrolling
      localStorage.setItem("whatsNewShown", "true"); // Save the flag
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

  const saveAvatarBtn = document.getElementById("save-avatar-btn");
  let pendingAvatarBase64 = null; // Holds the image temporarily before saving

  if (avatarContainer && avatarUpload) {
    // 1. Trigger file picker on click
    avatarContainer.addEventListener("click", () => avatarUpload.click());

    // 2. Just SHOW the preview when a file is picked (Don't upload yet)
    avatarUpload.addEventListener("change", function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const img = new Image();
          img.onload = function () {
            // Compress the image
            const canvas = document.createElement("canvas");
            const MAX_SIZE = 300; 
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
            
            // Show the preview in the circle
            if (avatarImg) {
              avatarImg.src = compressedBase64;
              avatarImg.style.display = "block";
            }
            if (defaultIcon) defaultIcon.style.display = "none";

            // Store the string temporarily and reveal the Save Button!
            pendingAvatarBase64 = compressedBase64;
            if (saveAvatarBtn) saveAvatarBtn.style.display = "block";
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    // 3. Upload to Cloudinary, THEN Database
    if (saveAvatarBtn) {
      saveAvatarBtn.addEventListener("click", async function() {
        if (!pendingAvatarBase64) return;
        
        const userEmail = localStorage.getItem("userEmail");
        if (userEmail) {
          try {
            this.textContent = "Uploading to Cloud...";
            this.disabled = true;

            // A. Send the giant image to Cloudinary to get the tiny URL
            const finalImageUrl = await uploadImageToCloud(pendingAvatarBase64);

            this.textContent = "Saving...";

            // B. Save only the tiny URL to the database
            const response = await fetch(`${API_BASE_URL}/api/users/avatar`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: userEmail, avatarData: finalImageUrl })
            });
            
            if (response.ok) {
              localStorage.setItem("userAvatar", finalImageUrl);
              window.loadUserAvatar(); 
              
              this.textContent = "Saved!";
              setTimeout(() => {
                this.style.display = "none";
                this.textContent = "Save Picture";
                this.disabled = false;
              }, 1000);
            } else {
              alert("Failed to sync avatar to database.");
              this.textContent = "Save Picture";
              this.disabled = false;
            }
          } catch (err) {
            console.error("Network error syncing avatar:", err);
            alert("Network error: Could not reach the server.");
            this.textContent = "Save Picture";
            this.disabled = false;
          }
        }
      });
    }
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

  // Helper function to load live stats from the database
  window.loadUserStats = async function() {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/stats?email=${encodeURIComponent(userEmail)}`);
      if (response.ok) {
        const stats = await response.json();
        
        // Inject the numbers into the HTML IDs we just created
        const reviewsElem = document.getElementById("stat-reviews-count");
        const likesElem = document.getElementById("stat-likes-count");
        const commentsElem = document.getElementById("stat-comments-count");

        if (reviewsElem) reviewsElem.textContent = stats.reviews || 0;
        if (likesElem) likesElem.textContent = stats.likes || 0;
        if (commentsElem) commentsElem.textContent = stats.comments || 0;
      }
    } catch (err) {
      console.error("Failed to load user stats:", err);
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

    // 3. Save to live Database, show Loading State, and Update UI
    saveBioBtn.addEventListener("click", async () => {
      const newBio = editBioInput.value.trim();
      const userEmail = localStorage.getItem("userEmail");

      if (!userEmail) return;

      // A. Trigger Loading State
      const originalText = saveBioBtn.textContent;
      saveBioBtn.textContent = "SAVING...";
      saveBioBtn.style.opacity = "0.7";
      saveBioBtn.disabled = true;

      try {
        // B. Send the new bio to the Render backend
        const response = await fetch(`${API_BASE_URL}/api/users/bio`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail, bio: newBio })
        });

        if (response.ok) {
          // C. Save to browser memory so it stays on screen
          localStorage.setItem("userBio", newBio);
          window.loadUserBio();

          // D. Hide the edit box and show the text
          bioEditWrapper.style.display = "none";
          bioDisplayWrapper.style.display = "flex";
        } else {
          alert("Failed to sync bio to database.");
        }
      } catch (err) {
        console.error("Bio sync error:", err);
        alert("Network error: Could not reach the server.");
      } finally {
        // E. Always restore the button back to normal
        saveBioBtn.textContent = originalText;
        saveBioBtn.style.opacity = "1";
        saveBioBtn.disabled = false;
      }
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
    // 1. Desktop Profile Button (Styling)
    if (signinBtn) {
      signinBtn.className = "btn btn-secondary profile-nav-btn";
      signinBtn.style.borderColor = "var(--citrine)";
      signinBtn.style.padding = "10px 20px";
      signinBtn.style.textTransform = "none";

      signinBtn.addEventListener("click", (e) => {
        e.preventDefault();
        returnToMobileMenu = false; // Reset flag
        if (profileModal) {
          document.getElementById("profile-card-username").textContent = localStorage.getItem("username");
          document.getElementById("profile-card-email").textContent = localStorage.getItem("userEmail") || "test@gmail.com";
          document.getElementById("profile-card-password").value = localStorage.getItem("userPassword") || "password123";
          
          // These 3 lines load your dynamic profile data
          if (typeof window.loadUserBio === "function") window.loadUserBio();
          if (typeof window.loadUserAvatar === "function") window.loadUserAvatar();
          if (typeof window.loadUserStats === "function") window.loadUserStats(); 
          
          profileModal.classList.add("active");
        }
      });
    }

    // 2. Mobile Profile Button (Click Logic)
    if (mobileSigninBtn) {
      mobileSigninBtn.addEventListener("click", (e) => {
        e.preventDefault();
        returnToMobileMenu = true; // Set memory flag!
        document.querySelector("[data-menu-close-btn]")?.click(); // Auto-close sidebar
        if (profileModal) {
          document.getElementById("profile-card-username").textContent = localStorage.getItem("username");
          document.getElementById("profile-card-email").textContent = localStorage.getItem("userEmail") || "test@gmail.com";
          document.getElementById("profile-card-password").value = localStorage.getItem("userPassword") || "password123";
          
          // ✅ NEW: Ensure all dynamic data loads for mobile users!
          if (typeof window.loadUserBio === "function") window.loadUserBio();
          if (typeof window.loadUserAvatar === "function") window.loadUserAvatar();
          if (typeof window.loadUserStats === "function") window.loadUserStats();
          
          profileModal.classList.add("active");
        }
      });
    }
    // 3. NEW: Instantly inject the saved Avatar and Username into the Nav Buttons!
    if (typeof window.loadUserAvatar === "function") {
      window.loadUserAvatar();
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

  // Switch from Sign Up back to Sign In
  const switchToSigninBtn = document.getElementById("switch-to-signin-btn");
  if (switchToSigninBtn) {
    switchToSigninBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (signupModal) signupModal.classList.remove("active");
      if (signinModal) signinModal.classList.add("active");
    });
  }

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
          localStorage.setItem("isAdmin", data.is_admin);
          
          // ✅ FIXED: Catch the avatar regardless of what your backend named the column!
          const caughtAvatar = data.user_avatar || data.avatar_data || data.avatar || data.profile_pic;
          if (caughtAvatar) {
            localStorage.setItem("userAvatar", caughtAvatar);
          }
          if (data.bio) {
            localStorage.setItem("userBio", data.bio);
          }

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
      const confirmPassword = document.getElementById("signup-confirm-password").value;

      if (password !== confirmPassword) {
        alert("Your passwords do not match! Please try again.");
        return; // Stops the function immediately
      }

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

  // --- PASSWORD STRENGTH CHECKER ---
  const passwordInput = document.getElementById("signup-password");
  const strengthContainer = document.getElementById("password-strength-container");
  const registerBtn = signupForm.querySelector('button[type="submit"]');

  if (passwordInput && strengthContainer) {
    passwordInput.addEventListener("input", function() {
      const val = this.value;
      
      // Show container when user starts typing
      strengthContainer.style.display = val.length > 0 ? "block" : "none";

      // Validation Rules
      const isLen = val.length >= 8;
      const isCase = /[a-z]/.test(val) && /[A-Z]/.test(val);
      const isNum = /[0-9]/.test(val);
      const isSpecial = /[^A-Za-z0-9]/.test(val);

      // Update UI
      document.getElementById("pwd-len").className = isLen ? "pwd-met" : "";
      document.getElementById("pwd-upper").className = isCase ? "pwd-met" : "";
      document.getElementById("pwd-num").className = isNum ? "pwd-met" : "";
      document.getElementById("pwd-special").className = isSpecial ? "pwd-met" : "";

      // Optional: Disable register button until strong
      const isStrong = isLen && isCase && isNum && isSpecial;
      registerBtn.disabled = !isStrong;
      registerBtn.style.opacity = isStrong ? "1" : "0.5";
      registerBtn.style.cursor = isStrong ? "pointer" : "not-allowed";
    });
  }
});

/*-----------------------------------*\
 * #FORM INPUT ELEMENT VISIBILITY TOGGLES
\*-----------------------------------*/
document.addEventListener("DOMContentLoaded", function () {
  
  // 1. Sign In Form Toggle
  const loginPasswordInput = document.getElementById("login-password");
  const loginToggleIcon = document.getElementById("password-toggle-icon");

  if (loginToggleIcon && loginPasswordInput) {
    loginToggleIcon.addEventListener("click", function () {
      if (loginPasswordInput.type === "password") {
        loginPasswordInput.type = "text";
        this.setAttribute("name", "eye-off-outline");
      } else {
        loginPasswordInput.type = "password";
        this.setAttribute("name", "eye-outline");
      }
    });
  }

  // 3. Confirm Password Form Toggle
  const signupPasswordInput = document.getElementById("signup-password");
  const signupToggleIcon = document.getElementById("signup-password-toggle-icon");

  if (signupToggleIcon && signupPasswordInput) {
    signupToggleIcon.addEventListener("click", function () {
      if (signupPasswordInput.type === "password") {
        signupPasswordInput.type = "text";
        this.setAttribute("name", "eye-off-outline");
      } else {
        signupPasswordInput.type = "password";
        this.setAttribute("name", "eye-outline");
      }
    });
  }

  // 3. Confirm Password Form Toggle
  const signupConfirmPasswordInput = document.getElementById("signup-confirm-password");
  const signupConfirmToggleIcon = document.getElementById("signup-confirm-password-toggle-icon");

  if (signupConfirmToggleIcon && signupConfirmPasswordInput) {
    signupConfirmToggleIcon.addEventListener("click", function () {
      if (signupConfirmPasswordInput.type === "password") {
        signupConfirmPasswordInput.type = "text";
        this.setAttribute("name", "eye-off-outline");
      } else {
        signupConfirmPasswordInput.type = "password";
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
    text: `Q: Is Reav-on free?\nA: Yes, Reav-on is free to use for browsing movie reviews.\n\nQ: How do I post a review?\nA: Click the "Upload Review" button on the top right.\n\nQ: Can I submit a review?\nA. Yes, users can upload reviews, write comments, and share posts in the Community section.`,
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

  // 1. UX UPGRADE: Beautiful graphic guiding the user exactly where to look
  const emptySearchStateHTML = `
    <div style="grid-column: 1 / -1; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 80px 20px; text-align: center;">
      <ion-icon name="search-circle-outline" style="font-size: 80px; color: var(--citrine); margin-bottom: 15px; opacity: 0.3;"></ion-icon>
      <h3 style="color: white; font-size: 18px; margin-bottom: 8px;">What are you looking for?</h3>
      <p style="color: #667788; font-size: 13px; max-width: 280px; line-height: 1.5;">Type a movie title in the search bar above to instantly scan the selected category.</p>
    </div>
  `;

  // 2. UX UPGRADE: Advanced Radar Search Loader
  const radarLoaderHTML = `
    <style>
      #wifi-loader { --front-color: var(--citrine); --back-color: rgba(229,184,0,0.15); --text-color: #667788; width: 64px; height: 64px; border-radius: 50px; position: relative; display: flex; justify-content: center; align-items: center; margin: 0 auto; }
      #wifi-loader svg { position: absolute; display: flex; justify-content: center; align-items: center; }
      #wifi-loader svg circle { position: absolute; fill: none; stroke-width: 6px; stroke-linecap: round; stroke-linejoin: round; transform: rotate(-100deg); transform-origin: center; }
      #wifi-loader svg circle.back { stroke: var(--back-color); }
      #wifi-loader svg circle.front { stroke: var(--front-color); }
      #wifi-loader svg.circle-outer { height: 86px; width: 86px; }
      #wifi-loader svg.circle-outer circle { stroke-dasharray: 62.75 188.25; }
      #wifi-loader svg.circle-outer circle.back { animation: circle-outer135 1.8s ease infinite 0.3s; }
      #wifi-loader svg.circle-outer circle.front { animation: circle-outer135 1.8s ease infinite 0.15s; }
      #wifi-loader svg.circle-middle { height: 60px; width: 60px; }
      #wifi-loader svg.circle-middle circle { stroke-dasharray: 42.5 127.5; }
      #wifi-loader svg.circle-middle circle.back { animation: circle-middle6123 1.8s ease infinite 0.25s; }
      #wifi-loader svg.circle-middle circle.front { animation: circle-middle6123 1.8s ease infinite 0.1s; }
      #wifi-loader svg.circle-inner { height: 34px; width: 34px; }
      #wifi-loader svg.circle-inner circle { stroke-dasharray: 22 66; }
      #wifi-loader svg.circle-inner circle.back { animation: circle-inner162 1.8s ease infinite 0.2s; }
      #wifi-loader svg.circle-inner circle.front { animation: circle-inner162 1.8s ease infinite 0.05s; }
      #wifi-loader .text { position: absolute; bottom: -40px; display: flex; justify-content: center; align-items: center; text-transform: uppercase; font-weight: 700; font-size: 11px; letter-spacing: 1px; }
      #wifi-loader .text::before, #wifi-loader .text::after { content: attr(data-text); }
      #wifi-loader .text::before { color: var(--text-color); }
      #wifi-loader .text::after { color: var(--front-color); animation: text-animation76 3.6s ease infinite; position: absolute; left: 0; }
      @keyframes circle-outer135 { 0% { stroke-dashoffset: 25; } 25% { stroke-dashoffset: 0; } 65% { stroke-dashoffset: 301; } 80% { stroke-dashoffset: 276; } 100% { stroke-dashoffset: 276; } }
      @keyframes circle-middle6123 { 0% { stroke-dashoffset: 17; } 25% { stroke-dashoffset: 0; } 65% { stroke-dashoffset: 204; } 80% { stroke-dashoffset: 187; } 100% { stroke-dashoffset: 187; } }
      @keyframes circle-inner162 { 0% { stroke-dashoffset: 9; } 25% { stroke-dashoffset: 0; } 65% { stroke-dashoffset: 106; } 80% { stroke-dashoffset: 97; } 100% { stroke-dashoffset: 97; } }
      @keyframes text-animation76 { 0% { clip-path: inset(0 100% 0 0); } 50% { clip-path: inset(0); } 100% { clip-path: inset(0 0 0 100%); } }
    </style>
    <div style="grid-column: 1 / -1; display: flex; justify-content: center; padding: 70px 0;">
      <div id="wifi-loader">
        <svg class="circle-outer" viewBox="0 0 86 86"><circle class="back" cx="43" cy="43" r="40"></circle><circle class="front" cx="43" cy="43" r="40"></circle><circle class="new" cx="43" cy="43" r="40"></circle></svg>
        <svg class="circle-middle" viewBox="0 0 60 60"><circle class="back" cx="30" cy="30" r="27"></circle><circle class="front" cx="30" cy="30" r="27"></circle></svg>
        <svg class="circle-inner" viewBox="0 0 34 34"><circle class="back" cx="17" cy="17" r="14"></circle><circle class="front" cx="17" cy="17" r="14"></circle></svg>
        <div class="text" data-text="Searching"></div>
      </div>
    </div>
  `;

  if (searchBtn && searchModal) {
    searchBtn.addEventListener("click", () => {
      searchModal.classList.add("active");
      if (searchInput) {
        searchInput.value = ""; // Clear input on open
        searchInput.focus();
        // Trigger the new graphic!
        resultsContainer.innerHTML = emptySearchStateHTML;
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

      // If the search bar is empty, reset the screen to the graphic
      if (query.length === 0) {
         resultsContainer.innerHTML = emptySearchStateHTML;
         return;
      }

      // Show the new Radar spinner while fetching!
      resultsContainer.innerHTML = radarLoaderHTML;

      try {
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
    let debounceTimer;
    searchInput.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(executeSearch, 400); 
    });
    
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

  //     document.querySelectorAll(".reviewer-name").forEach(element => {
  // if (element.textContent.trim().length > 20) {
  //   element.classList.add("marquee");
  // }
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
      <div class="premium-box-card review-click-target-node" data-review-id="${item.review_id}" style="border-bottom: 3px solid var(--citrine); cursor: pointer; display: flex; flex-direction: column; height: 100%;">
        
        <div class="poster-wrapper" style="position: relative; width: 100%; padding-top: 150%; height: 0; overflow: hidden; margin-bottom: 10px; background-color: #0b1416; border-radius: 4px;">
          <img src="${item.image_data || "./assets/images/obs.jpg"}" alt="${item.movie_name}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; display: block;" />
        </div>
        
        <div class="poster-footer" style="flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; gap: 4px;">
          <span class="reviewer-name" style="display: block; width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 13px; font-weight: 600; color: white;">${item.movie_name}</span>
          <div class="card-meta" style="display: flex; justify-content: space-between; align-items: center;">
            <span class="stars-indicator" style="color: var(--citrine); font-size: 11px;">${starText}</span>
            <span class="review-date" style="color: #667788; font-size: 11px;">${item.publish_date}</span>
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

        
        // ✅ STRICT MOVIE RATING SYNC
        // This strictly uses the movie's true global average from the database. No fake 5-star fallbacks!
        const score = parseFloat(c.movie_avg_rating) || 0; 

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

        // ✅ 1. THE AVATAR MEMORY BANK: Memorize faces from the main feed!
        const backendAvatar = c.user_avatar || c.avatar || c.avatar_data || c.profile_pic;
        if (backendAvatar) {
          let cache = JSON.parse(localStorage.getItem("globalAvatarCache") || "{}");
          cache[c.username] = backendAvatar;
          localStorage.setItem("globalAvatarCache", JSON.stringify(cache));
        }
        let cachedAvatar = JSON.parse(localStorage.getItem("globalAvatarCache") || "{}")[c.username];
        const safeFeedAvatar = backendAvatar || cachedAvatar || (isOwner ? localStorage.getItem("userAvatar") : null);

        return `
        <div class="review-card card-blue community-feed-card review-click-target-node" data-review-id="${c.review_id}" data-comment-id="${c.comment_id}" style="cursor: pointer; margin-bottom: 20px; padding: 25px; background: var(--rich-black-fogra-29); border: 1px solid #1a282d; border-top: 4px solid #3b82f6; border-radius: 8px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);">
          
          <div class="card-top-row" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; width: 100%;">
            <div class="review-header" style="display: flex; align-items: center; gap: 12px; border: none; padding: 0; margin: 0;">
              
              <div class="avatar" style="width: 40px; height: 40px; flex-shrink: 0; border-radius: 50%; overflow: hidden; display: flex; justify-content: center; align-items: center; background: #1a282d; border: 1px solid var(--citrine);">
                ${safeFeedAvatar 
                  ? `<img src="${safeFeedAvatar}" style="width: 100%; height: 100%; object-fit: cover;" />` 
                  : `<ion-icon name="person-circle-outline" style="font-size: 40px; color: var(--citrine);"></ion-icon>`
                }
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
        this.innerHTML = '<ion-icon name="sync-outline" style="animation: spin 0.8s linear infinite; font-size: 16px;"></ion-icon> <span>LOADING PLEASE WAIT...</span>';
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

      // ✅ Fix: Safely grab the rating, or default to 5 stars if no star selector exists
      const ratingElement = document.getElementById("community-rating-value");
      const selectedRating = ratingElement ? parseInt(ratingElement.value, 10) : 5; 

      try {
        if (submitBtn) {
          submitBtn.textContent = "Posting...";
          submitBtn.disabled = true;
        }

        // ✅ Fix: Properly uses targetReviewId and commentMessage
        const response = await fetch(`${API_BASE_URL}/api/reviews/details/${targetReviewId}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: userEmail,
              commentText: commentMessage,
              rating: selectedRating, 
              parentCommentId: null,
              type: 'community' 
            }),
          }
        );

        if (response.ok) {
          alert("Your thought has been posted straight to the Community Feed!");

          document
            .getElementById("upload-review-modal-overlay")
            .classList.remove("active");
          document.body.classList.remove("active");
          this.reset();

          // ✅ Trigger an immediate, forced re-render of the feed grid
          const activeStartupEmail = localStorage.getItem("userEmail") || "";
          if (typeof fetchAndRenderCommunityFeed === "function") {
            await fetchAndRenderCommunityFeed(activeStartupEmail);
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
    
    // 1. MASTER WRAPPER: Forces elements to stack vertically with a clean gap
    let ratingHTML = `<div style="display: flex; flex-direction: column; gap: 14px; align-items: flex-start; width: 100%; margin-top: 5px;">`;

    // 2. STATIC ROW: Global Average Display (FIXED LAYOUT)
    ratingHTML += `<div class="rating-display-row" style="display: flex; align-items: center; gap: 12px;">`;
    
    // --> A. The Stars Wrapper
    ratingHTML += `<div style="display: flex; align-items: center; gap: 2px;">`;
    for (let i = 1; i <= 5; i++) {
      if (averageScore >= i) {
        ratingHTML += '<ion-icon name="star" style="color: var(--citrine); font-size: 18px; margin: 0;"></ion-icon>';
      } else if (averageScore >= i - 0.5) {
        ratingHTML += '<ion-icon name="star-half" style="color: var(--citrine); font-size: 18px; margin: 0;"></ion-icon>';
      } else {
        ratingHTML += '<ion-icon name="star-outline" style="color: #667788; font-size: 18px; margin: 0;"></ion-icon>';
      }
    }
    ratingHTML += `</div>`;

    // --> B. The Neatly Stacked Text Column
    // --> B. The Neatly Stacked Text Column
    if (averageScore > 0) {
      ratingHTML += `
        <div style="display: flex; flex-direction: column; justify-content: center; line-height: 1.2;">
          <div style="display: flex; align-items: baseline; gap: 4px;">
            <span style="color: var(--white); font-weight: 700; font-size: 18px;">${averageScore}</span>
            <span style="color: #667788; font-size: 13px; font-weight: 500;">/ 5</span>
          </div>
          <span style="color: #667788; font-size: 11px; font-weight: 500;">(${ratingCount} user${ratingCount === 1 ? "" : "s"} rated)</span>
        </div>
      `;
    } else {
      ratingHTML += `<span style="color: #667788; font-weight: 500; font-size: 13px;">No ratings left yet</span>`;
    }
    
    ratingHTML += `</div>`; // Close Static Row

    // 3. INTERACTIVE ROW: User Rating Control Panel
    ratingHTML += `
      <div class="interactive-user-rating-line" style="display: flex; align-items: center; gap: 15px; background: #0b1416; padding: 8px 18px; border-radius: 8px; border: 1px solid #1a282d; width: max-content;">
        <span style="color: #78909c; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">${userRating ? "Your Rating:" : "Rate this movie:"}</span>
        <div class="animated-star-radio">
          ${[5, 4, 3, 2, 1]
            .map((num) => {
              const isSelect = userRating === num; 
              return `
                <input value="${num}" name="rating" type="radio" id="rating-${num}" class="star-radio-input" ${isSelect ? "checked" : ""} />
                <label title="${num} stars" for="rating-${num}">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" style="width: 22px; height: 22px;">
                    <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
                  </svg>
                </label>
              `;
            })
            .join("")}
        </div>
      </div>
    </div>`; // Close Master Wrapper

    ratingBox.innerHTML = ratingHTML;
    
    // Make sure we re-attach the event listeners after redrawing the HTML!
    if (typeof setupHeaderStarListeners === "function") {
      setupHeaderStarListeners();
    }
  }

  function setupHeaderStarListeners() {
    const container = document.querySelector(".animated-star-radio");
    if (!container) return;

    // Listen to the hidden radio buttons changing, not the SVG clicks!
    const inputs = Array.from(container.querySelectorAll(".star-radio-input"));
    const userEmail = localStorage.getItem("userEmail");

    inputs.forEach((input) => {
      input.addEventListener("change", async function () {
        if (!userEmail) {
          alert("Please sign in to rate this movie!");
          this.checked = false; // Revert the visual click if not signed in
          return;
        }
        
        const ratingVal = parseInt(this.value, 10);

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
            // Instantly sync the new data back to the UI
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
          console.error("Error submitting rating to database:", err);
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

    // ✅ 1. OPEN INSTANTLY
    const detailModal = document.getElementById("movie-detail-modal-overlay");
    if (detailModal) {
      detailModal.classList.add("active");
      document.body.classList.add("active");
    }

    // ✅ 2. INJECT NEW REDDIT SKELETON LOADER IMMEDIATELY
    const commentsList = document.getElementById("modal-comments-list");
    if (commentsList) commentsList.innerHTML = skeletonRedditCommentsHTML;

    try {
      // ✅ 3. FETCH AND DELAY AT THE SAME TIME (PROMISE.ALL)
      const fetchPromise = fetch(
        `${API_BASE_URL}/api/reviews/details/${reviewId}?email=${encodeURIComponent(userEmail)}`,
      );
      const delayPromise = new Promise(resolve => setTimeout(resolve, 1500));
      
      const [response] = await Promise.all([fetchPromise, delayPromise]);

      if (!response.ok) throw new Error("Packet unresolved.");
      const data = await response.json();

      const moviePosterImg = document.getElementById("detail-movie-poster");
      const posterLoader = document.getElementById("poster-image-loader");
      
      // 1. Show the loader and hide the image block initially
      if (posterLoader) posterLoader.style.display = "flex";
      moviePosterImg.style.opacity = "0";

      // 2. Wait for the Cloudinary image to fully download into browser memory
      moviePosterImg.onload = function() {
        if (posterLoader) posterLoader.style.display = "none"; // Kill the loader
        moviePosterImg.style.opacity = "1"; // Smoothly fade in the poster
      };

      // 3. Trigger the actual download
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
              saveBtn.textContent = "Uploading new image...";
              saveBtn.disabled = true;

              // 1. Upload the new image to Cloudinary if they changed it
              const finalEditPosterUrl = await uploadImageToCloud(temporaryBase64PosterString);

              saveBtn.textContent = "Saving Changes...";

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
                    imageData: finalEditPosterUrl || null, // <--- SAVING URL TO DB
                  }),
                },
              );

              const updateData = await updateResponse.json();

              if (updateResponse.ok) {
                const editOverlay = document.getElementById("success-overlay");
                const editTitle = document.getElementById("success-title");
                const editMsgText = document.getElementById("success-message");
                const editBtn = document.getElementById("success-btn");

                if (editOverlay && editBtn) {
                  if (editMsgText) {
                    editMsgText.textContent = updateData.message || "Movie review updated successfully!";
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

      // ✅ 4. RENDER COMMENTS NORMALLY (The 1.5s delay is already handled perfectly at the top)
      renderCommentsListCollection(data.comments, data.is_admin);
      resetStarSelectorInterfaceNode();

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

      // ✅ SMART AVATAR CATCHER: Pulls from DB, or falls back to local memory!
      const backendAvatar = c.user_avatar || c.avatar || c.avatar_data || c.profile_pic;
      if (backendAvatar) {
        let cache = JSON.parse(localStorage.getItem("globalAvatarCache") || "{}");
        cache[c.username] = backendAvatar;
        localStorage.setItem("globalAvatarCache", JSON.stringify(cache));
      }
      let cachedAvatar = JSON.parse(localStorage.getItem("globalAvatarCache") || "{}")[c.username];
      const safeAvatar = backendAvatar || cachedAvatar || (isCommentOwner ? localStorage.getItem("userAvatar") : null);

      return `
        <div class="reddit-comment-block-wrapper" style="margin-top: 12px; margin-left: ${isReply ? "36px" : "0px"};">
          <div class="reddit-comment-node">
            <div class="reddit-comment-sidebar">
              
              <div class="reddit-avatar-sm" style="width: 32px; height: 32px; border-radius: 50%; overflow: hidden; background: #1a282d; display: flex; justify-content: center; align-items: center; border: 1px solid var(--citrine); margin: 0 auto;">
                ${safeAvatar 
                  ? `<img src="${safeAvatar}" style="width: 100%; height: 100%; object-fit: cover;" />` 
                  : `<ion-icon name="person-circle-outline" style="font-size: 32px; color: var(--citrine);"></ion-icon>`
                }
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

            // ✅ INJECT REDDIT SKELETON WHILE WAITING FOR REFRESH
            const listContainer = document.getElementById("modal-comments-list");
            if (listContainer) listContainer.innerHTML = skeletonRedditCommentsHTML;

            // ✅ RE-FETCH WITH 1.5s DELAY TO SHOW ANIMATION
            const fetchPromise = fetch(
              `${API_BASE_URL}/api/reviews/details/${currentActiveReviewId}?email=${encodeURIComponent(userEmail)}`,
            );
            const delayPromise = new Promise(resolve => setTimeout(resolve, 1500));
            const [refreshRes] = await Promise.all([fetchPromise, delayPromise]);
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
    // 🚨 NEW: SUB-REPLY RESPOND (TAG USER) HANDLER
    // ============================================================
    const subReplyRespondBtn = e.target.closest(".sub-reply-respond-btn");
    if (subReplyRespondBtn) {
      e.preventDefault();
      const targetUser = subReplyRespondBtn.getAttribute("data-username");
      const replyInput = document.getElementById("comm-modal-reply-input");
      
      if (replyInput) {
        // No trailing space in the variable so the highlighter catches the exact name cleanly
        const tag = `@${targetUser}`; 
        
        // Add the tag to the text box
        if (!replyInput.value.includes(tag)) {
           replyInput.value = tag + " " + replyInput.value;
        }
        
        // ✅ NEW: Save the exact tag in the browser's memory so the Send Button can highlight it!
        replyInput.setAttribute("data-active-tag", tag);
        
        // Auto-focus and push the cursor to the end
        replyInput.focus();
        const textLength = replyInput.value.length;
        replyInput.setSelectionRange(textLength, textLength);
      }
      return;
    }

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
        .getElementById("review-movie-text").value.trim();

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
        submitBtn.textContent = "Uploading Image...";
        submitBtn.disabled = true;

        if (progressWrapper) progressWrapper.style.display = "block";
        if (progressBar) progressBar.style.width = "0%";
        if (progressPercent) progressPercent.textContent = "0%";
        if (statusText) statusText.textContent = "Uploading Poster to Cloudinary...";

        // 1. Send poster to Cloudinary FIRST
        const finalPosterUrl = await uploadImageToCloud(base64ImageString);

        if (statusText) statusText.textContent = "Saving Review to Database...";

        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${API_BASE_URL}/api/reviews/upload`);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            if (progressBar) progressBar.style.width = `${percentComplete}%`;
            if (progressPercent) progressPercent.textContent = `${percentComplete}%`;
          }
        });

        xhr.onload = function () {
          submitBtn.textContent = "Publish Review Package";
          submitBtn.disabled = false;

          try {
            const data = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) {
              const successOverlay = document.getElementById("success-alert-overlay");
              const successMsg = document.getElementById("success-alert-message");
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
            publishDate: formattedPublishDateString, 
            reviewText: reviewText,
            imageData: finalPosterUrl, // <--- SENDING THE TINY URL TO THE DB
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
  const mobileUploadBtn = document.getElementById("mobile-upload-btn");

  const handleUploadNavigation = (e) => {
    e.preventDefault();
    // Guard entry: force sign-in prompt modal if no active browser token is detected
    if (!localStorage.getItem("userToken")) {
      alert("Please sign in to upload a movie review!");
      document.getElementById("signin-modal-overlay")?.classList.add("active");
    } else {
      // Redirect seamlessly out to the dedicated review workspace page
      window.location.href = "upload-review.html";
    }
  };

  // Attach the logic to BOTH the desktop header button and the new mobile sidebar button!
  if (uploadReviewBtn) {
    uploadReviewBtn.addEventListener("click", handleUploadNavigation);
  }
  if (mobileUploadBtn) {
    mobileUploadBtn.addEventListener("click", handleUploadNavigation);
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
          document.getElementById("comm-modal-username").textContent = foundComment.username;
          document.getElementById("comm-modal-text").textContent = foundComment.comment_text;

          // ✅ SMART AVATAR CATCHER: Looks for multiple possible backend names
          const parentAvatarContainer = document.querySelector("#community-view-modal-overlay .avatar");
          if (parentAvatarContainer) {
            const currentUsername = localStorage.getItem("username");
            const isOwner = foundComment.username === currentUsername;
            
            // Checks every possible database column name!
            const backendAvatar = foundComment.user_avatar || foundComment.avatar || foundComment.avatar_data || foundComment.profile_pic;
            const safeAvatar = backendAvatar || (isOwner ? localStorage.getItem("userAvatar") : null);

            if (safeAvatar) {
              parentAvatarContainer.innerHTML = `<img src="${safeAvatar}" style="width: 100%; height: 100%; object-fit: cover;" />`;
            } else {
              parentAvatarContainer.innerHTML = `<ion-icon name="person-circle-outline" style="font-size: 50px; color: var(--citrine);"></ion-icon>`;
            }
          }

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

            pageTransitionOverlay.style.display = "flex";
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

              
              pageTransitionOverlay.style.display = "none";
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

                  // ✅ 2. READ FROM MEMORY BANK FOR SUB-REPLIES
                  const backendAvatar = reply.user_avatar || reply.avatar || reply.avatar_data || reply.profile_pic;
                  if (backendAvatar) {
                    let cache = JSON.parse(localStorage.getItem("globalAvatarCache") || "{}");
                    cache[reply.username] = backendAvatar;
                    localStorage.setItem("globalAvatarCache", JSON.stringify(cache));
                  }
                  
                  let cachedAvatar = JSON.parse(localStorage.getItem("globalAvatarCache") || "{}")[reply.username];
                  const safeAvatar = backendAvatar || cachedAvatar || (isOwner ? localStorage.getItem("userAvatar") : null);

                  return `
            <div class="sub-reply-card-node" style="background: rgba(255,255,255,0.01); border-left: 3px solid var(--citrine); padding: 10px 14px; border-radius: 0 6px 6px 0; border: 1px solid rgba(255,255,255,0.02); text-align: left; margin-bottom: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div style="width: 24px; height: 24px; border-radius: 50%; overflow: hidden; background: #1a282d; display: flex; justify-content: center; align-items: center; border: 1px solid var(--citrine); flex-shrink: 0;">
                    ${safeAvatar 
                      ? `<img src="${safeAvatar}" style="width: 100%; height: 100%; object-fit: cover;" />` 
                      : `<ion-icon name="person-circle-outline" style="font-size: 24px; color: var(--citrine);"></ion-icon>`
                    }
                  </div>
                  <span style="font-size: 12px; font-weight: 700; color: #fff;">${reply.username}</span>
                </div>
                
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 10px; color: #567;">${new Date(reply.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  
                  <button type="button" class="sub-reply-respond-btn" data-username="${reply.username}" style="background: transparent; border: none; color: #78909c; cursor: pointer; display: flex; align-items: center; padding: 2px; transition: 0.2s;" title="Reply to ${reply.username}">
                    <ion-icon name="arrow-undo-outline" style="font-size: 14px; pointer-events: none;"></ion-icon>
                  </button>
                  
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
          pageTransitionOverlay.style.display = "none";
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
 * #COMMUNITY REPLY FORMATTING TOOLS & EMOJI PICKER
\*-----------------------------------*/
document.addEventListener("click", (e) => {
  // 1. Handle Toggling the Emoji Popup Menu
  const emojiToggle = e.target.closest(".comm-format-emoji-toggle");
  if (emojiToggle) {
    e.preventDefault();
    const picker = emojiToggle.nextElementSibling;
    
    document.querySelectorAll(".emoji-picker-container.active").forEach(p => {
      if (p !== picker) p.classList.remove("active");
    });
    
    picker.classList.toggle("active");
    return; 
  }

  // Click outside to close emoji picker
  if (!e.target.closest(".emoji-picker-container")) {
    document.querySelectorAll(".emoji-picker-container.active").forEach(p => p.classList.remove("active"));
  }

  // 2. Handle Core Formatting Tool Clicks
  const formatBtn = e.target.closest(".comm-format-text-btn, .comm-format-image-btn, .emoji-btn");
  if (!formatBtn) return;

  e.preventDefault();
  
  const wrapper = formatBtn.closest(".uiverse-text-box");
  if (!wrapper) return;
  
  const textarea = wrapper.querySelector("textarea");
  if (!textarea) return;

  // Native insertion helper
  function insertAtCursor(startTag, endTag, defaultText = "") {
    const startPos = textarea.selectionStart || 0;
    const endPos = textarea.selectionEnd || 0;
    const selectedText = textarea.value.substring(startPos, endPos);
    const textToInsert = selectedText || defaultText;

    textarea.value =
      textarea.value.substring(0, startPos) +
      startTag +
      textToInsert +
      endTag +
      textarea.value.substring(endPos, textarea.value.length);

    textarea.focus();
    textarea.setSelectionRange(
      startPos + startTag.length,
      startPos + startTag.length + textToInsert.length
    );
  }

  // ==========================================
  // A. CAPITALIZE / LOWERCASE TOGGLE BUTTON
  // ==========================================
  if (formatBtn.classList.contains("comm-format-text-btn")) {
    if (textarea.value && textarea.value === textarea.value.toUpperCase()) {
      textarea.value = textarea.value.toLowerCase();
    } else {
      textarea.value = textarea.value.toUpperCase();
    }
    textarea.focus();
  }
  
  // ==========================================
  // B. IMAGE / STICKER UPLOAD PREVIEW WIDGET
  // ==========================================
  else if (formatBtn.classList.contains("comm-format-image-btn")) {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    
    fileInput.onchange = function () {
      const file = this.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
           alert("Image is too large! Please choose a picture under 5MB.");
           return;
        }

        // 1. Create the Visual Attachment Preview Box dynamically
        let previewWrapper = wrapper.querySelector(".attachment-preview-wrapper");
        if (!previewWrapper) {
          previewWrapper = document.createElement("div");
          previewWrapper.className = "attachment-preview-wrapper";
          previewWrapper.style.cssText = "display: block; position: relative; margin-top: 10px; margin-bottom: 10px; width: fit-content;";
          previewWrapper.innerHTML = `
             <div class="attachment-loader" style="display: flex; align-items: center; gap: 8px; background: rgba(229, 184, 0, 0.1); padding: 8px 14px; border-radius: 8px; border: 1px solid var(--citrine);">
                <ion-icon name="sync-outline" style="animation: spin 1s linear infinite; font-size: 18px; color: var(--citrine);"></ion-icon>
                <span style="font-size: 12px; color: var(--citrine); font-weight: 600;">Uploading securely to Cloudinary...</span>
             </div>
             <div class="attachment-image-container" style="display: none; position: relative;">
                <img class="attachment-preview-img" src="" style="height: 70px; border-radius: 6px; border: 1px solid #243337; object-fit: cover; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                <button class="attachment-remove-btn" title="Remove Attachment" style="position: absolute; top: -8px; right: -8px; background: #ff4560; color: white; border-radius: 50%; width: 22px; height: 22px; border: none; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.5);"><ion-icon name="close-outline"></ion-icon></button>
             </div>
          `;
          
          // Insert it neatly between the textarea and the formatting tools
          const formattingBar = wrapper.querySelector(".formatting") || wrapper.querySelector(".formatting-left").parentElement;
          wrapper.insertBefore(previewWrapper, formattingBar);

          // Allow the user to cancel/remove the image before sending
          previewWrapper.querySelector(".attachment-remove-btn").addEventListener("click", (e) => {
             e.preventDefault();
             previewWrapper.remove();
          });
        }

        const loader = previewWrapper.querySelector(".attachment-loader");
        const imgContainer = previewWrapper.querySelector(".attachment-image-container");
        const previewImg = previewWrapper.querySelector(".attachment-preview-img");

        // Switch UI to loading state
        loader.style.display = "flex";
        imgContainer.style.display = "none";
        previewImg.src = "";

        const reader = new FileReader();
        reader.onload = async function (evt) {
          const base64Data = evt.target.result;
          try {
            // Upload the image to Cloudinary
            const finalImgUrl = await uploadImageToCloud(base64Data);
            
            // Swap the loading bar out for the actual picture!
            loader.style.display = "none";
            previewImg.src = finalImgUrl;
            imgContainer.style.display = "block";
          } catch (err) {
            console.error("Image upload failed:", err);
            alert("Failed to upload image. Please check your internet connection.");
            previewWrapper.remove();
          }
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click(); 
  }
  
  // ==========================================
  // C. EMOJI SELECTION
  // ==========================================
  else if (formatBtn.classList.contains("emoji-btn")) {
    const emoji = formatBtn.textContent.trim();
    insertAtCursor(emoji, "", "");
    formatBtn.closest(".emoji-picker-container").classList.remove("active");
  }
});

// =========================================================================
// 4. THE INVISIBLE ATTACHMENT INJECTOR (THE MAGIC TRICK!)
// =========================================================================
document.addEventListener("click", (e) => {
  const sendBtn = e.target.closest(".uiverse-send-btn, .comment-reply-submit-action-btn, .sub-edit-save-btn, .comment-edit-save-action-btn");
  if (sendBtn) {
    const wrapper = sendBtn.closest(".uiverse-text-box, .reddit-inline-reply-box, .reddit-inline-edit-box, .sub-reply-inline-edit-box");
    if (wrapper) {
      const textarea = wrapper.querySelector("textarea");
      
      if (textarea) {
        // --- A. HANDLE IMAGE ATTACHMENTS ---
        const previewWrapper = wrapper.querySelector(".attachment-preview-wrapper");
        const previewImg = wrapper.querySelector(".attachment-preview-img");
        let imgHtml = "";
        
        if (previewImg && previewImg.src) {
          imgHtml = `\n<br><img src="${previewImg.src}" style="max-width: 250px; border-radius: 8px; margin-top: 10px;" alt="User Upload">\n`;
          textarea.value = textarea.value + imgHtml;
        }

        // --- B. HANDLE @USERNAME HIGHLIGHTING ---
        const activeTag = textarea.getAttribute("data-active-tag");
        let highlightedTag = "";
        
        // If they replied to someone, wrap the tag in a beautiful yellow pill badge!
        if (activeTag && textarea.value.includes(activeTag)) {
           // ✅ FIXED: Added 'display: inline-block; width: max-content;' so it tightly hugs the text and stops stretching!
           highlightedTag = `<span style="display: inline-block; width: max-content; color: var(--citrine); font-weight: 700; background: rgba(229, 184, 0, 0.15); padding: 2px 6px; border-radius: 4px; line-height: 1;">${activeTag}</span>`;
           textarea.value = textarea.value.replace(activeTag, highlightedTag);
        }

        // --- C. THE CLEANUP ILLUSION ---
        if (imgHtml || highlightedTag) {
          
          // Remove the raw HTML from the user's screen 50 milliseconds later so they never see the code!
          setTimeout(() => {
            if (imgHtml) textarea.value = textarea.value.replace(imgHtml, "");
            if (highlightedTag) textarea.value = textarea.value.replace(highlightedTag, activeTag);
          }, 50);

          // Watch for a successful submission (when the backend clears the box) and purge the UI
          const checkClear = setInterval(() => {
            if (textarea.value === "" || textarea.value === activeTag) {
              if (previewWrapper) previewWrapper.remove();
              textarea.removeAttribute("data-active-tag"); // Wipe the memory
              clearInterval(checkClear);
            }
          }, 300);
          
          setTimeout(() => clearInterval(checkClear), 4000); 
        }
      }
    }
  }
}, true); // 'true' ensures this intercepts the click before your submit functions run!



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

/*-----------------------------------*\
 * #DYNAMIC RUNNING TEXT (MARQUEE) FOR LONG TITLES
\*-----------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  const titleObserver = new MutationObserver(() => {
    
    // Find all movie titles on the screen
    document.querySelectorAll(".poster-footer .reviewer-name").forEach(title => {
      
      // Check if we haven't processed this one yet, and ensure it's a standard span
      if (!title.hasAttribute("data-checked") && title.tagName.toLowerCase() === "span") {
        title.setAttribute("data-checked", "true");
        
        // 1. If the movie title is longer than 20 characters, make it run!
        if (title.textContent.length > 20) {
          const marquee = document.createElement("marquee");
          marquee.setAttribute("scrollamount", "4"); // Smooth scrolling speed
          marquee.className = title.className; 
          marquee.style.cssText = title.style.cssText; 
          
          // 2. 🚨 THE FIX: Override the strict CSS ellipsis so the text can actually move!
          marquee.style.textOverflow = "clip";
          marquee.style.overflow = "visible";
          
          marquee.textContent = title.textContent;
          
          // 3. Swap the static text with the running text!
          title.parentNode.replaceChild(marquee, title);
        }
      }
    });
  });

  // Watch the page continuously for new database loads
  titleObserver.observe(document.body, { childList: true, subtree: true });
});

  // Start observing the page for database injections
  observer.observe(document.body, { childList: true, subtree: true });
});

