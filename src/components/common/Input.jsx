import { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      value,
      onChange,
      placeholder,
      error,
      required = false,
      className = "",
      ...rest
    },
    ref
  ) => {
    const inputClasses = `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white ${
      error
        ? "border-danger text-danger focus:ring-danger/50 focus:border-danger"
        : "border-gray-300 text-secondary"
    }`;

    const renderInput = () => {
      if (type === "textarea") {
        return (
          <textarea
            ref={ref}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`${inputClasses} resize-vertical min-h-[100px]`}
            {...rest}
          />
        );
      }

      return (
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClasses}
          {...rest}
        />
      );
    };

    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        {label && (
          <label className="text-sm font-medium text-secondary">
            {label}
            {required && <span className="text-danger ml-0.5">*</span>}
          </label>
        )}
        {renderInput()}
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
