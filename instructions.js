document.addEventListener("DOMContentLoaded", () => {
  const raw = localStorage.getItem("mathoraStudent");
  if (!raw) { window.location.replace("./register.html"); return; }
  const student = JSON.parse(raw);
  const test = window.MATHORA_TESTS?.[student.testKey];
  if (!test) { alert("No matching assessment was found."); window.location.replace("./register.html"); return; }

  document.getElementById("instructionTitle").textContent = test.title;
  document.getElementById("instructionPath").textContent =
    `${student.qualification} • ${student.examBoard} • ${student.level}`;
  document.getElementById("summaryTitle").textContent = test.title;
  document.getElementById("summaryTime").textContent = `${test.durationMinutes} minutes`;
  document.getElementById("timeGuidance").textContent =
    `Set aside at least ${test.durationMinutes + 10} minutes. The assessment time limit is ${test.durationMinutes} minutes.`;

  const checkbox = document.getElementById("instructionConfirm");
  const button = document.getElementById("beginAssessment");
  checkbox.addEventListener("change", () => { button.disabled = !checkbox.checked; });
  button.addEventListener("click", () => {
    student.assessmentStartedAt = new Date().toISOString();
    localStorage.setItem("mathoraStudent", JSON.stringify(student));
    localStorage.removeItem("mathoraAssessmentState");
    window.location.href = "./test.html";
  });
});