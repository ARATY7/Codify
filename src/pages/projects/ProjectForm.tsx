import { FormEvent, Fragment, useContext, useEffect, useState } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../shared/context/auth-context.ts';
import CustomInput from '../../components/forms/CustomInput.tsx';
import { Alert, Badge, Button, Card, Label, Spinner } from 'flowbite-react';
import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { classNames } from '../../utils/classNames.ts';
import useInput from '../../shared/hooks/form-hook.ts';

type TechnoType = {
  id: number;
  name: string;
};

type Project = {
  projectName: string;
  projectDescription: string;
  creatorId: number;
  technologies: {
    id: number;
    name: string;
  }[];
};

type Props = {
  isEditMode: boolean;
}

const ProjectForm = ({ isEditMode }: Props) => {
  const params = useParams();
  const pidUrl = isEditMode ? params.pid : null;
  const { sendRequest, clearError, isLoading, errors } = useHttpClient();
  const { userId, userName, token } = useContext(AuthContext);
  const [loadedProject, setLoadedProject] = useState<Project | null>(null);
  const [loadedTechnos, setLoadedTechnos] = useState<TechnoType[]>([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<TechnoType>(loadedTechnos && loadedTechnos.length > 0 ? loadedTechnos[0] : { id: 0, name: '' });
  const [technologies, setTechnologies] = useState<TechnoType[]>([]);
  const navigate = useNavigate();

  const filteredTechnos = query === '' ? loadedTechnos : loadedTechnos
    .filter((tech) => tech.name.toLowerCase()
      .replace(/\s+/g, '')
      .includes(query.toLowerCase()
        .replace(/\s+/g, '')));

  useEffect(() => {
    if ( loadedProject && loadedProject.technologies.length > 0 && loadedProject.technologies[0].id !== null ) {
      setTechnologies(loadedProject.technologies);
    }
  }, [loadedProject]);

  useEffect(() => {
    if ( loadedTechnos && loadedTechnos.length > 0 ) {
      setSelected(loadedTechnos[0]);
    }
  }, [loadedTechnos]);

  useEffect(() => {
    const fetchTechno = async () => {
        setLoadedTechnos(await sendRequest(1, '/projects/getTechnologies', 'GET', null));
    };
    fetchTechno();
  }, [sendRequest]);

  useEffect(() => {
    const fetchProject = async () => {
        setLoadedProject(await sendRequest(2, `/projects/getProject/${pidUrl}`, 'GET', null));
    };
    if ( isEditMode ) {
      fetchProject();
    }
  }, [isEditMode, pidUrl, sendRequest]);

  const {
    value: projectName,
    isValid: projectNameIsValid,
    hasError: projectNameInputHasError,
    valueChangeHandler: projectNameChangeHandler,
    inputBlurHandler: projectNameBlurHandler,
    reset: resetProjectNameInput
  } = useInput((value: string): boolean => value.trim().length > 0 && value.trim().length <= 32, loadedProject?.projectName);

  const {
    value: projectDesc,
    isValid: projectDescIsValid,
    hasError: projectDescInputHasError,
    valueChangeHandler: projectDescChangeHandler,
    inputBlurHandler: projectDescBlurHandler,
    reset: resetProjectDescInput
  } = useInput((value: string): boolean => value.trim().length > 20 && value.trim().length <= 512, loadedProject?.projectDescription);

  const handleProjectSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError(3);
    if ( projectNameIsValid && projectDescIsValid ) {
      try {
        const responseData = await sendRequest(
          3,
          isEditMode ? `/projects/editProject/${pidUrl}` : '/projects/addProject',
          isEditMode ? 'PATCH' : 'POST',
          JSON.stringify({ userId, projectName, projectDesc, technologies: technologies.map((tech) => tech.id) }),
          {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }
        );
        if ( responseData.projectAdded || responseData.projectEdited ) {
          resetProjectNameInput();
          resetProjectDescInput();
          navigate(`/user/${userId}`);
        }
      } catch ( err ) { /* empty */
      }
    }
  };

  const removeOneTechno = (id: number) => {
    const updatedTechnologies = technologies.filter((tech) => tech.id !== id);
    setTechnologies(updatedTechnologies);
  };

  return (
    <>
      {isEditMode && (isLoading[1] || isLoading[2]) ? (
        <div className="flex justify-center items-center w-full h-[calc(100vh-60px)]">
          <Spinner color="info" aria-label="Loading..." size="xl"/>
        </div>
      ) : !isEditMode && isLoading[1] ? (
        <div className="flex justify-center items-center w-full h-[calc(100vh-60px)]">
          <Spinner color="info" aria-label="Loading..." size="xl"/>
        </div>
      ) : (isEditMode && loadedProject) || !isEditMode ? (
        <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-60px)]">
          <div className="flex items-center justify-center h-full w-full lg:w-1/3 mt-6 lg:mt-0">
            <form className="rounded bg-gray-200 dark:bg-gray-800 w-[350px] p-6 mx-3"
                  onSubmit={handleProjectSubmit}>
              <CustomInput id="projectName"
                           type="text"
                           label="Project's name"
                           placeholder="Project's name"
                           value={projectName}
                           onChange={projectNameChangeHandler}
                           onBlur={projectNameBlurHandler}
                           hasError={projectNameInputHasError}
                           errorMsg="Please enter a valid name (32 characters max)."
              />
              <CustomInput id="projectDesc"
                           type="text"
                           label="Project's description"
                           placeholder="Project's description"
                           value={projectDesc}
                           onChange={projectDescChangeHandler}
                           onBlur={projectDescBlurHandler}
                           hasError={projectDescInputHasError}
                           errorMsg="Please enter a valid description (20-512 characters)."
              />
              <div className="mb-6">
                <div className="mb-2 block">
                  <Label value="Technologies"/>
                </div>
                <Combobox value={selected} onChange={(selectedItem: TechnoType | null) => {
                  setSelected(selectedItem || { id: 0, name: '' });
                  if ( selectedItem ) {
                    if ( !technologies.find((tech) => tech.id === selectedItem.id) ) {
                      setTechnologies((prevTechnologies) => [...prevTechnologies, selectedItem]);
                    }
                  }
                }}>
                  <div className="relative w-full">
                    <div
                      className="relative w-full cursor-default overflow-hidden rounded-lg text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                      <Combobox.Input
                        className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 dark:bg-gray-700 dark:text-white"
                        displayValue={(techno: TechnoType) => techno.name}
                        onChange={(event) => setQuery(event.target.value)}
                      />
                      <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                      </Combobox.Button>
                    </div>
                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0" afterLeave={() => setQuery('')}>
                      <Combobox.Options
                        className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                        {filteredTechnos ? filteredTechnos.length === 0 && query !== '' ? (
                          <div className="relative cursor-default select-none px-4 py-2 text-gray-700 dark:text-white">
                            No programming language or technology found.
                          </div>
                        ) : (
                          filteredTechnos.map((tech) => (
                            <Combobox.Option
                              key={tech.id}
                              className={({ active }) => classNames('relative cursor-default select-none py-2 pl-10 pr-4 dark:text-white', active ? 'bg-teal-600 text-white' : 'text-gray-900')}
                              value={tech}
                            >
                              {({ selected, active }) => (
                                <>
                          <span className={classNames('block ', selected ? 'font-medium' : 'font-normal')}>
                            {tech.name}
                          </span>
                                  {selected ? (
                                    <span className={classNames('absolute inset-y-0 left-0 flex items-center pl-3', active ? 'text-white' : 'text-teal-600')}>
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
              </div>
              <div className="flex justify-center">
                <Button type="submit" color="indigo" className="font-brandon font-semibold tracking-wider bg-indigo-600 text-white border-indigo-600 enabled:hover:bg-indigo-700 enabled:hover:border-indigo-700 focus:ring-indigo-700">
                  <span className={isLoading[3] ? 'pr-3' : ''}>{isLoading[3] ? 'Loading...' : 'Publish'}</span>
                  {isLoading[3] && <Spinner color="info" aria-label="Spinner button example" size="sm"/>}
                </Button>
              </div>
              {errors[3] && (
                <Alert color="failure" className="w-full px-3 mt-3 flex items-center">
                  <span className="font-medium">{errors[3]}</span>
                </Alert>
              )}
            </form>
          </div>
          <div className="flex w-full lg:w-2/3 h-full items-center justify-center px-3 lg:px-10">
            <Card className="my-3 p-4 w-full bg-gray-200 dark:bg-gray-800 border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl dark:text-white">{projectName === '' ? '...' : projectName}</h3>
                </div>
                <div>
                  <h4 className="dark:text-white cursor-pointer">{userName}</h4>
                </div>
              </div>
              <div className="my-2">
                <p className="text-justify dark:text-white">{projectDesc === '' ? '...' : projectDesc}</p>
              </div>
              {technologies.length > 0 && (
                <div className="mb-3">
                  <h3 className="text-sm">
                    <div className="flex flex-wrap gap-2">
                      {technologies.map((tech) => (
                        <Badge key={tech.id} color="indigo" className="cursor-pointer" onClick={() => removeOneTechno(tech.id)}>{tech.name}</Badge>
                      ))}
                    </div>
                  </h3>
                </div>
              )}
              <div className="flex justify-end mb-3">
                <p className="text-sm dark:text-white text-right">1 second ago</p>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <Alert color="failure" className="w-full md:w-1/2 px-3 mt-3 flex items-center">
            <span className="font-medium">{errors[1]}</span>
          </Alert>
        </div>
      )}
    </>
  );
};

export default ProjectForm;