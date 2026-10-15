/* ========================================
   MUSICFEST 25 - MAIN JAVASCRIPT
   ========================================
   This file handles all interactive functionality for the MusicFest website
   including: slider, animations, dropdown menu, ticket system, form validation,
   payment processing, lineup gallery, and music player.
   ======================================== */

/* ===== PAGE INITIALIZATION ===== */
// Force scroll to top on page load to ensure consistent starting position
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.addEventListener('beforeunload', function() {
    window.scrollTo(0, 0);
});
window.scrollTo(0, 0);

/* ===== IMAGE SLIDER ===== */
// Handles the image carousel/slider functionality
const slides = document.querySelectorAll(".slide");
let index = 0;

// Only run slider code if slides exist (for the page that has slides)
if (slides.length > 0) {
    // show the first slide
    slides[index].classList.add("active");

    document.querySelector(".slider").addEventListener("click", () => {
        slides[index].classList.remove("active");   // hide current
        index = (index + 1) % slides.length;        // move to next index
        slides[index].classList.add("active");      // show next
    });
}

/* ===== SCROLL ANIMATIONS ===== */
// Detects when elements enter viewport and triggers fade-in animations
const fadeElements = document.querySelectorAll('.fade-in');

function checkVisibility() {
    fadeElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const isVisible = rect.top < windowHeight * 1.1;

        if (isVisible) {
            el.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', checkVisibility);
window.addEventListener('load', checkVisibility);

/* ===== DROPDOWN MENU ===== */
// Toggle the navigation dropdown menu open/closed
function toggle(event) {
    const menu = document.getElementById('menu');
    if (menu) {
        menu.classList.toggle('open');
        if (event) {
            event.stopPropagation();
        }
    }
}

function closeMenu() {
    const menu = document.getElementById('menu');
    if (menu) {
        menu.classList.remove('open');
    }
}

/* ===== INFO REVEAL ANIMATION ===== */
// Controls the animated information reveal sequence with black screen transition
let animationRunning = false;

function startAnimation() {
    if (animationRunning) return;
    animationRunning = true;

    const mainPage = document.getElementById('mainPage');
    const blackScreen = document.getElementById('blackScreen');
    const lines = document.querySelectorAll('.info-line');
    const pictures = document.querySelectorAll('.picture-box');

    if (mainPage) mainPage.style.display = 'none';
    if (blackScreen) blackScreen.classList.add('active');

    for (let i = 0; i < lines.length; i++) {
        lines[i].classList.remove('show');
    }
    for (let j = 0; j < pictures.length; j++) {
        pictures[j].classList.remove('show');
    }

    setTimeout(function() { if (lines[0]) lines[0].classList.add('show'); }, 500);
    setTimeout(function() { if (lines[1]) lines[1].classList.add('show'); }, 2800);
    setTimeout(function() {
        if (lines[2]) lines[2].classList.add('show');
        setTimeout(function() { if (pictures[0]) pictures[0].classList.add('show'); }, 300);
        setTimeout(function() { if (pictures[1]) pictures[1].classList.add('show'); }, 450);
        setTimeout(function() { if (pictures[2]) pictures[2].classList.add('show'); }, 600);
        setTimeout(function() { if (pictures[3]) pictures[3].classList.add('show'); }, 750);
        setTimeout(function() { if (pictures[4]) pictures[4].classList.add('show'); }, 900);
        setTimeout(function() { if (pictures[5]) pictures[5].classList.add('show'); }, 1050);
    }, 5100);
    setTimeout(function() { if (lines[3]) lines[3].classList.add('show'); }, 7400);
    setTimeout(function() { if (lines[4]) lines[4].classList.add('show'); }, 9700);

    setTimeout(function() {
        showNormalLayout();
    }, 12000);
}

function showNormalLayout() {
    const blackScreen = document.getElementById('blackScreen');
    const normalLayout = document.getElementById('normalLayout');
    const normalLines = document.querySelectorAll('.normal-line');
    const replayBtn = document.getElementById('replayBtn');

    if (blackScreen) blackScreen.classList.remove('active');
    if (normalLayout) normalLayout.classList.add('active');

    for (let i = 0; i < normalLines.length; i++) {
        normalLines[i].classList.remove('show');
    }

    setTimeout(function() { if (normalLines[0]) normalLines[0].classList.add('show'); }, 200);
    setTimeout(function() { if (normalLines[1]) normalLines[1].classList.add('show'); }, 800);
    setTimeout(function() { if (normalLines[2]) normalLines[2].classList.add('show'); }, 1400);
    setTimeout(function() { if (normalLines[3]) normalLines[3].classList.add('show'); }, 2000);
    setTimeout(function() { if (normalLines[4]) normalLines[4].classList.add('show'); }, 2600);

    setTimeout(function() {
        if (replayBtn) replayBtn.classList.add('show');
        animationRunning = false;
    }, 3200);
}

function replay() {
    const normalLayout = document.getElementById('normalLayout');
    const replayBtn = document.getElementById('replayBtn');

    if (normalLayout) normalLayout.classList.remove('active');
    if (replayBtn) replayBtn.classList.remove('show');

    setTimeout(function() {
        startAnimation();
    }, 300);
}

/* ===== TICKET SELECTION SYSTEM ===== */
// Manages ticket quantities, pricing, and cart functionality

// Store ticket quantities (SINGLE SOURCE OF TRUTH)
var quantities = {
    "ga-ticket": 0,
    "premium-ticket": 0,
    "vip-ticket": 0
};

// Ticket prices
const prices = {
    "ga-ticket": 125,
    "premium-ticket": 150,
    "vip-ticket": 220
};

// Calculate total price
function calculateTotal() {
    let total = 0;
    total += quantities["ga-ticket"] * prices["ga-ticket"];
    total += quantities["premium-ticket"] * prices["premium-ticket"];
    total += quantities["vip-ticket"] * prices["vip-ticket"];
    return total;
}

// Update total price display
function updateTotalPrice() {
    const total = calculateTotal();
    const priceElement = document.getElementById('total-price');
    if (priceElement) {
        priceElement.textContent = '£' + total;
    }
}

// sync dropdown
function updateFormQuantity(type) {
    const selectId = {
        "ga-ticket": "qty1",
        "premium-ticket": "qty2",
        "vip-ticket": "qty3"
    }[type];

    const select = document.getElementById(selectId);
    if (select) {
        select.value = quantities[type];
    }
}

// increments when ticket card is clicked
window.incrementTicket = function(type) {
    console.log("CLICKED:", type);

    if (quantities[type] < 10) {
        quantities[type]++;
        updateFormQuantity(type);
        updateTotalPrice();
    }

    // scroll to ticket section
    const section = document.getElementById("ticket-select");
    if (section) {
        section.scrollIntoView({behavior: "smooth", block: "start"});
    }
}

// dropdown manually updated by user
window.manualUpdate = function(type, value) {
    quantities[type] = parseInt(value);
    updateTotalPrice();
}

/* ===== FORM VALIDATION & INPUT FORMATTING ===== */
// Handles form validation, error display, and input formatting (card numbers, dates, etc.)
// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    // Set initial price to £0
    updateTotalPrice();

    // Form validation setup
    const fields = [
        "FirstName",
        "LastName",
        "Email",
        "PhoneNumber"
    ];

    fields.forEach(id => {
        const input = document.getElementById(id);
        const error = document.getElementById(id + "-error");

        if (input && error) {
            // Hide error by default
            error.classList.remove('show');

            // When user types → remove error
            input.addEventListener("input", () => {
                input.style.borderBottomColor = "white";
                input.style.borderLeftColor = "white";
                error.classList.remove('show');
            });
        }
    });

    // Card number formatting
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        const cardError = document.getElementById('card-number-error');

        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;

            // Remove error when typing
            if (cardError) {
                cardError.classList.remove('show');
                e.target.style.borderBottomColor = "white";
                e.target.style.borderLeftColor = "white";
            }
        });
    }

    // Expiry date formatting
    const expDateInput = document.getElementById('exp-date');
    if (expDateInput) {
        const expError = document.getElementById('exp-date-error');

        expDateInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;

            // Remove error when typing
            if (expError) {
                expError.classList.remove('show');
                e.target.style.borderBottomColor = "white";
                e.target.style.borderLeftColor = "white";
            }
        });
    }

    // CVV formatting
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        const cvvError = document.getElementById('cvv-error');

        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');

            // Remove error when typing
            if (cvvError) {
                cvvError.classList.remove('show');
                e.target.style.borderBottomColor = "white";
                e.target.style.borderLeftColor = "white";
            }
        });
    }

    // Name on card error removal
    const nameCardInput = document.getElementById('name-card');
    if (nameCardInput) {
        const nameError = document.getElementById('name-card-error');

        nameCardInput.addEventListener('input', function() {
            if (nameError) {
                nameError.classList.remove('show');
                this.style.borderBottomColor = "white";
                this.style.borderLeftColor = "white";
            }
        });
    }

    // Continue to payment button
    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            // Check if at least one ticket is selected
            if (!hasTickets()) {
                alert("Please select at least one ticket before continuing.");
                return;
            }

            if (validateMainForm()) {
                const mainForm = document.getElementById('main-form');
                const ticketCards = document.getElementById('ticket-cards');
                const payment = document.getElementById('payment');

                if (mainForm) mainForm.classList.add('blurred');
                if (ticketCards) ticketCards.classList.add('blurred');
                if (payment) payment.classList.add('active');
            }
        });
    }

    // Cancel payment button
    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            const mainForm = document.getElementById('main-form');
            const ticketCards = document.getElementById('ticket-cards');
            const payment = document.getElementById('payment');

            if (mainForm) mainForm.classList.remove('blurred');
            if (ticketCards) ticketCards.classList.remove('blurred');
            if (payment) payment.classList.remove('active');
        });
    }

    // Purchase button
    const purchaseBtn = document.getElementById('purchase-btn');
    if (purchaseBtn) {
        purchaseBtn.addEventListener('click', function() {
            if (validatePaymentForm()) {
                const paymentModal = document.querySelector('.payment > div');
                const paymentSection = document.getElementById('payment-section');
                const successAnimation = document.getElementById('success-animation');

                if (paymentModal) {
                    paymentModal.style.transform = 'scale(0)';
                }

                setTimeout(function() {
                    if (paymentSection) paymentSection.style.display = 'none';
                    if (successAnimation) successAnimation.style.display = 'flex';

                    if (paymentModal) paymentModal.style.transform = 'scale(1)';

                    setTimeout(function() {
                        const logoItem = document.getElementById('logo-item');
                        const successText = document.getElementById('success-text');

                        if (logoItem) logoItem.classList.add('slide-left');
                        if (successText) successText.classList.add('show');
                    }, 500);

                    setTimeout(function() {
                        window.location.href = 'main.html';
                    }, 3500);
                }, 400);
            }
        });
    }

    // Terms checkbox listener to remove error when checked
    const termsCheckbox = document.getElementById('terms');
    const termsError = document.getElementById('terms-error');

    if (termsCheckbox && termsError) {
        // Hide error by default
        termsError.classList.remove('show');

        // Listen for checkbox changes
        termsCheckbox.addEventListener('change', function() {
            if (this.checked) {
                termsError.classList.remove('show');
            }
        });
    }

    // ===== NEW LINEUP GALLERY FUNCTIONALITY ADDED BELOW =====

    // Initialize lineup gallery if it exists on the page
    const gallerySlides = document.querySelectorAll('.gallery-slide');
    if (gallerySlides.length > 0) {
        initLineupGallery();
    }
});

// Validate main form
function validateMainForm() {
    let valid = true;

    const fields = [
        "FirstName",
        "LastName",
        "Email",
        "PhoneNumber"
    ];

    fields.forEach(id => {
        const input = document.getElementById(id);
        const error = document.getElementById(id + "-error");

        if (input && error) {
            if (input.value.trim() === "") {
                valid = false;
                input.style.borderBottomColor = "red";
                input.style.borderLeftColor = "red";
                error.classList.add('show');
            } else {
                input.style.borderBottomColor = "white";
                input.style.borderLeftColor = "white";
                error.classList.remove('show');
            }
        }
    });

    return valid;
}

// Validate payment form
function validatePaymentForm() {
    let valid = true;

    const fields = [
        "card-number",
        "cvv",
        "exp-date",
        "name-card"
    ];

    fields.forEach(id => {
        const input = document.getElementById(id);
        const error = document.getElementById(id + "-error");

        if (input && error) {
            if (input.value.trim() === "") {
                valid = false;
                input.style.borderBottomColor = "red";
                input.style.borderLeftColor = "red";
                error.classList.add('show');
            } else {
                input.style.borderBottomColor = "white";
                input.style.borderLeftColor = "white";
                error.classList.remove('show');
            }
        }
    });

    // Check if terms checkbox is checked
    const termsCheckbox = document.getElementById('terms');
    const termsError = document.getElementById('terms-error');

    if (termsCheckbox) {
        if (!termsCheckbox.checked) {
            valid = false;
            if (termsError) {
                termsError.classList.add('show');
            }
        } else {
            if (termsError) {
                termsError.classList.remove('show');
            }
        }
    }

    return valid;
}

// Check if at least one ticket is selected
function hasTickets() {
    const total = quantities["ga-ticket"] + quantities["premium-ticket"] + quantities["vip-ticket"];
    return total > 0;
}

// ===== NEW LINEUP GALLERY FUNCTIONS =====

let currentSlide = 0;
let lineupSlides = [];
let lineupDots = [];
let galleryInitialized = false;

// Music player variables
let currentAudio = null;
let fadeDuration = 1000; // 1 second fade in/out

// Function to fade out current audio
function fadeOutAudio(audio, callback) {
    if (!audio) {
        if (callback) callback();
        return;
    }

    const startVolume = audio.volume;
    const fadeStep = startVolume / (fadeDuration / 50);

    const fadeInterval = setInterval(() => {
        if (audio.volume > fadeStep) {
            audio.volume -= fadeStep;
        } else {
            audio.volume = 0;
            audio.pause();
            clearInterval(fadeInterval);
            if (callback) callback();
        }
    }, 50);
}

// Function to fade in audio
function fadeInAudio(audio) {
    if (!audio) return;

    audio.volume = 0;
    audio.play().catch(err => console.log('Audio play failed:', err));

    const targetVolume = 0.7; // Max volume 70%
    const fadeStep = targetVolume / (fadeDuration / 50);

    const fadeInterval = setInterval(() => {
        if (audio.volume < targetVolume - fadeStep) {
            audio.volume += fadeStep;
        } else {
            audio.volume = targetVolume;
            clearInterval(fadeInterval);
        }
    }, 50);
}

// Function to play artist music
function playArtistMusic(artistSlide) {
    // Get song file and name from data attributes
    const songFile = artistSlide.dataset.song;
    const songName = artistSlide.dataset.songName;

    if (!songFile) return;

    // Fade out current audio first
    if (currentAudio) {
        fadeOutAudio(currentAudio, () => {
            // Start new audio after fade out
            startNewAudio(songFile, songName);
        });
    } else {
        // No current audio, start immediately
        startNewAudio(songFile, songName);
    }
}

function startNewAudio(songFile, songName) {
    // Make sure any previous audio is completely stopped
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }

    // Create new audio element
    currentAudio = new Audio(songFile);
    currentAudio.loop = true;

    // Update now playing display
    updateNowPlaying(songName);

    // Fade in the new audio
    fadeInAudio(currentAudio);
}

// Function to update "Now Playing" display
function updateNowPlaying(songName) {
    let nowPlayingDiv = document.getElementById('now-playing');

    if (!nowPlayingDiv) {
        // Create the now playing div if it doesn't exist
        nowPlayingDiv = document.createElement('div');
        nowPlayingDiv.id = 'now-playing';
        document.body.appendChild(nowPlayingDiv);
    }

    if (songName) {
        nowPlayingDiv.textContent = `NOW PLAYING: ${songName}`;
        nowPlayingDiv.style.opacity = '1';
    } else {
        nowPlayingDiv.style.opacity = '0';
    }
}

// Function to stop all music
function stopMusic() {
    if (currentAudio) {
        fadeOutAudio(currentAudio, () => {
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                currentAudio = null;
            }
            updateNowPlaying(null);
        });
    } else {
        // Make sure NOW PLAYING is hidden even if no audio
        updateNowPlaying(null);
    }
}

// Make changeSlide globally accessible
window.changeSlide = function(direction) {
    currentSlide = currentSlide + direction;

    // Wrap around
    if (currentSlide >= lineupSlides.length) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = lineupSlides.length - 1;
    }

    showSlide();
};

function showSlide() {
    // Remove active from everything
    lineupSlides.forEach((slide) => {
        slide.classList.remove('active');
    });

    lineupDots.forEach((dot) => {
        dot.classList.remove('active');
    });

    // Add active to current slide and dot
    if (lineupSlides[currentSlide]) {
        lineupSlides[currentSlide].classList.add('active');
    }

    if (lineupDots[currentSlide]) {
        lineupDots[currentSlide].classList.add('active');
    }

    // Update background gradient based on current artist
    updateBackgroundGradient();

    updatePreviews();

    // Handle music playback
    const currentSlideElement = lineupSlides[currentSlide];
    if (currentSlideElement && currentSlideElement.classList.contains('artist-slide')) {
        // Play artist's song
        playArtistMusic(currentSlideElement);
    } else {
        // Stop music on intro slide
        stopMusic();
    }
}

function updateBackgroundGradient() {
    const currentArtistSlide = lineupSlides[currentSlide];

    // Define vibrant color schemes for each artist (based on their images)
    const artistColors = {
        'SONDER': ['#3d4f5c', '#5a4f4d', '#6b5548', '#2d3d48'],           // Darker pastel blue/peach from group shot
        'JORJA SMITH': ['#1a3d5f', '#2d4d6b', '#3d5f7a', '#2a4a62'],     // Darker deep blues
        'SMINO': ['#8d5458', '#a86d70', '#9a7d78', '#7a5558'],           // Darker pink/coral bandana colors
        'CHASE SHAKUR': ['#0d1f17', '#1a2f24', '#4a3d2d', '#6b5438'],   // Darker forest green/brown/gold
        'SAMPHA': ['#0d0f1a', '#1a1d2e', '#7a9d00', '#5d7a2d'],          // Darker navy/muted neon green
        'GALDIVES': ['#8d3d2d', '#a65d48', '#4d5a5f', '#2d3d48']         // Darker orange/gray from duo shot
    };

    const galleryContainer = document.querySelector('.gallery-container');

    // Check if we're on the intro slide
    if (currentArtistSlide && currentArtistSlide.classList.contains('intro-slide')) {
        // Black background for intro
        if (galleryContainer) {
            galleryContainer.style.background = '#000000';
            galleryContainer.style.backgroundSize = 'auto';
            galleryContainer.style.animation = 'none';
        }
    } else if (currentArtistSlide && currentArtistSlide.classList.contains('artist-slide')) {
        // Vibrant animated gradient for artists
        const artistName = currentArtistSlide.dataset.artist;
        let colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe']; // Default

        if (artistColors[artistName]) {
            colors = artistColors[artistName];
        }

        if (galleryContainer) {
            galleryContainer.style.background = `linear-gradient(-45deg, ${colors[0]}, ${colors[1]}, ${colors[2]}, ${colors[3]})`;
            galleryContainer.style.backgroundSize = '400% 400%';
            galleryContainer.style.animation = 'gradientShift 15s ease infinite';
        }
    }
}

function updatePreviews() {
    // Calculate indices
    let prevIndex = currentSlide - 1;
    let nextIndex = currentSlide + 1;

    // Wrap around
    if (prevIndex < 0) prevIndex = lineupSlides.length - 1;
    if (nextIndex >= lineupSlides.length) nextIndex = 0;

    const prevSlide = lineupSlides[prevIndex];
    const nextSlide = lineupSlides[nextIndex];

    // Only update if we're on an artist slide
    const currentArtistSlide = lineupSlides[currentSlide];

    if (currentArtistSlide && currentArtistSlide.classList.contains('artist-slide')) {
        // Find which artist index this is (0-5)
        const artistSlides = Array.from(document.querySelectorAll('.artist-slide'));
        const artistIndex = artistSlides.indexOf(currentArtistSlide);

        if (artistIndex !== -1) {
            // Update PREV preview
            const prevContainer = document.getElementById(`prev-${artistIndex}`);
            if (prevContainer) {
                if (prevSlide.classList.contains('intro-slide')) {
                    prevContainer.innerHTML = `<div class="nav-preview-name">← INTRO</div>`;
                } else {
                    const prevArtist = prevSlide.dataset.artist || 'Unknown';
                    const prevGenre = prevSlide.dataset.genre || '';
                    // Get the image from the prev slide
                    const prevImg = prevSlide.querySelector('.artist-image-container img');
                    const prevImgSrc = prevImg ? prevImg.src : '';

                    prevContainer.innerHTML = `
                        <div class="nav-preview-image">
                            ${prevImgSrc ? `<img src="${prevImgSrc}" alt="${prevArtist}">` : '🎤'}
                        </div>
                        <div class="nav-preview-name">← ${prevArtist}</div>
                        <div class="nav-preview-genre">${prevGenre}</div>
                    `;
                }
            }

            // Update NEXT preview
            const nextContainer = document.getElementById(`next-${artistIndex}`);
            if (nextContainer) {
                if (nextSlide.classList.contains('intro-slide')) {
                    nextContainer.innerHTML = `<div class="nav-preview-name">INTRO →</div>`;
                } else {
                    const nextArtist = nextSlide.dataset.artist || 'Unknown';
                    const nextGenre = nextSlide.dataset.genre || '';
                    // Get the image from the next slide
                    const nextImg = nextSlide.querySelector('.artist-image-container img');
                    const nextImgSrc = nextImg ? nextImg.src : '';

                    nextContainer.innerHTML = `
                        <div class="nav-preview-image">
                            ${nextImgSrc ? `<img src="${nextImgSrc}" alt="${nextArtist}">` : '🎤'}
                        </div>
                        <div class="nav-preview-name">${nextArtist} →</div>
                        <div class="nav-preview-genre">${nextGenre}</div>
                    `;
                }
            }
        }
    }
}

function initLineupGallery() {
    // Prevent double initialization
    if (galleryInitialized) {
        return;
    }

    lineupSlides = Array.from(document.querySelectorAll('.gallery-slide'));
    lineupDots = Array.from(document.querySelectorAll('.dot'));

    if (lineupSlides.length === 0) {
        return;
    }

    // Mark as initialized
    galleryInitialized = true;

    // Start at slide 0
    currentSlide = 0;
    showSlide();

    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyPress);
}

function handleKeyPress(e) {
    if (e.key === 'ArrowLeft') {
        changeSlide(-1);
    } else if (e.key === 'ArrowRight') {
        changeSlide(1);
    }
}

// Initialize when ready - ONLY if gallery container exists
if (document.querySelector('.gallery-container')) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLineupGallery);
    } else {
        initLineupGallery();
    }
}

// ===== SCHEDULE PAGE FUNCTIONS =====

// Function to switch between Day 1 and Day 2 schedules
function switchDay(day) {
    const day1 = document.getElementById('day1-schedule');
    const day2 = document.getElementById('day2-schedule');
    const buttons = document.querySelectorAll('.day-btn');

    if (day === 1) {
        if (day1) day1.style.display = 'grid';
        if (day2) day2.style.display = 'none';
        buttons[0]?.classList.add('active');
        buttons[1]?.classList.remove('active');
    } else {
        if (day1) day1.style.display = 'none';
        if (day2) day2.style.display = 'grid';
        buttons[0]?.classList.remove('active');
        buttons[1]?.classList.add('active');
    }
}