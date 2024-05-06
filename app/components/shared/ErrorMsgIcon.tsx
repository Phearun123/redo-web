import Image from 'next/image'
import React from 'react'
import errorImage from '@/public/Custom-Size-–-1_1.svg'

const ErrorMsgIcon = ({ message }: { message: string }) => {
    return (
        <>
            {
                message &&
                <div className='ks_d_flex ks_alg_itm_ctr ks_gap_6rem'>
                    <svg className='ks_wth_15 ks_hgt_15' viewBox="0 0 24 24">
                        <defs>
                            <clipPath id="clip-Custom_Size_1">
                            <rect width="24" height="24"/>
                            </clipPath>
                        </defs>
                        <g id="Custom_Size_1" data-name="Custom Size – 1" clip-path="url(#clip-Custom_Size_1)">
                            <rect width="24" height="24" fill="#fff"/>
                            <g id="error-24px">
                            <path id="Path_1" data-name="Path 1" d="M0,0H24V24H0Z" fill="none"/>
                            <path id="Path_2" data-name="Path 2" d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm1,15H11V15h2Zm0-4H11V7h2Z" fill="#f60404"/>
                            </g>
                        </g>
                    </svg>
                    <label className='ks-wt-error-msg'>{message}</label>
                </div>
            }
        </>
    )
}

export default ErrorMsgIcon