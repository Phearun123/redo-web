import {Dropdown} from "react-bootstrap";
import {ButtonToggle} from "@/app/components/shared/index";
import React, {useEffect, useState} from "react";
import {ProfileAccount} from "@/app/lib/types/profile";
import useStorage from "@/app/lib/hooks/useStorage";
import {useQueryClient} from "@tanstack/react-query";
import cn from "clsx";

type Props = {
    table: any,
    defaultColumns: any,
    storageKey: string
}

export const ViewSetting = ({table, defaultColumns, storageKey}: Props) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const setDropdown = () => {
        setShowDropdown(!showDropdown)
    }
    const {getItem, setItem} = useStorage();
    const queryClient = useQueryClient();
    const profile = queryClient.getQueryData<ProfileAccount>(['profile'])
    const [select, setSelect] = useState<any>('');
    const [isReset, setIsReset] = useState<boolean>(false);
    const [isSave, setIsSave] = useState<boolean>(false);
    const key = `${storageKey}-${profile?.id || ''}-20231108`;
    const [columnIndex, setColumnIndex] = useState(table.getAllColumns().filter((column: any) => column?.id !== "checkbox"));

    const storeValue = getItem(key);
    const columnOrder = storeValue ? JSON.parse(storeValue).sortColumnOrder : [];
    const columnVisible = storeValue ? JSON.parse(storeValue).showColumns : defaultColumns;

    useEffect(() => {
        if(isSave){
            setIsSave(false);
            setIsReset(false);
            setSelect('');
            setColumnIndex(compareIndex())
            table.setColumnVisibility(columnVisible);
            return;
        }

        setIsSave(false);
        setIsReset(false);
        setSelect('');
        setColumnIndex(compareIndex())

        if (storeValue){
            // check checked columns
            let checkbox = document.querySelectorAll('.ks-wt-modal-body-checkbox-parent-list input') as NodeListOf<HTMLInputElement>;
            checkbox.forEach(c => {
                c.checked = columnVisible[c.id]
            })
            return;
        } else {
            // check columns based on getColumns value
            let checkbox = document.querySelectorAll('.ks-wt-modal-body-checkbox-parent-list input') as NodeListOf<HTMLInputElement>;
            checkbox.forEach(checkboxElement => {
                checkboxElement.checked = storeValue
                    ? columnVisible[checkboxElement.id]
                    : defaultColumns.includes(checkboxElement.id);
            });

            let visibleColumns  = table.getAllColumns().filter((column: any) => column?.id !== "checkbox").filter((column: any) => column.getIsVisible());
            visibleColumns.forEach((column: any) => {
                let checkbox = document.getElementById(column?.id) as HTMLInputElement;
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
            return;
        }
    }, [showDropdown])

    // on table.getAllColumns() changed
    useEffect(() => {
        // check columns based on getColumns value
        let checkbox = document.querySelectorAll('.ks-wt-modal-body-checkbox-parent-list input') as NodeListOf<HTMLInputElement>;
        checkbox.forEach(checkboxElement => {
            checkboxElement.checked = storeValue
                ? columnVisible[checkboxElement.id]
                : defaultColumns.includes(checkboxElement.id);
        });

        setColumnIndex(table.getAllColumns().filter((column: any) => column?.id !== "checkbox"));
    }, [table.getAllColumns()]);

    const updateColumnVisibility = (columns: any, visibility: any) => {
        columns.forEach((column: any) => {
            if (column?.id !== "checkbox") {
                column.toggleVisibility(!visibility[column?.id]);
            }
        });
    };

    const onSave = () => {
        let showColumns = {};

        let uncheck = document.querySelectorAll('.ks-wt-modal-body-checkbox-parent-list input');
        // @ts-ignore
        uncheck.forEach(c => showColumns[c.id] = false);

        let checked = document.querySelectorAll('.ks-wt-modal-body-checkbox-parent-list input:checked');
        // @ts-ignore
        checked.forEach(c => showColumns[c.id] = true);
        if (isReset) {
            setItem(key, JSON.stringify({
                showColumns: showColumns,
                sortColumnOrder: []
            }));

            updateColumnVisibility(table.getAllColumns(), columnVisible);

            // set column visibility
            table.setColumnVisibility(columnVisible)
            setDropdown();
            setIsSave(true);
            return;
        }

        setItem(key, JSON.stringify({
            showColumns,
            sortColumnOrder: columnIndex.map((column: any) => column?.id)
        }));

        if (columnVisible) {
            updateColumnVisibility(table.getAllColumns(), columnVisible);

            // set column visibility
            table.setColumnVisibility(columnVisible)
        }
        setDropdown();
        setIsSave(true);
    };

    const onReset = () => {
        // check default columns
        const checkbox = document.querySelectorAll('.ks-wt-modal-body-checkbox-parent-list input') as NodeListOf<HTMLInputElement>;
        checkbox.forEach(c => {
            c.checked = defaultColumns.includes(c.id.replace('ks_wt_', ''))
        })
        setSelect('');
        setIsReset(true);
        setColumnIndex(table.getAllColumns().filter((column: any) => column?.id));
    };

    const onClose = () => {
        let checkbox = document.querySelectorAll('.ks-wt-modal-body-checkbox-parent-list input') as NodeListOf<HTMLInputElement>;
        // let getColumns = getItem(key);

        // check columns based on getColumns value
        checkbox.forEach(checkboxElement => {
            checkboxElement.checked = storeValue
                ? columnVisible[checkboxElement.id]
                : defaultColumns.includes(checkboxElement.id);
        });
        setSelect('');
        setIsReset(false);
        setColumnIndex(compareIndex());
        setDropdown();
    };

    function handleClickMoveUp() {
        const oldIndex = columnIndex.findIndex((column: any) => column?.id === select);

        //check if first index
        if (oldIndex === 0) return;

        // set new index
        let newIndex = oldIndex - 1;

        // clone array
        let newColumns = [...columnIndex];

        let checkbox = table.getAllColumns().find((column: any) => column?.id === "checkbox");

        // include checkbox column at first index
        let checkboxIndex = newColumns.indexOf(checkbox);

        // check if checkbox is not already at the first index
        if (checkboxIndex == -1) {
            // remove checkbox from its original position
            newColumns.unshift(checkbox);

            //move column
            newColumns.splice(newIndex, 0, newColumns.splice(oldIndex + 1, 1)[0]);
        }

        // check if the column to be moved is not the checkbox
        if (oldIndex !== 0 && newIndex !== 0) {
            // move column
            newColumns.splice(newIndex, 0, newColumns.splice(oldIndex, 1)[0]);
        }

        // update state
        setColumnIndex(newColumns);
    }

    function handleClickMoveDown() {
        const oldIndex = columnIndex.findIndex((column: any) => column?.id === select);

        // check if it is the last one
        if (oldIndex === columnIndex.length - 1) return;

        // set new index
        let newIndex = oldIndex + 1;

        // clone array
        let newColumns = [...columnIndex];

        let checkbox = table.getAllColumns().find((column: any) => column?.id === "checkbox");

        // include checkbox column at first index
        let checkboxIndex = newColumns.indexOf(checkbox);

        // check if checkbox is not already at the first index
        if (checkboxIndex !== 0) {
            // remove checkbox from its original position
            newColumns.splice(checkboxIndex, 1);

            // insert checkbox at the first index
            newColumns.unshift(checkbox);
        }

        // check if the column to be moved is not the checkbox
        if (oldIndex !== 0 && newIndex !== 0) {
            // move column
            newColumns.splice(newIndex, 0, newColumns.splice(oldIndex, 1)[0]);
        }

        // update state
        setColumnIndex(newColumns);
    }

    function handleClickMoveTop() {
        const oldIndex = columnIndex.findIndex((column: any) => column?.id === select);

        //check if first index
        if (oldIndex === 0) return;

        // clone array
        const newColumns = [...columnIndex];

        // move column
        newColumns.unshift(newColumns.splice(oldIndex, 1)[0]);

        let checkbox = table.getAllColumns().find((column: any) => column?.id === "checkbox");

        // include checkbox column at first index
        let checkboxIndex = newColumns.indexOf(checkbox);

        // check if checkbox is not already at the first index
        if (checkboxIndex !== 0) {
            // remove checkbox from its original position
            newColumns.splice(checkboxIndex, 1);

            // insert checkbox at the first index
            newColumns.unshift(checkbox);
        }

        // update state
        setColumnIndex(newColumns);
    }

    function handleClickMoveBottom() {
        const oldIndex = columnIndex.findIndex((column: any) => column?.id === select);

        // check if it is the last one
        if (oldIndex === columnIndex.length - 1) return;

        // clone array
        const newColumns = [...columnIndex];

        // move column
        newColumns.push(newColumns.splice(oldIndex, 1)[0]);

        let checkbox = table.getAllColumns().find((column: any) => column?.id === "checkbox");

        // include checkbox column at first index
        let checkboxIndex = newColumns.indexOf(checkbox);

        // check if checkbox is not already at the first index
        if (checkboxIndex !== 0) {
            // remove checkbox from its original position
            newColumns.splice(checkboxIndex, 1);

            // insert checkbox at the first index
            newColumns.unshift(checkbox);
        }

        // update state
        setColumnIndex(newColumns);
    }

    function compareIndex() {
        let result: any[] = [];

        let checkbox = table.getAllColumns().find((obj: any) => obj?.id === "checkbox");

        result.push(checkbox);

        // Loop through the array2, excluding the first element "checkbox"
        for (let i = 1; i < columnOrder.length; i++) {
            // Find the object with the same id as the current element of array2
            let obj = columnIndex.find((obj: any) => obj?.id === columnOrder[i]);
            // Push the object to the result array
            result.push(obj);
        }

        // Filter out the objects that are already in the result array from array1
        let remaining = columnIndex.filter((obj: any) => !result.includes(obj));
        // Concatenate the remaining objects to the result array
        result = result.concat(remaining);
        return result;
    }

    return (
        <>
            <Dropdown show={showDropdown} onToggle={setDropdown}>
                <Dropdown.Toggle as={ButtonToggle} viewOptions={true}>
                    <svg width={20} height={20} viewBox="0 0 20 20" className="ks_wt_app_cursor_pointer">
                        <path
                            d="M2.82031 6.80469C2.01562 6.80469 1.35156 6.14062 1.35156 5.33594C1.35156 4.52344 2.01562 3.85938 2.82031 3.85938C3.625 3.85938 4.28906 4.52344 4.28906 5.33594C4.28906 6.14062 3.625 6.80469 2.82031 6.80469ZM7.125 6.4375C6.5 6.4375 6.02344 5.94531 6.02344 5.33594C6.02344 4.71094 6.50781 4.22656 7.125 4.22656H17.5469C18.1641 4.22656 18.6484 4.71875 18.6484 5.33594C18.6484 5.95312 18.1562 6.4375 17.5469 6.4375H7.125ZM2.82031 11.8359C2.01562 11.8359 1.35156 11.1719 1.35156 10.3672C1.35156 9.5625 2.01562 8.89844 2.82031 8.89844C3.625 8.89844 4.28906 9.5625 4.28906 10.3672C4.28906 11.1719 3.625 11.8359 2.82031 11.8359ZM7.125 11.4688C6.5 11.4688 6.02344 10.9844 6.02344 10.3672C6.02344 9.75 6.50781 9.26562 7.125 9.26562H17.5469C18.1641 9.26562 18.6484 9.75781 18.6484 10.3672C18.6484 10.9844 18.1562 11.4688 17.5469 11.4688H7.125ZM2.82031 16.875C2.01562 16.875 1.35156 16.2109 1.35156 15.4062C1.35156 14.5938 2.01562 13.9297 2.82031 13.9297C3.625 13.9297 4.28906 14.5938 4.28906 15.4062C4.28906 16.2109 3.625 16.875 2.82031 16.875ZM7.125 16.5078C6.5 16.5078 6.02344 16.0156 6.02344 15.4062C6.02344 14.7812 6.50781 14.2969 7.125 14.2969H17.5469C18.1641 14.2969 18.6484 14.7891 18.6484 15.4062C18.6484 16.0234 18.1562 16.5078 17.5469 16.5078H7.125Z"
                        />
                    </svg>
                </Dropdown.Toggle>

                <Dropdown.Menu className={"ks_dropdown_menu dropdown-menu-end ks_wth_280 ks_mt_5"}>
                    <div className="ks-wt-dropdown-dialog ks_pd_0 ks_d_flex ks_flex_col">
                        <div className="ks-wt-header-dropdown-dialog ks_d_flex ks_alg_itm_ctr">
                            <div className="ks_w100 ks_d_flex ks_jt_cont_betw ks_alg_itm_ctr">
                                <label>View Settings</label>
                                <div className="ks_d_flex ks_alg_itm_ctr ks_gap_5rem">
                                    <button className="ks_btn ks_btn_outl_icon_tiary ks-wt-btn-sm"
                                            onClick={handleClickMoveBottom}>
                                        <svg width="24" height="24" className="ks_wth_24 ks_hgt_24"
                                             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <path
                                                d="M12.0001 10.0859L7.20718 5.29297L5.79297 6.70718L12.0001 12.9143L18.2072 6.70718L16.793 5.29297L12.0001 10.0859ZM18.0001 17.0001L6.00007 17.0001L6.00007 15.0001L18.0001 15.0001V17.0001Z"></path>
                                        </svg>
                                    </button>
                                    <button className="ks_btn ks_btn_outl_icon_tiary ks-wt-btn-sm"
                                            onClick={handleClickMoveDown}>
                                        <svg width="24" height="24" className="ks_wth_24 ks_hgt_24"
                                             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <path
                                                d="M11.9997 13.1714L16.9495 8.22168L18.3637 9.63589L11.9997 15.9999L5.63574 9.63589L7.04996 8.22168L11.9997 13.1714Z"></path>
                                        </svg>
                                    </button>
                                    <button className="ks_btn ks_btn_outl_icon_tiary ks-wt-btn-sm"
                                            onClick={handleClickMoveUp}>
                                        <svg width="24" height="24" className="ks_wth_24 ks_hgt_24"
                                             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <path
                                                d="M11.9997 10.8284L7.04996 15.7782L5.63574 14.364L11.9997 8L18.3637 14.364L16.9495 15.7782L11.9997 10.8284Z"></path>
                                        </svg>
                                    </button>
                                    <button className="ks_btn ks_btn_outl_icon_tiary ks-wt-btn-sm"
                                            onClick={handleClickMoveTop}>
                                        <svg width="24" height="24" className="ks_wth_24 ks_hgt_24"
                                             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <path
                                                d="M12.0001 13.9142L16.793 18.7071L18.2072 17.2929L12.0001 11.0858L5.79297 17.2929L7.20718 18.7071L12.0001 13.9142ZM6.00008 7L18.0001 7V9L6.00008 9L6.00008 7Z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="ks-wt-dropdown-dialog-container ks_scrollable">
                            <ul className="ks-wt-modal-body-checkbox-parent-list">
                                <li>
                                    <div
                                        className="ks-wt-modal-body-checkbox-parent-item ks_d_flex ks_alg_itm_ctr">
                                        <div className="ks-wt-form-checkbox-block">
                                            <input
                                                className="ks_form_checkbox ks_form_checkbox_no_border ks_form_indeterminate_checkbox"
                                                id="column_id"
                                                type="checkbox"
                                                onClick={() => {
                                                    const isCheck = document.getElementById('column_id') as HTMLInputElement
                                                    const checkbox = document.querySelectorAll('.ks-wt-modal-body-checkbox-parent-list input') as NodeListOf<HTMLInputElement>
                                                    if (isCheck.checked) {
                                                        checkbox.forEach(c => c.checked = true)
                                                    } else {
                                                        checkbox.forEach(c => c.checked = false)
                                                    }
                                                }}
                                            />
                                        </div>
                                        <label className="ks_fw_semi_bd" htmlFor="column_id">
                                            Show all
                                        </label>
                                    </div>
                                    <ul className="ks-wt-modal-body-checkbox-parent-list">
                                        {
                                            columnIndex.filter((column: any) => column?.id && column?.id !== "checkbox").map((column: any) => {
                                                return (
                                                    <li
                                                        key={column?.id}
                                                        className={cn(`ks-wt-modal-body-checkbox-list-item`, {"ks-wt-sel-view-option": select === column?.id})}
                                                        onClick={() => {
                                                            setSelect(column?.id);
                                                        }}
                                                    >
                                                        <div className="ks-wt-element-checkbox-container ks_d_flex ks_alg_itm_ctr">
                                                            <div className="ks-wt-form-checkbox-block">
                                                                <input
                                                                    type="checkbox"
                                                                    className="ks_form_checkbox ks_form_checkbox_no_border"
                                                                    id={column?.id}
                                                                    defaultChecked={column.getIsVisible()}
                                                                />
                                                            </div>
                                                            <label>{column.columnDef.header}</label>
                                                        </div>
                                                    </li>
                                                );
                                            })
                                        }
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        <div
                            className="ks_mt_auto ks-wt-footer-dropdown-dialog ks_d_flex ks_jt_cont_end ks_alg_itm_ctr">
                            <div className="ks-wt-element-group-container ks_d_flex ks_alg_itm_ctr">
                                <button className="ks_btn ks_btn_tiary" onClick={onClose}>
                                    Close
                                </button>

                                <button className="ks_btn ks_btn_outl_sec" onClick={onReset}>Reset</button>
                                <button className="ks_btn ks_btn_pm" onClick={onSave}>Save</button>
                            </div>
                        </div>
                    </div>
                </Dropdown.Menu>
            </Dropdown>
        </>
    )
}