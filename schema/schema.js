const graphql = require('graphql');
const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema
} = graphql;

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt }
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        // make resolve return a promise to work asynchronously.
        // graphql detects that it is a promise and waits for the promise to resolve, then returns the data it resolves with to the client
        return axios.get(`http://localhost:3000/users/${args.id}`) // like fetch
          .then(res => res.data); // quirk of axios - when the promise resolves it comes back in this shape { data: returnedData }
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
