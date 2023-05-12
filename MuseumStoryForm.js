import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { getDatabase, ref, push, serverTimestamp, query, orderByChild, equalTo, limitToLast } from "firebase/database";
import { getFunctions, httpsCallable } from 'firebase/functions';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useList } from 'react-firebase-hooks/database';

const firebaseConfig = {
  apiKey: "AIzaSyDBjUEw_DQNMQsZJWfTtLL0PQJoH-xF0kk",
  authDomain: "sta-cs5041.firebaseapp.com",
  databaseURL: "https://sta-cs5041-p4.firebaseio.com",
  projectId: "sta-cs5041",
  storageBucket: "sta-cs5041.appspot.com",
  messagingSenderId: "639987847762",
  appId: "1:639987847762:web:c5a35616a1aa1cf243458b"
};

const firebaseToken = "9dd8d43a-01db-4286-b0e8-371d24237380";

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);
const functions = getFunctions(firebaseApp);

const MuseumStoryForm = () => {
  //const [user, authLoading, authError] = useAuthState(auth);
  const [alias, setAlias] = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [recipient, setRecipient] = useState('');
  const [story, setStory] = useState('');

  const [user] = useAuthState(auth);
    useEffect(() => {
        (async () => {
          const getToken = httpsCallable(functions, 'getToken');
          const token = await getToken({ token: firebaseToken });
          if (token?.data?.result === 'ok' && token?.data?.token) {
            signInWithCustomToken(auth, token.data.token);
          } else {
            console.error(token?.data?.reason ?? 'unknownError');
          }
        })();
      }, []);


  const handleSubmit = () => {
  
    if (user) {
      console.log({
        alias,
        location,
        time,
        recipient,
        story,
      });

      push(ref(database, 'data'), {
        userId: user.uid,
        groupId: 27,
        timestamp: serverTimestamp(),
        type: 'str',
        string: alias.toString(),
      });
      push(ref(database, 'data'), {
      userId: user.uid,
      groupId: 29,
      timestamp: serverTimestamp(),
      type: 'str',
      string: location.toString(),
      });
      push(ref(database, 'data'), {
      userId: user.uid,
      groupId: 30,
      timestamp: serverTimestamp(),
      type: 'str',
      string: time.toString(),
      });
      push(ref(database, 'data'), {
        userId: user.uid,
        groupId: 31,
        timestamp: serverTimestamp(),
        type: 'str',
        string: recipient.toString(),
        });
      push(ref(database, 'data'), {
        userId: user.uid,
        groupId: 32,
        timestamp: serverTimestamp(),
        type: 'str',
        string: story.toString(),
        });
    }else {
      console.log('User not authenticated');
    }
  
    // 将这些函数调用移动到 handleSubmit 函数内部
    setAlias('');
    setLocation('');
    setTime('');
    setRecipient('');
    setStory('');
  };
  
  return (
    <View style={styles.container}>
      <Input
        label="Your name"
        placeholder="You can fill in your real name or any alias you like"
        value={alias}
        onChangeText={text => setAlias(text)}
        style={styles.input}
        labelStyle={styles.labelStyle}
        leftIcon={<MaterialCommunityIcons name="account" size={24} color="black" />}
      />
      <Input
        label="Location where happened"
        placeholder="The location of the story still makes a lot of sense, please let us know where this story takes place"
        value={location}
        onChangeText={text => setLocation(text)}
        style={styles.input}
        labelStyle={styles.labelStyle}
        leftIcon={<MaterialCommunityIcons name="map-marker" size={24} color="black" />}
      />
      <Input
        label="Time when happened"
        placeholder="The timing of the story often means an unexpected beginning. When did this story happen?"
        value={time}
        onChangeText={text => setTime(text)}
        style={styles.input}
        labelStyle={styles.labelStyle}
        leftIcon={<MaterialCommunityIcons name="calendar" size={24} color="black" />}
      />
      <Input
        label="Who you want to convey"
        placeholder="Many times we want to convey some information to some people, but for various reasons we can't, please tell us who you want to convey
        "
        value={recipient}
        onChangeText={text => setRecipient(text)}
        style={styles.input}
        labelStyle={styles.labelStyle}
        leftIcon={<MaterialCommunityIcons name="account-multiple" size={24} color="black" />}
      />
      <Input
        label="Your Story"
        placeholder="Share your story here"
        value={story}
        onChangeText={text => setStory(text)}
        multiline={true}
        numberOfLines={4}
        style={styles.input}
        labelStyle={styles.labelStyle}
        leftIcon={<MaterialCommunityIcons name="book" size={24} color="black" />}
      />
      <Button
        title="Submit"
        onPress={handleSubmit}
        containerStyle={styles.buttonContainer}
        buttonStyle={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 10,
  },
  labelStyle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    backgroundColor: '#4a90e2',
  },
});

export default MuseumStoryForm;
