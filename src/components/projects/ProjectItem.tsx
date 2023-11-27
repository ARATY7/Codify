import { Badge, Card, Tooltip } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { convertDateToThePast } from '../../utils/DateFormatter.ts';
import { ProjectsType } from './Projects.tsx';

type Props = {
  project: ProjectsType;
}

const ProjectItem = ({ project }: Props) => {

  const navigate = useNavigate();

  return (
    <Card className="my-3 w-full bg-gray-200 dark:bg-gray-800 border border-gray-200">
      <div className="flex justify-between items-center">
        <div className="w-2/3">
          <h3 className="text-xl md:text-2xl dark:text-white font-brandon font-semibold tracking-wide text-ellipsis">{project.projectName}</h3>
        </div>
        <div className="w-1/3 justify-end flex">
          <Tooltip content={project.creator}>
            <img src={`https://gravatar.com/avatar/${project.creatorEmail}?s=64&d=https%3A%2F%2Fui-avatars.com%2Fapi%2F/${project.creator}/64/9FA8DA/1A237E`}
                 alt="User avatar"
                 className="rounded-full cursor-pointer"
                 onClick={() => navigate(`/user/${project.creatorId}`)}
            />
          </Tooltip>
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
  );
};

export default ProjectItem;