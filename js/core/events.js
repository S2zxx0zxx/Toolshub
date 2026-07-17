export const Events = (() => {
  const topics = {};

  return {
    subscribe: (topic, listener) => {
      if (!topics[topic]) topics[topic] = [];
      topics[topic].push(listener);
      return {
        unsubscribe: () => {
          topics[topic] = topics[topic].filter(l => l !== listener);
        }
      };
    },
    publish: (topic, data) => {
      if (!topics[topic] || topics[topic].length < 1) return;
      topics[topic].forEach(listener => listener(data));
    }
  };
})();
