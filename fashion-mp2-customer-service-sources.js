(()=>{
 const source=window.FONTaineMP2Sources;
 if(!source)return;
 Object.assign(source.resources,{
  "fashion-clienteling-slides":{title:"Clienteling & Service Recovery",course:"Fashion",type:"Slides",fileId:"15k400QBbEHZlLPJCdGWB7-Svu8GQN0ID6eaV9j0ZDkg",lessonIds:["FASH-034","FASH-035","FASH-036"]},
  "fashion-clienteling-notes":{title:"Clienteling & Service Recovery Fill In Notes",course:"Fashion",type:"Document",fileId:"1TpvVf0vtoTMfPgG2qDyaDeRBFB0rRO2QlI4kI4n8DNs",lessonIds:["FASH-034","FASH-035","FASH-036"]},
  "fashion-retention-slides":{title:"Customer Retention in Fashion Marketing",course:"Fashion",type:"Slides",fileId:"1bkULBoEl1AViQb27fKoV1tO1LSdnHtGk_8fYeL9OgTc",lessonIds:["FASH-037"]},
  "fashion-retention-notes":{title:"Customer Retention in Fashion Marketing - Fill in the Blank Notes",course:"Fashion",type:"Document",fileId:"1EM-wX619zU3uY1w6MhWwYZelxIOE0eyOBBkptiaSZ90",lessonIds:["FASH-037"]}
 });
 const plan=source.resources["fashion-mp2-plan"];
 if(plan)["FASH-034","FASH-035","FASH-036","FASH-037","FASH-038","FASH-039","FASH-040"].forEach(id=>{if(!plan.lessonIds.includes(id))plan.lessonIds.push(id);});
 const display=source.resources["fashion-pop-up-brief"];
 if(display)["FASH-038","FASH-039"].forEach(id=>{if(!display.lessonIds.includes(id))display.lessonIds.push(id);});
})();