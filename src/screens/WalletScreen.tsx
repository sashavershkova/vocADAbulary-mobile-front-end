import { useMockUser } from '../context/UserContext'; // Import the user context hook
import React, { useEffect } from 'react';

const WalletScreen = () => {
    const user = useMockUser();

    useEffect(() => {
        console.log('Current user ID:', user.id); // use for fetching or filtering
    }, []);
    
  // ...
};