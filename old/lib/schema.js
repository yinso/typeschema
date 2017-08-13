var Integer = require('./integer').Integer;

function addProperty(target, key, options, ctor) {
  var constructor = target.constructor;
  if (!constructor.hasOwnProperty('__schema')) {
    constructor.__schema = {
      type: 'object',
      properties: {

      }
    };
  }
  constructor.__schema.properties[key] = {
    options: options,
    ctor: ctor
  };
  console.info('addProperty', constructor, key);
}

module.exports = {
  addProperty: addProperty
};
