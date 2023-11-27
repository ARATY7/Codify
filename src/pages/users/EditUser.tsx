import { useNavigate, useParams } from 'react-router-dom';
import { FormEvent, useContext, useState } from 'react';
import { AuthContext } from '../../shared/context/auth-context.ts';
import { Alert, Button, Card, Spinner } from 'flowbite-react';
import { useHttpClient } from '../../shared/hooks/http-hook.ts';
import md5 from 'md5';
import CustomInput from '../../components/forms/CustomInput.tsx';
import useInput from '../../shared/hooks/form-hook.ts';
import ArrowLeft from '../../components/icons/ArrowLeft.tsx';

const EditUser = () => {

  const userIdUrl = useParams().uid;
  const { userId, userName, userEmail, token, login } = useContext(AuthContext);
  const { isLoading, errors, sendRequest, clearError } = useHttpClient();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    value: name,
    isValid: nameIsValid,
    hasError: nameInputHasError,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler
  } = useInput((value: string): boolean => value.trim().length > 0 && value.trim().length <= 32, userName);

  const {
    value: email,
    isValid: emailIsValid,
    hasError: emailInputHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler
  } = useInput((value: string): boolean => /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value) && value.trim().length <= 100, userEmail);

  const {
    value: currentPassword,
    isValid: currentPasswordIsValid,
    hasError: currentPasswordInputHasError,
    valueChangeHandler: currentPasswordChangeHandler,
    inputBlurHandler: currentPasswordBlurHandler,
    reset: resetCurrentPasswordInput
  } = useInput((value: string): boolean => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_=;:,.?])(?=.{8,64}).*$/.test(value));

  const {
    value: newPassword,
    isValid: newPasswordIsValid,
    hasError: newPasswordInputHasError,
    valueChangeHandler: newPasswordChangeHandler,
    inputBlurHandler: newPasswordBlurHandler,
    reset: resetNewPasswordInput
  } = useInput((value: string): boolean => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_=;:,.?])(?=.{8,64}).*$/.test(value));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError(1);
    setSuccessMsg(null);
    if (!(nameIsValid && emailIsValid)) {
      return; 
    }
    const requestBody = {
      userId,
      name,
      email,
      ...(currentPasswordIsValid && newPasswordIsValid && {
        currentPassword,
        newPassword,
      }),
    };
    try {
      const responseData = await sendRequest(
        1,
        `/users/${userId}/edit`,
        'PATCH',
        JSON.stringify(requestBody),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        }
      );
      if (responseData.userUpdated) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        login(userId, name, email, token);
        setSuccessMsg('Your profile has been updated successfully');
      }
      resetCurrentPasswordInput();
      resetNewPasswordInput();
    } catch (err) { /* empty */ }
  };


  if ( userIdUrl !== undefined && +userIdUrl !== userId ) {
    return (
      <div className="flex justify-center">
        <Alert color="failure" className="w-full md:w-1/2 px-3 mt-3 flex items-center">
          <span className="font-medium">You're not allowed to access this page.</span>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center pt-24 w-full mb-3">
        <Card className="flex flex-col bg-gray-200 w-full md:w-2/3 lg:w-1/3 mx-3">
          <div className="relative">
            <div className="absolute top-0 left-0 p-2 rounded-full cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700"
                 onClick={() => navigate(`/user/${userId}`)}>
              <ArrowLeft/>
            </div>
          </div>
          <div className="relative mb-16">
            <img src={`https://gravatar.com/avatar/${md5(userEmail)}?s=200&d=https%3A%2F%2Fui-avatars.com%2Fapi%2F/${userName}/256/9FA8DA/1A237E`}
                 alt="Avatar"
                 className="absolute -top-24 left-1/2 transform -translate-x-1/2 rounded-full w-40 h-40 border border-gray-400 hover:blur-sm cursor-pointer"
                 onClick={() => window.open('https://gravatar.com/', '_blank')}
            />
          </div>
          <div className="flex justify-center text-center dark:text-white italic">
            Sign up on Gravatar with the same email address, and the avatar will be updated here.
          </div>
          <form onSubmit={handleSubmit}>
            <CustomInput id="name"
                         type="text"
                         label="Your name"
                         placeholder="Your name"
                         value={name}
                         onChange={nameChangeHandler}
                         onBlur={nameBlurHandler}
                         hasError={nameInputHasError}
                         errorMsg="Please enter a valid name (32 characters max)."
                         autocomplete="name"
            />
            <CustomInput id="email"
                         type="email"
                         label="Your email"
                         placeholder="Your email"
                         value={email}
                         onChange={emailChangeHandler}
                         onBlur={emailBlurHandler}
                         hasError={emailInputHasError}
                         errorMsg="Please enter a valid email (100 characters max)."
                         autocomplete="email"
            />
            <CustomInput id="currentPassword"
                         type="password"
                         label="Current password"
                         placeholder="Your current password"
                         value={currentPassword}
                         onChange={currentPasswordChangeHandler}
                         onBlur={currentPasswordBlurHandler}
                         hasError={currentPasswordInputHasError}
                         errorMsg="Please enter your current password if you want to change it; otherwise, leave it empty."
                         autocomplete="current-password"
            />
            <CustomInput id="newPassword"
                         type="password"
                         label="New password"
                         placeholder="Your new password"
                         value={newPassword}
                         onChange={newPasswordChangeHandler}
                         onBlur={newPasswordBlurHandler}
                         hasError={newPasswordInputHasError}
                         errorMsg="Please enter a more complex new password if you want to change your current password; otherwise, leave it empty."
                         autocomplete="new-password"
            />
            <Button type="submit" color="indigo" className="w-full font-brandon font-semibold tracking-wider bg-indigo-600 text-white border-indigo-600 enabled:hover:bg-indigo-700 enabled:hover:border-indigo-700 focus:ring-indigo-700">
              <span className={isLoading ? 'pr-3' : ''}>
                {isLoading[1] ? 'Loading...' : 'Save'}
              </span>
              {isLoading[1] && <Spinner color="info" aria-label="Loading..." size="sm"/>}
            </Button>
            {errors[1] && (
              <div className="flex justify-center mt-6">
                <Alert color="failure">
                  <span className="font-medium">{errors[1]}</span>
                </Alert>
              </div>
            )}
            {successMsg && (
              <div className="flex justify-center mt-6">
                <Alert color="info">
                  <span className="font-medium">{successMsg}</span>
                </Alert>
              </div>
            )}
          </form>
        </Card>
      </div>
    </>
  );
};

export default EditUser;