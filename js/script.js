const CART_KEY = "glowGlamSalonCart";

function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(cart) ? cart : [];
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countEls = document.querySelectorAll('#cart-count');

  countEls.forEach((element) => {
    element.textContent = totalItems;
  });
}

function showToast(message, type = 'success') {
  let toastElement = document.getElementById('liveToast');

  if (!toastElement) {
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    toastContainer.innerHTML = `
      <div id="liveToast" class="toast align-items-center text-bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">${message}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;
    document.body.appendChild(toastContainer);
    toastElement = document.getElementById('liveToast');
  }

  const toastBody = toastElement.querySelector('.toast-body');
  toastBody.textContent = message;

  toastElement.classList.remove('text-bg-success', 'text-bg-warning', 'text-bg-danger');
  toastElement.classList.add(`text-bg-${type}`);

  const toast = new bootstrap.Toast(toastElement, { delay: 2500 });
  toast.show();
}

function addToCart(name, price, image) {
  const cart = getCart();
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price: Number(price),
      image,
      quantity: 1,
    });
  }

  saveCart(cart);
  updateCartCount();
  showToast(`${name} added to cart.`);

  if (document.body.dataset.page === 'cart') {
    renderCartPage();
  }
}

function renderCartPage() {
  const cart = getCart();
  const cartBody = document.getElementById('cart-items-body');
  const emptyCart = document.getElementById('empty-cart');
  const cartContent = document.getElementById('cart-content');
  const subtotalValue = document.getElementById('subtotal-value');
  const totalValue = document.getElementById('total-value');

  if (!cartBody) return;

  if (!cart.length) {
    if (emptyCart) emptyCart.classList.remove('d-none');
    if (cartContent) cartContent.classList.add('d-none');
    return;
  }

  if (emptyCart) emptyCart.classList.add('d-none');
  if (cartContent) cartContent.classList.remove('d-none');

  cartBody.innerHTML = cart
    .map(
      (item) => `
        <tr>
          <td>
            <div class="cart-product">
              <img src="${item.image}" alt="${item.name}" />
              <span>${item.name}</span>
            </div>
          </td>
          <td>₹${item.price}</td>
          <td>
            <div class="qty-box">
              <button class="qty-btn" type="button" data-cart-action="decrease" data-item-name="${item.name}">-</button>
              <span class="qty-value">${item.quantity}</span>
              <button class="qty-btn" type="button" data-cart-action="increase" data-item-name="${item.name}">+</button>
            </div>
          </td>
          <td>₹${item.price * item.quantity}</td>
          <td>
            <button class="btn btn-sm btn-outline-danger" type="button" data-cart-action="remove" data-item-name="${item.name}">Remove</button>
          </td>
        </tr>
      `
    )
    .join('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (subtotalValue) subtotalValue.textContent = `₹${subtotal}`;
  if (totalValue) totalValue.textContent = `₹${subtotal}`;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  updateCartCount();

  const addButtons = document.querySelectorAll('[data-add-to-cart]');
  addButtons.forEach((button) => {
    button.addEventListener('click', () => {
      addToCart(button.dataset.name, button.dataset.price, button.dataset.image);
    });
  });

  const appointmentForm = document.getElementById('appointmentForm');
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = document.getElementById('fullName').value.trim();
      const email = document.getElementById('email').value.trim();
      const mobile = document.getElementById('mobile').value.trim();
      const service = document.getElementById('service').value.trim();
      const date = document.getElementById('date').value.trim();
      const time = document.getElementById('time').value.trim();

      if (!name || !email || !mobile || !service || !date || !time) {
        showToast('Please fill in all required appointment details.', 'warning');
        return;
      }

      if (!validateEmail(email)) {
        showToast('Please enter a valid email address.', 'warning');
        return;
      }

      appointmentForm.reset();
      showToast('Your appointment has been booked successfully!');
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const phone = document.getElementById('contactPhone').value.trim();
      const subject = document.getElementById('contactSubject').value.trim();
      const message = document.getElementById('contactMessage').value.trim();

      if (!name || !email || !phone || !subject || !message) {
        showToast('Please complete the contact form before sending your message.', 'warning');
        return;
      }

      if (!validateEmail(email)) {
        showToast('Please enter a valid email address.', 'warning');
        return;
      }

      contactForm.reset();
      showToast('Your message has been sent successfully!');
    });
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();

      if (!email || !password) {
        showToast('Please enter both email and password.', 'warning');
        return;
      }

      if (!validateEmail(email)) {
        showToast('Please enter a valid email address.', 'warning');
        return;
      }

      loginForm.reset();
      showToast('Login successful! Welcome back.');
    });
  }

  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = document.getElementById('registerName').value.trim();
      const email = document.getElementById('registerEmail').value.trim();
      const password = document.getElementById('registerPassword').value.trim();
      const confirmPassword = document.getElementById('confirmPassword').value.trim();

      if (!name || !email || !password || !confirmPassword) {
        showToast('Please fill in all registration fields.', 'warning');
        return;
      }

      if (!validateEmail(email)) {
        showToast('Please enter a valid email address.', 'warning');
        return;
      }

      if (password.length < 6) {
        showToast('Password should be at least 6 characters long.', 'warning');
        return;
      }

      if (password !== confirmPassword) {
        showToast('Passwords do not match.', 'warning');
        return;
      }

      registerForm.reset();
      const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
      if (modal) modal.hide();
      showToast('Your account has been created successfully!');
    });
  }

  const checkoutButton = document.getElementById('checkout-btn');
  if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
      showToast('Checkout is ready for your next step!');
    });
  }

  if (document.body.dataset.page === 'cart') {
    renderCartPage();
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-cart-action]');
    if (!button) return;

    const action = button.dataset.cartAction;
    const name = button.dataset.itemName;
    const cart = getCart();

    if (!name) return;

    const item = cart.find((cartItem) => cartItem.name === name);
    if (!item) return;

    if (action === 'increase') {
      item.quantity += 1;
    }

    if (action === 'decrease') {
      item.quantity = Math.max(1, item.quantity - 1);
    }

    if (action === 'remove') {
      const updatedCart = cart.filter((cartItem) => cartItem.name !== name);
      saveCart(updatedCart);
      updateCartCount();
      renderCartPage();
      return;
    }

    saveCart(cart);
    updateCartCount();
    renderCartPage();
  });
});
