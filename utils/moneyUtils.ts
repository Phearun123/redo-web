
export default function amountFormatter(amount = 0, currency = "VND") {

    const config = {
        "VND": "vi-VN",
        "USD": "en-US",
    }[currency]

    return new Intl.NumberFormat(config, {
        style: 'currency',
        currency: currency,
    }).format(amount)
        .replace(/(\s+)₫/, '₫');
}

function amountFormatterMoney(amount = 0, currency = "VND") {

    const config = {
        "VND": "vi-VN",
        "USD": "en-US",
    }[currency];

    const formattedAmount = new Intl.NumberFormat(config, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: currency === "USD" ? 2 : 0,
    }).format(amount);

    // For USD, replace the comma with a period
    if (currency === "USD") {
        const parts = formattedAmount.split('.');
        const dollars = parts[0].replace(/,/g, '.');
        const cents = parts[1] || '';
        return `${dollars},${cents}`;
        // return formattedAmount.replace(/,/g, '.');
    }

    // For VND, remove the currency symbol and format with a period as the last separator
    const formattedNumber = formattedAmount.replace(/(\s+)(\D)/, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

    // For VND, add the currency symbol "₫"
    return `${formattedNumber}${currency === "VND" ? "₫" : ""}`;

}

function moneyFormatter(amount = 0, currency = "VND") {

    const config = {
        "VND": "vi-VN",
        "USD": "en-US",
    }[currency]

    return new Intl.NumberFormat(config, {
        style: 'currency',
        currency: currency,
        currencyDisplay: "code",
    }).format(amount);
}

function getAmount(amount = 0, currency = "VND") {

    const config = {
        "VND": "vi-VN",
        "USD": "en-US",
    }[currency]

    return new Intl.NumberFormat(config, {
        currency: currency,
    }).format(amount);
}

function formatNumber(amount = 0, separator = ','){
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}
export const MoneyUtils = {
    amountFormatterMoney,
    moneyFormatter,
    amountFormatter,
    getAmount,
    formatNumber
}