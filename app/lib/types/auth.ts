export interface AuthRequest {
    user_id: string;
    password: string;
}

export interface SignupRequest {
    tax_id: string
    business_name: string
    representative_name: string
    address: string,
    city_code: string
    national_code: string
    fullname: string,
    email: string
    phonenumber: string
    user_id: string
    password: string
}

export interface SendOtpRequest {
    phonenumber: string;
}

export interface SendOptResponse {
    security_key: string;
    lifetime: number;
}

export interface VerifyOtpRequest {
    security_key: string;
    security_code: string;
    phonenumber: string;
}

export interface ForgotUserIDByPhonenumberResponse {
    users_info: UsersInfo[];
}

export interface UsersInfo {
    user_id: string;
}

