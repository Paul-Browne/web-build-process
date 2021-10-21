import { watch } from "chokidar";

export default (source, callback) => {
  let time = Date.now();
  const watcher = watch(source, {
    ignoreInitial: true,
    persistent: true,
  });
  watcher.on("all", (event, path) => {
    if (Date.now() > time + 1500) {
      time = Date.now();
      callback(event, path);
    }
  });
};
