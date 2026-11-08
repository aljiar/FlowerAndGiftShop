import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cva';

const baseField =
  'w-full bg-cream border border-line rounded-sm px-4 py-3 text-sm text-forest placeholder:text-muted/70 focus:border-forest focus:outline-none transition-colors';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, id, className, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs uppercase tracking-wider text-muted">
            {label}
          </label>
        )}
        <input ref={ref} id={inputId} className={cn(baseField, error && 'border-clay', className)} {...props} />
        {hint && !error && <p className="text-xs text-muted">{hint}</p>}
        {error && <p className="text-xs text-clay">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, id, className, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs uppercase tracking-wider text-muted">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(baseField, 'min-h-[120px] resize-y', error && 'border-clay', className)}
          {...props}
        />
        {hint && !error && <p className="text-xs text-muted">{hint}</p>}
        {error && <p className="text-xs text-clay">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, id, className, children, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs uppercase tracking-wider text-muted">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            baseField,
            'appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%226%22%20viewBox%3D%220%200%2010%206%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M1%201l4%204%204-4%22%20stroke%3D%22%232E3D34%22%20stroke-width%3D%221%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E")] bg-[right_1rem_center] bg-no-repeat pr-10',
            error && 'border-clay',
            className
          )}
          {...props}
        >
          {children}
        </select>
        {hint && !error && <p className="text-xs text-muted">{hint}</p>}
        {error && <p className="text-xs text-clay">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
