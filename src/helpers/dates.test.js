import { getCalendarDate } from './dates.js'

// Includes month-end, leap-year and year-wrap cases, since the default
// start date is "three months before today"
const NOW_DATES = [
    '2024-06-15T10:30:00Z',
    '2024-05-31T10:30:00Z',
    '2024-03-31T10:30:00Z',
    '2025-01-10T10:30:00Z',
    '2024-09-12T10:30:00Z',
]

describe.each(['gregory', 'ethiopian', 'nepali'])(
    'getCalendarDate (%s calendar)',
    (calendar) => {
        afterEach(() => {
            jest.useRealTimers()
        })

        it.each(NOW_DATES)('returns today and 3 months ago on %s', (now) => {
            jest.useFakeTimers('modern')
            jest.setSystemTime(new Date(now).getTime())

            const capture = (fn) => {
                try {
                    return fn()
                } catch (e) {
                    return `throws ${e.name}: ${e.message}`
                }
            }

            expect({
                today: capture(() => getCalendarDate(calendar)),
                threeMonthsAgo: capture(() =>
                    getCalendarDate(calendar, { months: -3 })
                ),
            }).toMatchSnapshot()
        })
    }
)
