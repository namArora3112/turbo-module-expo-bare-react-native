import { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { multiply, extensionVersion } from 'aep-turbo-core';

const result = multiply(3, 7);

export default function App() {
  const [version, setVersion] = useState<string>('Loading...');

  useEffect(() => {
    extensionVersion().then(setVersion).catch(err => {
      setVersion('Error: ' + err.message);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AEP Turbo Core Test</Text>
      <Text style={styles.text}>Multiply Result: {result}</Text>
      <Text style={styles.text}>Extension Version: {version}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginVertical: 10,
  },
});
