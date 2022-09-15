import express, { ErrorRequestHandler } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
// routes
import usersRouter from './routes/users.js'
import postsRoutes from './routes/posts.js'

const app = express();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// config
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(/*'/static',*/ express.static(path.join(__dirname, 'public')));

// General
// app.use('/', indexRouter);
// User
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRoutes);

// catch 404 and forward to error handler
app.get('*', (req, res, next) => {
  res.send('404')
})

// error handler
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');

}
app.use(errorHandler);

export default app;
