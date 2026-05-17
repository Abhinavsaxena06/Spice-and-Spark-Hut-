const API_URL = "http://localhost:5000/api/reviews";

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const submitReview = document.getElementById("submitReview");
const reviewList = document.getElementById("reviewList");
const stars = document.querySelectorAll(".star");
const reviewMessage = document.getElementById("reviewMessage");
const improvementBox = document.getElementById("improvementBox");
const improvementText = document.getElementById("improvementText");
const submitImprovement = document.getElementById("submitImprovement");

let selectedRating = 0;

/* =========================
   REVIEW OWNER KEY
========================= */

function getReviewKey() {
  let key = localStorage.getItem("reviewKey");

  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem("reviewKey", key);
  }

  return key;
}

/* =========================
   MOBILE NAVBAR
========================= */

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

/* =========================
   STAR RATING
========================= */

stars.forEach((star) => {
  star.addEventListener("click", () => {
    selectedRating = Number(star.dataset.value);

    stars.forEach((s) =>
      s.classList.remove("active")
    );

    for (let i = 0; i < selectedRating; i++) {
      stars[i].classList.add("active");
    }

    document.getElementById(
      "ratingText"
    ).textContent =
      `Selected Rating: ${selectedRating}/5`;
  });
});

/* =========================
   REVIEW FEEDBACK MESSAGE
========================= */

function showReviewMessage(rating) {
  reviewMessage.style.display = "block";

  reviewMessage.classList.remove(
    "good-review",
    "mid-review",
    "bad-review"
  );

  improvementBox.style.display = "none";

  if (rating >= 4) {
    reviewMessage.classList.add("good-review");

    reviewMessage.innerHTML = `
      <div class="message-gif">
        🥰🍽️✨
      </div>

      <strong>
        Thank you so much!
      </strong>
      <br>

      We are really happy that you enjoyed your experience at 
      <b>Spice & Spark Hut</b> 💛
      <br><br>

      Your love means a lot to us.
      Hope to serve you again soon!
    `;
  }

  else if (rating === 3) {
    reviewMessage.classList.add("mid-review");

    reviewMessage.innerHTML = `
      <div class="message-gif">
        😊☕
      </div>

      <strong>
        Thank you for your feedback!
      </strong>
      <br>

      We are glad you visited us 💫
      <br><br>

      We'll keep improving to make
      your next experience even better.
    `;
  }

  else {
    reviewMessage.classList.add("bad-review");

    reviewMessage.innerHTML = `
      <div class="message-gif">
        😔🙏
      </div>

      <strong>
        We're really sorry.
      </strong>
      <br>

      Your experience matters a lot to us 💛
      <br><br>

      Please tell us what we can improve
      so we can serve you better next time.
    `;

    improvementBox.style.display = "block";
  }

  /* AUTO SCROLL TO MESSAGE */

  setTimeout(() => {
    reviewMessage.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }, 200);
}

/* =========================
   FETCH REVIEWS
========================= */

async function fetchReviews() {
  try {
    const response = await fetch(API_URL);
    const reviews = await response.json();

    reviewList.innerHTML = "";

    reviews.forEach((review) => {
      addReviewToPage(review);
    });
  } catch (error) {
    console.error(
      "Error fetching reviews:",
      error
    );
  }
}

/* =========================
   ADD REVIEW CARD
========================= */

function addReviewToPage(review) {
  const userReviewKey =
    getReviewKey();

  const isOwnReview =
    review.reviewKey ===
    userReviewKey;

  const reviewCard =
    document.createElement("div");

  reviewCard.className =
    "review-card";

  reviewCard.innerHTML = `
    <p>
      “${review.text}”
    </p>

    <strong>
      ${"★".repeat(review.rating)}
      ${"☆".repeat(5 - review.rating)}
    </strong>

    <span>
      - ${review.name}
    </span>

    <div class="review-actions">

      ${
        isOwnReview
          ? `
          <button
            onclick="editReview(
              '${review._id}',
              '${review.name}',
              '${review.text}',
              ${review.rating}
            )"
          >
            Edit
          </button>
        `
          : ""
      }

      ${
        isOwnReview
          ? `
          <button
            onclick="deleteOwnReview(
              '${review._id}'
            )"
          >
            Delete
          </button>
        `
          : ""
      }

      <button
        onclick="ownerDeleteReview(
          '${review._id}'
        )"
      >
        Owner Delete
      </button>

    </div>
  `;

  reviewList.appendChild(reviewCard);
}

/* =========================
   SUBMIT REVIEW
========================= */

submitReview.addEventListener(
  "click",
  async () => {
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

    if (!name || !text) {
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

    try {
      const response =
        await fetch(
          API_URL,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
              name,
              text,
              rating:
                selectedRating,
              reviewKey:
                getReviewKey()
            })
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to submit review."
        );
        return;
      }

      showReviewMessage(
        selectedRating
      );

      document.getElementById(
        "userName"
      ).value = "";

      document.getElementById(
        "userReview"
      ).value = "";

      document.getElementById(
        "ratingText"
      ).textContent =
        "No rating selected";

      stars.forEach((s) =>
        s.classList.remove(
          "active"
        )
      );

      selectedRating = 0;

      fetchReviews();
    } catch (error) {
      console.error(
        "Submit error:",
        error
      );

      alert(
        "Backend is not connected. Make sure npm run dev is running."
      );
    }
  }
);

/* =========================
   EDIT REVIEW
========================= */

async function editReview(
  id,
  oldName,
  oldText,
  oldRating
) {
  const name = prompt(
    "Edit your name:",
    oldName
  );

  const text = prompt(
    "Edit your review:",
    oldText
  );

  const rating = prompt(
    "Edit rating (1-5):",
    oldRating
  );

  if (
    !name ||
    !text ||
    Number(rating) < 1 ||
    Number(rating) > 5
  ) {
    alert(
      "Invalid review details."
    );
    return;
  }

  const response =
    await fetch(
      `${API_URL}/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          name,
          text,
          rating:
            Number(rating),
          reviewKey:
            getReviewKey()
        })
      }
    );

  const data =
    await response.json();

  if (!response.ok) {
    alert(data.message);
    return;
  }

  alert(
    "Review updated successfully."
  );

  fetchReviews();
}

/* =========================
   DELETE OWN REVIEW
========================= */

async function deleteOwnReview(
  id
) {
  const confirmDelete =
    confirm(
      "Delete your review?"
    );

  if (!confirmDelete)
    return;

  const response =
    await fetch(
      `${API_URL}/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          reviewKey:
            getReviewKey()
        })
      }
    );

  const data =
    await response.json();

  if (!response.ok) {
    alert(data.message);
    return;
  }

  alert(
    "Review deleted successfully."
  );

  fetchReviews();
}

/* =========================
   OWNER DELETE
========================= */

async function ownerDeleteReview(
  id
) {
  const ownerPassword =
    document
      .getElementById(
        "ownerPassword"
      )
      ?.value.trim();

  if (!ownerPassword) {
    alert(
      "Enter owner password first."
    );
    return;
  }

  const confirmDelete =
    confirm(
      "Owner: delete this review?"
    );

  if (!confirmDelete)
    return;

  const response =
    await fetch(
      `${API_URL}/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          ownerSecret:
            ownerPassword
        })
      }
    );

  const data =
    await response.json();

  if (!response.ok) {
    alert(data.message);
    return;
  }

  alert(
    "Owner deleted the review."
  );

  fetchReviews();
}

/* =========================
   IMPROVEMENT SUGGESTION
========================= */

submitImprovement.addEventListener(
  "click",
  () => {
    const suggestion =
      improvementText.value.trim();

    if (!suggestion) {
      alert(
        "Please write your improvement suggestion."
      );
      return;
    }

    alert(
      "Thank you for your suggestion. We will work on it."
    );

    improvementText.value =
      "";

    improvementBox.style.display =
      "none";
  }
);

/* =========================
   INITIAL LOAD
========================= */

fetchReviews();