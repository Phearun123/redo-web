import type {AriaDialogProps} from 'react-aria';
import {useDialog} from 'react-aria';
import {useRef} from "react";

interface DialogProps extends AriaDialogProps {
    title?: React.ReactNode;
    children: React.ReactNode;
}

export function Dialog({ title, children, ...props }: DialogProps) {
    let ref = useRef(null);
    let { dialogProps, titleProps } = useDialog(props, ref);

    return (
        <div {...dialogProps} ref={ref} style={{background: '#fff', border: '1px solid #ddd', outline: 'none'}} className={"shadow"}>
            {title &&
                (
                    <h3 {...titleProps} style={{ marginTop: 0 }}>
                        {title}
                    </h3>
                )}
            {children}
        </div>
    );
}