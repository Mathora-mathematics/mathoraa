const storedStudent = localStorage.getItem("mathoraStudent");

if (!storedStudent) {
  window.location.href = "register.html";
}

const student = JSON.parse(storedStudent || "{}");

const questions = [
  { topic: "Number", marks: 2, text: "Calculate 3/4 of 240." },
  { topic: "Percentages", marks: 3, text: "A jacket costs £80 and is reduced by 15%. Find the sale price." },
  { topic: "Algebra", marks: 3, text: "Solve 5x - 7 = 28." },
  { topic: "Indices", marks: 2, text: "Simplify 3a² × 4a⁵." },
  { topic: "Sequences", marks: 3, text: "The nth term of a sequence is 4n - 1. Find the 20th term." },
  { topic: "Ratio", marks: 4, text: "Share £210 in the ratio 2 : 3 : 5." },
  { topic: "Geometry", marks: 3, text: "The angles in a triangle are x°, 2x° and 3x°. Find x." },
  { topic: "Pythagoras", marks: 3, text: "A right-angled triangle has shorter sides 6 cm and 8 cm. Find the hypotenuse." },
  { topic: "Probability", marks: 3, text: "A bag contains 5 red, 3 blue and 2 green counters. Find the probability of choosing a blue counter." },
  { topic: "Statistics", marks: 4, text: "The values are 4, 7, 7, 8, 9, 10, 11. Find the median and the range." },
  { topic: "Graphs", marks: 4, text: "For y = 2x + 3, find y when x = -4." },
  { topic: "Problem solving", marks: 5, text: "A rectangle has length 3 cm greater than its width. Its perimeter is 30 cm. Find its dimensions." }
];

const answers = JSON.parse(localStorage.getItem("mathoraAnswers") || "{}");
let activeWhiteboardQuestion = null;
let drawing = false;
let currentTool = "pen";
let lastPoint = null;

const questionsContainer = document.getElementById("questions-container");
const questionNavigation = document.getElementById("question-navigation");
const progressCount = document.getElementById("progress-count");
const progressBar = document.getElementById("progress-bar");
const autosaveStatus = document.getElementById("autosave-status");
const canvas = document.getElementById("whiteboard-canvas");
const context = canvas.getContext("2d");
const whiteboardModal = document.getElementById("whiteboard-modal");

document.getElementById("student-name-header").textContent = student.fullName || "Student";
document.getElementById("assessment-title").textContent = `${student.qualification || ""} Mathematics Diagnostic`;
document.getElementById("assessment-course").textContent =
  [student.examBoard, student.level].filter(Boolean).join(" • ");

function questionTemplate(question, index) {
  const number = index + 1;
  return `
    <article class="question-card" id="question-${number}">
      <div class="question-card-header">
        <div class="question-number">Q${number}</div>
        <div class="question-meta">
          <span>${question.topic}</span>
          <strong>${question.marks} marks</strong>
        </div>
      </div>

      <div class="question-body">
        <h3>${question.text}</h3>

        <label class="answer-label" for="answer-${number}">Final answer</label>
        <input
          class="answer-input"
          id="answer-${number}"
          name="answer-${number}"
          type="text"
          placeholder="Enter your final answer"
          value="${answers[number]?.answer || ""}"
          data-question="${number}"
        >

        <div class="working-options">
          <div class="working-option">
            <div class="working-option-top">
              <div class="working-icon">↑</div>
              <div>
                <strong>Upload handwritten work</strong>
                <p>Take a clear photograph of your calculations.</p>
              </div>
            </div>
            <label class="upload-button" for="upload-${number}">
              Choose image
              <input
                id="upload-${number}"
                type="file"
                accept="image/*"
                capture="environment"
                data-upload-question="${number}"
              >
            </label>
            <div class="upload-preview" id="upload-preview-${number}"></div>
          </div>

          <div class="working-option">
            <div class="working-option-top">
              <div class="working-icon">✎</div>
              <div>
                <strong>Use digital whiteboard</strong>
                <p>Write your method using a mouse, finger or stylus.</p>
              </div>
            </div>
            <button class="whiteboard-button" type="button" data-whiteboard-question="${number}">
              Open whiteboard
            </button>
            <div class="whiteboard-preview" id="whiteboard-preview-${number}"></div>
          </div>
        </div>
      </div>
    </article>
  `;
}

questionsContainer.innerHTML = questions.map(questionTemplate).join("");

questionNavigation.innerHTML = questions.map((_, index) => `
  <a href="#question-${index + 1}" data-nav-question="${index + 1}">
    <span>${index + 1}</span>
    <small>Question ${index + 1}</small>
  </a>
`).join("");

function saveAnswers() {
  localStorage.setItem("mathoraAnswers", JSON.stringify(answers));
  autosaveStatus.classList.remove("saving");
  autosaveStatus.innerHTML = "<span></span> Saved";
  updateProgress();
}

function markSaving() {
  autosaveStatus.classList.add("saving");
  autosaveStatus.innerHTML = "<span></span> Saving";
}

function updateProgress() {
  const complete = questions.filter((_, index) => {
    const data = answers[index + 1] || {};
    return Boolean(data.answer?.trim() || data.uploadName || data.whiteboard);
  }).length;

  progressCount.textContent = `${complete} of ${questions.length}`;
  progressBar.style.width = `${(complete / questions.length) * 100}%`;

  document.querySelectorAll("[data-nav-question]").forEach((link) => {
    const number = Number(link.dataset.navQuestion);
    const data = answers[number] || {};
    const done = Boolean(data.answer?.trim() || data.uploadName || data.whiteboard);
    link.classList.toggle("complete", done);
  });
}

document.querySelectorAll(".answer-input").forEach((input) => {
  input.addEventListener("input", () => {
    const number = input.dataset.question;
    answers[number] = answers[number] || {};
    answers[number].answer = input.value;
    markSaving();
    clearTimeout(input.saveTimer);
    input.saveTimer = setTimeout(saveAnswers, 450);
  });
});

document.querySelectorAll("[data-upload-question]").forEach((input) => {
  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;

    const number = input.dataset.uploadQuestion;
    answers[number] = answers[number] || {};
    answers[number].uploadName = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      answers[number].uploadPreview = reader.result;
      renderUploadPreview(number);
      saveAnswers();
    };
    reader.readAsDataURL(file);
  });
});

function renderUploadPreview(number) {
  const data = answers[number];
  const preview = document.getElementById(`upload-preview-${number}`);

  if (!data?.uploadPreview) {
    preview.innerHTML = "";
    return;
  }

  preview.innerHTML = `
    <img src="${data.uploadPreview}" alt="Uploaded working preview">
    <span>${data.uploadName || "Uploaded image"}</span>
  `;
}

function renderWhiteboardPreview(number) {
  const data = answers[number];
  const preview = document.getElementById(`whiteboard-preview-${number}`);

  if (!data?.whiteboard) {
    preview.innerHTML = "";
    return;
  }

  preview.innerHTML = `
    <img src="${data.whiteboard}" alt="Whiteboard working preview">
    <span>Whiteboard saved</span>
  `;
}

questions.forEach((_, index) => {
  renderUploadPreview(index + 1);
  renderWhiteboardPreview(index + 1);
});

function openWhiteboard(number) {
  activeWhiteboardQuestion = String(number);
  whiteboardModal.classList.add("open");
  whiteboardModal.setAttribute("aria-hidden", "false");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const existing = answers[activeWhiteboardQuestion]?.whiteboard;
  if (existing) {
    const image = new Image();
    image.onload = () => context.drawImage(image, 0, 0, canvas.width, canvas.height);
    image.src = existing;
  }
}

function closeWhiteboard() {
  whiteboardModal.classList.remove("open");
  whiteboardModal.setAttribute("aria-hidden", "true");
  activeWhiteboardQuestion = null;
}

document.querySelectorAll("[data-whiteboard-question]").forEach((button) => {
  button.addEventListener("click", () => openWhiteboard(button.dataset.whiteboardQuestion));
});

document.querySelectorAll("[data-close-modal]").forEach((element) => {
  element.addEventListener("click", closeWhiteboard);
});

document.querySelectorAll("[data-tool]").forEach((button) => {
  button.addEventListener("click", () => {
    currentTool = button.dataset.tool;
    document.querySelectorAll("[data-tool]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
});

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  const source = event.touches ? event.touches[0] : event;
  return {
    x: (source.clientX - rect.left) * (canvas.width / rect.width),
    y: (source.clientY - rect.top) * (canvas.height / rect.height)
  };
}

function startDrawing(event) {
  event.preventDefault();
  drawing = true;
  lastPoint = canvasPoint(event);
}

function draw(event) {
  if (!drawing) return;
  event.preventDefault();

  const point = canvasPoint(event);
  context.beginPath();
  context.moveTo(lastPoint.x, lastPoint.y);
  context.lineTo(point.x, point.y);
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineWidth = Number(document.getElementById("brush-size").value);
  context.strokeStyle = currentTool === "eraser" ? "#ffffff" : "#07111f";
  context.stroke();
  lastPoint = point;
}

function stopDrawing() {
  drawing = false;
  lastPoint = null;
}

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
window.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("touchstart", startDrawing, { passive: false });
canvas.addEventListener("touchmove", draw, { passive: false });
window.addEventListener("touchend", stopDrawing);

document.getElementById("clear-board").addEventListener("click", () => {
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
});

document.getElementById("save-whiteboard").addEventListener("click", () => {
  if (!activeWhiteboardQuestion) return;

  answers[activeWhiteboardQuestion] = answers[activeWhiteboardQuestion] || {};
  answers[activeWhiteboardQuestion].whiteboard = canvas.toDataURL("image/png");
  renderWhiteboardPreview(activeWhiteboardQuestion);
  saveAnswers();
  closeWhiteboard();
});

document.getElementById("save-progress-button").addEventListener("click", () => {
  saveAnswers();
  const button = document.getElementById("save-progress-button");
  const oldText = button.textContent;
  button.textContent = "Saved";
  setTimeout(() => button.textContent = oldText, 1200);
});

document.getElementById("assessment-form").addEventListener("submit", (event) => {
  event.preventDefault();
  saveAnswers();

  const submission = {
    student,
    answers,
    submittedAt: new Date().toISOString()
  };

  const file = new Blob([JSON.stringify(submission, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = `mathora-submission-${(student.fullName || "student").replace(/\s+/g, "-").toLowerCase()}.json`;
  link.click();
  URL.revokeObjectURL(url);

  const successModal = document.getElementById("success-modal");
  successModal.classList.add("open");
  successModal.setAttribute("aria-hidden", "false");
});

updateProgress();
