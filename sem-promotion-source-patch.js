if(window.FONTaineSemSources){
  Object.assign(window.FONTaineSemSources.migrationStatus,{
    authoredLessonPackages:10,
    sourceSupportedLessons:3,
    nextBatch:"Build complete packages for SEM-016 through SEM-018"
  });
  ["SEM-013","SEM-014","SEM-015"].forEach(id=>{
    const lesson=window.FONTaineSemSources.lessons[id];
    if(lesson){
      lesson.verification="source-backed-authored-package";
      lesson.packageFile="sem-promotion-partnership-packages.js";
    }
  });
  window.FONTaineSemSources.lessons["SEM-013"].standards=["SEM 8175 promotion competencies"];
}
