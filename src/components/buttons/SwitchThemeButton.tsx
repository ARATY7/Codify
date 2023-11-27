import Sun from '../icons/Sun.tsx';
import Moon from '../icons/Moon.tsx';

type Props = {
  theme: string;
  setTheme: (theme: string) => void;
}

const SwitchThemeButton = ({theme, setTheme}: Props) => {

    return (
        <button id="theme-toggle" type="button"
                className="text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg text-sm p-1 w-10 h-10 flex justify-center items-center"
                onClick={() => {
                    setTheme(theme === 'dark' ? 'light' : 'dark');
                }}>
            <Sun theme={theme}/>
            <Moon theme={theme}/>
        </button>
    );
};

export default SwitchThemeButton;