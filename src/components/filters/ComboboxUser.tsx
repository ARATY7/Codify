import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Fragment } from 'react';
import { classNames } from '../../utils/classNames.ts';
import { UserType } from './Filters.tsx';

type Props = {
  selected: UserType;
  setSelected: (selectedItem: UserType) => void;
  onFindBy: (value: string) => void;
  setQuery: (value: string) => void;
  filteredUsers: UserType[];
  query: string;
}

const ComboboxUser = ({ selected, setSelected, filteredUsers, setQuery, query, onFindBy }: Props) => {
  return (
    <>
      <Combobox value={selected} onChange={(selectedItem: UserType | null) => {
        setSelected(selectedItem || { id: 0, name: 'Error' });
        if ( selectedItem ) {
          onFindBy(selectedItem.name);
        }
      }}>
        <div className="relative w-full">
          <div
            className="relative w-full cursor-default overflow-hidden rounded-lg text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 dark:bg-gray-700 dark:text-white"
              displayValue={(person: UserType) => person.name}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
            </Combobox.Button>
          </div>
          <Transition as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                      afterLeave={() => setQuery('')}>
            <Combobox.Options
              className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {filteredUsers ? filteredUsers.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700 dark:text-white">
                  No users found.
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <Combobox.Option
                    key={user.id}
                    className={({ active }) => classNames('relative cursor-default select-none py-2 pl-10 pr-4 dark:text-white', active ? 'bg-indigo-600 text-white' : 'text-gray-900')}
                    value={user}
                  >
                    {({ selected, active }) => (
                      <>
                          <span className={classNames('block ', selected ? 'font-medium' : 'font-normal')}>
                            {user.name}
                          </span>
                        {selected ? (
                          <span className={classNames('absolute inset-y-0 left-0 flex items-center pl-3', active ? 'text-white' : 'text-indigo-600')}>
                              <CheckIcon className="h-5 w-5" aria-hidden="true"/>
                            </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              ) : null}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </>
  );
};

export default ComboboxUser;