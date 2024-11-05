module.exports = function override(config, env) {
  console.log("******** Override WebPack Config ********");
  const rules = config.module.rules;
  rules.splice(0, 0, {
    mimetype: "image/svg+xml",
    scheme: "data",
    type: "asset/resource",
    generator: {
      filename: "icons/[hash].svg",
    },
  });
  return config;
};
