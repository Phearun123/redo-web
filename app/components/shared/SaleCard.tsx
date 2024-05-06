"use client"
import {MoneyUtils} from "@/utils/moneyUtils";
import cn from "clsx";
import {DateUtils, FilterDateType} from "@/utils/DateUtils";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import Link from "next/link";
import dayjs from "dayjs";
import React, {useEffect, useState} from "react";
import DatePicker from "@/app/components/shared/date-picker/DatePicker";
import {Dropdown} from "react-bootstrap";
import ClickOutside from "@/app/lib/click-outside";
import {parseDate} from "@internationalized/date";
import {isBrowser, useSessionStorage} from "@/app/lib/hooks/useSessionStrorage";
import {useQueryClient} from "@tanstack/react-query";
import {ProfileAccount} from "@/app/lib/types/profile";
import {spans} from "next/dist/build/webpack/plugins/profiling-plugin";
import {isNullOrWhiteSpace} from "typescript-string-operations";

type Props = {
    title: string,
    total: number,
    amount: number,
    issuance: string,
    isActive: boolean

}

const defaultOptions = new Intl.DateTimeFormat().resolvedOptions();

const SaleCard: React.FC<Props> = ({
    title,
    total,
    amount,
    isActive,
    issuance
   }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname()

    const params = new URLSearchParams(searchParams);
    params.set('issuance', issuance)

    // const shopid = searchParams.get('sid') ? `&sid=${searchParams.get('sid')}` : ''
    // const linkUrl = issuance ? `${pathname}?issuance=${issuance}${shopid}` : pathname + '?' + shopid
    const linkUrl = `${pathname}?${params.toString()}`

    const DATE_FILTER: {label: string, key: FilterDateType}[] = [
        {
            label: "Last week",
            key: "last_week"
        },
        {
            label: "Last 1 month",
            key: "last_month"
        },
        {
            label: "Last 3 months",
            key: "last_3_months"
        },
        {
            label: "Last 6 months",
            key: "last_6_months"
        }
    ]

    const handleFilter = (type: FilterDateType) =>{

        const date = DateUtils.filterDate[type];
        const params = new URLSearchParams(searchParams);
        params.set("q", type);
        params.set('start_date', date.start_date);
        params.set('end_date', date.end_date);

        router.push(`${pathname}?${params.toString()}`);
    }

    const queryClient = useQueryClient();
    const profile = queryClient.getQueryData<ProfileAccount>(['profile'])

    const [defaultStore] = useSessionStorage<{start_date?: string, end_date?: string}>(`dfn-${profile?.id}`, {})

    const [storeValue] = useSessionStorage<{start_date: string, end_date: string}>(`dfn-${profile?.id}`, {
        start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
        end_date: dayjs().format('YYYY-MM-DD')
    })

    const [start, setStartValue] = React.useState(parseDate(searchParams.get('start_date') || storeValue.start_date));
    const [end, setEndValue] = React.useState(parseDate(searchParams.get('end_date') || storeValue.end_date));

    useEffect(() => {
        setStartValue(parseDate(searchParams.get('start_date') || storeValue.start_date));
        setEndValue(parseDate(searchParams.get('end_date') || storeValue.end_date));
    },[storeValue, searchParams])

    const filterLabel = dayjs(start.toDate(defaultOptions.timeZone)).format('DD MMM YYYY') + " - " + dayjs(end.toDate(defaultOptions.timeZone)).format('DD MMM YYYY')

    const checkWidgetTitle = (title: string) => {
        if(title == "total") return "ks-wt-app-widget-total"
        else if(title == "not issued") return "ks-wt-app-widget-not-issued"
        else if(title == "issued") return "ks-wt-app-widget-issued"
        else return ""
    }

    const [showFilter, setShowFilter] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <Link href={linkUrl}>
            <div className={cn(`ks-wt-app-widget-item ${checkWidgetTitle(title)}`, {
                "ks-wt-active": isActive
            })}>
                <div className="ks_d_flex ks_flex_col">
                    <div className="ks-wt-app-widget-tlt-container ks_d_flex ks_alg_itm_ctr">
                        <label className="ks-wt-app-widget-tlt-lbl text-uppercase">{title}</label>
                        <span className="ks-wt-app-widget-badge-item">{total}</span>
                    </div>

                    <Dropdown show={showDropdown} onToggle={setShowDropdown} onClickCapture={(e) => {
                        e.preventDefault();
                    }}>
                        <Dropdown.Menu className={"ks_dropdown_menu"}>
                            <div className={"my-3"} style={{width: 350}}>
                                <div className={"d-flex justify-content-evenly align-content-center"}>
                                    <DatePicker
                                        value={start}
                                        onChange={setStartValue}
                                    />
                                    <span>___</span>
                                    <DatePicker
                                        value={end}
                                        onChange={setEndValue}
                                    />
                                </div>

                                <div className={"d-flex justify-content-center gap-2 mt-4"}>
                                    <button onClick={() => setShowDropdown(false)} className="ks_btn ks_btn_tiary">
                                        Cancel
                                    </button>
                                    <button onClick={() => {
                                        const params = new URLSearchParams(searchParams);
                                        params.set("q", "custom");
                                        params.set('page_number', "0");
                                        params.set('start_date', dayjs(start.toDate(defaultOptions.timeZone)).format('YYYY-MM-DD'));
                                        params.set('end_date', dayjs(end.toDate(defaultOptions.timeZone)).format('YYYY-MM-DD'));

                                        router.push(`${pathname}?${params.toString()}`);

                                        setShowDropdown(false)

                                    }} className={"ks_btn ks_btn_pm"}>Confirm</button>
                                </div>
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>

                    <ClickOutside active={showFilter} onClick={() => setShowFilter(false)}>
                        <div className="dropdown-center w-max-content">
                            <div onClick={(e) =>{
                                e.stopPropagation();
                                e.preventDefault();
                                setShowFilter(!showFilter)
                            }} className="ks-wt-app-widget-select-container ks_d_inl_flex ks_alg_itm_ctr ks_pos_rlt">
                                <label className="ks-wt-app-widget-sub-tlt-lbl">
                                    {
                                        {
                                            "1": <span>Yet issued </span>,
                                            "2": <span>Issued </span>,
                                        }[issuance] ?? ""
                                    }
                                    {/*{ isNullOrWhiteSpace(date?.start_date.toDateString()!) && isNullOrWhiteSpace(date?.end_date.toDateString()!) ? "Last 30 days" :  filterLabel}*/}
                                    {
                                        {
                                        'last_6_months': 'Last 6 months',
                                        'last_3_months': 'Last 3 months',
                                        'last_month': 'Last 1 month',
                                        "last_week": "Last week",
                                        'custom': filterLabel
                                        }[searchParams.get('q')!]
                                        ?? ((defaultStore.start_date == null && defaultStore.end_date == null && isNullOrWhiteSpace(searchParams.get('start_date')) ) ? <>Last 1 month</> : <>
                                            {dayjs(storeValue?.start_date ? searchParams.get('start_date') || storeValue?.start_date : null).format('DD MMM YYYY')} - {dayjs(storeValue?.end_date ? searchParams.get('end_date') || storeValue?.end_date : null).format('DD MMM YYYY')}
                                        </>)
                                    }
                                </label>
                                <svg width={16} height={16} viewBox="0 0 16 16">
                                    <path
                                        d="M7.89355 11.9971C8.00781 11.9971 8.11572 11.9759 8.21729 11.9336C8.31885 11.887 8.41195 11.8172 8.49658 11.7241L13.0415 7.08398C13.1896 6.93587 13.2637 6.75814 13.2637 6.55078C13.2637 6.4069 13.2277 6.27783 13.1558 6.16357C13.0881 6.04508 12.9971 5.95199 12.8828 5.88428C12.7686 5.81657 12.6395 5.78271 12.4956 5.78271C12.2882 5.78271 12.1042 5.861 11.9434 6.01758L7.61426 10.4609H8.1792L3.84375 6.01758C3.68717 5.861 3.50309 5.78271 3.2915 5.78271C3.14762 5.78271 3.01855 5.81657 2.9043 5.88428C2.79004 5.95199 2.69906 6.04508 2.63135 6.16357C2.56364 6.27783 2.52979 6.4069 2.52979 6.55078C2.52979 6.65658 2.54883 6.75391 2.58691 6.84277C2.625 6.92741 2.68001 7.00781 2.75195 7.08398L7.29053 11.7305C7.47249 11.9082 7.6735 11.9971 7.89355 11.9971Z"/>
                                </svg>
                            </div>
                            {
                                showFilter && <div className="ks_dropdown_menu dropdown-menu ks_wth_160 d-block">
                                    <div className="ks-wt-dropdown-dialog ks_pd_0 ks_d_flex ks_flex_col">
                                        {
                                            DATE_FILTER.map((item) => (
                                                <div key={item.key} onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    handleFilter(item?.key)
                                                    setShowFilter(false)
                                                }} className="ks-wt-dropdown-dialog-item ks_brd_btm">
                                                    <label>{item.label}</label>
                                                </div>
                                            ))
                                        }
                                        <div
                                            className="ks-wt-dropdown-dialog-item"
                                            onClick={(e)=>{
                                                e.stopPropagation();
                                                e.preventDefault();
                                                setShowFilter(false)
                                                setShowDropdown(true)
                                            }}
                                        >
                                            <label>Enter manually</label>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </ClickOutside>
                </div>
                <div className="ks_d_flex ks_jt_cont_end ks_alg_itm_ctr">
                    <label className="ks-wt-app-widget-data-lbl">
                        { MoneyUtils.moneyFormatter(amount)}
                    </label>
                </div>
            </div>

        </Link>
    );
};

export default SaleCard;