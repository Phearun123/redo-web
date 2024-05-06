import { DataTable, IndeterminateCheckbox } from "@/app/components/shared";
import FormTypeStatus from "@/app/components/shared/FormTypeStatus";
import getDateFormatted from "@/app/components/shared/getDateFormatted";
import PaginationSetting from "@/app/components/shared/PaginationSetting";
import useHSMProvider from "@/app/lib/hooks/useHSMProvider";
import { useDigitalOptionStore } from "@/app/lib/store";
import { DigitalSignature } from "@/app/lib/types/digitalsignature";
import digitalSignatureService from "@/service/digitalsignature.service";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, getCoreRowModel, PaginationState, RowSelectionState, useReactTable } from "@tanstack/react-table";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import cn from "clsx";
import {CERTIFICATE_TYPE} from "@/utils/enum";

type Props = {
    open: boolean
    setOpen: (value: boolean) => void
}

const defaultColumns: ColumnDef<DigitalSignature>[] = [
    {
        accessorKey: "",
        id: "checkbox",
        enableSorting: false,
        cell: ({ row , table}) => (
            <IndeterminateCheckbox
                type="radio"
                {...{
                    checked: row.getIsSelected(),
                    disabled: !row.getCanSelect(),
                    indeterminate: row.getIsSomeSelected(),
                    onChange:() => {
                        table.resetRowSelection()
                        row.toggleSelected()
                    },
                }}
            />
        ),
    },
    {
        accessorKey: "org_nm",
        id: "org_nm",
        header: "Issuer Id",
        cell: (props) =>  (
            <div className="text-truncate text-nowrap" style={{maxWidth: '150px'}}>
                {/*<span>{parseDn(props.getValue() as string)}</span>*/}
                <span>{props.getValue() as string}</span>
            </div>
        )
    },
    {
        accessorKey: "serial_no",
        id: "serial_no",
        header: "Serial No",
        meta: {
            headerClass: "ks_wth_150"
        },
        cell: (props) => (
            <div className="text-truncate text-nowrap" style={{maxWidth: '130px'}}>
                <span>{props.getValue() as string}</span>
            </div>
        )
    },
    {
        accessorKey: "from_date",
        id: "from_date",
        header: "Effective Date",
        cell: (props) => getDateFormatted(props.getValue() as string),
    },
    {
        accessorKey: "to_date",
        id: "to_date",
        header: "Expired Date",
        cell: (props) => getDateFormatted(props.getValue() as string),
    },
    {
        accessorKey: "form_tp",
        id: "form_tp",
        header: "Status",
        cell: (props) => <FormTypeStatus status={props.row.original?.status} />,
    },
];

const SelectDigitalSignature = ({open, setOpen}: Props) => {

    const {
        isLoading,
        hsmLogin
    } = useHSMProvider();

    let dgOptionStore = useDigitalOptionStore();

    const [rowSelection, setRowSelection] = useState<RowSelectionState>({
        "0": true
    })

    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10
    })

    const dataQuery = useQuery(['digital-signature-option', {
        ...pagination
    }], {
        queryFn: async () => await digitalSignatureService.getDigitalSignature({
            page_number: pagination.pageIndex,
            page_size: pagination.pageSize,
            type: CERTIFICATE_TYPE.HSM
        }),
        keepPreviousData: true
    })

    const table = useReactTable({
        state: {
            pagination,
            rowSelection
        },
        onRowSelectionChange: setRowSelection,
        data: dataQuery.data?.digital_signatures ?? [],
        columns: defaultColumns,
        getCoreRowModel: getCoreRowModel(),
        // enableSorting: true,
        manualPagination: true,
        // debugTable: true
    })

    const rowSelected = table.getSelectedRowModel()
        .rows
        .map(row => row.original)

    function handleClickConfirm() {
        hsmLogin(rowSelected[0]?.serial_no as string)
        dgOptionStore.setSelectedRow(rowSelected[0])
    }

    return (
        <>
            <Modal show={open} dialogClassName={"modal-dialog modal-dialog-centered ks-wt-modal-md-850-dialog"}>
                <div className="modal-content ks-wt-modal-content">
                    <div className="ks-wt-modal-header-container ks_d_inl_flex ks_jt_cont_betw ks_alg_itm_ctr">
                        <label>Select digital signature</label>
                        <svg
                            onClick={() => setOpen(false)}
                            data-bs-toggle="tooltip"
                            data-bs-title="close"
                            data-bs-dismiss="modal"
                            viewBox="0 0 24 24"
                        >
                            <path d="M4.81916 19.4822C4.42024 19.0926 4.42951 18.4061 4.81916 18.0257L10.5247 12.3109L4.81916 6.6053C4.42951 6.22492 4.42024 5.54768 4.81916 5.13948C5.21809 4.74055 5.89533 4.74983 6.28498 5.13948L11.9905 10.845L17.6961 5.13948C18.095 4.74983 18.7537 4.74983 19.1619 5.14875C19.5701 5.5384 19.5609 6.21565 19.1712 6.6053L13.4656 12.3109L19.1712 18.0257C19.5609 18.4154 19.5609 19.0833 19.1619 19.4822C18.763 19.8905 18.095 19.8812 17.6961 19.4915L11.9905 13.786L6.28498 19.4915C5.89533 19.8812 5.22737 19.8812 4.81916 19.4822Z" />
                        </svg>
                    </div>
                    <div className="ks-wt-modal-body ks_d_flex ks_flex_col">
                        <div className="ks_h100 ks_d_flex ks_flex_col ks_scrollable">
                            <div className="ks_scrollable ks_h100">
                                <DataTable table={table}/>
                            </div>
                            <PaginationSetting
                                data={dataQuery.data?.pagination!}
                                page={async (page_number, page_size) => {
                                    setPagination({
                                        pageIndex: page_number!,
                                        pageSize: page_size!
                                    })
                                }}
                                rowSelected={0}
                            />
                        </div>
                    </div>
                    <div className="ks-wt-modal-footer ks_d_flex ks_jt_cont_end ks_alg_itm_ctr">
                        <div className="ks-wt-element-group-container ks_d_flex ks_alg_itm_ctr">
                            <button type={"button"} onClick={() => setOpen(false)} data-bs-dismiss="modal" className="ks_btn ks_btn_tiary">
                                Cancel
                            </button>
                            <button type={"button"} onClick={handleClickConfirm}  className={cn("ks_btn ks_btn_pm ", { "ks-wt-disabled": isLoading })} >{isLoading ? "Loading...": "Confirm"} </button>
                        </div>
                    </div>
                </div>

            </Modal>
        </>
    );
};

export default SelectDigitalSignature;