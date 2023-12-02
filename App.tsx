import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import GameScrnContainer from './Screens/GameScrn/GameScrnContainer';

export default function App() {
  return (
    <View style={styles.container}>
      <GameScrnContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
