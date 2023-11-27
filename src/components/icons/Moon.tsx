type Prop = {
    theme: string;
}
const Moon = ({ theme }: Prop) => {
    return (
        <svg id="theme-toggle-light-icon" className={`w-5 h-5 text-gray-800 dark:text-white ${theme === 'dark' ? 'hidden' : ''}`} aria-hidden="true"
             xmlns="http://www.w3.org/2000/svg" fill="none"
             viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M8.509 5.75c0-1.493.394-2.96 1.144-4.25h-.081a8.5 8.5 0 1 0 7.356 12.746A8.5 8.5 0 0 1 8.509 5.75Z"/>
        </svg>
    );
};

export default Moon;