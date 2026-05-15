const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const exploreBtn = document.getElementById("exploreBtn");
const moreMenu = document.getElementById("moreMenu");
const submitReview = document.getElementById("submitReview");
const reviewList = document.getElementById("reviewList");
const stars = document.querySelectorAll(".star");
const reviewMessage = document.getElementById("reviewMessage");

let selectedRating = 0;

/* ==========================
   NAVBAR MENU
========================== */

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");

  menuBtn.textContent =
    navLinks.classList.contains("active")
      ? "×"
      : "☰";
});

document.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    menuBtn.textContent = "☰";
  });
});

/* ==========================
   EXPLORE MORE MENU
========================== */

exploreBtn.addEventListener("click", () => {
  moreMenu.classList.toggle("show");

  exploreBtn.textContent =
    moreMenu.classList.contains("show")
      ? "Show Less Menu"
      : "Explore More Menu";
});

/* ==========================
   STAR RATING
========================== */

stars.forEach((star) => {
  star.addEventListener("click", () => {
    selectedRating = Number(
      star.dataset.value
    );

    stars.forEach((s) =>
      s.classList.remove("active")
    );

    for (
      let i = 0;
      i < selectedRating;
      i++
    ) {
      stars[i].classList.add(
        "active"
      );
    }

    document.getElementById(
      "ratingText"
    ).textContent =
      `Selected Rating: ${selectedRating}/5`;
  });
});

/* ==========================
   REVIEW FEEDBACK MESSAGE
========================== */

function showReviewMessage(rating) {
  reviewMessage.style.display =
    "block";

  reviewMessage.classList.remove(
    "good-review",
    "mid-review",
    "bad-review"
  );

  if (rating >= 4) {
    reviewMessage.classList.add(
      "good-review"
    );

    reviewMessage.innerHTML = `
      🥰✨ <strong>Thank you so much!</strong><br>
      We are really happy that you enjoyed your experience at 
      <b>Spice & Spark Hut</b> 💛<br><br>
      Hope to serve you again soon 🍽️
    `;
  }

  else if (rating === 3) {
    reviewMessage.classList.add(
      "mid-review"
    );

    reviewMessage.innerHTML = `
      😊 <strong>Thank you for your feedback!</strong><br>
      We are glad you visited us 💫<br><br>
      We'll work harder to make your next experience even better.
    `;
  }

  else {
    reviewMessage.classList.add(
      "bad-review"
    );

    reviewMessage.innerHTML = `
      😔 <strong>We're really sorry.</strong><br>
      Your experience matters a lot to us 💛<br><br>
      Thank you for your honest feedback — we will definitely improve and hope you visit us again 🙏
    `;
  }

  reviewMessage.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

/* ==========================
   LOCAL STORAGE
========================== */

function getSavedReviews() {
  return (
    JSON.parse(
      localStorage.getItem(
        "restaurantReviews"
      )
    ) || []
  );
}

function saveReviews(reviews) {
  localStorage.setItem(
    "restaurantReviews",
    JSON.stringify(reviews)
  );
}

/* ==========================
   ADD REVIEW TO PAGE
========================== */

function addReviewToPage(
  name,
  text,
  rating,
  index
) {
  const reviewCard =
    document.createElement("div");

  reviewCard.className =
    "review-card";

  reviewCard.innerHTML = `
    <p>“${text}”</p>

    <strong>
      ${"★".repeat(rating)}
      ${"☆".repeat(5 - rating)}
    </strong>

    <span>- ${name}</span>

    <div class="review-actions">
      <button onclick="editReview(${index})">
        Edit
      </button>

      <button onclick="deleteReview(${index})">
        Delete
      </button>
    </div>
  `;

  reviewList.appendChild(
    reviewCard
  );
}

/* ==========================
   DEFAULT REVIEWS
========================== */

function loadDefaultReviews() {
  const defaultReviews = `
    <div class="review-card">
      <p>
      “The food feels fresh and homely. 
      A good place for a quick meal with comfortable service.”
      </p>

      <strong>★★★★★</strong>

      <span>- Local Customer</span>
    </div>

    <div class="review-card">
      <p>
      “Nice taste, good quantity and friendly staff.
      Perfect for snacks and daily food.”
      </p>

      <strong>★★★★★</strong>

      <span>- Happy Visitor</span>
    </div>

    <div class="review-card">
      <p>
      “Warm ambience and tasty food.
      The thali and tea are worth trying.”
      </p>

      <strong>★★★★★</strong>

      <span>- Food Lover</span>
    </div>
  `;

  reviewList.innerHTML =
    defaultReviews;
}

/* ==========================
   LOAD SAVED REVIEWS
========================== */

function loadReviews() {
  const savedReviews =
    getSavedReviews();

  savedReviews.forEach(
    (review, index) => {
      addReviewToPage(
        review.name,
        review.text,
        review.rating,
        index
      );
    }
  );
}

/* ==========================
   SUBMIT REVIEW
========================== */

submitReview.addEventListener(
  "click",
  () => {
    const name =
      document
        .getElementById(
          "userName"
        )
        .value.trim();

    const text =
      document
        .getElementById(
          "userReview"
        )
        .value.trim();

    if (
      name === "" ||
      text === ""
    ) {
      alert(
        "Please fill all fields."
      );
      return;
    }

    if (
      selectedRating === 0
    ) {
      alert(
        "Please select a rating."
      );
      return;
    }

    const reviews =
      getSavedReviews();

    reviews.push({
      name,
      text,
      rating:
        selectedRating
    });

    saveReviews(reviews);

    reviewList.innerHTML = "";

    loadDefaultReviews();
    loadReviews();

    showReviewMessage(
      selectedRating
    );

    document.getElementById(
      "userName"
    ).value = "";

    document.getElementById(
      "userReview"
    ).value = "";

    stars.forEach((s) =>
      s.classList.remove(
        "active"
      )
    );

    selectedRating = 0;

    document.getElementById(
      "ratingText"
    ).textContent =
      "No rating selected";
  }
);

/* ==========================
   DELETE REVIEW
========================== */

function deleteReview(index) {
  const confirmDelete =
    confirm(
      "Are you sure you want to delete this review?"
    );

  if (!confirmDelete)
    return;

  const reviews =
    getSavedReviews();

  reviews.splice(
    index,
    1
  );

  saveReviews(reviews);

  reviewList.innerHTML = "";

  loadDefaultReviews();
  loadReviews();
}

/* ==========================
   EDIT REVIEW
========================== */

function editReview(index) {
  const reviews =
    getSavedReviews();

  const review =
    reviews[index];

  const newName =
    prompt(
      "Edit your name:",
      review.name
    );

  const newText =
    prompt(
      "Edit your review:",
      review.text
    );

  const newRating =
    prompt(
      "Edit rating (1-5):",
      review.rating
    );

  if (
    newName === null ||
    newText === null ||
    newRating === null
  ) {
    return;
  }

  const ratingNumber =
    Number(newRating);

  if (
    ratingNumber < 1 ||
    ratingNumber > 5
  ) {
    alert(
      "Rating must be between 1 and 5."
    );
    return;
  }

  reviews[index] = {
    name:
      newName.trim(),
    text:
      newText.trim(),
    rating:
      ratingNumber
  };

  saveReviews(reviews);

  reviewList.innerHTML = "";

  loadDefaultReviews();
  loadReviews();

  alert(
    "Review updated successfully."
  );
}

/* ==========================
   INITIAL LOAD
========================== */

loadDefaultReviews();
loadReviews();