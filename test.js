document.addEventListener("DOMContentLoaded", () => {
  const raw = localStorage.getItem("mathoraStudent");
  if (!raw) { window.location.replace("./register.html"); return; }

  const student = JSON.parse(raw);
  const test = window.MATHORA_TESTS?.[student.testKey];
  if (!test) {
    alert(`No test found for ${student.testKey}. Please return to registration.`);
    window.location.replace("./register.html");
    return;
  }

  const client = window.mathoraSupabase;
  const questions = test.questions;
  const uploadFileMap = {};
  let state = JSON.parse(localStorage.getItem("mathoraAssessmentState") || "{}");
  let activeQuestion = 1;
  let elapsedSeconds = Number(state.elapsedSeconds || 0);
  let remainingSeconds = Math.max(0, test.durationMinutes * 60 - elapsedSeconds);
  let timerHandle;
  let boardQuestion = null;
  let drawing = false;
  let lastPoint = null;
  let tool = "pen";
  let history = [];

  for (let i=1;i<=questions.length;i++) {
    state[i] = state[i] || { selectedOption:"", whiteboard:"", uploadName:"", seconds:0 };
  }

  document.getElementById("studentName").textContent = student.fullName;
  document.getElementById("testTitle").textContent = test.title;
  document.getElementById("testPath").textContent = `${student.qualification} • ${student.examBoard} • ${student.level}`;

  const questionsEl = document.getElementById("questions");
  const navEl = document.getElementById("questionNav");

  questionsEl.innerHTML = questions.map((question,index) => {
    const n=index+1;
    return `<article class="mcq-card" id="question-${n}" data-question-card="${n}">
      <header><span>Q${n}</span><div><small>${question.topic}</small><b>${question.marks} mark${question.marks>1?"s":""}</b></div></header>
      <div class="mcq-content"><h3>${question.text}</h3>
      <div class="option-grid">
        ${Object.entries(question.options).map(([idx,text]) => {
          const letter = ["A","B","C","D"][idx];
          return `<label class="option"><input type="radio" name="q${n}" value="${letter}" data-option="${n}" ${state[n].selectedOption===letter?"checked":""}><span>${letter}</span><p>${text}</p></label>`;
        }).join("")}
      </div>
      <div class="working-grid">
        <section><div class="working-heading"><span>↑</span><div><strong>Upload handwritten solution</strong><small>JPG, PNG or WEBP, up to 6 MB</small></div></div>
        <label class="upload-button">Choose image<input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" data-upload="${n}"></label><div class="preview" id="uploadPreview-${n}">${state[n].uploadName?`<span>✓ ${state[n].uploadName}</span>`:""}</div></section>
        <section><div class="working-heading"><span>✎</span><div><strong>Use digital whiteboard</strong><small>Mouse, finger or stylus</small></div></div>
        <button class="board-button" type="button" data-board="${n}">Open whiteboard</button><div class="preview" id="boardPreview-${n}">${state[n].whiteboard?`<img src="${state[n].whiteboard}"><span>Whiteboard saved</span>`:""}</div></section>
      </div>
      <div class="question-time">Time on this question: <strong id="questionTime-${n}">${formatTime(state[n].seconds)}</strong></div>
      </div></article>`;
  }).join("");

  navEl.innerHTML = questions.map((_,i)=>`<a href="#question-${i+1}" data-nav="${i+1}"><b>${i+1}</b><span>Q${i+1}</span></a>`).join("");

  function formatTime(sec) {
    const m=Math.floor(sec/60).toString().padStart(2,"0");
    const s=(sec%60).toString().padStart(2,"0");
    return `${m}:${s}`;
  }

  function saveState() {
    state.elapsedSeconds = elapsedSeconds;
    localStorage.setItem("mathoraAssessmentState", JSON.stringify(state));
    document.getElementById("saveState").textContent = "● Saved";
    updateProgress();
  }

  function hasWorking(n) {
    return Boolean(state[n].whiteboard || state[n].uploadName);
  }

  function updateProgress() {
    let complete=0;
    for(let n=1;n<=questions.length;n++) {
      const done = Boolean(state[n].selectedOption && hasWorking(n));
      if(done) complete++;
      document.querySelector(`[data-nav="${n}"]`)?.classList.toggle("complete",done);
    }
    document.getElementById("progressText").textContent=`${complete} / ${questions.length}`;
    document.getElementById("progressBar").style.width=`${complete/questions.length*100}%`;
  }

  function updateTimerDisplay() {
    document.getElementById("timer").textContent=formatTime(remainingSeconds);
    document.getElementById("questionTime-"+activeQuestion).textContent=formatTime(state[activeQuestion].seconds);
    if(remainingSeconds<=300) document.getElementById("timer").classList.add("urgent");
  }

  timerHandle=setInterval(()=>{
    if(remainingSeconds<=0) {
      clearInterval(timerHandle);
      document.getElementById("timer").textContent="00:00";
      alert("Time is up. Mathora will now submit your assessment.");
      document.getElementById("testForm").requestSubmit();
      return;
    }
    remainingSeconds--; elapsedSeconds++; state[activeQuestion].seconds++;
    updateTimerDisplay();
    if(elapsedSeconds%5===0) saveState();
  },1000);

  const observer = new IntersectionObserver(entries=>{
    const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(visible) activeQuestion=Number(visible.target.dataset.questionCard);
  },{threshold:[0.25,0.5,0.75]});
  document.querySelectorAll("[data-question-card]").forEach(card=>observer.observe(card));

  document.querySelectorAll("[data-option]").forEach(input=>{
    input.addEventListener("change",()=>{
      const n=Number(input.dataset.option);
      state[n].selectedOption=input.value;
      document.getElementById("saveState").textContent="● Saving";
      saveState();
    });
  });

  document.querySelectorAll("[data-upload]").forEach(input=>{
    input.addEventListener("change",()=>{
      const n=Number(input.dataset.upload);
      const file=input.files[0];
      if(!file)return;
      if(file.size>6*1024*1024){alert("Please choose an image smaller than 6 MB.");input.value="";return;}
      uploadFileMap[n]=file;
      state[n].uploadName=file.name;
      const url=URL.createObjectURL(file);
      document.getElementById(`uploadPreview-${n}`).innerHTML=`<img src="${url}"><span>${file.name}</span>`;
      saveState();
    });
  });

  const modal=document.getElementById("boardModal");
  const canvas=document.getElementById("boardCanvas");
  const ctx=canvas.getContext("2d");

  function resetBoard(){ctx.fillStyle="#fff";ctx.fillRect(0,0,canvas.width,canvas.height);history=[];history.push(canvas.toDataURL());}
  function openBoard(n){
    boardQuestion=Number(n);activeQuestion=boardQuestion;
    modal.classList.add("open");modal.setAttribute("aria-hidden","false");
    document.getElementById("boardTitle").textContent=`Question ${n} whiteboard`;
    resetBoard();
    if(state[n].whiteboard){const img=new Image();img.onload=()=>{ctx.drawImage(img,0,0,canvas.width,canvas.height);history=[canvas.toDataURL()]};img.src=state[n].whiteboard;}
  }
  function closeBoard(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true");boardQuestion=null;}
  document.querySelectorAll("[data-board]").forEach(b=>b.addEventListener("click",()=>openBoard(b.dataset.board)));
  document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",closeBoard));
  document.querySelectorAll("[data-tool]").forEach(b=>b.addEventListener("click",()=>{tool=b.dataset.tool;document.querySelectorAll("[data-tool]").forEach(x=>x.classList.remove("active"));b.classList.add("active")}));

  function point(e){const r=canvas.getBoundingClientRect(),s=e.touches?e.touches[0]:e;return{x:(s.clientX-r.left)*canvas.width/r.width,y:(s.clientY-r.top)*canvas.height/r.height}}
  function start(e){e.preventDefault();drawing=true;lastPoint=point(e)}
  function move(e){if(!drawing)return;e.preventDefault();const p=point(e);ctx.beginPath();ctx.moveTo(lastPoint.x,lastPoint.y);ctx.lineTo(p.x,p.y);ctx.lineCap="round";ctx.lineJoin="round";ctx.lineWidth=Number(document.getElementById("brushSize").value);ctx.strokeStyle=tool==="eraser"?"#fff":"#07111f";ctx.stroke();lastPoint=p}
  function end(){if(drawing){drawing=false;lastPoint=null;history.push(canvas.toDataURL());if(history.length>30)history.shift()}}
  canvas.addEventListener("mousedown",start);canvas.addEventListener("mousemove",move);window.addEventListener("mouseup",end);
  canvas.addEventListener("touchstart",start,{passive:false});canvas.addEventListener("touchmove",move,{passive:false});window.addEventListener("touchend",end);
  document.getElementById("clearBoard").addEventListener("click",resetBoard);
  document.getElementById("undoBoard").addEventListener("click",()=>{if(history.length>1){history.pop();const img=new Image();img.onload=()=>{resetBoard();ctx.drawImage(img,0,0,canvas.width,canvas.height)};img.src=history[history.length-1]}});
  document.getElementById("saveBoard").addEventListener("click",()=>{
    if(!boardQuestion)return;
    state[boardQuestion].whiteboard=canvas.toDataURL("image/png");
    document.getElementById(`boardPreview-${boardQuestion}`).innerHTML=`<img src="${state[boardQuestion].whiteboard}"><span>Whiteboard saved</span>`;
    saveState();closeBoard();
  });

  document.getElementById("saveProgress").addEventListener("click",saveState);

  function dataUrlToBlob(dataUrl){
    const [meta,data]=dataUrl.split(",");const mime=meta.match(/:(.*?);/)[1];const bin=atob(data);const bytes=new Uint8Array(bin.length);
    for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
    return new Blob([bytes],{type:mime});
  }

  async function uploadWorking(attemptId){
    const fileRows=[];
    for(let n=1;n<=questions.length;n++){
      if(uploadFileMap[n]){
        const file=uploadFileMap[n];const ext=(file.name.split(".").pop()||"jpg").toLowerCase();const path=`${attemptId}/question-${n}-upload.${ext}`;
        const {error}=await client.storage.from("mathora-workings").upload(path,file,{contentType:file.type,upsert:true});if(error)throw error;
        fileRows.push({attempt_id:attemptId,question_number:n,file_type:"uploaded_working",storage_path:path});
      }
      if(state[n].whiteboard){
        const blob=dataUrlToBlob(state[n].whiteboard);const path=`${attemptId}/question-${n}-whiteboard.png`;
        const {error}=await client.storage.from("mathora-workings").upload(path,blob,{contentType:"image/png",upsert:true});if(error)throw error;
        fileRows.push({attempt_id:attemptId,question_number:n,file_type:"whiteboard",storage_path:path});
      }
    }
    if(fileRows.length){const {error}=await client.from("submission_files").insert(fileRows);if(error)throw error;}
  }

  document.getElementById("testForm").addEventListener("submit",async event=>{
    event.preventDefault();

    const incomplete=[];
    for(let n=1;n<=questions.length;n++){
      if(!state[n].selectedOption || !hasWorking(n)) incomplete.push(n);
    }
    if(incomplete.length){
      alert(`Please complete both the answer and working for question${incomplete.length>1?"s":""}: ${incomplete.join(", ")}`);
      document.getElementById(`question-${incomplete[0]}`).scrollIntoView({behavior:"smooth"});
      return;
    }

    const button=document.getElementById("submitButton");button.disabled=true;button.innerHTML="Submitting securely…";
    clearInterval(timerHandle);saveState();

    try{
      const attemptId=crypto.randomUUID();
      const {error:aErr}=await client.from("attempts").insert({
        id:attemptId,full_name:student.fullName,email:student.email,phone:student.phone,year_group:student.yearGroup,
        qualification:student.qualification,exam_board:student.examBoard,level:student.level,current_grade:student.currentGrade||null,
        target_grade:student.targetGrade,notes:student.notes||null,status:"submitted",test_key:student.testKey,
        total_time_seconds:elapsedSeconds,time_limit_seconds:test.durationMinutes*60
      });
      if(aErr)throw aErr;

      const rows=questions.map((q,index)=>{
        const n=index+1;
        return {
          attempt_id:attemptId,question_number:n,topic:q.topic,question_text:q.text,maximum_marks:q.marks,
          final_answer:state[n].selectedOption,selected_option:state[n].selectedOption,correct_option:q.correct,
          is_correct:state[n].selectedOption===q.correct,question_time_seconds:state[n].seconds,
          working_method:state[n].whiteboard&&state[n].uploadName?"both":state[n].whiteboard?"whiteboard":"upload"
        };
      });
      const {error:qErr}=await client.from("answers").insert(rows);if(qErr)throw qErr;
      await uploadWorking(attemptId);

      localStorage.removeItem("mathoraStudent");localStorage.removeItem("mathoraAssessmentState");
      document.getElementById("successText").textContent=`Reference ${attemptId.slice(0,8).toUpperCase()} • Total time ${formatTime(elapsedSeconds)}`;
      document.getElementById("successModal").classList.add("open");
    }catch(error){
      console.error(error);alert(`Submission failed: ${error.message}`);button.disabled=false;button.innerHTML="Submit assessment <i>→</i>";timerHandle=setInterval(()=>{},1000);
    }
  });

  updateProgress();updateTimerDisplay();
});
