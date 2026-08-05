const qualificationSelect = document.querySelector("#qualification");
const examBoardSelect = document.querySelector("#exam-board");
const levelSelect = document.querySelector("#level");
const form = document.querySelector("#student-form");

const courseOptions = {
  GCSE: {
    boards: ["AQA", "Pearson Edexcel", "OCR", "WJEC"],
    levels: ["Foundation", "Higher"]
  },
  IGCSE: {
    boards: ["Pearson Edexcel", "Cambridge International"],
    levels: ["Foundation", "Higher"]
  },
  IB: {
    boards: ["International Baccalaureate"],
    levels: ["Mathematics AA SL", "Mathematics AA HL", "Mathematics AI SL", "Mathematics AI HL"]
  }
};

function populateSelect(select, options, placeholder) {
  select.innerHTML = `<option value="">${placeholder}</option>`;

  options.forEach((option) => {
    const element = document.createElement("option");
    element.value = option;
    element.textContent = option;
    select.appendChild(element);
  });

  select.disabled = false;
}

qualificationSelect.addEventListener("change", () => {
  const selected = qualificationSelect.value;

  if (!selected) {
    examBoardSelect.innerHTML = '<option value="">Select qualification first</option>';
    levelSelect.innerHTML = '<option value="">Select qualification first</option>';
    examBoardSelect.disabled = true;
    levelSelect.disabled = true;
    return;
  }

  populateSelect(examBoardSelect, courseOptions[selected].boards, "Select exam board");
  populateSelect(levelSelect, courseOptions[selected].levels, "Select tier or level");
});

function showError(field, message) {
  const group = field.closest(".field-group");
  const error = group.querySelector(".error-message");

  group.classList.add("has-error");
  if (error) error.textContent = message;
}

function clearError(field) {
  const group = field.closest(".field-group");
  const error = group.querySelector(".error-message");

  group.classList.remove("has-error");
  if (error) error.textContent = "";
}

function validateField(field) {
  clearError(field);

  if (field.type === "checkbox" && field.required && !field.checked) {
    showError(field, "You must agree before continuing.");
    return false;
  }

  if (field.required && !field.value.trim()) {
    showError(field, "This field is required.");
    return false;
  }

  if (field.type === "email" && field.value && !field.validity.valid) {
    showError(field, "Enter a valid email address.");
    return false;
  }

  return true;
}

form.querySelectorAll("input, select, textarea").forEach((field) => {
  field.addEventListener("input", () => clearError(field));
  field.addEventListener("change", () => clearError(field));
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const requiredFields = [...form.querySelectorAll("[required]")];
  const isValid = requiredFields.every(validateField);

  if (!isValid) {
    const firstError = form.querySelector(".has-error input, .has-error select, .has-error textarea");
    if (firstError) firstError.focus();
    return;
  }

  const formData = new FormData(form);
  const studentData = Object.fromEntries(formData.entries());
  studentData.consent = document.querySelector("#consent").checked;
  studentData.createdAt = new Date().toISOString();

  localStorage.setItem("mathoraStudent", JSON.stringify(studentData));
  window.location.href = "test.html";
});
