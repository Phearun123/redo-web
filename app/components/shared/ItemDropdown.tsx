import cn from "clsx";
import CustomTooltip from "@/app/components/shared/CustomTooltip";
import ClickOutside from "@/app/lib/click-outside";
import React, {useEffect, useState} from "react";
import {Item} from "@/app/lib/types/items";
import {useQuery} from "@tanstack/react-query";
import {settingsService} from "@/service/setting.service";
import useDebounce from "@/app/lib/hooks/use-debounce";
import {isNullOrWhiteSpace} from "typescript-string-operations";

type Props = {
    onClick?: () => void;
    index: number;
    methods: any
    disabled: boolean;
    handleClear: () => void;
    handleItemClick: (item: Item) => void;
}

const ItemDropdown = ({ onClick,index, methods, disabled, handleClear, handleItemClick}: Props) => {

    const [isOpen, setIsOpen] = useState<boolean>(false)

    const [searchValue, setSearchValue] = useState<string>('')
    const debounceValue = useDebounce<string>(searchValue, 500)

    const requestParams = {
        page_number: 0,
        page_size: 5,
        sort_columns:'',
        vat_rate: '',
        search_value: debounceValue,
    }

    const itemsQuery = useQuery({
        queryKey: ['items', requestParams],
        queryFn: () => settingsService.getItems(requestParams),
        // keepPreviousData: true,
        enabled: !isNullOrWhiteSpace(debounceValue),
    })

    const { register } = methods;

    useEffect(() => {
        if (!isNullOrWhiteSpace(debounceValue)) {
            setIsOpen(true)
        }

    }, [debounceValue])

    return (
        <ClickOutside active={isOpen} onClick={() => setIsOpen(false)}>
            <div className={cn('ks-wt-form-input-container', {'ks-wt-form-disabled': disabled})}>

                <input
                    type="text"
                    className="ks_form_input ks_form_search_box"
                    placeholder="Enter"
                    {...register(`items.${index}.name`)}
                    autoComplete={"off"}
                    onClick={onClick}
                    onChange={(e) => {
                        register(`items.${index}.name`).onChange(e)
                        setSearchValue(e.target.value)
                    }}
                />

                <div className="ks-wt-form-input-svg-container">
                    <CustomTooltip placement={"top"} title={"clear input"}>
                        <svg
                            className={cn({
                                "ks-wt-disabled": disabled
                            })}
                            onClick={() => {
                                setSearchValue("")
                                setIsOpen(true)
                                handleClear()
                            }}
                            viewBox="0 0 22 22"
                        >
                            <path
                                d="M7.34187 14.6584C7.39985 14.7191 7.46955 14.7675 7.54675 14.8005C7.62396 14.8336 7.70706 14.8506 7.79104 14.8506C7.87502 14.8506 7.95812 14.8336 8.03533 14.8005C8.11253 14.7675 8.18223 14.7191 8.24021 14.6584L11 11.8986L13.7805 14.6792C13.8378 14.7359 13.9067 14.7795 13.9824 14.8072C14.0582 14.8348 14.139 14.8458 14.2193 14.8393C14.3837 14.838 14.5411 14.7726 14.6581 14.6572C14.7188 14.5992 14.7672 14.5295 14.8002 14.4523C14.8333 14.3751 14.8503 14.292 14.8503 14.208C14.8503 14.124 14.8333 14.0409 14.8002 13.9637C14.7672 13.8865 14.7188 13.8168 14.6581 13.7588L11.8983 11.0003L14.6789 8.21973C14.7356 8.16243 14.7792 8.09357 14.8069 8.01784C14.8345 7.94211 14.8455 7.8613 14.839 7.78095C14.8377 7.61657 14.7723 7.45918 14.6569 7.34217C14.5989 7.28142 14.5292 7.23306 14.452 7.20002C14.3748 7.16698 14.2917 7.14995 14.2077 7.14995C14.1237 7.14995 14.0406 7.16698 13.9634 7.20002C13.8862 7.23306 13.8165 7.28142 13.7585 7.34217L11 10.102L8.21943 7.32139C8.16213 7.26469 8.09327 7.22102 8.01754 7.19339C7.94181 7.16576 7.861 7.1548 7.78065 7.16128C7.61627 7.1626 7.45888 7.22793 7.34187 7.3434C7.28112 7.40137 7.23276 7.47107 7.19972 7.54828C7.16668 7.62548 7.14965 7.70858 7.14965 7.79256C7.14965 7.87654 7.16668 7.95964 7.19972 8.03685C7.23276 8.11405 7.28112 8.18375 7.34187 8.24173L10.1017 11.0003L7.3211 13.7808C7.26439 13.8381 7.22072 13.907 7.19309 13.9827C7.16546 14.0585 7.1545 14.1393 7.16098 14.2196C7.16198 14.3838 7.22685 14.5412 7.34187 14.6584ZM11 19.5558C9.84122 19.5661 8.69214 19.3442 7.62054 18.9032C6.60459 18.4868 5.68159 17.8726 4.90523 17.0963C4.12886 16.3199 3.51465 15.3969 3.09832 14.381C2.65672 13.3091 2.43439 12.1595 2.44443 11.0003C2.43542 9.84837 2.65734 8.70633 3.0971 7.64162C3.51487 6.62641 4.12872 5.70355 4.90354 4.92584C5.70474 4.12911 6.65625 3.4995 7.70281 3.07357C8.74937 2.64765 9.87012 2.43389 11 2.44473C12.4137 2.45499 13.8032 2.81284 15.046 3.48675C16.2888 4.16065 17.3467 5.12992 18.1266 6.30913C18.9065 7.48833 19.3843 8.84126 19.5179 10.2487C19.6516 11.6561 19.437 13.0748 18.8931 14.3797C18.4684 15.3942 17.8508 16.3165 17.0744 17.0955C16.2968 17.8708 15.374 18.485 14.3587 18.9032C13.2939 19.3429 12.1519 19.5648 11 19.5558Z"/>
                        </svg>
                    </CustomTooltip>
                    <CustomTooltip placement={"top"} title={"find data"}>
                        <svg onClick={() => {
                            setSearchValue("")
                            setIsOpen(true)
                            itemsQuery.refetch()
                        }} className={cn('ks-wt-search-svg', {
                            "ks-wt-disabled": disabled
                        })} viewBox="0 0 16 16">
                            <path d="M0.703125 6.33594C0.703125 5.5026 0.859375 4.71875 1.17188 3.98438C1.48438 3.25 1.91927 2.60677 2.47656 2.05469C3.03385 1.4974 3.67708 1.0599 4.40625 0.742188C5.14062 0.424479 5.92708 0.265625 6.76562 0.265625C7.60417 0.265625 8.39062 0.424479 9.125 0.742188C9.85938 1.0599 10.5026 1.4974 11.0547 2.05469C11.612 2.60677 12.0469 3.25 12.3594 3.98438C12.6771 4.71875 12.8359 5.5026 12.8359 6.33594C12.8359 6.97135 12.7396 7.57812 12.5469 8.15625C12.3594 8.73438 12.0964 9.26562 11.7578 9.75L15.0234 13.0234C15.1328 13.138 15.2161 13.2682 15.2734 13.4141C15.3307 13.5599 15.3594 13.7109 15.3594 13.8672C15.3594 14.0911 15.3073 14.2917 15.2031 14.4688C15.099 14.651 14.9583 14.7943 14.7812 14.8984C14.6042 15.0078 14.401 15.0625 14.1719 15.0625C14.0156 15.0625 13.862 15.0339 13.7109 14.9766C13.5651 14.9245 13.4349 14.8411 13.3203 14.7266L10.0234 11.4297C9.55469 11.737 9.04688 11.9766 8.5 12.1484C7.95312 12.3203 7.375 12.4062 6.76562 12.4062C5.92708 12.4062 5.14062 12.25 4.40625 11.9375C3.67708 11.625 3.03385 11.1901 2.47656 10.6328C1.91927 10.0755 1.48438 9.42969 1.17188 8.69531C0.859375 7.96094 0.703125 7.17448 0.703125 6.33594ZM2.39844 6.33594C2.39844 6.9401 2.51042 7.50781 2.73438 8.03906C2.96354 8.5651 3.27865 9.02865 3.67969 9.42969C4.08073 9.82552 4.54427 10.138 5.07031 10.3672C5.59635 10.5911 6.16146 10.7031 6.76562 10.7031C7.36979 10.7031 7.9349 10.5911 8.46094 10.3672C8.98698 10.138 9.45052 9.82552 9.85156 9.42969C10.2526 9.02865 10.5651 8.5651 10.7891 8.03906C11.0182 7.50781 11.1328 6.9401 11.1328 6.33594C11.1328 5.73177 11.0182 5.16667 10.7891 4.64062C10.5651 4.11458 10.2526 3.65104 9.85156 3.25C9.45052 2.84896 8.98698 2.53646 8.46094 2.3125C7.9349 2.08854 7.36979 1.97656 6.76562 1.97656C6.16146 1.97656 5.59635 2.08854 5.07031 2.3125C4.54427 2.53646 4.08073 2.84896 3.67969 3.25C3.27865 3.65104 2.96354 4.11458 2.73438 4.64062C2.51042 5.16667 2.39844 5.73177 2.39844 6.33594Z"/>
                        </svg>
                    </CustomTooltip>
                </div>

                {
                    itemsQuery?.data && itemsQuery?.data?.items?.length > 0 && <div className={cn("cus-item-dpw ks_dropdown_menu dropdown-menu ks_w100 ks_mt_5", {
                        "d-block": isOpen
                    })}>
                        <div className="ks-wt-dropdown-dialog ks_d_flex ks_flex_col">

                            {
                                itemsQuery?.data?.items?.map(item => (
                                    <div
                                        key={item.id}
                                        className="ks-wt-dropdown-dialog-item-column"
                                        onClick={() => {
                                            setSearchValue("")
                                            setIsOpen(false)
                                            handleItemClick(item)
                                        }}
                                    >
                                        <span className="truncate">{item.item_name}</span>
                                    </div>
                                ))
                            }

                        </div>
                    </div>
                }
            </div>
        </ClickOutside>
    );
};

export default ItemDropdown;