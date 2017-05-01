const graphql = require('graphql');
const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema
} = graphql;

// Order of definition matters
const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString }
  }
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    // teach graphql how to get to the company associateed with the user, from the user
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        console.log('parentValue and args - check Terminal', parentValue, args);
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(res => res.data);
      }
    }
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
