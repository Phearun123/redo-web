"use client"
import {useForgotUserIDStore, useLoginStore} from "@/app/lib/store/store";
import {useRouter, useSearchParams} from "next/navigation";
import React, {useReducer, useState} from "react";
import toast from "react-hot-toast";
import {signIn} from "next-auth/react";
import cn from "clsx";
import ErrorSvg from "@/app/components/icons/ErrorSvg";
import Link from "next/link";

function LoginForm() {
    const { openHeader, setOpenHeader, setTitle } = useForgotUserIDStore(state => state)
    const { userId, setUserId } = useLoginStore();
    const router = useRouter()
    const searchParams = useSearchParams()
    const [showPassword, setShowPassword] = useState(false);
    const allowSignUp = process.env.DISABLE_REDO_SIGNUP === 'false'

    const [loginRequest, dispatch] = useReducer((state: any, action: any) => {
        return { ...state, ...action}
    }, {
        userId: userId || '',
        password: '',
        loginError: '',
        userIdError: false,
        passwordError: false,
        submitting: false
    })

    function checkError(result: any) {
        if (result?.error == "User not found") {
            dispatch({ loginError: result?.error! })
            dispatch({ userIdError: true, passwordError: false })
            return;
        }
        else if (result?.error == "Password is incorrect") {
            dispatch({ loginError: result.error! })
            dispatch({ userIdError: false, passwordError: true })
            return;
        }
        else {
            dispatch({ loginError: result?.error! })
            return;
        }
    }

    async function handleClick(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (loginRequest.submitting) return;
        dispatch({ submitting: true })
        const toastId = toast.loading('Logging...')
        try {
            const url = new URL(searchParams.get('callbackUrl') || '/sale/e-invoice', location.href)
            url.searchParams.delete('start_date')
            url.searchParams.delete('end_date')
            const result = await signIn("credentials", {
                user_id: loginRequest.userId,
                password: loginRequest.password,
                callbackUrl: url.toString(),
                redirect: false,
            })

            checkError(result);
            if (result?.ok) {
                router.push(result?.url!)
                return;
            }

            toast.error( result?.error || 'Login failed')
        } catch (e) {
            console.log('error', e)
        }
        finally {
            toast.dismiss(toastId)
            dispatch({ submitting: false })
        }
    }

    function handleChange(e: any) {
        dispatch({ loginError: '' })
        dispatch({ [e.target.name]: e.target.value })
        dispatch({ [e.target.name + "Error"]: false })
    }


    return (
        <div className="d-flex flex-column ks-wt-mt-150">
            <div className="ks-wt-form-sub-container custom-login">
                <form className="ks_w100 ks_mt15" onSubmit={handleClick} method="post">
                    <div className="ks-wt-form-sub-container-dialog">
                        <label className="ks-wt-form-sub-contianer-title">WeTAX</label>
                        <div className="ks-wt-form-input-sub-container ks_d_flex ks_flex_col">
                            <div className="ks-wt-form-input-container-wrapper ks_d_flex ks_flex_col">
                                <label>User ID</label>
                                <div className="ks-wt-form-input-container">
                                    <svg className="ks-wt-form-icon-input-svg" viewBox="0 0 16 16">
                                        <path
                                            d="M4.02002 14.0981C3.67301 14.0981 3.40218 14.0199 3.20752 13.8633C3.01286 13.7109 2.91553 13.4993 2.91553 13.2285C2.91553 12.8434 3.03402 12.4393 3.271 12.0161C3.50798 11.5887 3.84652 11.1909 4.28662 10.8228C4.73096 10.4504 5.26628 10.1478 5.89258 9.91504C6.51888 9.68229 7.22135 9.56592 8 9.56592C8.77865 9.56592 9.479 9.68229 10.1011 9.91504C10.7274 10.1478 11.2627 10.4504 11.707 10.8228C12.1514 11.1909 12.4899 11.5887 12.7227 12.0161C12.9596 12.4393 13.0781 12.8434 13.0781 13.2285C13.0781 13.4993 12.9808 13.7109 12.7861 13.8633C12.5915 14.0199 12.3228 14.0981 11.98 14.0981H4.02002ZM8 8.51221C7.5599 8.51221 7.15576 8.39372 6.7876 8.15674C6.41943 7.91553 6.12533 7.59391 5.90527 7.19189C5.68522 6.78988 5.5752 6.33919 5.5752 5.83984C5.5752 5.35319 5.68522 4.91309 5.90527 4.51953C6.12533 4.12174 6.41943 3.80648 6.7876 3.57373C7.15999 3.34098 7.56413 3.22461 8 3.22461C8.4401 3.22461 8.84424 3.34098 9.2124 3.57373C9.58057 3.80225 9.87467 4.11328 10.0947 4.50684C10.319 4.90039 10.4312 5.34049 10.4312 5.82715C10.4312 6.33073 10.319 6.78564 10.0947 7.19189C9.87467 7.59391 9.58057 7.91553 9.2124 8.15674C8.84424 8.39372 8.4401 8.51221 8 8.51221Z"/>
                                    </svg>
                                    <input className={cn("ks_form_input ks_form_icon_input")}
                                           onChange={handleChange}
                                           required
                                           value={loginRequest.userId}
                                           type="email"
                                           name="userId"
                                           placeholder="Example@mail.com"
                                           maxLength={150}/>

                                </div>
                                {loginRequest.userIdError && <ErrorSvg message={(loginRequest.loginError)}/>}

                            </div>
                            <div className="ks-wt-form-input-container-wrapper ks_d_flex ks_flex_col">
                                <label>Password</label>
                                <div className="ks-wt-form-input-container">
                                    <svg className="ks-wt-form-icon-input-svg" viewBox="0 0 16 16">
                                        <path
                                            d="M5.15625 14.5298C4.69499 14.5298 4.34587 14.4049 4.10889 14.1553C3.87191 13.9098 3.75342 13.5374 3.75342 13.0381V8.73438C3.75342 8.23926 3.87191 7.86898 4.10889 7.62354C4.34587 7.37386 4.69499 7.24902 5.15625 7.24902H10.8374C11.3029 7.24902 11.6541 7.37386 11.8911 7.62354C12.1281 7.86898 12.2466 8.23926 12.2466 8.73438V13.0381C12.2466 13.5374 12.1281 13.9098 11.8911 14.1553C11.6541 14.4049 11.3029 14.5298 10.8374 14.5298H5.15625ZM4.87695 7.76953V5.85254C4.87695 5.12044 5.02083 4.50472 5.30859 4.00537C5.59635 3.50602 5.97721 3.12939 6.45117 2.87549C6.92936 2.61735 7.44564 2.48828 8 2.48828C8.55436 2.48828 9.06852 2.61735 9.54248 2.87549C10.0207 3.12939 10.4036 3.50602 10.6914 4.00537C10.9834 4.50472 11.1294 5.12044 11.1294 5.85254V7.76953H9.92969V5.75098C9.92969 5.30241 9.84082 4.92155 9.66309 4.6084C9.48958 4.29102 9.25684 4.05192 8.96484 3.89111C8.67285 3.72607 8.35124 3.64355 8 3.64355C7.64876 3.64355 7.32715 3.72607 7.03516 3.89111C6.74316 4.05192 6.5083 4.29102 6.33057 4.6084C6.15706 4.92155 6.07031 5.30241 6.07031 5.75098V7.76953H4.87695Z"/>
                                    </svg>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className={cn("ks_form_input ks_form_icon_input_password")}
                                        placeholder="Password"
                                        maxLength={50}
                                        onChange={handleChange}
                                        required
                                        value={loginRequest.password}
                                        name="password"
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
                                {loginRequest.passwordError && <ErrorSvg message={(loginRequest.loginError)}/>}
                            </div>
                            <div id="ks_wt_remember_forgot_password_block"
                                 className="ks_d_flex ks_jt_cont_betw ks_alg_itm_ctr">
                                <Link href={"/forgot-user-id"} onClick={() => {
                                    setUserId("");
                                    setTitle("Recover forgotten ID or password");
                                    setOpenHeader(false)
                                }}>
                                    <label className="ks-wt-link">Forgot ID or Password</label>
                                </Link>
                            </div>
                        </div>

                        <button className="ks_btn ks_btn_pm" type="submit">
                            {loginRequest.submitting ? 'Loading...' : 'Login'}
                        </button>
                        {!allowSignUp &&
                            <>
                                <div
                                    className="ks-wt-form-input-watermark-container ks_d_flex ks_jt_cont_betw ks_alg_itm_ctr">
                                    <div className="ks-wt-line ks_w100"/>
                                    <label>Don&#39;t have account?</label>
                                    <div className="ks-wt-line ks_w100"/>
                                </div>
                                <Link href={"/signup"} onClick={() => setUserId("")}>
                                    <button className="ks_btn ks_btn_tiary ks_w100" type="button">
                                        <label style={{color: "#333", cursor: "pointer"}}>Create an account for
                                            free</label>
                                    </button>
                                </Link>

                            </>
                        }

                    </div>
                </form>
            </div>
        </div>

    );
}

export default LoginForm;