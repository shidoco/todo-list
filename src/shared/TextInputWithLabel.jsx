function TextInputWithLabel({ 
    elementId,
    labelText,
    onChange,
    ref,
    value,
}) {
  return (
    <div className="space-y-2">
      <label className="field-label" htmlFor={elementId}>{labelText}</label>
      <input
        type="text"
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
        className="field-control"
      />
    </div>
  );
}

export default TextInputWithLabel;