const Type = ({type}: { type: string }) =>{
    switch (type) {
        case "1":
            return  <td>USB Token</td>
        case "2":
            return  <td>HSM</td>
        case "3":
            return  <td>Smart card</td>
        case "4":
            return <td>Remote signature</td>
        default:
            return <td></td>
    }
}
export default Type