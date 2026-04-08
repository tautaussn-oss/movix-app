import { StatusMessageProp } from '@/types/movies';
import { CiWarning } from 'react-icons/ci';
import { TbMoodEmpty } from 'react-icons/tb';

export function StatusMessage({ type, message }: StatusMessageProp) {
  const textColor =
    type === 'empty'
      ? 'text-[#aa7600] border border-[#aa7600] shadow-lg shadow-[#aa7600]'
      : 'text-red-500 border border-red-500 shadow-lg shadow-red-500';

  return (
    <div className="w-full flex justify-center py-5">
      <div
        className={`w-full md:w-1/2 m-5 p-10 ${textColor} flex flex-col gap-3 justify-evenly items-center bg-[#141414] rounded-2xl`}
      >
        {type === 'empty' ? (
          <div className="text-lg flex flex-col items-center gap-2">
            <TbMoodEmpty className="font-bold text-4xl" />
            <p className="font-bold">No results!</p>
          </div>
        ) : (
          <div className="text-lg text-red-500 flex flex-col items-center gap-2">
            <CiWarning className="font-bold text-4xl" />
            <p className="font-bold">Error!</p>
          </div>
        )}
        <p className="text-center">{message}</p>
      </div>
    </div>
  );
}
