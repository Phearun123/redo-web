"use client"
import {
    Table,
    flexRender,
} from "@tanstack/react-table";
import cn from "clsx";
import { SortIconSvg } from "../icons/SortIconSvg";
import { useEffect } from "react";

interface DataTableProps<TData> {
    tableRef: Table<TData>
    handleRowClick?: (data: TData) => void,
    checkSelected?: (data: any) => void
    resetSelectRow?: boolean
    handleRowDoubleClick?: (data: TData) => void
}

const SettingDataTable = <TData,>({tableRef, handleRowClick, handleRowDoubleClick, checkSelected, resetSelectRow}: DataTableProps<TData>) => {

    useEffect(() => {
        if(resetSelectRow)
        tableRef.resetRowSelection();
    },[resetSelectRow, tableRef])
    

    useEffect(() => {
        if(checkSelected)
            checkSelected(tableRef.getSelectedRowModel().flatRows)
    },[tableRef.getSelectedRowModel().rows.length])

    return (
        <table className="ks_table ks_table_modal">
            <thead>
            {tableRef.getHeaderGroups().map(headerGroup => (
                <tr className={"ks_table_header_row"} key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                        <th
                        className={cn("ks_table_header", (header.column.columnDef.meta as any)?.headerClass)}
                            key={header.id}
                            colSpan={header.colSpan}
                            style={{textAlign: (header.column.columnDef.meta as any)?.align}}
                        >
                            {
                                header.isPlaceholder
                                    ? null
                                    : <div {...{

                                        className: cn('', {
                                            ' prevent-select': header.column.getCanSort(),
                                        }),
                                        // onClick: header.column.getToggleSortingHandler()
                                        onClick: (e) => {
                                            if (header.column.getCanSort()) {
                                                header.column.toggleSorting(
                                                    header.column.getIsSorted() === "asc",
                                                    e.shiftKey
                                                )
                                            }
                                        }
                                    }}>
                                        {
                                            flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )
                                        }

                                        {{
                                            asc: SortIconSvg.UpSvg(),
                                            desc: SortIconSvg.DownSvg(),
                                        }[header.column.getIsSorted() as string] ?? null}
                                        {
                                            header.column.getCanSort() && !header.column.getIsSorted() && SortIconSvg.DownSvg()
                                        }
                                    </div>
                            }

                        </th>
                    ))}

                </tr>
            ))}
            </thead>

            <tbody>
            {
                tableRef.getRowModel().rows.length == 0
                    ?
                    <tr className="ks_table_data_row" style={{ textAlign: "center" }}>
                        <td className="ks_table_data" colSpan={tableRef.getVisibleFlatColumns().length}>Empty List</td>
                    </tr>
                    :
                    tableRef.getRowModel().rows.map(row => (
                        <tr className={cn("ks_table_data_row", {" ks-wt-light-blue": tableRef.getSelectedRowModel().rowsById[row.id]})} key={row.id} onClick={() => {
                            if(handleRowClick) {
                                handleRowClick(row.original)
                            }
                        }} onDoubleClick={() => {
                            if(handleRowDoubleClick){
                                handleRowDoubleClick(row.original)
                            }
                        }}>
                            {row.getVisibleCells().map(cell => (
                                <td className={"ks_table_data"}
                                    align={(cell.column.columnDef.meta as any)?.align}
                                    key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))
            }
            </tbody>
        </table>
    )
}

export default SettingDataTable;