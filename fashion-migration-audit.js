(()=>{
 const required=["overview","target","success","agenda","bellRinger","miniLesson","activity","exitTicket","materials","differentiation","canvas","standards","notes","version"];
 const fashionLessons=lessons.filter(lesson=>lesson.course==="Fashion");
 fashionLessons.forEach(lesson=>{
   const missing=required.filter(field=>{
     const value=lesson[field];
     return Array.isArray(value)?value.length===0:!value||String(value).toLowerCase().includes("pending");
   });
   lesson.migrationAudit={complete:missing.length===0,missing,verification:window.FONTaineFashionSources?.lessons?.[lesson.id]?.verification||"unverified"};
   lesson.status=missing.length===0?"Complete":"Needs Materials";
   lesson.components=missing.length===0?["Lesson Plan","Learning Target","Agenda","Activity","Exit Ticket","Canvas Directions"]:missing.map(field=>`Missing ${field}`);
 });
 window.FONTaineFashionAudit={total:fashionLessons.length,complete:fashionLessons.filter(x=>x.migrationAudit.complete).length,issues:fashionLessons.filter(x=>!x.migrationAudit.complete).map(x=>({id:x.id,missing:x.migrationAudit.missing}))};
})();