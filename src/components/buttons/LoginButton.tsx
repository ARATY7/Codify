import { useNavigate } from 'react-router-dom';
import { Button } from 'flowbite-react';

const LoginButton = () => {

  const navigate = useNavigate();

  return (
    <>
      <Button type="button" color="indigo" onClick={() => navigate('/login')} className="p-0 font-brandon font-semibold tracking-wider bg-indigo-600 text-white border-indigo-600 enabled:hover:bg-indigo-700 enabled:hover:border-indigo-700 focus:ring-indigo-700">
        Login
      </Button>
    </>
  );
};

export default LoginButton;