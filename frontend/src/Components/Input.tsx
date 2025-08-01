type InputProps = {
    ref: any;
    placeholder: string;
}

export function Input({ref, placeholder}: InputProps){
    return <div>
        <input placeholder={placeholder} type={"text"} 
        className="px-4 py-2 border rounded m-2" ref={ref} />
    </div>
}