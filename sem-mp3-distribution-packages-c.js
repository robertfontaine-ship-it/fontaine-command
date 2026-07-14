(()=>{
 const packages={
  "SEM-047":{
   overview:"Students complete and defend a redesigned distribution strategy for a sports or entertainment brand using customer, channel, intermediary, fulfillment, cost, control, and risk evidence.",
   target:"I will recommend and defend a distribution strategy for a sports or entertainment property.",
   success:"I will know I am successful when I can present a coherent channel redesign, support every major decision with evidence, and meet the project criteria with at least 80% accuracy.",
   agenda:["Bell ringer: What is the power move?","Strategy-defense mini lesson","Distribution Power Move completion","Peer challenge review","Executive presentation and reflection"],
   bellRinger:"A strong distribution recommendation must improve customer access without creating unacceptable cost or loss of control. Identify the evidence needed to prove both parts of that claim.",
   miniLesson:"Review the complete distribution decision: brand and offer, target customer, current channel, problem or opportunity, proposed channel, direct and indirect roles, intermediaries, customer journey, inventory or capacity, fulfillment, access, communication, rights or licensing, cost, control, risks, contingencies, and measures. Model a recommendation that compares the current and proposed systems, names tradeoffs honestly, and links each change to customer and business evidence.",
   activity:"Students complete the verified Distribution Power Move project. The final strategy includes brand identification, current distribution map, target-customer access needs, diagnosed weakness, proposed channel redesign, intermediary decisions, merchandise or content channels, customer journey, inventory or capacity plan, fulfillment process, risk and contingency controls, expected customer benefit, business benefit, three performance measures, and a before-and-after comparison. Peers use a challenge rubric to identify one assumption, one risk, and one unsupported claim. Students revise and deliver a timed executive presentation with evaluator questions.",
   exitTicket:"Identify the strongest decision in your distribution redesign and one assumption the organization should test before full implementation.",
   materials:["Distribution Power Move Template","Distribution Strategy notes","Channel decision matrix","Peer challenge rubric","Executive presentation scorecard","Student reflection"],
   differentiation:["Provide a required-slide checklist and sentence stems","Allow recorded or live presentation","Use an assigned brand with prepared current-channel evidence","Require advanced students to estimate implementation cost or channel-performance targets"],
   canvas:"⚡ Complete the verified Distribution Power Move project.\n🗺️ Show the current channel and proposed redesign.\n👥 Connect every decision to the target customer and brand goal.\n📦 Include intermediaries, fulfillment, risks, contingencies, and measures.\n🔍 Complete the peer challenge review and revise unsupported claims.\n🎤 Deliver the executive presentation and answer evaluator questions.\n📤 Submit the project, scorecard, and reflection in Canvas.\n✅ Earn at least 80% mastery.",
   standards:"SEM 8175.072-.077 — integrated channel strategy, intermediaries, customer access, fulfillment, risk, measurement, and professional presentation",
   notes:"Exact-resource performance package using Distribution Power Move Template, file ID 1Yiw3lLiO65iOnKJ2eSL2NdUN1jcVdQvhzX1r2rFf5Vk, and Distribution Strategy notes, file ID 143-0Z7Ap_xE4wtO-lph2enweewjt-3wYU69cCKbPEX4.",
   version:"Version 1 — SEM MP3 Distribution Power Move performance task"
  },
  "SEM-048":{
   overview:"Students demonstrate distribution mastery through channel classification, scenario decisions, fulfillment analysis, project transfer, error correction, and an individual improvement plan.",
   target:"I will apply distribution vocabulary, channel decisions, and fulfillment strategies to new sports and entertainment scenarios.",
   success:"I will know I am successful when I can complete the distribution performance check and correct missed concepts with at least 80% accuracy.",
   agenda:["Bell ringer: Connect the distribution system","Distribution review game","Mixed scenario analysis","Individual performance check","Error analysis and improvement plan"],
   bellRinger:"Explain how customer, channel, intermediary, inventory or capacity, fulfillment, and measurement work together in one complete distribution system.",
   miniLesson:"Review direct, indirect, and hybrid channels; intermediaries; physical and digital distribution; ticketing; merchandise and media channels; licensing; inventory; capacity; fulfillment; access; customer communication; risk; and performance measures. Model how to identify the decision being tested in a scenario, locate evidence, compare tradeoffs, and reject an option that solves one problem while creating a more serious channel failure.",
   activity:"Students complete a brief collaborative distribution review and then an individual performance check. The check includes channel-flow labeling, direct and indirect classification, intermediary functions, ticketing and digital-access decisions, merchandise and media channel selection, inventory or capacity problems, fulfillment and service-recovery responses, distribution metrics, and one integrated strategy recommendation. Students complete error analysis for every missed concept by naming the concept, explaining the original error, showing the corrected reasoning, and identifying the lesson or verified resource to revisit. They finish with a two-skill improvement plan.",
   exitTicket:"Identify your strongest distribution skill, your greatest remaining gap, and the exact practice you will complete next.",
   materials:["Distribution Strategy notes","Distribution review scenarios","Individual distribution performance check","Teacher scoring guide","Error-analysis and improvement-plan organizer"],
   differentiation:["Provide a vocabulary reference during collaborative review","Chunk the performance check into channel and fulfillment sections","Allow oral explanations for error analysis","Require advanced students to explain why one plausible alternative is weaker"],
   canvas:"📘 Review the complete SEM distribution system.\n🧠 Apply the concepts during the mixed scenario review.\n✅ Complete the individual distribution performance check.\n🔍 Correct every missed concept using evidence and teacher feedback.\n🎯 Create a two-skill improvement plan with named lessons and resources.\n📤 Submit the performance check, error analysis, and plan in Canvas.\n🏁 Earn at least 80% mastery.",
   standards:"SEM 8175.072-.077 — cumulative distribution channels, intermediaries, digital access, fulfillment, risk, and performance analysis",
   notes:"Source-backed cumulative package using the verified Distribution Strategy notes and completed Distribution Power Move application.",
   version:"Version 1 — SEM MP3 distribution review and performance check"
  }
 };
 const ids=Object.keys(packages);
 ids.forEach(id=>{const lesson=lessons.find(item=>item.id===id);if(lesson)Object.assign(lesson,packages[id],{status:"Complete",mapStatus:"Built",duration:"45–60 minutes",components:["Lesson Plan","Learning Target","Agenda","Activity","Exit Ticket","Canvas Directions"]});});
 window.FONTaineSEMMP3DistributionPackagesC={count:ids.length,lessonIds:ids};
 window.FONTaineSEMMP3DistributionPackages={count:8,lessonIds:["SEM-041","SEM-042","SEM-043","SEM-044","SEM-045","SEM-046","SEM-047","SEM-048"],sourceIds:["sem-distribution-notes","sem-distribution-power-move"]};
})();