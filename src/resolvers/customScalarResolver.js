const { GraphQLDateTime } = require("graphql-iso-date");

// const customScalarResolver = {
//   Date: GraphQLDateTime
// };

function Date() {
  return GraphQLDateTime;
}

module.exports = {
  Date
};
