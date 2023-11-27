import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook.ts';
import { Alert, Badge, Card, Pagination, Spinner } from 'flowbite-react';
import { convertDateToThePast } from '../../utils/DateFormatter.ts';
import { AuthContext } from '../../shared/context/auth-context.ts';
import AddProjectButton from '../../components/buttons/AddProjectButton.tsx';
import PlusIcon from '../../components/icons/Plus.tsx';
import ComboboxSortBy from '../../components/filters/ComboboxSortBy.tsx';
import PenIcon from '../../components/icons/Pen.tsx';
import BinIcon from '../../components/icons/Bin.tsx';
import PopupModal from '../../components/modals/PopupModal.tsx';
import EmptyStar from '../../components/icons/EmptyStar.tsx';
import FilledStar from '../../components/icons/FilledStar.tsx';

type UserInfos = {
  userName: string;
  userEmail: string;
  creationDate: Date;
  projectsCount: number;
}

type Project = {
  projectId: number;
  projectName: string;
  projectDescription: string;
  projectCreatedAt: Date;
  projectUpdatedAt: Date;
  technologies: string[];
};

const User = () => {

  const pageSize = 4;
  const { isLoading, errors, sendRequest, clearError } = useHttpClient();
  const userIdURL = useParams().uid;
  const { token, userId, logout, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loadedUserInfos, setLoadedUserInfos] = useState<UserInfos | null>(null);
  const [loadedProjects, setLoadedProjects] = useState<Project[] | null>(null);
  const [sortOption, setSortOption] = useState<string>('Newest first');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string>('');
  const [projectIdToDelete, setProjectIdToDelete] = useState<number | null>(null);
  const [whatToDelete, setWhatToDelete] = useState<'user' | 'project' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [userIsFav, setUserIsFav] = useState<boolean>(false);
  const [projectIsFavMap, setProjectIsFavMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchUserInfos();
    fetchProjectsByUserId();

    if ( isLoggedIn && userIdURL && !isNaN(Number(userIdURL)) && Number(userIdURL) !== userId ) {
      fetchIsUserFav();
      fetchAreProjectsFav();
    }
  }, [isLoggedIn, sendRequest, token, userId, userIdURL]);

  const fetchUserInfos = async () => {
    setLoadedUserInfos(await sendRequest(1, `/users/${userIdURL}`, 'GET', null));
  };

  const fetchProjectsByUserId = async () => {
    setLoadedProjects(await sendRequest(2, `/projects/getProjects/${userIdURL}`, 'GET', null));
  };

  const fetchIsUserFav = async () => {
    const responseData = await sendRequest(
      6,
      `/favorites/user/${userIdURL}/isFav`,
      'POST',
      JSON.stringify({ userId }),
      {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    );
    setUserIsFav(responseData.isFav);
  };

  const fetchAreProjectsFav = async () => {
    const responseData = await sendRequest(
      8,
      `/favorites/project/${userIdURL}`,
      'POST',
      JSON.stringify({ userId }),
      {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    );
    const updatedProjectIsFavMap: Record<number, boolean> = {};
    responseData.projectsFav.forEach((project: { id: number }) => {
      updatedProjectIsFavMap[project.id] = true;
    });
    setProjectIsFavMap(updatedProjectIsFavMap);
  };

  const sortedProjects = useMemo(() => {
    if ( !loadedProjects ) return null;
    switch ( sortOption ) {
      case 'Newest first':
        return [...loadedProjects].sort((a, b) => new Date(b.projectUpdatedAt).getTime() - new Date(a.projectUpdatedAt).getTime());
      case 'Oldest first':
        return [...loadedProjects].sort((a, b) => new Date(a.projectUpdatedAt).getTime() - new Date(b.projectUpdatedAt).getTime());
      default:
        return loadedProjects;
    }
  }, [loadedProjects, sortOption]);

  const startIndex = (currentPage - 1) * pageSize;
  const visibleProjects = sortedProjects ? sortedProjects.slice(startIndex, startIndex + pageSize) : [];

  const isHisPage = userIdURL && !isNaN(Number(userIdURL)) && Number(userIdURL) === userId;

  const deleteHandler = async () => {
    if ( whatToDelete === 'project' ) {
      const responseData = await sendRequest(
        3,
        `/projects/deleteProject/${projectIdToDelete}`,
        'DELETE',
        JSON.stringify({ userId }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      );
      if ( responseData.projectDeleted ) {
        setLoadedProjects((prevProjects: Project[] | null) => {
          if ( !prevProjects ) return null;
          const newProjects = prevProjects.filter((project) => project.projectId !== projectIdToDelete);
          const newCurrentPage = currentPage > Math.ceil(newProjects.length / pageSize) ? Math.ceil(newProjects.length / pageSize) : currentPage;
          setLoadedUserInfos((prevUserInfos: UserInfos | null) => {
            return prevUserInfos ? { ...prevUserInfos, projectsCount: newProjects.length } : null;
          });
          setCurrentPage(newCurrentPage);
          return newProjects;
        });
        setOpenModal(false);
        setProjectIdToDelete(null);
      }
    } else if ( whatToDelete === 'user' ) {
      const responseData = await sendRequest(
        3,
        `/users/deleteUser/${userId}`,
        'DELETE',
        JSON.stringify({ userId }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      );
      if ( responseData.userDeleted ) {
        setOpenModal(false);
        navigate('/');
        logout();
      }
    }
  };

  const toggleUserFavoriteHandler = async () => {
    const responseData = await sendRequest(
      5,
      `/favorites/user/${userIsFav ? 'remove' : 'add'}/${userIdURL}`,
      userIsFav ? 'DELETE' : 'POST',
      JSON.stringify({ userId }),
      {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    );
    setUserIsFav(userIsFav ? !responseData.userRemoved : responseData.userAdded);
  };

  const toggleProjectFavoriteHandler = async (projectId: number) => {
    const responseData = await sendRequest(
      1000 + projectId,
      `/favorites/project/${projectIsFavMap[projectId] ? 'remove' : 'add'}/${projectId}`,
      projectIsFavMap[projectId] ? 'DELETE' : 'POST',
      JSON.stringify({ userId }),
      {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    );
    setProjectIsFavMap((prevMap) => ({
      ...prevMap,
      [projectId]: projectIsFavMap[projectId] ? !responseData.projectRemoved : responseData.projectAdded
    }));
  };

  return (
    <>
      <PopupModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        textContent={modalContent}
        onDelete={deleteHandler}
        isLoading={isLoading[3]}
        error={errors[3]}
        clearError={() => clearError(3)}
      />
      {isLoading[1] ? (
        <div className="flex justify-center items-center w-full h-[calc(100vh-60px)]">
          <Spinner color="info" aria-label="Loading..." size="xl"/>
        </div>
      ) : loadedUserInfos ? (
        <>
          <div className="flex justify-center pt-24 pb-4 w-full">
            <Card className="flex flex-col bg-gray-200 w-full md:w-2/3 lg:w-1/3 mx-3">
              {isHisPage ? (
                <div className="relative">
                  <div className="absolute top-0 left-0 p-2 rounded-full cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700"
                       onClick={() => navigate(`/user/${userId}/edit`)}>
                    <PenIcon/>
                  </div>
                  <div className="absolute top-0 right-0 p-2 rounded-full cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700"
                       onClick={() => {
                         setWhatToDelete('user');
                         setModalContent('Are you sure you want to delete your account? All your projects and favorites will be lost.');
                         setOpenModal(true);
                       }}>
                    <BinIcon/>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute top-0 right-0 p-2 rounded-full cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700"
                       onClick={toggleUserFavoriteHandler}>
                    {isLoggedIn ? (isLoading[5] ? <Spinner aria-label="Loading..." className="w-5 h-5"/> : userIsFav ? <FilledStar/> : <EmptyStar/>) : null}
                  </div>
                </div>
              )}
              <div className="relative mb-16">
                <img src={`https://gravatar.com/avatar/${loadedUserInfos.userEmail}?s=200&d=https%3A%2F%2Fui-avatars.com%2Fapi%2F/${loadedUserInfos.userName}/256/9FA8DA/1A237E`}
                     alt="Avatar"
                     className="absolute -top-24 left-1/2 transform -translate-x-1/2 rounded-full w-40 h-40 border border-gray-400"
                />
              </div>
              <div className="text-center">
                <h5 className="text-2xl dark:text-white font-brandon font-semibold">{loadedUserInfos.userName} {isHisPage ? '(you)' : ''}</h5>
              </div>
              <div className="text-center">
                <h5 className="text-md dark:text-white">Joined Codify {convertDateToThePast(loadedUserInfos.creationDate)}</h5>
                <h5 className="text-md dark:text-white">{loadedUserInfos.projectsCount} project{loadedUserInfos.projectsCount > 1 ? 's' : ''} shared on Codify</h5>
              </div>
            </Card>
          </div>
          {isHisPage && (
            <div className="flex justify-center w-full mb-4">
              <AddProjectButton className="font-brandon font-semibold tracking-wider bg-indigo-600 text-white border-indigo-600 enabled:hover:bg-indigo-700 enabled:hover:border-indigo-700 focus:ring-indigo-700" label={
                <>
                  <span>Add project&nbsp;</span>
                  <PlusIcon/>
                </>
              }/>
            </div>
          )}
          {isLoading[2] ? (
            <div className="flex justify-center w-full">
              <Spinner color="info" aria-label="Loading..." size="xl"/>
            </div>
          ) : (sortedProjects && sortedProjects.length > 0) ? (
            <>
              <div className="flex justify-center w-full py-3">
                <div className="w-full md:w-2/3 lg:w-1/3 px-3 md:px-0">
                  <ComboboxSortBy sortOption={sortOption} setSortOption={setSortOption}/>
                </div>
              </div>
              <div className="flex justify-center w-full">
                <ul className="w-full md:w-2/3 mx-3">
                  {visibleProjects.map((project) => (
                    <li key={project.projectId}>
                      <Card className="my-3 p-4 w-full bg-gray-200 dark:bg-gray-800 border border-gray-200">
                        <div className="flex justify-between items-center">
                          <div className="w-2/3">
                            <h3 className="text-2xl dark:text-white font-brandon font-semibold tracking-wide text-ellipsis">{project.projectName}</h3>
                          </div>
                          <div className="flex flex-row space-x-1 w-1/3 justify-end">
                            {isHisPage ? (
                              <>
                                <div className="p-2 rounded-full cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700"
                                     onClick={() => navigate(`/project/${project.projectId}/edit`)}>
                                  <PenIcon/>
                                </div>
                                <div className="p-2 rounded-full cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700" onClick={() => {
                                  setProjectIdToDelete(project.projectId);
                                  setWhatToDelete('project');
                                  setModalContent('Are you sure you want to delete this project?');
                                  setOpenModal(true);
                                }}>
                                  <BinIcon/>
                                </div>
                              </>
                            ) : (
                              <div className="p-2 rounded-full cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700"
                                   onClick={() => toggleProjectFavoriteHandler(project.projectId)}>
                                {isLoggedIn ? (isLoading[1000 + project.projectId] ? <Spinner aria-label="Loading..." className="w-5 h-5"/> : projectIsFavMap[project.projectId] ?
                                  <FilledStar/> : <EmptyStar/>) : null}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="my-2">
                          <p className="text-justify dark:text-white">{project.projectDescription}</p>
                        </div>
                        {project.technologies[0] !== null && (
                          <div className="mb-3">
                            <h3 className="text-sm">
                              <div className="flex flex-wrap gap-2">
                                {project.technologies.map((tech, index) => (
                                  <Badge key={index} color="indigo">{tech}</Badge>
                                ))}
                              </div>
                            </h3>
                          </div>
                        )}
                        <div className="flex justify-end mb-3">
                          <p className="text-sm dark:text-white text-right">{convertDateToThePast(project.projectUpdatedAt)}</p>
                        </div>
                      </Card>
                    </li>
                  ))}
                </ul>
              </div>
              {sortedProjects && sortedProjects.length > pageSize && (
                <div className="flex justify-center w-full mb-5">
                  <Pagination currentPage={currentPage}
                              totalPages={Math.ceil(sortedProjects ? sortedProjects.length / pageSize : 0)}
                              onPageChange={setCurrentPage}
                              previousLabel=""
                              nextLabel=""
                              showIcons
                  />
                </div>
              )}
            </>
          ) : (sortedProjects && sortedProjects.length === 0) ? (
            <div className="flex justify-center items-center w-full">
              <Alert color="info">
                <span className="font-medium">No projects found.</span>
              </Alert>
            </div>
          ) : (
            <div className="flex justify-center">
              <Alert color="failure" className="w-full md:w-1/2 px-3 mt-3 flex items-center">
                <span className="font-medium">{errors[2]}</span>
              </Alert>
            </div>
          )}
        </>
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

export default User;