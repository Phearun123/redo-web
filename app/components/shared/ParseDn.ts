function parseDN(dn:string) {
    // Split the string by comma and space
    const parts = dn.split(", ");

    // Initialize a variable to store the value of 'CN'
    let cn_value = "";
    for (let element of parts) {
        if (element.startsWith("CN=")) {
            // Remove the 'CN=' part and assign the value to cn_value
            cn_value = element.substring(3);
            return cn_value;
        }
    }
}

export default parseDN;