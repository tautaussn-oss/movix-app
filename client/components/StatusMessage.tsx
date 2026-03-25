import { StatusMessageProp } from '@/types/movies';
import { CiWarning } from 'react-icons/ci';
import { TbMoodEmpty } from "react-icons/tb";

export function StatusMessage({type, message }: StatusMessageProp) {

  const textColor=type==='empty'?'text-yellow-400':'text-red-500';
  
  return (
    <div className="w-full flex justify-center py-5">
      <div className={`w-2/3 p-10 ${textColor} shadow-lg flex flex-col gap-3 justify-evenly items-center bg-gray-700 rounded-2xl`}>
        {type==='empty'? <TbMoodEmpty className="font-bold text-8xl"/>:<CiWarning className="font-bold text-8xl" />} 
        <h1 className='font-bold'>{message}</h1>
      </div>
    </div>
  );
}
