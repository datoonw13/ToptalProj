let reduxStore = null;
export default {
  register: (store) => {
    reduxStore = store;
  },
  getStore: () => reduxStore,
};
