import { useDgStore } from "@/app/lib/store";
import { CERTIFICATE_TYPE } from "@/utils/enum";
import { useState } from 'react';
import { Modal } from "react-bootstrap";

type Props = {
    onClose: () => void;
    onConfirm: (selectedOption: string) => void;
}

const DgOption = ({onConfirm, onClose}: Props) => {
    const [selectedOption, setSelectedOption] = useState("1");

    return (
        <>
            <Modal show={true} dialogClassName={"modal-dialog modal-dialog-centered ks-wt-modal-xs-dialog"}>
                <div className="modal-content ks-wt-modal-content">
                    <div className="ks-wt-modal-header-container ks_d_inl_flex ks_jt_cont_betw ks_alg_itm_ctr">
                        <label>Digital Signature</label>
                        <svg
                            onClick={onClose}
                        >
                            <path d="M4.81916 19.4822C4.42024 19.0926 4.42951 18.4061 4.81916 18.0257L10.5247 12.3109L4.81916 6.6053C4.42951 6.22492 4.42024 5.54768 4.81916 5.13948C5.21809 4.74055 5.89533 4.74983 6.28498 5.13948L11.9905 10.845L17.6961 5.13948C18.095 4.74983 18.7537 4.74983 19.1619 5.14875C19.5701 5.5384 19.5609 6.21565 19.1712 6.6053L13.4656 12.3109L19.1712 18.0257C19.5609 18.4154 19.5609 19.0833 19.1619 19.4822C18.763 19.8905 18.095 19.8812 17.6961 19.4915L11.9905 13.786L6.28498 19.4915C5.89533 19.8812 5.22737 19.8812 4.81916 19.4822Z" />
                        </svg>
                    </div>
                    <div className="ks-wt-modal-body ks_d_flex ks_flex_col">
                        <div className="ks-wt-modal-body-content-item ks_d_flex ks_flex_col">
                            <div className="d-flex align-items-center ks_gap_12rem">
                                <input
                                    defaultChecked={true}
                                    value={CERTIFICATE_TYPE.USB_TOKEN}
                                    type="radio"
                                    name="digital_signature_type"
                                    id="1"
                                    onChange={(e) => setSelectedOption(e.target.value)}
                                />
                                <label className="fw-medium" htmlFor="1">
                                    USB TOKEN
                                </label>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center ks_gap_12rem">
                                    <input
                                        value={CERTIFICATE_TYPE.HSM}
                                        type="radio"
                                        name="digital_signature_type"
                                        id="2"
                                        onChange={(e) => setSelectedOption(e.target.value)}
                                    />
                                    <label className="fw-medium" htmlFor="2">
                                        HSM
                                    </label>
                                </div>
                                <label className="fw-medium ks-wt-sec-clr">
                                    Softdreams HSM Digital
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="ks-wt-modal-footer d-flex justify-content-end align-items-center">
                        <div className="ks-wt-element-group-container d-flex align-items-center">
                            <button type={"button"} onClick={onClose} className="ks_btn ks_btn_tiary">Cancel</button>
                            <button
                                type={"button"}
                                className="ks_btn ks_btn_pm"
                                onClick={() => onConfirm(selectedOption)}
                            >
                                Issue
                            </button>
                        </div>
                    </div>
                </div>

            </Modal>
        </>
    );
};

export default DgOption;