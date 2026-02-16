import {useEffect, useState} from 'react';
import {
  Button,
  View,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import {multiply} from 'aep-turbo-core';
import {Messaging} from '@adobe/react-native-aepmessaging';
import {Assurance} from '@adobe/react-native-aepassurance';
import {Core, getExtensionVersion, CORE_MODE_LABEL} from './coreAdapter';

const result = multiply(3, 7);
const SURFACES = ['cbe-android-json'];

export default function App() {
  const [version, setVersion] = useState<string>('Loading...');
  const [assuranceVersion, setAssuranceVersion] = useState<string>('');
  const [assuranceSessionURL, setAssuranceSessionURL] = useState<string>('your-assurance-url');

  useEffect(() => {
    Core.setLogLevel('DEBUG');
    Core.configureWithAppId(
      '3149c49c3910/473386a6e5b0/launch-6099493a8c97-development',
    );
    console.log(
      `AEP SDK Initialized (${Platform.OS}): ${CORE_MODE_LABEL}`,
    );
  }, []);

  useEffect(() => {
    getExtensionVersion()
      .then(setVersion)
      .catch(err => {
        setVersion('Error: ' + (err as Error).message);
      });
  }, []);

  useEffect(() => {
    Assurance.extensionVersion().then(setAssuranceVersion).catch(() => setAssuranceVersion(''));
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>AEP Turbo Core Test</Text>
        <Text style={styles.coreMode}>
          Platform: {Platform.OS} · Core: {CORE_MODE_LABEL}
        </Text>
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
          onPress={() => Core.trackAction('tuesday', {full: 'true'})}
        />

        <Text style={styles.sectionTitle}>Assurance</Text>
        <Text style={styles.text}>Assurance v{assuranceVersion || '…'}</Text>
        <Button
          title="Start Session"
          onPress={() => {
            Assurance.startSession(assuranceSessionURL);
            console.log('Assurance startSession:', assuranceSessionURL);
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="assurance:// or your-assurance-url"
          value={assuranceSessionURL}
          onChangeText={setAssuranceSessionURL}
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
  coreMode: {
    fontSize: 14,
    marginBottom: 12,
    color: '#333',
    fontWeight: '600',
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
  input: {
    height: 40,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 8,
  },
});
