import moment from "moment";

export default function getDateFormatted(date: string) {
    if(!date) return;
    return moment(date).format("DD-MM-YYYY");
}