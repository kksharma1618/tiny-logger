# node-tiny-logger

[![Build Status](https://travis-ci.org/kksharma1618/tiny-logger.svg?branch=master)](https://travis-ci.org/kksharma1618/tiny-logger)

A very tiny logger for nodejs

## Installation
```
npm install --save node-tiny-logger
```

## Usage
``` javascript
import Logger from 'node-tiny-logger'
const logger = new Logger({
    level: Logger.INFO
})
logger.warn('some warning', {someObject: 1}, ...)
```

## Logger Options
``` javascript
{
    level: Logger.FATAL | Logger.ERROR | Logger.WARN  | Logger.INFO  | Logger.DEBUG | Logger.TRACE,
    handleLogEntry?: (levelStr: string, argsPassedToLog),
    stream?: NodeJS.WritableStream
}
```

**level:**<br />
All logs below this level will be ignored. Eg: If you specify Logger.WARN, then log.error() will work, but log.info() will be ignored

**handleLogEntry(levelStr: string, argsPassedToLog):**<br />
Optional log entry handler. If you provide it then logs will trigger options.handleLogEntry function instead of writing to options.stream (or process.stdout).
Eg:
``` javascript
const logger = new Logger({
    handleLogEntry: function(levelStr, args) {
        console.log(levelStr, args)
    }
})
logger.error("a", 1, 2); // => ERROR [ 'a', 1, 2 ]
```

**stream:**<br />
If provided (and handleLogEntry is not provided) then it will be used to write log. Defaults to process.stdout
