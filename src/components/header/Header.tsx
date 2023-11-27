import { useContext } from 'react';
import { Navbar } from 'flowbite-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../shared/context/auth-context.ts';
import LoginButton from '../buttons/LoginButton.tsx';
import SwitchThemeButton from '../buttons/SwitchThemeButton.tsx';
import { useTheme } from '../../shared/hooks/theme-hook.ts';
import DropdownMenu from './DropdownMenu.tsx';
import { classNames } from '../../utils/classNames.ts';

type Menus = {
  label: string;
  to: string;
};

const Header = () => {

  const loc = useLocation();
  const { isLoggedIn, userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const menus: Menus[] = isLoggedIn
    ? [
      { label: 'Discover', to: '/' },
      { label: 'My profile', to: `/user/${userId}` },
      { label: 'My favorites', to: `/favorites` }
    ]
    : [
      { label: 'Discover', to: '/' }
    ];

  return (
    <header className="sticky top-0 z-10">
      <Navbar fluid className="bg-gray-200 dark:bg-gray-800 rounded-b">
        <Navbar.Brand className="hover:cursor-pointer"
                      onClick={() => loc.pathname !== '/' ? navigate('/') : location.reload()}
        >
          <img src={theme === 'light' ? '/img/code-128.png' : '/img/code-128-white.png'}
               className="mr-3 h-6 sm:h-9 lg:hover:rotate-180 lg:transition-all lg:duration-300"
               alt="Codify Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold font-brandon tracking-wider dark:text-white">Codify</span>
        </Navbar.Brand>
        <div className="flex md:order-2 space-x-3">
          <SwitchThemeButton theme={theme} setTheme={setTheme}/>
          {isLoggedIn ? <DropdownMenu/> : <LoginButton/>}
          <Navbar.Toggle className="hover:bg-gray-300"/>
        </div>
        <Navbar.Collapse>
          {menus.map((menu:Menus) => (
            <NavLink key={menu.to} to={menu.to}
                     className={classNames('mb-2 md:mb-0 font-brandon font-semibold tracking-wider text-gray-800 dark:text-white py-2 px-3 hover:bg-gray-300 rounded hover:dark:bg-gray-700 transition-transform transform md:hover:scale-110',
                       loc.pathname === menu.to ? 'rounded bg-gray-300 dark:bg-gray-700' : '')}>
              {menu.label}
            </NavLink>
          ))}
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
};

export default Header;

