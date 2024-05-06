import React, {useRef} from 'react';
import styles from '@/app/styles/date-picker.module.css';
import {AriaButtonProps, useButton} from "react-aria";

export function Button(props: AriaButtonProps) {
    let ref = useRef(null);
    let { buttonProps } = useButton(props, ref);

    return (
        <button {...buttonProps} ref={ref} className={styles.button}>
            {props.children}
        </button>
    );
}
