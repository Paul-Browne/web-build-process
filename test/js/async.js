const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export default async (ms, callback) => {
  await timeout(ms);
  return callback();
};
