const semPromotionPartnershipPackages={
  "SEM-013":{
    status:"Ready to Build",
    duration:"45–60 minutes",
    components:["Lesson Plan","Learning Target","Agenda","Activity","Exit Ticket","Canvas Directions"],
    overview:"Students identify the elements of the promotional mix and apply them to sports, entertainment, and event marketing scenarios.",
    target:"I will identify and explain how sports, entertainment, and event organizations use the promotional mix to attract and influence consumers.",
    success:"I will know I am successful when I can classify promotional examples, justify my choices, and recommend an appropriate promotional mix with at least 80% accuracy.",
    agenda:["Bell ringer: Which promotion works best?","Promotional mix mini lesson","Scenario-sorting activity","Campaign recommendation challenge","Exit ticket"],
    bellRinger:"A minor league team needs to increase attendance for a Tuesday-night game. Choose one promotional method you would use first and explain why.",
    miniLesson:"Review advertising, public relations and publicity, sales promotion, personal selling, and direct or digital marketing. Use sports and entertainment examples to distinguish paid media, earned attention, short-term incentives, one-to-one persuasion, and targeted communication. Emphasize that effective campaigns combine methods based on the target market, objective, budget, timing, and desired customer action.",
    activity:"Students complete the verified SEM Promo Mix Scenario Sorting activity by placing examples under the correct promotional-mix element and explaining the evidence for each choice. Teams then receive one SEM organization and one marketing objective. They create a three-part promotional mix, identify the target audience, select the message and channel for each element, and explain how the parts work together.",
    exitTicket:"Choose one promotional-mix element. Give an original SEM example and explain why it fits that element better than one alternative.",
    materials:["SEM Promo Mix Scenario Sorting slides","Promotional-mix reference sheet","Campaign recommendation organizer","Exit ticket"],
    differentiation:["Provide definitions and one completed example for each element","Reduce the sorting set for students needing support","Allow oral justification before written responses","Require advanced students to add a budget constraint and measurement method"],
    canvas:"📣 Review each promotional-mix example.\n🗂️ Sort every scenario into the correct promotional category.\n🧠 Explain the evidence behind each decision.\n🎯 Build a three-part promotional mix for the assigned SEM organization and objective.\n📤 Submit the completed sorting activity and campaign recommendation in Canvas.\n✅ Earn at least 80% mastery.",
    standards:"SEM 8175 promotion competencies — promotional mix, target audience, communication methods, and campaign decision-making",
    notes:"Source-backed package built around the verified SEM Promo Mix Scenario Sorting slides.",
    version:"Version 1 — Source-backed promotional mix package"
  },
  "SEM-014":{
    status:"Ready to Build",
    duration:"45–60 minutes",
    components:["Lesson Plan","Learning Target","Agenda","Activity","Exit Ticket","Canvas Directions"],
    overview:"Students analyze how sponsorships and endorsements create value for brands, properties, athletes, performers, and audiences while also creating risk.",
    target:"I will analyze sponsorship and endorsement partnerships and explain how fit, audience, value, and risk affect their success.",
    success:"I will know I am successful when I can evaluate a partnership, support my judgment with evidence, and recommend an effective improvement with at least 80% accuracy.",
    agenda:["Bell ringer: Strong fit or weak fit?","Sponsorship and endorsement mini lesson","Verified case-study analysis","Partnership scorecard challenge","Exit ticket"],
    bellRinger:"Choose one athlete, performer, team, or event and one brand that would make a strong partnership. Explain the connection between their audiences and images.",
    miniLesson:"Distinguish sponsorship from endorsement. Explain that sponsors purchase association and activation opportunities, while endorsers personally represent or recommend a brand. Model evaluation using audience overlap, brand image, authenticity, reach, activation plan, exclusivity, measurable value, reputation risk, and contract expectations. Stress that visibility alone does not guarantee a good partnership.",
    activity:"Students analyze the verified SEM Endorsement Case Studies. For each case, they identify the parties, target audience, partnership objective, evidence of fit, benefits, possible risks, and overall effectiveness. Teams then use a scorecard to rank the partnerships and redesign the weakest one by changing the partner, message, activation, or audience strategy.",
    exitTicket:"What is the most important factor in a successful sponsorship or endorsement? Use one lesson example as evidence.",
    materials:["SEM Endorsement Case Studies","Partnership analysis organizer","Partnership scorecard","Redesign template","Exit ticket"],
    differentiation:["Provide a partnership vocabulary bank","Assign fewer cases with deeper analysis when needed","Use sentence frames for evidence-based judgments","Require advanced students to add contract protections and crisis-response planning"],
    canvas:"🤝 Read each sponsorship or endorsement case study.\n🎯 Identify the audience, objective, brand fit, benefits, and risks.\n📊 Score each partnership using evidence.\n🔧 Redesign the weakest partnership and explain your changes.\n📤 Submit the completed case-study organizer and redesign in Canvas.\n✅ Earn at least 80% mastery.",
    standards:"SEM 8175.087 and related sponsorship and endorsement competencies",
    notes:"Source-backed package built around the verified SEM Endorsement Case Studies document.",
    version:"Version 1 — Source-backed sponsorship and endorsement analysis"
  },
  "SEM-015":{
    status:"Ready to Build",
    duration:"45–60 minutes",
    components:["Lesson Plan","Learning Target","Agenda","Activity","Exit Ticket","Canvas Directions"],
    overview:"Students evaluate naming-rights agreements as long-term brand partnerships involving revenue, audience exposure, reputation, and strategic risk.",
    target:"I will evaluate a naming-rights partnership and explain how financial value, brand fit, audience exposure, and reputation risk affect the agreement.",
    success:"I will know I am successful when I can analyze a naming-rights case, weigh benefits and risks, and defend a recommendation with at least 80% accuracy.",
    agenda:["Bell ringer: Is the name worth it?","Naming-rights mini lesson","Verified case-study worksheet","Executive recommendation briefing","Exit ticket"],
    bellRinger:"A company offers a stadium $8 million per year for naming rights. List three questions the stadium should answer before accepting the deal.",
    miniLesson:"Explain naming rights as a sponsorship asset that connects a brand name to a venue, event, competition, or property for an extended period. Model analysis using agreement length, annual value, audience reach, media impressions, brand-property fit, activation rights, community reaction, financial stability, morality clauses, termination terms, and rebranding cost. Use the FTX Arena example to show how partner failure can create financial and reputational consequences.",
    activity:"Students complete the verified SEM Naming Rights Case Study Worksheet. They compare cases, calculate or interpret value, identify benefits and warning signs, and determine whether each agreement should be approved, renegotiated, or rejected. Teams finish by presenting a short executive recommendation that includes evidence, one contract protection, and one activation idea.",
    exitTicket:"Name one financial factor and one reputation factor that decision-makers must evaluate before signing a naming-rights agreement. Explain why each matters.",
    materials:["SEM Naming Rights Case Study Worksheet","Naming-rights decision criteria","Executive recommendation template","Calculator if needed","Exit ticket"],
    differentiation:["Provide a simplified decision-criteria checklist","Highlight key facts in each case","Allow partner discussion before individual recommendations","Require advanced students to calculate total contract value and propose termination language"],
    canvas:"🏟️ Review each naming-rights case study.\n💵 Analyze the agreement value, length, exposure, and activation opportunities.\n⚠️ Identify financial and reputation risks.\n🧠 Decide whether the deal should be approved, renegotiated, or rejected.\n🎤 Prepare a brief executive recommendation with evidence and one contract protection.\n📤 Submit the worksheet and recommendation in Canvas.\n✅ Earn at least 80% mastery.",
    standards:"SEM 8175 sponsorship and endorsement competencies, including naming-rights application and partnership risk",
    notes:"Source-backed package built around the verified SEM Naming Rights Case Study Worksheet.",
    version:"Version 1 — Source-backed naming-rights case-study package"
  }
};
Object.entries(semPromotionPartnershipPackages).forEach(([id,content])=>{
  const lesson=lessons.find(item=>item.id===id);
  if(lesson)Object.assign(lesson,content);
});
