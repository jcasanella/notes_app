import { default as express } from 'express';
import { default as hbs } from 'hbs';
import * as path from 'path';
// import * as favicon from 'serve-favicon';
import { default as cookieParser } from 'cookie-parser';
import { default as logger } from 'morgan';
import { default as bodyParser } from 'body-parser';
import * as http from 'http';
import { approotdir } from './approotdir.mjs';
const __dirname = approotdir;
import { normalizePort, onError, onListening, handle404, basicErrorHandler } from './appsupport.mjs';
import { router as indexRouter } from './routes/index.mjs';
import { router as notesRouter } from './routes/notes.mjs';
// import { router as notesRouter } from './routes/notes.mjs';
import { InMemoryNotesStore } from './models/notes-memory.mjs';
import { createStream } from 'rotating-file-stream';

export const app = express();
export const notesStore = new InMemoryNotesStore();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'partials'));

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// logging to file
app.use(
    logger(process.env.REQUEST_LOG_FORMAT || 'dev', {
        stream: process.env.REQUEST_LOG_FILE
            ? createStream(process.env.REQUEST_LOG_FILE, {
                  size: '10M', // Rotate every 10M written
                  interval: '1d', // Rotate daily
                  compress: 'gzip', // Compress rotated file
              })
            : process.stdout,
    })
);
// logging to console
if (process.env.REQUEST_LOG_FILE) {
    app.use(logger(process.env.REQUEST_LOG_FORMAT || 'dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(
//     '/assets/vendor/bootstrap/css',
//     express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css'))
// );
// app.use('/assets/vendor/bootstrap/css', express.static(path.join(__dirname, 'theme', 'dist', 'css')));
app.use('/assets/vendor/bootstrap/css', express.static(path.join(__dirname, 'theme', 'darkly')));
app.use(
    '/assets/vendor/popper/js',
    express.static(path.join(__dirname, 'node_modules', '@popperjs', 'core', 'dist', 'umd'))
);
app.use('/assets/vendor/bootstrap/js', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'js')));
// app.use('/assets/vendor/bootstrap/js', express.static(path.join(__dirname, 'theme', 'dist', 'js')));
app.use(
    '/assets/vendor/feather-icons/js',
    express.static(path.join(__dirname, 'node_modules', 'feather-icons', 'dist'))
);

// Router function lists
app.use('/', indexRouter);
app.use('/notes', notesRouter);

// error handlers
// catch 404 and forward to error handler
app.use(handle404);
app.use(basicErrorHandler);

export const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

export const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
