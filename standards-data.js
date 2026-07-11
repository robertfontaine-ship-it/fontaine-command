window.FONTaineStandards={
  courseStandards:[
    {id:"SEM-01",course:"SEM",code:"8175.MP1.01",title:"Explain marketing, customer value, and exchange",category:"Marketing Foundations",lessonIds:["SEM-003","SEM-004"],assessmentIds:["SEM-004"]},
    {id:"SEM-02",course:"SEM",code:"8175.MP1.02",title:"Apply the core marketing functions",category:"Marketing Foundations",lessonIds:["SEM-004","SEM-005","SEM-006","SEM-007"],assessmentIds:["SEM-007"]},
    {id:"SEM-03",course:"SEM",code:"8175.MP1.03",title:"Analyze sports and entertainment industries",category:"Industry Analysis",lessonIds:["SEM-008","SEM-009","SEM-010"],assessmentIds:["SEM-010"]},
    {id:"SEM-04",course:"SEM",code:"8175.MP1.04",title:"Identify and segment target markets",category:"Target Markets",lessonIds:["SEM-011","SEM-012"],assessmentIds:["SEM-012"]},
    {id:"SEM-05",course:"SEM",code:"8175.MP1.05",title:"Evaluate promotional strategies and partnerships",category:"Promotion",lessonIds:["SEM-013","SEM-014","SEM-015"],assessmentIds:["SEM-015"]},
    {id:"SEM-06",course:"SEM",code:"8175.MP1.06",title:"Apply customer service and sales processes",category:"Customer Experience",lessonIds:["SEM-016","SEM-017"],assessmentIds:["SEM-017"]},
    {id:"SEM-07",course:"SEM",code:"8175.MP1.07",title:"Demonstrate professional communication and ethical behavior",category:"Employability",lessonIds:["SEM-001","SEM-002","SEM-018","SEM-019"],assessmentIds:["SEM-019"]},
    {id:"SEM-08",course:"SEM",code:"8175.MP1.08",title:"Synthesize MP1 marketing knowledge",category:"Assessment",lessonIds:["SEM-020"],assessmentIds:["SEM-020"]},
    {id:"FASH-01",course:"Fashion",code:"8140.MP1.01",title:"Explain the fashion cycle and trend movement",category:"Fashion Foundations",lessonIds:["FASH-003","FASH-013"],assessmentIds:["FASH-013"]},
    {id:"FASH-02",course:"Fashion",code:"8140.MP1.02",title:"Analyze fashion history and cultural influence",category:"Fashion History",lessonIds:["FASH-004","FASH-005","FASH-006","FASH-007","FASH-008"],assessmentIds:["FASH-008"]},
    {id:"FASH-03",course:"Fashion",code:"8140.MP1.03",title:"Apply color theory to fashion products",category:"Design",lessonIds:["FASH-009"],assessmentIds:["FASH-009"]},
    {id:"FASH-04",course:"Fashion",code:"8140.MP1.04",title:"Apply elements and principles of design",category:"Design",lessonIds:["FASH-010","FASH-011"],assessmentIds:["FASH-011"]},
    {id:"FASH-05",course:"Fashion",code:"8140.MP1.05",title:"Connect personal style with consumer identity",category:"Consumer Behavior",lessonIds:["FASH-012","FASH-013"],assessmentIds:["FASH-012"]},
    {id:"FASH-06",course:"Fashion",code:"8140.MP1.06",title:"Evaluate fashion brands, image, and designers",category:"Branding",lessonIds:["FASH-014","FASH-015"],assessmentIds:["FASH-015"]},
    {id:"FASH-07",course:"Fashion",code:"8140.MP1.07",title:"Present and defend fashion marketing decisions",category:"Application",lessonIds:["FASH-016","FASH-017","FASH-018"],assessmentIds:["FASH-018"]},
    {id:"FASH-08",course:"Fashion",code:"8140.MP1.08",title:"Demonstrate employability and career-readiness skills",category:"Employability",lessonIds:["FASH-001","FASH-002","FASH-019"],assessmentIds:["FASH-019"]},
    {id:"FASH-09",course:"Fashion",code:"8140.MP1.09",title:"Synthesize MP1 fashion marketing knowledge",category:"Assessment",lessonIds:["FASH-020"],assessmentIds:["FASH-020"]}
  ],
  wrs:[
    [1,"Creativity and Innovation"],[2,"Critical Thinking and Problem Solving"],[3,"Initiative and Self-Direction"],[4,"Integrity"],[5,"Work Ethic"],[6,"Conflict Resolution"],[7,"Listening and Speaking"],[8,"Respect for Diversity"],[9,"Customer Service"],[10,"Teamwork"],[11,"Big-Picture Thinking"],[12,"Career and Life Management"],[13,"Continuous Learning and Adaptability"],[14,"Efficiency and Time and Resource Management"],[15,"Information Literacy"],[16,"Information Security"],[17,"Information Technology"],[18,"Job-Specific Tools and Technologies"],[19,"Mathematics"],[20,"Professionalism"],[21,"Reading and Writing"],[22,"Workplace Safety"]
  ].map(([number,title])=>({id:`WRS-${String(number).padStart(2,"0")}`,number,title,framework:"WRS"})),
  wrsMappings:{
    "WRS-01":["SEM-005","FASH-016"],"WRS-02":["SEM-004","SEM-019","FASH-013"],"WRS-03":["SEM-006","FASH-017"],"WRS-04":["SEM-019","FASH-019"],"WRS-05":["SEM-001","SEM-006","FASH-001","FASH-017"],"WRS-06":["SEM-018","FASH-018"],"WRS-07":["SEM-007","SEM-018","FASH-008","FASH-018"],"WRS-08":["SEM-009","FASH-004","FASH-013"],"WRS-09":["SEM-016","SEM-017"],"WRS-10":["SEM-001","SEM-005","FASH-001","FASH-016"],"WRS-11":["SEM-008","SEM-010","FASH-013"],"WRS-12":["SEM-002","FASH-002","FASH-019"],"WRS-13":["SEM-002","SEM-020","FASH-002","FASH-020"],"WRS-14":["SEM-006","FASH-006","FASH-017"],"WRS-15":["SEM-010","FASH-006"],"WRS-16":["SEM-019","FASH-019"],"WRS-17":["SEM-010","FASH-006"],"WRS-18":["SEM-005","FASH-009","FASH-010"],"WRS-19":["SEM-012","SEM-020"],"WRS-20":["SEM-002","SEM-018","FASH-002","FASH-019"],"WRS-21":["SEM-005","SEM-007","FASH-006","FASH-008"],"WRS-22":["SEM-001","FASH-001"]
  }
};