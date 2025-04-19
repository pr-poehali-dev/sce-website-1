import { useNavigate, useEffect } from 'react';

// Просто редирект на основную страницу Home
const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/');
  }, [navigate]);
  
  return null;
};

export default Index;
