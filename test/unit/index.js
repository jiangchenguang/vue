
const helperContext = require.context("../helper", true);
helperContext.keys().forEach(helperContext);


const testsContext = require.context("./", true, /\.spec$/);
testsContext.keys().forEach(testsContext);