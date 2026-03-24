import { CiWarning } from 'react-icons/ci';
export function StatusMessage({ message }: { message: string }) {
  return (
    <div className="w-full flex justify-center py-5">
      <div className="w-2/3 p-10 text-red-500 shadow-lg flex flex-col gap-3 justify-evenly items-center bg-gray-300 rounded-2xl">
        <CiWarning className="font-bold text-8xl" />
        <h1>{message}</h1>
      </div>
    </div>
  );
}
