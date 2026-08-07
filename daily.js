
document.addEventListener("DOMContentLoaded", () => {
  const bank = window.MATHORA_DAILY;
  if (!bank) return;

  const TRACK_KEY = "mathoraDailyTrack";
  const STREAK_KEY = "mathoraDailyStreak";
  const LAST_KEY = "mathoraDailyLastVisit";

  const select = document.getElementById("trackSelect");
  const els = Object.fromEntries([
    "heroStreak","trackLabel","boardLabel","topicLabel","difficultyLabel","timeLabel",
    "challengeNumber","questionText","questionContext","hintText","finalAnswer",
    "solutionSteps","mistakeText","tipText","streakCount","answerInput","answerFeedback",
    "dateLabel","historyGrid"
  ].map(id => [id, document.getElementById(id)]));

  const startDate = new Date("2026-01-01T00:00:00");
  const today = new Date();
  today.setHours(0,0,0,0);
  const dayIndex = Math.floor((today - startDate) / 86400000);
  const rotationIndex = ((dayIndex % 730) + 730) % 730;

  const params = new URLSearchParams(location.search);
  const queryTrack = params.get("track");
  const savedTrack = localStorage.getItem(TRACK_KEY);
  let track = bank.tracks[queryTrack] ? queryTrack : (bank.tracks[savedTrack] ? savedTrack : "gcse-higher");
  let displayIndex = params.has("q") ? Math.max(0, Math.min(729, Number(params.get("q"))-1 || rotationIndex)) : rotationIndex;

  select.value = track;

  function isoDate(d){ return d.toISOString().slice(0,10); }
  function daysBetween(a,b){ return Math.round((new Date(b)-new Date(a))/86400000); }

  function updateStreak() {
    const todayISO=isoDate(today);
    const last=localStorage.getItem(LAST_KEY);
    let streak=Number(localStorage.getItem(STREAK_KEY)||0);

    if(!last){
      streak=1;
    } else {
      const diff=daysBetween(last,todayISO);
      if(diff===1) streak+=1;
      else if(diff>1) streak=1;
    }
    localStorage.setItem(LAST_KEY,todayISO);
    localStorage.setItem(STREAK_KEY,String(streak));
    els.streakCount.textContent=streak;
    els.heroStreak.textContent=streak;
  }

  function renderMath(root=document.body){
    if(window.renderMathInElement){
      renderMathInElement(root,{
        delimiters:[
          {left:"\\(",right:"\\)",display:false},
          {left:"\\[",right:"\\]",display:true}
        ],
        throwOnError:false
      });
    }
  }

  function render(index=displayIndex){
    displayIndex=((index%730)+730)%730;
    const c=bank.getChallenge(track,displayIndex);

    els.trackLabel.textContent=c.trackLabel;
    els.boardLabel.textContent=c.board;
    els.topicLabel.textContent=c.topic;
    els.difficultyLabel.textContent=`Difficulty ${c.difficulty}/5`;
    els.timeLabel.textContent=`${c.time} min`;
    els.challengeNumber.textContent=`Challenge #${c.challengeNumber}`;
    els.questionText.innerHTML=c.question;
    els.questionContext.textContent=c.context || "";
    els.hintText.innerHTML=c.hint;
    els.finalAnswer.textContent=`Answer: ${c.answer}`;
    els.solutionSteps.innerHTML=c.steps.map((step,i)=>`
      <div class="solution-step"><span>${String(i+1).padStart(2,"0")}</span><div>${step}</div></div>
    `).join("");
    els.mistakeText.innerHTML=c.mistake;
    els.tipText.innerHTML=c.tip;
    els.answerInput.value="";
    els.answerFeedback.textContent="";
    els.answerFeedback.className="answer-feedback";
    document.getElementById("hintPanel").classList.remove("open");
    document.getElementById("solutionPanel").classList.remove("open");
    document.getElementById("hintButton").querySelector("b").textContent="+";
    document.getElementById("solutionButton").querySelector("b").textContent="+";

    const actualDate=new Date(startDate.getTime()+(displayIndex+Math.floor(dayIndex/730)*730)*86400000);
    if(displayIndex===rotationIndex && !params.has("q")){
      els.dateLabel.textContent=today.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"}).toUpperCase();
    } else {
      els.dateLabel.textContent=`CHALLENGE ${displayIndex+1} OF 730`;
    }

    renderHistory();
    renderMath(document.querySelector(".challenge-card"));
  }

  function renderHistory(){
    const indexes=[1,2,3,4].map(n=>((displayIndex-n)+730)%730);
    els.historyGrid.innerHTML=indexes.map(i=>{
      const c=bank.getChallenge(track,i);
      return `<article class="history-card" data-index="${i}">
        <span>CHALLENGE #${i+1}</span>
        <h3>${c.topic}</h3>
        <p>${c.trackLabel} · Difficulty ${c.difficulty}/5</p>
      </article>`;
    }).join("");
    els.historyGrid.querySelectorAll(".history-card").forEach(card=>{
      card.addEventListener("click",()=>{
        const i=Number(card.dataset.index);
        const u=new URL(location.href);
        u.searchParams.set("q",String(i+1));
        u.searchParams.set("track",track);
        history.replaceState(null,"",u);
        render(i);
        window.scrollTo({top:document.querySelector(".daily-stage").offsetTop-70,behavior:"smooth"});
      });
    });
  }

  select.addEventListener("change",()=>{
    track=select.value;
    localStorage.setItem(TRACK_KEY,track);
    const u=new URL(location.href);
    u.searchParams.set("track",track);
    if(!params.has("q")) u.searchParams.delete("q");
    history.replaceState(null,"",u);
    render(rotationIndex);
  });

  document.getElementById("hintButton").addEventListener("click",()=>{
    const panel=document.getElementById("hintPanel");
    panel.classList.toggle("open");
    document.getElementById("hintButton").querySelector("b").textContent=panel.classList.contains("open")?"−":"+";
    if(panel.classList.contains("open")) renderMath(panel);
  });

  document.getElementById("solutionButton").addEventListener("click",()=>{
    const panel=document.getElementById("solutionPanel");
    panel.classList.toggle("open");
    document.getElementById("solutionButton").querySelector("b").textContent=panel.classList.contains("open")?"−":"+";
    if(panel.classList.contains("open")) renderMath(panel);
  });

  document.getElementById("checkAnswer").addEventListener("click",()=>{
    const c=bank.getChallenge(track,displayIndex);
    const value=els.answerInput.value.trim();
    if(!value){
      els.answerFeedback.textContent="Enter an answer first, or reveal the worked solution.";
      els.answerFeedback.className="answer-feedback";
      return;
    }
    if(bank.answerMatches(c,value)){
      els.answerFeedback.textContent="Correct — nice work. Check the worked solution to compare methods.";
      els.answerFeedback.className="answer-feedback correct";
    } else {
      els.answerFeedback.textContent="Not quite. Try the hint before revealing the full solution.";
      els.answerFeedback.className="answer-feedback wrong";
    }
  });

  els.answerInput.addEventListener("keydown",e=>{
    if(e.key==="Enter") document.getElementById("checkAnswer").click();
  });

  document.getElementById("randomChallenge").addEventListener("click",()=>{
    let r=Math.floor(Math.random()*730);
    if(r===displayIndex) r=(r+1)%730;
    const u=new URL(location.href);
    u.searchParams.set("q",String(r+1));
    u.searchParams.set("track",track);
    history.replaceState(null,"",u);
    render(r);
    window.scrollTo({top:document.querySelector(".daily-stage").offsetTop-70,behavior:"smooth"});
  });

  updateStreak();
  render(displayIndex);
});
