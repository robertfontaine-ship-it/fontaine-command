const aiTeacherAskBefore=ask;
ask=function(event){
 const input=document.getElementById("askInput");
 const query=input?.value.trim()||"";
 if(/sub plan|substitute|reteach|remediate|differentiat|accommodat|30 minute|shorten|condense|assembly|more engaging|engagement upgrade|curriculum health|morning brief|teaching brief|what should i teach next/i.test(query)){
  event?.preventDefault();
  state.page="AI Teacher Assistant";
  aiTeacherSuggestion(query);
  return;
 }
 aiTeacherAskBefore(event);
};