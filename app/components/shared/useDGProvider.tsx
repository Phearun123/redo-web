import { useDgStore } from "@/app/lib/store";
import { EInvoiceRequest, IssueDraftPosReq } from "@/app/lib/types/sales";
import digitalSignatureService from "@/service/digitalsignature.service";
import hsmService from "@/service/hsm.service";
import { salesService } from "@/service/sales.service";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import toast from "react-hot-toast";

type SubmitReq = EInvoiceRequest & {submitType: string}

const useDGProvider = () => {
    const dgStore = useDgStore();

    const resolver = useRef<any>();
    const resolverSerial = useRef<any>();

    const generateXml = useMutation({
        mutationKey: ["generateXml"],
        mutationFn: (data: SubmitReq) => salesService.generateEInvoiceXml(data),
        onMutate: () => {
            // toast.loading("Loading...");
        },

    })

    const generateXmlDraftInv = useMutation({
        mutationKey: ["iss-draft-invoice"],
        // onMutate: () => setLoading(true),
        mutationFn: (data: IssueDraftPosReq) => salesService.issueDraftInvoice(data)
    })


    const saveDraft = useMutation({
        mutationFn: (data: SubmitReq) => salesService.createDraftEInvoice(data),
        onMutate: () => {
            toast.loading("Loading...");
        }
    })

    const dgCheckSkip = useMutation({
        mutationKey: ["dgCheckSkip"],
        mutationFn: () => digitalSignatureService.dgCheckSkip(),
        onError: (error: any) => {
            toast.error(error?.message || 'An error occurred. Please try again later.')
        }
    })

    const issueXml = useMutation({
        // mutationKey: ["issueXml"],
        mutationFn: (payload: any) => hsmService.getIssueXml(payload),
        onError: (error: any) => {
            toast.error(error?.message || 'An error occurred. Please try again later.')
        },

    })

    const showHsmPopup = async () => {
        const resp = await dgCheckSkip.mutateAsync();
        if(resp.skip){
            return {option: resp.type}
        }
    
        dgStore.setShowOption(true);

        const result = await new Promise<{option: string}>(function (resolve) {
            resolver.current = resolve;
        });

        dgStore.setShowOption(false)

        return result;
    };

    const showHsmSerialPopup = () => {
        dgStore.setShowSerial(true);

        return new Promise<any>(function (resolve) {
            resolverSerial.current = resolve;
        });
    }

    const handleSelectOption = (option: string) => {
        resolver.current && resolver.current({option});
    };

    return {
        resolver,
        resolverSerial,

        generateXml,
        generateXmlDraftInv,
        saveDraft,
        issueXml,

        showHsmPopup,
        showHsmSerialPopup,
        handleSelectOption
    }
};

export default useDGProvider;