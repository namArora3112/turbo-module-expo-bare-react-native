import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { multiply, extensionVersion } from 'aep-turbo-core';

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [version, setVersion] = useState<string>('Loading...');
  const multiplyResult = multiply(3, 7);

  useEffect(() => {
    extensionVersion()
      .then(setVersion)
      .catch(err => setVersion('Error: ' + (err?.message ?? String(err))));
  }, []);

  const backgroundStyle = { backgroundColor: isDarkMode ? '#1a1a2e' : '#f5f5f5' };
  const textColor = isDarkMode ? '#eee' : '#111';

  return (
    <View style={[styles.container, backgroundStyle]}>
      <Text style={[styles.title, { color: textColor }]}>
        AEP Turbo Core – Expo 54
      </Text>
      <Text style={[styles.text, { color: textColor }]}>
        Multiply(3, 7) = {multiplyResult}
      </Text>
      <Text style={[styles.text, { color: textColor }]}>
        Extension Version: {version}
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 24,
  },
  text: {
    fontSize: 16,
    marginVertical: 8,
  },
});
