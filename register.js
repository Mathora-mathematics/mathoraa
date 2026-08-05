document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("student-form");
  const qualification = document.getElementById("qualification");
  const examBoard = document.getElementById("exam-board");
  const level = document.getElementById("level");
  const continueButton = document.getElementById("continue-button");

  if (!form || !qualification || !examBoard || !level) {
    console.error("Mathora registration form could not initialise.");
    return;
  }

  const options = {
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

  function resetSelect(select, message) {
    select.innerHTML = `<option value="">${message}</option>`;
    select.value = "";
  }

  function fillSelect(select, values, message) {
    resetSelect(select, message);

    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  qualification.addEventListener("change", () => {
    const chosen = qualification.value;

    clearError(qualification);
    clearError(examBoard);
    clearError(level);

    if (!chosen || !options[chosen]) {
      resetSelect(examBoard, "Select qualification first");
      resetSelect(level, "Select qualification first");
      return;
    }

    fillSelect(examBoard, options[chosen].boards, "Select exam board");
    fillSelect(level, options[chosen].levels, "Select tier or level");
  });

  function getGroup(field) {
    return field.closest(".field-group");
  }

  function showError(field, message) {
    const group = getGroup(field);
    if (!group) return;

    group.classList.add("has-error");
    const error = group.querySelector(".error-message");
    if (error) error.textContent = message;
  }

  function clearError(field) {
    const group = getGroup(field);
    if (!group) return;

    group.classList.remove("has-error");
    const error = group.querySelector(".error-message");
    if (error) error.textContent = "";
  }

  function valid(field) {
    clearError(field);

    if (field.type === "checkbox") {
      if (!field.checked) {
        showError(field, "Please confirm before continuing.");
        return false;
      }
      return true;
    }

    if (field.required && !field.value.trim()) {
      showError(field, "This field is required.");
      return false;
    }

    if (field.type === "email" && !field.checkValidity()) {
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

    const required = [...form.querySelectorAll("[required]")];
    let allValid = true;

    required.forEach((field) => {
      if (!valid(field)) allValid = false;
    });

    if (!allValid) {
      form.querySelector(".has-error input, .has-error select, .has-error textarea")?.focus();
      return;
    }

    const formData = new FormData(form);
    const student = {
      fullName: formData.get("fullName")?.trim() || "",
      email: formData.get("email")?.trim() || "",
      phone: formData.get("phone")?.trim() || "",
      yearGroup: formData.get("yearGroup")?.trim() || "",
      qualification: formData.get("qualification") || "",
      examBoard: formData.get("examBoard") || "",
      level: formData.get("level") || "",
      currentGrade: formData.get("currentGrade")?.trim() || "",
      targetGrade: formData.get("targetGrade")?.trim() || "",
      notes: formData.get("notes")?.trim() || "",
      consent: document.getElementById("consent").checked,
      createdAt: new Date().toISOString()
    };

    try {
      localStorage.setItem("mathoraStudent", JSON.stringify(student));
    } catch (error) {
      console.error("Could not save student details:", error);
      alert("Your browser blocked local storage. Please allow site storage and try again.");
      return;
    }

    continueButton.classList.add("loading");
    continueButton.disabled = true;
    continueButton.querySelector(".button-label").textContent = "Opening assessment";

    window.location.assign("test.html");
  });
});
