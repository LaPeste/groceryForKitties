
export default interface ILogger {
    Info(message?: any, ...optionalParams: any[]): void;
    Warning(message?: any, ...optionalParams: any[]): void;
    Error(message?: any, ...optionalParams: any[]): void;
}