import { useCalendarState } from "@react-stately/calendar";
import { useCalendar } from "@react-aria/calendar";
import { useDateFormatter, useLocale } from "@react-aria/i18n";
import { createCalendar } from "@internationalized/date";
import {CalendarGrid, Button} from "./index";
import styles from '@/app/styles/date-picker.module.css';
import {CalendarProps, DateValue} from "react-aria";
import React from "react";

export function Calendar<T extends DateValue>(props: CalendarProps<T>) {
    let { locale } = useLocale();

    let state = useCalendarState({
        ...props,
        locale,
        createCalendar
    });

    let { calendarProps, prevButtonProps, nextButtonProps } = useCalendar(
        props,
        state
    );

    return (
        <div {...calendarProps} className={styles.calendar}>
            <div className={styles.header}>
                <Button {...prevButtonProps}>&lsaquo;</Button>
                <div className={styles.dropdowns}>
                    <MonthDropdown state={state} />
                    <YearDropdown state={state} />
                </div>
                <Button {...nextButtonProps}>&rsaquo;</Button>
            </div>
            <CalendarGrid state={state} />
        </div>
    );
}

function MonthDropdown({ state }: { state: any }) {
    let months = [];
    let formatter = useDateFormatter({
        month: "short",
        timeZone: state.timeZone
    });

    // Format the name of each month in the year according to the
    // current locale and calendar system. Note that in some calendar
    // systems, such as the Hebrew, the number of months may differ
    // between years.
    let numMonths = state.focusedDate.calendar.getMonthsInYear(state.focusedDate);
    for (let i = 1; i <= numMonths; i++) {
        let date = state.focusedDate.set({ month: i });
        months.push(formatter.format(date.toDate(state.timeZone)));
    }

    let onChange = (e: any) => {
        let value = Number(e.target.value);
        let date = state.focusedDate.set({ month: value });
        state.setFocusedDate(date);
    };

    return (
        <select
            aria-label="Month"
            onChange={onChange}
            value={state.focusedDate.month}
            className={styles.select}
        >
            {months.map((month, i) => (
                <option key={i} value={i + 1}>
                    {month}
                </option>
            ))}
        </select>
    );
}

function YearDropdown({ state }: { state: any }) {
    let years = [] as any;
    let formatter = useDateFormatter({
        year: "numeric",
        timeZone: state.timeZone
    });

    // Format 20 years on each side of the current year according
    // to the current locale and calendar system.
    for (let i = -20; i <= 20; i++) {
        let date = state.focusedDate.add({ years: i });
        years.push({
            value: date,
            formatted: formatter.format(date.toDate(state.timeZone))
        });
    }

    let onChange = (e: any) => {
        let index = Number(e.target.value);
        let date = years[index].value;
        state.setFocusedDate(date);
    };

    return (
        <select
            aria-label="Year"
            onChange={onChange}
            value={20}
            className={styles.select}
        >
            {years.map((year: any, i: any) => (
                // use the index as the value so we can retrieve the full
                // date object from the list in onChange. We cannot only
                // store the year number, because in some calendars, such
                // as the Japanese, the era may also change.
                <option key={i} value={i}>
                    {year.formatted}
                </option>
            ))}
        </select>
    );
}
