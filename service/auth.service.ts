import { AuthRequest, ForgotUserIDByPhonenumberResponse, SendOptResponse, SendOtpRequest, SignupRequest, VerifyOtpRequest } from "@/app/lib/types/auth";
import { http } from "@/utils/http";

const ServiceId = {
    LOGIN: '/api/wtx/ca/v1/auth/login',
    SIGNUP: '/api/wtx/ca/v1/auth/signup',
    AUTH: '/api/wtx/ca/v1/auth',
    SEND_OTP: '/api/wtx/v1/otps/send',
    VERIFY_OTP: '/api/wtx/v1/otps/verify',
    FORGOT_PASSWORD: '/api/wtx/ca/v1/auth/forgot-password',
    FORGOT_USER_ID: '/api/wtx/ca/v1/auth/forgot-id',

}

const login = (data: AuthRequest) => {
    return http.post(ServiceId.LOGIN, data)
}

const signup = (data: SignupRequest) => {
    return http.post(ServiceId.SIGNUP, data)
}


const checkTaxId = (taxId: string) => {
    const API = ServiceId.AUTH + `/company/${taxId}/check-exist-taxid`
    return http.get(API).then(res => res?.data).catch(err => err)
}
const checkUserxId = (userId: string) => {
    const API = ServiceId.AUTH + `/company/${userId}/check-exist-userid`
    return http.get(API).then(res => res?.data)
}

const sendOtp = async (data: SendOtpRequest): Promise<SendOptResponse> => {
    const result = await http.post(ServiceId.SEND_OTP, data)
    return result?.data?.data;
}

const verifyOtp = async (data: VerifyOtpRequest) => {
    const result = await http.post(ServiceId.VERIFY_OTP, data)
    return result?.data?.data
}

function forgotPasswordByEmail(requestBody: any) {
    return http.patch(ServiceId.FORGOT_PASSWORD + `/by-email`,requestBody)
}

function forgotPasswordByPhonenumber(requestBody: any) {
    return http.patch(ServiceId.FORGOT_PASSWORD + `/by-phone`,requestBody).then(res => res?.data?.data)
}

function forgotUserIDByEmail(requestBody: any) {
    return http.patch(ServiceId.FORGOT_USER_ID + `/by-email`,requestBody)
}

function forgotUserIDByPhonenumber(requestBody: any) : Promise<ForgotUserIDByPhonenumberResponse> {
    return http.patch(ServiceId.FORGOT_USER_ID + `/by-phone`,requestBody).then(res => res?.data?.data)
}

function resetPassword(reqBody: any) {
    return http.patch(ServiceId.FORGOT_PASSWORD + `/reset-password`,reqBody)
}


export const authService = {
    login,
    signup,
    checkTaxId,
    checkUserxId,
    sendOtp,
    verifyOtp,
    forgotPasswordByEmail,
    forgotPasswordByPhonenumber,
    forgotUserIDByEmail,
    forgotUserIDByPhonenumber,
    resetPassword
}

export default authService;