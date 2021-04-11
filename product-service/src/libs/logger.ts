import * as winston from 'winston';

const logger: winston.Logger = winston.createLogger({
  level: process.env.ENV_STAGE === 'prod' ? 'error' :'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
  ),
    defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console({ level: 'info' }),
  ],
});

export default logger;
