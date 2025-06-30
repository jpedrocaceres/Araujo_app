import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';

interface FileItem {
  name: string;
  path: string;
  isDirectory: boolean;
}

export default function FileManagerScreen() {
  const [currentPath, setCurrentPath] = useState(FileSystem.documentDirectory || '');
  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    loadFiles();
  }, [currentPath]);

  const loadFiles = async () => {
    try {
      const result = await FileSystem.readDirectoryAsync(currentPath);
      const fileItems = await Promise.all(
        result.map(async (name) => {
          const path = `${currentPath}${name}`;
          const info = await FileSystem.getInfoAsync(path);
          return {
            name,
            path,
            isDirectory: info.isDirectory,
          };
        })
      );
      setFiles(fileItems);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os arquivos.');
    }
  };

  const handleCreateFolder = async () => {
    Alert.prompt(
      'Nova Pasta',
      'Digite o nome da pasta:',
      async (folderName) => {
        if (folderName) {
          try {
            await FileSystem.makeDirectoryAsync(`${currentPath}${folderName}`);
            loadFiles();
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível criar a pasta.');
          }
        }
      }
    );
  };

  const handleDelete = async (item: FileItem) => {
    Alert.alert(
      'Confirmar',
      `Deseja excluir ${item.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              if (item.isDirectory) {
                await FileSystem.deleteAsync(item.path, { idempotent: true });
              } else {
                await FileSystem.deleteAsync(item.path);
              }
              loadFiles();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o item.');
            }
          },
        },
      ]
    );
  };

  const handleRename = async (item: FileItem) => {
    Alert.prompt(
      'Renomear',
      'Digite o novo nome:',
      async (newName) => {
        if (newName) {
          try {
            const newPath = `${currentPath}${newName}`;
            await FileSystem.moveAsync({
              from: item.path,
              to: newPath,
            });
            loadFiles();
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível renomear o item.');
          }
        }
      }
    );
  };

  const renderItem = ({ item }: { item: FileItem }) => (
    <TouchableOpacity
      style={styles.fileItem}
      onPress={() => {
        if (item.isDirectory) {
          setCurrentPath(item.path + '/');
        }
      }}
    >
      <View style={styles.fileInfo}>
        <Ionicons
          name={item.isDirectory ? 'folder' : 'document'}
          size={24}
          color="#007AFF"
        />
        <Text style={styles.fileName}>{item.name}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleRename(item)}>
          <Ionicons name="pencil" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item)}>
          <Ionicons name="trash" size={20} color="red" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            const parentPath = currentPath.slice(0, currentPath.lastIndexOf('/'));
            if (parentPath !== FileSystem.documentDirectory) {
              setCurrentPath(parentPath + '/');
            }
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.path}>{currentPath}</Text>
      </View>

      <FlatList
        data={files}
        renderItem={renderItem}
        keyExtractor={(item) => item.path}
        style={styles.list}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleCreateFolder}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Nova Pasta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 10,
  },
  path: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
  list: {
    flex: 1,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileName: {
    marginLeft: 10,
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 15,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 15,
    margin: 15,
    borderRadius: 10,
    gap: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 