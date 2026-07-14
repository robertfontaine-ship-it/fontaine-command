(()=>{
 const successCriteria={
  "SEM-023":"I will know I am successful when I can evaluate social content and design a platform-appropriate post with a clear audience, objective, message, and measurement plan with at least 80% accuracy.",
  "SEM-026":"I will know I am successful when I can classify promotional scenarios, identify the defining evidence, and justify the strongest promotional-tool decision with at least 80% accuracy.",
  "SEM-028":"I will know I am successful when I can deliver a complete campaign pitch, answer strategic questions, and meet the campaign criteria with at least 80% accuracy."
 };
 Object.entries(successCriteria).forEach(([id,success])=>{
  const lesson=lessons.find(item=>item.id===id);
  if(lesson)lesson.success=success;
 });
})();