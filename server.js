import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import morgan from 'morgan';
import path from 'path';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';
import {connectDB} from './config/db.js';
import userRoutes from './routes/user.js';
import authRoutes from './routes/auth.js';
import bootcampRoutes from './routes/bootcamp.js';
import courseRoutes from './routes/course.js';
import reviewRoutes from './routes/review.js';
import {notFound, errorHandler} from './middlewares/error.js';

dotenv.config();

connectDB();

const app = express();

const __dirname = path.resolve();

if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
  
  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
}

app.use(express.json());
app.use(cookieParser());

app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(cors());

const limiter = rateLimit({
	windowMs: 10 * 60 * 1000,
	max: 100
});
app.use(limiter);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/bootcamps', bootcampRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/reviews', reviewRoutes);

app.use(process.env.FILE_UPLOAD_PATH, express.static(path.join(__dirname, process.env.FILE_UPLOAD_PATH)));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`.cyan.underline));
