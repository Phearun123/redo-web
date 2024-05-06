"use client"
import React, {useEffect, useRef} from 'react';
import {useDatePickerState} from "react-stately";
import {DateValue, useDatePicker, useOverlayTrigger} from "react-aria";
import {getLocalTimeZone, today, parseDate} from "@internationalized/date";
import dayjs from "dayjs";
import {Popover} from "@/app/components/shared/date-picker/Popover";
import {Dialog} from "@/app/components/shared/date-picker/Dialog";
import {Calendar} from "@/app/components/shared/date-picker/Calendar";
import {DatePickerProps} from "@react-types/datepicker";
import DatePickerButton from "@/app/components/shared/date-picker/DatePickerButton";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useSessionStorage} from "@/app/lib/hooks/useSessionStrorage";
import {DateUtils} from "@/utils/DateUtils";
import {ProfileAccount} from "@/app/lib/types/profile";
import {useQueryClient} from "@tanstack/react-query";
import CustomTooltip from "@/app/components/shared/CustomTooltip";
import {Dropdown} from "react-bootstrap";
import DatePicker from "@/app/components/shared/date-picker/DatePicker";

const defaultOptions = new Intl.DateTimeFormat().resolvedOptions();

type DateFilter = {
    start_date: string,
    end_date: string
}

const filterDate= {
    today: {
        label: 'Today',
        start_date: dayjs().format('YYYY-MM-DD'),
        end_date: dayjs().format('YYYY-MM-DD')
    },
    yesterday: {
        label: 'Yesterday',
        start_date: dayjs().subtract(1, 'd').format('YYYY-MM-DD'),
        end_date: dayjs().subtract(1, 'd').format('YYYY-MM-DD')
    },
    week: {
        label: 'Week',
        start_date: dayjs().startOf('week').format('YYYY-MM-DD'),
        end_date: dayjs().endOf('week').format('YYYY-MM-DD')
    },
    last_week: {
        label: 'Last week',
        start_date: dayjs().subtract(1, 'w').startOf('week').format('YYYY-MM-DD'),
        end_date: dayjs().subtract(1, 'w').endOf('week').format('YYYY-MM-DD')
    },
    this_month: {
        label: 'This month',
        start_date: dayjs().startOf('month').format('YYYY-MM-DD'),
        end_date: dayjs().endOf('month').format('YYYY-MM-DD')
    },
    last_month: {
        label: 'Last month',
        start_date: dayjs().subtract(1, 'M').startOf('month').format('YYYY-MM-DD'),
        end_date: dayjs().subtract(1, 'M').endOf('month').format('YYYY-MM-DD')
    },
    this_year: {
        label: 'This Year',
        start_date: dayjs().startOf('year').format('YYYY-MM-DD'),
        end_date: dayjs().endOf('year').format('YYYY-MM-DD')
    },
} as const

type FilterDateType = keyof typeof filterDate;

const CusCalendar = (props: DatePickerProps<DateValue>) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const profile = queryClient.getQueryData<ProfileAccount>(['profile'])

    const state = useDatePickerState(props);
    const ref = useRef(null);
    const closeRef = useRef<HTMLInputElement>(null);
    const {
        labelProps,
        groupProps,
        fieldProps,
        buttonProps,
        dialogProps,
    } = useDatePicker(props, state, ref);

    const [storeValue, setDateFilter, existed, removeDateFilter] = useSessionStorage<DateFilter>(`dfn-${profile?.id}`, {
        start_date: dayjs().subtract(1, 'M').format('YYYY-MM-DD'),
        end_date: dayjs().format('YYYY-MM-DD')
    })

    const [start, setStartValue] = React.useState(parseDate(searchParams.get('start_date') || storeValue.start_date));
    const [end, setEndValue] = React.useState(parseDate(searchParams.get('end_date') || storeValue.end_date));

    useEffect(() => {
        setStartValue(parseDate(searchParams.get('start_date') || storeValue.start_date));
        setEndValue(parseDate(searchParams.get('end_date') || storeValue.end_date));
    },[storeValue, state.isOpen, searchParams])

    return (
        <div style={{ display: 'inline-flex', flexDirection: 'column', background: '#fff' }}>
            <div {...labelProps}>{props.label}</div>
            <div {...groupProps} ref={ref} className={"ks-wt-custom-form-calendar"}>

                {/*<DateField {...fieldProps} />*/}
                <span>{dayjs(fieldProps.value?.toDate(defaultOptions.timeZone)).format('DD-MM-YYYY')}</span>
                <DatePickerButton {...buttonProps}>
                    <svg width={18} height={18} viewBox="0 0 18 18">
                        <path d="M4.21729 15.5088L13.7827 15.5088C14.5444 15.5088 15.1206 15.3135 15.5112 14.9229C15.9019 14.5371 16.0972 13.9683 16.0972 13.2163V4.80078C16.0972 4.04883 15.9019 3.47754 15.5112 3.08691C15.1206 2.69629 14.5444 2.50098 13.7827 2.50098L4.21729 2.50098C3.46045 2.50098 2.88428 2.69629 2.48877 3.08691C2.09814 3.47266 1.90283 4.04395 1.90283 4.80078L1.90283 13.2163C1.90283 13.9731 2.09814 14.5444 2.48877 14.9302C2.88428 15.3159 3.46045 15.5088 4.21729 15.5088ZM4.23926 14.0513C3.95605 14.0513 3.74121 13.978 3.59473 13.8315C3.44824 13.6851 3.375 13.4629 3.375 13.165L3.375 6.82959C3.375 6.53174 3.44824 6.31201 3.59473 6.17041C3.74121 6.02393 3.95605 5.95068 4.23926 5.95068L13.7534 5.95068C14.0366 5.95068 14.2539 6.02393 14.4053 6.17041C14.5566 6.31201 14.6323 6.53174 14.6323 6.82959L14.6323 13.165C14.6323 13.4629 14.5566 13.6851 14.4053 13.8315C14.2539 13.978 14.0366 14.0513 13.7534 14.0513L4.23926 14.0513ZM7.67432 8.30908H8.07715C8.2041 8.30908 8.29199 8.28711 8.34082 8.24316C8.38965 8.19922 8.41406 8.11377 8.41406 7.98682V7.58398C8.41406 7.45703 8.38965 7.37158 8.34082 7.32764C8.29199 7.28369 8.2041 7.26172 8.07715 7.26172H7.67432C7.55225 7.26172 7.46436 7.28369 7.41064 7.32764C7.36182 7.37158 7.3374 7.45703 7.3374 7.58398V7.98682C7.3374 8.11377 7.36182 8.19922 7.41064 8.24316C7.46436 8.28711 7.55225 8.30908 7.67432 8.30908ZM9.92285 8.30908H10.333C10.46 8.30908 10.5479 8.28711 10.5967 8.24316C10.6455 8.19922 10.6699 8.11377 10.6699 7.98682V7.58398C10.6699 7.45703 10.6455 7.37158 10.5967 7.32764C10.5479 7.28369 10.46 7.26172 10.333 7.26172H9.92285C9.7959 7.26172 9.70801 7.28369 9.65918 7.32764C9.61523 7.37158 9.59326 7.45703 9.59326 7.58398V7.98682C9.59326 8.11377 9.61523 8.19922 9.65918 8.24316C9.70801 8.28711 9.7959 8.30908 9.92285 8.30908ZM12.1714 8.30908H12.5815C12.7085 8.30908 12.7964 8.28711 12.8452 8.24316C12.894 8.19922 12.9185 8.11377 12.9185 7.98682V7.58398C12.9185 7.45703 12.894 7.37158 12.8452 7.32764C12.7964 7.28369 12.7085 7.26172 12.5815 7.26172H12.1714C12.0444 7.26172 11.9565 7.28369 11.9077 7.32764C11.8638 7.37158 11.8418 7.45703 11.8418 7.58398V7.98682C11.8418 8.11377 11.8638 8.19922 11.9077 8.24316C11.9565 8.28711 12.0444 8.30908 12.1714 8.30908ZM5.42578 10.5283H5.82861C5.95557 10.5283 6.04346 10.5063 6.09229 10.4624C6.14111 10.4136 6.16553 10.3281 6.16553 10.2061V9.7959C6.16553 9.66895 6.14111 9.5835 6.09229 9.53955C6.04346 9.49561 5.95557 9.47363 5.82861 9.47363H5.42578C5.29883 9.47363 5.21094 9.49561 5.16211 9.53955C5.11328 9.5835 5.08887 9.66895 5.08887 9.7959V10.2061C5.08887 10.3281 5.11328 10.4136 5.16211 10.4624C5.21094 10.5063 5.29883 10.5283 5.42578 10.5283ZM7.67432 10.5283H8.07715C8.2041 10.5283 8.29199 10.5063 8.34082 10.4624C8.38965 10.4136 8.41406 10.3281 8.41406 10.2061V9.7959C8.41406 9.66895 8.38965 9.5835 8.34082 9.53955C8.29199 9.49561 8.2041 9.47363 8.07715 9.47363H7.67432C7.55225 9.47363 7.46436 9.49561 7.41064 9.53955C7.36182 9.5835 7.3374 9.66895 7.3374 9.7959V10.2061C7.3374 10.3281 7.36182 10.4136 7.41064 10.4624C7.46436 10.5063 7.55225 10.5283 7.67432 10.5283ZM9.92285 10.5283H10.333C10.46 10.5283 10.5479 10.5063 10.5967 10.4624C10.6455 10.4136 10.6699 10.3281 10.6699 10.2061V9.7959C10.6699 9.66895 10.6455 9.5835 10.5967 9.53955C10.5479 9.49561 10.46 9.47363 10.333 9.47363H9.92285C9.7959 9.47363 9.70801 9.49561 9.65918 9.53955C9.61523 9.5835 9.59326 9.66895 9.59326 9.7959V10.2061C9.59326 10.3281 9.61523 10.4136 9.65918 10.4624C9.70801 10.5063 9.7959 10.5283 9.92285 10.5283ZM12.1714 10.5283H12.5815C12.7085 10.5283 12.7964 10.5063 12.8452 10.4624C12.894 10.4136 12.9185 10.3281 12.9185 10.2061V9.7959C12.9185 9.66895 12.894 9.5835 12.8452 9.53955C12.7964 9.49561 12.7085 9.47363 12.5815 9.47363H12.1714C12.0444 9.47363 11.9565 9.49561 11.9077 9.53955C11.8638 9.5835 11.8418 9.66895 11.8418 9.7959V10.2061C11.8418 10.3281 11.8638 10.4136 11.9077 10.4624C11.9565 10.5063 12.0444 10.5283 12.1714 10.5283ZM5.42578 12.7402H5.82861C5.95557 12.7402 6.04346 12.7183 6.09229 12.6743C6.14111 12.6255 6.16553 12.54 6.16553 12.418V12.0151C6.16553 11.8882 6.14111 11.8027 6.09229 11.7588C6.04346 11.71 5.95557 11.6855 5.82861 11.6855H5.42578C5.29883 11.6855 5.21094 11.71 5.16211 11.7588C5.11328 11.8027 5.08887 11.8882 5.08887 12.0151V12.418C5.08887 12.54 5.11328 12.6255 5.16211 12.6743C5.21094 12.7183 5.29883 12.7402 5.42578 12.7402ZM7.67432 12.7402H8.07715C8.2041 12.7402 8.29199 12.7183 8.34082 12.6743C8.38965 12.6255 8.41406 12.54 8.41406 12.418V12.0151C8.41406 11.8882 8.38965 11.8027 8.34082 11.7588C8.29199 11.71 8.2041 11.6855 8.07715 11.6855H7.67432C7.55225 11.6855 7.46436 11.71 7.41064 11.7588C7.36182 11.8027 7.3374 11.8882 7.3374 12.0151V12.418C7.3374 12.54 7.36182 12.6255 7.41064 12.6743C7.46436 12.7183 7.55225 12.7402 7.67432 12.7402ZM9.92285 12.7402H10.333C10.46 12.7402 10.5479 12.7183 10.5967 12.6743C10.6455 12.6255 10.6699 12.54 10.6699 12.418V12.0151C10.6699 11.8882 10.6455 11.8027 10.5967 11.7588C10.5479 11.71 10.46 11.6855 10.333 11.6855H9.92285C9.7959 11.6855 9.70801 11.71 9.65918 11.7588C9.61523 11.8027 9.59326 11.8882 9.59326 12.0151V12.418C9.59326 12.54 9.61523 12.6255 9.65918 12.6743C9.70801 12.7183 9.7959 12.7402 9.92285 12.7402Z" />
                    </svg>
                </DatePickerButton>

            </div>

            <Dropdown className={"mt-2"} show={state.isOpen} onToggle={state.setOpen}>
                <Dropdown.Menu className={"ks_dropdown_menu"}>
                    <div className={"px-4 pt-4"}>
                        <div className={"d-flex justify-content-between"}>
                            <div className={"d-flex"}>
                                <h5>Year</h5>
                                {/*<div className={"d-flex"}>*/}
                                {/*    <button onClick={() => {*/}
                                {/*        setStartValue(start.add({years: 1}));*/}
                                {/*        setEndValue(end.add({years: 1}));*/}
                                {/*    }}>+</button>*/}
                                {/*    <h5>{dayjs().format("YYYY")}</h5>*/}
                                {/*    <button onClick={() => {*/}
                                {/*        setStartValue(start.subtract({years: 1}));*/}
                                {/*        setEndValue(end.subtract({years: 1}));*/}
                                {/*    }}>-</button>*/}
                                {/*</div>*/}
                            </div>
                            <div>
                                    <span className={"ks_fw_semi_bd"}>{
                                        `${dayjs(start.toDate(defaultOptions.timeZone)).format('DD-MM-YYYY') } ~ ${dayjs(end.toDate(defaultOptions.timeZone)).format('DD-MM-YYYY')}`
                                    }</span>
                            </div>
                        </div>

                        <div className={"d-flex flex-wrap gap-2 my-3"}>

                            {
                                Object.keys(filterDate).map((key) => {
                                    const item = filterDate[key as FilterDateType];

                                    return <button key={key} onClick={() => {
                                        setStartValue(parseDate(item.start_date));
                                        setEndValue(parseDate(item.end_date));
                                    }} className={"ks_btn ks_btn_tiary flex-grow-1"}>{item.label}</button>
                                })
                            }

                        </div>

                        <div className={"d-flex flex-wrap justify-content-between gap-2 my-3"}>
                            {
                                DateUtils.getMonths().map(x =>  <button onClick={() => {
                                    setStartValue(parseDate(dayjs().month(x.id).startOf('month').format('YYYY-MM-DD')));
                                    setEndValue(parseDate(dayjs().month(x.id).endOf('month').format('YYYY-MM-DD')));
                                }} key={x.id} className={"ks_btn ks_btn_tiary"}>{x.name}</button>)
                            }
                        </div>

                        <div className={"d-flex gap-5"}>

                            <Calendar
                                value={start}
                                onChange={setStartValue}
                                focusedValue={start}
                                onFocusChange={setStartValue}
                            />

                            <span className={"align-self-center"}>️️➡️</span>

                            <Calendar
                                value={end}
                                onChange={setEndValue}
                                focusedValue={end}
                                onFocusChange={setEndValue}
                            />

                        </div>

                        <div className="my-1 ks-wt-element-checkbox-container ks_d_flex justify-content-between prevent-select">

                            <label className={"d-flex gap-2 align-items-center"}>
                                <input
                                    defaultChecked={existed}
                                    ref={closeRef}
                                    type="checkbox"
                                    className="ks_form_checkbox ks_form_checkbox_no_border"
                                    id={"ks_wt_close_popup_id"}
                                />
                                Save this date filtering for all time
                                <CustomTooltip placement={"top"} title={"Keep your current filter until you change it"} >
                                    <svg width={22} height={22} viewBox="0 0 22 22" className="ks_mb_2 opacity-50">
                                        <path
                                            d="M5.71082 19.7338C3.82556 19.7338 2.84802 18.765 2.84802 16.8972V6.27515C2.84802 4.40735 3.82556 3.43854 5.71082 3.43854H16.2805C18.1657 3.43854 19.1432 4.40735 19.1432 6.27515V16.8972C19.1432 18.7562 18.1657 19.7338 16.2805 19.7338H5.71082ZM10.9651 8.58807C11.6546 8.58807 12.2045 8.02948 12.2045 7.33997C12.2045 6.633 11.6546 6.08313 10.9651 6.08313C10.2756 6.08313 9.71698 6.633 9.71698 7.33997C9.71698 8.02948 10.2756 8.58807 10.9651 8.58807ZM9.4115 16.6004H13.0947C13.5049 16.6004 13.8279 16.3036 13.8279 15.8847C13.8279 15.5007 13.5049 15.1865 13.0947 15.1865H12.091V10.901C12.091 10.3511 11.8117 9.99329 11.2968 9.99329H9.57733C9.16711 9.99329 8.85291 10.3075 8.85291 10.6915C8.85291 11.1105 9.16711 11.4072 9.57733 11.4072H10.4938V15.1865H9.4115C9.00128 15.1865 8.68707 15.5007 8.68707 15.8847C8.68707 16.3036 9.00128 16.6004 9.4115 16.6004Z"
                                        />
                                    </svg>
                                </CustomTooltip>
                            </label>

                            <div className={"d-flex justify-content-center gap-2 my-3"}>
                                <button onClick={() => state.setOpen(false)} className="ks_btn ks_btn_tiary">
                                    Cancel
                                </button>
                                <button onClick={() => {
                                    const params = new URLSearchParams(searchParams);
                                    params.delete('q')
                                    params.set('page_number', "0");
                                    params.set('start_date', dayjs(start.toDate(defaultOptions.timeZone)).format('YYYY-MM-DD'));
                                    params.set('end_date', dayjs(end.toDate(defaultOptions.timeZone)).format('YYYY-MM-DD'));

                                    if(closeRef.current?.checked){
                                        setDateFilter({
                                            start_date: dayjs(start.toDate(defaultOptions.timeZone)).format('YYYY-MM-DD'),
                                            end_date: dayjs(end.toDate(defaultOptions.timeZone)).format('YYYY-MM-DD')
                                        });
                                    }else {
                                        setDateFilter({
                                            start_date: dayjs(start.toDate(defaultOptions.timeZone)).format('YYYY-MM-DD'),
                                            end_date: dayjs(end.toDate(defaultOptions.timeZone)).format('YYYY-MM-DD')
                                        });
                                        removeDateFilter();
                                    }

                                    router.push(`${pathname}?${params.toString()}`);
                                    state.setOpen(false);

                                }} className={"ks_btn ks_btn_pm"}>Apply</button>
                            </div>
                        </div>
                    </div>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

export default CusCalendar;