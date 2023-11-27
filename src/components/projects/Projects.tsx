import { useEffect, useState } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook.ts';
import { Alert, Pagination, Spinner } from 'flowbite-react';
import ProjectItem from './ProjectItem.tsx';

type Props = {
  sortBy: string;
  findBy: string;
}

export type ProjectsType = {
  projectId: number;
  projectName: string;
  projectDescription: string;
  projectUpdatedAt: Date;
  creator: string;
  creatorId: number;
  creatorEmail: string;
  technologies: string[];
};

const Projects = ({ sortBy, findBy }: Props) => {

  const [loadedProjects, setLoadedProjects] = useState<ProjectsType[] | null>(null);
  const { isLoading, errors, sendRequest } = useHttpClient();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6;

  useEffect(() => {
    const getProjects = async () => {
      try {
        const responseData = await sendRequest(
          1,
          '/projects/getProjects',
          'GET',
          null
        );
        let sortedProjects = sortByDate(responseData, sortBy);
        if ( findBy !== '-' ) {
          sortedProjects = findByUser(sortedProjects, findBy);
        }
        setLoadedProjects(sortedProjects);
      } catch ( error ) { /* empty */
      }
    };
    getProjects();
  }, [sendRequest, sortBy, findBy]);

  const sortByDate = (projects: ProjectsType[], order: string) => {
    const sortedProjects = [...projects];
    sortedProjects.sort((a, b) => {
      const dateA = new Date(a.projectUpdatedAt).getTime();
      const dateB = new Date(b.projectUpdatedAt).getTime();
      if ( order === 'Newest first' ) {
        return dateB - dateA;
      } else if ( order === 'Oldest first' ) {
        return dateA - dateB;
      }
      return 0;
    });
    return sortedProjects;
  };

  const findByUser = (projects: ProjectsType[], user: string) => {
    return projects.filter((project) => project.creator === user);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const visibleProjects = loadedProjects ? loadedProjects.slice(startIndex, startIndex + pageSize) : [];

  return (
    <>
      {isLoading[1] ? (
        <div className="flex justify-center w-full items-center h-[calc(100vh-60px)]">
          <Spinner color="info" aria-label="Loading..." size="xl"/>
        </div>
      ) : (loadedProjects && loadedProjects.length > 0) ? (
        <>
          {loadedProjects.length > pageSize && (
            <div className="flex justify-center w-full mb-1">
              <Pagination currentPage={currentPage}
                          totalPages={Math.ceil(loadedProjects ? loadedProjects.length / pageSize : 0)}
                          onPageChange={setCurrentPage}
                          previousLabel=""
                          nextLabel=""
                          showIcons
              />
            </div>
          )}
          <div className="flex justify-center w-full">
            <ul className="w-full md:w-2/3 mx-3">
              {visibleProjects.map((project) => (
                <li key={project.projectId}>
                  <ProjectItem project={project}/>
                </li>
              ))}
            </ul>
          </div>
          {loadedProjects.length > pageSize && (
            <div className="flex justify-center w-full mb-5">
              <Pagination currentPage={currentPage}
                          totalPages={Math.ceil(loadedProjects ? loadedProjects.length / pageSize : 0)}
                          onPageChange={setCurrentPage}
                          previousLabel=""
                          nextLabel=""
                          showIcons
              />
            </div>
          )}
        </>
      ) : !errors[1] && (
        <div className="flex justify-center items-center w-full">
          <Alert color="info">
            <span className="font-medium">No projects found.</span>
          </Alert>
        </div>
      )}
      {errors[1] && (
        <div className="flex justify-center items-center w-full">
          <Alert color="failure">
            <span className="font-medium">{errors[1]}</span>
          </Alert>
        </div>
      )}
    </>
  );
};

export default Projects;