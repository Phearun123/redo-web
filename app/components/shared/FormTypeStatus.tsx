const Status = ({status}: { status: string }) =>{
    switch (status) {
        case "1":
            return  <span className="ks-wt-badge-text ks-wt-badge-accepted">Add new</span>
        case "2":
            return  <span className="ks-wt-badge-text ks-wt-badge-in-progress">Extension</span>
        case "3":
            return  <span className="ks-wt-badge-text ks-wt-badge-rejected">Stop using</span>
        default:
            return <span></span>
    }
}
export default Status