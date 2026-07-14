(()=>{
 const packages={
  "SEM-055":{
   overview:"Students calculate revenue, costs, profit, margin, contribution, and break-even information and use the results to evaluate an SEM pricing decision.",
   target:"I will calculate and interpret revenue, cost, profit, margin, and break-even information for sports and entertainment offers.",
   success:"I will know I am successful when I can complete the pricing calculations accurately and use the results to recommend a business action with at least 80% accuracy.",
   agenda:["Bell ringer: Revenue is not profit","Pricing-math mini lesson","Formula and classification practice","Price the Venue calculations","Scenario decision lab"],
   bellRinger:"An event earns $100,000 in ticket revenue but spends $85,000. Identify what the revenue number does and does not reveal about performance.",
   miniLesson:"Review units sold, selling price, gross revenue, fixed cost, variable cost, total cost, contribution per unit, profit or loss, profit margin, break-even units, break-even revenue, capacity, sell-through, and average paid price. Model calculation order and unit labels. Explain how pricing changes can affect volume, revenue, contribution, and customer demand rather than assuming a higher price always creates more profit.",
   activity:"Students complete a pricing-calculation set using ticket, merchandise, concession, and package examples. They classify costs, calculate revenue, total cost, profit, margin, contribution, and break-even, and explain each result in a business sentence. Students then extend the verified Price the Venue model by calculating average paid ticket price, total projected revenue, estimated variable and fixed costs, projected profit, profit margin, and break-even attendance. Teams test a lower-price and higher-price scenario and recommend the stronger option using both math and customer-demand assumptions.",
   exitTicket:"Explain why a price that creates the highest revenue may not create the highest profit or the strongest customer outcome.",
   materials:["Pricing slideshow and notes","Assignment: Price the Venue","Pricing calculation practice","Formula reference","Scenario decision organizer","Calculator"],
   differentiation:["Provide a formula bank and completed calculation","Use rounded whole-number scenarios","Allow paired calculation checks before individual explanation","Require advanced students to calculate margin of safety or compare three price-volume scenarios"],
   canvas:"🧮 Review revenue, cost, profit, margin, contribution, and break-even formulas.\n📝 Complete the pricing calculation practice.\n🏟️ Add financial calculations to Price the Venue.\n🔄 Test lower-price and higher-price scenarios.\n📊 Use math and demand assumptions to recommend the stronger option.\n📤 Submit the calculations and recommendation in Canvas.\n✅ Earn at least 80% mastery.",
   standards:"SEM 8175.068-.069 — pricing calculations, revenue, cost, profit, margin, contribution, break-even, and business decisions",
   notes:"Exact-resource calculation package using Assignment: Price the Venue, file ID 1SvDaDmpBMMLnJ38uVP9NjJ1edTv-BY3BHMpFHqCa9pE, and the verified pricing slideshow and notes.",
   version:"Version 1 — SEM MP3 pricing and profit calculations"
  },
  "SEM-056":{
   overview:"Students demonstrate pricing mastery through strategy identification, calculations, venue decisions, ethical analysis, error correction, and an individual improvement plan.",
   target:"I will apply pricing strategies and calculations to new sports and entertainment scenarios.",
   success:"I will know I am successful when I can complete the pricing performance check and correct missed concepts with at least 80% accuracy.",
   agenda:["Bell ringer: Connect the pricing decision","Verified pricing review","Mixed strategy and math scenarios","Individual performance check","Error analysis and improvement plan"],
   bellRinger:"Explain how customer value, demand, capacity, strategy, price, revenue, cost, profit, and ethics connect in one complete pricing decision.",
   miniLesson:"Review pricing factors, dynamic pricing, premium and penetration strategies, promotional and competitive pricing, bundles, tiers, psychological pricing, customer perception, transparency, revenue, costs, profit, margin, contribution, and break-even. Model how to identify the concept being tested, select the correct formula or strategy, check units and reasonableness, and explain why a mathematically possible price may still be weak for the customer or brand.",
   activity:"Students complete selected review scenarios from the verified Pricing Strategy Breakdown worksheet and then an individual performance check. The check includes factor identification, dynamic-pricing interpretation, strategy selection, bundle and tier analysis, competition and ethics, venue pricing, percentage change, revenue, cost, profit, margin, and break-even calculations, plus one integrated recommendation. Students complete error analysis for each missed concept by naming the concept, explaining the original error, showing corrected reasoning or work, and identifying the lesson or verified source to revisit. They finish with a two-skill improvement plan.",
   exitTicket:"Identify your strongest pricing skill, your greatest remaining gap, and the exact practice you will complete next.",
   materials:["Pricing Strategy Breakdown worksheet","Pricing slideshow and notes","Individual pricing performance check","Teacher scoring guide","Error-analysis and improvement-plan organizer","Calculator"],
   differentiation:["Provide a pricing vocabulary and formula reference during review","Chunk the performance check into strategy and calculation sections","Allow oral explanation for error analysis","Require advanced students to explain why one plausible pricing alternative is weaker"],
   canvas:"📘 Review the complete SEM pricing unit.\n🧠 Complete the verified strategy scenarios.\n✅ Complete the individual pricing performance check.\n🧮 Show all calculations and label every result.\n🔍 Correct every missed concept using evidence and teacher feedback.\n🎯 Create a two-skill improvement plan.\n📤 Submit the performance check, error analysis, and plan in Canvas.\n🏁 Earn at least 80% mastery.",
   standards:"SEM 8175.068-.069 — cumulative pricing factors, strategies, ethics, venue pricing, revenue, profit, margin, and break-even analysis",
   notes:"Exact-resource cumulative package using Pricing Strategy Breakdown – Worksheet, file ID 10Qbcv1bDC4N4BAL7cMXLUo1H3C4lu15jhlt_V3BHA0U, the pricing slideshow, notes, and Price the Venue application.",
   version:"Version 1 — SEM MP3 pricing review and performance check"
  }
 };
 const ids=Object.keys(packages);
 ids.forEach(id=>{const lesson=lessons.find(item=>item.id===id);if(lesson)Object.assign(lesson,packages[id],{status:"Complete",mapStatus:"Built",duration:"45–60 minutes",components:["Lesson Plan","Learning Target","Agenda","Activity","Exit Ticket","Canvas Directions"]});});
 window.FONTaineSEMMP3PricingPackagesC={count:ids.length,lessonIds:ids};
 window.FONTaineSEMMP3PricingPackages={count:8,lessonIds:["SEM-049","SEM-050","SEM-051","SEM-052","SEM-053","SEM-054","SEM-055","SEM-056"],sourceIds:["sem-pricing-slides","sem-pricing-notes","sem-pricing-breakdown","sem-price-the-venue"]};
})();