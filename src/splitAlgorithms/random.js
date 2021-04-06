/**
 * @param  {} maxUsers - max number of users to sample
 * @param  {} ratio
 */
const generateRandomVariantList = (maxUsers, ratio) => {
  const list = Array.from({ length: maxUsers }, () => '');
  for (let i = 0; i < ratio.length; i += 1) {
    for (let j = 0; j < ratio[i].percentage; j += 1) {
      const index = Math.floor(Math.random() * 100);
      if (!list[index]) {
        list[index] = ratio[i].name;
      } else {
        // This slot is already filled. Try again
        j -= 1;
      }
    }
  }
  return list;
};

/**
 * @param  {}
 */
const randomRoutingFactory = ({ maxUsers, splitTraffic: { ratio } }) => {
  let userIndex = 0;
  let randomlyFilledList = generateRandomVariantList(maxUsers, ratio);
  const randomRouting = () => {
    const userIndexToReturn = userIndex;
    userIndex += 1;
    if (userIndex === maxUsers) {
      // time to reset
      userIndex = 0;
      randomlyFilledList = generateRandomVariantList(maxUsers, ratio);
    }
    return randomlyFilledList[userIndexToReturn];
  };
  return randomRouting;
};

module.exports = randomRoutingFactory;
