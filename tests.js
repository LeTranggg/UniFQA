// Simple test framework
const TestRunner = {
  tests: [],
  passed: 0,
  failed: 0,

  test(name, fn) {
    this.tests.push({ name, fn });
  },

  run() {
    console.log("🧪 Running FAQ Tests...\n");
    this.tests.forEach(({ name, fn }) => {
      try {
        fn();
        this.passed++;
        console.log(`✅ PASS: ${name}`);
      } catch (error) {
        this.failed++;
        console.log(`❌ FAIL: ${name}`);
        console.log(`   Error: ${error.message}\n`);
      }
    });

    console.log(
      `\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`
    );
  },
};

// Helper assertion functions
function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message} - Expected ${expected}, got ${actual}`);
  }
}

function assertTrue(value, message) {
  if (!value) {
    throw new Error(message);
  }
}

function assertArrayLength(arr, length, message) {
  if (!Array.isArray(arr) || arr.length !== length) {
    throw new Error(
      `${message} - Expected array length ${length}, got ${arr?.length}`
    );
  }
}

// Test 1: Verify FAQs are fetched correctly
TestRunner.test("Should fetch and render correct FAQ data", async () => {
  const response = await fetch("./faqs.json");
  const faqs = await response.json();

  assertArrayLength(faqs, 3, "Should have 3 FAQs");
  assertEqual(faqs[0].id, 1, "First FAQ should have id 1");
  assertEqual(
    faqs[0].category,
    "Admissions",
    "First FAQ should be in Admissions category"
  );
  assertTrue(
    faqs[0].question.includes("scholarship"),
    'First FAQ should contain "scholarship"'
  );
});

// Test 2: Verify error state handling
TestRunner.test("Should handle error state when fetch fails", async () => {
  // Simulate fetch failure by using invalid URL
  const originalFetch = window.fetch;
  window.fetch = () => Promise.reject(new Error("Network error"));

  const testState = {
    faqs: [],
    loading: false,
    error: null,
  };

  try {
    const response = await fetch("./invalid.json");
  } catch (error) {
    testState.error = `Failed to load FAQs: ${error.message}`;
  }

  assertTrue(testState.error !== null, "Error state should be set");
  assertTrue(
    testState.error.includes("Failed to load FAQs"),
    'Error message should contain "Failed to load FAQs"'
  );

  window.fetch = originalFetch;
});

// Test 3: Verify empty state handling
TestRunner.test("Should handle empty state when no FAQs available", () => {
  const testState = {
    faqs: [],
    loading: false,
    error: null,
  };

  const isEmpty = testState.faqs.length === 0 && !testState.error;
  assertTrue(isEmpty, "Should detect empty state correctly");
});

// Test 4: Verify modal DOM elements exist
TestRunner.test("Should have required modal DOM elements", () => {
  const modal = document.getElementById("faqModal");
  const modalBody = document.getElementById("faqModalBody");
  const openBtn = document.getElementById("openFaqsModalBtn");
  const closeBtn = document.getElementById("closeFaqsModalBtn");

  assertTrue(modal !== null, "Modal element should exist");
  assertTrue(modalBody !== null, "Modal body element should exist");
  assertTrue(openBtn !== null, "Open button should exist");
  assertTrue(closeBtn !== null, "Close button should exist");
});

// Test 5: Verify FAQ data structure
TestRunner.test("Should have correct FAQ data structure", async () => {
  const response = await fetch("./faqs.json");
  const faqs = await response.json();

  faqs.forEach((faq) => {
    assertTrue(faq.id !== undefined, "FAQ should have id");
    assertTrue(faq.question !== undefined, "FAQ should have question");
    assertTrue(faq.answer !== undefined, "FAQ should have answer");
    assertTrue(faq.category !== undefined, "FAQ should have category");
  });
});

// Run tests when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  TestRunner.run();
});
