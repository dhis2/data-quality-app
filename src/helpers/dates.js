import {
    getNowInCalendar,
    validateDateString,
} from '@dhis2/multi-calendar-dates'

const THIRTEEN_MONTH_CALENDARS = ['ethiopian', 'ethiopic', 'ethioaa', 'coptic']

const padWithZeroes = (number, count = 2) => String(number).padStart(count, '0')

export const formatYyyyMmDD = (date) => {
    const year = date.eraYear ?? date.year
    const month = padWithZeroes(date.month)
    const dayString = padWithZeroes(date.day)

    return `${year}-${month}-${dayString}`
}

// Adds (or subtracts) whole months in the given calendar, clamping the day
// to the last day of the target month (e.g. 31 May - 3 months = 29 Feb)
const addMonths = (date, months, calendar) => {
    const monthsInYear = THIRTEEN_MONTH_CALENDARS.includes(calendar) ? 13 : 12
    const monthIndex = date.year * monthsInYear + (date.month - 1) + months
    const year = Math.floor(monthIndex / monthsInYear)
    const month = (monthIndex % monthsInYear) + 1

    for (let day = date.day; day > 1; day--) {
        const candidate = formatYyyyMmDD({ year, month, day })
        if (validateDateString(candidate, { calendar }).valid) {
            return candidate
        }
    }
    return formatYyyyMmDD({ year, month, day: 1 })
}

export const getCalendarDate = (calendar, { months = 0 } = {}) => {
    const now = getNowInCalendar(calendar)
    const date = { ...now, year: now.eraYear ?? now.year }
    return months ? addMonths(date, months, calendar) : formatYyyyMmDD(date)
}
