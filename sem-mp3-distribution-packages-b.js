(()=>{
 const packages={
  "SEM-045":{
   overview:"Students select and coordinate channels for licensed merchandise, broadcasts, streaming content, social clips, music releases, and other physical and digital fan products.",
   target:"I will select distribution channels for merchandise, media rights, streaming content, and fan products.",
   success:"I will know I am successful when I can match each offer to its customer, channel, delivery method, and control requirements with at least 80% accuracy.",
   agenda:["Bell ringer: One brand, many channels","Merchandise and media distribution mini lesson","Offer-channel matching lab","Channel portfolio build","Power Move project development"],
   bellRinger:"A sports league distributes jerseys through team stores, major retailers, e-commerce sites, and licensed marketplaces while distributing games through broadcast and streaming partners. Explain why one channel cannot efficiently serve every offer.",
   miniLesson:"Compare physical merchandise distribution with media and content distribution. Review licensing, authorized retailers, wholesalers, team stores, venue stores, e-commerce, marketplaces, drop shipping, fulfillment centers, broadcast networks, streaming platforms, syndication, social distribution, downloads, subscriptions, geographic rights, release windows, exclusivity, unauthorized products, and brand control. Model a channel portfolio that matches each offer to the customer’s access habits and the organization’s revenue and control goals.",
   activity:"Students match twelve SEM offers to possible physical or digital channels and justify the strongest choice. Teams then build a channel portfolio for a sports team, artist, league, festival, or gaming property. The portfolio includes at least two merchandise channels, two media or content channels, one direct channel, one intermediary, customer segments, delivery timing, licensing or rights concerns, customer benefits, risks, and measures. Students add the selected channels and evidence to the verified Distribution Power Move template.",
   exitTicket:"Choose one offer in your channel portfolio and explain why its strongest channel differs from the strongest channel for another offer.",
   materials:["Distribution Strategy notes","Offer-channel matching cards","Channel portfolio organizer","Distribution Power Move Template","Channel-selection checklist"],
   differentiation:["Provide a channel menu organized by physical and digital offers","Use customer profiles with highlighted access habits","Allow teams to divide merchandise and media analysis before combining it","Require advanced students to address exclusivity, geographic rights, or unauthorized-product controls"],
   canvas:"📦 Review merchandise, media, and content distribution options.\n🔗 Match each SEM offer to the strongest channel.\n🧰 Build a channel portfolio with physical and digital delivery.\n⚖️ Explain licensing, rights, customer value, and channel risks.\n🖥️ Add the selected portfolio to the Distribution Power Move template.\n📤 Submit the matching lab and updated project in Canvas.\n✅ Earn at least 80% mastery.",
   standards:"SEM 8175.072-.077 — merchandise, media, content, licensing, digital delivery, and channel portfolios",
   notes:"Exact-resource application using Distribution Strategy notes and Distribution Power Move Template, file ID 1Yiw3lLiO65iOnKJ2eSL2NdUN1jcVdQvhzX1r2rFf5Vk.",
   version:"Version 1 — SEM MP3 merchandise and media distribution"
  },
  "SEM-046":{
   overview:"Students analyze inventory, capacity, forecasting, fulfillment, shipping, pickup, returns, accessibility, and service recovery as parts of the customer’s distribution experience.",
   target:"I will explain how inventory, fulfillment, shipping, and access decisions affect customer satisfaction.",
   success:"I will know I am successful when I can diagnose a fulfillment problem, recommend operational controls, and measure the customer result with at least 80% accuracy.",
   agenda:["Bell ringer: The promotion worked—now what?","Fulfillment and access mini lesson","Distribution failure stations","Inventory and capacity decisions","Power Move operations plan"],
   bellRinger:"A team’s limited-edition merchandise sells out online, orders ship late, and fans receive little communication. Identify the distribution decisions—not promotional decisions—that caused the poor experience.",
   miniLesson:"Review demand forecasting, inventory levels, stockouts, overstock, capacity, safety stock, order processing, warehousing, picking, packing, shipping, digital fulfillment, venue pickup, last-mile delivery, returns, refunds, accessibility, communication, and service recovery. Connect distribution performance to customer satisfaction, repeat purchase, brand trust, cost, and profit. Introduce measures such as fill rate, sell-through, delivery time, on-time rate, return rate, wait time, system uptime, and customer complaints.",
   activity:"Students rotate through distribution-failure stations involving sold-out merchandise, delayed shipping, long concession lines, inaccessible mobile tickets, incorrect orders, and streaming outages. They identify the root cause, affected customer, immediate response, prevention control, and performance measure. Teams then create an operations section for the Distribution Power Move project containing inventory or capacity assumptions, order or access steps, fulfillment method, customer communication, contingency plan, return or refund process, accessibility check, and three metrics.",
   exitTicket:"Select one distribution metric and explain what strong and weak performance would tell an SEM manager.",
   materials:["Distribution Strategy notes","Distribution failure station cards","Root-cause and control organizer","Distribution Power Move Template","Operations and metrics checklist"],
   differentiation:["Provide root-cause categories and metric definitions","Use a partially completed operations plan","Allow teams to complete one physical and one digital failure before extending","Require advanced students to quantify a capacity, inventory, or wait-time tradeoff"],
   canvas:"📦 Review inventory, capacity, fulfillment, access, and service recovery.\n⚠️ Diagnose each distribution-failure station.\n🛠️ Recommend an immediate response and prevention control.\n📊 Select a measurable distribution result.\n🏟️ Add the operations and contingency plan to the Distribution Power Move project.\n📤 Submit the station organizer and updated project in Canvas.\n✅ Earn at least 80% mastery.",
   standards:"SEM 8175.072-.077 — inventory, capacity, fulfillment, shipping, returns, accessibility, service recovery, and distribution measurement",
   notes:"Source-backed performance package using the verified Distribution Strategy notes and Distribution Power Move template.",
   version:"Version 1 — SEM MP3 inventory, fulfillment, and customer access"
  }
 };
 const ids=Object.keys(packages);
 ids.forEach(id=>{const lesson=lessons.find(item=>item.id===id);if(lesson)Object.assign(lesson,packages[id],{status:"Complete",mapStatus:"Built",duration:"45–60 minutes",components:["Lesson Plan","Learning Target","Agenda","Activity","Exit Ticket","Canvas Directions"]});});
 window.FONTaineSEMMP3DistributionPackagesB={count:ids.length,lessonIds:ids};
})();