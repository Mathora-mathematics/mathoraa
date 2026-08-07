
/*
Mathora Daily Challenge Engine
730-day deterministic rotation per pathway.
Original Mathora questions generated from syllabus-aligned template families.
No backend required.
*/
(() => {
  const TRACKS = {
    "gcse-aqa-f": {label:"AQA GCSE Foundation", family:"gf", board:"AQA"},
    "gcse-aqa-h": {label:"AQA GCSE Higher", family:"gh", board:"AQA"},
    "gcse-edexcel-f": {label:"Pearson Edexcel GCSE Foundation", family:"gf", board:"Pearson Edexcel"},
    "gcse-edexcel-h": {label:"Pearson Edexcel GCSE Higher", family:"gh", board:"Pearson Edexcel"},
    "gcse-ocr-f": {label:"OCR GCSE Foundation", family:"gf", board:"OCR"},
    "gcse-ocr-h": {label:"OCR GCSE Higher", family:"gh", board:"OCR"},
    "gcse-eduqas-f": {label:"WJEC Eduqas GCSE Foundation", family:"gf", board:"WJEC Eduqas"},
    "gcse-eduqas-h": {label:"WJEC Eduqas GCSE Higher", family:"gh", board:"WJEC Eduqas"},
    "igcse-pearson-f": {label:"Pearson International GCSE Foundation", family:"igf", board:"Pearson International GCSE"},
    "igcse-pearson-h": {label:"Pearson International GCSE Higher", family:"igh", board:"Pearson International GCSE"},
    "igcse-cambridge-core": {label:"Cambridge IGCSE Core", family:"igf", board:"Cambridge International"},
    "igcse-cambridge-extended": {label:"Cambridge IGCSE Extended", family:"igh", board:"Cambridge International"},
    "as-aqa": {label:"AQA AS Mathematics", family:"as", board:"AQA"},
    "as-edexcel": {label:"Pearson Edexcel AS Mathematics", family:"as", board:"Pearson Edexcel"},
    "as-ocr": {label:"OCR A AS Mathematics", family:"as", board:"OCR A"},
    "alevel-aqa": {label:"AQA A Level Mathematics", family:"al", board:"AQA"},
    "alevel-edexcel": {label:"Pearson Edexcel A Level Mathematics", family:"al", board:"Pearson Edexcel"},
    "alevel-ocr": {label:"OCR A A Level Mathematics", family:"al", board:"OCR A"},
    "fm-aqa": {label:"AQA Further Mathematics — Compulsory Core", family:"fm", board:"AQA"},
    "fm-edexcel": {label:"Pearson Further Mathematics — Core Pure", family:"fm", board:"Pearson Edexcel"},
    "fm-ocr": {label:"OCR A Further Mathematics — Pure Core", family:"fm", board:"OCR A"},
    "ib-aa-sl": {label:"IB Mathematics AA SL", family:"aa-sl", board:"IB"},
    "ib-aa-hl": {label:"IB Mathematics AA HL", family:"aa-hl", board:"IB"},
    "ib-ai-sl": {label:"IB Mathematics AI SL", family:"ai-sl", board:"IB"},
    "ib-ai-hl": {label:"IB Mathematics AI HL", family:"ai-hl", board:"IB"}
  };

  const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
  const simplify=(a,b)=>{const g=gcd(a,b);return [a/g,b/g]};
  const f=n=>Number.isInteger(n)?String(n):String(Number(n.toFixed(3)));
  const dayParts=(index,count)=>{
    const t=index%count, cycle=Math.floor(index/count);
    return {t,cycle,a:2+(cycle%7),b:3+(Math.floor(cycle/7)%7),c:1+(cycle%5),d:4+(cycle%9)};
  };
  const cleanAnswer=s=>String(s).replace(/\\\(|\\\)|\\text\{[^}]*\}|\\,/g,"").replace(/\s+/g,"").toLowerCase();

  function C({topic,difficulty,time=3,question,context="",hint,answer,accepted=[],steps,mistake,tip}){
    const worked=[...steps];
    worked.push(`Final answer: ${answer}`);
    return {topic,difficulty,time,question,context,hint,answer,accepted:[answer,...accepted],steps:worked,mistake,tip,specArea:topic};
  }

  // GCSE FOUNDATION: 12 rotating families
  function gf(index){
    const p=dayParts(index,12), {t,cycle,a,b,c,d}=p;
    switch(t){
      case 0:{
        const pct=[10,15,20,25,30,35][cycle%6], n=40+10*(2+(cycle%12)), ans=n*pct/100;
        return C({topic:"Percentages",difficulty:1,time:2,question:`Calculate \\(${pct}\\%\\) of \\(${n}\\).`,
          hint:`Convert \\(${pct}\\%\\) to a fraction or decimal, then multiply by \\(${n}\\).`,
          answer:f(ans),steps:[`\\(${pct}\\%=${pct/100}\\)`,`\\(${pct/100}\\times${n}=${f(ans)}\\)`],
          mistake:"Subtracting the percentage from the number instead of finding the percentage of it.",
          tip:"For 10%, 20%, 25% and 50%, use efficient mental fractions where possible."});
      }
      case 1:{
        const x=4+(cycle%9), m=2+(cycle%5), c0=3+(cycle%7), rhs=m*x+c0;
        return C({topic:"Linear equations",difficulty:2,time:2,question:`Solve \\(${m}x+${c0}=${rhs}\\).`,
          hint:`Undo the \\(+${c0}\\) first.`,answer:String(x),steps:[`\\(${m}x=${rhs-c0}\\)`,`\\(x=${x}\\)`],
          mistake:"Dividing before removing the constant term.",tip:"Keep both sides balanced at every step."});
      }
      case 2:{
        const r1=2+(cycle%4),r2=3+(Math.floor(cycle/4)%4),unit=8+(cycle%6),total=(r1+r2)*unit;
        return C({topic:"Ratio",difficulty:2,time:3,question:`Share \\(${total}\\) in the ratio \\(${r1}:${r2}\\).`,
          hint:`First find the value of one ratio part.`,answer:`${r1*unit} and ${r2*unit}`,
          accepted:[`${r1*unit},${r2*unit}`],steps:[`Total parts \\(=${r1+r2}\\)`,`One part \\(=${total}\\div${r1+r2}=${unit}\\)`,`Shares: \\(${r1*unit}\\) and \\(${r2*unit}\\)`],
          mistake:"Dividing the total by one of the ratio numbers rather than by the total number of parts.",tip:"Always write the total number of ratio parts first."});
      }
      case 3:{
        const l=5+(cycle%8),w=3+(Math.floor(cycle/8)%5),area=l*w;
        return C({topic:"Area",difficulty:2,time:2,question:`A rectangle is \\(${l}\\text{ cm}\\) by \\(${w}\\text{ cm}\\). Find its area.`,
          hint:"Area of a rectangle = length × width.",answer:`${area} cm²`,accepted:[String(area)],
          steps:[`\\(A=${l}\\times${w}\\)`,`\\(A=${area}\\text{ cm}^2\\)`],
          mistake:"Using the perimeter formula instead of the area formula.",tip:"Check the unit: area must use square units."});
      }
      case 4:{
        const red=2+(cycle%7),blue=5+(Math.floor(cycle/7)%6),[n1,n2]=simplify(red,red+blue);
        return C({topic:"Probability",difficulty:2,time:2,question:`A bag contains \\(${red}\\) red and \\(${blue}\\) blue counters. One is chosen at random. Find \\(P(\\text{red})\\).`,
          hint:"Probability = favourable outcomes ÷ total outcomes.",answer:`${n1}/${n2}`,accepted:[`\\frac{${n1}}{${n2}}`],
          steps:[`Total counters \\(=${red+blue}\\)`,`\\(P(\\text{red})=\\frac{${red}}{${red+blue}}=\\frac{${n1}}{${n2}}\\)`],
          mistake:"Using the number of blue counters as the denominator.",tip:"The denominator is the total number of equally likely outcomes."});
      }
      case 5:{
        const vals=[4+a,6+a,8+b,10+b,12+c],mean=vals.reduce((x,y)=>x+y,0)/5;
        return C({topic:"Statistics",difficulty:3,time:3,question:`Find the mean of \\(${vals.join(", ")}\\).`,
          hint:"Add all five values, then divide by 5.",answer:f(mean),steps:[`Sum \\(=${vals.reduce((x,y)=>x+y,0)}\\)`,`Mean \\(=${vals.reduce((x,y)=>x+y,0)}\\div5=${f(mean)}\\)`],
          mistake:"Dividing by the range or by the sum instead of by the number of values.",tip:"Write the number of data values beside your total before dividing."});
      }
      case 6:{
        const speed=35+5*(cycle%10),time=2+(Math.floor(cycle/10)%4),dist=speed*time;
        return C({topic:"Compound measures",difficulty:3,time:3,question:`A vehicle travels \\(${dist}\\text{ km}\\) in \\(${time}\\) hours at constant speed. Find its speed.`,
          hint:"Speed = distance ÷ time.",answer:`${speed} km/h`,accepted:[String(speed)],
          steps:[`\\(v=\\frac{${dist}}{${time}}\\)`,`\\(v=${speed}\\text{ km/h}\\)`],
          mistake:"Multiplying distance by time.",tip:"Use units to check the operation: km ÷ h gives km/h."});
      }
      case 7:{
        const original=80+10*(cycle%10),pct=[10,15,20,25][cycle%4],final=original*(1+pct/100);
        return C({topic:"Reverse percentages",difficulty:4,time:4,question:`After an increase of \\(${pct}\\%\\), a price is £${f(final)}. Find the original price.`,
          hint:`The final price represents \\(${100+pct}\\%\\) of the original.`,answer:`£${original}`,accepted:[String(original)],
          steps:[`Multiplier \\(=${1+pct/100}\\)`,`Original \\(=${f(final)}\\div${1+pct/100}=${original}\\)`],
          mistake:"Subtracting the percentage of the final price; reverse percentage needs division by the multiplier.",tip:"Ask: what percentage of the original does the final value represent?"});
      }
      case 8:{
        const a1=35+(cycle%7)*5,a2=55+(Math.floor(cycle/7)%7)*5,x=180-a1-a2;
        return C({topic:"Angles",difficulty:3,time:2,question:`The angles in a triangle are \\(${a1}^\\circ\\), \\(${a2}^\\circ\\) and \\(x^\\circ\\). Find \\(x\\).`,
          hint:"Angles in a triangle total 180°.",answer:`${x}°`,accepted:[String(x)],
          steps:[`\\(x=180-${a1}-${a2}\\)`,`\\(x=${x}^\\circ\\)`],mistake:"Using 360° instead of 180°.",
          tip:"Write the angle fact before substituting values."});
      }
      case 9:{
        const x=4+(cycle%8),add=3+(Math.floor(cycle/8)%5),per=2*(x+x+add),area=x*(x+add);
        return C({topic:"Algebra and geometry",difficulty:4,time:4,question:`A rectangle has sides \\(x\\) cm and \\((x+${add})\\) cm. Its perimeter is \\(${per}\\) cm. Find its area.`,
          hint:"Use the perimeter first to find x, then calculate the area.",answer:`${area} cm²`,accepted:[String(area)],
          steps:[`\\(2[x+(x+${add})]=${per}\\)`,`\\(4x+${2*add}=${per}\\Rightarrow x=${x}\\)`,`Area \\(=${x}(${x+add})=${area}\\text{ cm}^2\\)`],
          mistake:"Finding x correctly but forgetting that the question asks for area.",tip:"Circle the final instruction in multi-step questions."});
      }
      case 10:{
        const m=2+(cycle%5),cc=1+(cycle%8),xx=2+(Math.floor(cycle/8)%7),yy=m*xx+cc;
        return C({topic:"Linear graphs",difficulty:3,time:3,question:`For the line \\(y=${m}x+${cc}\\), find \\(y\\) when \\(x=${xx}\\).`,
          hint:"Substitute the x-value into the equation.",answer:String(yy),steps:[`\\(y=${m}(${xx})+${cc}\\)`,`\\(y=${yy}\\)`],
          mistake:"Adding x and the gradient instead of multiplying.",tip:"Put substituted negative numbers in brackets."});
      }
      default:{
        const h=5+(cycle%7),base=6+(Math.floor(cycle/7)%7),tri=0.5*base*h;
        return C({topic:"Multi-step geometry",difficulty:4,time:4,question:`A triangle has base \\(${base}\\text{ cm}\\) and perpendicular height \\(${h}\\text{ cm}\\). A second identical triangle is joined to it. Find the total area.`,
          hint:"Find one triangle’s area, then double it.",answer:`${tri*2} cm²`,accepted:[String(tri*2)],
          steps:[`One triangle: \\(\\frac12\\times${base}\\times${h}=${f(tri)}\\)`,`Two triangles: \\(${f(tri)}\\times2=${f(tri*2)}\\text{ cm}^2\\)`],
          mistake:"Forgetting the factor of one-half for a triangle, or forgetting there are two triangles.",tip:"Break compound shapes into familiar parts and label each area."});
      }
    }
  }

  // GCSE HIGHER / IGCSE EXTENDED shared higher-demand generator
  function gh(index){
    const {t,cycle,a,b}=dayParts(index,14);
    switch(t){
      case 0:{
        const n=[8,18,32,50,72,98][cycle%6];
        let coeff,root;
        if(n===8){coeff=2;root=2}else if(n===18){coeff=3;root=2}else if(n===32){coeff=4;root=2}else if(n===50){coeff=5;root=2}else if(n===72){coeff=6;root=2}else{coeff=7;root=2}
        return C({topic:"Surds",difficulty:2,time:2,question:`Simplify \\(\\sqrt{${n}}\\).`,hint:"Look for the largest square factor.",
          answer:`${coeff}√${root}`,accepted:[`${coeff}sqrt${root}`],steps:[`\\(\\sqrt{${n}}=\\sqrt{${coeff*coeff}\\times${root}}\\)`,`\\(=${coeff}\\sqrt${root}\\)`],
          mistake:"Taking the square root of only one factor without simplifying fully.",tip:"Search for 4, 9, 16, 25, 36 or 49 as square factors."});
      }
      case 1:{
        const r1=2+(cycle%6),r2=-(3+(Math.floor(cycle/6)%6)),sum=r1+r2,prod=r1*r2;
        return C({topic:"Quadratics",difficulty:3,time:3,question:`Solve \\(x^2${-sum>=0?"+":""}${-sum}x${prod>=0?"+":""}${prod}=0\\).`,
          hint:"Factorise using two numbers whose product is the constant term.",answer:`x=${r1} or x=${r2}`,
          steps:[`\\((x-${r1})(x${-r2>=0?"+":""}${-r2})=0\\)`,`\\(x=${r1}\\) or \\(x=${r2}\\)`],
          mistake:"Changing one sign incorrectly when converting factors to roots.",tip:"Check the roots by substituting them back."});
      }
      case 2:{
        const m=2+(cycle%4),c=1+(cycle%5),x=-3+(cycle%7),ans=m*x*x+c;
        return C({topic:"Functions",difficulty:2,time:3,question:`Given \\(f(x)=${m}x^2+${c}\\), find \\(f(${x})\\).`,
          hint:"Substitute the x-value carefully; square it before multiplying.",answer:String(ans),steps:[`\\(f(${x})=${m}(${x})^2+${c}\\)`,`\\(=${ans}\\)`],
          mistake:"For a negative input, treating \\((-x)^2\\) as negative.",tip:"Always bracket a negative number when substituting."});
      }
      case 3:{
        const centre=90+2*(cycle%41),ans=centre/2;
        return C({topic:"Circle theorems",difficulty:3,time:3,question:`An angle at the centre is \\(${centre}^\\circ\\). Find the angle at the circumference standing on the same arc.`,
          hint:"The angle at the centre is twice the angle at the circumference.",answer:`${ans}°`,accepted:[String(ans)],
          steps:[`Angle at circumference \\(=${centre}\\div2\\)`,`\\(=${ans}^\\circ\\)`],
          mistake:"Doubling instead of halving.",tip:"State the circle theorem explicitly in written working."});
      }
      case 4:{
        const p=(20+(cycle%6)*10)/100,q=(20+(Math.floor(cycle/6)%5)*10)/100,ans=p*q;
        return C({topic:"Probability",difficulty:3,time:3,question:`Independent events \\(A\\) and \\(B\\) have \\(P(A)=${p}\\) and \\(P(B)=${q}\\). Find \\(P(A\\cap B)\\).`,
          hint:"For independent events, multiply the probabilities.",answer:f(ans),steps:[`\\(P(A\\cap B)=${p}\\times${q}\\)`,`\\(=${f(ans)}\\)`],
          mistake:"Adding independent probabilities.",tip:"Intersection + independence usually signals multiplication."});
      }
      case 5:{
        const a0=2+(cycle%4),b0=3+(Math.floor(cycle/4)%4),den=a0+b0;
        return C({topic:"Vectors",difficulty:4,time:4,question:`Point \\(P\\) divides \\(AB\\) internally in the ratio \\(AP:PB=${a0}:${b0}\\). If \\(\\overrightarrow{OA}=\\mathbf a\\) and \\(\\overrightarrow{OB}=\\mathbf b\\), find \\(\\overrightarrow{OP}\\).`,
          hint:"The endpoint with the larger opposite ratio coefficient gets the larger weight.",answer:`(${b0}/${den})a + (${a0}/${den})b`,
          steps:[`\\(\\overrightarrow{AP}=\\frac{${a0}}{${den}}(\\mathbf b-\\mathbf a)\\)`,`\\(\\overrightarrow{OP}=\\mathbf a+\\overrightarrow{AP}=\\frac{${b0}}{${den}}\\mathbf a+\\frac{${a0}}{${den}}\\mathbf b\\)`],
          mistake:"Using the ratio coefficients on the same endpoint instead of the opposite endpoint.",tip:"Check the result lies between A and B: coefficients should add to 1."});
      }
      case 6:{
        const chord=8+2*(cycle%7),dist=3+(Math.floor(cycle/7)%6),r=Math.sqrt((chord/2)**2+dist**2);
        return C({topic:"Circle geometry",difficulty:4,time:4,question:`A chord is \\(${chord}\\) cm long and is \\(${dist}\\) cm from the centre. Find the radius.`,
          hint:"A perpendicular from the centre bisects the chord.",answer:`${f(r)} cm`,accepted:[f(r)],
          steps:[`Half-chord \\(=${chord/2}\\)`,`\\(r^2=${chord/2}^2+${dist}^2\\)`,`\\(r=${f(r)}\\text{ cm}\\)`],
          mistake:"Using the full chord length in the right triangle.",tip:"Mark the right angle and half-chord before using Pythagoras."});
      }
      case 7:{
        const k=2+(cycle%6),c0=1+(Math.floor(cycle/6)%5),disc=k*k+4*c0;
        return C({topic:"Graphs and algebra",difficulty:5,time:5,question:`The line \\(y=${k}x+${c0}\\) meets \\(y=x^2\\) at \\(x=\\alpha\\) and \\(x=\\beta\\). Find \\((\\alpha-\\beta)^2\\).`,
          hint:"Form the quadratic for the intersections, then use the relationship between roots.",answer:String(disc),
          steps:[`\\(x^2-${k}x-${c0}=0\\)`,`\\((\\alpha-\\beta)^2=(\\alpha+\\beta)^2-4\\alpha\\beta\\)`,`\\(=${k}^2-4(-${c0})=${disc}\\)`],
          mistake:"Using the discriminant formula with the wrong sign for the constant term.",tip:"For a quadratic, the squared difference of roots equals the discriminant divided by \\(a^2\\); here \\(a=1\\)."});
      }
      case 8:{
        const n=5+(cycle%6),r=2+(cycle%3),p=[0.2,0.3,0.4,0.5][cycle%4];
        return C({topic:"Binomial probability",difficulty:4,time:4,question:`If \\(X\\sim B(${n},${p})\\), write an expression for \\(P(X=${r})\\).`,
          hint:"Use \\(\\binom nr p^r(1-p)^{n-r}\\).",answer:`C(${n},${r})(${p})^${r}(${f(1-p)})^${n-r}`,
          steps:[`\\(P(X=${r})=\\binom{${n}}{${r}}(${p})^{${r}}(${f(1-p)})^{${n-r}}\\)`],
          mistake:"Swapping the powers of p and 1−p.",tip:"The power of p equals the number of successes requested."});
      }
      case 9:{
        const interior=[144,150,156,160,162,165][cycle%6],exterior=180-interior,n=360/exterior;
        return C({topic:"Polygons",difficulty:3,time:3,question:`The interior angle of a regular polygon is \\(${interior}^\\circ\\). How many sides does it have?`,
          hint:"Find the exterior angle first.",answer:String(n),steps:[`Exterior angle \\(=180-${interior}=${exterior}^\\circ\\)`,`Number of sides \\(=360\\div${exterior}=${n}\\)`],
          mistake:"Dividing 360 directly by the interior angle.",tip:"For regular polygons, exterior angles always total 360°."});
      }
      case 10:{
        const k=2+(cycle%7),constant=(k*k)/4;
        return C({topic:"Tangency and discriminant",difficulty:5,time:5,question:`The equation \\(x^2+${k}x+c=0\\) has equal roots. Find \\(c\\).`,
          hint:"Equal roots mean discriminant = 0.",answer:f(constant),steps:[`\\(b^2-4ac=0\\)`,`\\(${k}^2-4c=0\\)`,`\\(c=${f(constant)}\\)`],
          mistake:"Setting the quadratic itself equal to zero is not enough; the repeated-root condition is on the discriminant.",tip:"The phrase 'equal roots' should trigger \\(b^2-4ac=0\\)."});
      }
      case 11:{
        const sf=2+(cycle%4),small=20+4*(cycle%8),large=small*sf*sf;
        return C({topic:"Similarity",difficulty:4,time:4,question:`Two similar shapes have length scale factor \\(1:${sf}\\). The smaller area is \\(${small}\\text{ cm}^2\\). Find the larger area.`,
          hint:"Area scale factor is the square of the length scale factor.",answer:`${large} cm²`,accepted:[String(large)],
          steps:[`Area scale factor \\(=${sf}^2=${sf*sf}\\)`,`Larger area \\(=${small}\\times${sf*sf}=${large}\\text{ cm}^2\\)`],
          mistake:"Multiplying area by the length scale factor instead of its square.",tip:"Length → square for area → cube for volume."});
      }
      case 12:{
        const a0=5+(cycle%7),b0=7+(cycle%8),angle=30+5*(cycle%9);
        const area=.5*a0*b0*Math.sin(angle*Math.PI/180);
        return C({topic:"Trigonometry",difficulty:4,time:4,question:`Two sides of a triangle are \\(${a0}\\) cm and \\(${b0}\\) cm with included angle \\(${angle}^\\circ\\). Find its area.`,
          hint:"Use \\(A=\\frac12ab\\sin C\\).",answer:`${f(area)} cm²`,accepted:[f(area)],
          steps:[`\\(A=\\frac12(${a0})(${b0})\\sin${angle}^\\circ\\)`,`\\(A=${f(area)}\\text{ cm}^2\\)`],
          mistake:"Using cosine instead of sine in the area formula.",tip:"The sine area formula requires the included angle between the two known sides."});
      }
      default:{
        const x=2+(cycle%7),add=2+(cycle%5),area=x*(x+add);
        return C({topic:"Algebraic modelling",difficulty:5,time:5,question:`A rectangle has sides \\(x\\) cm and \\((x+${add})\\) cm and area \\(${area}\\text{ cm}^2\\). Find the positive value of \\(x\\).`,
          hint:"Form and solve a quadratic equation.",answer:String(x),steps:[`\\(x(x+${add})=${area}\\)`,`\\(x^2+${add}x-${area}=0\\)`,`Factorise or solve to obtain positive root \\(x=${x}\\)`],
          mistake:"Keeping the negative root even though x represents a length.",tip:"Always interpret algebraic roots in the context of the question."});
      }
    }
  }

  // AS / AA SL
  function asGen(index){
    const {t,cycle}=dayParts(index,12);
    switch(t){
      case 0:{const x=2+(cycle%7),a=2+(cycle%4),b=1+(cycle%5),ans=a*x*x+b;
        return C({topic:"Functions",difficulty:2,time:3,question:`Given \\(f(x)=${a}x^2+${b}\\), find \\(f(${x})\\).`,hint:"Substitute x into the function.",answer:String(ans),
          steps:[`\\(f(${x})=${a}(${x})^2+${b}\\)`,`\\(=${ans}\\)`],mistake:"Forgetting to square the input before multiplying.",tip:"Use brackets when substituting values into functions."});}
      case 1:{const u1=4+(cycle%8),d=2+(cycle%5),n=8+(cycle%8),ans=u1+(n-1)*d;
        return C({topic:"Sequences and series",difficulty:2,time:3,question:`An arithmetic sequence has first term \\(${u1}\\) and common difference \\(${d}\\). Find \\(u_{${n}}\\).`,
          hint:"Use \\(u_n=a+(n-1)d\\).",answer:String(ans),steps:[`\\(u_{${n}}=${u1}+(${n}-1)(${d})\\)`,`\\(=${ans}\\)`],
          mistake:"Using nd instead of (n−1)d.",tip:"The first term already corresponds to n=1, so only n−1 jumps are made."});}
      case 2:{const base=[2,3,4,5][cycle%4],power=2+(cycle%4),rhs=base**power;
        return C({topic:"Exponentials and logarithms",difficulty:2,time:3,question:`Solve \\(${base}^x=${rhs}\\).`,hint:"Write the right side as a power of the same base.",answer:String(power),
          steps:[`\\(${rhs}=${base}^{${power}}\\)`,`So \\(x=${power}\\)`],mistake:"Multiplying the base by the exponent.",tip:"Before using logarithms, check whether both sides can be written with the same base."});}
      case 3:{const a=2+(cycle%5),b=3+(cycle%6),x=1+(cycle%5),grad=3*a*x*x-b;
        return C({topic:"Differentiation",difficulty:3,time:4,question:`Find the gradient of \\(y=${a}x^3-${b}x\\) at \\(x=${x}\\).`,hint:"Differentiate first, then substitute the x-value.",answer:String(grad),
          steps:[`\\(\\frac{dy}{dx}=${3*a}x^2-${b}\\)`,`At \\(x=${x}\\): \\(${3*a}(${x})^2-${b}=${grad}\\)`],
          mistake:"Substituting x before differentiating.",tip:"For gradient-at-a-point questions: derivative first, value second."});}
      case 4:{const a=1+(cycle%4),b=1+(cycle%5),upper=2+(cycle%4),ans=a*upper**3/3+b*upper;
        return C({topic:"Integration",difficulty:3,time:4,question:`Evaluate \\(\\int_0^{${upper}}(${a}x^2+${b})\\,dx\\).`,hint:"Integrate each term, then use the limits.",answer:f(ans),
          steps:[`\\(\\int(${a}x^2+${b})dx=\\frac{${a}}3x^3+${b}x\\)`,`At \\(${upper}\\): \\(${f(ans)}\\); at 0: 0`,`Integral \\(=${f(ans)}\\)`],
          mistake:"Forgetting to divide by the new power when integrating.",tip:"After integrating, differentiate mentally to check the antiderivative."});}
      case 5:{const A=20+5*(cycle%8),sol2=180-A;
        return C({topic:"Trigonometry",difficulty:3,time:3,question:`Solve \\(\\sin x=\\sin ${A}^\\circ\\) for \\(0\\le x\\le180^\\circ\\).`,hint:"Sine is positive in quadrants I and II.",answer:`${A}°, ${sol2}°`,
          accepted:[`${A},${sol2}`],steps:[`First solution \\(x=${A}^\\circ\\)`,`Second solution \\(x=180-${A}=${sol2}^\\circ\\)`],
          mistake:"Giving only the principal solution.",tip:"Always use the stated interval to check for additional trigonometric solutions."});}
      case 6:{const n=5+(cycle%4),r=2+(cycle%2),p=[0.2,0.3,0.4,0.5][cycle%4];
        return C({topic:"Binomial distribution",difficulty:4,time:4,question:`If \\(X\\sim B(${n},${p})\\), write an expression for \\(P(X=${r})\\).`,
          hint:"Use the binomial probability formula.",answer:`C(${n},${r})(${p})^${r}(${f(1-p)})^${n-r}`,
          steps:[`\\(P(X=${r})=\\binom{${n}}{${r}}(${p})^{${r}}(${f(1-p)})^{${n-r}}\\)`],
          mistake:"Using the wrong power for the failure probability.",tip:"The exponents must add to n."});}
      case 7:{const mean=50+5*(cycle%8),sd=3+(cycle%5),x=mean+2*sd;
        return C({topic:"Normal distribution",difficulty:3,time:3,question:`A normal distribution has mean \\(${mean}\\) and standard deviation \\(${sd}\\). Find the z-score for \\(x=${x}\\).`,
          hint:"Use \\(z=\\frac{x-\\mu}{\\sigma}\\).",answer:"2",steps:[`\\(z=\\frac{${x}-${mean}}{${sd}}\\)`,`\\(z=2\\)`],
          mistake:"Dividing x by the standard deviation without subtracting the mean.",tip:"Standardisation measures distance from the mean in standard deviations."});}
      case 8:{const a=1+(cycle%4),b=2+(cycle%5),t=2+(cycle%5),acc=2*a*t-b;
        return C({topic:"Kinematics",difficulty:4,time:4,question:`A particle has velocity \\(v=${a}t^2-${b}t+3\\). Find its acceleration at \\(t=${t}\\).`,
          hint:"Acceleration is the derivative of velocity.",answer:String(acc),steps:[`\\(a=\\frac{dv}{dt}=${2*a}t-${b}\\)`,`At \\(t=${t}\\), \\(a=${acc}\\)`],
          mistake:"Using velocity itself as acceleration.",tip:"Displacement → differentiate → velocity → differentiate → acceleration."});}
      case 9:{const mass=2+(cycle%8),acc=2+(cycle%6),force=mass*acc;
        return C({topic:"Forces and Newton's laws",difficulty:3,time:3,question:`A particle of mass \\(${mass}\\) kg has acceleration \\(${acc}\\text{ m s}^{-2}\\). Find the resultant force.`,
          hint:"Use F = ma.",answer:`${force} N`,accepted:[String(force)],steps:[`\\(F=${mass}\\times${acc}\\)`,`\\(F=${force}\\text{ N}\\)`],
          mistake:"Adding mass and acceleration.",tip:"Include the direction or sign when a force question gives opposing forces."});}
      case 10:{const m=2+(cycle%5),c=1+(cycle%7),x=2+(cycle%5),y=m*x+c;
        return C({topic:"Coordinate geometry",difficulty:2,time:3,question:`The line \\(y=${m}x+${c}\\) passes through \\((x,y)\\). Find y when \\(x=${x}\\).`,
          hint:"Substitute the x-coordinate.",answer:String(y),steps:[`\\(y=${m}(${x})+${c}\\)`,`\\(y=${y}\\)`],
          mistake:"Confusing the gradient with the y-intercept.",tip:"In y=mx+c, m controls change and c is the value when x=0."});}
      default:{const a=2+(cycle%5),b=3+(cycle%5),root=1+(cycle%4),c=-(root*root+a*root+b);
        return C({topic:"Synoptic algebra and calculus",difficulty:5,time:5,question:`The curve \\(y=x^3+${a}x^2+${b}x${c>=0?"+":""}${c}\\) passes through the x-axis at \\(x=${root}\\). Which statement is necessarily true?`,
          hint:"A root means the function value is zero at that x.",answer:`f(${root})=0`,
          steps:[`Since \\(x=${root}\\) is an x-intercept, \\(y=0\\) there.`,`Therefore \\(f(${root})=0\\).`],
          mistake:"Confusing an x-intercept with a stationary point.",tip:"Root/intercept means f(x)=0; stationary point means f′(x)=0."});}
    }
  }

  // A LEVEL
  function alGen(index){
    const p=dayParts(index,14),{t,cycle}=p;
    if(t<10) return asGen(index + 97); // varied foundation-to-medium A-level content
    switch(t){
      case 10:{const a=2+(cycle%5);
        return C({topic:"Product rule",difficulty:4,time:4,question:`Differentiate \\(x^${a}\\ln x\\).`,hint:"Use the product rule with u=x^a and v=ln x.",
          answer:`${a}x^${a-1}lnx + x^${a-1}`,steps:[`\\(u=x^${a},\\ u'=${a}x^${a-1}\\)`,`\\(v=\\ln x,\\ v'=1/x\\)`,`\\(y'=${a}x^${a-1}\\ln x+x^${a-1}\\)`],
          mistake:"Differentiating each factor separately and multiplying the derivatives.",tip:"Product of functions → product rule, not product of derivatives."});}
      case 11:{const a=1+(cycle%4);
        return C({topic:"Integration by substitution",difficulty:4,time:5,question:`Evaluate \\(\\int x e^{${a}x^2}\\,dx\\).`,hint:`Let \\(u=${a}x^2\\).`,
          answer:`(1/${2*a})e^(${a}x²)+C`,steps:[`Let \\(u=${a}x^2\\), so \\(du=${2*a}x\\,dx\\).`,`\\(x\\,dx=\\frac1{${2*a}}du\\)`,`Integral \\(=\\frac1{${2*a}}e^u+C=\\frac1{${2*a}}e^{${a}x^2}+C\\)`],
          mistake:"Forgetting the constant factor created by du.",tip:"After substitution, every x and dx should disappear."});}
      case 12:{const p0=0.01*(1+(cycle%8)),alpha=.05;
        return C({topic:"Hypothesis testing",difficulty:4,time:4,question:`A test at the \\(5\\%\\) significance level gives p-value \\(${p0.toFixed(2)}\\). What is the correct decision?`,
          hint:"Compare the p-value with 0.05.",answer:p0<alpha?"Reject H0":"Do not reject H0",
          steps:[`Significance level \\(=0.05\\).`,`p-value \\(=${p0.toFixed(2)}\\).`,p0<alpha?"Since p < 0.05, reject \\(H_0\\).":"Since p ≥ 0.05, do not reject \\(H_0\\)."],
          mistake:"Saying the null hypothesis has been 'proved' true or false.",tip:"Use the language reject / do not reject, not prove / accept."});}
      default:{const a=2+(cycle%5),b=1+(cycle%5),x=1+(cycle%4),v=a*x*x+b,acc=2*a*x;
        return C({topic:"Mechanics and calculus",difficulty:5,time:5,question:`A particle has velocity \\(v=${a}t^2+${b}\\). Find its acceleration when \\(t=${x}\\).`,
          hint:"Differentiate velocity with respect to time.",answer:`${acc} m/s²`,accepted:[String(acc)],
          steps:[`\\(a=\\frac{dv}{dt}=${2*a}t\\)`,`At \\(t=${x}\\), \\(a=${acc}\\text{ m s}^{-2}\\)`],
          mistake:"Substituting t into velocity and reporting that value as acceleration.",tip:"Always identify the quantity requested before differentiating or integrating."});}
    }
  }

  // FURTHER MATHS
  function fmGen(index){
    const {t,cycle}=dayParts(index,12);
    switch(t){
      case 0:{const p=[5,7,11,13][cycle%4]; const rem=(2*cycle+5)%4; const exp=4*(1+cycle%8)+rem;
        const vals=["1","i","-1","-i"],ans=vals[exp%4];
        return C({topic:"Complex numbers",difficulty:2,time:2,question:`Evaluate \\(i^{${exp}}\\).`,hint:"Powers of i repeat every 4.",answer:ans,
          steps:[`\\(${exp}\\equiv${exp%4}\\pmod4\\)`,`Therefore \\(i^{${exp}}=${ans}\\).`],mistake:"Trying to multiply i repeatedly instead of using the cycle.",tip:"Reduce powers of i modulo 4 first."});}
      case 1:{const a=2+(cycle%6),d=3+(cycle%5),b=1+(cycle%4),c=2+(cycle%5),det=a*d-b*c;
        return C({topic:"Matrices",difficulty:2,time:3,question:`Find \\(\\det\\begin{pmatrix}${a}&${b}\\\\${c}&${d}\\end{pmatrix}\\).`,hint:"For a 2×2 matrix, determinant = ad − bc.",answer:String(det),
          steps:[`\\(\\det A=(${a})(${d})-(${b})(${c})\\)`,`\\(=${det}\\)`],mistake:"Adding the diagonal products.",tip:"Write ad−bc before substituting values."});}
      case 2:{const re=2+(cycle%6),im=3+(cycle%8),mod=Math.sqrt(re*re+im*im);
        return C({topic:"Complex numbers",difficulty:3,time:3,question:`Find the modulus of \\(${re}+${im}i\\).`,hint:"Use Pythagoras in the Argand diagram.",answer:f(mod),steps:[`\\(|z|=\\sqrt{${re}^2+${im}^2}\\)`,`\\(=${f(mod)}\\)`],
          mistake:"Adding the real and imaginary parts.",tip:"Modulus is distance from the origin."});}
      case 3:{const a=2+(cycle%5),b=3+(cycle%6);
        return C({topic:"Roots of polynomials",difficulty:3,time:3,question:`The roots of \\(x^2-${a+b}x+${a*b}=0\\) are \\(\\alpha,\\beta\\). Find \\(\\alpha+\\beta\\).`,
          hint:"Use Vieta's formula.",answer:String(a+b),steps:[`For \\(x^2+Bx+C=0\\), sum of roots \\(=-B\\).`,`Here sum \\(=${a+b}\\).`],
          mistake:"Using the constant term for the sum.",tip:"For a monic quadratic: sum = −coefficient of x, product = constant."});}
      case 4:{const a=1+(cycle%5),b=2+(cycle%5);
        return C({topic:"Differential equations",difficulty:4,time:4,question:`Solve \\(\\frac{dy}{dx}=${a}y\\), given \\(y(0)=${b}\\).`,
          hint:"Separate variables or recognise exponential growth.",answer:`y=${b}e^(${a}x)`,
          steps:[`\\(\\frac1y dy=${a}\\,dx\\)`,`\\(\\ln y=${a}x+C\\)`,`\\(y=Ae^{${a}x}\\)`,`Using \\(y(0)=${b}\\), \\(A=${b}\\).`],
          mistake:"Writing y=ax+b as if the differential equation were linear in x.",tip:"dy/dx proportional to y gives an exponential solution."});}
      case 5:{const n=2+(cycle%5),coeff=(2**n)/mathFactorial(n);
        return C({topic:"Maclaurin series",difficulty:4,time:4,question:`Find the coefficient of \\(x^${n}\\) in the Maclaurin series of \\(e^{2x}\\).`,
          hint:"Use \\(e^u=\\sum u^n/n!\\).",answer:f(coeff),steps:[`\\(e^{2x}=\\sum\\frac{(2x)^r}{r!}\\)`,`Coefficient of \\(x^${n}\\) is \\(\\frac{2^${n}}{${n}!}=${f(coeff)}\\).`],
          mistake:"Forgetting to raise the 2 to the same power as x.",tip:"Substitute u=2x into the standard Maclaurin expansion carefully."});}
      case 6:{const r=2+(cycle%5),power=4+(cycle%5),rhs=r**power;
        return C({topic:"Complex roots",difficulty:4,time:4,question:`The roots of \\(z^${power}=${rhs}\\) lie on a circle. Find its radius.`,
          hint:"The modulus of every root is the nth root of the RHS modulus.",answer:String(r),steps:[`\\(|z|^${power}=${rhs}\\)`,`\\(|z|=${rhs}^{1/${power}}=${r}\\)`],
          mistake:"Using the right-hand side itself as the radius.",tip:"All nth roots of a complex number lie equally spaced on a circle."});}
      case 7:{const l1=2+(cycle%6),l2=3+(cycle%7);
        return C({topic:"Eigenvalues",difficulty:4,time:3,question:`Find the eigenvalues of \\(\\begin{pmatrix}${l1}&0\\\\0&${l2}\\end{pmatrix}\\).`,
          hint:"For a diagonal matrix, eigenvalues are its diagonal entries.",answer:`${l1}, ${l2}`,steps:[`Characteristic equation: \\((\\lambda-${l1})(\\lambda-${l2})=0\\)`,`So \\(\\lambda=${l1},${l2}\\).`],
          mistake:"Multiplying the diagonal entries and giving only the determinant.",tip:"Diagonal and triangular matrices reveal eigenvalues directly on the diagonal."});}
      case 8:{const x=1+(cycle%6),y=1+(Math.floor(cycle/6)%6),r=Math.sqrt(x*x+y*y),theta=Math.atan2(y,x);
        return C({topic:"Polar coordinates",difficulty:3,time:4,question:`For the Cartesian point \\((${x},${y})\\), find its polar radius \\(r\\).`,
          hint:"Use \\(r^2=x^2+y^2\\).",answer:f(r),steps:[`\\(r=\\sqrt{${x}^2+${y}^2}\\)`,`\\(r=${f(r)}\\)`],
          mistake:"Using x+y instead of Pythagoras.",tip:"Polar radius is just distance from the origin."});}
      case 9:{
        return C({topic:"Hyperbolic functions",difficulty:3,time:3,question:"Which identity is always true?",
          hint:"Compare with the circular identity, but note the sign change.",answer:"cosh²x − sinh²x = 1",
          steps:["\\(\\cosh^2x-\\sinh^2x=1\\) is the fundamental hyperbolic identity."],
          mistake:"Using \\(\\cosh^2x+\\sinh^2x=1\\), which incorrectly copies the circular identity.",tip:"Hyperbolic identities often resemble trig identities with a sign difference."});}
      case 10:{const a=1+(cycle%5),d=2+(cycle%5),b=1+(cycle%4),c=1+(cycle%6),tr=a+d,det=a*d-b*c;
        return C({topic:"Matrices",difficulty:5,time:5,question:`For \\(A=\\begin{pmatrix}${a}&${b}\\\\${c}&${d}\\end{pmatrix}\\), write its characteristic equation.`,
          hint:"For 2×2 matrices: \\(\\lambda^2-(\\operatorname{tr}A)\\lambda+\\det A=0\\).",
          answer:`λ²-${tr}λ+${det}=0`,steps:[`Trace \\(=${tr}\\)`,`Determinant \\(=${det}\\)`,`Characteristic equation: \\(\\lambda^2-${tr}\\lambda+${det}=0\\)`],
          mistake:"Using determinant as the coefficient of λ.",tip:"For a 2×2 matrix, remember λ² − trace·λ + determinant."});}
      default:{const n=3+(cycle%5),r=2+(cycle%4);
        return C({topic:"Complex geometry",difficulty:5,time:5,question:`The solutions of \\(z^${n}=${r**n}\\) form a regular polygon in an Argand diagram. How many vertices does it have?`,
          hint:"An nth-degree equation of this form has n equally spaced complex roots.",answer:String(n),
          steps:[`There are \\(${n}\\) distinct roots separated by \\(2\\pi/${n}\\).`,`Therefore they form a regular ${n}-gon.`],
          mistake:"Using the modulus as the number of vertices.",tip:"The exponent controls the number of equally spaced roots."});}
    }
  }

  function mathFactorial(n){let x=1;for(let i=2;i<=n;i++)x*=i;return x}

  // AI SL
  function aiSl(index){
    const {t,cycle}=dayParts(index,10);
    switch(t){
      case 0:{const principal=1000+250*(cycle%12),rate=2+(cycle%7),years=3+(cycle%8),val=principal*(1+rate/100)**years;
        return C({topic:"Financial mathematics",difficulty:3,time:4,question:`£${principal} is invested at \\(${rate}\\%\\) compound interest per year for \\(${years}\\) years. Find the final value.`,
          hint:"Use principal × multiplier^years.",answer:`£${f(val)}`,accepted:[f(val)],
          steps:[`Multiplier \\(=${1+rate/100}\\)`,`Value \\(=${principal}(${1+rate/100})^{${years}}\\)`,`\\(=£${f(val)}\\)`],
          mistake:"Using simple interest by adding the same amount each year.",tip:"Compound growth means the multiplier is repeatedly applied."});}
      case 1:{const m=1.2+0.2*(cycle%8),c=3+(cycle%10),x=5+(cycle%12),y=m*x+c;
        return C({topic:"Linear modelling",difficulty:2,time:3,question:`A model is \\(y=${f(m)}x+${c}\\). Predict y when \\(x=${x}\\).`,hint:"Substitute x into the model.",answer:f(y),
          steps:[`\\(y=${f(m)}(${x})+${c}\\)`,`\\(y=${f(y)}\\)`],mistake:"Reading the intercept as the prediction.",tip:"For regression/model equations, state that the answer is a prediction, not an exact value."});}
      case 2:{const mean=50+5*(cycle%8),sd=4+(cycle%5),x=mean+2*sd;
        return C({topic:"Normal distribution",difficulty:3,time:3,question:`A normal variable has mean \\(${mean}\\), standard deviation \\(${sd}\\). Find the z-score of \\(${x}\\).`,
          hint:"z = (x − mean)/SD.",answer:"2",steps:[`\\(z=\\frac{${x}-${mean}}{${sd}}=2\\)`],mistake:"Using x/SD without subtracting the mean.",tip:"A z-score counts standard deviations from the mean."});}
      case 3:{const p=0.5+0.05*(cycle%8),n=3+(cycle%5),r=2,ans=n*(n-1)/2*p*p*(1-p)**(n-2);
        return C({topic:"Binomial modelling",difficulty:4,time:4,question:`A trial succeeds independently with probability \\(${f(p)}\\). For \\(X\\sim B(${n},${f(p)})\\), write an expression for \\(P(X=2)\\).`,
          hint:"Use the binomial formula.",answer:`C(${n},2)(${f(p)})²(${f(1-p)})^${n-2}`,
          steps:[`\\(P(X=2)=\\binom{${n}}2(${f(p)})^2(${f(1-p)})^{${n-2}}\\)`],
          mistake:"Forgetting the combination factor.",tip:"Binomial probability = ways × success probability × failure probability."});}
      case 4:{const r=-0.55-0.05*(cycle%9);
        return C({topic:"Correlation",difficulty:2,time:2,question:`A data set has correlation coefficient \\(r=${f(r)}\\). Describe the linear association.`,
          hint:"Use the sign for direction and magnitude for strength.",answer:"strong negative",accepted:["negative strong"],
          steps:[`r is negative, so the association is negative.`,`|r| is close to 1, so it is strong.`],
          mistake:"Interpreting a negative coefficient as a weak relationship.",tip:"Sign = direction; distance from zero = strength."});}
      case 5:{const rate=2+(cycle%7),mult=1+rate/100;
        return C({topic:"Exponential models",difficulty:2,time:2,question:`A population is modelled by \\(P=1200(${f(mult)})^t\\). What annual percentage change does the model represent?`,
          hint:"Compare the multiplier with 1.",answer:`${rate}% increase`,accepted:[`${rate}%`,`increase ${rate}%`],
          steps:[`Multiplier \\(=1+\\frac{${rate}}{100}\\)`,`So the model represents a \\(${rate}\\%\\) increase per time unit.`],
          mistake:"Reading 1.04 as a 104% increase.",tip:"Percentage growth = (multiplier − 1) × 100%."});}
      case 6:{const n=5+(cycle%9),mean=20+2*(cycle%10),newMean=mean+4;
        return C({topic:"Statistics",difficulty:2,time:2,question:`A data set has mean \\(${mean}\\). Every value is increased by 4. Find the new mean.`,
          hint:"Adding a constant to every value adds the same constant to the mean.",answer:String(newMean),steps:[`New mean \\(=${mean}+4=${newMean}\\)`],
          mistake:"Multiplying the mean by the number of data values.",tip:"Translations change location measures but not spread measures such as standard deviation."});}
      case 7:{const radius=4+(cycle%9),area=Math.PI*radius*radius;
        return C({topic:"Geometry and modelling",difficulty:3,time:3,question:`A circular region has radius \\(${radius}\\) m. Find its area to 3 significant figures.`,
          hint:"Use A=πr².",answer:f(area),steps:[`\\(A=\\pi(${radius})^2\\)`,`\\(A=${f(area)}\\text{ m}^2\\)`],
          mistake:"Using 2πr, which is circumference.",tip:"Check whether the question asks for boundary length or enclosed area."});}
      case 8:{const p=0.2+0.1*(cycle%6),comp=1-p;
        return C({topic:"Probability",difficulty:2,time:2,question:`If \\(P(A)=${f(p)}\\), find \\(P(A')\\).`,hint:"Complementary probabilities add to 1.",answer:f(comp),
          steps:[`\\(P(A')=1-${f(p)}=${f(comp)}\\)`],mistake:"Using the same probability for the complement.",tip:"A and not-A exhaust all outcomes, so their probabilities total 1."});}
      default:{const start=2000+500*(cycle%8),rate=3+(cycle%6),target=start*1.3;
        return C({topic:"Financial modelling",difficulty:5,time:5,question:`An investment of £${start} grows by \\(${rate}\\%\\) per year. Write an equation that could be solved to find when it first exceeds £${f(target)}.`,
          hint:"Use an exponential model with time in the exponent.",answer:`${start}(1.${String(rate).padStart(2,"0")})^t > ${f(target)}`,
          steps:[`Value after t years: \\(${start}(1+${rate}/100)^t\\).`,`Threshold condition: \\(${start}(${f(1+rate/100)})^t>${f(target)}\\).`],
          mistake:"Using a linear expression start + rate·t.",tip:"Repeated percentage change is exponential, not linear."});}
    }
  }

  // AI HL
  function aiHl(index){
    const {t,cycle}=dayParts(index,12);
    if(t<5) return aiSl(index+211);
    switch(t){
      case 5:{const a=2+(cycle%6),d=3+(cycle%6),b=1+(cycle%4),c=1+(cycle%5),det=a*d-b*c;
        return C({topic:"Matrices",difficulty:3,time:3,question:`Find \\(\\det\\begin{pmatrix}${a}&${b}\\\\${c}&${d}\\end{pmatrix}\\).`,hint:"Use ad−bc.",answer:String(det),
          steps:[`\\(\\det A=(${a})(${d})-(${b})(${c})=${det}\\)`],mistake:"Adding the two products.",tip:"A non-zero determinant means the 2×2 matrix is invertible."});}
      case 6:{const vertices=6+(cycle%10),degree=2+(cycle%4),sum=vertices*degree,edges=sum/2;
        return C({topic:"Graph theory",difficulty:4,time:4,question:`A graph has \\(${vertices}\\) vertices, each of degree \\(${degree}\\). Assuming this is possible, how many edges does it have?`,
          hint:"Use the handshaking lemma: sum of degrees = 2E.",answer:String(edges),
          steps:[`Sum of degrees \\(=${vertices}\\times${degree}=${sum}\\)`,`\\(2E=${sum}\\Rightarrow E=${edges}\\)`],
          mistake:"Giving the sum of the degrees as the number of edges.",tip:"Every edge contributes 2 to the total degree count."});}
      case 7:{const lambda=2+(cycle%6);
        return C({topic:"Poisson distribution",difficulty:3,time:3,question:`If \\(X\\sim Po(${lambda})\\), find \\(E(X)\\).`,hint:"For a Poisson variable, mean = λ.",answer:String(lambda),
          steps:[`For \\(X\\sim Po(\\lambda)\\), \\(E(X)=\\lambda\\).`,`Therefore \\(E(X)=${lambda}\\).`],
          mistake:"Using λ² for the mean.",tip:"For Poisson, mean and variance are both λ."});}
      case 8:{const a=1+(cycle%4);
        return C({topic:"Differential equations",difficulty:4,time:4,question:`Solve \\(\\frac{dy}{dt}=${f(a/10)}y\\), given \\(y(0)=50\\).`,
          hint:"Recognise exponential growth.",answer:`50e^(${f(a/10)}t)`,steps:[`General solution \\(y=Ae^{${f(a/10)}t}\\).`,`Using \\(y(0)=50\\), \\(A=50\\).`],
          mistake:"Writing a linear model 50+kt.",tip:"Rate proportional to current amount produces exponential behaviour."});}
      case 9:{const n=6+(cycle%12);
        return C({topic:"Networks",difficulty:4,time:3,question:`A minimum spanning tree connects \\(${n}\\) vertices. How many edges must it contain?`,hint:"Every tree with n vertices has n−1 edges.",answer:String(n-1),
          steps:[`A spanning tree contains all \\(${n}\\) vertices without cycles.`,`Any tree with n vertices has \\(n-1\\) edges, so \\(${n-1}\\).`],
          mistake:"Giving n edges, which would necessarily create a cycle.",tip:"Tree = connected + no cycles → edges = vertices − 1."});}
      case 10:{const v1=2+(cycle%6),v2=3+(cycle%8);
        return C({topic:"Probability distributions",difficulty:4,time:3,question:`Independent random variables X and Y have variances \\(${v1}\\) and \\(${v2}\\). Find \\(Var(X+Y)\\).`,
          hint:"Variances add for independent random variables.",answer:String(v1+v2),steps:[`\\(Var(X+Y)=Var(X)+Var(Y)\\)`,`\\(=${v1}+${v2}=${v1+v2}\\)`],
          mistake:"Adding standard deviations rather than variances.",tip:"For independent sums, add variances first; square-root only if standard deviation is required."});}
      default:{const p=.01*(1+(cycle%8));
        return C({topic:"Hypothesis testing",difficulty:5,time:4,question:`A hypothesis test at the \\(5\\%\\) level gives p-value \\(${p.toFixed(2)}\\). State the decision.`,
          hint:"Compare p with 0.05.",answer:p<.05?"Reject H0":"Do not reject H0",
          steps:[`Compare \\(${p.toFixed(2)}\\) with \\(0.05\\).`,p<.05?"Since p<0.05, reject H₀.":"Since p≥0.05, do not reject H₀."],
          mistake:"Saying the test proves the alternative hypothesis.",tip:"Statistical tests provide evidence; they do not prove hypotheses absolutely."});}
    }
  }

  // AA HL
  function aaHl(index){
    const {t}=dayParts(index,12);
    if(t<5) return alGen(index+331);
    return fmGen(index+73);
  }


  // International GCSE higher wrapper: avoid formal binomial-distribution notation.
  function ighGen(index){
    const mod=((index%14)+14)%14;
    if(mod===8) return gh(index+1); // use polygon reasoning instead of formal B(n,p) notation
    return gh(index);
  }

  // IB AA SL: analytic/algebraic course content only — no mechanics.
  function aaSlGen(index){
    const {t,cycle}=dayParts(index,10);
    switch(t){
      case 0:{const a=2+(cycle%4),x=2+(cycle%6),c=1+(cycle%5),ans=a*x*x+c;return C({topic:"Functions",difficulty:2,time:3,question:`Given \\(f(x)=${a}x^2+${c}\\), find \\(f(${x})\\).`,hint:"Substitute the value of x carefully.",answer:String(ans),steps:[`\\(f(${x})=${a}(${x})^2+${c}\\)`,`\\(=${ans}\\)`],mistake:"Not squaring the input before multiplying.",tip:"Use brackets when substituting, especially for negative values."});}
      case 1:{const u=5+(cycle%8),diff=2+(cycle%5),n=8+(cycle%7),ans=u+(n-1)*diff;return C({topic:"Sequences and series",difficulty:2,time:3,question:`An arithmetic sequence has first term \\(${u}\\) and common difference \\(${diff}\\). Find \\(u_{${n}}\\).`,hint:"Use \\(u_n=a+(n-1)d\\).",answer:String(ans),steps:[`\\(u_{${n}}=${u}+(${n}-1)(${diff})\\)`,`\\(=${ans}\\)`],mistake:"Using n differences instead of n−1.",tip:"Count the jumps from term 1 to term n."});}
      case 2:{const base=[2,3,4,5][cycle%4],pow=2+(cycle%4),rhs=base**pow;return C({topic:"Exponentials and logarithms",difficulty:2,time:3,question:`Solve \\(${base}^x=${rhs}\\).`,hint:"Write both sides using the same base.",answer:String(pow),steps:[`\\(${rhs}=${base}^{${pow}}\\)`,`So \\(x=${pow}\\).`],mistake:"Multiplying the base and exponent.",tip:"Check for a common base before reaching for logarithms."});}
      case 3:{const A=20+5*(cycle%10),B=180-A;return C({topic:"Trigonometry",difficulty:3,time:3,question:`Solve \\(\\sin x=\\sin ${A}^\\circ\\) for \\(0\\le x\\le180^\\circ\\).`,hint:"Sine is positive in quadrants I and II.",answer:`${A}°, ${B}°`,accepted:[`${A},${B}`],steps:[`First solution: \\(x=${A}^\\circ\\).`,`Second solution: \\(x=180-${A}=${B}^\\circ\\).`],mistake:"Giving only the principal solution.",tip:"Always use the stated interval to check for additional solutions."});}
      case 4:{const a=2+(cycle%5),b=3+(cycle%4),x=1+(cycle%5),grad=3*a*x*x-b;return C({topic:"Differentiation",difficulty:3,time:4,question:`Find the gradient of \\(y=${a}x^3-${b}x\\) at \\(x=${x}\\).`,hint:"Differentiate first, then substitute.",answer:String(grad),steps:[`\\(dy/dx=${3*a}x^2-${b}\\)`,`At \\(x=${x}\\), gradient \\(=${grad}\\).`],mistake:"Substituting before differentiating.",tip:"Gradient at a point means derivative evaluated at that x-value."});}
      case 5:{const upper=2+(cycle%4),a=1+(cycle%3),b=1+(cycle%4),ans=a*upper**3/3+b*upper;return C({topic:"Integration",difficulty:3,time:4,question:`Evaluate \\(\\int_0^{${upper}}(${a}x^2+${b})\\,dx\\).`,hint:"Find an antiderivative, then apply both limits.",answer:f(ans),steps:[`Antiderivative: \\(\\frac{${a}}3x^3+${b}x\\).`,`At \\(x=${upper}\\): \\(${f(ans)}\\); at 0: 0.`,`Integral \\(=${f(ans)}\\).`],mistake:"Forgetting to divide by the new power.",tip:"Differentiate your antiderivative mentally as a check."});}
      case 6:{const n=5+(cycle%4),r=2,p=.2+.1*(cycle%4);return C({topic:"Binomial distribution",difficulty:4,time:4,question:`For \\(X\\sim B(${n},${p})\\), write an expression for \\(P(X=2)\\).`,hint:"Use the binomial probability formula.",answer:`C(${n},2)(${p})²(${f(1-p)})^${n-2}`,steps:[`\\(P(X=2)=\\binom{${n}}2(${p})^2(${f(1-p)})^{${n-2}}\\).`],mistake:"Omitting the combination factor or swapping success/failure powers.",tip:"The two exponents must add to n."});}
      case 7:{const mean=50+5*(cycle%8),sd=3+(cycle%5),x=mean+2*sd;return C({topic:"Statistics",difficulty:4,time:3,question:`A normal distribution has mean \\(${mean}\\) and standard deviation \\(${sd}\\). Find the z-score for \\(x=${x}\\).`,hint:"Use \\(z=(x-\\mu)/\\sigma\\).",answer:"2",steps:[`\\(z=\\frac{${x}-${mean}}{${sd}}=2\\).`],mistake:"Using the variance as the denominator.",tip:"Standardisation uses standard deviation, not variance."});}
      case 8:{const r=4+(cycle%7),theta=.5+.1*(cycle%8),area=.5*r*r*theta;return C({topic:"Radians",difficulty:4,time:4,question:`A sector has radius \\(${r}\\) and angle \\(${f(theta)}\\) radians. Find its area.`,hint:"Use \\(A=\\frac12r^2\\theta\\).",answer:f(area),steps:[`\\(A=\\frac12(${r})^2(${f(theta)})\\)`,`\\(A=${f(area)}\\).`],mistake:"Using arc length \\(r\\theta\\) instead of sector area.",tip:"In radian formulae, no degree conversion is needed."});}
      default:{const mean=20+2*(cycle%8),scale=2+(cycle%4),shift=1+(cycle%5);return C({topic:"Statistics",difficulty:4,time:3,question:`A data set has mean \\(${mean}\\) and standard deviation 4. Every value is transformed by \\(y=${scale}x+${shift}\\). Find the new standard deviation.`,hint:"A translation does not change spread; multiplication does.",answer:String(4*scale),steps:[`Multiplication by ${scale} multiplies standard deviation by ${scale}.`,`Adding ${shift} does not change standard deviation.`,`New SD \\(=${4*scale}\\).`],mistake:"Adding the shift to the standard deviation.",tip:"For y=ax+b, standard deviation is multiplied by |a| only."});}
    }
  }

  // IB AA HL: extends AA SL with proof, complex numbers, vectors and deeper calculus.
  function aaHlGen(index){
    const {t,cycle}=dayParts(index,12);
    if(t<6) return aaSlGen(index+83);
    switch(t){
      case 6:{const exp=10+(cycle%30),vals=["1","i","-1","-i"],ans=vals[exp%4];return C({topic:"Complex numbers",difficulty:3,time:3,question:`Evaluate \\(i^{${exp}}\\).`,hint:"Powers of i repeat every four.",answer:ans,steps:[`\\(${exp}\\equiv${exp%4}\\pmod4\\).`,`Therefore the value is ${ans}.`],mistake:"Ignoring the four-term cycle.",tip:"Reduce large powers of i modulo 4 immediately."});}
      case 7:return C({topic:"Proof by induction",difficulty:4,time:4,question:"After establishing a base case, what is the correct induction step?",hint:"Assume the result for k.",answer:"Assume true for n=k and prove for n=k+1",steps:["Assume the proposition P(k) is true.","Using that assumption, prove P(k+1).","Together with the base case, the statement follows for all required integers."],mistake:"Checking only one more numerical case.",tip:"Induction is an implication from k to k+1, not repeated testing."});
      case 8:{const x=1+(cycle%5),y=2+(cycle%5),z=2+(cycle%4),dot=x*2+y*(-1)+z*3;return C({topic:"Vectors",difficulty:4,time:4,question:`Find \\(( ${x},${y},${z})\\cdot(2,-1,3)\\).`,hint:"Multiply corresponding components and add.",answer:String(dot),steps:[`\\(${x}(2)+${y}(-1)+${z}(3)=${dot}\\).`],mistake:"Multiplying vector magnitudes instead of components.",tip:"Dot product is a scalar."});}
      case 9:{const k=2+(cycle%4),y0=2+(cycle%5);return C({topic:"Differential equations",difficulty:5,time:5,question:`Solve \\(dy/dx=${k}y\\), given \\(y(0)=${y0}\\).`,hint:"Separate variables.",answer:`y=${y0}e^(${k}x)`,steps:[`\\(dy/y=${k}dx\\).`,`\\(\\ln y=${k}x+C\\), so \\(y=Ae^{${k}x}\\).`,`Using \\(y(0)=${y0}\\), \\(A=${y0}\\).`],mistake:"Using a linear function for exponential growth.",tip:"A rate proportional to the quantity itself produces an exponential model."});}
      case 10:{const a=1+(cycle%4);return C({topic:"Implicit differentiation",difficulty:5,time:5,question:`For \\(x^2+xy+y^2=${7+a}\\), find \\(dy/dx\\).`,hint:"Use the product rule on xy.",answer:"-(2x+y)/(x+2y)",steps:[`Differentiate: \\(2x+x\\,y'+y+2yy'=0\\).`,`Collect y': \\((x+2y)y'=-(2x+y)\\).`,`\\(y'=-\\frac{2x+y}{x+2y}\\).`],mistake:"Differentiating xy as x+y.",tip:"Whenever x and y are multiplied, xy needs the product rule."});}
      default:{const n=2+(cycle%4),coef=(1)/mathFactorial(n);return C({topic:"Series",difficulty:5,time:4,question:`Find the coefficient of \\(x^${n}\\) in the Maclaurin series of \\(e^x\\).`,hint:"Use \\(e^x=\\sum x^r/r!\\).",answer:f(coef),steps:[`The \\(x^${n}\\) term is \\(x^${n}/${n}!\\).`,`Coefficient \\(=1/${mathFactorial(n)}=${f(coef)}\\).`],mistake:"Forgetting the factorial denominator.",tip:"Memorise the standard Maclaurin series and identify the required term directly."});}
    }
  }

  function build(track,index){
    index=((index%730)+730)%730;
    const meta=TRACKS[track] || TRACKS["gcse-aqa-h"];
    const seed=(index + Object.keys(TRACKS).indexOf(track)*37) % 730;
    let challenge;
    if(meta.family==="gf") challenge=gf(seed);
    else if(meta.family==="gh") challenge=gh(seed);
    else if(meta.family==="igf") challenge=gf(seed+151);
    else if(meta.family==="igh") challenge=ighGen(seed+223);
    else if(meta.family==="as") challenge=asGen(seed);
    else if(meta.family==="al") challenge=alGen(seed);
    else if(meta.family==="fm") challenge=fmGen(seed);
    else if(meta.family==="aa-sl") challenge=aaSlGen(seed+109);
    else if(meta.family==="aa-hl") challenge=aaHlGen(seed);
    else if(meta.family==="ai-sl") challenge=aiSl(seed);
    else challenge=aiHl(seed);
    return {...challenge,track,trackLabel:meta.label,board:meta.board,index,challengeNumber:index+1};
  }

  function answerMatches(challenge,input){
    const value=cleanAnswer(input);
    return challenge.accepted.some(a=>cleanAnswer(a)===value);
  }

  window.MATHORA_DAILY={
    tracks:TRACKS,
    getChallenge:build,
    answerMatches,
    rotationDays:730
  };
})();