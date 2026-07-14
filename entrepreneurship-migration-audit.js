(()=>{
 const required=["overview","target","success","agenda","bellRinger","miniLesson","activity","exitTicket","materials","differentiation","canvas","standards","notes","version"];
 const entrepreneurshipLessons=lessons.filter(lesson=>lesson.course==="Entrepreneurship");
 entrepreneurshipLessons.forEach(lesson=>{
  const missing=required.filter(field=>{
   const value=lesson[field];
   return Array.isArray(value)?value.length===0:!value||String(value).toLowerCase().includes("pending");
  });
  lesson.migrationAudit={complete:missing.length===0,missing,verification:window.FONTaineEntrepreneurshipSources?.lessons?.[lesson.id]?.verification||"unverified"};
  lesson.status=missing.length===0?"Complete":"Needs Materials";
  lesson.components=missing.length===0?["Lesson Plan","Learning Target","Agenda","Activity","Exit Ticket","Canvas Directions"]:missing.map(field=>`Missing ${field}`);
 });
 window.FONTaineEntrepreneurshipAudit={total:entrepreneurshipLessons.length,complete:entrepreneurshipLessons.filter(lesson=>lesson.migrationAudit.complete).length,issues:entrepreneurshipLessons.filter(lesson=>!lesson.migrationAudit.complete).map(lesson=>({id:lesson.id,missing:lesson.migrationAudit.missing}))};
})();
