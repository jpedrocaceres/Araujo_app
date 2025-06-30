import { Feather } from '@expo/vector-icons';
import { Text, TouchableOpacity } from 'react-native';

export const BackButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity 
      className={styles.backButton} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Feather name="chevron-left" size={16} color="#007AFF" />
      <Text className={styles.backButtonText}>
        Back
      </Text>
    </TouchableOpacity>
  );
};

const styles = {
  backButton: 'flex-row items-center',
  backButtonText: 'text-blue-500 ml-1',
};
