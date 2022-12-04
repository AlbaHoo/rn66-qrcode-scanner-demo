export const sleep1 = async (seconds) => {
  return new Promise(resolve => setTimeout(() => resolve(), seconds * 1000));
};
