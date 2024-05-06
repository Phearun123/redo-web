import dayjs from "dayjs";
import moment from "moment";

const getMonths = () => {
    const months = [];
    for (let i = 0; i < 12; i++) {
        const month = moment().startOf("year").add(i, "months").format("MMM");
        months.push({
            id: i,
            name: month
        });
    }
    return months;
}
 // Import dayjs library

const getDateTimeNow = () => {
    return dayjs().format("M/D/YYYY h:mm A"); // Format date and time as desired
}

const getDate = (start_date: string | undefined) =>{
    return dayjs().format("YYYY/M/D")
}

const getFormatDate=(date:string|undefined)=>{
    return moment(date).format("YYYY/M/D")
}
const getDateNow = () => {
    return dayjs().format("YYYY-MM-DD")
}

function dateDDMMYYYY(date: string | undefined) {
    return dayjs(date).format("YYYY-MM-DD");
}

function getYearNow() {
    return dayjs().format("YY");
}

function getLastWeek() {
    return {
        start_date: dayjs().subtract(1, 'weeks').format('YYYY-MM-DD'),
        end_date: dayjs().format('YYYY-MM-DD')
    };
}

function getLastMonth() {

    return {
        start_date: dayjs().subtract(1, 'months').format('YYYY-MM-DD'),
        end_date: dayjs().format('YYYY-MM-DD')
    };
}

function getLast3Month() {
    return {
        start_date: dayjs().subtract(3, 'months').format('YYYY-MM-DD'),
        end_date: dayjs().format('YYYY-MM-DD')
    };
}


function getLast6Month() {
    return {
        start_date: dayjs().subtract(6, 'months').format('YYYY-MM-DD'),
        end_date: dayjs().format('YYYY-MM-DD')
    };
}
export const formatDateExcel = (value: Date) => moment(value).format("DDMMYYYY");


const filterDate = {
    "last_week": getLastWeek(),
    "last_month": getLastMonth(),
    "last_3_months": getLast3Month(),
    "last_6_months": getLast6Month()
}

export type FilterDateType = keyof typeof filterDate;

const test = () => {}

export const DateUtils = {
    getDateNow,
    dateDDMMYYYY,
    getYearNow,
    getLastWeek,
    getLastMonth,
    getLast3Month,
    filterDate,
    getMonths,
    formatDateExcel,
    getDateTimeNow,
    getDate,
    getFormatDate
}