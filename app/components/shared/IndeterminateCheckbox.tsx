"use client"
import {HTMLProps, useEffect, useRef} from "react";

function IndeterminateCheckbox({
                                   indeterminate,
                                   className = '',
                                   type = 'checkbox',
                                   ...rest
                               }: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
    const ref = useRef<HTMLInputElement>(null!)

    useEffect(() => {
        if (typeof indeterminate === 'boolean') {
            ref.current.indeterminate = !rest.checked && indeterminate
        }
    }, [ref, indeterminate])

    return (
        <div className="ks_d_flex ">
            <input
                type={type}
                ref={ref}
                className={className + ' cursor-pointer'}
                {...rest}
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    )
}

export default IndeterminateCheckbox