import { Button } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { ReactElement } from 'react';

type Props = {
  label: ReactElement | string;
  className?: string;
}

const AddProjectButton = ({label, className}: Props) => {

  const navigate = useNavigate();

  return (
    <Button color="indigo" className={className} onClick={() => navigate('/project/add')}>
      {label}
    </Button>
  );
};

export default AddProjectButton;