export default (data = {}) => {

  const sessions = Object.keys(data).map(playerId => {
    return {
      ...data[playerId],
      playerId,
    }
  });

  return sessions;
  
}