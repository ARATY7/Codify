import { useState, FormEvent, useContext, useRef, useEffect } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook.ts';
import { AuthContext } from '../../shared/context/auth-context.ts';
import { Alert, Button, Spinner } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import useInput from '../../shared/hooks/form-hook.ts';
import CustomInput from '../../components/forms/CustomInput.tsx';
import PenIcon from '../../components/icons/Pen.tsx';

const Login = () => {

  const [step, setStep] = useState<'email' | 'login' | 'register'>('email');
  const { sendRequest, errors, isLoading, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (step === 'register' && nameInputRef.current) {
      nameInputRef.current.focus();
    }
    if (step === 'login' && passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, [step]);

  const {
    value: name,
    isValid: nameIsValid,
    hasError: nameInputHasError,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    reset: resetNameInput
  } = useInput((value: string): boolean => value.trim().length > 0 && value.trim().length <= 32);

  const {
    value: email,
    isValid: emailIsValid,
    hasError: emailInputHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmailInput
  } = useInput((value: string): boolean => /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value) && value.trim().length <= 100);

  const {
    value: password,
    isValid: passwordIsValid,
    hasError: passwordInputHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPasswordInput
  } = useInput((value: string): boolean => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_=;:,.?])(?=.{8,64}).*$/.test(value));

  const {
    value: password2,
    isValid: password2IsValid,
    hasError: password2InputHasError,
    valueChangeHandler: password2ChangeHandler,
    inputBlurHandler: password2BlurHandler,
    reset: resetPassword2Input
  } = useInput((value: string): boolean => value === password);


  const handleMail = async (e: FormEvent) => {
    e.preventDefault();
    clearError(1);
    if ( emailIsValid ) {
      try {
        const responseData = await sendRequest(
          1,
          '/auth/email',
          'POST',
          JSON.stringify({ email }),
          { 'Content-Type': 'application/json' }
        );
        if ( responseData.emailExists ) {
          setStep('login');
        } else {
          setStep('register');
        }
      } catch ( err ) { /* empty */
      }
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    clearError(1);
    if ( emailIsValid && passwordIsValid ) {
      try {
        const responseData = await sendRequest(
          1,
          '/auth/login',
          'POST',
          JSON.stringify({ email, password }),
          { 'Content-Type': 'application/json' }
        );
        const { userId, token, userName, userEmail } = responseData;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        auth.login(userId, userName, userEmail, token);
        resetEmailInput();
        resetPasswordInput();
        navigate(`/user/${userId}`);
      } catch ( err ) { /* empty */
      }
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    clearError(1);
    if ( nameIsValid && emailIsValid && passwordIsValid && password2IsValid && password === password2 ) {
      try {
        const responseData = await sendRequest(
          1,
          '/auth/signup',
          'POST',
          JSON.stringify({ name, email, password }),
          { 'Content-Type': 'application/json' }
        );
        const { userId, token, userName, userEmail } = responseData;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        auth.login(userId, userName, userEmail, token);
        resetNameInput();
        resetEmailInput();
        resetPasswordInput();
        resetPassword2Input();
        navigate(`/user/${userId}`);
      } catch ( err ) { /* empty */
      }
    }
  };

  return (
    <div className="flex justify-center mt-6">
      <form className="rounded bg-gray-200 dark:bg-gray-800 w-[350px] p-6 mx-3"
            onSubmit={step === 'email' ? handleMail : step === 'login' ? handleLogin : handleRegister}>

        {step === 'register' && (
          <CustomInput id="name"
                       type="text"
                       label="Your name"
                       placeholder="Your name"
                       value={name}
                       onChange={nameChangeHandler}
                       onBlur={nameBlurHandler}
                       hasError={nameInputHasError}
                       errorMsg="Please enter a valid name (32 characters max)."
                       inputRef={nameInputRef}
                       autocomplete="name"
          />
        )}

        <CustomInput id="email"
                     type="email"
                     label="Your email"
                     placeholder="Your email"
                     value={email}
                     disabled={step !== 'email'}
                     onChange={emailChangeHandler}
                     onBlur={emailBlurHandler}
                     hasError={emailInputHasError}
                     errorMsg="Please enter a valid email (100 characters max)."
                     changeButton={<button type="button" className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-500" onClick={() => setStep('email')}><PenIcon/></button>}
                     autocomplete="email"
        />

        {['login', 'register'].includes(step) && (
          <CustomInput id="password"
                       type="password"
                       label="Password"
                       placeholder="Your password"
                       value={password}
                       onChange={passwordChangeHandler}
                       onBlur={passwordBlurHandler}
                       hasError={passwordInputHasError}
                       errorMsg={'Please enter a more complex password.'}
                       inputRef={passwordInputRef}
                       autocomplete={step === 'register' ? 'new-password' : 'current-password'}
          />
        )}

        {step === 'register' && (
          <CustomInput id="password2"
                       type="password"
                       label="Confirm password"
                       placeholder="Confirm password"
                       value={password2}
                       onChange={password2ChangeHandler}
                       onBlur={password2BlurHandler}
                       hasError={password2InputHasError}
                       errorMsg="Please enter a more complex password that is the same as the password above."
                       autocomplete="new-password"
          />
        )}

        <div className="flex justify-center">
          <Button type="submit" color="indigo" className="font-brandon font-semibold tracking-wider bg-indigo-600 text-white border-indigo-600 enabled:hover:bg-indigo-700 enabled:hover:border-indigo-700 focus:ring-indigo-700">
            <span className={isLoading[1] ? 'pr-3' : ''}>
              {isLoading[1] ? 'Loading...' : step === 'email' ? 'Next' : step === 'login' ? 'Login' : 'Register'}
            </span>
            {isLoading[1] && <Spinner color="info" aria-label="Loading..." size="sm"/>}
          </Button>
        </div>
        {errors[1] && (
          <div className="flex justify-center mt-6">
            <Alert color="failure">
              <span className="font-medium">{errors[1]}</span>
            </Alert>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;