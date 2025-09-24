import { useState } from 'react';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

const AuthModal = ({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);

  if (!isOpen) return null;

  const handleSuccess = () => {
    onClose();
  };

  const switchToLogin = () => {
    setMode('login');
  };

  const switchToSignup = () => {
    setMode('signup');
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        {mode === 'signup' ? (
          <SignupForm
            onSuccess={handleSuccess}
            onSwitchToLogin={switchToLogin}
          />
        ) : (
          <LoginForm
            onSuccess={handleSuccess}
            onSwitchToSignup={switchToSignup}
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal;