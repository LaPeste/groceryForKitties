import ILogger from "./iLogger.js";

export default class Logger implements ILogger {
    Info(message?: any, ...optionalParams: any[]): void {
        console.log(message, ...optionalParams);
    }

    Warning(message?: any, ...optionalParams: any[]): void {
        if (process.env.DEBUG) {
            console.warn(message, ...optionalParams);
        }
    }

    Error(message?: any, ...optionalParams: any[]): void {
        if (process.env.DEBUG) {
            console.error(message, ...optionalParams);
        }
    }
}