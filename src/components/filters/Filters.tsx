import { Fragment, useEffect, useState } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook.ts';
import ComboboxSortBy from './ComboboxSortBy.tsx';
import ComboboxFindBy from './ComboboxFindBy.tsx';
import ComboboxUser from './ComboboxUser.tsx';
import { Transition } from '@headlessui/react';
import { Alert, Spinner } from 'flowbite-react';

type Props = {
  show: boolean;
  onSortBy: (e: string) => void;
  onFindBy: (e: string) => void;
}

export type UserType = {
  id: number;
  name: string;
};

const Filters = ({ show, onSortBy, onFindBy }: Props) => {

  const [loadedUsers, setLoadedUsers] = useState<UserType[]>([]);
  const { sendRequest, errors, isLoading } = useHttpClient();
  const [selected, setSelected] = useState<UserType>(loadedUsers && loadedUsers.length > 0 ? loadedUsers[0] : { id: 0, name: 'Error' });
  const [query, setQuery] = useState('');
  const [filterByValue, setFilterByValue] = useState<string>('-');
  const [sortOption, setSortOption] = useState('Newest first');

  const filteredUsers = query === '' ? loadedUsers : loadedUsers
    .filter((user) => user.name.toLowerCase()
      .replace(/\s+/g, '')
      .includes(query.toLowerCase()
        .replace(/\s+/g, '')));

  useEffect(() => {
    const fetchUsersName = async () => {
      try {
        const responseData = await sendRequest(
          1,
          '/users/getUsersName',
          'GET',
          null
        );
        setLoadedUsers(responseData);
        if ( responseData && responseData.length > 0 ) {
          setSelected(responseData[0]);
        }
      } catch ( error ) { /* empty */
      }
    };
    fetchUsersName();
  }, [sendRequest]);

  return (
    <>
      <Transition
        as={Fragment}
        show={show}
        enter="transition ease-in-out duration-200"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in-out duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        {isLoading[1] ? (
          <div className="flex justify-center w-full">
            <Spinner color="info" aria-label="Loading..." size="xl"/>
          </div>
        ) : (
          <div className="px-3 flex flex-col justify-center items-center gap-2 w-full">
            <div className="pb-2 flex flex-row justify-between w-full md:w-1/2 gap-3">
              <div className="w-1/2">
                <p className="mb-2 dark:text-white tracking-wide">Sort by:</p>
                <ComboboxSortBy sortOption={sortOption} setSortOption={setSortOption} onSortBy={onSortBy}/>
              </div>
              <div className="w-1/2">
                <p className="mb-2 dark:text-white tracking-wide">Find by:</p>
                <ComboboxFindBy filterByValue={filterByValue} onFindBy={onFindBy} setFilterByValue={setFilterByValue} selected={selected}/>
              </div>
            </div>
            {filterByValue !== '-' && (
              <div className="pb-2 flex justify-center w-full md:w-1/2">
                <ComboboxUser selected={selected} setSelected={setSelected} onFindBy={onFindBy} setQuery={setQuery} filteredUsers={filteredUsers} query={query}/>
              </div>
            )}
            {errors[1] && (
              <div className="flex justify-center items-center w-full">
                <Alert color="failure">
                  <span className="font-medium">{errors[1]}</span>
                </Alert>
              </div>
            )}
            <div className="h-2 w-full border-b-2 border-indigo-500 mb-4"></div>
          </div>
        )}
      </Transition>

    </>
  );
};

export default Filters;