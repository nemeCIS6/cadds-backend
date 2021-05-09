import TaskService from './classes/service/taskService';
const express = require("express");
require('express-async-errors');
import {routes} from './routes/routes';
const settings = require('./settings');

let app = express();

app.use('/api',routes);

const server = app.listen(settings.server.port, () => {
    console.log("app running on port.", server.address().port);
});
TaskService.startuptasksAsync();