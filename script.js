window.orders = [];

document.addEventListener("DOMContentLoaded", () => {

  // REMOVE orders from here ❌

});

document.addEventListener("DOMContentLoaded", () => {

  /* ================= CONFIRM MODAL ================= */
 function showConfirm(items, callback) {
  const modal = document.getElementById("confirmModal");
  const yesBtn = document.getElementById("confirmYes");
  const noBtn = document.getElementById("confirmNo");
  const itemsBox = document.getElementById("confirmItems");
  const totalBox = document.getElementById("confirmTotal");

  if (!modal) return;

  // Render items
  itemsBox.innerHTML = "";
  let total = 0;

  items.forEach(item => {
    const amount = item.qty * item.price;
    total += amount;

    itemsBox.innerHTML += `
      <div style="margin-bottom:8px;">
        ${item.name} × ${item.qty} = ₹${amount}
      </div>
    `;
  });

  totalBox.textContent = total;

  modal.style.display = "flex";

  yesBtn.onclick = () => {
    modal.style.display = "none";
    callback(true);
  };

  noBtn.onclick = () => {
    modal.style.display = "none";
    callback(false);
  };
}

  /* ================= HERO SLIDER ================= */

  const slides = [
    { img: "images/slide1.jpg", title: "THE STRAWBERRY SUITE", subtitle: "Nature's Sweetest Gems, Perfectly Layered" },
    { img: "images/slide2.jpg", title: "CHOCO DELIGHT", subtitle: "Deep Cocoa, Pure Happiness" },
    { img: "images/slide3.jpg", title: "VELVET DREAM", subtitle: "Soft, Rich, Irresistible" },
    { img: "images/slide4.jpg", title: "FRUIT FANTASY", subtitle: "Freshness in Every Bite" },
    { img: "images/slide5.jpg", title: "ROYAL INDULGENCE", subtitle: "Luxury You Can Taste" }
  ];

  let current = 0;

  const sliderImage = document.getElementById("sliderImage");
  const slideTitle = document.getElementById("slideTitle");
  const slideSubtitle = document.getElementById("slideSubtitle");
  const dots = document.querySelectorAll(".dot");

  function showSlide(index) {
    if (!sliderImage) return;

    current = index;

    sliderImage.src = slides[index].img;
    slideTitle.textContent = slides[index].title;
    slideSubtitle.textContent = slides[index].subtitle;

    dots.forEach(dot => dot.classList.remove("active"));
    dots[index]?.classList.add("active");
  }

  function nextSlide() {
    current = (current + 1) % slides.length;
    showSlide(current);
  }

  setInterval(nextSlide, 3000);

  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      showSlide(parseInt(dot.dataset.index));
    });
  });

  showSlide(0);

  /* ================= PAGE NAVIGATION ================= */

  window.showPage = function(page) {

   const pages = ["homepage", "trackPage", "cartPage", "loginPage", "signupPage", "successPage", "aboutPage", "contactPage", "menuItemsPage"];
  pages.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });

  const active = document.getElementById(page);
  if (active) active.style.display = "block";

  const footer = document.querySelector(".footer");
  if (footer) {
    footer.style.display = (page === "homepage") ? "block" : "none";
  }
};

  window.goHome = () => showPage("homepage");

  window.openTrack = () => {
    if (!isLoggedIn) {
      showPage("loginPage");
      return;
    }
    showPage("trackPage");
    window.renderOrders();
  };

  window.openCart = () => {
    if (!isLoggedIn) {
      showPage("loginPage");
      return;
    }
    showPage("cartPage");
    renderCart();
  };

  window.openLogin = () => showPage("loginPage");
  window.showSignup = () => showPage("signupPage");



  /* ================= CART SYSTEM ================= */

  let cart = [];

  window.addToCart = function(name, price, img) {

    if (!isLoggedIn) {
      showPage("loginPage");
      return;
    }

    const exists = cart.find(i => i.name === name);

    if (exists) {
      alert("Item already in cart!");
      return;
    }

    const item = {
      id: Date.now(),
      name,
      price,
      img,
      qty: 1,
      weight: 1
    };

    cart.push(item);

    alert("Item added to cart!");
    renderCart();
  };

  function renderCart() {
    
    const cartItems = document.getElementById("cartItems");
    const totalBox = document.getElementById("cartTotal");
    const summary = document.querySelector(".cart-summary");
    const summaryItems = document.getElementById("summaryItems");

    if (!cartItems || !totalBox) return;

    cartItems.innerHTML = "";
    summaryItems.innerHTML = "";

    if (cart.length === 0) {
      summary.style.display = "none";

      cartItems.innerHTML = `
        <div class="empty-cart">
          <img src="images/empty.png">
          <p>Hey, cart bag seems to be empty, let's add some items.</p>
          <button onclick="goHome()">CONTINUE SHOPPING</button>
        </div>
      `;
      return;
    }

    summary.style.display = "block";

    let total = 0;

    cart.forEach(item => {
      const amount = item.price * item.qty * item.weight;
      total += amount;

      cartItems.innerHTML += `
        <div class="cart-item">
          <img src="${item.img}">
          <div class="cart-info">
            <h3>${item.name}</h3>
            <p>₹${item.price}</p>

            <div class="qty-box">
              <button onclick="changeQty(${item.id}, -1)">−</button>
              <span>${item.qty}</span>
              <button onclick="changeQty(${item.id}, 1)">+</button>
            </div>

            <button class="removeBtn" onclick="removeItem(${item.id})">
              Remove
            </button>
          </div>
        </div>
      `;

      summaryItems.innerHTML += `
        <div style="margin-bottom:10px;">
          <strong>${item.name}</strong> × ${item.qty} = ₹${amount}
        </div>
      `;
    });

    totalBox.textContent = total;
  }

  window.changeQty = function(id, change) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.qty += change;
    if (item.qty < 1) item.qty = 1;

    renderCart();
  };

  window.removeItem = function(id) {
    cart = cart.filter(i => i.id !== id);
    renderCart();
  };

  /* ================= ORDER SYSTEM ================= */

  

  document.querySelector(".buyBtn")?.addEventListener("click", () => {

    if (!isLoggedIn) {
      showPage("loginPage");
      return;
    }

    if (cart.length === 0) return;

    showConfirm(cart, (confirmed) => {
      if (!confirmed) return;

      const newOrder = {
        id: Date.now(),
        items: [...cart],
        status: 0
      };

      window.orders.push(newOrder);

      cart = [];
      renderCart();

      showPage("successPage");
    });
  });

  window.renderOrders = function() {

    const container = document.getElementById("ordersContainer");
    if (!container) return;

    container.innerHTML = "";

    if (window.orders.length === 0) {
      container.innerHTML = `
        <div class="empty-cart">
          <img src="images/track.png">
          <p>No orders yet. Start shopping!</p>
        </div>
      `;
      return;
    }

    const steps = ["Ordered", "Packed", "Shipped", "Out for Delivery", "Delivered"];

    window.orders.forEach(order => {

      const total = order.items.reduce((sum, item) => sum + item.qty * item.price, 0);

      container.innerHTML += `
        <div class="order-card">

          <h2>Order #${order.id}</h2>

          <div class="tracking-bar">
            ${order.status === -1 ? `
  <div style="color:red; font-weight:600; text-align:center; margin:20px 0;">
    ❌ Order Cancelled
  </div>
` : `
  ${steps.map((step, i) => `
    <div class="track-step ${i <= order.status ? "active" : ""}">
      <div class="circle">${i + 1}</div>
      <p>${step}</p>
    </div>
  `).join("")}
`}
          </div>

          <table class="order-table">
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th style="text-align:right;">Amount</th>
            </tr>

            ${order.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.qty}</td>
                <td style="text-align:right;">₹${item.qty * item.price}</td>
              </tr>
            `).join("")}
          </table>

          <div class="order-total">
            Total: ₹${total}
          </div>
          

          ${order.status >= 0 && order.status < 2 ? `
  <button class="cancelBtn" onclick="startCancelFlow(${order.id})">
    Cancel Order
  </button>
` : ""}

          <p style="margin-top:10px; font-weight:600;">
            Payment: Cash on Delivery
          </p>

        </div>
      `;
    });
  }

  /* ================= AUTH SYSTEM ================= */

  let isLoggedIn = false;

  function validateEmailField(inputId) {
    const input = document.getElementById(inputId);
    const email = input.value.trim();

    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (pattern.test(email)) {
      input.classList.remove("input-error");
      input.classList.add("input-success");
      return true;
    } else {
      input.classList.remove("input-success");
      input.classList.add("input-error");
      return false;
    }
  }

  function validatePassword(password) {
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least 1 uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least 1 lowercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least 1 digit";
  }
  if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
    return "Password must contain at least 1 special character";
  }
  return null; // valid
}

  window.handleSignup = function() {
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  const emailValid = validateEmailField("signupEmail");
  const passwordError = validatePassword(password);

  if (!name || !email || !password) {
    showToast("All fields are mandatory!");
    return;
  }

  if (!emailValid) return;

  if (passwordError) {
    showToast(passwordError);
    return;
  }

  showToast("Signed up successfully!");
  showPage("loginPage");
};

  window.handleLogin = function() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  const emailValid = validateEmailField("loginEmail");

  if (!email || !password) {
    showToast("Please fill all fields!");
    return;
  }

  if (!emailValid) return;

  // PASSWORD VALIDATION
  const passwordError = validatePassword(password);

  if (passwordError) {
    showToast("Incorrect password");
    return;
  }

  isLoggedIn = true;
  updateNavbar();

  goHome();
};

  function updateNavbar() {
    const auth = document.getElementById("authSection");

    if (!auth) return;

    if (isLoggedIn) {
  const email = document.getElementById("loginEmail")?.value || "";
  const firstLetter = email.charAt(0).toUpperCase();

  auth.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.style.position = "relative";
  wrapper.style.display = "flex";
  wrapper.style.flexDirection = "column";
  wrapper.style.alignItems = "center";

  const circle = document.createElement("div");
  circle.className = "profile-circle";
  circle.textContent = firstLetter;
  circle.onclick = toggleDropdown;

  const dropdown = document.createElement("div");
  dropdown.className = "dropdown";
  dropdown.id = "dropdown";

  const logoutBtn = document.createElement("div");
  logoutBtn.textContent = "Sign Out";
  logoutBtn.onclick = logout;

  dropdown.appendChild(logoutBtn);
  wrapper.appendChild(circle);
  wrapper.appendChild(dropdown);

  auth.appendChild(wrapper);

  auth.onclick = null;
} else {
      auth.innerHTML = "Login/Signup";
      auth.onclick = openLogin;
    }
  }

  window.toggleDropdown = function() {
    const d = document.getElementById("dropdown");
    if (!d) return;

    d.style.display = d.style.display === "block" ? "none" : "block";
  };

  window.logout = function() {
    isLoggedIn = false;

    ["loginEmail","loginPassword","signupName","signupEmail","signupPassword"]
      .forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
      });

    updateNavbar();
    openLogin();
  };

  /* ================= ORDER NOW BUTTON ================= */

  document.querySelector(".hero-right button")?.addEventListener("click", () => {
    if (!isLoggedIn) {
      showPage("loginPage");
      return;
    }

    const item = [{
  name: "Special Cake",
  qty: 1,
  price: 700
}];

showConfirm(item, (confirmed) => {
      if (!confirmed) return;

      const newOrder = {
        id: Date.now(),
        items: [{ 
          name: "Special Cake", 
          qty: 1,
          price: 700
        }],
        status: 0
      };

      window.orders.push(newOrder);

      showPage("successPage");
    });
  });

  /* REAL TIME VALIDATION */
  document.getElementById("loginEmail")?.addEventListener("input", () => {
    validateEmailField("loginEmail");
  });

  document.getElementById("signupEmail")?.addEventListener("input", () => {
    validateEmailField("signupEmail");
  });

  /* INIT */
  renderCart();
  updateNavbar();

});

window.openAbout = () => showPage("aboutPage");
window.openContact = () => showPage("contactPage");

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");

  toast.textContent = message;

  toast.style.background =
    type === "error" ? "#e60000" :
    type === "warning" ? "#ff9800" :
    "red";

  // get last click position
  document.onclick = function(e) {
    toast.style.left = e.pageX + 15 + "px";
    toast.style.top = e.pageY + 15 + "px";
  };

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1500);
}

function togglePassword(inputId, icon) {
  const input = document.getElementById(inputId);

  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}

const menuData = {
  classic: [
    { name: "Chocolate Truffle", price: 699, img: "images/truffle.jpg" },
    { name: "Black Forest", price: 649, img: "images/blackforest.jpg" },
    { name: "Red Velvet", price: 799, img: "images/redvelvet.jpg" },
    { name: "Strawberry Cream", price: 699, img: "images/strawberry.jpg" },
    { name: "Pineapple Cake", price: 599, img: "images/pineapple.jpg" },
    { name: "Vanilla Cream", price: 549, img: "images/vanilla.jpg" },
    { name: "Butterscotch", price: 699, img: "images/butterscotch.jpg" },
    { name: "Coffee Mocha", price: 749, img: "images/mocha.jpg" },
    { name: "Fruit & Nut", price: 899, img: "images/fruitnut.jpg" },
    { name: "Chocolate Chip", price: 699, img: "images/chocochip.jpg" }
  ],

  gourmet: [
    { name: "Midnight Belgian Truffle", price: 699, img: "images/belgian.jpg" },
    { name: "Dark Cocoa Indulgence", price: 649, img: "images/cocoa.jpg" },
    { name: "Red Velvet", price: 799, img: "images/redvelvet.jpg" },
    { name: "Molten Chocolate Royale", price: 699, img: "images/royale.jpg" },
    { name: "Choco Hazelnut Symphony", price: 599, img: "images/hazel.jpg" },
    { name: "Strawberry Velvet Bliss", price: 549, img: "images/velvet.jpg" },
    { name: "Blueberry Cheesecake Dream", price: 699, img: "images/blueberry.jpg" },
    { name: "Mango Passion Delight", price: 749, img: "images/mango.jpg" },
    { name: "Royal Caramel Opera", price: 899, img: "images/opera.jpg" },
    { name: "Pistachio Rose Elegance", price: 699, img: "images/rose.jpg" }
  ],

  designer: [
  { name: "Galaxy Mirror Glaze", price: 1499, img: "images/galaxy.jpg" },
  { name: "Golden Drip Delight", price: 1599, img: "images/goldendrip.jpg" },
  { name: "Floral Fantasy Cake", price: 1699, img: "images/floral.jpg" },
  { name: "Princess Crown Elegance", price: 1899, img: "images/crown.jpg" },
  { name: "Pastel Dream Layers", price: 1399, img: "images/pastel.jpg" },
  { name: "Rose Garden Delight", price: 1499, img: "images/rosegarden.jpg" },
  { name: "Unicorn Magic Cake", price: 1799, img: "images/unicorn.jpg" },
  { name: "Royal Pearl Designer Cake", price: 1999, img: "images/pearl.jpg" },
  { name: "Buttercream Blossom Art", price: 1599, img: "images/blossom.jpg" },
  { name: "Luxury Marble Finish Cake", price: 1699, img: "images/marble.jpg" }
],

  desserts: [
  { name: "Choco Lava Delight", price: 299, img: "images/lava.jpg" },
  { name: "Classic Tiramisu Cup", price: 349, img: "images/tiramisu.jpg" },
  { name: "Blueberry Cheesecake Jar", price: 329, img: "images/blueberryjar.jpg" },
  { name: "Caramel Custard Bliss", price: 249, img: "images/custard.jpg" },
  { name: "Belgian Chocolate Mousse", price: 379, img: "images/mousse.jpg" },
  { name: "Strawberry Cream Parfait", price: 299, img: "images/parfait.jpg" },
  { name: "Nutella Brownie Bites", price: 279, img: "images/brownie.jpg" },
  { name: "Mango Delight Pudding", price: 259, img: "images/mangopudding.jpg" },
  { name: "Oreo Crunch Dessert Cup", price: 289, img: "images/oreo.jpg" },
  { name: "Vanilla Panna Cotta", price: 319, img: "images/pannacotta.jpg" }
],

  frosting: [
  { name: "Silky Vanilla Frost Cake", price: 649, img: "images/silkyvanilla.jpg" },
  { name: "Chocolate Frost Dream", price: 699, img: "images/chocofrost.jpg" },
  { name: "Strawberry Frost Bliss", price: 679, img: "images/strawfrost.jpg" },
  { name: "Butterscotch Frost Magic", price: 659, img: "images/butterscotchfrost.jpg" },
  { name: "Caramel Frost Indulgence", price: 699, img: "images/caramelfrost.jpg" },
  { name: "Blueberry Frost Fantasy", price: 729, img: "images/bluefrost.jpg" },
  { name: "Pineapple Frost Treat", price: 629, img: "images/pinefrost.jpg" },
  { name: "Coffee Frost Delight", price: 689, img: "images/coffeefrost.jpg" },
  { name: "Hazelnut Frost Heaven", price: 749, img: "images/hazelfrost.jpg" },
  { name: "Red Velvet Frost Charm", price: 799, img: "images/redfrost.jpg" }
],

  cupcake: [
  { name: "Classic Vanilla Cupcake Box", price: 399, img: "images/vanillacup.jpg" },
  { name: "Chocolate Fudge Cupcake Box", price: 449, img: "images/chococup.jpg" },
  { name: "Red Velvet Cupcake Treat", price: 499, img: "images/redcup.jpg" },
  { name: "Strawberry Swirl Cupcakes", price: 429, img: "images/strawcup.jpg" },
  { name: "Butterscotch Bliss Cupcakes", price: 439, img: "images/butterscotchcup.jpg" },
  { name: "Oreo Crunch Cupcake Box", price: 459, img: "images/oreocup.jpg" },
  { name: "Blueberry Burst Cupcakes", price: 469, img: "images/bluecup.jpg" },
  { name: "Caramel Drizzle Cupcakes", price: 479, img: "images/caramelcup.jpg" },
  { name: "Coffee Mocha Cupcake Box", price: 449, img: "images/coffeecup.jpg" },
  { name: "Rainbow Sprinkle Cupcakes", price: 499, img: "images/rainbowcup.jpg" }
],

  barbie: [
  { name: "Princess Barbie Dream Cake", price: 2499, img: "images/barbie_princess.jpg" },
  { name: "Barbie Doll Fantasy Delight", price: 2699, img: "images/barbie_fantasy.jpg" }
],

  fruit: [
  { name: "Tropical Fruit Medley Cake", price: 699, img: "images/tropicalfruit.jpg" },
  { name: "Fresh Strawberry Delight Cake", price: 749, img: "images/freshstrawberry.jpg" },
  { name: "Mango Magic Cream Cake", price: 699, img: "images/mangomagic.jpg" },
  { name: "Pineapple Paradise Cake", price: 649, img: "images/pineappleparadise.jpg" },
  { name: "Mixed Berry Bliss Cake", price: 799, img: "images/mixedberry.jpg" },
  { name: "Kiwi Fresh Cream Cake", price: 749, img: "images/kiwifresh.jpg" },
  { name: "Orange Zest Fruit Cake", price: 699, img: "images/orangezest.jpg" },
  { name: "Black Grape Fusion Cake", price: 769, img: "images/grapefusion.jpg" },
  { name: "Exotic Fruit Symphony Cake", price: 849, img: "images/exoticfruit.jpg" },
  { name: "Lychee Rose Delight Cake", price: 829, img: "images/lycheerose.jpg" }
],

  
};



window.openMenu = function(category) {

  const container = document.getElementById("menuItemsContainer");
  const heading = document.getElementById("menuHeading");

  container.innerHTML = "";

  const items = menuData[category];

  heading.textContent = category.toUpperCase() + " CAKES";

  items.forEach(item => {
    container.innerHTML += `
      <div class="popular-card">
        <img src="${item.img}">
        <h3>${item.name}</h3>
        <p class="price">₹${item.price}</p>

        <button class="add-cart"
          onclick="addToCart('${item.name}', ${item.price}, '${item.img}')">
          Add to Cart
        </button>
      </div>
    `;
  });

  showPage("menuItemsPage");
};

function startCancelFlow(orderId) {
  const modal = document.getElementById("cancelModal");

  if (!modal) return;

  modal.style.display = "flex";

  // Remove old listeners (VERY IMPORTANT)
  const yesBtn = document.getElementById("cancelYesBtn");
  const noBtn = document.getElementById("cancelNoBtn");

  const newYes = yesBtn.cloneNode(true);
  const newNo = noBtn.cloneNode(true);

  yesBtn.parentNode.replaceChild(newYes, yesBtn);
  noBtn.parentNode.replaceChild(newNo, noBtn);

  // Add fresh listeners
  newYes.addEventListener("click", () => {
    console.log("YES CLICKED"); // 🔍 debug
    executeCancel(orderId);
    modal.style.display = "none";
  });

  newNo.addEventListener("click", () => {
    modal.style.display = "none";
  });
}



window.executeCancel = function(orderId) {
  const order = window.orders.find(o => o.id === orderId);
  if (!order) return;

  order.status = -1;

  window.renderOrders();
  showToast("Order cancelled successfully", "warning");
};



window.sendMessage = function () {
  const messageBox = document.getElementById("userMessage");
  const msg = messageBox.value.trim();

  if (msg === "") {
    showToast("Message is required!", "error");
    messageBox.focus();
    return;
  }

  showToast("We will get back to you soon 😊");

  messageBox.value = "";
};