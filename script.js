const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const exploreBtn = document.getElementById("exploreBtn");
const moreMenu = document.getElementById("moreMenu");
const submitReview = document.getElementById("submitReview");
const reviewList = document.getElementById("reviewList");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  menuBtn.textContent = navLinks.classList.contains("active") ? "×" : "☰";
});

document.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    menuBtn.textContent = "☰";
  });
});

exploreBtn.addEventListener("click", () => {
  moreMenu.classList.toggle("show");
  exploreBtn.textContent = moreMenu.classList.contains("show")
    ? "Show Less Menu"
    : "Explore More Menu";
});

function getSavedReviews() {
  return JSON.parse(localStorage.getItem("restaurantReviews")) || [];
}

function saveReviews(reviews) {
  localStorage.setItem("restaurantReviews", JSON.stringify(reviews));
}

function loadReviews() {
  const savedReviews = getSavedReviews();

  savedReviews.forEach((review, index) => {
    addReviewToPage(review.name, review.text, index);
  });
}

function addReviewToPage(name, text, index) {
  const reviewCard = document.createElement("div");
  reviewCard.className = "review-card";

  reviewCard.innerHTML = `
    <p>“${text}”</p>
    <strong>★★★★★</strong>
    <span>- ${name}</span>

    <div class="review-actions">
      <button onclick="editReview(${index})">Edit</button>
      <button onclick="deleteReview(${index})">Delete</button>
    </div>
  `;

  reviewList.appendChild(reviewCard);
}

submitReview.addEventListener("click", () => {
  const name = document.getElementById("userName").value.trim();
  const text = document.getElementById("userReview").value.trim();

  if (name === "" || text === "") {
    alert("Please enter your name and review.");
    return;
  }

  const savedReviews = getSavedReviews();
  savedReviews.push({ name, text });
  saveReviews(savedReviews);

  reviewList.innerHTML = "";
  loadDefaultReviews();
  loadReviews();

  document.getElementById("userName").value = "";
  document.getElementById("userReview").value = "";

  alert("Thank you! Your review has been added.");
});

function editReview(index) {
  const savedReviews = getSavedReviews();
  const selectedReview = savedReviews[index];

  const newName = prompt("Edit your name:", selectedReview.name);
  const newText = prompt("Edit your review:", selectedReview.text);

  if (newName === null || newText === null) {
    return;
  }

  if (newName.trim() === "" || newText.trim() === "") {
    alert("Name and review cannot be empty.");
    return;
  }

  savedReviews[index] = {
    name: newName.trim(),
    text: newText.trim()
  };

  saveReviews(savedReviews);

  reviewList.innerHTML = "";
  loadDefaultReviews();
  loadReviews();

  alert("Review updated successfully.");
}

function deleteReview(index) {
  const confirmDelete = confirm("Are you sure you want to delete this review?");

  if (!confirmDelete) {
    return;
  }

  const savedReviews = getSavedReviews();
  savedReviews.splice(index, 1);
  saveReviews(savedReviews);

  reviewList.innerHTML = "";
  loadDefaultReviews();
  loadReviews();

  alert("Review deleted successfully.");
}

function loadDefaultReviews() {
  reviewList.innerHTML = `
    <div class="review-card">
      <p>“The food feels fresh and homely. A good place for a quick meal with comfortable service.”</p>
      <strong>★★★★★</strong>
      <span>- Local Customer</span>
    </div>

    <div class="review-card">
      <p>“Nice taste, good quantity and friendly staff. Perfect for snacks and daily food.”</p>
      <strong>★★★★★</strong>
      <span>- Happy Visitor</span>
    </div>

    <div class="review-card">
      <p>“Warm ambience and tasty food. The thali and tea are worth trying.”</p>
      <strong>★★★★★</strong>
      <span>- Food Lover</span>
    </div>
  `;
}

loadDefaultReviews();
loadReviews();