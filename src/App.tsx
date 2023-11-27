import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/header/Header.tsx';
import MyFooter from './components/Footer.tsx';
import NotFound from './pages/NotFound.tsx';
import Home from './pages/Home.tsx';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook.ts';
import Login from './pages/users/Login.tsx';
import User from './pages/users/User.tsx';
import Favorites from './pages/Favorites.tsx';
import EditUser from './pages/users/EditUser.tsx';
import { useEffect } from 'react';
import ProjectForm from './pages/projects/ProjectForm.tsx';

const App = () => {

  const { token, login, logout, userId, userName, userEmail } = useAuth();

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);

  return (
    <>
      <AuthContext.Provider
        value={{
          isLoggedIn: !!token,
          token: token,
          login: login,
          logout: logout,
          userId,
          userName,
          userEmail
        }}
      >
        <Header/>
        <main className="min-h-[calc(100vh-60px)] w-full">
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/user/:uid" element={<User/>}/>
            <Route path="*" element={<NotFound/>}/>
            {/* Protected routes */}
            {token && (
              <>
                <Route path="/project/add" element={<ProjectForm isEditMode={false}/>}/>
                <Route path="/project/:pid/edit" element={<ProjectForm isEditMode={true}/>}/>
                <Route path="/user/:uid/edit" element={<EditUser/>}/>
                <Route path="/favorites" element={<Favorites/>}/>
              </>
            )}
          </Routes>
        </main>
        <MyFooter/>
      </AuthContext.Provider>
    </>
  );
};

export default App;