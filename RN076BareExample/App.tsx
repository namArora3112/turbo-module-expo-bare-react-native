/**
 * RN 0.76 Bare Example - AEP Turbo Core integration test
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {multiply, extensionVersion} from 'aep-turbo-core';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [version, setVersion] = useState<string>('Loading...');
  const multiplyResult = multiply(3, 7);

  useEffect(() => {
    extensionVersion()
      .then(setVersion)
      .catch(err => setVersion('Error: ' + (err?.message ?? String(err))));
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#1a1a2e' : '#f5f5f5',
  };
  const textColor = isDarkMode ? '#eee' : '#111';

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <View style={styles.content}>
        <Text style={[styles.title, {color: textColor}]}>
          AEP Turbo Core – RN 0.76
        </Text>
        <Text style={[styles.text, {color: textColor}]}>
          Multiply(3, 7) = {multiplyResult}
        </Text>
        <Text style={[styles.text, {color: textColor}]}>
          Extension Version: {version}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

export default App;
