import React from 'react';
import {CalendarState} from "react-stately";
import {useCalendarGrid, useLocale} from "react-aria";
import {getWeeksInMonth} from "@internationalized/date";
import {CalendarCell} from "./CalendarCell";
import styles from '@/app/styles/date-picker.module.css'

export function CalendarGrid({ state, ...props }: { state: CalendarState }) {
    let { locale } = useLocale();
    let { gridProps, headerProps, weekDays } = useCalendarGrid(props, state);

    // Get the number of weeks in the month so we can render the proper number of rows.
    let weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale);

    return (
        <table {...gridProps} cellPadding="0" className={styles.grid}>
            <thead {...headerProps}>
                <tr>
                    {weekDays.map((day, index) => (
                        <th key={index}>{day}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
            {
                // @ts-ignore
                [...new Array(weeksInMonth).keys()].map((weekIndex) => (
                <tr key={weekIndex}>
                    {state
                        .getDatesInWeek(weekIndex)
                        .map((date, i) =>
                            date ? (
                                <CalendarCell key={i} state={state} date={date} />
                            ) : (
                                <td key={i} />
                            )
                        )}
                </tr>
            ))}
            </tbody>
        </table>
    );
}