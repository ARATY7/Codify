import { ChangeEvent, useEffect, useReducer } from 'react';

type FormInputsInitial = {
  value: string;
  isTouched: boolean;
};

const initialInputState: FormInputsInitial = {
  value: '',
  isTouched: false
};

type InputActionTypes = 'INPUT' | 'BLUR' | 'RESET' | 'SET_INITIAL_VALUE';

type InputAction = {
  type: InputActionTypes;
  value?: string;
};

const inputStateReducer = (state: FormInputsInitial, action: InputAction): FormInputsInitial => {
  switch ( action.type ) {
    case 'INPUT':
      return { ...state, value: action.value || '' };
    case 'BLUR':
      return { ...state, isTouched: true };
    case 'RESET':
      return { ...initialInputState };
    case 'SET_INITIAL_VALUE':
      return { ...state, value: action.value || '', isTouched: false };
    default:
      return state;
  }
};

type FormInputs = {
  value: string;
  isValid: boolean;
  hasError: boolean;
  valueChangeHandler: (e: ChangeEvent<HTMLInputElement>) => void;
  inputBlurHandler: () => void;
  reset: () => void;
};

const useInput = (validateValue: (value: string) => boolean, initialValue?: string): FormInputs => {
  const [inputState, dispatch] = useReducer(
    inputStateReducer,
    {
      ...initialInputState,
      value: initialValue || '',
      isTouched: !!initialValue,
    }
  );

  const valueIsValid: boolean = validateValue(inputState.value);
  const hasError: boolean = !valueIsValid && inputState.isTouched;

  const valueChangeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    dispatch({ type: 'INPUT', value: e.target.value });
  };

  const setInitialValue = (value: string): void => {
    dispatch({ type: 'SET_INITIAL_VALUE', value });
  };

  const inputBlurHandler = (): void => {
    dispatch({ type: 'BLUR' });
  };

  const reset = (): void => {
    dispatch({ type: 'RESET' });
  };

  useEffect(() => {
    if (initialValue) {
      setInitialValue(initialValue);
    }
  }, [initialValue]);

  return {
    value: inputState.value,
    isValid: valueIsValid,
    hasError,
    valueChangeHandler,
    inputBlurHandler,
    reset
  };
};

export default useInput;