import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';

type ScannerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Preview'>;

export default function ScannerScreen() {
  const navigation = useNavigation<ScannerScreenNavigationProp>();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleCamera = async () => {
    if (hasPermission) {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        navigation.navigate('Preview', { images: [result.assets[0].uri] });
      }
    } else {
      Alert.alert('Permissão necessária', 'Por favor, permita o acesso à câmera nas configurações do dispositivo.');
    }
  };

  const handleGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      navigation.navigate('Preview', { images: [result.assets[0].uri] });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCamera}>
          <Ionicons name="camera" size={32} color="#007AFF" />
          <Text style={styles.buttonText}>Tirar Foto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleGallery}>
          <Ionicons name="images" size={32} color="#007AFF" />
          <Text style={styles.buttonText}>Escolher da Galeria</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    width: '100%',
    height: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
  },
}); 