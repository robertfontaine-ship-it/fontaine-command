(()=>{
 const packages={
  "SEM-053":{
   overview:"Students evaluate how competition, fairness, transparency, fees, access, scarcity, and customer trust affect sports and entertainment pricing decisions.",
   target:"I will evaluate the competitive and ethical effects of a sports or entertainment pricing decision.",
   success:"I will know I am successful when I can identify stakeholders, analyze benefits and harms, and recommend a fair and sustainable response with at least 80% accuracy.",
   agenda:["Bell ringer: Legal, profitable, and fair?","Competition and ethics mini lesson","Verified pricing cases","Stakeholder impact analysis","Policy recommendation"],
   bellRinger:"A major event raises prices sharply as demand increases and adds fees at checkout. Explain why a profitable decision may still create a customer-trust problem.",
   miniLesson:"Review competitive pricing, market power, scarcity, price discrimination at an introductory level, variable seat value, resale markets, hidden fees, access, affordability, transparency, loyalty, consumer expectations, and long-term brand trust. Distinguish different prices that reflect meaningful value differences from confusing or unsupported charges. Model a stakeholder analysis involving customers, teams, performers, venues, sponsors, ticketing partners, employees, and community members.",
   activity:"Students complete ethical and competitive pricing scenarios from the verified Pricing Strategy Breakdown worksheet. Teams then analyze one detailed case involving sudden demand, limited capacity, competitor prices, resale activity, customer complaints, and revenue pressure. They create a stakeholder-impact chart, identify the strongest business justification, the greatest fairness concern, the evidence still needed, and three possible responses. Students write a pricing-policy recommendation covering transparency, fees, limits, communication, access, and a measure of customer trust.",
   exitTicket:"Identify one pricing practice that may increase short-term revenue but reduce long-term customer value. Explain the tradeoff.",
   materials:["Pricing slideshow and notes","Pricing Strategy Breakdown worksheet","Stakeholder-impact chart","Pricing ethics case","Policy recommendation rubric"],
   differentiation:["Provide stakeholder and ethics vocabulary","Use a partially completed impact chart","Allow structured debate before individual writing","Require advanced students to compare revenue and trust measures across two policy options"],
   canvas:"⚖️ Review competition, transparency, access, and pricing ethics.\n🔍 Complete the verified pricing cases.\n👥 Analyze the impact on customers and business stakeholders.\n🧠 Compare three possible pricing responses.\n📋 Write a fair and sustainable pricing-policy recommendation.\n📤 Submit the case analysis and policy in Canvas.\n✅ Earn at least 80% mastery.",
   standards:"SEM 8175.068-.069 — competition, ethics, transparency, access, customer trust, and sustainable pricing",
   notes:"Exact-resource package using the Pricing Strategy Breakdown worksheet and verified pricing slideshow and notes.",
   version:"Version 1 — SEM MP3 pricing competition and ethics"
  },
  "SEM-054":{
   overview:"Students apply pricing factors and strategies to set ticket prices for a venue using capacity, sections, demand, customer segments, competition, costs, and revenue goals.",
   target:"I will set ticket prices using venue, capacity, audience, competition, demand, and revenue evidence.",
   success:"I will know I am successful when I can create a complete venue price structure, calculate projected results, and defend the strategy with at least 80% accuracy.",
   agenda:["Bell ringer: One venue, different seat values","Price the Venue brief","Section and customer analysis","Ticket-pricing model build","Strategy defense"],
   bellRinger:"Why should front-row, club-level, general-admission, and obstructed-view tickets at the same event have different prices? Identify the customer-value evidence behind each difference.",
   miniLesson:"Use the verified Price the Venue assignment to review venue type, event, capacity, seat or access zones, customer segments, demand, competition, timing, costs, revenue goals, premium features, accessibility, and price strategy. Model weighted average ticket price, projected attendance, gross ticket revenue, section capacity, sell-through assumptions, and the difference between maximum possible revenue and realistic projected revenue. Review clear price presentation and customer justification.",
   activity:"Students complete the verified Price the Venue assignment. They select or receive a venue and event, define the target audience and competitors, divide capacity into logical sections or access tiers, select pricing strategies, set prices, and explain the value of each tier. Students calculate maximum ticket revenue and projected ticket revenue using expected sell-through for every tier. They add one bundle or premium upgrade, one access or affordability option, one dynamic-pricing trigger, and one customer-communication statement before defending the complete model.",
   exitTicket:"Identify the ticket tier that required the most difficult pricing decision and explain the evidence that determined its final price.",
   materials:["Assignment: Price the Venue","Pricing slideshow and notes","Venue and event data cards","Ticket-revenue calculator","Pricing-model rubric"],
   differentiation:["Provide section-capacity and calculation examples","Use a prepared venue map and rounded numbers","Allow calculator use and peer arithmetic checks","Require advanced students to test two attendance scenarios or calculate average paid price"],
   canvas:"🏟️ Open the verified Price the Venue assignment.\n👥 Define the audience, competitors, demand, and venue sections.\n🏷️ Select a pricing strategy and price for every tier.\n🧮 Calculate maximum and projected ticket revenue.\n➕ Add a bundle, access option, and dynamic-pricing trigger.\n🎤 Defend the final pricing model with evidence.\n📤 Submit the complete assignment in Canvas.\n✅ Earn at least 80% mastery.",
   standards:"SEM 8175.068-.069 — venue pricing, capacity, customer value, competition, strategy, sell-through, and revenue projection",
   notes:"Exact-resource performance package using Assignment: Price the Venue, file ID 1SvDaDmpBMMLnJ38uVP9NjJ1edTv-BY3BHMpFHqCa9pE, and the verified pricing instructional materials.",
   version:"Version 1 — SEM MP3 Price the Venue"
  }
 };
 const ids=Object.keys(packages);
 ids.forEach(id=>{const lesson=lessons.find(item=>item.id===id);if(lesson)Object.assign(lesson,packages[id],{status:"Complete",mapStatus:"Built",duration:"45–60 minutes",components:["Lesson Plan","Learning Target","Agenda","Activity","Exit Ticket","Canvas Directions"]});});
 window.FONTaineSEMMP3PricingPackagesB={count:ids.length,lessonIds:ids};
})();