import { getNowInCalendar } from '@dhis2/multi-calendar-dates'

const padWithZeroes = (number, count = 2) => String(number).padStart(count, '0')

export const formatYyyyMmDD = (date) => {
    const year = date.eraYear ?? date.year
    const month = padWithZeroes(date.month)
    const dayString = padWithZeroes(date.day)

    return `${year}-${month}-${dayString}`
}

export const getCalendarDate = (calendar, period = { days: 0 }) => {
    const now = getNowInCalendar(calendar).add(period)
    return formatYyyyMmDD(now)
}
