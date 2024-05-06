import React, {forwardRef, ForwardRefRenderFunction, ReactNode} from "react";
import cn from "clsx";

interface Props {
    children?: ReactNode;
    type: "submit" | "button";
}

export type Ref = HTMLButtonElement;

interface Props {
    children?: ReactNode;
    onClick: () => void;
    className?: string;
    viewOptions?: boolean;
}

const ButtonToggle:ForwardRefRenderFunction<Ref, Props> = ({children, onClick, className, viewOptions}, ref) => {
    return (
        <>
            { viewOptions ? (
                <span onClick={onClick}>
                    {children}
                </span>
            ) : (
                <button ref={ref} className={cn("custom-toggle-btn", className)} onClick={onClick}>
                    {children}
                </button>
            )}
        </>
    );
};

export default forwardRef<Ref, Props>(ButtonToggle);