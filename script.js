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

function loadReviews() {
  const savedReviews = JSON.parse(localStorage.getItem("restaurantReviews")) || [];

  savedReviews.forEach((review) => {
    addReviewToPage(review.name, review.text);
  });
}

function addReviewToPage(name, text) {
  const reviewCard = document.createElement("div");
  reviewCard.className = "review-card";

  reviewCard.innerHTML = `
    <p>“${text}”</p>
    <strong>★★★★★</strong>
    <span>- ${name}</span>
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

  addReviewToPage(name, text);

  const savedReviews = JSON.parse(localStorage.getItem("restaurantReviews")) || [];
  savedReviews.push({ name, text });
  localStorage.setItem("restaurantReviews", JSON.stringify(savedReviews));

  document.getElementById("userName").value = "";
  document.getElementById("userReview").value = "";

  alert("Thank you! Your review has been added.");
});

loadReviews();