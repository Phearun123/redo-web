"use client";
import { Pagination } from "@/app/lib/types/common";
import { ChangeEvent } from "react";
import cn from "clsx";
import RCPagination from "rc-pagination";

const PaginationSetting = ({
    data,
    page,
    rowSelected = 0
}: {
    data: Pagination;
    page: (page_number?: number, page_size?: number) => void; rowSelected:number
}) => {
    const {
        total_pages,
        current_page,
        size,
        first,
        last,
        total_elements,
        empty,
    } = data ?? {};

    const showPage = data && !empty;

    const handleChangePageSize = (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        page(0, Number(e.target.value));
    };

    const PrevNextArrow = (current: any, type: any, originalElement: any) => {

        if (type === 'prev') {
            return <button className="ks_btn">
                <svg viewBox="0 0 18 18">
                    <path
                        d="M15.75 8.24976H5.122L7.807 5.55676L6.75 4.49976L2.25 8.99976L6.75 13.4998L7.807 12.4428L5.122 9.74976H15.75V8.24976Z"/>
                </svg>
            </button>;
        }
        if (type === 'next') {
            return <button  className="ks_btn">
                <svg viewBox="0 0 18 18">
                    <path
                        d="M2.25 9.74951L12.878 9.74951L10.193 12.4425L11.25 13.4995L15.75 8.99951L11.25 4.49951L10.193 5.55651L12.878 8.24951L2.25 8.24951V9.74951Z"/>
                </svg>
            </button>;
        }
        return originalElement;
    }

    return (
        <div className="ks-wt-modal-body-content-item ks_brd_top">
            <div className="ks-wt-app-footer-widget ks_row">
                <div className="col-3">
                    <div className="ks-wt-footer-select-row-container ks_d_inl_flex ks_alg_itm_ctr">
                        <select
                            defaultValue={size}
                            className="ks_form_select"
                            onChange={handleChangePageSize}
                        >
                            {[10, 25, 50, 100].map((item) => (
                                <option key={item}>{item}</option>
                            ))}
                        </select>
                        {rowSelected > 0 && <label>{rowSelected} selected</label>}
                    </div>
                </div>
                <div className="col-6">
                    <div className="ks-wt-footer-pagination-container">
                        {/* <button
                            className={cn("ks_btn", {
                                "ks-wt-disabled": first,
                            })}
                        >
                            <svg viewBox="0 0 18 18">
                                <path d="M9.307 12.4425L6.622 9.74951L17.25 9.74951V8.24951H6.622L9.315 5.55651L8.25 4.49951L3.75 8.99951L8.25 13.4995L9.307 12.4425ZM3 13.4995L3 4.49951H1.5L1.5 13.4995H3Z" />
                            </svg>
                        </button> */}
                        {
                            showPage && <button type={"button"} onClick={() => {
                                page(0, size)
                            }} className={cn("ks_btn",{"ks-wt-disabled": first})}>
                                <svg viewBox="0 0 18 18">
                                    <path
                                        d="M9.307 12.4425L6.622 9.74951L17.25 9.74951V8.24951H6.622L9.315 5.55651L8.25 4.49951L3.75 8.99951L8.25 13.4995L9.307 12.4425ZM3 13.4995L3 4.49951H1.5L1.5 13.4995H3Z"/>
                                </svg>
                            </button>
                        }
                        {
                            showPage && <RCPagination
                            className="pagination-data"
                            // showTotal={(total, range) => `Showing ${range[0]}-${range[1]} of ${total}`}
                            onChange={(pa) => {
                                page(pa - 1, size)
                            }}
                            total={total_elements}
                            current={current_page + 1}
                            pageSize={size ?? 10}
                            showSizeChanger={false}
                            itemRender={PrevNextArrow}

                        />
                        }

                        {
                            showPage && <button type={"button"} onClick={() => {
                                page(total_pages - 1, size)
                            }} className={cn("ks_btn",{"ks-wt-disabled": last})}>
                                <svg viewBox="0 0 18 18">
                                    <path
                                        d="M8.693 5.55676L11.378 8.24976H0.75V9.74976H11.378L8.685 12.4428L9.75 13.4998L14.25 8.99976L9.75 4.49976L8.693 5.55676ZM15 4.49976V13.4998H16.5V4.49976H15Z"/>
                                </svg>
                            </button>
                        }
                    </div>
                </div>
                <div className="col-3" />
            </div>
        </div>
    );
};

export default PaginationSetting;
