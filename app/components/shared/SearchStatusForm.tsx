"use client"
import { replaceColumns } from "@/app/(root)/sale/e-invoice/replace/replace-columns";
import { DataTable } from "@/app/components/shared";
import CustomTooltip from "@/app/components/shared/CustomTooltip";
import ErrorMessage from "@/app/components/shared/ErrorMessage";
import PaginationSetting from "@/app/components/shared/PaginationSetting";
import ERecordForm from "@/app/components/ui/e-record/ERecordForm";
import Preview from "@/app/components/ui/pos-invoice/modal/Preview";
import CompanyDropdown from "@/app/components/ui/sales/dropdown/CompanyDropdown";
import useCreateERecord from "@/app/lib/hooks/useCreateERecord";
import useFetchCommCode from "@/app/lib/hooks/useFetchCommCode";
import { useDgStore, useEInvoiceStore, useSaleStore, useShopStore } from "@/app/lib/store";
import { Invoice, SendERecordReq } from "@/app/lib/types/sales-status";
import { noticeService } from "@/service/notice.service";
import { salesService } from "@/service/sales.service";
import { settingsService } from "@/service/setting.service";
import { CERTIFICATE_TYPE, CommonCode, ERecordType, HSMtype, InformType, SearchType } from "@/utils/enum";
import {useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import cn from "clsx";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import DgOption from "./DGOption";
import DgSerial from "./DGSerial";
import DgPinVerification from "./DgPinVerification";
import toast from "react-hot-toast";
import useDGProvider from "./useDGProvider";
import { getSignBy } from "@/utils/utils";

type Props = {
    searchType: string
    title: string
    type: string
    onClose?: () => void
}

export const SearchStatusForm = ({onClose, type, title, searchType}: Props) => {
    const shopStore = useShopStore(state => state);
    const saleStore = useSaleStore(state => state);
    const invoiceStore = useEInvoiceStore();
    const [symbolTypeQuery, notiTypeQuery, appTypeQuery] = useFetchCommCode([CommonCode.SYMBOL_TYPE, CommonCode.NOTI_FEATURE, CommonCode.APP_TYPE])
    const [notiDtlId, setNotiDtlId] = useState<number | undefined>(undefined)
    const [isLoading, setLoading] = useState(false);
    const submitRef = useRef<HTMLButtonElement>(null)
    const [showRequestToChange, setShowRequestToChange] = React.useState<boolean>(false)
    const [reqData, setReqData] = React.useState<Invoice[]>([])
    const methods = useForm<any>({
        defaultValues: {
            page_number: 0,
            page_size: 10,
            // symbol_type: "M",
        }
    })
    const {
        reset,
        control,
        watch,
        setValue,
        getValues,
        register,
        handleSubmit,
        formState: {errors}
    } = methods;

    const {
        resolver,
        resolverSerial,
        issueXml,

        showHsmPopup,
        showHsmSerialPopup,
    } = useDGProvider();

    const [filter, setFilter] = useState<any>({})
    const {createERecord, handleIssueXml , isOpen, setIsOpen } = useCreateERecord()
    const dgStore = useDgStore()    
    const queryClient = useQueryClient();
    
    const symbolType = watch('symbol_type')

    const serialNoQuery = useQuery({
        queryKey: ['declaration', symbolType],
        queryFn: () => settingsService.getDeclarations(symbolType),
        enabled: !!symbolType,
    })

    const searchQuery = useQuery(['search-status', filter], {
        queryFn: async () => await noticeService.getStatusFilter(filter),
        enabled: Object.keys(filter).length > 0,
        keepPreviousData: true
    })

    const {status: invoices, pagination: paginationData} = searchQuery?.data || {}

    const table = useReactTable({
        data: invoices ?? [],
        columns: replaceColumns,
        getRowId: (p) => `${p.notice.sale_id}`, //selection
        getCoreRowModel: getCoreRowModel(),
        // enableSorting: true,
        manualPagination: true,
        // debugTable: true
    })

    useEffect(() => {
        table.resetRowSelection()
    }, [invoices, table]);

    useEffect(() => {
        reset({
           invoice_no: ''
        })
    }, [reset])

    async function onSubmit() {
        setValue('page_number', 0)
        const fetchDataOptions = {
            start_date: getValues('start_date'),
            end_date: getValues('end_date'),
            seller_shop_id: shopStore.id!,
            page_number: watch('page_number'),
            page_size: watch('page_size'),
            search_value: getValues('search_value'),
            invoice_no: getValues('invoice_no'),
            tax_id: getValues('tax_code'),
            symbol: getValues('symbol'),
            symbol_type: getValues('symbol_type'),
            status: type,
            search_type: searchType
        }

        setFilter(fetchDataOptions)
    }

    function handleClose() {
        searchQuery.remove()
        saleStore.setData([])
        saleStore.setIsOpen(false)
        if (onClose) {
            onClose()
        }
    }

    const [showPreview, setShowPreview] = React.useState(false)
    const [saleId, setSaleId] = React.useState<string | undefined>(undefined)
    const posInvoiceInfo = useQuery({
        queryKey: ["posInvoiceInfo", saleId],
        queryFn: () => salesService.getPosSalesById(+saleId!),
        enabled: showPreview && !!saleId,
    })

    const [toggleFilter, setToggleFilter] = useState(false);


    const requestIssue = useMutation({
        mutationFn: (data: any) => noticeService.sendERecord(data),
        onSuccess: () => {
            queryClient.invalidateQueries(["notices-status"])
            toast.dismiss()
            setLoading(false)
            setIsOpen(false)
            onClose && onClose()
        },
        onError: (error: any) => {
            toast.error(error?.message || 'An error occurred');
            setLoading(false)
            queryClient.invalidateQueries(['notices-status'])
        }
    })


    const handleOnSubmit = (data: any) => {
        setLoading(true)
        createERecord.mutate({
            ...data,
            noti_dtl_id: notiDtlId
        }, {
            onError: (err: any) => {
                toast.error(err?.message || "Something went wrong")
            },
            onSuccess: async (res: any) => {
                setLoading(false)
                if (data.type == ERecordType.SIGN_AND_SEND) {
                    dgStore.setType(HSMtype.CREATE_ERECORD)
                    const result = await showHsmPopup();
                    if (result.option == CERTIFICATE_TYPE.USB_TOKEN) {
                        await handleIssueXml(res[0])
                        onClose && onClose()
                    } else {
                        await showHsmSerialPopup();

                    }

                } else {
                    queryClient.invalidateQueries(["notices-status"])
                    toast.success("e-Record has been created")
                    setIsOpen(false)
                }
            }
        })
    }

    const titleCreate = type == InformType.ADJUST ? "Create Adjustment e-Record" : type == InformType.REPLACE ? "Create Replacement e-Record" : "Create Cancel e-Record"
    const titlePreview = type == InformType.ADJUST ? "Adjusted e-Invoice Preview" : type == InformType.REPLACE ? "Replaced e-Invoice Preview" : "Cancelled e-Invoice Preview"   

    return (
        <>
             {dgStore.type ==  HSMtype.CREATE_ERECORD && isOpen && <>
                {dgStore.showOption && <DgOption
                    onConfirm={(option) => {
                        resolver.current && resolver.current({option});
                    }}
                    onClose={() => dgStore.setShowOption(false)}
                />}

                {dgStore.showSerial && <DgSerial onConfirm={async (data) => {
                    resolverSerial.current && resolverSerial.current(data);
                }} onClose={() => dgStore.setShowSerial(false)}/>}

                {dgStore.showVerify && <DgPinVerification onVerify={async (pin) => {
                    const dgData = dgStore.data;
                    const reqIssue = {
                        pin: pin,
                        serial_no: dgData.serial_no,
                        username: dgData.user_nm,
                        password: dgData.user_pwd,
                        xml: createERecord.data?.map((x: any) => (
                            {
                                xml: x?.xml_data,
                                signature_path: x.signature_path,
                                sign_id: x?.sign_id,
                                req_key: x?.doc_no
                            }
                        ))
                    }

                    setLoading(true)
                    const result = await issueXml.mutateAsync(reqIssue)

                    if (result?.data) {
                        const [issueResult] = result?.data as any;

                        if (issueResult?.status == "FAILE") {
                            toast.error('An error occurred');
                            setLoading(false)
                            return;
                        }

                        dgStore.setShowVerify(false)

                        const reqBody: SendERecordReq = {
                            sign_by: getSignBy(issueResult.signed_xml),
                            noti_dtl_id: issueResult.req_key,
                            xml_data_signed: issueResult.signed_xml,
                        }

                        const issueReq = {
                            token_serial_number: dgData?.serial_no,
                            erecord_list: [reqBody]
                        }

                        requestIssue.mutate(issueReq)
                    }
                }} onClose={() => {
                    dgStore.setShowVerify(false)

                    setLoading(false)
                    queryClient.invalidateQueries(["notices-status"])
                    setIsOpen(false)
                    toast.dismiss()

                }}/>}
            </>}

            <Preview
                showIcons={true}
                invoiceInfo={posInvoiceInfo?.data}
                // data={selectedRows[0]}
                isOpen={showPreview}
                setIsOpen={setShowPreview}
                title={titlePreview}
            />

            {isOpen && <ERecordForm
                notiDtlId={notiDtlId!}
                isLoading={isLoading}
                title={titleCreate}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                onSubmit={data => handleOnSubmit(data)}
            />}

            <Modal show={!showRequestToChange}
                   className={"modal"}
                   dialogClassName={"modal-dialog modal-dialog-centered ks-wt-modal-xl-dialog"}
            >
                <div className="modal-content ks-wt-modal-content">
                    <div className="ks-wt-modal-header-container ks_d_inl_flex ks_jt_cont_betw ks_alg_itm_ctr">
                        <label>{title}</label>
                        <svg
                            onClick={handleClose}
                            data-bs-toggle="tooltip"
                            data-bs-title="close"
                            data-bs-dismiss="modal"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M4.81916 19.4822C4.42024 19.0926 4.42951 18.4061 4.81916 18.0257L10.5247 12.3109L4.81916 6.6053C4.42951 6.22492 4.42024 5.54768 4.81916 5.13948C5.21809 4.74055 5.89533 4.74983 6.28498 5.13948L11.9905 10.845L17.6961 5.13948C18.095 4.74983 18.7537 4.74983 19.1619 5.14875C19.5701 5.5384 19.5609 6.21565 19.1712 6.6053L13.4656 12.3109L19.1712 18.0257C19.5609 18.4154 19.5609 19.0833 19.1619 19.4822C18.763 19.8905 18.095 19.8812 17.6961 19.4915L11.9905 13.786L6.28498 19.4915C5.89533 19.8812 5.22737 19.8812 4.81916 19.4822Z"/>
                        </svg>
                    </div>
                    <div
                        id="ks_wt_modal_body_id"
                        className={cn("ks-wt-modal-body ks_d_flex ks_flex_col", {
                            "ks-wt-collapse": toggleFilter
                        })}
                    >
                        <div className=" ks_d_flex ks_flex_col ks_hide_scroll ks_pos_rlt"  style={{height: 500}}>
                            {/* begin--ks-wt-modal-body-left-side-wrapper-layout */}
                            <FormProvider {...methods} >
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="ks-wt-modal-body-left-side-wrapper-layout">
                                        <div className="ks-wt-modal-body-content-header ks_d_flex ks_jt_cont_betw ks_alg_itm_ctr">
                                            <label>Filter</label>
                                            <CustomTooltip placement={"top"} title={"toggle filter"}>
                                                <svg width={16} height={16} onClick={() => setToggleFilter(!toggleFilter)} className="ks_wth_16 ks_hgt_16" viewBox="0 0 16 16">
                                                    <path d="M2.60449 14.4092C1.20166 14.4092 0.452637 13.6729 0.452637 12.2827V4.57031C0.452637 3.18018 1.20166 2.4375 2.60449 2.4375H13.3892C14.792 2.4375 15.541 3.18018 15.541 4.57031V12.2827C15.541 13.6729 14.792 14.4092 13.3892 14.4092H2.60449ZM2.7251 13H5.65771V3.85303H2.7251C2.1665 3.85303 1.86816 4.13232 1.86816 4.71631V12.1304C1.86816 12.7144 2.1665 13 2.7251 13ZM13.2686 3.85303H6.97803V13H13.2686C13.8208 13 14.1255 12.7144 14.1255 12.1304V4.71631C14.1255 4.13232 13.8208 3.85303 13.2686 3.85303ZM4.39453 6.15723H3.1377C2.89014 6.15723 2.68066 5.94775 2.68066 5.71289C2.68066 5.47803 2.89014 5.2749 3.1377 5.2749H4.39453C4.64844 5.2749 4.85156 5.47803 4.85156 5.71289C4.85156 5.94775 4.64844 6.15723 4.39453 6.15723ZM4.39453 7.89648H3.1377C2.89014 7.89648 2.68066 7.69336 2.68066 7.45215C2.68066 7.21729 2.89014 7.01416 3.1377 7.01416H4.39453C4.64844 7.01416 4.85156 7.21729 4.85156 7.45215C4.85156 7.69336 4.64844 7.89648 4.39453 7.89648ZM4.39453 9.63574H3.1377C2.89014 9.63574 2.68066 9.43896 2.68066 9.19775C2.68066 8.96289 2.89014 8.75977 3.1377 8.75977H4.39453C4.64844 8.75977 4.85156 8.96289 4.85156 9.19775C4.85156 9.43896 4.64844 9.63574 4.39453 9.63574Z"></path>
                                                </svg>
                                            </CustomTooltip>
                                        </div>
                                        <div className="ks-wt-modal-lg-body-content pt-0">
                                            <div className="ks-wt-group-input-container ks_d_flex ks_alg_itm_ctr">
                                                <div
                                                    className="ks_w50 ks-wt-form-input-container-wrapper ks_d_flex ks_flex_col">
                                                    <label>
                                                        From <span>*</span>
                                                    </label>
                                                    <div className="ks-wt-form-input-container">
                                                        <input
                                                            defaultValue={dayjs().subtract(1, 'month').format('YYYY-MM-DD')}
                                                            type="date"
                                                            className="ks_form_calendar ks-wt-element-no-border ks-wt-element-left-border"
                                                            {...register('start_date')}
                                                        />
                                                    </div>
                                                </div>
                                                <div
                                                    className="ks_w50 ks-wt-form-input-container-wrapper ks_d_flex ks_flex_col">
                                                    <label>
                                                        To <span>*</span>
                                                    </label>
                                                    <div className="ks-wt-form-input-container">
                                                        <input
                                                            defaultValue={dayjs().format('YYYY-MM-DD')}
                                                            type="date"
                                                            className="ks_form_calendar ks-wt-element-right-border"
                                                            {...register('end_date')}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="ks-wt-form-input-container-wrapper ks_d_flex ks_flex_col">
                                                <label>Symbol Type</label>
                                                <div className="ks-wt-form-input-container">
                                                    <select className="ks_form_select"
                                                            {...register('symbol_type')}
                                                    >
                                                        <option value={''}>All</option>
                                                        {
                                                            symbolTypeQuery?.data?.codes.map((code) => (
                                                                <option key={code.code}
                                                                        value={code.code}>{code.code_en_nm}</option>
                                                            ))
                                                        }
                                                    </select>

                                                </div>
                                                <ErrorMessage message={errors?.symbol_type?.message as string}/>
                                            </div>
                                            <div className="ks-wt-form-input-container-wrapper ks_d_flex ks_flex_col">
                                                <label>Symbol</label>
                                                <div className="ks-wt-form-input-container">
                                                    <select className="ks_form_select"
                                                        {...register('symbol')}
                                                    >
                                                        <option value="">All Symbol</option>
                                                        {
                                                            serialNoQuery?.data?.declarations?.map((item) => (
                                                                <option key={item.serial_no}
                                                                        value={`${item.form_no}${item.serial_no}`}>{`${item.form_no}${item.serial_no}`}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="ks-wt-form-input-container-wrapper ks_d_flex ks_flex_col">
                                                <label>No.</label>
                                                <div className="ks-wt-form-input-container">

                                                    <Controller
                                                        name={`invoice_no`}
                                                        control={control}
                                                        render={({ field: {value, onChange, ref} }) => (
                                                            <NumericFormat
                                                                style={{fontSize: '1rem'}}
                                                                allowNegative={false}
                                                                className={cn('ks_form_input')}
                                                                placeholder={'Enter No.'}
                                                                value={value}
                                                                onChange={onChange}
                                                                getInputRef={ref}
                                                            />
                                                        )}
                                                    />

                                                </div>
                                            </div>
                                            <div className="ks-wt-form-input-container-wrapper ks_d_flex ks_flex_col">
                                                <label>Customer Name</label>
                                                <CompanyDropdown />
                                            </div>
                                            <button ref={submitRef} type={"submit"} className="ks_btn ks_btn_pm ks_mt_5">Search</button>
                                        </div>
                                    </div>

                            {/* end--ks-wt-modal-body-left-side-wrapper-layout */}
                            {/* begin--ks-wt-modal-body-main-wrapper-layout */}

                                </form>
                            </FormProvider>

                            <div className="ks-wt-modal-body-main-wrapper-layout ks_d_flex ks_flex_col ks_flex_row_fluid ks_scrollable">
                                <div className="ks-wt-modal-body-main-wrapper-header ks_d_flex justify-content-end ks_alg_itm_ctr">
                                    {/*<button className="ks_btn ks_btn_outl_icon_tiary"*/}
                                    {/*        onClick={handleRequestToChange}*/}
                                    {/*>*/}
                                    {/*    <svg viewBox="0 0 16 16">*/}
                                    {/*        <path*/}
                                    {/*            d="M3.72852 3.49219C4.79492 2.37891 6.32422 1.66406 8.00586 1.66406C11.1289 1.66406 13.7129 4.04883 14.0762 7.01367H14.9082C15.3887 7.01367 15.5117 7.38281 15.2305 7.77539L13.7656 9.81445C13.5371 10.1309 13.1797 10.1309 12.957 9.81445L11.4922 7.76953C11.2109 7.38281 11.3457 7.01367 11.8145 7.01367H12.7109C12.3711 4.76953 10.4199 3.00586 8.00586 3.00586C6.67578 3.00586 5.48047 3.55664 4.63086 4.43555C4.2793 4.74609 3.89258 4.70508 3.64648 4.44727C3.40625 4.20117 3.40039 3.79102 3.72852 3.49219ZM0.763672 7.76953L2.22852 5.73633C2.45703 5.41992 2.81445 5.41992 3.04297 5.73633L4.50195 7.77539C4.7832 8.16797 4.64844 8.53125 4.17969 8.53125H3.29492C3.63477 10.7754 5.58594 12.5391 8.00586 12.5391C9.33594 12.5391 10.5371 11.9883 11.3809 11.1035C11.7324 10.7988 12.1191 10.8281 12.3652 11.0918C12.5996 11.332 12.6055 11.748 12.2832 12.0527C11.2168 13.166 9.6875 13.8867 8.00586 13.8867C4.87695 13.8867 2.29297 11.4961 1.92969 8.53125H1.08594C0.611328 8.53125 0.482422 8.16211 0.763672 7.76953Z"/>*/}
                                    {/*    </svg>*/}
                                    {/*    Request to Change*/}
                                    {/*</button>*/}
                                    <input
                                        type="text"
                                        className="ks_form_input ks_form_search_input"
                                        placeholder="Search"
                                        maxLength={100}
                                        {...register('search_value')}
                                    />
                                </div>
                                <div className="ks_scrollable ks_h100">
                                    <DataTable table={table}
                                       // rowSticky={true}
                                        rowActions={(row) => {
                                            return <>
                                                {
                                                    searchType == SearchType.STATUS ? (
                                                        <div className="ks_d_flex ks_alg_itm_ctr">
                                                            <div className="ks-wt-tbl-data-act-container ks_d_flex ks_alg_itm_ctr">
                                                                <button
                                                                    // disabled={deleteNotices.isLoading}
                                                                    data-bs-toggle="tooltip"
                                                                    data-bs-title="Remove data"
                                                                    className="ks_btn ks_btn_outl_icon_tiary"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        setSaleId(row.original.notice.sale_id + "")
                                                                        setShowPreview(true)
                                                                    }}
                                                                >
                                                                    <svg viewBox="0 0 22 22">
                                                                        <path
                                                                            d="M11 16.895C5.87109 16.895 2.3418 12.7119 2.3418 11.4297C2.3418 10.1411 5.87744 5.95801 11 5.95801C16.186 5.95801 19.6519 10.1411 19.6519 11.4297C19.6519 12.7119 16.1924 16.895 11 16.895ZM11 14.8511C12.8979 14.8511 14.4404 13.2896 14.4404 11.4297C14.4404 9.51904 12.8979 8.0083 11 8.0083C9.08936 8.0083 7.55957 9.51904 7.55957 11.4297C7.55957 13.2896 9.08936 14.8511 11 14.8511ZM11 12.731C10.2764 12.731 9.68604 12.1406 9.68604 11.4297C9.68604 10.7124 10.2764 10.1221 11 10.1221C11.7173 10.1221 12.314 10.7124 12.314 11.4297C12.314 12.1406 11.7173 12.731 11 12.731Z"/>
                                                                    </svg>

                                                                </button>
                                                                <button
                                                                    // disabled={deleteNotices.isLoading}
                                                                    data-bs-toggle="tooltip"
                                                                    data-bs-title="Remove data"
                                                                    className="ks_btn ks_btn_outl_icon_tiary"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        //@ts-ignore
                                                                        invoiceStore.setData({
                                                                            sale_id: row.original.notice.sale_id
                                                                        })

                                                                        invoiceStore.setIsNew(true)
                                                                        invoiceStore.openCreate();
                                                                    }}
                                                                >
                                                                    <svg viewBox="0 0 16 16">
                                                                        <path
                                                                            d="M3.72852 3.49219C4.79492 2.37891 6.32422 1.66406 8.00586 1.66406C11.1289 1.66406 13.7129 4.04883 14.0762 7.01367H14.9082C15.3887 7.01367 15.5117 7.38281 15.2305 7.77539L13.7656 9.81445C13.5371 10.1309 13.1797 10.1309 12.957 9.81445L11.4922 7.76953C11.2109 7.38281 11.3457 7.01367 11.8145 7.01367H12.7109C12.3711 4.76953 10.4199 3.00586 8.00586 3.00586C6.67578 3.00586 5.48047 3.55664 4.63086 4.43555C4.2793 4.74609 3.89258 4.70508 3.64648 4.44727C3.40625 4.20117 3.40039 3.79102 3.72852 3.49219ZM0.763672 7.76953L2.22852 5.73633C2.45703 5.41992 2.81445 5.41992 3.04297 5.73633L4.50195 7.77539C4.7832 8.16797 4.64844 8.53125 4.17969 8.53125H3.29492C3.63477 10.7754 5.58594 12.5391 8.00586 12.5391C9.33594 12.5391 10.5371 11.9883 11.3809 11.1035C11.7324 10.7988 12.1191 10.8281 12.3652 11.0918C12.5996 11.332 12.6055 11.748 12.2832 12.0527C11.2168 13.166 9.6875 13.8867 8.00586 13.8867C4.87695 13.8867 2.29297 11.4961 1.92969 8.53125H1.08594C0.611328 8.53125 0.482422 8.16211 0.763672 7.76953Z"
                                                                        />
                                                                    </svg>
                                                                </button>

                                                            </div>
                                                        </div>
                                                    ): (
                                                        <div className="ks_d_flex ks_alg_itm_ctr">
                                                            <div className="ks-wt-tbl-data-act-container ks_d_flex ks_alg_itm_ctr">
                                                                <button
                                                                    // disabled={deleteNotices.isLoading}
                                                                    data-bs-toggle="tooltip"
                                                                    data-bs-title="Remove data"
                                                                    className="ks_btn ks_btn_outl_icon_tiary"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        setSaleId(row.original.notice.sale_id + "")
                                                                        setShowPreview(true)
                                                                    }}
                                                                >
                                                                    <svg viewBox="0 0 22 22">
                                                                        <path
                                                                            d="M11 16.895C5.87109 16.895 2.3418 12.7119 2.3418 11.4297C2.3418 10.1411 5.87744 5.95801 11 5.95801C16.186 5.95801 19.6519 10.1411 19.6519 11.4297C19.6519 12.7119 16.1924 16.895 11 16.895ZM11 14.8511C12.8979 14.8511 14.4404 13.2896 14.4404 11.4297C14.4404 9.51904 12.8979 8.0083 11 8.0083C9.08936 8.0083 7.55957 9.51904 7.55957 11.4297C7.55957 13.2896 9.08936 14.8511 11 14.8511ZM11 12.731C10.2764 12.731 9.68604 12.1406 9.68604 11.4297C9.68604 10.7124 10.2764 10.1221 11 10.1221C11.7173 10.1221 12.314 10.7124 12.314 11.4297C12.314 12.1406 11.7173 12.731 11 12.731Z"/>
                                                                    </svg>

                                                                </button>
                                                                <button
                                                                    // disabled={deleteNotices.isLoading}
                                                                    data-bs-toggle="tooltip"
                                                                    data-bs-title="Remove data"
                                                                    className="ks_btn ks_btn_outl_icon_tiary"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        setNotiDtlId(row.original.notice.noti_dtl_id)
                                                                        setIsOpen(true)
                                                                    }}
                                                                >
                                                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h10v-2H4v-6h18V6c0-1.11-.89-2-2-2zm0 4H4V6h16v2zm4 9v2h-3v3h-2v-3h-3v-2h3v-3h2v3h3z"></path></svg>
                                                                </button>

                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </>
                                        }}
                                    />
                                </div>
                                <PaginationSetting
                                    data={paginationData!}
                                    page={async (page_number, page_size) => {
                                        setValue('page_number', page_number, {shouldValidate: true})
                                        setValue('page_size', page_size, {shouldValidate: true})

                                        setFilter({
                                            ...filter,
                                            page_number,
                                            page_size
                                        })
                                    }}
                                    rowSelected={table.getSelectedRowModel().flatRows.length}
                                />
                            </div>
                            {/* end--ks-wt-modal-body-main-wrapper-layout */}
                        </div>
                        <div className="ks-wt-modal-footer ks_d_flex ks_jt_cont_end ks_alg_itm_ctr">
                            <div className="ks-wt-element-group-container ks_d_flex ks_alg_itm_ctr">
                                <button data-bs-dismiss="modal" className="ks_btn ks_btn_tiary" onClick={() => {
                                    if(saleStore.data.length == 0){
                                        handleClose()
                                        return;
                                    }

                                    setShowRequestToChange(true)
                                }}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

        </>
    );
};
