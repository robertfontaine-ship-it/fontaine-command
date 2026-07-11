const resetLocalDataBeforeCalendar=resetLocalData;
resetLocalData=function(){
  localStorage.removeItem(INSTRUCTIONAL_DAY_KEY);
  resetLocalDataBeforeCalendar();
};