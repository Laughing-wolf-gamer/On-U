import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';


const { combine, timestamp, printf, colorize, errors } = winston.format;
const logLevel = process.env.NODE_ENV === 'production' ? 'warn' : 'info';
// Define custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
    if (stack) {
        return `${timestamp} ${level}: ${message} - ${stack}`;
    }
    return `${timestamp} ${level}: ${message}`;
});

// Logger configuration
const logger = winston.createLogger({
    level: logLevel,  // Set default log level
    format: combine(
        timestamp(),
        errors({ stack: true }),
        logFormat
    ),
    transports: [
        // Console transport (only for development or when needed in production)
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestamp(),
                logFormat
            )
        }),
        new DailyRotateFile({
            filename: path.join(__dirname, 'logs', 'app-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'info',  // Adjust level for production
            maxFiles: '14d', // Keep logs for 14 days
        }),
        new DailyRotateFile({
            filename: path.join(__dirname, 'logs', 'app-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'error', // Only log errors to this file
            maxFiles: '14d',
        })
    ]
});

// Export the logger for use in other parts of the application
export default logger;
