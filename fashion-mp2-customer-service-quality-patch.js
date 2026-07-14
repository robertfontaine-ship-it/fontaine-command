(()=>{
 const updates={
  "FASH-036":"🛠️ Review the five service-recovery actions.\n📝 Complete the response organizer for each fashion complaint.\n🔍 Analyze the customer impact and root cause in the case study.\n🎭 Perform the service-recovery role-play.\n📋 Document the immediate solution, follow-up, and prevention step.\n🔁 Revise one response using evaluator feedback.\n📤 Submit the organizer, role-play scorecard, and revised response in Canvas.\n✅ Earn at least 80% mastery.",
  "FASH-039":"🏬 Review fashion store layouts, traffic flow, and planograms.\n🔧 Diagnose the problems in the flawed layout.\n🗺️ Select a layout type and draw the customer path.\n📦 Assign product zones, adjacencies, service points, and signage.\n📐 Create a detailed planogram for one fixture or wall.\n♿ Test navigation and accessibility, then revise one placement.\n📤 Submit the layout, planogram, customer-path test, and revision in Canvas.\n✅ Earn at least 80% mastery."
 };
 Object.entries(updates).forEach(([id,canvas])=>{const lesson=lessons.find(item=>item.id===id);if(lesson)lesson.canvas=canvas;});
})();