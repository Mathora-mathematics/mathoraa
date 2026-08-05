document.addEventListener("DOMContentLoaded", () => {
  const storedStudent = localStorage.getItem("mathoraStudent");

  if (!storedStudent) {
    window.location.replace("./register.html");
    return;
  }

  const student = JSON.parse(storedStudent);
  const client = window.mathoraSupabase;

  const questionData = [
    { topic: "Number", marks: 2, text: "Calculate three quarters of 240." },
    { topic: "Percentages", marks: 3, text: "A jacket costs £80 and is reduced by 15%. Find the sale price." },
    { topic: "Algebra", marks: 3, text: "Solve 5x − 7 = 28." },
    { topic: "Indices", marks: 2, text: "Simplify 3a² × 4a⁵." },
    { topic: "Sequences", marks: 3, text: "The nth term of a sequence is 4n − 1. Find the 20th term." },
    { topic: "Ratio", marks: 4, text: "Share £210 in the ratio 2 : 3 : 5." },
    { topic: "Geometry", marks: 3, text: "The angles in a triangle are x°, 2x° and 3x°. Find x." },
    { topic: "Pythagoras", marks: 3, text: "A right-angled triangle has shorter sides 6 cm and 8 cm. Find the hypotenuse." },
    { topic: "Probability", marks: 3, text: "A bag contains 5 red, 3 blue and 2 green counters. Find the probability of choosing a blue counter." },
    { topic: "Statistics", marks: 4, text: "The values are 4, 7, 7, 8, 9, 10, 11. Find the median and the range." },
    { topic: "Graphs", marks: 4, text: "For y = 2x + 3, find y when x = −4." },
    { topic: "Problem solving", marks: 5, text: "A rectangle has length 3 cm greater than its width. Its perimeter is 30 cm. Find its dimensions." }
  ];

  const savedText = JSON.parse(localStorage.getItem("mathoraTextAnswers") || "{}");
  const state = {};
  const uploadFiles = {};
  let activeBoard = null;
  let drawing = false;
  let lastPoint = null;
  let tool = "pen";

  Object.keys(savedText).forEach((key) => {
    state[key] = { answer: savedText[key] };
  });

  document.getElementById("studentHeader").textContent = student.fullName;
  document.getElementById("assessmentTitle").textContent = `${student.qualification} Mathematics Diagnostic`;
  document.getElementById("assessmentCourse").textContent =
    [student.examBoard, student.level].filter(Boolean).join(" • ");

  const questions = document.getElementById("questions");
  const questionNav = document.getElementById("questionNav");

  questions.innerHTML = questionData.map((question, index) => {
    const number = index + 1;
    return `
      <article class="question-card" id="question-${number}">
        <header>
          <span class="question-number">Q${number}</span>
          <div>
            <span>${question.topic}</span>
            <strong>${question.marks} marks</strong>
          </div>
        </header>

        <div class="question-content">
          <h3>${question.text}</h3>

          <label class="answer-label" for="answer-${number}">Final answer</label>
          <input
            id="answer-${number}"
            class="answer-input"
            type="text"
            data-answer="${number}"
            value="${savedText[number] || ""}"
            placeholder="Enter your final answer"
          >

          <div class="working-grid">
            <section>
              <div class="working-title">
                <span>↑</span>
                <p><strong>Upload handwritten work</strong><small>Take a clear photograph of your calculations.</small></p>
              </div>
              <label class="upload-control">
                Choose image
                <input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" data-upload="${number}">
              </label>
              <div class="working-preview" id="uploadPreview-${number}"></div>
            </section>

            <section>
              <div class="working-title">
                <span>✎</span>
                <p><strong>Use digital whiteboard</strong><small>Write with a mouse, finger or stylus.</small></p>
              </div>
              <button class="whiteboard-control" type="button" data-board="${number}">Open whiteboard</button>
              <div class="working-preview" id="boardPreview-${number}"></div>
            </section>
          </div>
        </div>
      </article>
    `;
  }).join("");

  questionNav.innerHTML = questionData.map((_, index) => {
    const number = index + 1;
    return `<a href="#question-${number}" data-nav="${number}"><strong>${number}</strong><span>Q${number}</span></a>`;
  }).join("");

  function updateProgress() {
    let completed = 0;

    questionData.forEach((_, index) => {
      const number = index + 1;
      const item = state[number] || {};
      const done = Boolean(item.answer?.trim() || uploadFiles[number] || item.whiteboard);

      if (done) completed += 1;
      document.querySelector(`[data-nav="${number}"]`)?.classList.toggle("complete", done);
    });

    document.getElementById("progressText").textContent = `${completed} of 12`;
    document.getElementById("progressBar").style.width = `${(completed / 12) * 100}%`;
  }

  function saveTextAnswers() {
    const textOnly = {};
    Object.entries(state).forEach(([number, item]) => {
      if (item.answer) textOnly[number] = item.answer;
    });
    localStorage.setItem("mathoraTextAnswers", JSON.stringify(textOnly));
    document.getElementById("saveState").innerHTML = "<i></i> Saved";
    updateProgress();
  }

  document.querySelectorAll("[data-answer]").forEach((input) => {
    input.addEventListener("input", () => {
      const number = input.dataset.answer;
      state[number] = state[number] || {};
      state[number].answer = input.value;
      document.getElementById("saveState").innerHTML = "<i></i> Saving";
      clearTimeout(input.timer);
      input.timer = setTimeout(saveTextAnswers, 350);
    });
  });

  document.querySelectorAll("[data-upload]").forEach((input) => {
    input.addEventListener("change", () => {
      const number = input.dataset.upload;
      const file = input.files[0];
      if (!file) return;

      if (file.size > 6 * 1024 * 1024) {
        alert("Please use an image smaller than 6 MB.");
        input.value = "";
        return;
      }

      uploadFiles[number] = file;
      const url = URL.createObjectURL(file);
      document.getElementById(`uploadPreview-${number}`).innerHTML =
        `<img src="${url}" alt="Uploaded working"><span>${file.name}</span>`;
      updateProgress();
    });
  });

  const modal = document.getElementById("whiteboardModal");
  const canvas = document.getElementById("boardCanvas");
  const ctx = canvas.getContext("2d");

  function resetCanvas() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function openBoard(number) {
    activeBoard = String(number);
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.getElementById("boardTitle").textContent = `Question ${number} whiteboard`;
    resetCanvas();

    const existing = state[number]?.whiteboard;
    if (existing) {
      const image = new Image();
      image.onload = () => ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      image.src = existing;
    }
  }

  function closeBoard() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    activeBoard = null;
  }

  document.querySelectorAll("[data-board]").forEach((button) => {
    button.addEventListener("click", () => openBoard(button.dataset.board));
  });

  document.querySelectorAll("[data-close-board]").forEach((element) => {
    element.addEventListener("click", closeBoard);
  });

  document.querySelectorAll("[data-tool]").forEach((button) => {
    button.addEventListener("click", () => {
      tool = button.dataset.tool;
      document.querySelectorAll("[data-tool]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
    });
  });

  function pointFrom(event) {
    const rect = canvas.getBoundingClientRect();
    const source = event.touches ? event.touches[0] : event;

    return {
      x: (source.clientX - rect.left) * (canvas.width / rect.width),
      y: (source.clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  function begin(event) {
    event.preventDefault();
    drawing = true;
    lastPoint = pointFrom(event);
  }

  function draw(event) {
    if (!drawing) return;
    event.preventDefault();

    const point = pointFrom(event);
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(point.x, point.y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = Number(document.getElementById("brushSize").value);
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : "#07111f";
    ctx.stroke();
    lastPoint = point;
  }

  function end() {
    drawing = false;
    lastPoint = null;
  }

  canvas.addEventListener("mousedown", begin);
  canvas.addEventListener("mousemove", draw);
  window.addEventListener("mouseup", end);
  canvas.addEventListener("touchstart", begin, { passive: false });
  canvas.addEventListener("touchmove", draw, { passive: false });
  window.addEventListener("touchend", end);

  document.getElementById("clearBoard").addEventListener("click", resetCanvas);

  document.getElementById("saveBoard").addEventListener("click", () => {
    if (!activeBoard) return;

    state[activeBoard] = state[activeBoard] || {};
    state[activeBoard].whiteboard = canvas.toDataURL("image/png");

    document.getElementById(`boardPreview-${activeBoard}`).innerHTML =
      `<img src="${state[activeBoard].whiteboard}" alt="Saved whiteboard"><span>Whiteboard saved</span>`;

    updateProgress();
    closeBoard();
  });

  document.getElementById("saveProgress").addEventListener("click", () => {
    saveTextAnswers();
    const button = document.getElementById("saveProgress");
    const original = button.textContent;
    button.textContent = "Saved";
    setTimeout(() => button.textContent = original, 1000);
  });

  function dataUrlToBlob(dataUrl) {
    const [meta, encoded] = dataUrl.split(",");
    const type = meta.match(/:(.*?);/)[1];
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    return new Blob([bytes], { type });
  }

  async function uploadFiles(attemptId) {
    const fileRows = [];

    for (let number = 1; number <= 12; number += 1) {
      if (uploadFiles[number]) {
        const file = uploadFiles[number];
        const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${attemptId}/question-${number}-upload.${extension}`;

        const { error } = await client.storage
          .from("mathora-workings")
          .upload(path, file, { contentType: file.type, upsert: true });

        if (error) throw error;

        fileRows.push({
          attempt_id: attemptId,
          question_number: number,
          file_type: "uploaded_working",
          storage_path: path
        });
      }

      if (state[number]?.whiteboard) {
        const blob = dataUrlToBlob(state[number].whiteboard);
        const path = `${attemptId}/question-${number}-whiteboard.png`;

        const { error } = await client.storage
          .from("mathora-workings")
          .upload(path, blob, { contentType: "image/png", upsert: true });

        if (error) throw error;

        fileRows.push({
          attempt_id: attemptId,
          question_number: number,
          file_type: "whiteboard",
          storage_path: path
        });
      }
    }

    if (fileRows.length) {
      const { error } = await client.from("submission_files").insert(fileRows);
      if (error) throw error;
    }
  }

  async function submitAssessment() {
    if (!client) {
      throw new Error("Supabase did not initialise. Check supabase-config.js.");
    }

    const attemptId = crypto.randomUUID();

    const { error: attemptError } = await client.from("attempts").insert({
      id: attemptId,
      full_name: student.fullName,
      email: student.email,
      phone: student.phone,
      year_group: student.yearGroup,
      qualification: student.qualification,
      exam_board: student.examBoard,
      level: student.level,
      current_grade: student.currentGrade || null,
      target_grade: student.targetGrade,
      notes: student.notes || null,
      status: "submitted"
    });

    if (attemptError) throw attemptError;

    const rows = questionData.map((question, index) => {
      const number = index + 1;
      return {
        attempt_id: attemptId,
        question_number: number,
        topic: question.topic,
        question_text: question.text,
        maximum_marks: question.marks,
        final_answer: state[number]?.answer || null
      };
    });

    const { error: answerError } = await client.from("answers").insert(rows);
    if (answerError) throw answerError;

    await uploadFiles(attemptId);
    return attemptId;
  }

  document.getElementById("assessmentForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    saveTextAnswers();

    const button = document.getElementById("submitAssessment");
    const original = button.innerHTML;
    button.disabled = true;
    button.innerHTML = "<span>Submitting securely…</span><i>↗</i>";

    try {
      const attemptId = await submitAssessment();

      localStorage.removeItem("mathoraStudent");
      localStorage.removeItem("mathoraTextAnswers");

      document.getElementById("successMessage").textContent =
        `Your submission reference is ${attemptId.slice(0, 8).toUpperCase()}. Your work has been sent securely for review.`;

      const success = document.getElementById("successModal");
      success.classList.add("open");
      success.setAttribute("aria-hidden", "false");
    } catch (error) {
      console.error(error);
      alert(`The assessment could not be submitted: ${error.message}`);
      button.disabled = false;
      button.innerHTML = original;
    }
  });

  updateProgress();
});
