const { application } = require('./config')

const WebFramework = require('@midwayjs/web').Framework;
const web = new WebFramework().configure({
  port: application.port,
});

const { Bootstrap } = require('@midwayjs/bootstrap');
Bootstrap.load(web).run();

