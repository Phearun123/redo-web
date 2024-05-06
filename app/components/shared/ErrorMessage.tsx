
type Props = {
    message: string | undefined,
    className?: string
}
const ErrorMessage: React.FC<Props> = ({message, ...rest}) =>{
    return (
        <span className="ks-wt-error-msg" {...rest}>
            {message}
        </span>
    )
}

export default ErrorMessage;