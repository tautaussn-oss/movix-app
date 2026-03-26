import { SwitchProp } from '@/types/movies';

export function Switch({ checked, onChange }: SwitchProp) {
  return (
    <div className="text-white w-full md:w-1/3 flex items-center justify-center gap-3">
      <label htmlFor="check-box" className="cursor-pointer flex gap-2">
        <div className="relative shrink-0 w-12.5 h-6.25 bg-gray-400 rounded-full">
          <input
            type="checkbox"
            id="check-box"
            className="sr-only peer"
            onChange={() => onChange(!checked)}
          />
          <div className="absolute inset-0 w-full h-full rounded-full transition peer-checked:bg-blue-500" />
          <div className="absolute top-[2.5px] left-[2.5px] bg-gray-900 w-5 h-5 rounded-full transition peer-checked:translate-x-6.25" />
        </div>
        <span className="whitespace-nowrap">Only Show Featured Movies</span>
      </label>
    </div>
  );
}
