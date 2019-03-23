import express from "express";
import compression from "compression";  // compresses requests
import bodyParser from "body-parser";
import lusca from "lusca";
import dotenv from "dotenv";
import path from "path";
import expressValidator from "express-validator";
import express_graphql from "express-graphql";
import { buildSchema } from 'graphql';
import { initDB } from "./configs/db.conf";
import { apiRouter } from "./routes";
import passport from "passport";


// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: ".env" });

// GraphQL schema
// var schema = buildSchema(`
//     type Query {
//         message: String
//         course(id: Int!): Course
//         courses(topic: String): [Course]
//     }
//     type Course {
//       id: Int
//       title: String
//       author: String
//       description: String
//       topic: String
//       url: String
//    }
// `);

// var coursesData = [
//   {
//     id: 1,
//     title: 'The Complete Node.js Developer Course',
//     author: 'Andrew Mead, Rob Percival',
//     description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
//     topic: 'Node.js',
//     url: 'https://codingthesmartway.com/courses/nodejs/'
//   },
//   {
//     id: 2,
//     title: 'Node.js, Express & MongoDB Dev to Deployment',
//     author: 'Brad Traversy',
//     description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
//     topic: 'Node.js',
//     url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
//   },
//   {
//     id: 3,
//     title: 'JavaScript: Understanding The Weird Parts',
//     author: 'Anthony Alicea',
//     description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
//     topic: 'JavaScript',
//     url: 'https://codingthesmartway.com/courses/understand-javascript/'
//   }
// ];

// var getCourse = (args: any) => {
//   var id = args.id;
//   return coursesData.filter(course => {
//     return course.id == id;
//   })[0];
// }
// var getCourses = (args: any) => {
//   if (args.topic) {
//     var topic = args.topic;
//     return coursesData.filter(course => course.topic === topic);
//   } else {
//     return coursesData;
//   }
// }
// Root resolver
// var root = {
//   message: () => 'Hello World!',
//   course: getCourse,
//   courses: getCourses
// };


// Create Express server
const app = express();

initDB();


// app.use('/graphql', express_graphql({
//   schema: schema,
//   rootValue: root,
//   graphiql: false
// }));

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

app.use(passport.initialize());
app.use(passport.session());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use('/', apiRouter);

export default app;