
interface InputBoxProps{
    placeholder: string;
    label: string;
}

export function InputBox({placeholder,label}: InputBoxProps){
    return(
        <div>
            <div>
                <label>{label}</label>
            </div>
            <div>
            <input placeholder={placeholder}></input>
            </div>
        </div>
    )
}