const orderButton = document.querySelector(".btn-order");

let cart = [];

// বাংলা নাম্বার কনভার্ট
function toBanglaNumber(number) {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

  return number.toString().replace(/\d/g, (digit) => banglaDigits[digit]);
}

// Change Quantity
function changeQty(id, amount) {
  const input = document.getElementById(id);

  let value = parseFloat(input.value);

  value += amount;

  if (value < 0.5) value = 0.5;

  input.value = value;
}

// Add To Cart
function addToCart(name, price, qtyId) {
  const qty = parseFloat(document.getElementById(qtyId).value);

  const existing = cart.find((item) => item.name === name);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      name,
      price,
      qty,
    });
  }

  renderCart();
}

// Render Cart
function renderCart() {
  const cartContainer = document.getElementById("cart-items");

  cartContainer.innerHTML = "";

  let subtotal = 0;

  cart.forEach((item) => {
    const total = item.price * item.qty;

    subtotal += total;

    cartContainer.innerHTML += `
      <div class="price-row">
        <span>
          ${item.name} (${toBanglaNumber(item.qty)} কেজি)
        </span>

        <span>
          ${toBanglaNumber(total)} ৳
        </span>
      </div>
    `;
  });

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <p>এখনো কোনো পণ্য যোগ করা হয়নি</p>
    `;
  }

  const grandTotal = subtotal + 120;

  document.getElementById(
    "grand-total"
  ).innerText = `${toBanglaNumber(grandTotal)} ৳`;
}

// Order Submit
orderButton.addEventListener("click", async () => {
  const name = document.getElementById("customer-name").value;

  const address =
    document.getElementById("customer-address").value;

  const phone =
    document.getElementById("customer-phone").value;

  if (!name || !address || !phone) {
    alert("সব তথ্য পূরণ করুন");
    return;
  }

  if (cart.length === 0) {
    alert("কমপক্ষে একটি পণ্য যোগ করুন");
    return;
  }

  let productList = "";

  let subtotal = 0;

  cart.forEach((item) => {
    productList += `${item.name} (${toBanglaNumber(item.qty)} কেজি), `;

    subtotal += item.price * item.qty;
  });

  const grandTotal = subtotal + 120;

  const formData = new FormData();

  formData.append("name", name);
  formData.append("address", address);
  formData.append("phone", phone);
  formData.append("product", productList);
  formData.append("total", toBanglaNumber(grandTotal));

  try {
    await fetch(
      "https://script.google.com/macros/s/AKfycbzfmJdeCFLq_AnC5vEVPHjBbcYKvj_yw07MLUwaodj7Cc0Ad5dwvNlTiJiaikoRrvU/exec",
      {
        method: "POST",
        body: formData,
      }
    );

    alert("অর্ডার সফল হয়েছে!");

    // Clear Inputs
    document.querySelectorAll("input").forEach((input) => {
      input.value = "";
    });

    // Reset Quantity
    document.getElementById("qty1").value = 2;
    document.getElementById("qty2").value = 1;
    document.getElementById("qty3").value = 1;

    // Clear Cart
    cart = [];

    renderCart();
  } catch (error) {
    console.error(error);

    alert("সমস্যা হয়েছে");
  }
});

// Initial Render
renderCart();