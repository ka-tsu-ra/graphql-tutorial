const express = require('express');
const expressGraphQL = require('express-graphql');
const graphQL = require('graphql');
const app = express();
const schema = require('./schema/schema.js');

// app.use - the middleware function is executed when the base of the requested path matches path.
app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));

app.listen(4000, () => {
  console.log('listening on port 4000')
});
