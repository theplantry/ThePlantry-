// layout.js
// Injects a common header and footer across all site pages
// and wires navigation links together.

function isMultiPage() {
    return window.location.pathname.endsWith('index-mpa.html') ||
           window.location.pathname === '/' ||
           window.location.pathname === '/index.html';
}

function buildNav() {
    const mp = isMultiPage();
    // use JS navigation only on the multi-page index file
    const shopLink = mp ? `onclick="navigateTo('shop')"` : `href="/index-mpa.html#shop"`;
    const storyLink = mp ? `onclick="navigateTo('story')"` : `href="/index-mpa.html#story"`;
    const homeLink = mp ? `onclick="navigateTo('home')"` : `href="/index-mpa.html#home"`;
    const locationsLink = mp ? `onclick="navigateTo('locations')"` : `href="/index-mpa.html#locations"`;

    return `
<nav class="fixed top-[35px] w-full z-50 glass-nav border-b border-stone-200">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div class="hidden md:flex space-x-10">
            <a ${shopLink} class="nav-link">Provisions</a>
            <a ${storyLink} class="nav-link">Our Roots</a>
        </div>

        <a ${homeLink} class="text-2xl tracking-[0.35em] uppercase serif font-medium cursor-pointer">The Plantry</a>

        <div class="flex items-center space-x-8">
            <a ${locationsLink} class="nav-link hidden md:block">Island Outposts</a>
            <a href="/cart.html" class="relative group">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <span id="cart-count" class="absolute -top-2 -right-2 bg-stone-900 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
            </a>
            <a href="/login.html" class="nav-link">Log In</a>
            <a href="/register.html" class="nav-link">Register</a>
        </div>
    </div>
</nav>
`;
}

function buildFooter() {
    return `
<footer class="bg-stone-50 border-t border-stone-200 pt-24 pb-12">
    <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div>
                <h4 class="serif text-2xl tracking-widest uppercase mb-8">The Plantry</h4>
                <p class="text-[11px] leading-relaxed text-stone-500 uppercase tracking-widest">
                    Nourishing the collective through intentional provisions.
                </p>
            </div>
            <div>
                <h5 class="text-[10px] tracking-[0.2em] uppercase mb-6 font-semibold">Information</h5>
                <ul class="text-[11px] uppercase tracking-widest space-y-4 text-stone-500">
                    <li><a href="#" class="hover:text-stone-900 transition-colors">Shipping & Returns</a></li>
                    <li><a href="#" class="hover:text-stone-900 transition-colors">Wholesale</a></li>
                    <li><a href="#" class="hover:text-stone-900 transition-colors">Contact</a></li>
                    <li><a href="#" class="hover:text-stone-900 transition-colors">Stockists</a></li>
                </ul>
            </div>
            <div>
                <h5 class="text-[10px] tracking-[0.2em] uppercase mb-6 font-semibold">Legal</h5>
                <ul class="text-[11px] uppercase tracking-widest space-y-4 text-stone-500">
                    <li><a href="#" class="hover:text-stone-900 transition-colors">Privacy Policy</a></li>
                    <li><a href="#" class="hover:text-stone-900 transition-colors">Terms of Service</a></li>
                    <li><a href="#" class="hover:text-stone-900 transition-colors">Accessibility</a></li>
                </ul>
            </div>
            <div>
                <h5 class="text-[10px] tracking-[0.2em] uppercase mb-6 font-semibold">Newsletter</h5>
                <p class="text-[11px] text-stone-500 uppercase tracking-widest mb-6 leading-relaxed">Join our list for seasonal menu updates and wellness insights.</p>
                <form class="flex border-b border-stone-300 pb-2" id="newsletter-form">
                    <input type="email" placeholder="EMAIL ADDRESS" class="bg-transparent text-[11px] w-full focus:outline-none tracking-widest" required>
                    <button type="submit" class="text-[11px] uppercase tracking-widest">Submit</button>
                </form>
            </div>
        </div>
        <div class="text-[9px] tracking-[0.3em] uppercase text-stone-400 text-center">
            &copy; 2024 The Plantry Provisions. All Rights Reserved.
        </div>
    </div>
</footer>
`;
}

function loadLayout() {
    const headerContainer = document.getElementById('site-header');
    const footerContainer = document.getElementById('site-footer');
    if (headerContainer) headerContainer.innerHTML = buildNav();
    if (footerContainer) footerContainer.innerHTML = buildFooter();

    // if we're on the multipage index, we need the navigateTo helper
    if (isMultiPage()) {
        window.navigateTo = function(id) {
            document.querySelectorAll('.page-content').forEach(el => el.classList.remove('active'));
            const target = document.getElementById(id);
            if (target) target.classList.add('active');
            history.pushState(null, '', '#' + id);
        };

        window.addEventListener('popstate', () => {
            const hash = location.hash.replace('#','') || 'home';
            navigateTo(hash);
        });
    }

    // update cart count if stored
    const countSpan = document.getElementById('cart-count');
    if (countSpan) {
        const stored = localStorage.getItem('cartCount');
        if (stored) countSpan.textContent = stored;
    }
}

document.addEventListener('DOMContentLoaded', loadLayout);
