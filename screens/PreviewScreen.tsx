import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert, Dimensions, Modal, TextInput, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { A4_WIDTH, A4_HEIGHT } from '../utils/constants';
import { FileService } from '../services/fileService';

type PreviewScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Preview'>;
type PreviewScreenRouteProp = RouteProp<RootStackParamList, 'Preview'>;

interface ImageItem {
  uri: string;
  rotation: number;
}

interface DirectoryItem {
  name: string;
  path: string;
  isDirectory: boolean;
}

export default function PreviewScreen() {
  const navigation = useNavigation<PreviewScreenNavigationProp>();
  const route = useRoute<PreviewScreenRouteProp>();
  const { images: initialImages } = route.params;
  const [images, setImages] = useState<ImageItem[]>(
    initialImages.map(uri => ({ uri, rotation: 0 }))
  );
  const [baseDirectory, setBaseDirectory] = useState<string>('');
  const [currentDirectory, setCurrentDirectory] = useState<string>('');
  const [directories, setDirectories] = useState<DirectoryItem[]>([]);
  const [showDirectoryModal, setShowDirectoryModal] = useState(false);
  const [showFileNameModal, setShowFileNameModal] = useState(false);
  const [fileName, setFileName] = useState('');
  const [newDirectoryName, setNewDirectoryName] = useState('');

  useEffect(() => {
    initializeDirectories();
  }, []);

  const initializeDirectories = async () => {
    const basePath = await FileService.ensureBaseDirectory();
    setBaseDirectory(basePath);
    setCurrentDirectory(basePath);
    loadDirectories(basePath);
  };

  const loadDirectories = async (path: string) => {
    const dirs = await FileService.listDirectories(path);
    setDirectories(dirs);
  };

  const handleAddImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [A4_WIDTH, A4_HEIGHT],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, { uri: result.assets[0].uri, rotation: 0 }]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleRotateImage = (index: number) => {
    setImages(images.map((img, i) => 
      i === index ? { ...img, rotation: (img.rotation + 90) % 360 } : img
    ));
  };

  const handleCreateDirectory = async () => {
    if (newDirectoryName.trim()) {
      await FileService.createDirectory(currentDirectory, newDirectoryName.trim());
      loadDirectories(currentDirectory);
      setNewDirectoryName('');
    }
  };

  const handleSelectDirectory = (directory: DirectoryItem) => {
    setCurrentDirectory(directory.path);
    loadDirectories(directory.path);
  };

  const handleSavePDF = async () => {
    if (!fileName.trim()) {
      Alert.alert('Erro', 'Por favor, insira um nome para o arquivo.');
      return;
    }

    try {
      const html = `
        <html>
          <body>
            ${images.map(image => `
              <img src="${image.uri}" style="width: 100%; margin-bottom: 20px; transform: rotate(${image.rotation}deg);" />
            `).join('')}
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({
        html,
        width: A4_WIDTH,
        height: A4_HEIGHT,
      });

      await FileService.saveFile(uri, currentDirectory, fileName.trim());
      Alert.alert('Sucesso', 'PDF salvo com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o PDF.');
    }
  };

  const renderDirectoryItem = ({ item }: { item: DirectoryItem }) => (
    <TouchableOpacity
      style={styles.directoryItem}
      onPress={() => handleSelectDirectory(item)}
    >
      <Ionicons name="folder" size={24} color="#007AFF" />
      <Text style={styles.directoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.imageContainer}>
        {images.map((image, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Animated.View style={[
              styles.imageContainer,
              {
                transform: [{ rotate: `${image.rotation}deg` }],
              }
            ]}>
              <Image source={{ uri: image.uri }} style={styles.image} />
            </Animated.View>
            <View style={styles.imageControls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => handleRotateImage(index)}
              >
                <Ionicons name="refresh" size={24} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => handleRemoveImage(index)}
              >
                <Ionicons name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAddImage}>
          <Ionicons name="add" size={24} color="#007AFF" />
          <Text style={styles.buttonText}>Adicionar Imagem</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => setShowDirectoryModal(true)}
        >
          <Ionicons name="folder" size={24} color="#007AFF" />
          <Text style={styles.buttonText}>Escolher Pasta</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.saveButton]} 
          onPress={() => setShowFileNameModal(true)}
        >
          <Ionicons name="save" size={24} color="#fff" />
          <Text style={[styles.buttonText, styles.saveButtonText]}>Salvar PDF</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Seleção de Pasta */}
      <Modal
        visible={showDirectoryModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Escolher Pasta</Text>
              <TouchableOpacity onPress={() => setShowDirectoryModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.directoryInput}>
              <TextInput
                style={styles.input}
                placeholder="Nova pasta"
                value={newDirectoryName}
                onChangeText={setNewDirectoryName}
              />
              <TouchableOpacity 
                style={styles.createButton}
                onPress={handleCreateDirectory}
              >
                <Ionicons name="add" size={24} color="#007AFF" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={directories}
              renderItem={renderDirectoryItem}
              keyExtractor={(item) => item.path}
              style={styles.directoryList}
            />
          </View>
        </View>
      </Modal>

      {/* Modal de Nome do Arquivo */}
      <Modal
        visible={showFileNameModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nome do Arquivo</Text>
              <TouchableOpacity onPress={() => setShowFileNameModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Digite o nome do arquivo"
              value={fileName}
              onChangeText={setFileName}
            />

            <TouchableOpacity 
              style={[styles.button, styles.saveButton]}
              onPress={handleSavePDF}
            >
              <Text style={[styles.buttonText, styles.saveButtonText]}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    flex: 1,
    padding: 20,
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('window').width - 40,
    height: (Dimensions.get('window').width - 40) * (A4_HEIGHT / A4_WIDTH),
    borderRadius: 10,
  },
  imageControls: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    padding: 5,
    gap: 10,
  },
  controlButton: {
    padding: 5,
  },
  buttonContainer: {
    padding: 20,
    gap: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    gap: 10,
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  directoryInput: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  createButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  directoryList: {
    maxHeight: 300,
  },
  directoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 10,
  },
  directoryName: {
    fontSize: 16,
  },
}); 