(()=>{
 const audit=window.FONTaineCompanionAudit,resources=window.FONTaineCompanionResources,sources=window.FONTaineCompanionSources;
 if(!audit||!Array.isArray(resources)||!sources)return;
 const types=[['organizer','Student Organizer',false],['rubric','Scoring Rubric',false],['exit','Exit Ticket',false],['assessment','Quick Check',true],['guide','Teacher Scoring Guide',true]];
 const lessonsBuilt=lessons.filter(l=>l.course==='Entrepreneurship'&&l.markingPeriod==='MP2'&&l.status==='Complete'&&l.mapStatus==='Built');
 const ids=new Set(resources.map(r=>r.id)),generated=[];
 lessonsBuilt.forEach(lesson=>types.forEach(([key,label,reviewRequired])=>{const r={id:`${lesson.id.toLowerCase()}-${key}`,title:`${lesson.id} ${label}`,course:lesson.course,type:label,lessonIds:[lesson.id],status:'Generated',verification:'Generated from the complete Entrepreneurship MP2 lesson package',reviewRequired};if(!ids.has(r.id)){resources.push(r);generated.push(r);ids.add(r.id);}}));
 const extend=(fileId,lessonIds)=>{const r=sources.verifiedSources.find(item=>item.fileId===fileId);if(r)lessonIds.forEach(id=>{if(!r.lessonIds.includes(id))r.lessonIds.push(id);});return r;};
 const extended=[
  extend('1mnfGZhekTLegcr-VkntTw9n4zFPzTTOs0pDLuIjQITY',['ENT-025']),
  extend('1oV6uakhX3qtIcztTuEu3CxDpY7ffcvF3p6emlLlvZk0',['ENT-029','ENT-030','ENT-031','ENT-032','ENT-033','ENT-034']),
  extend('1ouaBe_U_ls5dMDKXJmpUzSEdSBm0FacPdjV7Ub2vimY',['ENT-040']),
  extend('1kLvUYqPEgqyX3W-nJJqp2leRwOO4H-4roxR38YlhxqU',['ENT-040'])
 ].filter(Boolean);
 const verified=[
  {id:'verified-ent-mp2-promo-slides',title:'The Promotional Mix for Entrepreneurs',course:'Entrepreneurship',type:'Instructional Slides',lessonIds:['ENT-021','ENT-022','ENT-023','ENT-024','ENT-025','ENT-026'],fileId:'1Rv_auMZVczamgIeddA1n9l6GD2MouvYpdE2aCzm2Be4',url:'https://docs.google.com/presentation/d/1Rv_auMZVczamgIeddA1n9l6GD2MouvYpdE2aCzm2Be4',status:'Verified in Drive'},
  {id:'verified-ent-mp2-business-reboot',title:'Business Reboot Challenge',course:'Entrepreneurship',type:'Student Organizer',lessonIds:['ENT-027','ENT-028'],fileId:'1zvvNKyQ-zaFfcl_VRjukfTyoduxSY1BUHWB5LTdztpQ',url:'https://docs.google.com/document/d/1zvvNKyQ-zaFfcl_VRjukfTyoduxSY1BUHWB5LTdztpQ',status:'Verified in Drive'},
  {id:'verified-ent-mp2-business-reboot-plan',title:'Business Reboot Challenge 3-Day Plan',course:'Entrepreneurship',type:'Student Organizer',lessonIds:['ENT-027','ENT-028'],fileId:'1nMcjCenYFA-JOnQ7IJOGahScx-LUV0S9eQGSg0zmRtI',url:'https://docs.google.com/document/d/1nMcjCenYFA-JOnQ7IJOGahScx-LUV0S9eQGSg0zmRtI',status:'Verified in Drive'},
  {id:'verified-ent-mp2-ownership-slides',title:'Types of Business Ownership',course:'Entrepreneurship',type:'Instructional Slides',lessonIds:['ENT-029','ENT-030','ENT-031','ENT-032','ENT-033','ENT-034'],fileId:'1JFkNo03XOFkoyQwrx2otmaBJdrFM1JVDLh_bm6Abp-U',url:'https://docs.google.com/presentation/d/1JFkNo03XOFkoyQwrx2otmaBJdrFM1JVDLh_bm6Abp-U',status:'Verified in Drive'},
  {id:'verified-ent-mp2-startup-legal-case',title:'Power Washing Business: A Step-by-Step Guide',course:'Entrepreneurship',type:'Student Organizer',lessonIds:['ENT-034','ENT-035'],fileId:'1VSlbHAt7eZfV6Dh-F5EN_LhdW_JO4Uo28t45i_Gy7rs',url:'https://docs.google.com/document/d/1VSlbHAt7eZfV6Dh-F5EN_LhdW_JO4Uo28t45i_Gy7rs',status:'Verified in Drive'},
  {id:'verified-ent-mp2-financial-slides',title:'Financial Aspects of Business',course:'Entrepreneurship',type:'Instructional Slides',lessonIds:['ENT-036','ENT-037','ENT-038','ENT-039','ENT-040'],fileId:'1gX7ylIDOKghr8C3GThL1EWuNAK5GXJyMVPOuThSf1gg',url:'https://docs.google.com/presentation/d/1gX7ylIDOKghr8C3GThL1EWuNAK5GXJyMVPOuThSf1gg',status:'Verified in Drive'},
  {id:'verified-ent-mp2-business-plan-template',title:'Business Plan Template',course:'Entrepreneurship',type:'Student Organizer',lessonIds:['ENT-036','ENT-037','ENT-038','ENT-039'],fileId:'1NMqCqQ6rRBV7xHUhVKsu6TH0CNl_vSZ8',url:'https://drive.google.com/file/d/1NMqCqQ6rRBV7xHUhVKsu6TH0CNl_vSZ8',status:'Verified in Drive'}
 ];
 const added=[];verified.forEach(r=>{if(!ids.has(r.id)){resources.push(r);sources.verifiedSources.push(r);added.push(r);ids.add(r.id);}});
 const pattern=/worksheet|organizer|matrix|template|chart|checklist|rubric|assessment|performance check|review|answer key|notes|cards|station|forecast|statement|register|brief/i;
 const demandType=m=>{const v=String(m).toLowerCase();if(v.includes('answer key'))return'Answer Key';if(v.includes('rubric')||v.includes('checklist'))return'Scoring Rubric';if(v.includes('assessment')||v.includes('performance check')||v.includes('review'))return'Assessment';return'Student Organizer';};
 lessonsBuilt.forEach(l=>(l.materials||[]).filter(m=>pattern.test(m)).forEach(material=>{const type=demandType(material),verifiedMatch=sources.verifiedSources.some(r=>r.lessonIds.includes(l.id)&&r.type===type);sources.demands.push({lessonId:l.id,course:l.course,title:l.title,material,type,verified:verifiedMatch,status:verifiedMatch?'Verified in Drive':'Generated coverage only'});}));
 audit.totalLessons+=lessonsBuilt.length;audit.generatedResources+=generated.length;audit.verifiedResources+=added.length;audit.materialDemands=sources.demands.length;audit.generatedOnlyDemands=sources.demands.filter(i=>!i.verified).length;
 window.FONTaineEntrepreneurshipMP2CompanionResources={lessons:lessonsBuilt.length,generated:generated.length,verified:added.length,extendedVerified:extended.length};
 const before=render;render=function(){before();if(state.page!=='Companion Resources')return;const g=document.querySelector('[data-companion-metric="generated"] strong'),l=document.querySelector('[data-companion-metric="lessons"] strong');if(g)g.textContent=String(audit.generatedResources);if(l)l.textContent=String(audit.totalLessons);};
})();