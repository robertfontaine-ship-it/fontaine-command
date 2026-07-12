(()=>{
  const requiredText=["overview","target","success","bellRinger","miniLesson","activity","exitTicket","canvas","standards","version"];
  const requiredArrays=["components","agenda","materials","differentiation"];
  const semLessons=lessons.filter(lesson=>lesson.course==="SEM"&&lesson.day>=1&&lesson.day<=20);
  const results=semLessons.map(lesson=>{
    const missingText=requiredText.filter(key=>typeof lesson[key]!=="string"||!lesson[key].trim()||/pending|TBD/i.test(lesson[key]));
    const missingArrays=requiredArrays.filter(key=>!Array.isArray(lesson[key])||lesson[key].length===0||lesson[key].some(value=>/pending|missing/i.test(String(value))));
    const missing=[...missingText,...missingArrays];
    if(missing.length===0){
      lesson.status="Complete";
      lesson.components=["Lesson Plan","Learning Target","Agenda","Activity","Exit Ticket","Canvas Directions"];
    }else if(lesson.status==="Complete"){
      lesson.status="Needs Materials";
    }
    return {id:lesson.id,complete:missing.length===0,missing};
  });
  window.FONTaineSemMigrationAudit={
    auditedAt:"2026-07-12",
    total:results.length,
    complete:results.filter(result=>result.complete).length,
    incomplete:results.filter(result=>!result.complete),
    results
  };
})();