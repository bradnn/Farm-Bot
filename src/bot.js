const { FarmBot } = require('./structures/FarmBot.js');
const Config = require('../config-test.js');

const mongoose = require('mongoose');
mongoose.connect(Config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const client = new FarmBot(Config, { disableEveryone: true });

client.connect();