const qualificationSelect = document.getElementById("qualification");
const examBoardSelect = document.getElementById("exam-board");
const levelSelect = document.getElementById("level");
const studentForm = document.getElementById("student-form");

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

function populateSelect(selectElement, options, placeholder) {
  selectElement.innerHTML = `<option value="">${placeholder}</option>`;

  options.forEach((text) => {
    const option = document.createElement("option");
    option.value = text;
    option.textContent = text;
    selectElement.appendChild(option);
  });

  selectElement.disabled = false;
}

qualificationSelect.addEventListener("change", () => {
  const qualification = qualificationSelect.value;

  if (!qualification) {
    examBoardSelect.innerHTML = '<option value="">Select qualification first</option>';
    levelSelect.innerHTML = '<option value="">Select qualification first</option>';
    examBoardSelect.disabled = true;
    levelSelect.disabled = true;
    return;
  }

  populateSelect(examBoardSelect, courseOptions[qualification].boards, "Select exam board");
  populateSelect(levelSelect, courseOptions[qualification].levels, "Select tier or level");
});

function showError(field, message) {
  const group = field.closest(".field-group");
  const error = group?.querySelector(".error-message");

  group?.classList.add("has-error");
  if (error) error.textContent = message;
}

function clearError(field) {
  const group = field.closest(".field-group");
  const error = group?.querySelector(".error-message");

  group?.classList.remove("has-error");
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

studentForm.querySelectorAll("input, select, textarea").forEach((field) => {
  field.addEventListener("input", () => clearError(field));
  field.addEventListener("change", () => clearError(field));
});

studentForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const requiredFields = [...studentForm.querySelectorAll("[required]")];
  const valid = requiredFields.every(validateField);

  if (!valid) {
    studentForm.querySelector(".has-error input, .has-error select, .has-error textarea")?.focus();
    return;
  }

  const data = Object.fromEntries(new FormData(studentForm).entries());
  data.consent = document.getElementById("consent").checked;
  data.createdAt = new Date().toISOString();

  localStorage.setItem("mathoraStudent", JSON.stringify(data));
  window.location.href = "test.html";
});
