import {MoneyUtils} from "@/utils/moneyUtils";

const TextAmount = ({value, defaultZero = false}: { value: any, defaultZero?: boolean }) => {
    const amount = Number.isNaN(value) ? 0 : MoneyUtils.getAmount(value)

    if(defaultZero) {
        return <label>{amount}</label>
    }

    return <label>{amount == '0' ? '' : amount}</label>
}

export default TextAmount;