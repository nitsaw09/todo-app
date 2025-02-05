import winston from 'winston';

const customLevels = {
    levels: { error: 0, warn: 1, info: 2, success: 3 },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'blue',
        success: 'green',
    }
};

winston.addColors(customLevels.colors);

const logConfiguration = {
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({ level: 'success' }),
    ],
    format: winston.format.combine(
        winston.format.label({ label: 'Label🏷️' }),
        winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
        winston.format.colorize(),
        winston.format.printf(
            (info) => `${info.level}: ${info.label}: ${info.timestamp}: ${info.message}`
        ),
    ),
};

class Logger {
    private logger: winston.Logger;
    private logName: string;
    constructor(name: string) {
        this.logName = name;
        this.logger = winston.createLogger(logConfiguration);
    }

    info(message: string) {
        this.logger.log('info', `${this.logName}: ${message}`);
    }

    error(message: string) {
        this.logger.log('error', `${this.logName}: ${message}`);
    }

    success(message: string) {
        this.logger.log('success', `${this.logName}: ${message}`);
    }

    warn(message: string) {
        this.logger.log('warn', `${this.logName}: ${message}`);
    }
}

export default Logger;