Clothing Brand On-U



import { createLogger, transports, format } from 'winston';
import 'winston-daily-rotate-file';

const logLevel = process.env.NODE_ENV === 'production' ? 'warn' : 'info';


const commonLogFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.splat(),
  format.printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `${timestamp} ${level}: ${message}\n${stack}`
      : `${timestamp} ${level}: ${message}`;
  })
);

const createDynamicLogger = (logName) => {
  const dailyRotateTransport = new transports.DailyRotateFile({
    filename: `logs/${logName}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
  });

  const logger = createLogger({
    level: logLevel,
    format: commonLogFormat,
    transports: [
      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.simple()
        ),
      }),
      dailyRotateTransport,
    ],
    exceptionHandlers: [dailyRotateTransport],
    rejectionHandlers: [dailyRotateTransport],
  });

  return logger;
};

// Create loggers dynamically
const appLogger = createDynamicLogger('app');
const adminLogger = createDynamicLogger('admin');
const employeeLogger = createDynamicLogger('employee');
const appDetailsLogger = createDynamicLogger('appDetails');
const authLogger = createDynamicLogger('auth');
const bonusLogger = createDynamicLogger('bonus');
const contactLogger= createDynamicLogger('contact')
const dashboardLogger = createDynamicLogger('dashboard')
const Ludopointslogger = createDynamicLogger('ludopoints')
const monthlylogger = createDynamicLogger('monthly')
const addPayBonusLogger = createDynamicLogger('addPayBonus')
const paymentControllerLogger = createDynamicLogger('payment')
const RefferalLogger = createDynamicLogger('refferal')
const ReportLogger = createDynamicLogger('report') 
const RestrictedAreaLogger = createDynamicLogger("restrictedArea")
const RoomLogger = createDynamicLogger("room")
const ServerMaintenanaceLogger = createDynamicLogger("serverMaintenanace")
const TemplateLogger = createDynamicLogger("template")
const TicketLogger= createDynamicLogger("ticket")
const UnlockLogger = createDynamicLogger("unlock")
const UrlLogger = createDynamicLogger("url")
const WalletLogger = createDynamicLogger("wallet")
const WeeklyLogger = createDynamicLogger("weekly")
const WithdrawalLogger = createDynamicLogger("withdrawal")
const Pointranklogger = createDynamicLogger("pointranklogger")
const Otplogger = createDynamicLogger("otplogger")
const Roomlogger = createDynamicLogger("roomlogger")
const Rommjoinamountlogger = createDynamicLogger ("rommjoinamountlogger")

export { appLogger, 
  adminLogger,
   employeeLogger,
    appDetailsLogger,
    authLogger,
    bonusLogger,
    contactLogger,
    dashboardLogger,
    Ludopointslogger,
    monthlylogger,
    addPayBonusLogger,
    paymentControllerLogger,
    RefferalLogger,
    ReportLogger,
    RestrictedAreaLogger,
    RoomLogger,
    ServerMaintenanaceLogger,
    TemplateLogger,
    TicketLogger,
    UnlockLogger,
    UrlLogger,
    WalletLogger,
    WeeklyLogger,
    WithdrawalLogger,
    Pointranklogger,
    Otplogger,
    Roomlogger,
    Rommjoinamountlogger,
   };
