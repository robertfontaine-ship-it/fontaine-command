(() => {
  "use strict";

  const PACKET_PREFIX = "FMN-AGENCY-LAUNCH:";
  const PACKET_VERSION = 1;

  const roles = [
    { id:"account", icon:"🤝", name:"Account Executive", focus:"Client communication, priorities, timelines, and final recommendations.", skills:["Leadership","Communication","Project management"], deliverable:"Write the final client recommendation, organize the project, and explain how the solution meets the brief." },
    { id:"research", icon:"🔎", name:"Market Research Analyst", focus:"Audience evidence, competitor research, trends, and customer insight.", skills:["Research","Segmentation","Evidence"], deliverable:"Build an evidence-based audience and competitor insight report that guides the team’s decisions." },
    { id:"brand", icon:"🧭", name:"Brand Strategist", focus:"Positioning, promise, personality, identity, and consistency.", skills:["Branding","Positioning","Strategy"], deliverable:"Define the brand position, promise, personality, and identity choices for the client solution." },
    { id:"creative", icon:"✦", name:"Creative Director", focus:"Campaign concept, message, visuals, content, and customer experience.", skills:["Creative concept","Messaging","Design direction"], deliverable:"Create the campaign concept, headline, visual direction, and two sample executions." },
    { id:"partnerships", icon:"📣", name:"Partnerships & Sales Lead", focus:"Sponsors, influencers, outreach, value propositions, and activation ideas.", skills:["Selling","Partnerships","Promotion"], deliverable:"Build the partnership or sales approach, including the value proposition, outreach message, and activation idea." },
    { id:"analytics", icon:"📊", name:"Analytics Manager", focus:"Goals, KPIs, budget choices, forecasts, and measurement.", skills:["KPIs","Budgeting","Evaluation"], deliverable:"Set measurable objectives, select KPIs, create a simple budget allocation, and explain how results will be judged." }
  ];

  const briefs = [
    { id:"WA-01", category:"School", client:"Woodside Student Organization", title:"New Club Launch", summary:"A student organization needs a launch campaign that earns attention, explains its purpose, and recruits its first members.", audience:"Woodside students who do not already know the organization", problem:"Low awareness and no established identity", constraints:"School-appropriate, low-cost, launchable within two weeks", required:"Audience insight, positioning, launch idea, three promotional touchpoints, and success metrics", prompts:["Define the target student and the main reason that student would join.","Write the clearest one-sentence position or promise for the organization.","Create a launch concept with a campaign name, headline, and call to action.","Recommend three promotional touchpoints and explain the job of each one.","Set two measurable launch goals and explain how the client should track them."] },
    { id:"WA-02", category:"School", client:"Woodside Event Team", title:"Friday Night Fan Boost", summary:"A school sports, performance, or entertainment event needs a campaign that increases attendance and makes the experience feel worth showing up for.", audience:"Students, families, alumni, and nearby community members", problem:"Weak advance buzz and inconsistent attendance", constraints:"One-week campaign, limited budget, school-approved channels", required:"Event positioning, audience priority, promotional mix, experience upgrade, and measurement plan", prompts:["Choose the event and identify the primary audience segment the campaign should prioritize.","Explain the strongest reason that audience should attend instead of doing something else.","Create a campaign theme, headline, and short social caption.","Build a five-day promotional mix using at least three different promotion methods.","Recommend one on-site experience upgrade and three KPIs for evaluating the campaign."] },
    { id:"WA-03", category:"Business", client:"Wolverine School Store", title:"School Store Rebrand", summary:"The school store feels forgettable and needs a sharper identity, better product focus, and stronger reasons for students to visit.", audience:"Students, staff, families, and school supporters", problem:"Low differentiation and unclear product strategy", constraints:"Affordable products, school spirit, limited space", required:"Brand audit, target segment, identity direction, product recommendation, and launch promotion", prompts:["Describe the store’s likely current image and identify the biggest brand weakness.","Choose one primary target segment and explain what that group values.","Create a new store name or campaign identity, slogan, personality, and visual direction.","Recommend three priority products or services and explain why they fit the target segment.","Design a relaunch promotion and identify two ways to measure whether the rebrand works."] },
    { id:"WA-04", category:"Community", client:"Community Improvement Group", title:"Donation Campaign", summary:"A community organization needs a credible campaign to raise money for a visible local improvement without sounding vague or desperate.", audience:"Residents, local businesses, families, and community supporters", problem:"People agree with the cause but have not been motivated to donate", constraints:"Low-cost campaign, transparent message, realistic goal", required:"Donor segments, value proposition, campaign story, outreach plan, and trust signals", prompts:["Define the improvement being funded and the specific outcome donations will create.","Identify two donor segments and explain what would motivate each segment.","Create a campaign name, core message, and three donation levels with meaningful labels.","Write one direct outreach message and recommend three campaign channels.","Explain how the organization will build trust, report progress, and thank supporters."] },
    { id:"WA-05", category:"Business", client:"Local Small Business", title:"Business Emergency Room", summary:"A small business has a good product but declining traffic, weak promotion, and no clear reason for customers to choose it over competitors.", audience:"A specific local customer segment selected by the agency", problem:"Low traffic and weak differentiation", constraints:"Thirty-day rescue plan and modest budget", required:"Diagnosis, target market, offer strategy, campaign plan, and performance dashboard", prompts:["Choose a type of local business and diagnose three likely causes of declining traffic.","Define the target customer and identify the most important unmet need or frustration.","Recommend one product, price, place, or service change that would strengthen the offer.","Create a thirty-day promotional plan with a campaign concept and four actions.","Set a simple dashboard with four KPIs and a decision rule for what the owner should do next."] },
    { id:"WA-06", category:"Creator", client:"Emerging Student Creator", title:"Influencer Partnership Kit", summary:"An emerging creator needs a focused personal brand and a professional partnership pitch that attracts appropriate sponsors.", audience:"A defined follower community and potential brand partners", problem:"Inconsistent identity and no clear sponsor value", constraints:"Authentic, age-appropriate, and realistic for a small creator", required:"Creator positioning, content pillars, partner fit, media-kit copy, and campaign concept", prompts:["Define the creator’s niche, target follower, personality, and one-sentence promise.","Create three repeatable content pillars and explain the role of each one.","Choose one realistic brand partner and score the fit on audience, values, credibility, and risk.","Write the creator’s short media-kit introduction and a partnership outreach message.","Design one sponsored content idea and identify three results both sides should measure."] }
  ];

  const clone = value => JSON.parse(JSON.stringify(value));
  const clean = value => String(value ?? "").trim();
  const normalizeInitial = value => clean(value).slice(0, 1).toUpperCase();
  const roleById = id => roles.find(role => role.id === id) || null;
  const briefById = id => briefs.find(brief => brief.id === id) || null;

  function normalizeBrief(brief = {}) {
    const prompts = Array.isArray(brief.prompts) ? brief.prompts.map(clean).filter(Boolean).slice(0, 8) : [];
    return {
      id: clean(brief.id || brief.templateId || "CUSTOM"),
      category: clean(brief.category || "Custom"),
      client: clean(brief.client),
      title: clean(brief.title),
      summary: clean(brief.summary),
      audience: clean(brief.audience),
      problem: clean(brief.problem),
      constraints: clean(brief.constraints),
      required: clean(brief.required),
      prompts
    };
  }

  function normalizeMember(member = {}, fallbackPeriod = "") {
    return {
      first: clean(member.first),
      last: normalizeInitial(member.last),
      period: clean(member.period || fallbackPeriod),
      role: clean(member.role)
    };
  }

  function makeLaunchId() {
    const time = Date.now().toString(36).slice(-5).toUpperCase();
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `WMA-${time}${random}`;
  }

  function normalizeLaunch(input = {}) {
    const mode = input.mode === "team" ? "team" : "solo";
    const period = clean(input.period);
    const members = Array.isArray(input.members)
      ? input.members.map(member => normalizeMember(member, period)).filter(member => member.first || member.last || member.role)
      : [];
    return {
      version: PACKET_VERSION,
      launchId: clean(input.launchId) || makeLaunchId(),
      templateId: clean(input.templateId || input.brief?.id),
      createdAt: clean(input.createdAt) || new Date().toISOString(),
      updatedAt: clean(input.updatedAt) || new Date().toISOString(),
      dueDate: clean(input.dueDate),
      period,
      mode,
      teamName: clean(input.teamName),
      joinedRole: clean(input.joinedRole),
      joinedAt: clean(input.joinedAt),
      brief: normalizeBrief(input.brief),
      members
    };
  }

  function validateLaunch(input = {}) {
    const launch = normalizeLaunch(input);
    if (!launch.launchId) throw new Error("The project needs a launch ID.");
    if (!launch.period || !/^[1-7]$/.test(launch.period)) throw new Error("Choose a class period from 1 through 7.");
    if (!launch.brief.client || !launch.brief.title || !launch.brief.summary) throw new Error("Add the client, project title, and client situation.");
    if (!launch.brief.audience || !launch.brief.problem || !launch.brief.constraints || !launch.brief.required) throw new Error("Complete every client-brief field before launching.");
    if (launch.brief.prompts.length < 3) throw new Error("Add at least three clear client deliverable prompts.");
    if (launch.mode === "team") {
      if (!launch.teamName) throw new Error("Give the project team a name.");
      if (launch.members.length < 2 || launch.members.length > roles.length) throw new Error("Team projects need two to six students.");
      const identities = new Set();
      const assignedRoles = new Set();
      launch.members.forEach(member => {
        if (!member.first || !member.last || !member.role || !roleById(member.role)) throw new Error("Every teammate needs a first name, last initial, and Agency role.");
        const identity = `${member.first.toLowerCase()}|${member.last.toLowerCase()}|${member.period}`;
        if (identities.has(identity)) throw new Error("Each teammate can appear only once on the roster.");
        if (assignedRoles.has(member.role)) throw new Error("Assign a different Agency role to each teammate.");
        identities.add(identity);
        assignedRoles.add(member.role);
      });
    }
    return launch;
  }

  function toBase64Url(value) {
    return btoa(unescape(encodeURIComponent(value))).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
  }

  function fromBase64Url(value) {
    const standard = String(value).replaceAll("-", "+").replaceAll("_", "/");
    const padded = standard + "=".repeat((4 - standard.length % 4) % 4);
    return decodeURIComponent(escape(atob(padded)));
  }

  function encodeLaunch(input) {
    const launch = validateLaunch(input);
    return `${PACKET_PREFIX}${toBase64Url(JSON.stringify(launch))}`;
  }

  function encodedValue(raw) {
    let value = clean(raw);
    const hashIndex = value.indexOf("#agency-launch=");
    if (hashIndex >= 0) value = value.slice(hashIndex + "#agency-launch=".length);
    if (value.startsWith("agency-launch=")) value = value.slice("agency-launch=".length);
    try { value = decodeURIComponent(value); } catch {}
    return value.startsWith(PACKET_PREFIX) ? value.slice(PACKET_PREFIX.length) : value;
  }

  function decodeLaunch(raw) {
    const encoded = encodedValue(raw);
    if (!encoded) throw new Error("Paste the project link or code from your teacher.");
    try {
      const parsed = JSON.parse(fromBase64Url(encoded));
      if (Number(parsed.version) !== PACKET_VERSION) throw new Error("This Agency project code uses an unsupported version.");
      return validateLaunch(parsed);
    } catch (error) {
      if (/unsupported version|Choose a class period|client|deliverable|Team projects|teammate|Agency role|project team/i.test(error.message || "")) throw error;
      throw new Error("This Agency project link or code is incomplete or damaged.");
    }
  }

  function launchLink(input, baseUrl = location.href) {
    const url = new URL("wolverine-agency.html", baseUrl);
    url.hash = `agency-launch=${encodeURIComponent(encodeLaunch(input))}`;
    return url.href;
  }

  function profileKey(profile = {}) {
    return [clean(profile.first), normalizeInitial(profile.last), clean(profile.period)].map(value => value.toLowerCase()).join("|");
  }

  function memberForProfile(launch, profile) {
    const target = profileKey(profile);
    return normalizeLaunch(launch).members.find(member => profileKey(member) === target) || null;
  }

  function projectPrompts(launch, role) {
    const normalized = normalizeLaunch(launch);
    const selectedRole = role || roleById(normalized.joinedRole);
    const rows = normalized.brief.prompts.map((prompt, index) => ({
      kind: "client",
      label: `CLIENT DELIVERABLE ${index + 1} — ${prompt}`
    }));
    if (selectedRole) rows.push({ kind:"role", label:`ROLE WORK ORDER — ${selectedRole.deliverable}` });
    if (normalized.mode === "team") {
      rows.push(
        { kind:"accountability", label:"INDIVIDUAL EVIDENCE — Describe the specific asset, analysis, decision, or communication you personally completed." },
        { kind:"accountability", label:"DECISION IMPACT — Explain one team decision your work changed, strengthened, or helped the team make." },
        { kind:"accountability", label:"TEAM HANDOFF — Name the teammate or role you worked with and explain what you gave them, received from them, or improved together." }
      );
    }
    return rows;
  }

  window.FontaineAgencyKit = Object.freeze({
    PACKET_PREFIX,
    PACKET_VERSION,
    roles: clone(roles),
    briefs: clone(briefs),
    roleById,
    briefById,
    normalizeBrief,
    normalizeLaunch,
    validateLaunch,
    encodeLaunch,
    decodeLaunch,
    launchLink,
    memberForProfile,
    projectPrompts,
    makeLaunchId
  });
})();
