if(window.FONTaineSemSources){
  Object.assign(window.FONTaineSemSources.migrationStatus,{
    phase:"SEM MP1 migration complete — quality assurance",
    authoredLessonPackages:13,
    sourceSupportedLessons:0,
    totalSeedLessons:20,
    nextBatch:"Audit lesson completeness, links, standards, and readiness before merge"
  });
  const packageFiles={
    "SEM-013":"sem-promotion-partnership-packages.js",
    "SEM-014":"sem-promotion-partnership-packages.js",
    "SEM-015":"sem-promotion-partnership-packages.js",
    "SEM-016":"sem-customer-service-selling-packages.js",
    "SEM-017":"sem-customer-service-selling-packages.js",
    "SEM-018":"sem-customer-service-selling-packages.js"
  };
  Object.entries(packageFiles).forEach(([id,packageFile])=>{
    const lesson=window.FONTaineSemSources.lessons[id];
    if(lesson){
      lesson.verification="source-backed-authored-package";
      lesson.packageFile=packageFile;
    }
  });
  window.FONTaineSemSources.lessons["SEM-013"].standards=["SEM 8175 promotion competencies"];
  window.FONTaineSemSources.lessons["SEM-016"].standards=["SEM 8175 customer service","WRS communication","WRS interpersonal skills","WRS professionalism"];
  window.FONTaineSemSources.lessons["SEM-017"].standards=["SEM 8175 selling competencies","WRS communication","WRS customer focus","WRS professionalism"];
  window.FONTaineSemSources.lessons["SEM-018"].standards=["SEM 8175 professional communication","WRS oral communication","WRS written communication","WRS teamwork"];
}