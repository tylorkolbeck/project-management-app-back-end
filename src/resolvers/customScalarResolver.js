const { GraphQLDateTime } = require("graphql-iso-date");

function Date() {
  return GraphQLDateTime;
}

module.exports = {
  Date
};
