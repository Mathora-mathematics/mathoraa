document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("student-form");
  const qualification = document.getElementById("qualification");
  const examBoard = document.getElementById("examBoard");
  const level = document.getElementById("level");
  const continueButton = document.getElementById("continueButton");

  const choices = {
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

  function fill(select, values, placeholder) {
    select.innerHTML = `<option value="">${placeholder}</option>`;
    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  qualification.addEventListener("change", () => {
    const selected = qualification.value;
    clearError(qualification);
    clearError(examBoard);
    clearError(level);

    if (!selected || !choices[selected]) {
      fill(examBoard, [], "Select qualification first");
      fill(level, [], "Select qualification first");
      return;
    }

    fill(examBoard, choices[selected].boards, "Select exam board");
    fill(level, choices[selected].levels, "Select tier or level");
  });

  function groupOf(field) {
    return field.closest(".field");
  }

  function setError(field, message) {
    const group = groupOf(field);
    if (!group) return;
    group.classList.add("invalid");
    const error = group.querySelector(".error");
    if (error) error.textContent = message;
  }

  function clearError(field) {
    const group = groupOf(field);
    if (!group) return;
    group.classList.remove("invalid");
    const error = group.querySelector(".error");
    if (error) error.textContent = "";
  }

  function validate(field) {
    clearError(field);

    if (field.type === "checkbox" && !field.checked) {
      setError(field, "Please confirm before continuing.");
      return false;
    }

    if (field.required && !field.value.trim()) {
      setError(field, "This field is required.");
      return false;
    }

    if (field.type === "email" && !field.checkValidity()) {
      setError(field, "Enter a valid email address.");
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
    let okay = true;

    required.forEach((field) => {
      if (!validate(field)) okay = false;
    });

    if (!okay) {
      form.querySelector(".invalid input, .invalid select, .invalid textarea")?.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());

    const student = {
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      yearGroup: data.yearGroup.trim(),
      qualification: data.qualification,
      examBoard: data.examBoard,
      level: data.level,
      currentGrade: data.currentGrade.trim(),
      targetGrade: data.targetGrade.trim(),
      notes: data.notes.trim(),
      consent: document.getElementById("consent").checked,
      createdAt: new Date().toISOString()
    };

    try {
      localStorage.setItem("mathoraStudent", JSON.stringify(student));
    } catch (error) {
      alert("Your browser blocked site storage. Please enable it and try again.");
      return;
    }

    continueButton.disabled = true;
    continueButton.querySelector("span").textContent = "Opening assessment";
    window.location.assign("./test.html");
  });
});
