(()=>{
 const audit=window.FONTaineCompanionAudit;
 const resources=window.FONTaineCompanionResources;
 const sources=window.FONTaineCompanionSources;
 if(!audit||!Array.isArray(resources)||!sources)return;
 const generatedTypes=[
  {key:"organizer",label:"Student Organizer",reviewRequired:false},
  {key:"rubric",label:"Scoring Rubric",reviewRequired:false},
  {key:"exit",label:"Exit Ticket",reviewRequired:false},
  {key:"assessment",label:"Quick Check",reviewRequired:true},
  {key:"guide",label:"Teacher Scoring Guide",reviewRequired:true}
 ];
 const fashionMp2Lessons=lessons.filter(lesson=>lesson.course==="Fashion"&&lesson.markingPeriod==="MP2"&&lesson.status==="Complete"&&lesson.mapStatus==="Built");
 const existingIds=new Set(resources.map(resource=>resource.id));
 const generated=[];
 fashionMp2Lessons.forEach(lesson=>generatedTypes.forEach(type=>{
  const resource={id:`${lesson.id.toLowerCase()}-${type.key}`,title:`${lesson.id} ${type.label}`,course:lesson.course,type:type.label,lessonIds:[lesson.id],status:"Generated",verification:"Generated from the complete Fashion MP2 lesson package",reviewRequired:type.reviewRequired};
  if(!existingIds.has(resource.id)){resources.push(resource);generated.push(resource);existingIds.add(resource.id);}
 }));
 const studyGuide=sources.verifiedSources.find(resource=>resource.fileId==="1W0icXY1Ehxm9vHGyQMG6bIS1k5X2yUA-nI64w6KXFfA");
 const answerKey=sources.verifiedSources.find(resource=>resource.fileId==="1j_C8eHAVxN2WQaoLpY0GFM_Oi38xARUIf6YHetEkUzA");
 [studyGuide,answerKey].forEach(resource=>{if(resource&&!resource.lessonIds.includes("FASH-040"))resource.lessonIds.push("FASH-040");});
 const verified=[
  {id:"verified-fashion-mp2-promo-slides",title:"The Promotional Mix - Fashion",course:"Fashion",type:"Instructional Slides",lessonIds:["FASH-023","FASH-024","FASH-025"],fileId:"1Y7Yc7Son347JvsHuRzH73fwnNcWPQc0OC53jRQoP18s",url:"https://docs.google.com/presentation/d/1Y7Yc7Son347JvsHuRzH73fwnNcWPQc0OC53jRQoP18s",status:"Verified in Drive"},
  {id:"verified-fashion-mp2-promo-sort",title:"Promo Mix - Scenario Sorting Fashion",course:"Fashion",type:"Student Organizer",lessonIds:["FASH-024"],fileId:"1C-t8M7Og-46eOGT5_XMcjIHagOckE6-kQCgOtYM8BtY",url:"https://docs.google.com/presentation/d/1C-t8M7Og-46eOGT5_XMcjIHagOckE6-kQCgOtYM8BtY",status:"Verified in Drive"},
  {id:"verified-fashion-mp2-selling-scenarios",title:"Fashion Retail Selling Scenario Review",course:"Fashion",type:"Student Organizer",lessonIds:["FASH-026","FASH-027","FASH-028","FASH-029","FASH-030","FASH-033"],fileId:"1VlnJ9zSB988NjPtpWvETus6FSdhWzukYSumR1NY__R8",url:"https://docs.google.com/document/d/1VlnJ9zSB988NjPtpWvETus6FSdhWzukYSumR1NY__R8",status:"Verified in Drive"},
  {id:"verified-fashion-mp2-pop-up-brief",title:"Style the Stage: DECA Boutique Fashion Marketing Challenge",course:"Fashion",type:"Student Organizer",lessonIds:["FASH-031","FASH-032","FASH-033","FASH-038","FASH-039"],fileId:"1Oreyofn9kRzknk-2eSOqglaTbr4EgEH1",url:"https://drive.google.com/file/d/1Oreyofn9kRzknk-2eSOqglaTbr4EgEH1",status:"Verified in Drive"},
  {id:"verified-fashion-mp2-clienteling-slides",title:"Clienteling & Service Recovery",course:"Fashion",type:"Instructional Slides",lessonIds:["FASH-034","FASH-035","FASH-036"],fileId:"15k400QBbEHZlLPJCdGWB7-Svu8GQN0ID6eaV9j0ZDkg",url:"https://docs.google.com/presentation/d/15k400QBbEHZlLPJCdGWB7-Svu8GQN0ID6eaV9j0ZDkg",status:"Verified in Drive"},
  {id:"verified-fashion-mp2-clienteling-notes",title:"Clienteling & Service Recovery Fill In Notes",course:"Fashion",type:"Student Organizer",lessonIds:["FASH-034","FASH-035","FASH-036"],fileId:"1TpvVf0vtoTMfPgG2qDyaDeRBFB0rRO2QlI4kI4n8DNs",url:"https://docs.google.com/document/d/1TpvVf0vtoTMfPgG2qDyaDeRBFB0rRO2QlI4kI4n8DNs",status:"Verified in Drive"},
  {id:"verified-fashion-mp2-retention-slides",title:"Customer Retention in Fashion Marketing",course:"Fashion",type:"Instructional Slides",lessonIds:["FASH-037"],fileId:"1bkULBoEl1AViQb27fKoV1tO1LSdnHtGk_8fYeL9OgTc",url:"https://docs.google.com/presentation/d/1bkULBoEl1AViQb27fKoV1tO1LSdnHtGk_8fYeL9OgTc",status:"Verified in Drive"},
  {id:"verified-fashion-mp2-retention-notes",title:"Customer Retention in Fashion Marketing Fill-in-the-Blank Notes",course:"Fashion",type:"Student Organizer",lessonIds:["FASH-037"],fileId:"1EM-wX619zU3uY1w6MhWwYZelxIOE0eyOBBkptiaSZ90",url:"https://docs.google.com/document/d/1EM-wX619zU3uY1w6MhWwYZelxIOE0eyOBBkptiaSZ90",status:"Verified in Drive"}
 ];
 const verifiedAdded=[];
 verified.forEach(resource=>{if(!existingIds.has(resource.id)){resources.push(resource);sources.verifiedSources.push(resource);verifiedAdded.push(resource);existingIds.add(resource.id);}});
 const demandPattern=/worksheet|organizer|matrix|template|chart|checklist|rubric|assessment|performance check|review|answer key|notes|cards|station|planogram|sketch|ballot/i;
 const demandType=material=>{const value=String(material).toLowerCase();if(value.includes("answer key"))return "Answer Key";if(value.includes("rubric")||value.includes("checklist")||value.includes("ballot"))return "Scoring Rubric";if(value.includes("assessment")||value.includes("performance check")||value.includes("review"))return "Assessment";return "Student Organizer";};
 fashionMp2Lessons.forEach(lesson=>(lesson.materials||[]).filter(material=>demandPattern.test(material)).forEach(material=>{const type=demandType(material);const verifiedMatch=sources.verifiedSources.some(resource=>resource.lessonIds.includes(lesson.id)&&resource.type===type);sources.demands.push({lessonId:lesson.id,course:lesson.course,title:lesson.title,material,type,verified:verifiedMatch,status:verifiedMatch?"Verified in Drive":"Generated coverage only"});}));
 audit.totalLessons+=fashionMp2Lessons.length;
 audit.generatedResources+=generated.length;
 audit.verifiedResources+=verifiedAdded.length;
 audit.materialDemands=sources.demands.length;
 audit.generatedOnlyDemands=sources.demands.filter(item=>!item.verified).length;
 window.FONTaineFashionMP2CompanionResources={lessons:fashionMp2Lessons.length,generated:generated.length,verified:verifiedAdded.length,extendedVerified:[studyGuide,answerKey].filter(Boolean).length};
 const renderBeforeFashionMP2Companions=render;
 render=function(){renderBeforeFashionMP2Companions();if(state.page!=="Companion Resources")return;const generatedMetric=document.querySelector('[data-companion-metric="generated"] strong');const lessonMetric=document.querySelector('[data-companion-metric="lessons"] strong');if(generatedMetric)generatedMetric.textContent=String(audit.generatedResources);if(lessonMetric)lessonMetric.textContent=String(audit.totalLessons);};
})();