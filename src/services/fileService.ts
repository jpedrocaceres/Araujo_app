import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
const { StorageAccessFramework } = FileSystem;

export class FileService {
  static async ensureBaseDirectory() {
    if (Platform.OS === 'android') {
      // Solicita permissão e retorna o SAF URI da pasta Download/ScannApp
      const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) throw new Error('Permissão negada para acessar arquivos.');
      // Cria a pasta ScannApp dentro da pasta escolhida (ex: Downloads)
      const dirUri = permissions.directoryUri;
      let scannAppDir = dirUri;
      // Verifica se já existe a pasta ScannApp
      try {
        scannAppDir = await StorageAccessFramework.makeDirectoryAsync(dirUri, 'scannApp');
      } catch (e) {
        // Se já existe, apenas usa
        scannAppDir = dirUri;
      }
      return scannAppDir;
    } else {
      // iOS: mantém comportamento antigo
      const basePath = `${FileSystem.documentDirectory}scannApp`;
      const dirInfo = await FileSystem.getInfoAsync(basePath);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(basePath);
      }
      return basePath;
    }
  }

  static async createDirectory(path: string, name: string) {
    if (Platform.OS === 'android') {
      // SAF: cria subpasta dentro do SAF URI
      return await StorageAccessFramework.makeDirectoryAsync(path, name);
    } else {
      const fullPath = `${path}/${name}`;
      const dirInfo = await FileSystem.getInfoAsync(fullPath);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(fullPath);
      }
      return fullPath;
    }
  }

  static async listDirectories(path: string) {
    if (Platform.OS === 'android') {
      // SAF: lista subpastas
      const items = await StorageAccessFramework.readDirectoryAsync(path);
      return items.map(item => ({ name: item, path: item, isDirectory: true }));
    } else {
      const items = await FileSystem.readDirectoryAsync(path);
      const directories = await Promise.all(
        items.map(async (item) => {
          const itemPath = `${path}/${item}`;
          const info = await FileSystem.getInfoAsync(itemPath);
          return {
            name: item,
            path: itemPath,
            isDirectory: info.isDirectory,
          };
        })
      );
      return directories.filter(item => item.isDirectory);
    }
  }

  static async saveFile(sourceUri: string, destinationPath: string, fileName: string) {
    if (Platform.OS === 'android') {
      // Lê o PDF como base64
      const base64 = await FileSystem.readAsStringAsync(sourceUri, { encoding: FileSystem.EncodingType.Base64 });
      // Cria o arquivo PDF na pasta destino
      const fileUri = await StorageAccessFramework.createFileAsync(destinationPath, `${fileName}.pdf`, 'application/pdf');
      await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
      return fileUri;
    } else {
      const fullPath = `${destinationPath}/${fileName}.pdf`;
      await FileSystem.moveAsync({
        from: sourceUri,
        to: fullPath,
      });
      return fullPath;
    }
  }

  static async getFileInfo(path: string) {
    return await FileSystem.getInfoAsync(path);
  }
} 