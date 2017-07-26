import * as assert from 'assert'
import { format } from 'util'

export interface LoggerOptions {
    // level
    level: 1 | 2 | 3 | 4 | 5 | 6,
    // if handleLogEntry not provided then log will be printed on stream
    handleLogEntry?: (level: string, args: any[]) => any,
    // defaults to process.stdout if handleLogEntry not provided
    stream?: NodeJS.WritableStream
}

export default class Logger {
    public static readonly FATAL = 1
    public static readonly ERROR = 2
    public static readonly WARN = 3
    public static readonly INFO = 4
    public static readonly DEBUG = 5
    public static readonly TRACE = 6

    private options: LoggerOptions

    constructor(opts?: LoggerOptions) {
        this.options = {
            level: 4
        }
        if (opts) {
            if (opts.level) {
                this.options.level = opts.level
            }
            this.options.handleLogEntry = opts.handleLogEntry
        }

        assert.ok(typeof this.options.level === 'number', "level")
        assert.ok(this.options.level >= 1 && this.options.level <= 6, "level")

        if (!this.options.handleLogEntry) {
            this.options.stream = opts && opts.stream ? opts.stream : process.stdout
        }
    }
    public fatal(...args: any[]) {
        return this.log("FATAL", args)
    }
    public error(...args: any[]) {
        return this.log("ERROR", args)
    }
    public warn(...args: any[]) {
        return this.log("WARN", args)
    }
    public info(...args: any[]) {
        return this.log("INFO", args)
    }
    public debug(...args: any[]) {
        return this.log("DEBUG", args)
    }
    public trace(...args: any[]) {
        return this.log("TRACE", args)
    }
    private log(levelStr, args) {
        if (Logger[levelStr] > this.options.level) {
            return
        }
        const message = format.apply(null, args)

        if (this.options.handleLogEntry) {
            this.options.handleLogEntry(levelStr, args)
        } else {
            this.options.stream!.write(
                '[' + new Date() + ']'
                + ' ' + levelStr
                + ' ' + message
                + '\n'
            )
        }
    }
}