import { useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../shared/context/auth-context.ts';
import { useHttpClient } from '../shared/hooks/http-hook.ts';
import { Alert, Badge, Card, Pagination, Spinner } from 'flowbite-react';
import ComboboxSortBy from '../components/filters/ComboboxSortBy.tsx';
import FilledStar from '../components/icons/FilledStar.tsx';
import { convertDateToThePast } from '../utils/DateFormatter.ts';

/*type FavUsersType = {
 id: number;
 name: string;
}*/

type FavProjectsType = {
  id: number;
  name: string;
  description: string;
  updatedAt: Date;
  creatorId: number;
  technologies: {
    id: number;
    name: string;
  }[];
}

const Favorites = () => {

  const pageSize = 4;
  const { userId, token } = useContext(AuthContext);
  const { sendRequest, isLoading } = useHttpClient();
  /*const [loadedFavUsers, setLoadedFavUsers] = useState<FavUsersType[]>([]);*/
  const [loadedFavProjects, setLoadedFavProjects] = useState<FavProjectsType[]>([]);
  const [sortOption, setSortOption] = useState<string>('Newest first');
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    /*fetchUsersFavorites();*/
    fetchProjectsFavorites();
  }, [sendRequest, token, userId]);

  /*const fetchUsersFavorites = async () => {
    setLoadedFavUsers(await sendRequest(1, `/favorites/users/${userId}`, 'GET', null, { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }));
  };*/
  const fetchProjectsFavorites = async () => {
    setLoadedFavProjects(await sendRequest(2, `/favorites/projects/${userId}`, 'GET', null, { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }));
  };

  const sortedProjects = useMemo(() => {
    switch ( sortOption ) {
      case 'Newest first':
        return [...loadedFavProjects].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      case 'Oldest first':
        return [...loadedFavProjects].sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
      default:
        return loadedFavProjects;
    }
  }, [loadedFavProjects, sortOption]);

  const startIndex = (currentPage - 1) * pageSize;
  const visibleProjects = sortedProjects ? sortedProjects.slice(startIndex, startIndex + pageSize) : [];

  const deleteProjectFavHandler = async (projectId: number) => {
    const responseData = await sendRequest(
      1000 + projectId,
      `/favorites/project/remove/${projectId}`,
      'DELETE',
      JSON.stringify({ userId }),
      {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    );
    if (responseData.projectRemoved) {
      setLoadedFavProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== projectId)
      );
    }
  };

  return (
    <>
      {isLoading[1] ? (
        <div className="flex justify-center items-center w-full h-[calc(100vh-60px)]">
          <Spinner color="info" aria-label="Loading..." size="xl"/>
        </div>
      ) : isLoading[2] && (
        <div className="flex justify-center items-center w-full h-[calc(100vh-60px)]">
          <Spinner color="info" aria-label="Loading..." size="xl"/>
        </div>
      )}
      <div className="flex justify-center w-full py-3">
        <div className="w-full md:w-2/3 lg:w-1/3 px-3 md:px-0">
          <ComboboxSortBy sortOption={sortOption} setSortOption={setSortOption}/>
        </div>
      </div>
      <div className="flex justify-center w-full">
        <ul className="w-full md:w-2/3 mx-3">
          {visibleProjects.length === 0 ? (
            <div className="flex justify-center items-center w-full">
              <Alert color="info">
                <span className="font-medium">No favorites projects found.</span>
              </Alert>
            </div>
            ) : visibleProjects.map((project) => (
            <li key={project.id}>
              <Card className="my-3 p-4 w-full bg-gray-200 dark:bg-gray-800 border border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="w-2/3">
                    <h3 className="text-2xl dark:text-white font-brandon font-semibold tracking-wide text-ellipsis">{project.name}</h3>
                  </div>
                  <div className="flex flex-row space-x-1 w-1/3 justify-end">
                      <div className="p-2 rounded-full cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700"
                           onClick={() => deleteProjectFavHandler(project.id)}>
                        {isLoading[1000 + project.id] ? <Spinner aria-label="Loading..." className="w-5 h-5"/> : <FilledStar/>}
                      </div>
                  </div>
                </div>
                <div className="my-2">
                  <p className="text-justify dark:text-white">{project.description}</p>
                </div>
                {project.technologies[0] !== null && (
                  <div className="mb-3">
                    <h3 className="text-sm">
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, index) => (
                          <Badge key={index} color="indigo">{tech.name}</Badge>
                        ))}
                      </div>
                    </h3>
                  </div>
                )}
                <div className="flex justify-end mb-3">
                  <p className="text-sm dark:text-white text-right">{convertDateToThePast(project.updatedAt)}</p>
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
  );
};

export default Favorites;