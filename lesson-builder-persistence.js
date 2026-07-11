function applyStoredBuilderRevision(revision){
  const lesson=lessons.find(item=>item.id===revision.lessonId);const sections=revision.after?.sections;if(!lesson||!sections)return;
  const keys=revision.keys||[];
  if(keys.includes("learning-target"))lesson.target=sections["learning-target"];
  if(keys.includes("agenda"))lesson.agenda=sections.agenda;
  if(keys.includes("bell-ringer"))lesson.bellRinger=sections["bell-ringer"];
  if(keys.includes("mini-lesson"))lesson.miniLesson=sections["mini-lesson"];
  if(keys.includes("activity"))lesson.activity=sections.activity;
  if(keys.includes("exit-ticket"))lesson.exitTicket=sections["exit-ticket"];
  if(keys.includes("canvas-directions"))lesson.canvas=sections["canvas-directions"];
  if(keys.includes("materials"))lesson.materials=sections.materials;
  if(keys.includes("differentiation"))lesson.differentiation=sections.differentiation;
  const componentMap={"learning-target":"learning-target","agenda":"agenda","activity":"activity","exit-ticket":"exit-ticket","canvas-directions":"canvas-directions"};
  Object.entries(componentMap).forEach(([builderKey,componentKey])=>{if(keys.includes(builderKey)){const component=lesson.componentDetails?.find(item=>item.key===componentKey);if(component)component.status="complete";}});
  calculateReadiness(lesson);
}
[...builderHistory].reverse().forEach(applyStoredBuilderRevision);
refreshReadiness();
const resetBeforeBuilder=resetLocalData;
resetLocalData=function(){localStorage.removeItem(BUILDER_STORAGE_KEY);resetBeforeBuilder();};
render();