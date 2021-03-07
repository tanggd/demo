const { java } = require("apache-dubbo-js");

const demoProvider = (dubbo) =>
  dubbo.proxyService({
    dubboInterface: "cci.hx.com.activiti.api.ActivitiExcuteService",
    version: "1.0.0",
    timeout: 300000,
    methods: {
      excute(json) {
        return [java.String(json)];
      },
      test(name) {
        return [java.String(name)];
      },
    },
  });

module.exports = {
  demoProvider,
};
