function TextInputWithLabel({ 
    elementId,
    labelText,
    onChange,
    ref,
    value,
}) {
  return (
    <div className="space-y-2">
      <label className="block font-semibold text-slate-700" htmlFor={elementId}>{labelText}</label>
      <input
        type="text"
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
      />
    </div>
  );
}

export default TextInputWithLabel;