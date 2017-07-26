import * as chai from "chai"
const should = chai.should()
const expect = chai.expect
const streamtest = require('streamtest').v2
import Logger from './index'

describe('Logger', () => {

    let logger: Logger
    let levelStr: string
    let args: any[]
    beforeEach(() => {
         setupLogger()
    })
    function setupLogger(level = Logger.INFO, handleLogEntry?, stream?) {
        levelStr = ''
        args = []
        logger = new Logger({
            level: level as any,
            handleLogEntry: handleLogEntry === false ? undefined : (ls: string, a: any[]) => {
                levelStr = ls
                args = a
            },
            stream
        })
    }
    function testResponse(ls: string, a: any[]) {
        expect(ls).to.equal(levelStr)
        expect(a).to.deep.equal(args)
    }

    describe('level', () => {

        it('should handle invalid level type', () => {
            // tslint:disable-next-line:no-unused-expression
            expect(() => {
                setupLogger(10)
            }).to.throw()

            expect(() => {
                setupLogger('some' as any)
            }).to.throw()
        })

        it('should handle level filtering', () => {
            setupLogger(Logger.WARN)
            logger.info('i')
            testResponse('', [])

            setupLogger(Logger.WARN)
            logger.error('e')
            testResponse('ERROR', ['e'])
        })
    })

    describe('handleLogEntry', () => {
        it('should return all args', () => {
            logger.error('e', 1, 2)
            testResponse('ERROR', ['e', 1, 2])
        })
    })

    describe('stream fallback', () => {
        it('should use provided stream if handleLogEntry not given', (done) => {
            const stream = streamtest.toText((err, txt: string) => {
                expect(txt).to.be.an('string').which.includes('WARN w\n')
                done()
            })
            setupLogger(Logger.INFO, false, stream)
            logger.warn('w')
            setTimeout(() => {
                stream.end()
            }, 10)
        })
    })

})