import { ChangeEvent, FocusEvent, ReactElement, RefObject } from 'react';
import { Label, TextInput } from 'flowbite-react';

type Props = {
  id: string;
  type: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
  hasError: boolean;
  errorMsg: string;
  disabled?: boolean;
  changeButton?: ReactElement;
  inputRef?: RefObject<HTMLInputElement>;
  autocomplete?: string;
}

const CustomInput = ({ id, type, label, value, placeholder, onChange, onBlur, hasError, errorMsg, disabled, changeButton, inputRef, autocomplete }: Props) => {
  return (
    <div className="mb-6">
      <div className="mb-2 block">
        <Label htmlFor={id} value={label}/>
      </div>
      <div className="relative">
        <TextInput
          id={id}
          placeholder={placeholder}
          type={type}
          value={value}
          disabled={disabled}
          color={hasError ? 'failure' : ''}
          onBlur={onBlur}
          onChange={onChange}
          ref={inputRef}
          autoComplete={autocomplete}
          helperText={hasError && (
            <>
              <span className="text-[#DC3545] text-sm">{errorMsg}</span>
            </>
          )}
        />
        {disabled && changeButton && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {changeButton}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomInput;