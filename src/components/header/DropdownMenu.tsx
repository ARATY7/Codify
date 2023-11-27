import { useContext } from 'react';
import { AuthContext } from '../../shared/context/auth-context.ts';
import { Avatar, Dropdown } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import md5 from 'md5';

const DropdownMenu = () => {

  const { logout, userId, userName, userEmail } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <Dropdown arrowIcon={false} inline className="p-2" label={
      <Avatar
        alt="Profile"
        img={`https://gravatar.com/avatar/${md5(userEmail)}?s=200&d=https%3A%2F%2Fui-avatars.com%2Fapi%2F/${userName}/256/9FA8DA/1A237E`}
        rounded
        bordered={true}
      />
    }>
      <Dropdown.Header>
        <span className="block text-sm">{userName}</span>
        <span className="block truncate text-sm font-medium">{userEmail}</span>
      </Dropdown.Header>
      <Dropdown.Item className="rounded" onClick={() => navigate(`/user/${userId}`)}>Profile</Dropdown.Item>
      <Dropdown.Divider/>
      <Dropdown.Item className="rounded" onClick={logout}>Logout</Dropdown.Item>
    </Dropdown>
  );
};

export default DropdownMenu;