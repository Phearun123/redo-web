import {NumberFormatBase, NumberFormatBaseProps} from "react-number-format";

const CurrencyFormat = (props: NumberFormatBaseProps) => {

    const config = {
        "VND": "vi-VN",
        "USD": "en-US",
    }['VND']

    const format = (numStr: string) => {
        if (numStr === '') return '';

        return new Intl.NumberFormat(config, {
            style: 'currency',
            currency: 'VND',
        }).format(Number(numStr))
            .replace(/(\s+)₫/, '₫');
    };

    return <NumberFormatBase {...props} format={format} renderText={formattedValue => <span>{formattedValue}</span>}/>;
};

export default CurrencyFormat;