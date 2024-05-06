"use client"
import React from 'react';
import {OverlayTrigger, Tooltip} from "react-bootstrap";

type Props = {
    placement: any,
    title: string,
    children: React.ReactElement,
}

const CustomTooltip: React.FC<Props> = ({placement, title, children}) => {


    return (
        <OverlayTrigger placement={placement} overlay={(
            <Tooltip id="tooltip" className={"tooltip-lg-inner cus-z-index"}>
                <div dangerouslySetInnerHTML={{ __html: title}} />
            </Tooltip>
        )}>
            {
                (props) => React.cloneElement(children, props)
            }
        </OverlayTrigger>
    );
};

export default CustomTooltip;