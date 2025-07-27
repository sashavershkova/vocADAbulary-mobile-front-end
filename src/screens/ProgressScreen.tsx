import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useMockUser } from '../context/UserContext'; // Import the user context hook

const ProgressScreen = () => {
    const user = useMockUser();

    useEffect(() => {
        console.log('Current user ID:', user.id); // use for fetching or filtering
    }, []);
    
  return (
    <View>
      <Text>Progress screen</Text>
    </View>
  );
};

export default ProgressScreen;