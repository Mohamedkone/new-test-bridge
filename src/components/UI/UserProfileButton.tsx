// components/UI/UserProfileButton.tsx
import { useUser } from '@clerk/clerk-react';
// import { UserContext } from '../../context/UserContext';
import { useState, useRef, useEffect } from 'react';
import { IconLogout, IconSettings } from '@tabler/icons-react';
import { Link } from 'react-router';

export default function UserProfileButton() {
  const { user } = useUser();
  // const { userInfo } = useContext(UserContext);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close the popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current && 
        buttonRef.current && 
        !popoverRef.current.contains(event.target as Node) && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsPopoverOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle escape key to close popover
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsPopoverOpen(false);
      }
    };

    if (isPopoverOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isPopoverOpen]);

  const togglePopover = () => {
    setIsPopoverOpen(!isPopoverOpen);
  };

  const handleAccountSettings = () => {
    // Implement account settings navigation
    console.log('Navigate to account settings');
    setIsPopoverOpen(false);
  };

  const handleLogout = () => {
    // Implement logout functionality
    console.log('Logging out');
    setIsPopoverOpen(false);
  };

  return (
    <div className="relative shadow-xl rounded-l-4xl bg-white">
      <div
        ref={buttonRef}
        className="flex items-center space-x-3 p-3 w-[150px] rounded-xl cursor-pointer"
        onClick={togglePopover}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            togglePopover();
          }
        }}
        tabIndex={0}
        role="button"
        aria-expanded={isPopoverOpen}
        aria-haspopup="true"
      >
        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
          <img 
            src={user?.imageUrl || '/default-avatar.png'} 
            alt="User profile" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* User Info */}
        <div className="text-left">
          <p className="font-medium text-gray-900">{user?.fullName || 'User'}</p>
        </div>
      </div>

      {/* Popover Menu */}
      {isPopoverOpen && (
        <div 
          ref={popoverRef}
          className="absolute top-full right-0 mt-1 w-64 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-50"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-medium text-gray-900">{user?.fullName}</p>
            <p className="text-sm text-gray-500">Free</p>
          </div>
          
          <div className="py-1">
            <Link to={"/account"}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:bg-gray-100"
              role="menuitem"
            >
              <IconSettings className="mr-3 h-5 w-5" />   
              Account Settings
            </Link>
            
            <button
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:bg-gray-100"
              onClick={handleLogout}
              role="menuitem"
            >
              <IconLogout className='mr-3 h-5 w-5'/>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}