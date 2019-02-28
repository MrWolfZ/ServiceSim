import winston from 'winston';

declare module 'winston' {
  export namespace transports {
    export interface ConsoleTransportOptions {
      consoleWarnLevels?: string[];
    }
  }
}
