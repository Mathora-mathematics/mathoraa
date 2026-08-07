/*
MATHORA V7 QUESTION BANK
Keeps the same window.MATHORA_TESTS structure used by the existing test.js.

Design rules:
- 12 questions per pathway
- one selected answer + compulsory working via the existing UI
- increasing demand through the test
- original diagnostic questions, not copied past-paper questions
*/

(() => {
  const T = {};
  const L = ["A","B","C","D"];

  function q(topic,text,options,correct,marks,difficulty,style,calculator="Either") {
    return {topic,text,options,correct,marks,difficulty,style,calculator};
  }

  function add(key,title,durationMinutes,questions,instructions="Questions increase in mathematical demand. Select one answer and show all essential working.") {
    T[key] = {title,durationMinutes,questions,instructions};
  }

  function shifted(correct,distractors,shift=0){
    const a=[correct,...distractors];
    for(let i=0;i<shift;i++) a.push(a.shift());
    return {options:a,correct:L[a.indexOf(correct)]};
  }

  const F=(n,d=3)=>Number.isInteger(n)?String(n):String(Number(n.toFixed(d)));

  // ---------- GCSE generators ----------
  function gcseFoundation(v){
    const qs=[]; let z;

    const pct=[15,20,25,35][v], n=[260,180,240,320][v], ans=n*pct/100;
    z=shifted(F(ans),[F(ans+12),F(ans-12),F(n-pct)],v);
    qs.push(q("Number and percentage",`Calculate \\(${pct}\\%\\) of \\(${n}\\).`,z.options,z.correct,1,1,"Fluency","Non-calculator"));

    z=shifted("\\(\\frac{7}{12}\\)",["\\(\\frac{5}{12}\\)","\\(\\frac34\\)","\\(\\frac{7}{24}\\)"],(v+1)%4);
    qs.push(q("Fractions","Work out \\(\\frac23-\\frac1{12}\\). Give your answer in simplest form.",z.options,z.correct,1,1,"Fluency","Non-calculator"));

    const ratioData=[[2,3,150],[3,5,200],[4,7,220],[5,7,288]][v];
    const [a,b,total]=ratioData, first=total*a/(a+b), second=total-first;
    z=shifted(`${F(first)} and ${F(second)}`,[`${F(second)} and ${F(first)}`,`${F(total/2)} and ${F(total/2)}`,`${F(total-a)} and ${a}`],(v+2)%4);
    qs.push(q("Ratio",`Share \\(${total}\\) in the ratio \\(${a}:${b}\\).`,z.options,z.correct,2,2,"Application"));

    const m=[3,4,5,6][v], c=[7,5,4,3][v], x=[8,6,9,7][v], rhs=m*x+c;
    z=shifted(`\\(x=${x}\\)`,[`\\(x=${x-1}\\)`,`\\(x=${x+1}\\)`,`\\(x=${rhs-c}\\)`],(v+3)%4);
    qs.push(q("Linear equations",`Solve \\(${m}x+${c}=${rhs}\\).`,z.options,z.correct,2,2,"Application","Non-calculator"));

    const d=[120,150,168,210][v], t=[2,3,2,3][v], s=d/t;
    z=shifted(`${F(s)} km/h`,[`${F(s+10)} km/h`,`${F(s-10)} km/h`,`${F(d*t)} km/h`],v);
    qs.push(q("Rates of change",`A car travels \\(${d}\\text{ km}\\) in \\(${t}\\) hours at a constant speed. Find the speed.`,z.options,z.correct,2,3,"Application","Calculator"));

    const A=[48,52,61,67][v], B=[63,71,58,49][v], C=180-A-B;
    z=shifted(`\\(${C}^\\circ\\)`,[`\\(${C+10}^\\circ\\)`,`\\(${180-A}^\\circ\\)`,`\\(${180-B}^\\circ\\)`],(v+1)%4);
    qs.push(q("Geometry",`The angles in a triangle are \\(${A}^\\circ\\), \\(${B}^\\circ\\) and \\(x^\\circ\\). Find \\(x\\).`,z.options,z.correct,2,3,"Reasoning","Non-calculator"));

    const length=[8,9,10,12][v], width=[5,6,7,8][v], area=length*width;
    z=shifted(`\\(${area}\\text{ cm}^2\\)`,[`\\(${2*(length+width)}\\text{ cm}^2\\)`,`\\(${area/2}\\text{ cm}^2\\)`,`\\(${area+length+width}\\text{ cm}^2\\)`],(v+2)%4);
    qs.push(q("Area",`A rectangle measures \\(${length}\\text{ cm}\\) by \\(${width}\\text{ cm}\\). Find its area.`,z.options,z.correct,2,4,"Application"));

    const red=[3,4,5,7][v], blue=[7,6,8,9][v];
    z=shifted(`\\(\\frac{${red}}{${red+blue}}\\)`,[`\\(\\frac{${blue}}{${red+blue}}\\)`,`\\(\\frac{${red}}{${blue}}\\)`,`\\(\\frac1{${red+blue}}\\)`],(v+3)%4);
    qs.push(q("Probability",`A bag contains \\(${red}\\) red and \\(${blue}\\) blue counters. One counter is chosen at random. Find \\(P(\\text{red})\\).`,z.options,z.correct,2,4,"Reasoning"));

    const vals=[[4,6,7,8,10],[5,7,9,10,14],[6,8,11,12,13],[7,8,10,14,16]][v];
    const mean=vals.reduce((s,n)=>s+n,0)/vals.length;
    z=shifted(F(mean),[F(mean+1),F(mean-1),F(Math.max(...vals)-Math.min(...vals))],v);
    qs.push(q("Statistics",`Find the mean of \\(${vals.join(", ")}\\).`,z.options,z.correct,3,4,"Reasoning","Calculator"));

    const gm=[2,3,-2,4][v], gc=[5,-1,7,3][v], gx=[4,3,5,2][v], gy=gm*gx+gc;
    z=shifted(F(gy),[F(gm+gc),F(gx+gc),F(gm*gx-gc)],(v+1)%4);
    qs.push(q("Linear graphs",`The line has equation \\(y=${gm}x${gc>=0?"+":""}${gc}\\). Find \\(y\\) when \\(x=${gx}\\).`,z.options,z.correct,3,5,"Reasoning"));

    const inc=[20,25,10,15][v], fin=[96,112.5,99,138][v], orig=fin/(1+inc/100);
    z=shifted(`£${F(orig)}`,[`£${F(fin)}`,`£${F(orig*(1-inc/100))}`,`£${F(orig+inc)}`],(v+2)%4);
    qs.push(q("Reverse percentage",`After an increase of \\(${inc}\\%\\), a price is £${F(fin)}. Find the original price.`,z.options,z.correct,4,5,"Multi-step","Calculator"));

    const add=[4,5,6,7][v], per=[44,50,56,64][v];
    const xr=(per/2-add)/2, ar=xr*(xr+add);
    z=shifted(`\\(${F(ar)}\\text{ cm}^2\\)`,[`\\(${F(ar+10)}\\text{ cm}^2\\)`,`\\(${per}\\text{ cm}^2\\)`,`\\(${F(xr*xr)}\\text{ cm}^2\\)`],(v+3)%4);
    qs.push(q("Algebra and geometry",`A rectangle has sides \\(x\\text{ cm}\\) and \\((x+${add})\\text{ cm}\\). Its perimeter is \\(${per}\\text{ cm}\\). Find its area.`,z.options,z.correct,4,5,"Cross-topic","Calculator"));

    return qs;
  }

  function gcseHigher(v){
    const qs=[]; let z;
    const N=[72,98,50,108][v], coef=[6,7,5,6][v], root=[2,2,2,3][v];
    z=shifted(`\\(${coef}\\sqrt{${root}}\\)`,[`\\(${coef*2}\\sqrt{${root}}\\)`,`\\(${N/2}\\sqrt{${root}}\\)`,`\\(\\sqrt{${N/2}}\\)`],v);
    qs.push(q("Surds",`Simplify \\(\\sqrt{${N}}\\).`,z.options,z.correct,1,1,"Fluency","Non-calculator"));

    const R=[[3,-4],[5,-2],[6,-3],[4,-5]][v], sum=R[0]+R[1], prod=R[0]*R[1];
    z=shifted(`\\(x=${R[0]}\\text{ or }x=${R[1]}\\)`,[`\\(x=${R[0]}\\text{ only}\\)`,`\\(x=${-R[0]}\\text{ or }x=${-R[1]}\\)`,`\\(x=${prod}\\text{ or }x=${sum}\\)`],(v+1)%4);
    qs.push(q("Quadratics",`Solve \\(x^2${-sum>=0?"+":""}${-sum}x${prod>=0?"+":""}${prod}=0\\).`,z.options,z.correct,2,1,"Fluency","Non-calculator"));

    const fa=[2,3,4,5][v], fb=[3,2,5,4][v], fx=[-2,3,-1,2][v], fr=fa*fx*fx+fb;
    z=shifted(F(fr),[F(fa*fx+fb),F(fa*fx*fx-fb),F(fa*(fx+fb)**2)],(v+2)%4);
    qs.push(q("Functions",`Given \\(f(x)=${fa}x^2+${fb}\\), find \\(f(${fx})\\).`,z.options,z.correct,2,2,"Application"));

    const sa=[3,4,5,6][v], sb=[2,1,4,3][v];
    z=shifted(`\\(${sa}n+${sb}\\)`,[`\\(${sa}n+${sb+sa}\\)`,`\\(${sa+1}n+${sb}\\)`,`\\(${sa}n-${sb}\\)`],(v+3)%4);
    qs.push(q("Sequences",`Find the \\(n\\)th term of \\(${sa+sb}, ${2*sa+sb}, ${3*sa+sb}, ${4*sa+sb},\\ldots\\).`,z.options,z.correct,2,2,"Application","Non-calculator"));

    const opp=[7,8,9,12][v], hyp=[10,17,15,13][v];
    z=shifted(`\\(\\sin\\theta=\\frac{${opp}}{${hyp}}\\)`,[`\\(\\cos\\theta=\\frac{${opp}}{${hyp}}\\)`,`\\(\\tan\\theta=\\frac{${opp}}{${hyp}}\\)`,`\\(\\sin\\theta=\\frac{${hyp}}{${opp}}\\)`],v);
    qs.push(q("Trigonometry",`In a right-angled triangle, the side opposite \\(\\theta\\) is \\(${opp}\\) and the hypotenuse is \\(${hyp}\\). Which equation finds \\(\\theta\\)?`,z.options,z.correct,2,3,"Application"));

    const pa=[0.3,0.4,0.5,0.6][v], pb=[0.2,0.25,0.3,0.35][v], pint=pa*pb;
    z=shifted(F(pint),[F(pa+pb),F(pa*(1-pb)),F(1-pint)],(v+1)%4);
    qs.push(q("Probability",`Events \\(A\\) and \\(B\\) are independent. \\(P(A)=${pa}\\) and \\(P(B)=${pb}\\). Find \\(P(A\\cap B)\\).`,z.options,z.correct,2,3,"Application","Calculator"));

    const centre=[100,124,136,152][v], circum=centre/2;
    z=shifted(`\\(${circum}^\\circ\\)`,[`\\(${centre}^\\circ\\)`,`\\(${centre/4}^\\circ\\)`,`\\(${180-circum}^\\circ\\)`],(v+2)%4);
    qs.push(q("Circle theorems",`The angle at the centre is \\(${centre}^\\circ\\). Find the angle at the circumference standing on the same arc.`,z.options,z.correct,3,4,"Reasoning","Non-calculator"));

    const va=[[2,3,-1,4],[3,-2,5,1],[-1,4,2,-3],[4,5,-2,6]];
    const ax=va[0][v], ay=va[1][v], bx=va[2][v], by=va[3][v];
    z=shifted(`\\(\\begin{pmatrix}${ax+bx}\\\\${ay+by}\\end{pmatrix}\\)`,[`\\(\\begin{pmatrix}${ax-bx}\\\\${ay-by}\\end{pmatrix}\\)`,`\\(\\begin{pmatrix}${ax*bx}\\\\${ay*by}\\end{pmatrix}\\)`,`\\(\\begin{pmatrix}${bx-ax}\\\\${by-ay}\\end{pmatrix}\\)`],(v+3)%4);
    qs.push(q("Vectors",`\\(\\mathbf a=\\begin{pmatrix}${ax}\\\\${ay}\\end{pmatrix}\\), \\(\\mathbf b=\\begin{pmatrix}${bx}\\\\${by}\\end{pmatrix}\\). Find \\(\\mathbf a+\\mathbf b\\).`,z.options,z.correct,3,4,"Reasoning"));

    z=shifted("\\(x=\\sqrt[3]{5-x}\\)",["\\(x=(5-x)^3\\)","\\(x=\\sqrt[3]{x-5}\\)","\\(x=5-x^3\\)"],v);
    qs.push(q("Iteration","Which rearrangement is suitable for fixed-point iteration of \\(x^3+x-5=0\\)?",z.options,z.correct,3,4,"Reasoning","Non-calculator"));

    const r1=[2,3,1,4][v], r2=[3,2,4,1][v], den=r1+r2;
    z=shifted(`\\(\\frac{${r2}}{${den}}\\mathbf a+\\frac{${r1}}{${den}}\\mathbf b\\)`,[`\\(\\frac{${r1}}{${den}}\\mathbf a+\\frac{${r2}}{${den}}\\mathbf b\\)`,`\\(\\mathbf b-\\mathbf a\\)`,`\\(\\frac1${den}(\\mathbf a+\\mathbf b)\\)`],(v+1)%4);
    qs.push(q("Vectors and ratio",`\\(\\overrightarrow{OA}=\\mathbf a\\), \\(\\overrightarrow{OB}=\\mathbf b\\). Point \\(P\\) divides \\(AB\\) in the ratio \\(AP:PB=${r1}:${r2}\\). Find \\(\\overrightarrow{OP}\\).`,z.options,z.correct,4,5,"Cross-topic","Calculator"));

    const chord=[12,16,10,18][v], dist=[4,6,12,8][v], rad=Math.sqrt((chord/2)**2+dist**2);
    z=shifted(`\\(${F(rad)}\\text{ cm}\\)`,[`\\(${F(chord/2+dist)}\\text{ cm}\\)`,`\\(${F(Math.sqrt(chord**2+dist**2))}\\text{ cm}\\)`,`\\(${F(chord/2)}\\text{ cm}\\)`],(v+2)%4);
    qs.push(q("Circle geometry and Pythagoras",`A chord has length \\(${chord}\\text{ cm}\\) and is \\(${dist}\\text{ cm}\\) from the centre. Find the radius.`,z.options,z.correct,4,5,"Cross-topic","Calculator"));

    const mm=[1,2,3,4][v], cc=[2,3,1,5][v], disc=mm*mm+4*cc;
    z=shifted(F(disc),[F(mm*mm-4*cc),F(4*cc),F(mm+cc)],(v+3)%4);
    qs.push(q("Graphs and algebra",`The line \\(y=${mm}x+${cc}\\) intersects \\(y=x^2\\) at \\(x=\\alpha\\) and \\(x=\\beta\\). Find \\((\\alpha-\\beta)^2\\).`,z.options,z.correct,5,5,"Cross-topic","Non-calculator"));

    return qs;
  }

  ["AQA","Pearson Edexcel","OCR","WJEC"].forEach((board,i)=>{
    add(`GCSE|${board}|Foundation`,`${board} GCSE Mathematics Foundation Diagnostic`,45,gcseFoundation(i));
    add(`GCSE|${board}|Higher`,`${board} GCSE Mathematics Higher Diagnostic`,55,gcseHigher(i));
  });

  // ---------- IGCSE ----------
  add("IGCSE|Pearson Edexcel|Foundation","Pearson Edexcel International GCSE Mathematics A Foundation Diagnostic",50,[
    q("Number","Write \\(0.375\\) as a fraction in simplest form.",["\\(\\frac38\\)","\\(\\frac58\\)","\\(\\frac3{10}\\)","\\(\\frac{37}{100}\\)"],"A",1,1,"Fluency","Non-calculator"),
    q("Ratio","Divide \\(168\\) in the ratio \\(4:3\\).",["96 and 72","84 and 84","112 and 56","72 and 96"],"A",2,1,"Fluency","Non-calculator"),
    q("Standard form","Write \\(0.00056\\) in standard form.",["\\(5.6\\times10^{-4}\\)","\\(5.6\\times10^{-3}\\)","\\(56\\times10^{-4}\\)","\\(0.56\\times10^{-3}\\)"],"A",2,2,"Application","Non-calculator"),
    q("Algebra","Expand and simplify \\(3(2x-5)+4x\\).",["\\(10x-15\\)","\\(6x-1\\)","\\(10x-5\\)","\\(6x-15\\)"],"A",2,2,"Application","Non-calculator"),
    q("Coordinate geometry","Find the gradient through \\((2,3)\\) and \\((6,11)\\).",["2","4","\\(\\frac12\\)","8"],"A",2,3,"Application"),
    q("Mensuration","A cylinder has radius \\(3\\text{ cm}\\) and height \\(8\\text{ cm}\\). Find its volume in terms of \\(\\pi\\).",["\\(72\\pi\\text{ cm}^3\\)","\\(24\\pi\\text{ cm}^3\\)","\\(48\\pi\\text{ cm}^3\\)","\\(144\\pi\\text{ cm}^3\\)"],"A",3,3,"Application"),
    q("Probability","A fair spinner has 8 equal sectors, 3 blue. It is spun twice. Find the probability of two blue results.",["\\(\\frac9{64}\\)","\\(\\frac38\\)","\\(\\frac6{16}\\)","\\(\\frac{15}{64}\\)"],"A",3,4,"Reasoning","Calculator"),
    q("Statistics","The mean of five numbers is \\(12\\). Four are \\(7,10,14,15\\). Find the fifth.",["14","12","16","18"],"A",3,4,"Reasoning","Non-calculator"),
    q("Similarity","Two similar shapes have length scale factor \\(3:5\\). The smaller area is \\(54\\text{ cm}^2\\). Find the larger area.",["150 cm²","90 cm²","250 cm²","162 cm²"],"A",4,4,"Reasoning","Calculator"),
    q("Trigonometry","In triangle \\(ABC\\), \\(a=7\\), \\(b=9\\), \\(C=60^\\circ\\). Find \\(c^2\\).",["67","130","46","109"],"A",4,5,"Multi-step","Calculator"),
    q("Functions","\\(f(x)=3x-4\\), \\(g(x)=x^2\\). Find \\(g(f(2))\\).",["4","2","8","16"],"A",4,5,"Cross-topic"),
    q("Algebraic modelling","A rectangle has area \\(60\\text{ cm}^2\\). Its length is \\(x+2\\), width \\(x-3\\). Find positive \\(x\\).",["8","10","6","12"],"A",5,5,"Cross-topic","Calculator")
  ]);

  add("IGCSE|Pearson Edexcel|Higher","Pearson Edexcel International GCSE Mathematics A Higher Diagnostic",60,[
    q("Indices","Simplify \\(\\frac{x^7y^3}{x^2y}\\).",["\\(x^5y^2\\)","\\(x^9y^4\\)","\\(x^5y^3\\)","\\(x^3y^2\\)"],"A",1,1,"Fluency","Non-calculator"),
    q("Surds","Rationalise \\(\\frac6{\\sqrt3}\\).",["\\(2\\sqrt3\\)","\\(6\\sqrt3\\)","\\(3\\sqrt2\\)","\\(\\sqrt3\\)"],"A",2,1,"Fluency","Non-calculator"),
    q("Quadratics","Solve \\(2x^2-5x-3=0\\).",["\\(x=3\\text{ or }x=-\\frac12\\)","\\(x=-3\\text{ or }x=\\frac12\\)","\\(x=1\\text{ or }x=-3\\)","\\(x=\\frac32\\text{ or }x=-1\\)"],"A",2,2,"Application","Non-calculator"),
    q("Functions","\\(f(x)=\\frac{2x+1}{3}\\). Find \\(f^{-1}(x)\\).",["\\(\\frac{3x-1}{2}\\)","\\(\\frac{3x+1}{2}\\)","\\(\\frac{2x-1}{3}\\)","\\(3x-\\frac12\\)"],"A",3,2,"Application"),
    q("Sequences","The \\(n\\)th term is \\(n^2+2n\\). Find the 8th term.",["80","64","96","72"],"A",2,3,"Application","Non-calculator"),
    q("Vectors","\\(\\overrightarrow{AB}=\\mathbf p\\), \\(\\overrightarrow{BC}=\\mathbf q\\). Find \\(\\overrightarrow{AC}\\).",["\\(\\mathbf p+\\mathbf q\\)","\\(\\mathbf q-\\mathbf p\\)","\\(\\mathbf p-\\mathbf q\\)","\\(2\\mathbf p+\\mathbf q\\)"],"A",2,3,"Reasoning"),
    q("Trigonometry","A triangle has sides 8 and 11 with included angle \\(50^\\circ\\). Which expression gives its area?",["\\(\\frac12(8)(11)\\sin50^\\circ\\)","\\(8\\cdot11\\cos50^\\circ\\)","\\(\\frac12(8)(11)\\cos50^\\circ\\)","\\(8\\cdot11\\sin50^\\circ\\)"],"A",3,4,"Reasoning","Calculator"),
    q("Probability","For \\(X\\sim B(5,0.4)\\), which expression gives \\(P(X=2)\\)?",["\\(\\binom52(0.4)^2(0.6)^3\\)","\\(\\binom52(0.4)^3(0.6)^2\\)","\\(5(0.4)^2(0.6)^3\\)","\\((0.4)^2(0.6)^3\\)"],"A",3,4,"Reasoning","Calculator"),
    q("Geometry","The interior angle of a regular polygon is \\(156^\\circ\\). How many sides?",["15","12","18","24"],"A",4,4,"Reasoning","Calculator"),
    q("Algebra","The equation \\(x^2+kx+9=0\\) has equal roots. Find possible \\(k\\).",["\\(k=\\pm6\\)","\\(k=6\\)","\\(k=\\pm3\\)","\\(k=\\pm18\\)"],"A",4,5,"Multi-step","Non-calculator"),
    q("Similarity and volume","Two similar solids have surface-area ratio \\(9:25\\). The smaller volume is \\(216\\text{ cm}^3\\). Find larger volume.",["\\(1000\\text{ cm}^3\\)","\\(600\\text{ cm}^3\\)","\\(360\\text{ cm}^3\\)","\\(1666\\frac23\\text{ cm}^3\\)"],"A",5,5,"Cross-topic","Calculator"),
    q("Graphs and algebra","The line \\(y=mx+2\\) is tangent to \\(y=x^2-4x+7\\). Find possible \\(m\\).",["\\(-4\\pm2\\sqrt5\\)","\\(4\\pm2\\sqrt5\\)","\\(-4\\pm\\sqrt5\\)","\\(\\pm2\\sqrt5\\)"],"A",5,5,"Cross-topic","Non-calculator")
  ]);

  add("IGCSE|Cambridge International|Core","Cambridge IGCSE Mathematics Core Diagnostic",50,[
    q("Number","Calculate \\(17.5\\%\\) of \\(240\\).",["42","36","48","57"],"A",1,1,"Fluency","Non-calculator"),
    q("Fractions","Work out \\(\\frac56-\\frac14\\).",["\\(\\frac7{12}\\)","\\(\\frac12\\)","\\(\\frac23\\)","\\(\\frac{11}{12}\\)"],"A",1,1,"Fluency","Non-calculator"),
    q("Scale","A map scale is \\(1:50\,000\\). A distance of 6 cm represents:",["3 km","30 km","0.3 km","300 km"],"A",2,2,"Application","Calculator"),
    q("Algebra","Solve \\(5x-7=28\\).",["\\(x=7\\)","\\(x=5\\)","\\(x=6\\)","\\(x=9\\)"],"A",2,2,"Application","Non-calculator"),
    q("Coordinates","Find the midpoint of \\((2,-1)\\) and \\((8,7)\\).",["(5,3)","(10,6)","(3,5)","(6,4)"],"A",2,3,"Application"),
    q("Mensuration","A prism has cross-sectional area \\(24\\text{ cm}^2\\) and length \\(7\\text{ cm}\\). Find volume.",["168 cm³","31 cm³","84 cm³","336 cm³"],"A",2,3,"Application"),
    q("Transformations","A shape is enlarged by scale factor 2. Its area is multiplied by:",["4","2","8","16"],"A",3,4,"Reasoning"),
    q("Probability","A fair die is rolled. Find \\(P(\\text{prime number})\\).",["\\(\\frac12\\)","\\(\\frac13\\)","\\(\\frac23\\)","\\(\\frac56\\)"],"A",3,4,"Reasoning","Non-calculator"),
    q("Statistics","Find the interquartile range of \\(3,5,7,9,11\\).",["6","4","5","8"],"A",3,4,"Reasoning"),
    q("Trigonometry","A right-angled triangle has hypotenuse 13 and one shorter side 5. Find the other shorter side.",["12","8","18","10"],"A",4,5,"Multi-step","Non-calculator"),
    q("Percentage change","A quantity decreases from 500 to 425. Find the percentage decrease.",["15%","17.5%","75%","12.5%"],"A",4,5,"Multi-step","Calculator"),
    q("Algebra and geometry","The perimeter of a rectangle is 42 cm. Its length is 3 cm more than its width. Find area.",["108 cm²","96 cm²","84 cm²","120 cm²"],"A",5,5,"Cross-topic","Calculator")
  ]);

  add("IGCSE|Cambridge International|Extended","Cambridge IGCSE Mathematics Extended Diagnostic",60,[
    q("Standard form","Calculate \\(\\frac{6\\times10^7}{3\\times10^3}\\).",["\\(2\\times10^4\\)","\\(2\\times10^{10}\\)","\\(18\\times10^4\\)","\\(2\\times10^3\\)"],"A",1,1,"Fluency","Non-calculator"),
    q("Indices","Solve \\(3^{x+1}=81\\).",["\\(x=3\\)","\\(x=4\\)","\\(x=2\\)","\\(x=5\\)"],"A",1,1,"Fluency","Non-calculator"),
    q("Functions","If \\(f(x)=2x-3\\), find \\(f(f(5))\\).",["11","7","14","17"],"A",2,2,"Application"),
    q("Sequences","Find the next term of \\(2,6,12,20,30,\\ldots\\).",["42","40","44","36"],"A",2,2,"Reasoning","Non-calculator"),
    q("Coordinate geometry","A line is perpendicular to \\(y=\\frac12x+4\\). Find its gradient.",["-2","2","\\(-\\frac12\\)","\\(\\frac12\\)"],"A",2,3,"Application","Non-calculator"),
    q("Trigonometry","In a triangle, \\(a=8\\), \\(A=35^\\circ\\), \\(B=62^\\circ\\). Which expression gives \\(b\\)?",["\\(\\frac{8\\sin62^\\circ}{\\sin35^\\circ}\\)","\\(\\frac{8\\sin35^\\circ}{\\sin62^\\circ}\\)","\\(8\\cos62^\\circ\\)","\\(\\frac8{\\sin35^\\circ}\\)"],"A",3,3,"Application","Calculator"),
    q("Vectors","\\(\\mathbf a=(3,-2)\\), \\(\\mathbf b=(-1,5)\\). Find \\(2\\mathbf a-\\mathbf b\\).",["(7,-9)","(5,1)","(5,-9)","(7,1)"],"A",3,4,"Reasoning"),
    q("Probability","Two fair coins and one fair die are used. Find probability of two heads and an even number.",["\\(\\frac18\\)","\\(\\frac14\\)","\\(\\frac38\\)","\\(\\frac1{12}\\)"],"A",3,4,"Reasoning","Non-calculator"),
    q("Geometry","The exterior angle of a regular polygon is \\(24^\\circ\\). Find the number of sides.",["15","12","18","24"],"A",4,4,"Reasoning","Non-calculator"),
    q("Algebra","Solve simultaneously \\(y=x+1\\) and \\(y=x^2-5x+7\\). How many real intersection points?",["2","1","0","3"],"A",4,5,"Multi-step","Calculator"),
    q("Similarity","Two similar solids have volume ratio \\(64:125\\). Find corresponding length ratio.",["4:5","8:5","16:25","64:125"],"A",4,5,"Cross-topic","Non-calculator"),
    q("Algebraic reasoning","The line \\(y=kx+5\\) is tangent to \\(y=x^2+2x+9\\). Find possible \\(k\\).",["\\(-2\\pm4\\)","\\(2\\pm4\\)","\\(2\\pm2\\sqrt5\\)","\\(-2\\pm2\\sqrt5\\)"],"A",5,5,"Cross-topic","Non-calculator")
  ]);

  // ---------- AS Mathematics ----------
  const AS = [
    q("Algebra and functions","Simplify \\(x^3x^5\\).",["\\(x^8\\)","\\(x^{15}\\)","\\(x^2\\)","\\(2x^8\\)"],"A",1,1,"Fluency","Non-calculator"),
    q("Quadratics","Find the discriminant of \\(2x^2-5x+1\\).",["17","33","21","25"],"A",1,1,"Fluency","Non-calculator"),
    q("Coordinate geometry","Find the gradient through \\((1,4)\\) and \\((5,12)\\).",["2","4","\\(\\frac12\\)","8"],"A",2,2,"Application"),
    q("Sequences and series","An arithmetic sequence has first term 9 and difference 5. Find the 12th term.",["64","69","60","55"],"A",2,2,"Application","Non-calculator"),
    q("Trigonometry","Solve \\(2\\sin x=1\\) for \\(0\\le x\\le180^\\circ\\).",["\\(30^\\circ,150^\\circ\\)","\\(30^\\circ\\)","\\(60^\\circ,120^\\circ\\)","\\(150^\\circ\\)"],"A",2,3,"Application","Non-calculator"),
    q("Exponentials and logarithms","Solve \\(\\ln x=2\\).",["\\(x=e^2\\)","\\(x=2e\\)","\\(x=\\ln2\\)","\\(x=2\\)"],"A",2,3,"Application"),
    q("Differentiation","Find the gradient of \\(y=x^3-4x\\) at \\(x=2\\).",["8","4","12","16"],"A",3,4,"Reasoning","Non-calculator"),
    q("Integration","Evaluate \\(\\int_0^3(2x+1)\\,dx\\).",["12","9","15","6"],"A",3,4,"Reasoning","Non-calculator"),
    q("Probability","If \\(X\\sim B(5,0.3)\\), which expression gives \\(P(X=2)\\)?",["\\(\\binom52(0.3)^2(0.7)^3\\)","\\(\\binom52(0.3)^3(0.7)^2\\)","\\(5(0.3)^2(0.7)^3\\)","\\((0.3)^2(0.7)^3\\)"],"A",3,4,"Reasoning","Calculator"),
    q("Kinematics","A particle has velocity \\(v=3t^2-6t+2\\). Find acceleration at \\(t=2\\).",["6","2","8","12"],"A",4,5,"Multi-step","Non-calculator"),
    q("Forces","A 5 kg particle experiences resultant force 20 N. Find acceleration.",["\\(4\\text{ m s}^{-2}\\)","\\(100\\text{ m s}^{-2}\\)","\\(15\\text{ m s}^{-2}\\)","\\(0.25\\text{ m s}^{-2}\\)"],"A",4,5,"Application","Calculator"),
    q("Functions and calculus","The curve \\(y=x^3-3x^2-9x\\) has a stationary point at \\(x=-1\\). Find the other stationary x-coordinate.",["3","1","-3","6"],"A",5,5,"Cross-topic","Non-calculator")
  ];
  ["AQA","Pearson Edexcel","OCR A"].forEach(b=>add(`AS Mathematics|${b}|AS`,`${b} AS Mathematics Diagnostic`,65,AS.map(x=>({...x}))));

  // ---------- A Level Mathematics ----------
  const AL = [
    q("Proof","Which proves the square of an odd integer is odd?",["\\((2k+1)^2=2(2k^2+2k)+1\\)","\\((2k)^2=4k^2\\)","\\((k+1)^2=k^2+2k+1\\)","\\(2k+1\\) is odd"],"A",1,1,"Fluency","Non-calculator"),
    q("Algebra and functions","Find inverse of \\(f(x)=\\frac{3x-2}{5}\\).",["\\(f^{-1}(x)=\\frac{5x+2}{3}\\)","\\(\\frac{5x-2}{3}\\)","\\(\\frac{3x+2}{5}\\)","\\(5x+2\\)"],"A",2,1,"Application","Non-calculator"),
    q("Sequences and series","Find sum to infinity of \\(12-3+\\frac34-\\cdots\\).",["9.6","16","8","12"],"A",2,2,"Application","Non-calculator"),
    q("Trigonometry","Solve \\(\\cos2x=0\\) for \\(0\\le x<\\pi\\).",["\\(x=\\frac\\pi4,\\frac{3\\pi}4\\)","\\(x=\\frac\\pi2\\)","\\(x=0,\\pi\\)","\\(x=\\frac\\pi4\\)"],"A",2,2,"Application","Non-calculator"),
    q("Exponentials and logarithms","Solve \\(3e^{2x}=12\\).",["\\(x=\\ln2\\)","\\(x=2\\ln2\\)","\\(x=\\frac12\\ln2\\)","\\(x=\\ln4\\)"],"A",3,3,"Application"),
    q("Differentiation","Differentiate \\(x^2\\ln x\\).",["\\(2x\\ln x+x\\)","\\(2x\\ln x\\)","\\(\\frac{x^2}{x}\\)","\\(x\\ln x+2x\\)"],"A",3,3,"Application","Non-calculator"),
    q("Integration","Evaluate \\(\\int xe^{x^2}\\,dx\\).",["\\(\\frac12e^{x^2}+C\\)","\\(xe^{x^2}+C\\)","\\(e^{x^2}+C\\)","\\(\\frac{x^2}{2}e^{x^2}+C\\)"],"A",3,4,"Reasoning","Non-calculator"),
    q("Numerical methods","Newton–Raphson uses:",["\\(x_{n+1}=x_n-\\frac{f(x_n)}{f'(x_n)}\\)","\\(x_{n+1}=f(x_n)\\)","\\(x_{n+1}=x_n+f'(x_n)\\)","\\(x_{n+1}=\\frac{f'(x_n)}{f(x_n)}\\)"],"A",3,4,"Reasoning"),
    q("Statistics","If \\(X\\sim N(100,15^2)\\), find z-score for 130.",["2","1","15","0.5"],"A",3,4,"Reasoning","Calculator"),
    q("Hypothesis testing","A two-tailed 5% test gives p-value 0.032. Conclude:",["reject the null hypothesis","do not reject the null hypothesis","null is proven false","change to a one-tailed test"],"A",4,5,"Reasoning","Calculator"),
    q("Mechanics","A particle starts from rest with constant acceleration \\(3\\text{ m s}^{-2}\\). Find speed after 8 s.",["\\(24\\text{ m s}^{-1}\\)","\\(11\\text{ m s}^{-1}\\)","\\(64\\text{ m s}^{-1}\\)","\\(3\\text{ m s}^{-1}\\)"],"A",4,5,"Multi-step","Calculator"),
    q("Calculus and modelling","A particle has displacement \\(s=t^3-6t^2+9t\\). Find positive times at which it is at rest.",["\\(t=1,3\\)","\\(t=0,3\\)","\\(t=1,2\\)","\\(t=3\\text{ only}\\)"],"A",5,5,"Cross-topic","Non-calculator")
  ];
  ["AQA","Pearson Edexcel","OCR A"].forEach(b=>add(`A Level Mathematics|${b}|A Level`,`${b} A Level Mathematics Diagnostic`,75,AL.map(x=>({...x}))));

  // ---------- Further Mathematics core ----------
  const FM = [
    q("Complex numbers","Simplify \\(i^{23}\\).",["\\(-i\\)","\\(i\\)","1","-1"],"A",1,1,"Fluency","Non-calculator"),
    q("Matrices","Find \\(\\det\\begin{pmatrix}3&1\\\\2&4\\end{pmatrix}\\).",["10","14","8","12"],"A",1,1,"Fluency","Non-calculator"),
    q("Roots of polynomials","If \\(\\alpha,\\beta\\) are roots of \\(x^2-7x+10=0\\), find \\(\\alpha+\\beta\\).",["7","10","-7","-10"],"A",2,2,"Application","Non-calculator"),
    q("Complex numbers","Find modulus of \\(3-4i\\).",["5","7","1","\\(\\sqrt7\\)"],"A",2,2,"Application","Non-calculator"),
    q("Matrices","Eigenvalues of \\(\\begin{pmatrix}2&0\\\\0&5\\end{pmatrix}\\) are:",["2 and 5","7 and 10","0 and 7","-2 and -5"],"A",2,3,"Application","Non-calculator"),
    q("Further algebra","If roots of \\(x^3-6x^2+11x-6=0\\) are \\(\\alpha,\\beta,\\gamma\\), find \\(\\alpha\\beta\\gamma\\).",["6","-6","11","-11"],"A",3,3,"Reasoning","Non-calculator"),
    q("Polar coordinates","The point \\((3,3)\\) has polar angle:",["\\(\\frac\\pi4\\)","\\(\\frac\\pi3\\)","\\(\\frac\\pi2\\)","\\(\\frac{3\\pi}4\\)"],"A",3,4,"Reasoning"),
    q("Hyperbolic functions","Which identity is correct?",["\\(\\cosh^2x-\\sinh^2x=1\\)","\\(\\cosh^2x+\\sinh^2x=1\\)","\\(\\tanh^2x+1=\\operatorname{sech}^2x\\)","\\(\\sinh x=\\frac{e^x+e^{-x}}2\\)"],"A",3,4,"Reasoning","Non-calculator"),
    q("Differential equations","Solve \\(\\frac{dy}{dx}=2y\\), given \\(y(0)=3\\).",["\\(y=3e^{2x}\\)","\\(y=2e^{3x}\\)","\\(y=3e^x+2\\)","\\(y=6e^{2x}\\)"],"A",4,4,"Reasoning","Non-calculator"),
    q("Matrices","For \\(A=\\begin{pmatrix}1&1\\\\1&0\\end{pmatrix}\\), characteristic equation is:",["\\(\\lambda^2-\\lambda-1=0\\)","\\(\\lambda^2+\\lambda-1=0\\)","\\(\\lambda^2-1=0\\)","\\(\\lambda^2-\\lambda+1=0\\)"],"A",4,5,"Multi-step","Non-calculator"),
    q("Maclaurin series","Coefficient of \\(x^3\\) in \\(e^{2x}\\) is:",["\\(\\frac43\\)","8","\\(\\frac83\\)","2"],"A",4,5,"Reasoning","Non-calculator"),
    q("Complex numbers and geometry","The roots of \\(z^6=64\\) lie on a circle with radius:",["2","4","8","64"],"A",5,5,"Cross-topic","Non-calculator")
  ];
  add("A Level Further Mathematics|AQA|Core","AQA A Level Further Mathematics Core Diagnostic",80,FM.map(x=>({...x})),"Core/compulsory Further Mathematics only; optional applied content is not tested.");
  add("A Level Further Mathematics|Pearson Edexcel|Core Pure","Pearson Edexcel A Level Further Mathematics Core Pure Diagnostic",80,FM.map(x=>({...x})),"Core Pure only; optional Further Pure, Further Statistics, Further Mechanics and Decision modules are not tested.");
  add("A Level Further Mathematics|OCR A|Core","OCR A Level Further Mathematics A Core Diagnostic",80,FM.map(x=>({...x})),"Core pure content only; optional paper specialisms are not tested.");

  // ---------- IB ----------
  add("IB|International Baccalaureate|Mathematics AA SL","IB Mathematics: Analysis and Approaches SL Diagnostic",60,[
    q("Algebra","Solve \\(2^{x+1}=16\\).",["\\(x=3\\)","\\(x=2\\)","\\(x=4\\)","\\(x=5\\)"],"A",1,1,"Fluency","Non-calculator"),
    q("Functions","Find domain restriction of \\(f(x)=\\frac1{x-3}\\).",["\\(x\\ne3\\)","\\(x\\ne0\\)","\\(x>3\\)","all real numbers"],"A",1,1,"Fluency"),
    q("Sequences","Arithmetic sequence: \\(u_1=7\\), difference 4. Find \\(u_{10}\\).",["43","47","40","44"],"A",2,2,"Application"),
    q("Trigonometry","Solve \\(\\sin x=\\frac12\\) for \\(0\\le x\\le180^\\circ\\).",["\\(30^\\circ,150^\\circ\\)","\\(30^\\circ\\)","\\(60^\\circ,120^\\circ\\)","\\(150^\\circ\\)"],"A",2,2,"Application","Non-calculator"),
    q("Logarithms","Simplify \\(\\log_a(a^5)\\).",["5","\\(a^5\\)","a","\\(\\frac15\\)"],"A",2,3,"Application","Non-calculator"),
    q("Differentiation","Differentiate \\(3x^4-5x^2+7\\).",["\\(12x^3-10x\\)","\\(12x^3-5x\\)","\\(3x^3-10x\\)","\\(12x^4-10x^2\\)"],"A",3,3,"Application","Non-calculator"),
    q("Integration","Evaluate \\(\\int_0^2(3x^2+1)\\,dx\\).",["10","8","12","6"],"A",3,4,"Reasoning","Non-calculator"),
    q("Probability","If \\(X\\sim B(6,0.4)\\), which expression gives \\(P(X=2)\\)?",["\\(\\binom62(0.4)^2(0.6)^4\\)","\\(\\binom62(0.4)^4(0.6)^2\\)","\\(6(0.4)^2(0.6)^4\\)","\\((0.4)^2(0.6)^4\\)"],"A",3,4,"Reasoning","Calculator"),
    q("Statistics","Mean 20, standard deviation 4. Every value becomes \\(y=3x-2\\). New standard deviation?",["12","10","4","14"],"A",3,4,"Reasoning"),
    q("Functions and calculus","For \\(f(x)=x^3-6x^2+9x\\), find stationary x-coordinates.",["\\(x=1,3\\)","\\(x=0,3\\)","\\(x=1,2\\)","\\(x=-1,3\\)"],"A",4,5,"Multi-step","Non-calculator"),
    q("Geometry and trigonometry","A sector has radius 8 and angle 1.2 radians. Find area.",["38.4","76.8","9.6","48"],"A",4,5,"Cross-topic","Calculator"),
    q("Algebra and geometry","The line \\(y=kx+1\\) is tangent to \\(y=x^2-3x+4\\). Find possible \\(k\\).",["\\(-3\\pm2\\sqrt3\\)","\\(-3\\pm\\sqrt3\\)","\\(3\\pm2\\sqrt3\\)","\\(\\pm2\\sqrt3\\)"],"A",5,5,"Cross-topic","Non-calculator")
  ]);

  add("IB|International Baccalaureate|Mathematics AA HL","IB Mathematics: Analysis and Approaches HL Diagnostic",70,[
    q("Complex numbers","Evaluate \\(i^{14}\\).",["-1","1","i","-i"],"A",1,1,"Fluency","Non-calculator"),
    q("Proof","If \\(n\\) is odd, which expression represents \\(n\\)?",["\\(2k+1\\)","\\(2k\\)","\\(k^2\\)","\\(2k+2\\)"],"A",1,1,"Fluency","Non-calculator"),
    q("Functions","If \\(f(x)=\\ln x\\), find \\(f^{-1}(x)\\).",["\\(e^x\\)","\\(\\frac1x\\)","\\(\\log x\\)","\\(x^e\\)"],"A",2,2,"Application"),
    q("Series","Find sum to infinity of \\(6+2+\\frac23+\\cdots\\).",["9","8","12","6"],"A",2,2,"Application","Non-calculator"),
    q("Complex numbers","Write \\(1+i\\) in modulus-argument form.",["\\(\\sqrt2e^{i\\pi/4}\\)","\\(2e^{i\\pi/4}\\)","\\(\\sqrt2e^{i\\pi/2}\\)","\\(e^{i\\pi/4}\\)"],"A",3,3,"Application","Non-calculator"),
    q("Implicit differentiation","For \\(x^2+xy+y^2=7\\), find \\(\\frac{dy}{dx}\\).",["\\(-\\frac{2x+y}{x+2y}\\)","\\(-\\frac{x+2y}{2x+y}\\)","\\(\\frac{2x+y}{x+2y}\\)","\\(-1\\)"],"A",3,3,"Application","Non-calculator"),
    q("Vectors","Find \\((1,2,2)\\cdot(2,-1,3)\\).",["6","8","4","10"],"A",3,4,"Reasoning","Non-calculator"),
    q("Differential equations","Given \\(\\frac{dy}{dx}=3y\\), \\(y(0)=2\\), find \\(y\\).",["\\(2e^{3x}\\)","\\(3e^{2x}\\)","\\(2e^x+3\\)","\\(6e^{3x}\\)"],"A",4,4,"Reasoning"),
    q("Probability","If \\(X\\sim N(50,4^2)\\), standardised value for \\(X=58\\)?",["2","1.5","8","0.5"],"A",3,4,"Reasoning","Calculator"),
    q("Maclaurin series","First three non-zero terms of \\(e^x\\):",["\\(1+x+\\frac{x^2}{2}\\)","\\(x+\\frac{x^2}{2}+\\frac{x^3}{6}\\)","\\(1+x+x^2\\)","\\(1+\\frac{x^2}{2}+\\frac{x^4}{24}\\)"],"A",4,5,"Multi-step","Non-calculator"),
    q("Complex roots","Roots of \\(z^4=16\\) have modulus:",["2","4","16","\\(\\sqrt2\\)"],"A",4,5,"Reasoning","Non-calculator"),
    q("Calculus and geometry","For \\(f(x)=x^3-3x\\), the tangent at \\(x=a\\) passes through the origin. Find non-zero \\(a\\).",["\\(\\pm\\sqrt{\\frac32}\\)","\\(\\pm1\\)","\\(\\pm\\sqrt3\\)","\\(\\pm2\\)"],"A",5,5,"Cross-topic","Non-calculator")
  ]);

  add("IB|International Baccalaureate|Mathematics AI SL","IB Mathematics: Applications and Interpretation SL Diagnostic",60,[
    q("Financial mathematics","Multiplier for a 3% annual increase?",["1.03","0.97","1.3","3"],"A",1,1,"Fluency","Calculator"),
    q("Linear modelling","For \\(y=5x+2\\), what is gradient?",["5","2","7","10"],"A",1,1,"Fluency","Calculator"),
    q("Statistics","Mean is 18. Add 5 to every value. New mean?",["23","18","90","13"],"A",2,2,"Application","Calculator"),
    q("Probability","If \\(P(A)=0.65\\), find \\(P(A')\\).",["0.35","0.65","1.65","0.45"],"A",2,2,"Application","Calculator"),
    q("Exponential modelling","\\(P=800(1.04)^t\\). What does 1.04 represent?",["4% growth per time unit","104% growth","4% decrease","initial population"],"A",2,3,"Interpretation","Calculator"),
    q("Regression","\\(r=-0.92\\) indicates:",["strong negative linear association","weak negative association","strong positive association","no linear association"],"A",2,3,"Interpretation","Calculator"),
    q("Geometry","Circular garden radius 6 m. Find area.",["\\(36\\pi\\text{ m}^2\\)","\\(12\\pi\\text{ m}^2\\)","\\(6\\pi\\text{ m}^2\\)","\\(72\\pi\\text{ m}^2\\)"],"A",3,4,"Application","Calculator"),
    q("Normal distribution","Mean 70, SD 5. Find z-score for 80.",["2","1","10","0.5"],"A",3,4,"Reasoning","Calculator"),
    q("Functions","Taxi fare \\(C=4+1.8d\\). Cost for 12 km?",["25.6","21.6","28.0","19.8"],"A",3,4,"Modelling","Calculator"),
    q("Probability modelling","Independent success probability 0.7. Probability of exactly two successes in three attempts?",["0.441","0.343","0.189","0.784"],"A",4,5,"Multi-step","Calculator"),
    q("Statistics","Regression line \\(y=2.4x+7\\). Prediction when \\(x=15\\)?",["43","36","29.4","49"],"A",4,5,"Modelling","Calculator"),
    q("Financial mathematics","£5000 grows at 4.2% annually for 8 years. Which expression gives final value?",["\\(5000(1.042)^8\\)","\\(5000(0.958)^8\\)","\\(5000+8(0.042)\\)","\\(5000(1.42)^8\\)"],"A",5,5,"Cross-topic","Calculator")
  ]);

  add("IB|International Baccalaureate|Mathematics AI HL","IB Mathematics: Applications and Interpretation HL Diagnostic",70,[
    q("Matrices","Product of a \\(2\\times3\\) and \\(3\\times4\\) matrix has order:",["2×4","3×3","4×2","2×3"],"A",1,1,"Fluency","Calculator"),
    q("Graph theory","A Hamiltonian cycle visits:",["every vertex once and returns to start","every edge once","only odd-degree vertices","shortest path only"],"A",1,1,"Fluency","Calculator"),
    q("Statistics","For \\(X\\sim Po(4)\\), what is \\(E(X)\\)?",["4","2","16","\\(e^{-4}\\)"],"A",2,2,"Application","Calculator"),
    q("Matrices","For \\(A=\\begin{pmatrix}2&1\\\\0&3\\end{pmatrix}\\), find \\(\\det A\\).",["6","5","3","2"],"A",2,2,"Application","Calculator"),
    q("Markov chains","A stochastic transition matrix must have each row or column sum to:",["1","0","100","number of states"],"A",2,3,"Interpretation","Calculator"),
    q("Calculus","Differentiate \\(x^2e^x\\).",["\\(e^x(x^2+2x)\\)","\\(2xe^x\\)","\\(x^2e^x\\)","\\(e^x(x+2)\\)"],"A",3,3,"Application","Calculator"),
    q("Hypothesis testing","p-value 0.018 at 5% significance. Decision?",["reject null hypothesis","accept null as true","increase p-value","automatically use 1%"],"A",3,4,"Reasoning","Calculator"),
    q("Graph theory","Connected graph has 8 vertices, each degree 3. Number of edges?",["12","24","8","16"],"A",3,4,"Reasoning","Calculator"),
    q("Differential equations","If \\(\\frac{dy}{dt}=0.2y\\), \\(y(0)=50\\), find \\(y(t)\\).",["\\(50e^{0.2t}\\)","\\(0.2e^{50t}\\)","\\(50+0.2t\\)","\\(50e^{-0.2t}\\)"],"A",4,4,"Modelling","Calculator"),
    q("Matrices and transformations","Eigenvalues of \\(\\begin{pmatrix}2&0\\\\0&5\\end{pmatrix}\\) are:",["2 and 5","0 and 7","10 and 1","-2 and -5"],"A",4,5,"Reasoning","Calculator"),
    q("Probability distributions","Independent random variables have variances 4 and 9. Variance of their sum?",["13","6","36","5"],"A",4,5,"Multi-step","Calculator"),
    q("Networks","A minimum spanning tree of a connected graph with 10 vertices contains how many edges?",["9","10","11","20"],"A",5,5,"Cross-topic","Calculator")
  ]);

  // validation
  Object.entries(T).forEach(([key,test]) => {
    if (test.questions.length !== 12) console.error(`${key}: ${test.questions.length} questions`);
    test.questions.forEach((x,i) => {
      if (x.options.length !== 4) console.error(`${key} Q${i+1}: bad options`);
      if (!L.includes(x.correct)) console.error(`${key} Q${i+1}: bad correct`);
      if (i && x.difficulty < test.questions[i-1].difficulty) console.warn(`${key}: difficulty falls at Q${i+1}`);
    });
  });

  window.MATHORA_TESTS = T;
})();