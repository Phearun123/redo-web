export function calculateColumnWidth(size: any): string {
    switch (size) {
        case 40:
            return "40px"
        case 120:
            return "120px"
        case 130:
            return "130px"
        default:
            return "auto"
    }
}
