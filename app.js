import createError from 'http-errors'
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

import indexRouter from './routes/index.js'
import usersRouter from './routes/users.js'
import testRouter from './routes/test.js'
import dbRouter from './routes/db.js'

const app = express();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// config
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(/*'/static',*/ express.static(path.join(__dirname, 'public')));

// General
app.use('/', indexRouter);
// User
app.use('/api/users', usersRouter);
// My
app.use('/db', dbRouter)
app.use('/test', testRouter)
const requestTime = (req, res, next) => {
  req.requestTime = Date.now()
  next()
}
app.use(requestTime)
app.get('/test/time', (req, res) => {
  let responseText = 'Hello World!<br />'
  responseText += `<small>Request at: ${req.requestTime}</small>`
  res.send(responseText)
})
// ---

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
