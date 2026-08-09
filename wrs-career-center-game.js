(() => {
  "use strict";
  const stage=document.getElementById("transitStage");
  if(!stage)return;
  const runner=document.getElementById("transitRunner");
  const obstacleLayer=document.getElementById("transitObstacles");
  const message=document.getElementById("transitMessage");
  const timeLabel=document.getElementById("transitTime");
  const scoreLabel=document.getElementById("transitScore");
  const bestLabel=document.getElementById("transitBest");
  const startButton=document.getElementById("transitStart");
  const leftButton=document.getElementById("transitLeft");
  const rightButton=document.getElementById("transitRight");
  const BEST_KEY="fontaineWrsTransitBest:v1";
  const lanes=[30,50,70];
  const icons=["🧟","🧟‍♀️","📦","⚠️"];
  let lane=1,running=false,startTime=0,lastSpawn=0,lastFrame=0,score=0,animation=0,obstacles=[];
  const best=()=>Math.max(0,Number(localStorage.getItem(BEST_KEY)||0));
  bestLabel.textContent=best();

  function setLane(next){
    lane=Math.max(0,Math.min(lanes.length-1,next));
    runner.style.left=`${lanes[lane]}%`;
  }
  function move(direction){if(running)setLane(lane+direction);}
  function clearObstacles(){obstacles.forEach(item=>item.element.remove());obstacles=[];}
  function spawn(now){
    const obstacleLane=Math.floor(Math.random()*lanes.length);
    const element=document.createElement("div");
    element.className="transit-obstacle";
    element.textContent=icons[Math.floor(Math.random()*icons.length)];
    element.style.left=`calc(${lanes[obstacleLane]}% - 32px)`;
    obstacleLayer.appendChild(element);
    obstacles.push({element,lane:obstacleLane,y:-70,speed:190+Math.random()*95,hit:false});
    lastSpawn=now;
  }
  function finish(reason="Hallway cleared."){
    running=false;
    cancelAnimationFrame(animation);
    startButton.disabled=false;
    leftButton.disabled=true;
    rightButton.disabled=true;
    const rounded=Math.max(0,Math.round(score));
    const previous=best();
    if(rounded>previous){localStorage.setItem(BEST_KEY,String(rounded));bestLabel.textContent=rounded;}
    message.hidden=false;
    message.innerHTML=`<strong>${reason}</strong><span>Distance: ${rounded}. Press Start to run again.</span>`;
    stage.setAttribute("aria-label",`Zombie hallway transit drill finished. Distance ${rounded}.`);
  }
  function frame(now){
    if(!running)return;
    const elapsed=(now-startTime)/1000;
    const delta=Math.min(.035,(now-lastFrame)/1000||0);
    lastFrame=now;
    const remaining=Math.max(0,20-elapsed);
    timeLabel.textContent=String(Math.ceil(remaining));
    score+=delta*12;
    scoreLabel.textContent=String(Math.max(0,Math.round(score)));
    if(now-lastSpawn>Math.max(430,760-elapsed*12))spawn(now);
    const stageHeight=stage.clientHeight;
    obstacles.forEach(item=>{
      item.y+=item.speed*delta;
      item.element.style.transform=`translateY(${item.y}px)`;
      if(!item.hit&&item.lane===lane&&item.y>stageHeight-150&&item.y<stageHeight-55){
        item.hit=true;
        score=Math.max(0,score-18);
        item.element.textContent="💥";
        runner.animate([{transform:"translateX(-50%) rotate(0deg)"},{transform:"translateX(-50%) rotate(-12deg)"},{transform:"translateX(-50%) rotate(12deg)"},{transform:"translateX(-50%) rotate(0deg)"}],{duration:240});
      }
    });
    obstacles=obstacles.filter(item=>{
      if(item.y>stageHeight+80){item.element.remove();return false;}
      return true;
    });
    if(remaining<=0){finish("Zone reached.");return;}
    animation=requestAnimationFrame(frame);
  }
  function start(){
    clearObstacles();
    setLane(1);
    running=true;
    score=0;
    startTime=performance.now();
    lastFrame=startTime;
    lastSpawn=startTime-600;
    timeLabel.textContent="20";
    scoreLabel.textContent="0";
    message.hidden=true;
    startButton.disabled=true;
    leftButton.disabled=false;
    rightButton.disabled=false;
    stage.setAttribute("aria-label","Zombie hallway transit drill active. Use left and right controls to avoid obstacles.");
    stage.focus();
    animation=requestAnimationFrame(frame);
  }
  startButton.addEventListener("click",start);
  leftButton.addEventListener("click",()=>move(-1));
  rightButton.addEventListener("click",()=>move(1));
  stage.addEventListener("keydown",event=>{
    if(["ArrowLeft","a","A"].includes(event.key)){event.preventDefault();move(-1);}
    if(["ArrowRight","d","D"].includes(event.key)){event.preventDefault();move(1);}
    if((event.key===" "||event.key==="Enter")&&!running){event.preventDefault();start();}
  });
  window.addEventListener("blur",()=>{if(running)finish("Run paused.");});
  leftButton.disabled=true;
  rightButton.disabled=true;
  setLane(1);
})();