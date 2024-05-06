
"use client"
import Link, { LinkProps } from 'next/link'
import { usePathname, useSearchParams } from "next/navigation";
import React, { PropsWithChildren, useState, useEffect, ReactNode } from 'react'

type ActiveLinkProps = LinkProps & {
    isActive: boolean,
    className?: string
    activeClassName: string,
    icon: ReactNode
}

const ActiveLink = ({ children, activeClassName, className, icon, isActive, ...props }: PropsWithChildren<ActiveLinkProps>) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [computedClassName, setComputedClassName] = useState(className)

    useEffect(() => {

        // Dynamic route will be matched via props.as
        // Static route will be matched via props.href
        const linkPathnameUrl = new URL(
            (props.as || props.href) as string,
            location.href
        )

        const params = new URLSearchParams(searchParams);
        const linkPathname = linkPathnameUrl.pathname + params.get('type')

        const activePathnameUrl = new URL(pathname, location.href)
        const activePathname = activePathnameUrl.pathname + params.get('type');
        
        const newClassName = isActive ? `${className} ${activeClassName}`.trim() : className

        if (newClassName !== computedClassName) {
            setComputedClassName(newClassName)
        }

    }, [
        pathname,
        props.as,
        props.href,
        activeClassName,
        className,
        computedClassName,
    ])

    return (
        <Link href={props.href}>
            <div className={computedClassName}>
                <div className="ks-wt-app-sidebar-item ks_d_flex ks_alg_itm_ctr">
                    {icon}
                    {children}
                </div>
            </div>
        </Link>
    )
}

export default ActiveLink