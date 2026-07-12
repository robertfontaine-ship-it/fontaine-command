const semTargetMarketPackages={
  "SEM-011":{
    status:"Ready to Build",
    duration:"45–60 minutes",
    components:["Lesson Plan","Learning Target","Agenda","Activity","Exit Ticket","Canvas Directions"],
    overview:"Students learn how sports and entertainment marketers identify target markets and use demographic, geographic, psychographic, and behavioral information to make stronger marketing decisions.",
    target:"I will identify a target market and explain how market-segmentation information helps sports and entertainment organizations reach the right customers.",
    success:"I will know I am successful when I can identify the intended audience for an SEM product or promotion and support my answer with at least three accurate segmentation details at 80% accuracy or higher.",
    agenda:["Bell ringer: Who is this ad targeting?","Target-market and segmentation mini lesson","Targeting a Market slideshow analysis","Audience evidence challenge","Exit ticket"],
    bellRinger:"Examine three sports or entertainment advertisements. For each one, identify the most likely customer and list two clues from the advertisement that support your answer.",
    miniLesson:"Use the verified Targeting a Market Slideshow 26 to distinguish a broad market from a target market. Introduce demographic, geographic, psychographic, and behavioral segmentation. Model how marketers use age, income, location, interests, lifestyle, loyalty, usage, and purchasing behavior to decide what to offer, how to price it, where to distribute it, and how to promote it.",
    activity:"Students analyze a set of sports, entertainment, event, gaming, streaming, merchandise, and live-experience promotions. For each example, they identify the probable target market, cite visible evidence, classify at least three segmentation variables, and recommend one change that would make the promotion more effective for that audience. Students compare answers with a partner and revise one response after discussion.",
    exitTicket:"Choose one SEM product or experience. Describe its target market using one demographic, one geographic, one psychographic, and one behavioral characteristic.",
    materials:["Targeting a Market Slideshow 26","Advertisement or promotion examples","Target-market analysis organizer","Exit ticket"],
    differentiation:["Provide a segmentation vocabulary bank with examples","Use teacher-selected advertisements with clear audience clues","Allow partner discussion before independent responses","Require advanced students to identify a secondary market and explain how the message would change"],
    canvas:"🎯 Review each sports or entertainment promotion.\n👥 Identify the intended target market.\n🔎 Cite evidence from the promotion and classify demographic, geographic, psychographic, and behavioral details.\n💡 Recommend one change that would improve the promotion for its audience.\n📤 Submit the completed target-market analysis in Canvas.\n✅ Earn at least 80% mastery.",
    standards:"SEM 8175.042 — explain the concept of target marketing; apply demographic, geographic, psychographic, and behavioral segmentation",
    notes:"Source-backed lesson package built from the verified Targeting a Market Slideshow 26 and the SEM 8175 target-marketing competency.",
    version:"Version 1 — Source-backed target market introduction"
  },
  "SEM-012":{
    status:"Ready to Build",
    duration:"45–60 minutes",
    components:["Lesson Plan","Learning Target","Agenda","Activity","Exit Ticket","Canvas Directions"],
    overview:"Students apply segmentation by creating detailed fan or customer personas and matching marketing decisions to the needs, interests, behaviors, and buying motivations of each segment.",
    target:"I will create and compare SEM customer personas and use segmentation evidence to recommend appropriate marketing strategies.",
    success:"I will know I am successful when I can build an evidence-based customer persona and justify product, price, place, and promotion decisions for that segment with at least 80% accuracy.",
    agenda:["Bell ringer: Same product, different fan","Persona-building model","Fan segmentation challenge","Marketing strategy match","Exit ticket"],
    bellRinger:"A professional basketball team wants to sell the same game to a family with young children, a college student, and a corporate client. Explain one way the offer or message should change for each customer.",
    miniLesson:"Review segmentation categories and model a complete fan persona. Connect persona evidence to the marketing mix: product or experience features, acceptable price, preferred purchase channel or location, and promotional message. Emphasize that personas must be based on meaningful customer evidence rather than stereotypes or unsupported guesses.",
    activity:"Teams receive one SEM organization such as a sports franchise, concert promoter, streaming service, esports league, festival, movie studio, or venue. They create three distinct customer personas using demographic, geographic, psychographic, and behavioral information. For each persona, teams recommend a product or experience offer, price approach, distribution or access method, promotional message, and evidence explaining why the strategy fits. Teams complete a gallery walk and identify which persona-strategy match is strongest.",
    exitTicket:"Select one persona from your team. Identify the single most important segmentation detail and explain how it should influence one marketing decision.",
    materials:["Targeting a Market Slideshow 26","Customer persona template","SEM organization cards","Marketing-mix strategy organizer","Peer-feedback checklist"],
    differentiation:["Provide a partially completed persona model","Offer a bank of customer characteristics and motivations","Allow students to create two personas instead of three when additional support is needed","Require advanced students to identify conflicting needs within one segment and propose a solution"],
    canvas:"👤 Create three customer or fan personas for the assigned SEM organization.\n📊 Include demographic, geographic, psychographic, and behavioral evidence for each persona.\n🧩 Match each persona with an appropriate product, price, place, and promotion strategy.\n💬 Explain why each strategy fits the customer evidence.\n🔁 Use peer feedback to strengthen one persona-strategy match.\n📤 Submit the completed persona and strategy organizer in Canvas.\n✅ Earn at least 80% mastery.",
    standards:"SEM 8175.042 — explain and apply target marketing through customer segmentation and marketing-mix decisions",
    notes:"Source-backed application package using the verified Targeting a Market Slideshow 26. The lesson extends target-market identification into fan-persona development and strategy selection.",
    version:"Version 1 — Source-backed fan segmentation application"
  }
};
Object.entries(semTargetMarketPackages).forEach(([id,content])=>{
  const lesson=lessons.find(item=>item.id===id);
  if(lesson)Object.assign(lesson,content);
});
