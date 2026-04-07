import { SwitchProp } from '@/types/movies';

export function Switch({ label, checked, onChange }: SwitchProp) {
  return (
    <div className="text-white w-full flex items-center justify-center gap-3">
      <label htmlFor={label} className="cursor-pointer flex gap-2">
        <div className="relative shrink-0 w-12.5 h-6.25 bg-[#141414]  rounded-full">
          <input
            type="checkbox"
            checked={checked}
            id={label}
            className="sr-only peer"
            onChange={() => onChange(!checked)}
          />
          <div className="absolute inset-0 w-full h-full rounded-full transition peer-checked:bg-amber-100 border border-[#c08600]" />
          <div className="absolute top-[2.5px] left-[2.5px] bg-[#c08600] w-5 h-5 rounded-full transition peer-checked:translate-x-6.25" />
        </div>
        <span className="whitespace-nowrap">{label}</span>
      </label>
    </div>
  );
}
