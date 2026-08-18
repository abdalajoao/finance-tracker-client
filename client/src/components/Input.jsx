function Input({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
  className = "",
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100 ${className}`}
      />
    </div>
  );
}

export default Input;