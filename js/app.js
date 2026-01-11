// Core Application Logic
const App = {
    state: {
        currentPlan: null,
        selectedDay: 1,
        userProfile: {},
        isLoaded: false
    },

    init() {
        this.createStars();
        this.loadProfile();
        this.checkPersistence();
        this.initLucide();
    },

    createStars() {
        const body = document.body;
        const starContainer = document.createElement('div');
        starContainer.id = 'sky-canvas';
        body.prepend(starContainer);

        for (let i = 0; i < 150; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            const size = Math.random() * 2 + 1;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
            starContainer.appendChild(star);
        }
    },

    initLucide() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    },

    loadProfile() {
        const profile = localStorage.getItem('ramadan_profile');
        if (profile) {
            this.state.userProfile = JSON.parse(profile);
        }
    },

    saveProfile(data) {
        this.state.userProfile = { ...this.state.userProfile, ...data };
        localStorage.setItem('ramadan_profile', JSON.stringify(this.state.userProfile));
    },

    checkPersistence() {
        const plan = localStorage.getItem('ramadan_plan');
        if (plan) {
            this.state.currentPlan = JSON.parse(plan);
        }
    },

    navigateTo(page) {
        // Since we are using simple multi-pages, we just redirect or use window.location
        // In a true SPA we'd use routing, but for this structure we'll use links.
        window.location.href = page;
    }
};

// Common UI Elements (Shared Navbar/Footer)
const UI = {
    injectNavbar(activeLink, isRoot = false) {
        const base = isRoot ? 'pages/' : '';
        const indexBase = isRoot ? 'index.html' : '../index.html';

        // Lanterns
        const lanterns = `
            <div class="lantern-container" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;">
                <div class="lantern-float" style="position: absolute; left: 10%; top: 5%; width: 50px;">
                    <svg viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50 0L60 20H40L50 0Z" fill="#D4AF37"/>
                        <rect x="30" y="20" width="40" height="80" rx="5" fill="#D4AF37" fill-opacity="0.8"/>
                        <circle cx="50" cy="135" r="5" fill="#D4AF37"/>
                    </svg>
                </div>
                <div class="lantern-float" style="position: absolute; right: 10%; top: 15%; width: 60px; animation-delay: 1s;">
                    <svg viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50 0L60 20H40L50 0Z" fill="#D4AF37"/>
                        <rect x="30" y="20" width="40" height="80" rx="5" fill="#8B4513" fill-opacity="0.8"/>
                        <rect x="35" y="25" width="30" height="70" rx="3" fill="#D4AF37" fill-opacity="0.5"/>
                        <circle cx="50" cy="135" r="5" fill="#D4AF37"/>
                    </svg>
                </div>
            </div>
        `;

        const navHTML = `
            ${lanterns}
            <nav class="navbar glass">
                <div class="logo">
                    <span class="nastaliq text-gold-gradient text-4xl mr-3">رمضان</span>
                    <span class="font-bold text-navy" style="font-size: 1.2rem;">Planner Pro</span>
                </div>
                <div class="nav-links">
                    <a href="${indexBase}" class="nav-link ${activeLink === 'home' ? 'active' : ''}"><i data-lucide="home"></i> Home</a>
                    <a href="${base}planner.html" class="nav-link ${activeLink === 'planner' ? 'active' : ''}"><i data-lucide="sparkles"></i> Generator</a>
                    <a href="${base}dashboard.html" class="nav-link ${activeLink === 'dashboard' ? 'active' : ''}"><i data-lucide="layout-dashboard"></i> Dashboard</a>
                    <a href="${base}shopping.html" class="nav-link ${activeLink === 'shopping' ? 'active' : ''}"><i data-lucide="shopping-basket"></i> Shopping</a>
                </div>
                <div class="user-action">
                    <button class="btn-premium" onclick="location.href='${base}planner.html'">New Plan</button>
                </div>
            </nav>

            <div class="mobile-nav">
                <a href="${indexBase}" class="${activeLink === 'home' ? 'active' : ''}"><i data-lucide="home"></i> Home</a>
                <a href="${base}planner.html" class="${activeLink === 'planner' ? 'active' : ''}"><i data-lucide="sparkles"></i> Plan</a>
                <a href="${base}dashboard.html" class="${activeLink === 'dashboard' ? 'active' : ''}"><i data-lucide="calendar"></i> Days</a>
                <a href="${base}shopping.html" class="${activeLink === 'shopping' ? 'active' : ''}"><i data-lucide="shopping-cart"></i> Shop</a>
            </div>
        `;
        document.body.insertAdjacentHTML('afterbegin', navHTML);
        lucide.createIcons();
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
