const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');

const router = require('./api/routes');
const response = require('./helpers/response');
const error = require('./middleware/error');
const corsHeader = require('./middleware/corsHeader');

const app = express();

// Don't send server app information in api response
app.disable('x-powered-by');

// Use CORS
app.use(cors());
app.options('*', cors());

// Setting up basic middleware for all Express requests
app.use(morgan('combined'));

// parse request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(helmet());

// Enable CORS from client-side
app.use(corsHeader);

// add routes
router(app);

// Error handler
app.use(error);

module.exports = app;
