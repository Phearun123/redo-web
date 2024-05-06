"use client"
import cn from "clsx";
import { useState } from 'react';
import { Modal } from "react-bootstrap";
import { Simulate } from "react-dom/test-utils";
import { useForm } from "react-hook-form";
import error = Simulate.error;

type Props = {
    onClose: () => void;
    onVerify: (pin: string) => void;
    isLoading?: boolean
}

type Inputs = {
    pin: string;
}

const DgPinVerification = ({onClose, onVerify, isLoading}: Props) => {
    const [showPassword, setShowPassword] = useState(false);

    const {
        register: registerPin,
        handleSubmit:handleSubmitPin,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>()

    const onSubmitPin = async (data: Inputs) => {
         await onVerify(data.pin)
    }

    return (
        <>
            <Modal show={true} dialogClassName={"modal-dialog modal-dialog-centered ks-wt-modal-xs-dialog"}>
                <div className="modal-content ks-wt-modal-content">
                    <div
                        className="ks-wt-modal-header-container ks_d_inl_flex ks_jt_cont_betw ks_alg_itm_ctr"
                    >
                        <label>Verify HSM PIN</label>
                        <svg
                            onClick={onClose}
                            data-bs-toggle="tooltip"
                            data-bs-title="close"
                            data-bs-dismiss="modal"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M4.81916 19.4822C4.42024 19.0926 4.42951 18.4061 4.81916 18.0257L10.5247 12.3109L4.81916 6.6053C4.42951 6.22492 4.42024 5.54768 4.81916 5.13948C5.21809 4.74055 5.89533 4.74983 6.28498 5.13948L11.9905 10.845L17.6961 5.13948C18.095 4.74983 18.7537 4.74983 19.1619 5.14875C19.5701 5.5384 19.5609 6.21565 19.1712 6.6053L13.4656 12.3109L19.1712 18.0257C19.5609 18.4154 19.5609 19.0833 19.1619 19.4822C18.763 19.8905 18.095 19.8812 17.6961 19.4915L11.9905 13.786L6.28498 19.4915C5.89533 19.8812 5.22737 19.8812 4.81916 19.4822Z"
                            ></path>
                        </svg>
                    </div>
                    <form onSubmit={handleSubmitPin(onSubmitPin)}>
                        <fieldset>
                            <div className="ks-wt-modal-body ks_d_flex ks_flex_col">
                                <div className="ks-wt-modal-body-content-item d-flex flex-column">
                                    <div
                                        className="ks-wt-form-input-container-wrapper d-flex flex-column"
                                    >
                                        <label>PIN <span>*</span></label>
                                        <div className="ks-wt-form-input-container">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="ks_form_input"
                                                placeholder="Enter HSM PIN"
                                                {...registerPin("pin", {required: 'Pin is required'}) }
                                            />
                                            {
                                                showPassword ?
                                                    <div className="ks-wt-form-input-svg-container">
                                                        <svg onClick={() => setShowPassword(!showPassword)}
                                                            className="ks-wt-eye-hide-svg ks_mt_2" viewBox="0 0 16 16">
                                                            <path
                                                                d="M8 12.8262C3.26562 12.8262 0.0078125 8.96484 0.0078125 7.78125C0.0078125 6.5918 3.27148 2.73047 8 2.73047C12.7871 2.73047 15.9863 6.5918 15.9863 7.78125C15.9863 8.96484 12.793 12.8262 8 12.8262ZM8 10.9395C9.75195 10.9395 11.1758 9.49805 11.1758 7.78125C11.1758 6.01758 9.75195 4.62305 8 4.62305C6.23633 4.62305 4.82422 6.01758 4.82422 7.78125C4.82422 9.49805 6.23633 10.9395 8 10.9395ZM8 8.98242C7.33203 8.98242 6.78711 8.4375 6.78711 7.78125C6.78711 7.11914 7.33203 6.57422 8 6.57422C8.66211 6.57422 9.21289 7.11914 9.21289 7.78125C9.21289 8.4375 8.66211 8.98242 8 8.98242Z"/>
                                                        </svg>
                                                    </div>
                                                    :
                                                    <div className="ks-wt-form-input-svg-container">
                                                        <svg onClick={() => setShowPassword(!showPassword)}
                                                            className="ks-wt-eye-hide-svg" viewBox="0 0 16 16">
                                                            <path
                                                                d="M8 13.7996C7.22689 13.7996 6.49447 13.706 5.80273 13.5188C5.11507 13.3316 4.47827 13.0854 3.89233 12.7803C3.31047 12.471 2.7876 12.1313 2.32373 11.761C1.86393 11.3907 1.46924 11.0184 1.13965 10.644C0.814128 10.2697 0.563883 9.92383 0.388916 9.60645C0.218018 9.28906 0.132568 9.03271 0.132568 8.8374C0.132568 8.60954 0.248535 8.30233 0.480469 7.91577C0.712402 7.52515 1.04403 7.10807 1.47534 6.66455C1.90666 6.22103 2.41935 5.80802 3.01343 5.42554L5.13745 7.55566C5.04386 7.75098 4.97266 7.95646 4.92383 8.17212C4.875 8.38778 4.85059 8.61157 4.85059 8.84351C4.85465 9.4091 4.99707 9.92993 5.27783 10.406C5.56266 10.878 5.94108 11.2564 6.41309 11.5413C6.88916 11.8261 7.41813 11.9685 8 11.9685C8.22786 11.9685 8.44759 11.9441 8.65918 11.8953C8.87484 11.8464 9.07829 11.7773 9.26953 11.6877L10.887 13.3052C10.4556 13.4598 9.99788 13.5798 9.51367 13.6653C9.02946 13.7548 8.5249 13.7996 8 13.7996ZM13.1208 12.1821L10.9175 9.96655C10.9948 9.79159 11.0518 9.61051 11.0884 9.42334C11.1291 9.23617 11.1494 9.04289 11.1494 8.84351C11.1494 8.26164 11.007 7.7347 10.7222 7.2627C10.4414 6.78662 10.061 6.41024 9.58081 6.13354C9.10474 5.85278 8.5778 5.7124 8 5.7124C7.80062 5.7124 7.60734 5.73071 7.42017 5.76733C7.23299 5.80396 7.05192 5.85685 6.87695 5.92603L5.26562 4.3208C5.68473 4.17839 6.12215 4.07056 6.57788 3.99731C7.03361 3.92 7.50765 3.88135 8 3.88135C8.78532 3.88135 9.52181 3.97493 10.2095 4.16211C10.9012 4.34928 11.538 4.59749 12.1199 4.90674C12.7058 5.21191 13.2287 5.54964 13.6885 5.91992C14.1523 6.2902 14.545 6.66252 14.8665 7.03687C15.1879 7.41121 15.4341 7.75708 15.605 8.07446C15.7759 8.38778 15.8613 8.64209 15.8613 8.8374C15.8613 9.06527 15.7494 9.37044 15.5256 9.75293C15.3018 10.1313 14.9845 10.5362 14.5735 10.9675C14.1625 11.3988 13.6783 11.8037 13.1208 12.1821ZM6.13232 8.75806C6.13232 8.7255 6.13436 8.69295 6.13843 8.6604C6.1425 8.62785 6.14453 8.5953 6.14453 8.56274L8.15869 10.5769C8.12614 10.581 8.09562 10.583 8.06714 10.583C8.03866 10.583 8.00814 10.583 7.97559 10.583C7.63786 10.583 7.32861 10.5016 7.04785 10.3389C6.77116 10.1761 6.5494 9.95638 6.38257 9.67969C6.21574 9.39893 6.13232 9.09172 6.13232 8.75806ZM9.85547 8.72144C9.85547 8.74992 9.85343 8.7784 9.84937 8.80688C9.84937 8.83537 9.84733 8.86385 9.84326 8.89233L7.85352 6.90259C7.882 6.89852 7.91048 6.89648 7.93896 6.89648C7.96745 6.89648 7.99593 6.89648 8.02441 6.89648C8.36214 6.89648 8.66935 6.97786 8.94604 7.14062C9.22274 7.30339 9.44246 7.52311 9.60522 7.7998C9.77205 8.0765 9.85547 8.38371 9.85547 8.72144ZM12.5776 13.9766L2.73877 4.1499C2.64925 4.06038 2.60449 3.95052 2.60449 3.82031C2.60449 3.6901 2.64925 3.58024 2.73877 3.49072C2.82829 3.4012 2.93815 3.35645 3.06836 3.35645C3.19857 3.35645 3.31047 3.4012 3.40405 3.49072L13.2368 13.3174C13.3263 13.4069 13.3711 13.5147 13.3711 13.6409C13.3752 13.767 13.3304 13.8789 13.2368 13.9766C13.1432 14.0701 13.0313 14.1149 12.9011 14.1108C12.775 14.1108 12.6672 14.0661 12.5776 13.9766Z"/>
                                                        </svg>
                                                    </div>
                                            }
                                        </div>
                                        {errors?.pin && <span className="ks-wt-form-input-error error">This field is required</span>}
                                    </div>
                                </div>
                            </div>
                            <div
                                className="ks-wt-modal-footer ks_d_flex ks_jt_cont_end ks_alg_itm_ctr"
                            >
                                <div className="ks-wt-element-group-container ks_d_flex ks_alg_itm_ctr">
                                    <button type={"submit"} name={"verify"} className={cn("ks_btn ks_btn_pm",{
                                        "ks-wt-disabled": isLoading
                                    })}>
                                        { isLoading ? 'Loading...' : 'Okay'}
                                    </button>
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </Modal>
        </>
    );
};

export default DgPinVerification;