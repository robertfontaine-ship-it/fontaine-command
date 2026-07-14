(()=>{
 courses=function(){
  const courseNames=[...new Set(lessons.map(lesson=>lesson.course))];
  return shell(`<div class="grid">${courseNames.map(course=>{
   const courseLessons=lessons.filter(lesson=>lesson.course===course);
   const complete=courseLessons.filter(lesson=>lesson.status==="Complete").length;
   const mp1=courseLessons.filter(lesson=>lesson.markingPeriod==="MP1");
   const mp2=courseLessons.filter(lesson=>lesson.markingPeriod==="MP2");
   const built=mp2.filter(lesson=>lesson.mapStatus==="Built"&&lesson.status==="Complete").length;
   return `<div class="card span-4 mp2-course-card"><h2>${course}</h2><div class="metric">${complete}/${courseLessons.length}</div><div class="muted">Complete lesson packages</div><div class="progress"><i style="width:${courseLessons.length?complete/courseLessons.length*100:0}%"></i></div><div class="mp2-course-breakdown"><span><strong>${mp1.length}</strong> MP1 lessons</span><span><strong>${mp2.length}</strong> MP2 lessons</span><span><strong>${built}</strong> MP2 built</span></div><button class="btn" onclick="state.course='${course}';state.markingPeriod='MP2';go('Lessons')">Open MP2 curriculum</button></div>`;
  }).join("")}</div>`);
 };
})();