// State management
const faqState = {
  faqs: [],
  loading: false,
  error: null,
};

// DOM elements
const openFaqsModalBtn = document.getElementById("openFaqsModalBtn");
const closeFaqsModalBtn = document.getElementById("closeFaqsModalBtn");
const faqModal = document.getElementById("faqModal");
const faqModalBody = document.getElementById("faqModalBody");

// Fetch FAQs from JSON file
async function fetchFaqs() {
  faqState.loading = true;
  faqState.error = null;
  renderFaqModal();

  try {
    const response = await fetch("./faqs.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      faqState.error = "No FAQs available";
    } else {
      faqState.faqs = data;
    }
  } catch (error) {
    faqState.error = `Failed to load FAQs: ${error.message}`;
  } finally {
    faqState.loading = false;
    renderFaqModal();
  }
}

// Render FAQ modal content based on state
function renderFaqModal() {
  if (faqState.loading) {
    faqModalBody.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <p>Loading FAQs...</p>
      </div>
    `;
  } else if (faqState.error) {
    faqModalBody.innerHTML = `
      <div class="error-state">
        <i class="fas fa-exclamation-circle"></i>
        <p>${faqState.error}</p>
      </div>
    `;
  } else if (faqState.faqs.length === 0) {
    faqModalBody.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-inbox"></i>
        <p>No FAQs available at the moment.</p>
      </div>
    `;
  } else {
    faqModalBody.innerHTML = faqState.faqs
      .map(
        (faq) => `
      <div class="faq-item" data-id="${faq.id}">
        <div class="faq-question">
          <span>${faq.question}</span>
          <span class="faq-icon">
            <i class="fas fa-chevron-down"></i>
          </span>
        </div>
        <div class="faq-answer">
          <p>${faq.answer}</p>
          <span class="faq-category">${faq.category}</span>
        </div>
      </div>
    `
      )
      .join("");

    // Add click handlers to FAQ items
    document.querySelectorAll(".faq-item").forEach((item) => {
      item.addEventListener("click", () => {
        item.classList.toggle("active");
      });
    });
  }
}

// Open modal
function openFaqModal() {
  faqModal.classList.add("show");
  fetchFaqs();
}

// Close modal
function closeFaqModal() {
  faqModal.classList.remove("show");
}

// Event listeners
openFaqsModalBtn.addEventListener("click", openFaqModal);
closeFaqsModalBtn.addEventListener("click", closeFaqModal);

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  if (event.target === faqModal) {
    closeFaqModal();
  }
});

// Close modal with Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && faqModal.classList.contains("show")) {
    closeFaqModal();
  }
});
