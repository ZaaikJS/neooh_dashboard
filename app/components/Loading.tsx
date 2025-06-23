import Image from 'next/image';
import loading from '@/app/assets/loading.svg'

export default function Loading() {
    return (
        <div className='animate-spin opacity-60'>
            <Image src={loading} width={30} height={30} alt={"Loading"} />
        </div>
    );
}