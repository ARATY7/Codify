import { Footer } from 'flowbite-react';
import { BsGithub, BsInstagram, BsTwitter } from 'react-icons/bs';

const MyFooter = () => {
    return (
        <footer className="bg-gray-200 dark:bg-gray-800 px-4 py-3 rounded-t dark:text-white flex justify-between">
            <Footer.Copyright href="https://henchoz.org/" by="Noé Henchoz" year={2023} className="text-gray-800 dark:text-white"/>
            <div className="flex space-x-6">
                <Footer.Icon href="https://www.instagram.com/henchoznoe/" icon={BsInstagram} className="text-gray-800 dark:text-white"/>
                <Footer.Icon href="https://twitter.com/noehenchoz" icon={BsTwitter} className="text-gray-800 dark:text-white"/>
                <Footer.Icon href="https://github.com/ARATY7" icon={BsGithub} className="text-gray-800 dark:text-white"/>
            </div>
        </footer>
    );
};

export default MyFooter;