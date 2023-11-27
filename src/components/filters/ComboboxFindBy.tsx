import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Fragment } from 'react';
import { classNames } from '../../utils/classNames.ts';
import { UserType } from './Filters.tsx';

type Props = {
  filterByValue: string;
  onFindBy: (value: string) => void;
  setFilterByValue: (value: string) => void;
  selected: UserType;
}

const ComboboxFindBy = ({filterByValue, onFindBy, setFilterByValue, selected}: Props) => {
  return (
    <>
      <Combobox
        value={filterByValue}
        onChange={(selectedItem: string | null) => {
          if (selectedItem === '-') {
            onFindBy('-');
          } else if (selectedItem === 'User') {
            onFindBy(selected.name);
          }
          setFilterByValue(selectedItem || '-');
        }}
      >
        <div className="relative w-full">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-300 sm:text-sm">
            <Combobox.Input
              readOnly
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 dark:bg-gray-700 dark:text-white"
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </Combobox.Button>
          </div>
          <Transition as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95">
            <Combobox.Options
              className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
            >
              <Combobox.Option
                key="-"
                className={({ active }) => classNames('relative cursor-default select-none py-2 pl-10 pr-4 dark:text-white', active ? 'bg-indigo-600 text-white' : 'text-gray-900')}
                value="-"
              >
                {({ selected, active }) => (
                  <>
                    <span className={classNames('block ', selected ? 'font-medium' : 'font-normal')}>-</span>
                    {selected ? (
                      <span className={classNames('absolute inset-y-0 left-0 flex items-center pl-3', active ? 'text-white' : 'text-indigo-600')}>
                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                    ) : null}
                  </>
                )}
              </Combobox.Option>
              <Combobox.Option
                key="user"
                className={({ active }) => classNames('relative cursor-default select-none py-2 pl-10 pr-4 dark:text-white', active ? 'bg-indigo-600 text-white' : 'text-gray-900')}
                value="User"
              >
                {({ selected, active }) => (
                  <>
                    <span className={classNames('block ', selected ? 'font-medium' : 'font-normal')}>User</span>
                    {selected ? (
                      <span className={classNames('absolute inset-y-0 left-0 flex items-center pl-3', active ? 'text-white' : 'text-indigo-600')}>
                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                    ) : null}
                  </>
                )}
              </Combobox.Option>
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </>
  );
};

export default ComboboxFindBy;