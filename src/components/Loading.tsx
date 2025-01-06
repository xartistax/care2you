import { useEffect, useState } from 'react';
import HashLoader from 'react-spinners/HashLoader';

import { AppConfig } from '@/utils/AppConfig';

export default function LoadingBox() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="py-6">

      <HashLoader
        aria-label={`${AppConfig.name} content loader`}
      />
    </div>
  );
}
