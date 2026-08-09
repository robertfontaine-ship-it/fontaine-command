window.HUB_CONFIG = {
  id: "pricing",
  title: "Pricing Strategy",
  missions: [
    {
      id: "PS-01",
      level: "Quick",
      entries: 1,
      minutes: 8,
      title: "Price Signal Scan",
      brief: "Read the clues around a price and infer the customer, position, and goal it communicates.",
      outcomes: ["Interpret price as a market signal", "Connect price to customer and position"],
      prompts: [
        "Choose a real product, ticket, service, meal, fashion item, or subscription and state its exact price and where it is sold.",
        "List three clues that help explain the price, such as quality, features, scarcity, service, location, brand image, competitor prices, or target customer.",
        "Identify the likely pricing objective and market position, then explain whether the price and customer experience tell one consistent story."
      ]
    },
    {
      id: "PS-02",
      level: "Quick",
      entries: 1,
      minutes: 12,
      title: "Break-Even Sprint",
      brief: "Use contribution per unit to find break-even volume and expected profit.",
      outcomes: ["Calculate contribution and break-even", "Interpret the business meaning of the result"],
      prompts: [
        "Use this case: fixed costs are $1,200, variable cost is $8 per unit, and selling price is $20. Calculate contribution per unit and show the formula.",
        "Calculate break-even units and break-even sales revenue. Round units up when a calculation is not a whole number.",
        "Calculate profit or loss at 160 units, then explain one decision the owner should make using the result."
      ]
    },
    {
      id: "PS-03",
      level: "Quick",
      entries: 1,
      minutes: 10,
      title: "Strategy Match Room",
      brief: "Match pricing methods to business situations instead of using one strategy everywhere.",
      outcomes: ["Distinguish major pricing strategies", "Defend strategy-situation fit"],
      prompts: [
        "Match one strategy to each situation: a new streaming service needs rapid trial; a patented game console launches with limited supply; a local store sells the same charger as five competitors; and a luxury label protects exclusivity. Use penetration, skimming, competitive, and premium pricing once each.",
        "Explain the objective, target customer, and greatest risk for each of your four matches.",
        "Choose one situation where a different strategy could also work and name the evidence that would decide between the two options."
      ]
    },
    {
      id: "PS-04",
      level: "Skill",
      entries: 2,
      minutes: 20,
      title: "Cost-to-Price Lab",
      brief: "Build a sustainable price from fixed costs, variable costs, volume, and a profit target.",
      outcomes: ["Build a cost-based price floor", "Test price and volume assumptions"],
      prompts: [
        "Create a small product, food item, service, event add-on, or fashion item. Estimate monthly fixed costs, variable cost per unit, and realistic monthly sales volume.",
        "Calculate total monthly cost, cost per unit at the expected volume, and the minimum price needed to avoid a loss.",
        "Set a specific selling price and calculate expected monthly revenue, contribution, and profit. Show every formula.",
        "Test a low-volume case at 70% of expected sales and explain whether the price, costs, or launch plan should change."
      ]
    },
    {
      id: "PS-05",
      level: "Skill",
      entries: 2,
      minutes: 20,
      title: "Good-Better-Best Builder",
      brief: "Design three price tiers that create meaningful customer choice without using fake differences.",
      outcomes: ["Create a tiered pricing architecture", "Connect benefits to willingness to pay"],
      prompts: [
        "Choose a service, subscription, event package, sneaker customization offer, meal plan, or fashion product and define the primary customer.",
        "Build Good, Better, and Best tiers with a specific price, included features, service level, and customer benefit for each.",
        "Explain the price gap between tiers using additional customer value and estimated additional cost.",
        "Predict which tier should sell most, identify one sign that a tier is poorly designed, and state how you would adjust it."
      ]
    },
    {
      id: "PS-06",
      level: "Skill",
      entries: 2,
      minutes: 22,
      title: "Competitor Price Map",
      brief: "Compare competing offers without assuming the lowest price is automatically strongest.",
      outcomes: ["Build a price-value comparison", "Find a defensible market position"],
      prompts: [
        "Choose three real competing offers or use this set: Basic at $18 with no support, Plus at $24 with easy returns, and Premium at $32 with customization and priority service.",
        "Compare price, core features, service, convenience, brand signal, and likely target customer in a three-row scorecard.",
        "Design a fourth offer with a specific target, price, and value difference that does not simply copy the cheapest competitor.",
        "Write a one-sentence value explanation and name the competitor response that creates the greatest risk."
      ]
    },
    {
      id: "PS-07",
      level: "Skill",
      entries: 2,
      minutes: 22,
      title: "Discount Volume Test",
      brief: "Calculate how much additional volume a discount must create before approving it.",
      outcomes: ["Measure the contribution impact of a discount", "Set a decision rule for promotions"],
      prompts: [
        "Use this case: regular price is $40, variable cost is $18, and expected sales are 100 units. Calculate total contribution before any discount.",
        "A 25% discount lowers the price to $30. Calculate contribution per discounted unit and the units required to equal the original total contribution. Round up.",
        "Calculate the percentage increase in unit sales required. Explain whether the discount appears realistic for a specific target customer and sales channel.",
        "Recommend approve, revise, or reject and create one metric and stop rule for the promotion."
      ]
    },
    {
      id: "PS-08",
      level: "Boss",
      entries: 4,
      minutes: 38,
      title: "Launch Pricing Command Center",
      brief: "Build a complete pricing plan that connects economics, customer value, competition, and launch decisions.",
      outcomes: ["Create an integrated pricing strategy", "Build measurable adjustment rules"],
      prompts: [
        "Create a product, service, event, fashion collection, entertainment release, or venture. Define the primary customer, position, pricing objective, and closest alternatives.",
        "Build a cost model with fixed cost, variable cost, expected volume, contribution per unit, break-even units, and expected profit at your recommended price.",
        "Compare cost-based, competitive, and value-based price evidence. Explain why your final price is stronger than one lower and one higher alternative.",
        "Design the price presentation, including any tiers, bundle, payment option, launch offer, or fee disclosure. Explain how it protects trust and brand position.",
        "Create a 30-day scorecard with volume, revenue, margin, conversion, and customer-response measures plus two exact rules for raising, lowering, or holding the price."
      ]
    },
    {
      id: "PS-09",
      level: "Boss",
      entries: 4,
      minutes: 36,
      title: "Game-Day Revenue Control",
      brief: "Set ticket and add-on prices for a live event with limited capacity and uncertain demand.",
      outcomes: ["Price limited-capacity inventory", "Balance revenue, access, and experience"],
      prompts: [
        "Use this case: a 1,000-seat event has $18,000 fixed cost and $6 variable cost per attendee. Demand estimates are 300 premium buyers, 500 standard buyers, and 350 price-sensitive buyers. Define the event and audience.",
        "Create at least three ticket tiers with seat quantities and prices. Calculate sellout ticket revenue, total cost at sellout, and expected ticket profit.",
        "Add one bundle or add-on and estimate its contribution. Explain why it fits rather than exploits the target customer.",
        "Create an early-sales checkpoint and an exact pricing or promotional response if sales are below, on, or above plan.",
        "Name two customer-experience risks created by the pricing plan and how the event will reduce them."
      ]
    },
    {
      id: "PS-10",
      level: "Boss",
      entries: 4,
      minutes: 35,
      title: "Pricing Failure Autopsy",
      brief: "Diagnose a broken pricing system and rebuild it before the market loses trust.",
      outcomes: ["Diagnose pricing-system failures", "Recommend a sequenced recovery"],
      prompts: [
        "Use this case: A new apparel brand copies a luxury competitor’s $140 price, has a $92 unit cost, runs 40% discounts every weekend, charges an unexpected $18 checkout fee, gives stores different prices, and never measures returns or margin.",
        "Identify at least seven problems involving objectives, costs, customer value, competition, discounts, consistency, transparency, or measurement.",
        "Calculate contribution per unit at the regular price and at the discounted price before the checkout fee. Explain what the math reveals.",
        "Rebuild the regular price, discount rule, fee presentation, and channel policy for one specific target customer and position.",
        "Create a 60-day recovery sequence with four measures and a rule for determining whether customer trust and profitability are improving."
      ]
    }
  ]
};
