import Image from 'next/image';
import ErrorImage from "@/public/Custom-Size-–-1_1.svg"

const ErrorSvg = ({message}: any) => {

  return (
    <div className="ks_d_flex ks_alg_itm_ctr ks_gap_6rem error">
        <Image  src={ErrorImage} loading="lazy" width={16} height={16} alt={"error"} />
        <div>{message}</div>
    </div> 
  )
}

export default ErrorSvg