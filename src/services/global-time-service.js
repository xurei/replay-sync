let globalTime = 0;

export const GlobalTimeService = {
  setGlobalTime(time) {
    globalTime = time;
  },
  
  getGlobalTime() {
    return globalTime;
  }
};
