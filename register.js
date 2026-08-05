document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("studentForm");
  const qualification = document.getElementById("qualification");
  const examBoard = document.getElementById("examBoard");
  const level = document.getElementById("level");

  const pathways = {
    GCSE: {
      "AQA": ["Foundation","Higher"],
      "Pearson Edexcel": ["Foundation","Higher"],
      "OCR": ["Foundation","Higher"],
      "WJEC": ["Foundation","Higher"]
    },
    IGCSE: {
      "Pearson Edexcel": ["Foundation","Higher"],
      "Cambridge International": ["Core","Extended"]
    },
    IB: {
      "International Baccalaureate": ["Mathematics AA SL","Mathematics AA HL","Mathematics AI SL","Mathematics AI HL"]
    }
  };

  function fill(select, items, placeholder) {
    select.innerHTML = `<option value="">${placeholder}</option>`;
    items.forEach(item => {
      const option = document.createElement("option");
      option.value = item;
      option.textContent = item;
      select.appendChild(option);
    });
  }

  qualification.addEventListener("change", () => {
    const q = qualification.value;
    fill(examBoard, q ? Object.keys(pathways[q]) : [], q ? "Select exam board" : "Select qualification first");
    fill(level, [], "Select exam board first");
  });

  examBoard.addEventListener("change", () => {
    const q = qualification.value;
    const b = examBoard.value;
    fill(level, q && b ? pathways[q][b] : [], q && b ? "Select tier or level" : "Select exam board first");
  });

  function validate(field) {
    const wrapper = field.closest(".field");
    const error = wrapper?.querySelector("small");
    wrapper?.classList.remove("invalid");
    if (error) error.textContent = "";

    if (field.type === "checkbox" && !field.checked) {
      wrapper?.classList.add("invalid");
      if (error) error.textContent = "Please confirm before continuing.";
      return false;
    }
    if (field.required && !String(field.value).trim()) {
      wrapper?.classList.add("invalid");
      if (error) error.textContent = "This field is required.";
      return false;
    }
    if (field.type === "email" && !field.checkValidity()) {
      wrapper?.classList.add("invalid");
      if (error) error.textContent = "Enter a valid email address.";
      return false;
    }
    return true;
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    const required = [...form.querySelectorAll("[required]")];
    const valid = required.map(validate).every(Boolean);
    if (!valid) {
      form.querySelector(".invalid input,.invalid select")?.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    const key = `${data.qualification}|${data.examBoard}|${data.level}`;

    const student = {
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      yearGroup: data.yearGroup.trim(),
      targetGrade: data.targetGrade.trim(),
      currentGrade: (data.currentGrade || "").trim(),
      notes: (data.notes || "").trim(),
      qualification: data.qualification,
      examBoard: data.examBoard,
      level: data.level,
      testKey: key,
      startedAt: new Date().toISOString()
    };

    localStorage.setItem("mathoraStudent", JSON.stringify(student));
    localStorage.removeItem("mathoraAssessmentState");
    window.location.href = "./instructions.html";
  });
});
