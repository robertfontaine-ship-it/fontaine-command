(() => {
  const live = {
    "Branding": { href:"branding-hub.html", name:"Brand Studio", description:"Build identity, positioning, voice, touchpoints, and brand equity." },
    "Target Market & Segmentation": { href:"target-market-hub.html", name:"Consumer Intelligence Center", description:"Investigate customer segments, personas, evidence, and audience opportunities." },
    "The 4Ps of Marketing": { href:"four-ps-hub.html", name:"Strategy War Room", description:"Coordinate Product, Price, Place, and Promotion around one target customer." },
    "Marketing Functions": { href:"marketing-functions-hub.html", name:"Marketing Operations HQ", description:"See how seven departments cooperate to create, communicate, and deliver value." },
    "Promotional Mix": { href:"promotional-mix-hub.html", name:"Campaign Command Center", description:"Deploy advertising, PR, sales promotion, personal selling, and direct marketing." }
  };
  function activate(){
    document.querySelectorAll(".topic-card").forEach(card => {
      const heading=card.querySelector("h3"),original=heading?.textContent?.trim(),config=live[original];
      if(!config)return;
      card.classList.add("live");
      if(heading)heading.textContent=config.name;
      const description=card.querySelector("p"); if(description)description.textContent=config.description;
      const status=card.querySelector(".topic-status");
      if(status){status.textContent="Live";status.classList.remove("queued");status.classList.add("live");}
      const action=card.querySelector(".mission-button");
      if(action){
        const link=document.createElement("a");
        link.className="mission-button primary";
        link.href=config.href;
        link.textContent=`Enter ${config.name}`;
        action.replaceWith(link);
      }
    });
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",activate);else activate();
})();