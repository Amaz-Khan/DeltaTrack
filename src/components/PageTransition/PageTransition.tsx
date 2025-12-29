import { useEffect, useState } from 'react';

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    return () => setVisible(false);
  }, []);

  return (
    <div className={`page ${visible ? 'page-enter' : ''}`}>
      {children}
    </div>
  );
};

export default PageTransition;
