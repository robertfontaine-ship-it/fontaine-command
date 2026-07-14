(()=>{
 const packages={
  "SEM-057":{
   overview:"Students investigate how a major entertainment event combines branding, promotion, sponsorship, media distribution, audience engagement, and customer action to create market and revenue impact.",
   target:"I will identify distribution, pricing, promotion, sponsorship, and audience strategies in a major entertainment event.",
   success:"I will know I am successful when I can document accurate examples, explain the marketing purpose, and support my conclusions with at least 80% accuracy.",
   agenda:["Bell ringer: The Grammy Effect","Verified Grammy Marketing Mission","Evidence research and capture","Marketing-system analysis","Final verdict"],
   bellRinger:"Think of a major awards show or live entertainment event. Identify one way it earns revenue during the event and one way it creates revenue after the event ends.",
   miniLesson:"Use the verified Grammy Marketing Mission to review major-event marketing as an integrated system. Connect broadcast and streaming distribution, social clips, artist releases, brand sponsors, product placement, advertising, audience segments, fan engagement, publicity, ticket or experience value, merchandise, and post-event streaming behavior. Model evidence collection that identifies the observed example, the marketing function, the target audience, the desired action, and the possible business result.",
   activity:"Students complete the verified Grammy Marketing Mission by locating and documenting examples of branding, sponsorship, promotional media, audience engagement, distribution, product or artist exposure, and customer action. For each example, students identify the organization or artist, audience, channel, message, desired action, and potential revenue or relationship result. Students finish with a Marketing Verdict explaining the strongest strategy, the weakest missed opportunity, and whether the event increased their likelihood of streaming, following, purchasing, or engaging with an artist or brand.",
   exitTicket:"Identify the event strategy most likely to create revenue after the broadcast and explain the customer behavior it is designed to produce.",
   materials:["Grammy Marketing Mission slides","Major-event evidence sources","Marketing-function reference","Evidence and citation checklist","Final verdict rubric"],
   differentiation:["Provide a menu of evidence categories and marketing vocabulary","Allow students to use screenshots with concise explanations","Assign specific event segments or brands for focused research","Require advanced students to connect one strategy to a measurable revenue or engagement result"],
   canvas:"🎤 Open the verified Grammy Marketing Mission.\n🔍 Research accurate examples of branding, sponsorship, promotion, distribution, and audience engagement.\n🎯 Identify the target audience and desired action for each example.\n💵 Explain the possible revenue or relationship result.\n🧠 Complete the final Marketing Verdict.\n📤 Submit the completed mission in Canvas.\n✅ Earn at least 80% mastery.",
   standards:"SEM 8175.108-.111 — integrated event marketing, audience engagement, sponsorship, distribution, promotion, and revenue impact",
   notes:"Exact-resource package using Grammy Marketing Mission, file ID 1unJec73qPgOFyqZgA71SwOAuLgkT0MEa_HLfjGNonFc.",
   version:"Version 1 — SEM MP3 Grammy Marketing Mission"
  },
  "SEM-058":{
   overview:"Students analyze the major revenue streams used by sports and entertainment events and explain how each stream depends on customer value, capacity, partnerships, selling, and operations.",
   target:"I will analyze tickets, sponsorships, merchandise, concessions, media, and premium experiences as event revenue streams.",
   success:"I will know I am successful when I can explain how each revenue stream works, identify its cost and capacity risks, and recommend a balanced mix with at least 80% accuracy.",
   agenda:["Bell ringer: More than ticket sales","Verified selling slides and notes","Revenue-stream stations","Event revenue mix analysis","Exit ticket"],
   bellRinger:"A sold-out event can still earn very different amounts of money. List four revenue streams beyond the base ticket and explain why attendance alone does not determine total revenue.",
   miniLesson:"Use the verified Selling in Sports and Entertainment Marketing slides and notes to review ticket sales, season plans, suites, hospitality, sponsorships, naming rights, media rights, streaming, advertising, concessions, merchandise, parking, memberships, VIP experiences, meet-and-greets, licensing, and ancillary event services. Connect each revenue stream to target customers, benefits, costs, inventory or capacity, staffing, fulfillment, risk, and customer experience. Distinguish gross revenue from profit and recurring revenue from one-time purchases.",
   activity:"Students rotate through six revenue-stream stations: tickets and premium seating, sponsorships, media and streaming, concessions and parking, merchandise and licensing, and VIP or hospitality experiences. At each station they identify the customer or buyer, value offered, selling method, price or revenue logic, major cost, capacity limit, operational risk, and useful metric. Teams then receive an event profile and create a balanced Event Revenue Mix containing at least five streams, a primary stream, a growth opportunity, one recurring-revenue element, and one risk-control recommendation.",
   exitTicket:"Choose one event revenue stream that can grow without adding more seats and explain the resources or partnerships required.",
   materials:["Selling in Sports and Entertainment Marketing slides","Selling fill-in-the-blank notes","Revenue-stream station cards","Event Revenue Mix organizer","Revenue-risk checklist"],
   differentiation:["Provide definitions and examples for each revenue stream","Assign one station per student before group synthesis","Use a partially completed revenue mix","Require advanced students to estimate gross revenue and major costs for two streams"],
   canvas:"💰 Review the verified SEM selling slides and notes.\n🔄 Complete all six event revenue-stream stations.\n👥 Identify the buyer, value, cost, capacity, risk, and measure for each stream.\n📊 Build a balanced Event Revenue Mix with at least five streams.\n⚠️ Add one growth opportunity and one risk control.\n📤 Submit the station organizer and revenue mix in Canvas.\n✅ Earn at least 80% mastery.",
   standards:"SEM 8175.108-.111 — event revenue streams, tickets, sponsorships, media, concessions, merchandise, premium experiences, and selling",
   notes:"Exact-resource package using Selling in Sports and Entertainment Marketing, file ID 1lE_O5NdbbdTlIHKSWn9bzDhF5aBKxa7ceKu9wEV4sTI, and fill-in-the-blank notes, file ID 1IVsPr5q6o1lHcGGlf0oFILqW65FeAY1gNa5b-_rYhak.",
   version:"Version 1 — SEM MP3 event revenue streams"
  }
 };
 const ids=Object.keys(packages);
 ids.forEach(id=>{const lesson=lessons.find(item=>item.id===id);if(lesson)Object.assign(lesson,packages[id],{status:"Complete",mapStatus:"Built",duration:"45–60 minutes",components:["Lesson Plan","Learning Target","Agenda","Activity","Exit Ticket","Canvas Directions"]});});
 window.FONTaineSEMMP3EventRevenuePackagesA={count:ids.length,lessonIds:ids};
})();