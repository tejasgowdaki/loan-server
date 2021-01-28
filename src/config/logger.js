const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(label({ label: 'right meow!' }), timestamp(), myFormat),
  transports: [
    new transports.Console({ level: 'error', handleExceptions: true }),
    new transports.File({ filename: './log/info.log', level: 'info', handleExceptions: true }),
    new transports.File({ filename: './log/error.log', level: 'error', handleExceptions: true })
  ]
});

module.exports = logger;
