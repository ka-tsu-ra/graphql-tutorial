// Schema tells graphQL exactly what app data looks like
// - what properties each object has
// - how each object is realted to each other object

const graphql = require('graphql');
const _ = require('lodash');

// user has a first name, reference to a company and a position
// company has a name
// position has a name
// users are related to other users (some kind of friendship)

// hardcode some data to begin with
const users = [
  { id: "23", firstName: "Bill", age: 20 },
  { id: "47", firstName: "Samantha", age: 40 }
];

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema // helper - takes in a rootquery, returns a graphQL schema instance
} = graphql;

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt }
  }
});

// RootQuery is to let GraphQL jump into a specific node in the data
// Fields - sets up how to query specific nodes, showing what args are to be provided. 'type' is the shape of the data it should return. 'args' is what args the query should come with to signpost the specific node. 'resolve' is where the actual data is found and returned.
// ask me about users if you give ma the id (in the args) I will return you the UserType (in the type)
// resolve: go into DB and find the actual data.
// args inside the resolve function: specifies what actual data will be returned - here referring to 'args' means the id will get returned.
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      // tell the rootquery to expect to receive an id as an argument (i.e. you'll provide an id as the info used to jump to the specific node )
      args: { id: { type: GraphQLString } },
      // make it so the args (here just the id) will be available in the return data when the resolve function executes. i.e. when actual data is fetched it's the id that will be fetched and returned.
      resolve(parentValue, args) {
        // args will be an object that includes an id property
        return _.find(users, { id: args.id }); // find the first user who has an id equal to args.id
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
