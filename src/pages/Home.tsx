import { useState } from 'react';
import { Button } from 'flowbite-react';
import Projects from '../components/projects/Projects.tsx';
import Filters from '../components/filters/Filters.tsx';

const Home = () => {

  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('Newest first');
  const [findBy, setFindBy] = useState<string>('-');

  return (
    <>
      <div className="flex justify-center w-full p-3">
        <Button color="indigo" onClick={() => setShowFilters(prev => !prev)} className="w-full max-w-md focus:z-0 font-brandon font-semibold tracking-wider bg-indigo-600 text-white border-indigo-600 enabled:hover:bg-indigo-700 enabled:hover:border-indigo-700 focus:ring-indigo-700">
          {showFilters ? 'Hide' : 'Show'} filters
        </Button>
      </div>
      <Filters show={showFilters} onSortBy={(sortBy: string) => setSortBy(sortBy)} onFindBy={(findBy) => setFindBy(findBy)}/>
      <Projects sortBy={sortBy} findBy={findBy}/>
    </>
  );
};

export default Home;
