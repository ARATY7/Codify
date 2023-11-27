import { useNavigate } from 'react-router-dom';
import { Button } from 'flowbite-react';

const NotFound = () => {

  const navigate = useNavigate();

  return (
    <section className="flex items-center justify-center h-[calc(100vh-60px)]">
      <div className="text-center py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-blue-600 dark:text-blue-600">
          404
        </h1>
        <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
          Something's missing.
        </p>
        <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
          Sorry, we can't find that page. You'll find lots to explore on the home page.
        </p>
        <Button onClick={() => navigate('/')} className="inline-flex" color="blue">
          Back to Homepage
        </Button>
      </div>
    </section>
  );
};

export default NotFound;