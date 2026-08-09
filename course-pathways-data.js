(() => {
  "use strict";

  const MASTERY_THRESHOLD = 80;

  const question = (id, skill, prompt, choices, answer, feedback, reviewHref, reviewLabel) => ({
    id,
    skill,
    prompt,
    choices,
    answer,
    feedback,
    reviewHref,
    reviewLabel
  });

  const evidence = (instruction, options) => ({ instruction, options });

  const COURSES = {
    sem: {
      id: "sem",
      code: "8175",
      shortTitle: "SEM",
      title: "Sports & Entertainment Marketing",
      icon: "🏟️",
      accent: "cyan",
      promise: "Build a fan-centered event strategy from audience evidence through revenue, recovery, and the final pitch.",
      stages: [
        {
          id: "sem-fan-intelligence",
          title: "Fan Intelligence",
          milestone: "Audience & Persona",
          outcome: "Define a usable fan segment and make decisions from evidence instead of stereotypes.",
          learn: ["Segmentation variables", "Primary and secondary audiences", "Evidence-rich fan personas"],
          evidence: evidence("Complete one fan-intelligence mission before opening the mastery check.", [
            { topic: "target-market", missionIds: ["TM-04", "TM-05", "TM-08"], label: "TM-04, TM-05, or TM-08", href: "target-market-hub.html" }
          ]),
          questions: [
            question("sem-fi-1", "Specific target markets", "A minor-league team says its target market is “everybody who likes sports.” Which revision is most useful for making marketing decisions?", ["People who watch television", "Adults in the United States", "Local families with children ages 8–14 who seek affordable weekend activities", "Anyone who has attended a game"], 2, "A usable target combines specific customer traits, location, needs, and behavior so the team can make focused decisions.", "target-market-hub.html", "Review target-market specificity"),
            question("sem-fi-2", "Behavioral segmentation", "Which fan fact is behavioral rather than demographic or geographic?", ["Lives within 20 miles of the arena", "Is between ages 16 and 24", "Values exclusive experiences", "Attends three games per season and buys tickets through the team app"], 3, "Behavioral segmentation describes actions such as purchase frequency, usage, loyalty, and response patterns.", "target-market-hub.html", "Review segmentation variables"),
            question("sem-fi-3", "Persona decisions", "A concert promoter learns that its core fan checks artist updates on TikTok, worries about transportation, and buys tickets after friends commit. What is the strongest use of that persona evidence?", ["Post the same message on every channel", "Build a TikTok group offer that includes clear transportation information", "Lower every ticket price", "Target all music listeners equally"], 1, "Strong persona work changes the message, channel, offer, or experience based on the audience’s actual behavior and barriers.", "target-market-hub.html", "Review persona application"),
            question("sem-fi-4", "Primary and secondary markets", "Why should an event identify a primary audience before a secondary audience?", ["The secondary audience can never buy tickets", "Only one audience is legally allowed", "The primary audience receives the clearest resource priority while the secondary audience gets a distinct supporting approach", "Both groups should receive identical offers"], 2, "Prioritizing a primary audience focuses limited money and attention while still allowing a different strategy for a secondary segment.", "target-market-hub.html", "Review audience prioritization"),
            question("sem-fi-5", "Evidence-based expansion", "A school showcase wants to attract alumni without losing current students. Which plan best protects both audiences?", ["Replace all student-focused content with alumni memories", "Use one generic message for everyone", "Create an alumni reunion package while keeping student pricing and student-led promotion", "Raise prices for every customer"], 2, "Audience expansion works when the new segment receives a relevant offer without confusing or removing value from the core audience.", "target-market-hub.html", "Review fan-base expansion")
          ]
        },
        {
          id: "sem-event-mix",
          title: "Event Marketing Mix",
          milestone: "Concept & 4Ps",
          outcome: "Build one connected event concept in which product, price, place, and promotion reinforce the same position.",
          learn: ["The event experience as product", "Price and access fit", "Connected 4P decisions"],
          evidence: evidence("Complete one integrated marketing-mix mission before taking this check.", [
            { topic: "four-ps", missionIds: ["4P-07", "4P-08", "4P-10"], label: "4P-07, 4P-08, or 4P-10", href: "four-ps-hub.html" }
          ]),
          questions: [
            question("sem-em-1", "Event product", "For a basketball game, which choice is part of the Product decision?", ["The halftime experience, seating options, and fan benefits", "Only the ticket’s dollar amount", "Only the arena address", "Only the social media ad"], 0, "In SEM, the product includes the full event experience, services, benefits, and supporting features—not just admission.", "four-ps-hub.html", "Review the event product"),
            question("sem-em-2", "Connected 4Ps", "A premium VIP concert package includes backstage access but is sold through a confusing paper-only process. Which P most clearly damages the intended position?", ["Product", "Price", "Place", "Promotion"], 2, "Place includes where and how customers buy and receive the offer. A high-friction process contradicts a premium experience.", "four-ps-hub.html", "Review Place and access"),
            question("sem-em-3", "Price fit", "A new student esports event needs trial and awareness. Which opening price decision best fits that goal?", ["A high premium price with no added value", "An accessible launch price with a clear deadline and capacity limit", "A random price that changes hourly", "No published price until checkout"], 1, "An accessible, transparent launch offer can reduce trial risk while protecting the long-term price with a deadline and limit.", "four-ps-hub.html", "Review pricing within the mix"),
            question("sem-em-4", "Promotion action", "Which promotional message contains the clearest customer action?", ["Our event is amazing", "Big things are coming", "Students: reserve a $10 seat by Friday in the school ticket portal", "Follow us sometime"], 2, "Strong promotion identifies the audience, value, action, channel or location, and timing.", "four-ps-hub.html", "Review promotion decisions"),
            question("sem-em-5", "Mix consistency", "An event promises an exclusive luxury experience. Which mix is most consistent?", ["Limited premium seating, concierge service, controlled distribution, and invitation-focused promotion", "Weak service, bargain pricing, mass discount outlets, and luxury ads", "No target customer, no price, and random promotion", "Premium pricing with no additional benefit"], 0, "All four Ps should support one clear position in the customer’s mind.", "four-ps-hub.html", "Review integrated 4P strategy")
          ]
        },
        {
          id: "sem-promotion-partnerships",
          title: "Promotion & Partnerships",
          milestone: "Media, Sponsors & Buzz",
          outcome: "Match promotional tools and partners to an audience, objective, message, and measurable action.",
          learn: ["Promotional-mix roles", "Sponsorship and endorsement fit", "Integrated campaign measurement"],
          evidence: evidence("Complete one campaign or partnership mission before opening the check.", [
            { topic: "promotional-mix", missionIds: ["PM-04", "PM-05", "PM-09"], label: "PM-04, PM-05, or PM-09", href: "promotional-mix-hub.html" },
            { topic: "branding", missionIds: ["BR-10"], label: "BR-10 Partnership Decision Room", href: "branding-hub.html" }
          ]),
          questions: [
            question("sem-pp-1", "Objective-tool match", "A new event needs credible local news coverage about its community impact. Which tool should lead?", ["Public relations", "A price increase", "Personal selling to every resident", "Product packaging"], 0, "Public relations is built for earned attention, credibility, community relationships, and newsworthy stories.", "promotional-mix-hub.html", "Review promotional tools"),
            question("sem-pp-2", "Sponsor fit", "Which sponsor is the strongest fit for a youth basketball clinic?", ["A company with no local presence or youth connection", "A local health system that serves families and funds youth wellness", "Any company offering the largest logo", "A brand with recent safety problems involving children"], 1, "Strong sponsorship fit combines audience overlap, shared values, credibility, useful activation, and manageable reputation risk.", "branding-hub.html", "Review partnership fit"),
            question("sem-pp-3", "Advertising vs. sales promotion", "Which action is a sales promotion?", ["A news story about the event’s scholarship fund", "A limited two-ticket bundle available through Friday", "A long-term brand-positioning statement", "A staff training session"], 1, "Sales promotion uses a short-term incentive designed to trigger a measurable customer action.", "promotional-mix-hub.html", "Review sales promotion"),
            question("sem-pp-4", "Integrated campaign", "What makes a promotional mix integrated?", ["Every tool repeats the exact same format", "Each tool performs a different job while supporting one audience, goal, and message", "The campaign uses only social media", "The campaign spends the same amount on every tool"], 1, "Integration means coordinated roles and a consistent strategy, not identical execution.", "promotional-mix-hub.html", "Review integrated promotion"),
            question("sem-pp-5", "Campaign measurement", "The campaign goal is to sell 300 student tickets. Which measure is strongest?", ["The team liked the poster", "Total social followers from all time", "Ticket purchases traced to the student campaign link", "The number of colors in the ad"], 2, "The best measure directly connects to the stated customer action and can be traced to the campaign.", "promotional-mix-hub.html", "Review measurable promotion goals")
          ]
        },
        {
          id: "sem-revenue-access",
          title: "Revenue & Access",
          milestone: "Price, Profit & Distribution",
          outcome: "Protect customer access and event profitability with defensible price, revenue, capacity, and channel decisions.",
          learn: ["Contribution and break-even", "Multiple event revenue streams", "Ticket and fulfillment access"],
          evidence: evidence("Complete one Pricing or Distribution mission before taking this check.", [
            { topic: "pricing", missionIds: [], label: "Any Pricing Strategy mission", href: "pricing-strategy-hub.html" },
            { topic: "distribution", missionIds: [], label: "Any Distribution mission", href: "distribution-hub.html" }
          ]),
          questions: [
            question("sem-ra-1", "Contribution math", "An event ticket sells for $25 and has $10 in variable costs. What is contribution per ticket?", ["$10", "$15", "$25", "$35"], 1, "Contribution per sale equals selling price minus variable cost: $25 − $10 = $15.", "pricing-strategy-hub.html", "Review contribution math"),
            question("sem-ra-2", "Break-even", "An event has $3,000 in fixed costs and earns $15 contribution per ticket. How many tickets are needed to break even?", ["45", "150", "200", "300"], 2, "Break-even units equal fixed costs divided by contribution per unit: $3,000 ÷ $15 = 200 tickets.", "pricing-strategy-hub.html", "Review break-even"),
            question("sem-ra-3", "Revenue mix", "Which decision reduces dependence on ticket revenue without automatically raising admission?", ["Add aligned sponsorship, merchandise, concessions, and premium experiences", "Hide a mandatory fee at checkout", "Remove all secondary revenue", "Oversell the venue"], 0, "A balanced revenue mix can improve event economics while preserving a clear base ticket price.", "pricing-strategy-hub.html", "Review event revenue strategy"),
            question("sem-ra-4", "Distribution access", "Mobile tickets are failing as guests reach the entrance. What is the strongest immediate channel response?", ["Tell every guest to leave", "Create staffed verification and backup-entry lanes while communicating the process", "Stop sharing updates", "Raise ticket prices"], 1, "A live distribution recovery protects access through backup processes, clear ownership, and customer communication.", "distribution-hub.html", "Review event access recovery"),
            question("sem-ra-5", "Capacity decisions", "A promotion increases demand beyond venue capacity. What should the event team do first?", ["Keep selling unlimited tickets", "Ignore safety and service limits", "Confirm capacity, inventory, staffing, and fulfillment before extending the offer", "Remove all customer information"], 2, "Marketing demand must stay connected to operational capacity and a reliable customer experience.", "distribution-hub.html", "Review capacity and fulfillment")
          ]
        },
        {
          id: "sem-fan-recovery",
          title: "Fan Experience & Recovery",
          milestone: "Service Under Pressure",
          outcome: "Recover trust during a high-pressure event failure and build prevention into the next operation.",
          learn: ["Listen–acknowledge–clarify", "Recovery authority and handoffs", "Balanced service measures"],
          evidence: evidence("Complete one event-service or recovery mission before opening this check.", [
            { topic: "service", missionIds: ["SC-06", "SC-09", "SC-10"], label: "SC-06, SC-09, or SC-10", href: "selling-customer-service-hub.html" }
          ]),
          questions: [
            question("sem-fr-1", "Recovery sequence", "A family has a ticket problem and has repeated the story twice. What should the next employee do first?", ["Ask them to start over from the beginning", "Acknowledge the frustration, review the existing notes, and confirm the immediate need", "Quote policy without listening", "Promise an unapproved refund"], 1, "Good recovery reduces customer effort, uses available information, and starts with acknowledgment and clarification.", "selling-customer-service-hub.html", "Review service recovery"),
            question("sem-fr-2", "Honest authority", "An employee does not have authority to approve compensation. What is the strongest response?", ["Promise the largest refund anyway", "Say nothing can be done", "Explain the available options and make a documented escalation with a clear update time", "Blame another department"], 2, "Employees should act within authority, explain real options, and create a complete handoff without making false promises.", "selling-customer-service-hub.html", "Review escalation and handoffs"),
            question("sem-fr-3", "Immediate priority", "At a sold-out event, one ticket scanner fails and lines are growing. Which issue has the highest immediate priority?", ["Redesign next year’s logo", "Open a safe backup entry process and communicate where guests should go", "Schedule a post-event survey", "Change the merchandise colors"], 1, "Immediate recovery protects safety and access first; longer-term analysis follows after operations stabilize.", "selling-customer-service-hub.html", "Review event recovery priorities"),
            question("sem-fr-4", "Useful follow-up", "Which follow-up best rebuilds trust after a resolved event failure?", ["A generic sales message sent immediately", "A specific confirmation of the resolution, useful next step, and contact point", "No record of the case", "A message blaming the customer"], 1, "Useful follow-up confirms what happened, supports the customer, and makes the next step easy.", "selling-customer-service-hub.html", "Review customer follow-up"),
            question("sem-fr-5", "Balanced measures", "Which scorecard best evaluates fan experience?", ["Ticket sales only", "Social likes only", "Sales, wait time, issue resolution, satisfaction, repeat intent, and safety", "Employee speed without accuracy"], 2, "Balanced measures prevent revenue or speed from hiding service, trust, accuracy, or safety failures.", "selling-customer-service-hub.html", "Review experience measurement")
          ]
        },
        {
          id: "sem-strategy-pitch",
          title: "Event Strategy Pitch",
          milestone: "SEM Capstone",
          outcome: "Defend a complete sports or entertainment strategy with evidence, numbers, risks, and measurable decisions.",
          learn: ["Claim–evidence–decision", "Integrated event strategy", "Advance–revise–stop rules"],
          evidence: evidence("Complete one Wolverine Marketing Agency client project before the capstone gate.", [
            { topic: "agency", missionIds: [], label: "Any completed Agency client project", href: "wolverine-agency.html" }
          ]),
          questions: [
            question("sem-sp-1", "Integrated recommendation", "Which opening makes the strongest strategy pitch?", ["We made a cool event", "Our research found local families need affordable Saturday entertainment, so we designed a family game-night package with a $40 bundle and school-partner promotion", "Everyone is our customer", "We chose random ideas"], 1, "A strong pitch connects audience evidence to a specific decision and value proposition.", "wolverine-agency.html", "Review client strategy"),
            question("sem-sp-2", "Evidence quality", "Which evidence best supports a ticket-price recommendation?", ["The presenter likes the number", "A competitor range, customer willingness evidence, cost math, and the event goal", "One anonymous comment", "The price uses two digits"], 1, "Defensible pricing combines customer value, competition, economics, and business objectives.", "pricing-strategy-hub.html", "Review pricing evidence"),
            question("sem-sp-3", "Pitch metrics", "A strategy aims to grow student attendance and retain existing families. Which pair of measures is strongest?", ["Student ticket conversion and family repeat intent", "Poster size and slide count", "Total population and weather", "Presenter speaking time and logo color"], 0, "Metrics should directly test both the growth goal and the risk to the core audience.", "target-market-hub.html", "Review audience metrics"),
            question("sem-sp-4", "Risk response", "What makes a contingency plan credible?", ["It says nothing will go wrong", "It names the trigger, owner, action, communication, and measure", "It only lists fears", "It depends on unlimited money"], 1, "A usable contingency plan specifies when it activates, who acts, what happens, how people are informed, and how recovery is measured.", "distribution-hub.html", "Review contingency planning"),
            question("sem-sp-5", "Decision rule", "After launch, when should the team revise rather than automatically continue?", ["When a pre-set measure misses its threshold or reveals a serious risk", "Never", "Only when a competitor complains", "Whenever one person is bored"], 0, "Advance–revise–stop rules turn results into decisions instead of allowing teams to protect a weak idea.", "wolverine-agency.html", "Review decision rules")
          ]
        }
      ]
    },
    fashion: {
      id: "fashion",
      code: "8140",
      shortTitle: "Fashion",
      title: "Fashion Marketing",
      icon: "👗",
      accent: "pink",
      promise: "Move from style-consumer insight to brand story, merchandising, responsible distribution, and a collection launch.",
      stages: [
        {
          id: "fashion-style-consumer",
          title: "Style Consumer",
          milestone: "Audience & Identity",
          outcome: "Build a specific style-consumer profile that connects identity, needs, shopping behavior, and media habits.",
          learn: ["Fashion segmentation", "Style profiles and personas", "Customer evidence"],
          evidence: evidence("Complete one fashion-relevant target-market mission before taking the check.", [
            { topic: "target-market", missionIds: ["TM-04", "TM-06", "TM-08"], label: "TM-04, TM-06, or TM-08", href: "target-market-hub.html" }
          ]),
          questions: [
            question("fashion-sc-1", "Fashion segmentation", "Which target is specific enough to guide a fashion launch?", ["People who wear clothes", "Teenagers", "High-school students in the region who want affordable statement pieces and discover trends through short-form video", "Everyone online"], 2, "A useful fashion target combines customer traits, price needs, style motives, geography, and behavior.", "target-market-hub.html", "Review fashion targeting"),
            question("fashion-sc-2", "Psychographics", "Which fact is psychographic?", ["Age 17", "Lives in Newport News", "Values individuality and sustainable production", "Bought two jackets last month"], 2, "Psychographics describe values, attitudes, interests, lifestyle, and identity.", "target-market-hub.html", "Review psychographics"),
            question("fashion-sc-3", "Behavior evidence", "A customer saves outfit videos but waits for discounts before buying. Which strategy best uses both behaviors?", ["Ignore social content", "Use shoppable styling videos with a clearly timed offer", "Raise the price without explanation", "Send the same catalog to every customer"], 1, "The strongest decision connects discovery behavior and purchase timing to the channel and offer.", "target-market-hub.html", "Review behavior-based decisions"),
            question("fashion-sc-4", "Persona quality", "Which detail makes a fashion persona most actionable?", ["The persona is stylish", "The persona includes fit concerns, budget, purchase frequency, preferred channels, and style goals", "The persona has a first name only", "The persona likes everything"], 1, "Actionable personas contain decision-driving needs, barriers, behavior, and media preferences.", "target-market-hub.html", "Review persona construction"),
            question("fashion-sc-5", "Audience adaptation", "A brand shifts from college students to working professionals. Which change is most likely needed?", ["No change to product, price, place, or message", "Adapt product function, value explanation, channels, and creative to professional needs", "Remove all customer research", "Copy a competitor exactly"], 1, "A target change should produce coordinated changes across the marketing mix.", "target-market-hub.html", "Review audience switching")
          ]
        },
        {
          id: "fashion-brand-story",
          title: "Brand & Product Story",
          milestone: "Elements, Voice & Position",
          outcome: "Use visual elements and brand choices to communicate a consistent position to the intended customer.",
          learn: ["Color, line, shape, and texture", "Brand voice and touchpoints", "Positioning consistency"],
          evidence: evidence("Complete one brand-identity or fashion-brand mission before opening this check.", [
            { topic: "branding", missionIds: ["BR-04", "BR-06", "BR-08", "BR-10"], label: "BR-04, BR-06, BR-08, or BR-10", href: "branding-hub.html" }
          ]),
          questions: [
            question("fashion-bs-1", "Visual evidence", "A brand wants a calm, minimal position. Which design direction best supports it?", ["Limited neutral palette, clean lines, and consistent spacing", "Every color, typeface, and pattern at once", "Random imagery in every channel", "A different logo on each product"], 0, "Visual elements should reinforce the intended personality and remain recognizable across touchpoints.", "branding-hub.html", "Review visual brand codes"),
            question("fashion-bs-2", "Texture and product story", "Why is texture important in fashion marketing?", ["It only changes the price tag", "It communicates look, feel, performance, and use even before the customer touches the item", "It replaces target-market research", "It has no connection to value"], 1, "Texture can signal comfort, function, quality, season, and brand position through both product and visual communication.", "branding-hub.html", "Review product storytelling"),
            question("fashion-bs-3", "Brand voice", "A youth streetwear brand uses bold, direct language. Which website line is most consistent?", ["A formal legal paragraph as the hero message", "Own the block. Built for the after-school run.", "Our organization manufactures textile-based merchandise", "No message at all"], 1, "Brand voice should sound recognizable and fit the audience, personality, product, and context.", "branding-hub.html", "Review brand voice"),
            question("fashion-bs-4", "Positioning", "Which statement is a clear position?", ["We sell clothes", "Affordable modular workwear for young professionals who need one outfit to move from commute to meeting", "We target everyone", "Our logo is blue"], 1, "Positioning identifies the customer, category or need, meaningful difference, and value.", "branding-hub.html", "Review positioning"),
            question("fashion-bs-5", "Touchpoint consistency", "A sustainable premium brand uses quality packaging but a confusing return page and dismissive service. What is the best diagnosis?", ["Only the logo matters", "The service touchpoints contradict the brand promise", "Returns are unrelated to branding", "The brand should add more colors"], 1, "Every touchpoint contributes to brand meaning; operations and service can strengthen or destroy the promise.", "branding-hub.html", "Review brand touchpoints")
          ]
        },
        {
          id: "fashion-mix-merchandising",
          title: "Fashion Mix & Merchandising",
          milestone: "Assortment, Price & Place",
          outcome: "Build a coordinated assortment and marketing mix for one fashion customer and position.",
          learn: ["Assortment and product decisions", "Fashion price architecture", "Retail and digital Place"],
          evidence: evidence("Complete one fashion-ready 4P mission before taking this check.", [
            { topic: "four-ps", missionIds: ["4P-04", "4P-06", "4P-08"], label: "4P-04, 4P-06, or 4P-08", href: "four-ps-hub.html" }
          ]),
          questions: [
            question("fashion-mm-1", "Assortment decisions", "A capsule collection promises easy outfit building. Which product decision best supports the promise?", ["Unrelated items with no shared colors or fits", "A small coordinated assortment whose pieces work together", "Unlimited products with no inventory plan", "One size for every customer"], 1, "A capsule assortment creates value through coordination, versatility, and deliberate limits.", "four-ps-hub.html", "Review Product strategy"),
            question("fashion-mm-2", "Price architecture", "What is the strongest reason to offer good-better-best price tiers?", ["To hide all product differences", "To serve different needs and budgets while making value differences clear", "To make every item identical", "To avoid choosing a target customer"], 1, "Price tiers work when each level has a clear customer, benefit, and value explanation.", "pricing-strategy-hub.html", "Review pricing structure"),
            question("fashion-mm-3", "Retail Place", "A limited designer collection depends on expert styling and scarcity. Which Place choice fits best?", ["Selective distribution through trained retailers and a controlled brand site", "Every possible discount outlet", "No way to purchase", "Random vending machines with no product information"], 0, "Selective distribution can protect service, presentation, control, and scarcity.", "distribution-hub.html", "Review fashion distribution"),
            question("fashion-mm-4", "Mix reaction", "If a brand switches from mass basics to premium made-to-order pieces, what else likely changes?", ["Nothing", "Price, lead time, channel, service, and promotional story", "Only the logo size", "Only the receipt paper"], 1, "A major Product change creates consequences across Price, Place, Promotion, and operations.", "four-ps-hub.html", "Review connected 4Ps"),
            question("fashion-mm-5", "Customer fit", "A $180 technical jacket is promoted as a disposable trend item. What is the biggest problem?", ["The message weakens the product’s value and position", "The price has three digits", "Jackets cannot be marketed", "Trends never affect fashion"], 0, "Product benefits, price, and promotional message must support the same value story.", "four-ps-hub.html", "Review mix consistency")
          ]
        },
        {
          id: "fashion-promotion-retail",
          title: "Promotion & Retail Experience",
          milestone: "Campaign to Conversion",
          outcome: "Move a specific fashion customer from discovery to confident purchase with coordinated promotion and service.",
          learn: ["Fashion promotional mix", "Customer journey content", "Conversion without pressure"],
          evidence: evidence("Complete one coordinated campaign mission before opening this check.", [
            { topic: "promotional-mix", missionIds: ["PM-04", "PM-06", "PM-09"], label: "PM-04, PM-06, or PM-09", href: "promotional-mix-hub.html" }
          ]),
          questions: [
            question("fashion-pr-1", "Journey promotion", "A shopper discovers a look on social media but needs fit confidence before purchasing. What should the next touchpoint provide?", ["A different unrelated product", "Size guidance, model measurements, reviews, and an easy exchange policy", "Less product information", "A hidden return policy"], 1, "Journey content should remove the next customer barrier instead of repeating awareness content.", "promotional-mix-hub.html", "Review customer-journey promotion"),
            question("fashion-pr-2", "Influencer fit", "Which influencer partnership is strongest?", ["The largest audience regardless of credibility", "A creator whose audience, style, values, and content format match the collection", "A creator who never discloses partnerships", "A creator with a conflicting reputation"], 1, "Fit and credibility matter more than reach alone.", "branding-hub.html", "Review partnership fit"),
            question("fashion-pr-3", "Sales promotion risk", "What is the main risk of constant deep discounts?", ["Customers may learn to wait and question the regular price", "Customers receive too much product information", "The brand becomes easier to find", "Inventory becomes visible"], 0, "Repeated discounting can damage price credibility, margin, and brand position.", "promotional-mix-hub.html", "Review promotion risks"),
            question("fashion-pr-4", "Personal selling", "Which styling question best starts a useful sales conversation?", ["You want the expensive one, right?", "What occasion, fit, and feeling are you trying to create?", "Why did you choose that size?", "Can you hurry?"], 1, "Neutral, open questions uncover the customer’s use, preferences, constraints, and desired result.", "selling-customer-service-hub.html", "Review needs discovery"),
            question("fashion-pr-5", "Conversion measurement", "Which measure best shows whether a shoppable styling video worked?", ["Video color count", "Purchases or product-page actions traced to the video", "The employee’s favorite comment", "Total internet users"], 1, "The strongest measure connects exposure to the intended customer action.", "promotional-mix-hub.html", "Review campaign measurement")
          ]
        },
        {
          id: "fashion-textiles-responsibility",
          title: "Textiles & Responsible Access",
          milestone: "Materials, Claims & Channels",
          outcome: "Connect material truth, sustainability evidence, inventory, fulfillment, and returns to customer trust.",
          learn: ["Fiber and care information", "Evidence behind sustainability claims", "Reliable omnichannel distribution"],
          evidence: evidence("Complete one fashion distribution or omnichannel mission before taking this check.", [
            { topic: "distribution", missionIds: ["DS-04", "DS-06", "DS-07", "DS-08"], label: "DS-04, DS-06, DS-07, or DS-08", href: "distribution-hub.html" }
          ]),
          questions: [
            question("fashion-tr-1", "Material truth", "A product page calls a shirt “breathable and natural.” What evidence would most strengthen the claim?", ["A larger logo", "Fiber content, construction details, care information, and verified performance evidence", "More exclamation marks", "No material label"], 1, "Specific, verifiable product information helps customers evaluate material benefits and limitations.", "distribution-hub.html", "Review product information"),
            question("fashion-tr-2", "Sustainability claims", "Which claim is most credible?", ["100% sustainable with no explanation", "Lower-impact fabric verified by a named standard, with the product’s remaining tradeoffs explained", "Eco because the package is green", "Planet perfect"], 1, "Credible claims define the improvement, show evidence, and avoid pretending tradeoffs do not exist.", "branding-hub.html", "Review responsible brand claims"),
            question("fashion-tr-3", "Care and value", "Why should care instructions appear clearly before purchase?", ["They help customers judge maintenance, lifespan, fit with lifestyle, and total value", "They only matter to the warehouse", "They replace the price", "They make returns impossible"], 0, "Care affects customer expectations, product life, satisfaction, and responsible use.", "selling-customer-service-hub.html", "Review customer education"),
            question("fashion-tr-4", "Inventory visibility", "A brand sells the same jacket online and in stores, but inventory does not sync. What is the most likely result?", ["More accurate promises", "Overselling, canceled orders, and damaged trust", "Lower return effort", "Perfect fulfillment"], 1, "Disconnected inventory creates failed promises across channels.", "distribution-hub.html", "Review omnichannel inventory"),
            question("fashion-tr-5", "Returns and responsibility", "Which return strategy balances service and waste reduction?", ["Hide the policy", "Provide accurate fit information, a clear policy, exchange options, and tracking of return reasons", "Destroy every returned item", "Refuse all communication"], 1, "Prevention, clear expectations, useful options, and return-reason data improve both customer experience and resource use.", "distribution-hub.html", "Review responsible returns")
          ]
        },
        {
          id: "fashion-collection-launch",
          title: "Collection Launch",
          milestone: "Fashion Capstone",
          outcome: "Pitch a customer-centered collection with coherent product, brand, promotion, distribution, and measurement.",
          learn: ["Collection concept and position", "Launch execution", "Evidence-based revision"],
          evidence: evidence("Complete one Wolverine Marketing Agency client project before the capstone gate.", [
            { topic: "agency", missionIds: [], label: "Any completed Agency client project", href: "wolverine-agency.html" }
          ]),
          questions: [
            question("fashion-cl-1", "Collection concept", "Which concept statement is strongest?", ["We made some clothes", "A five-piece modular collection for student creators who need expressive looks that transition from school to performance", "Everyone will like it", "The colors looked fun"], 1, "A strong concept names the customer, use, difference, and value.", "wolverine-agency.html", "Review collection strategy"),
            question("fashion-cl-2", "Launch consistency", "Which launch best supports a limited sustainable capsule?", ["Unlimited random inventory and vague claims", "Documented materials, limited coordinated pieces, transparent pricing, controlled channels, and care education", "Constant deep discounts", "No target customer"], 1, "The product, claims, price, channel, and communication should reinforce the same position.", "four-ps-hub.html", "Review launch consistency"),
            question("fashion-cl-3", "Evidence in the pitch", "Which evidence most strengthens an assortment decision?", ["The designer’s preference only", "Customer research, size and demand signals, competitor gaps, cost, and capacity", "A random trend post", "The longest product name"], 1, "Assortment decisions need customer, market, financial, and operational evidence.", "market-research-hub.html", "Review decision evidence"),
            question("fashion-cl-4", "Launch metrics", "Which dashboard is most balanced?", ["Sales only", "Reach, conversion, sell-through, returns by reason, margin, delivery accuracy, and satisfaction", "Likes only", "Inventory only"], 1, "A balanced dashboard shows demand, economics, operations, product fit, and customer response.", "wolverine-agency.html", "Review launch measurement"),
            question("fashion-cl-5", "Revision decision", "Return data shows one style has a 32% fit-related return rate. What is the strongest next action?", ["Ignore the signal", "Review size specifications and product information, test a repair, and set a new return-rate threshold", "Increase promotion immediately", "Delete all customer feedback"], 1, "A revision should diagnose the cause, change the responsible system, test the repair, and measure the new result.", "selling-customer-service-hub.html", "Review evidence-based revision")
          ]
        }
      ]
    },
    entrepreneurship: {
      id: "entrepreneurship",
      code: "9093",
      shortTitle: "Entrepreneurship",
      title: "Entrepreneurship",
      icon: "🚀",
      accent: "gold",
      promise: "Turn a real problem into tested customer value, a workable model, sound startup math, and a 30-day launch decision.",
      stages: [
        {
          id: "ent-opportunity-evidence",
          title: "Opportunity Evidence",
          milestone: "Problem, Trend & Research",
          outcome: "Separate a real customer problem from an assumption, fad, or founder preference.",
          learn: ["Problem statements", "Unbiased customer discovery", "Trend validation"],
          evidence: evidence("Complete one opportunity-discovery mission before taking this check.", [
            { topic: "startup-street", missionIds: ["SS-01", "SS-02", "SS-04"], label: "SS-01, SS-02, or SS-04", href: "startup-street.html" }
          ]),
          questions: [
            question("ent-oe-1", "Problem statements", "Which problem statement is strongest?", ["People need an app", "Commuting students miss breakfast because cafeteria service ends before their bus arrives, causing them to start class hungry", "My idea is amazing", "Everyone hates everything"], 1, "A strong problem statement names the customer, situation, problem, cause, and consequence without jumping straight to a solution.", "startup-street.html", "Review problem discovery"),
            question("ent-oe-2", "Unbiased interviews", "Which interview question produces the most useful evidence?", ["Wouldn’t you buy my great product?", "Tell me about the last time this problem happened and what you did", "Do you like saving money?", "My idea is better, right?"], 1, "Past behavior and current workarounds provide stronger evidence than compliments or hypothetical promises.", "startup-street.html", "Review customer interviews"),
            question("ent-oe-3", "Assumptions vs. evidence", "A founder’s friends say an idea sounds cool, but no intended customer has tried it. What is the best conclusion?", ["Demand is proven", "The idea should receive a large investment", "Interest is still an assumption that needs a real customer test", "The price is correct"], 2, "Friendly reactions are weak evidence; the riskiest assumption should be tested with intended customers and measurable behavior.", "startup-street.html", "Review evidence quality"),
            question("ent-oe-4", "Trend validation", "Which signal best supports a lasting opportunity?", ["One viral post", "Repeated customer behavior, growing search or sales evidence, and a durable underlying need", "The founder likes the trend", "A competitor changed its logo"], 1, "Durable trends show repeated behavior and an underlying customer or market change across more than one evidence source.", "startup-street.html", "Review trends and fads"),
            question("ent-oe-5", "Small tests", "What is the strongest first test for a new after-school meal service?", ["Build a national kitchen network", "Offer a small paid preorder to one student segment and measure conversion and repeat interest", "Order one year of inventory", "Assume everyone will buy"], 1, "A small paid test creates behavior evidence while limiting cost and risk.", "startup-street.html", "Review opportunity tests")
          ]
        },
        {
          id: "ent-value-test",
          title: "Customer Value Test",
          milestone: "Value Proposition & MVP",
          outcome: "Translate a customer problem into a focused value proposition and the smallest useful market test.",
          learn: ["Customer-centered value", "Riskiest assumptions", "Minimum viable offers"],
          evidence: evidence("Complete a value-proposition or minimum-viable-offer mission before opening this check.", [
            { topic: "startup-street", missionIds: ["SS-03", "SS-05"], label: "SS-03 or SS-05", href: "startup-street.html" }
          ]),
          questions: [
            question("ent-vt-1", "Value propositions", "Which value proposition is strongest?", ["We sell planners", "A five-minute mobile planner for student athletes who need to coordinate practice, homework, and travel without rebuilding their schedule every day", "Our product has features", "Everyone needs this"], 1, "Strong value propositions state who benefits, the problem or desired result, and a meaningful reason to choose the offer.", "startup-street.html", "Review value propositions"),
            question("ent-vt-2", "Features and benefits", "A meal container has insulated walls. Which statement is the customer benefit?", ["It has two layers", "It uses a molded lid", "It helps the customer keep food at a safe temperature longer", "It weighs 14 ounces"], 2, "A benefit explains what the feature allows the customer to do or experience.", "startup-street.html", "Review customer benefits"),
            question("ent-vt-3", "Riskiest assumption", "A tutoring startup assumes parents will pay $35 per session. What should its MVP test first?", ["Logo color", "Whether intended parents will commit at or near $35 for the defined result", "Office furniture", "A national expansion plan"], 1, "The first test should target the assumption most capable of killing the model.", "startup-street.html", "Review risky assumptions"),
            question("ent-vt-4", "MVP scope", "Which is the strongest minimum viable offer for a sneaker-cleaning service?", ["A nationwide app with 40 features", "Ten paid local cleanings using a simple booking form and a defined service standard", "A logo with no service", "A warehouse lease"], 1, "An MVP delivers the smallest real value needed to test customer behavior and operating assumptions.", "startup-street.html", "Review minimum viable offers"),
            question("ent-vt-5", "Decision thresholds", "Why should an MVP have a success threshold before it starts?", ["So the founder can change the rule to protect the idea", "So results lead to an advance, revise, or reject decision", "So no data is needed", "So every result counts as success"], 1, "Pre-set thresholds reduce bias and turn evidence into a real decision.", "startup-street.html", "Review test decision rules")
          ]
        },
        {
          id: "ent-model-ownership",
          title: "Model & Ownership",
          milestone: "How the Venture Works",
          outcome: "Connect customer value to channels, activities, partners, revenue, costs, control, and liability.",
          learn: ["Business-model dependencies", "Revenue and cost logic", "Ownership tradeoffs"],
          evidence: evidence("Complete a business-model or ownership mission before taking this check.", [
            { topic: "startup-street", missionIds: ["SS-06", "SS-08"], label: "SS-06 or SS-08", href: "startup-street.html" }
          ]),
          questions: [
            question("ent-mo-1", "Business-model fit", "A subscription snack box promises monthly delivery. Which model dependency is most critical?", ["Reliable product sourcing and fulfillment must support the monthly promise", "The logo must change monthly", "The founder must avoid customer data", "The price has no connection to cost"], 0, "A model works only when the activities, resources, partners, costs, and channels can deliver the value promise.", "startup-street.html", "Review model dependencies"),
            question("ent-mo-2", "Revenue streams", "Which is a revenue stream?", ["Monthly rent", "Customer subscription payments", "Packaging expense", "Delivery labor"], 1, "Revenue streams describe how and when customers or partners pay the venture.", "startup-street.html", "Review revenue and costs"),
            question("ent-mo-3", "Ownership recommendation", "Two active founders want liability protection, flexible control rules, and the ability to add an owner. Which structure commonly fits best?", ["Sole proprietorship", "Informal handshake only", "Limited liability company", "No ownership structure"], 2, "An LLC commonly combines liability protection with flexible management, though founders still need clear agreements and state filings.", "startup-street.html", "Review ownership structures"),
            question("ent-mo-4", "Partnership risk", "What should co-founders settle before accepting customers?", ["Ownership percentages, roles, decision rights, money rules, and exit procedures", "Only the logo", "Nothing in writing", "Only social media passwords"], 0, "Clear founder agreements reduce conflict around control, work, money, growth, and exit.", "startup-street.html", "Review founder agreements"),
            question("ent-mo-5", "Model diagnosis", "A venture has strong demand but loses money on every sale. Which part needs immediate repair?", ["The value proposition only", "The unit economics—price, variable cost, and delivery model", "The business name", "The founder biography"], 1, "Demand cannot rescue a model whose unit economics create a loss on each additional sale.", "startup-street.html", "Review business-model economics")
          ]
        },
        {
          id: "ent-startup-math",
          title: "Startup Math & Pricing",
          milestone: "Cash, Contribution & Break-even",
          outcome: "Calculate the cash required to launch and use contribution, break-even, and customer value to set decisions.",
          learn: ["Startup vs. operating costs", "Contribution per sale", "Break-even and cash planning"],
          evidence: evidence("Complete the Startup Cost Reality Check or one Pricing mission before opening this gate.", [
            { topic: "startup-street", missionIds: ["SS-07"], label: "SS-07 Startup Cost Reality Check", href: "startup-street.html" },
            { topic: "pricing", missionIds: [], label: "Any Pricing Strategy mission", href: "pricing-strategy-hub.html" }
          ]),
          questions: [
            question("ent-sm-1", "Cost classification", "Which is most likely a one-time startup cost for a mobile detailing venture?", ["Monthly phone service", "Initial pressure-washer purchase", "Weekly cleaning supplies", "Fuel used for each job"], 1, "Startup costs are incurred to open or equip the venture; recurring and per-sale costs operate it.", "startup-street.html", "Review startup costs"),
            question("ent-sm-2", "Contribution", "A service sells for $60 and uses $18 of variable labor and supplies per job. What is contribution per job?", ["$18", "$42", "$60", "$78"], 1, "Contribution equals price minus variable cost: $60 − $18 = $42.", "pricing-strategy-hub.html", "Review contribution"),
            question("ent-sm-3", "Break-even", "Monthly fixed costs are $840 and contribution is $42 per sale. What is monthly break-even volume?", ["12 sales", "20 sales", "35 sales", "42 sales"], 1, "$840 ÷ $42 = 20 sales to cover fixed costs.", "pricing-strategy-hub.html", "Review break-even math"),
            question("ent-sm-4", "Cash planning", "Why can a profitable forecast still run out of cash?", ["Cash timing may require paying costs before customer money arrives", "Profit and cash are always identical", "Customers always prepay", "Inventory is free"], 0, "Cash flow depends on timing; a venture may need money before sales are collected.", "startup-street.html", "Review cash flow"),
            question("ent-sm-5", "Price decisions", "Which price recommendation is strongest?", ["Copy a competitor without checking costs or value", "Use customer value, competitor alternatives, contribution, capacity, and the venture goal", "Choose the founder’s favorite number", "Hide all fees"], 1, "Defensible pricing connects customer value, market context, economics, capacity, and strategy.", "pricing-strategy-hub.html", "Review pricing strategy")
          ]
        },
        {
          id: "ent-launch-operations",
          title: "Launch Operations",
          milestone: "Promotion, Selling & Service",
          outcome: "Coordinate promotion, selling, delivery, service recovery, and launch metrics around one customer promise.",
          learn: ["Seven-day launch sequence", "Needs-based selling", "Service and operations measures"],
          evidence: evidence("Complete a launch-blueprint or customer-experience mission before taking this check.", [
            { topic: "startup-street", missionIds: ["SS-09"], label: "SS-09 Grand Opening Blueprint", href: "startup-street.html" },
            { topic: "service", missionIds: ["SC-04", "SC-06"], label: "SC-04 or SC-06", href: "selling-customer-service-hub.html" }
          ]),
          questions: [
            question("ent-lo-1", "Launch sequencing", "What should happen before a grand-opening promotion drives heavy demand?", ["Confirm product readiness, capacity, staffing, payment, fulfillment, and recovery plans", "Remove all inventory information", "Promise unlimited service", "Skip customer testing"], 0, "Promotion must be supported by operations capable of delivering the promise.", "startup-street.html", "Review launch readiness"),
            question("ent-lo-2", "Needs-based selling", "Which opening question is strongest for a new service customer?", ["You want our most expensive package, right?", "What result are you trying to achieve, and what has made that difficult?", "Can you pay now?", "Why did you wait?"], 1, "Neutral, open questions uncover the goal, problem, priorities, and constraints before a recommendation.", "selling-customer-service-hub.html", "Review needs discovery"),
            question("ent-lo-3", "Launch offer", "Which opening offer is least likely to damage long-term value?", ["A clearly limited trial bundle tied to first-purchase learning", "Permanent 80% discounts", "A hidden fee", "Free unlimited service with no capacity limit"], 0, "A limited trial offer can reduce risk and produce evidence without teaching customers that the regular value is false.", "startup-street.html", "Review opening offers"),
            question("ent-lo-4", "Service recovery", "An early customer receives the wrong order. What is the strongest response?", ["Blame the customer", "Acknowledge the error, verify the need, offer an authorized fix, confirm timing, and record the cause", "Delete the order", "Make an impossible promise"], 1, "Strong recovery solves the immediate problem and captures information for prevention.", "selling-customer-service-hub.html", "Review service recovery"),
            question("ent-lo-5", "Launch dashboard", "Which measure gives the clearest early warning that demand is exceeding capacity?", ["Logo impressions", "Orders waiting beyond the promised fulfillment time", "Founder excitement", "Business-card count"], 1, "Backlog and missed fulfillment standards reveal a capacity problem before it becomes widespread trust damage.", "startup-street.html", "Review launch metrics")
          ]
        },
        {
          id: "ent-venture-decision",
          title: "30-Day Venture Decision",
          milestone: "Entrepreneurship Capstone",
          outcome: "Integrate customer, model, financial, marketing, and operating evidence into an advance, revise, or stop decision.",
          learn: ["Integrated venture evidence", "Investor and founder questions", "Advance–revise–stop rules"],
          evidence: evidence("Complete one Startup Street Boss mission before the capstone gate.", [
            { topic: "startup-street", missionIds: ["SS-10", "SS-11", "SS-12"], label: "SS-10, SS-11, or SS-12", href: "startup-street.html" }
          ]),
          questions: [
            question("ent-vd-1", "Integrated evidence", "Which evidence set best supports an advance decision?", ["Compliments only", "Paid customer behavior, repeat interest, workable contribution, reliable delivery, and a manageable risk plan", "A logo and slogan", "The founder’s confidence"], 1, "A venture decision should combine customer, financial, operating, and risk evidence.", "startup-street.html", "Review venture evidence"),
            question("ent-vd-2", "Investor judgment", "A venture has strong survey interest but high variable costs and no paid test. What is the strongest decision?", ["Invest everything immediately", "Treat demand and economics as proven", "Run a paid minimum test and repair unit economics before major investment", "Ignore costs"], 2, "Survey interest is not enough when payment behavior and unit economics remain unproven.", "startup-street.html", "Review investor decisions"),
            question("ent-vd-3", "Revision logic", "Customers buy once but do not return. What should the founder investigate first?", ["Repeat value, product experience, fit, follow-up, and alternatives", "Logo size only", "A larger office", "A national launch"], 0, "Weak repeat behavior can reveal a value, experience, fit, or retention problem that growth spending would amplify.", "startup-street.html", "Review customer retention"),
            question("ent-vd-4", "Stop rule", "When is stopping a test the strongest entrepreneurial decision?", ["Whenever work becomes difficult", "When pre-set evidence repeatedly fails and the next test cannot justify its cost or risk", "Never", "When the founder receives one question"], 1, "A stop decision protects resources when the core assumptions remain unsupported after fair tests.", "startup-street.html", "Review stop rules"),
            question("ent-vd-5", "Founder dashboard", "Which dashboard is most useful at Day 30?", ["Followers only", "Customer acquisition, conversion, repeat behavior, contribution, cash, fulfillment, satisfaction, and key risk thresholds", "The number of slides", "The founder’s hours only"], 1, "A balanced founder dashboard connects market response, economics, operations, customer outcomes, and risk.", "startup-street.html", "Review founder dashboards")
          ]
        }
      ]
    }
  };

  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.values(value).forEach(deepFreeze);
    return Object.freeze(value);
  }

  window.FontaineCoursePathways = deepFreeze({
    MASTERY_THRESHOLD,
    COURSES,
    courseList: Object.values(COURSES)
  });
})();
