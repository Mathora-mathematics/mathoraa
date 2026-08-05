const storedStudent = localStorage.getItem("mathoraStudent");

if (!storedStudent) {
  window.location.href = "register.html";
} else {
  const student = JSON.parse(storedStudent);

  document.querySelector("#welcome-title").textContent =
    `Welcome, ${student.fullName.split(" ")[0]}.`;

  document.querySelector("#course-summary").textContent =
    `You selected ${student.qualification} Mathematics, ${student.examBoard}, ${student.level}.`;

  const details = document.querySelector("#saved-details");
  details.innerHTML = `
    <div><span>Email</span><strong>${student.email}</strong></div>
    <div><span>WhatsApp</span><strong>${student.phone}</strong></div>
    <div><span>Current level</span><strong>${student.currentGrade || "Not provided"}</strong></div>
    <div><span>Target</span><strong>${student.targetGrade}</strong></div>
  `;
}
