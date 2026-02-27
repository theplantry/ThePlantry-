// API Base URL
const API_BASE = '/api';
let currentUser = null;
let products = [];
let cart = [];
let currentCategory = 'all';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadProducts();
  loadCart();
  setupEventListeners();
});

// Check if user is authenticated
function checkAuth() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    currentUser = JSON.parse(user);
    updateNavigation();
  }
}

// Update navigation based on auth state
function updateNavigation() {
  // Add logout button or user menu if needed
}

// Load products from API
async function loadProducts() {
  try {
    const response = await fetch(`${API_BASE}/products`);
    products = await response.json();
    renderProducts(products);
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

// Render products grid
function renderProducts(productsToRender) {
  const grid = document.getElementById('products-grid');
  grid.innerHTML = '';

  productsToRender.forEach((product, index) => {
    const card = document.createElement('div');
    card.className = 'product-card group cursor-pointer';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', (index * 50).toString());
    card.innerHTML = `
      <div class="aspect-[4/5] overflow-hidden bg-stone-200 mb-6">
        <img src="${product.image_url || 'https://via.placeholder.com/300x400'}" alt="${product.name}" class="w-full h-full object-cover">
      </div>
      <div class="flex justify-between items-start">
        <div>
          <h4 class="text-sm uppercase tracking-wider mb-1">${product.name}</h4>
          <p class="text-xs text-stone-500 uppercase tracking-tighter italic">${product.ingredients || ''}</p>
        </div>
        <span class="text-sm">$${product.price.toFixed(2)}</span>
      </div>
    `;
    
    card.addEventListener('click', () => {
      showProductModal(product);
    });

    grid.appendChild(card);
  });

  // Refresh AOS for newly added elements
  if (typeof AOS !== 'undefined') {
    AOS.refresh();
  }
}

// Show product modal
function showProductModal(product) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center';
  modal.innerHTML = `
    <div class="bg-white p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
      <button class="float-right text-2xl" onclick="this.parentElement.parentElement.remove()">&times;</button>
      <div class="clear-both">
        <img src="${product.image_url || 'https://via.placeholder.com/400'}" alt="${product.name}" class="w-full h-96 object-cover mb-6">
        <h2 class="text-3xl serif mb-2">${product.name}</h2>
        <p class="text-sm text-stone-500 mb-4">${product.ingredients || ''}</p>
        <p class="text-stone-600 mb-6">${product.description || ''}</p>
        
        <div class="flex items-center justify-between mb-6">
          <span class="text-2xl font-semibold">$${product.price.toFixed(2)}</span>
          <div class="flex items-center space-x-3">
            <button class="px-3 py-1 border" onclick="document.getElementById('qty-${product.id}').value = Math.max(1, parseInt(document.getElementById('qty-${product.id}').value) - 1)">-</button>
            <input type="number" id="qty-${product.id}" value="1" min="1" class="w-12 text-center border py-1">
            <button class="px-3 py-1 border" onclick="document.getElementById('qty-${product.id}').value = parseInt(document.getElementById('qty-${product.id}').value) + 1">+</button>
          </div>
        </div>

        ${currentUser ? `
          <button class="w-full bg-stone-900 text-white py-3 mb-3" onclick="addToCart(${product.id}, parseInt(document.getElementById('qty-${product.id}').value)); this.parentElement.parentElement.remove();">
            Add to Cart
          </button>
        ` : `
          <p class="text-sm text-stone-500 mb-3 text-center">Please log in to add items to cart</p>
          <button class="w-full bg-stone-900 text-white py-3" onclick="window.location.href='/login.html'">
            Log In to Order
          </button>
        `}
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

// Add to cart
async function addToCart(productId, quantity) {
  if (!currentUser) {
    window.location.href = '/login.html';
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        product_id: productId,
        quantity: quantity
      })
    });

    if (response.ok) {
      loadCart();
      showNotification('Added to cart!');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
}

// Load cart
async function loadCart() {
  if (!currentUser) return;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      cart = data.items;
      updateCartCount();
    }
  } catch (error) {
    console.error('Error loading cart:', error);
  }
}

// Update cart count badge
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').textContent = count;
}

// Setup event listeners
function setupEventListeners() {
  // Category filters
  document.querySelectorAll('.category-filter').forEach(button => {
    button.addEventListener('click', (e) => {
      document.querySelectorAll('.category-filter').forEach(b => {
        b.classList.remove('text-stone-900', 'border-b', 'border-stone-900');
        b.classList.add('text-stone-400');
      });
      e.target.classList.add('text-stone-900', 'border-b', 'border-stone-900');
      e.target.classList.remove('text-stone-400');

      currentCategory = e.target.dataset.category;
      filterProducts();
    });
  });

  // Newsletter form
  document.getElementById('newsletter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    showNotification('Thanks for signing up!');
    e.target.reset();
  });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// Filter products by category
function filterProducts() {
  if (currentCategory === 'all') {
    renderProducts(products);
  } else {
    const filtered = products.filter(p => p.category === currentCategory);
    renderProducts(filtered);
  }
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'fixed top-6 right-6 bg-stone-900 text-white px-6 py-4 rounded z-50';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}
