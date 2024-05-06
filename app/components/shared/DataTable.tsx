"use client"
import {flexRender, Row, Table,} from "@tanstack/react-table";
import cn from "clsx";
import {ArrowDown, ArrowUp} from "../icons";
import { calculateColumnWidth } from "./columnWidth";

interface DataTableProps<TData, TValue> {
    // data: TData[]
    // columns: ColumnDef<TData, TValue>[]
    table: Table<TData>,
    handleRowClick?: (data: TData) => void,
    handleRowDoubleClick?: (data: TData,  row: Row<TData>) => void,
    rowActions?: (data: Row<TData>) => React.ReactNode,
    rowSticky?: boolean,
    tableCustomClass?: string,
}

const DataTable =  <TData,TValue>({rowActions, table: tableRef, handleRowClick, handleRowDoubleClick, rowSticky = false, tableCustomClass}: DataTableProps<TData, TValue>) => {

    return (
        <table className={cn("ks_table", tableCustomClass) }>
            <thead>
            {tableRef.getHeaderGroups().map(headerGroup => (
                <tr className={"ks_table_header_row"} key={headerGroup.id}>
                    {headerGroup.headers.map((header, index) => (
                        /*
                        * Check if the header is the last one index === headerGroup.headers.length - 1
                        * If it is the last one, then we will set className to ks_table_header
                        * */
                        headerGroup.headers.length - 1 === index ? (
                            <th
                                className={cn("ks_table_header")}
                                key={header.id}
                                colSpan={header.colSpan}
                                style={{ textAlign: (header.column.columnDef.meta as any)?.align, width: calculateColumnWidth(header.getSize())}}
                            >
                                {
                                    header.isPlaceholder
                                        ? null
                                        : <div {...{

                                            className: cn('', {
                                                'ks-wt-tbl-hd-container prevent-select': header.column.getCanSort(),
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

                                            {header.column.getIsSorted() == "asc" && <ArrowUp />}
                                            {header.column.getIsSorted() == "desc" && <ArrowDown />}
                                            {header.column.getCanSort() && !header.column.getIsSorted() && <ArrowDown />}
                                        </div>
                                }

                            </th>
                        ) : (
                            <th
                                className={cn("ks_table_header", (header.column.columnDef.meta as any)?.headerClass)}
                                key={header.id}
                                colSpan={header.colSpan}
                                style={{ textAlign: (header.column.columnDef.meta as any)?.align, width: calculateColumnWidth(header.getSize())}}
                            >
                                {
                                    header.isPlaceholder
                                        ? null
                                        : <div {...{

                                            className: cn('', {
                                                'ks-wt-tbl-hd-container prevent-select': header.column.getCanSort(),
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

                                            {header.column.getIsSorted() == "asc" && <ArrowUp />}
                                            {header.column.getIsSorted() == "desc" && <ArrowDown />}
                                            {header.column.getCanSort() && !header.column.getIsSorted() && <ArrowDown />}
                                        </div>
                                }

                            </th>
                        )

                    ))}
                    <th className="ks_table_header"></th>
                </tr>
            ))}
            </thead>

            <tbody>
            {
                tableRef.getRowModel().rows.length == 0
                    ?
                    <tr className="ks_table_data_row" style={{ textAlign: "center" }}>
                        <td className="ks_table_data" colSpan={tableRef.getVisibleFlatColumns().length + 1}>Empty List</td>
                    </tr>
                    :
                    tableRef.getRowModel().rows.map(row => (
                        <tr className={cn("ks_table_data_row position-relative", {
                            "ks-wt-light-blue" : row.getIsSelected(),
                        })}
                            key={row.id}
                            onClick={() => {
                                if (handleRowClick) {
                                    handleRowClick(row.original)
                                }
                            }}
                            onDoubleClick={() => {
                                if (handleRowDoubleClick) {
                                    handleRowDoubleClick(row.original, row)
                                }
                            }}
                        >
                            {row.getVisibleCells().map(cell => (
                                <td className={cn("ks_table_data", (cell.column.columnDef.meta as any)?.rowClass)}
                                    align={(cell.column.columnDef.meta as any)?.align}
                                    key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                            <td className="ks_table_data ks-wt-tbl-data-sticky">
                                {flexRender(rowActions, row)}
                            </td>
                        </tr>
                    ))
            }
            </tbody>
        </table>
    )
}

export default DataTable;