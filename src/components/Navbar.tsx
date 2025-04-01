
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { UserIcon, LogOut, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onNewTask?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNewTask }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="w-full h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-bold text-blue-600">TaskCanvas</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            {onNewTask && (
              <Button onClick={onNewTask} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-1" />
                New Task
              </Button>
            )}
            <div className="flex items-center bg-blue-50 rounded-full px-3 py-1">
              <UserIcon className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5 text-gray-500" />
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={() => navigate('/login')}>Log in</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/signup')}>Sign up</Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
