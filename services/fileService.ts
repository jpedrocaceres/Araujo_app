import * as FileSystem from 'expo-file-system';
import { BASE_DIRECTORY } from '../utils/constants';

export class FileService {
  static async ensureBaseDirectory() {
    const basePath = `${FileSystem.documentDirectory}${BASE_DIRECTORY}`;
    const dirInfo = await FileSystem.getInfoAsync(basePath);
    
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(basePath);
    }
    
    return basePath;
  }

  static async createDirectory(path: string, name: string) {
    const fullPath = `${path}/${name}`;
    const dirInfo = await FileSystem.getInfoAsync(fullPath);
    
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(fullPath);
    }
    
    return fullPath;
  }

  static async listDirectories(path: string) {
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

  static async saveFile(sourceUri: string, destinationPath: string, fileName: string) {
    const fullPath = `${destinationPath}/${fileName}.pdf`;
    await FileSystem.moveAsync({
      from: sourceUri,
      to: fullPath,
    });
    return fullPath;
  }

  static async getFileInfo(path: string) {
    return await FileSystem.getInfoAsync(path);
  }
} 