import {useDateFieldState} from 'react-stately';
import {useButton, useDateField, useDateSegment, useLocale} from 'react-aria';
import React, {useRef} from "react";
import dayjs from "dayjs";

export function DateField(props: any) {
    let { locale } = useLocale();
    let state = useDateFieldState(props);

    let ref = useRef(null);
    let { labelProps, fieldProps } = useDateField(props, state, ref);

    return (
        <>
            {/*<span {...labelProps}>{props.label}</span>*/}
            <div {...fieldProps} ref={ref} className="field">
                {/*{state.segments.map((segment, i) => (*/}
                {/*    <DateSegment key={i} segment={segment} state={state} />*/}
                {/*))}*/}
                <label>{dayjs(state.dateValue).format('DD-MM-YYYY')}</label>
            </div>
        </>
    );
}

function DateSegment({ segment, state }: { segment: any, state: any }) {
    let ref = useRef(null);
    let { segmentProps } = useDateSegment(segment, state, ref);

    // return (
    //     <div
    //         {...segmentProps}
    //         ref={ref}
    //         className={`segment ${segment.isPlaceholder ? 'placeholder' : ''}`}
    //     >
    //         {segment.text}
    //     </div>
    // );
    return <label
        {...segmentProps}
        ref={ref}>
        {segment.text}
    </label>
}