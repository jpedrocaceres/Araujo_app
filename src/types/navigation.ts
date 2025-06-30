import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  Preview: {
    images: string[];
  };
};

export type TabParamList = {
  Scanner: undefined;
  Arquivos: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 