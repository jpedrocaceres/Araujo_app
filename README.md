# Scanner App

Aplicativo de scanner de documentos desenvolvido com React Native e Expo, focado em Android.

## Funcionalidades

- Captura de imagens via câmera
- Seleção de imagens da galeria
- Geração de PDFs
- Gerenciamento de arquivos e pastas
- Interface intuitiva e moderna

## Requisitos

- Node.js 18 ou superior
- Expo CLI
- Expo Go (versão 2.32.19)
- Android Studio (para desenvolvimento Android)

## Tecnologias Utilizadas

- React Native
- Expo SDK 52
- TypeScript
- React Navigation
- Expo Camera
- Expo Image Picker
- Expo Print
- Expo File System
- NativeWind (Tailwind CSS)

## Instalação

1. Clone o repositório:
```bash
git clone [[URL_DO_REPOSITÓRIO](https://github.com/jpedrocaceres/ScannApp)]
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o projeto:
```bash
npm start
```

4. Para executar no Android:
```bash
npm run android
```

## Estrutura do Projeto

```
/src
  |-- screens
  |     |-- ScannerScreen.tsx
  |     |-- PreviewScreen.tsx
  |     |-- FileManagerScreen.tsx
  |
  |-- navigation
  |     |-- AppNavigator.tsx
  |
  |-- components
  |     |-- (componentes compartilhados)
  |
  |-- utils
  |     |-- (funções utilitárias)
  |
  |-- store
  |     |-- (gerenciamento de estado)
```

## Permissões Necessárias

- Câmera
- Acesso à galeria
- Armazenamento (leitura e escrita)

## Desenvolvimento

O projeto utiliza TypeScript com configurações estritas para garantir a qualidade do código. A estrutura de arquivos segue o padrão de organização do Expo, com separação clara de responsabilidades.

## Compatibilidade

- Android: 6.0 (API 23) ou superior
- Expo Go: 2.32.19
- Expo SDK: 53

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
