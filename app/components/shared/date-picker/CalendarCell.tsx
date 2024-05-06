import {useRef} from "react";
import {mergeProps, useCalendarCell, useFocusRing} from "react-aria";
import styles from '@/app/styles/date-picker.module.css';
import cn from "clsx";

export function CalendarCell(props: any) {
    let ref = useRef(null);
    let {
        cellProps,
        buttonProps,
        formattedDate,
        isSelected,
        isDisabled,
        isOutsideVisibleRange
    } = useCalendarCell(props, props.state, ref);

    let { focusProps, isFocusVisible } = useFocusRing();

    return (
        <td {...cellProps}>
            <div
                ref={ref}
                hidden={isOutsideVisibleRange}
                {...mergeProps(buttonProps, focusProps)}
                className={cn(styles.cell, {
                    [styles.selected]: isSelected,
                    [styles.focusRing]: isFocusVisible,
                    [styles.disabled]: isDisabled
                })}
            >
                {formattedDate}
            </div>
        </td>
    );
}