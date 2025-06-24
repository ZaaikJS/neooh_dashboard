import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Loading() {
    return (
        <div className='animate-spin opacity-60'>
            <AiOutlineLoading3Quarters className={"text-2xl text-gray-100"} />
        </div>
    );
}