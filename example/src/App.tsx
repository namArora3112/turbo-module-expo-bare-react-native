import {useEffect, useState} from 'react';
import {
  Button,
  View,
  StyleSheet,
  Text,
  ScrollView,
} from 'react-native';
import {AepTurboCore, multiply, extensionVersion} from 'aep-turbo-core';
import {Messaging} from '@adobe/react-native-aepmessaging';

const result = multiply(3, 7);
const SURFACES = ['cbe-android-json'];

export default function App() {
  const [version, setVersion] = useState<string>('Loading...');

  useEffect(() => {
    AepTurboCore.setLogLevel('DEBUG');
    AepTurboCore.configureWithAppId('3149c49c3910/473386a6e5b0/launch-6099493a8c97-development');
    console.log('AEP SDK Initialized (aep-turbo-core)');
  }, []);

  useEffect(() => {
    extensionVersion().then(setVersion).catch(err => {
      setVersion('Error: ' + err.message);
    });
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>AEP Turbo Core Test</Text>
        <Text style={styles.text}>Multiply Result: {result}</Text>
        <Text style={styles.text}>Extension Version: {version}</Text>

        <Text style={styles.sectionTitle}>Messaging</Text>
        <Button
          title="extensionVersion()"
          onPress={async () => {
            const v = await Messaging.extensionVersion();
            console.log('Messaging version:', v);
          }}
        />
        <Button
          title="refreshInAppMessages()"
          onPress={() => {
            Messaging.refreshInAppMessages();
            console.log('messages refreshed');
          }}
        />
        <Button
          title="setMessagingDelegate()"
          onPress={() => {
            Messaging.setMessagingDelegate({
              onDismiss: msg => console.log('dismissed!', msg),
              onShow: msg => console.log('show', msg),
              shouldShowMessage: () => true,
              shouldSaveMessage: () => true,
              urlLoaded: (url, message) => console.log(url, message),
            });
            console.log('messaging delegate set');
          }}
        />
        <Button
          title="getPropositionsForSurfaces()"
          onPress={async () => {
            const messages = await Messaging.getPropositionsForSurfaces(SURFACES);
            console.log(JSON.stringify(messages));
          }}
        />
        <Button
          title="updatePropositionsForSurfaces()"
          onPress={() => {
            Messaging.updatePropositionsForSurfaces(SURFACES);
            console.log('Updated Propositions');
          }}
        />
        <Button
          title="getCachedMessages()"
          onPress={async () => {
            const messages = await Messaging.getCachedMessages();
            console.log('Cached messages:', messages);
          }}
        />
        <Button
          title="getLatestMessage()"
          onPress={async () => {
            const message = await Messaging.getLatestMessage();
            console.log('Latest Message:', message);
          }}
        />
        <Button
          title="trackAction()"
          onPress={() => AepTurboCore.trackAction('tuesday', {full: 'true'})}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
  },
});
