import {
    addToCalendarDate,
    formatCalendarDate,
    getNowInCalendar,
} from '@dhis2/multi-calendar-dates'

export const getCalendarDate = (calendar, { months = 0 } = {}) =>
    formatCalendarDate(
        addToCalendarDate(getNowInCalendar(calendar), { months }, calendar)
    )
