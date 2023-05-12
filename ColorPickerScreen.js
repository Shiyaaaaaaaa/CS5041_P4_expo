import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import tinycolor from 'tinycolor2';

import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { getDatabase, ref, push, serverTimestamp, query, orderByChild, equalTo, limitToLast } from "firebase/database";
import { getFunctions, httpsCallable } from 'firebase/functions';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useList } from 'react-firebase-hooks/database';

import { ListItem, Input, Button } from 'react-native-elements';

import { SearchBar } from 'react-native-elements';

import { useNavigation, useRoute } from '@react-navigation/native';


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


const ColorPickerScreen = () => {
    const [hue, setHue] = useState(180);
    const [saturation, setSaturation] = useState(50);
    const [brightness, setBrightness] = useState(50);
  
    const color = tinycolor({
      h: hue,
      s: saturation,
      v: brightness,
    }).toHexString();
  
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
      
  
      const sendColorValues = () => {
        if (user) {
          console.log(`Sending Hue: ${hue}, Saturation: ${saturation}, Brightness: ${brightness}`);
      
          push(ref(database, 'data'), {
            userId: user.uid,
            groupId: 37,
            timestamp: serverTimestamp(),
            type: 'int',
            integer: hue,
          });
          push(ref(database, 'data'), {
            userId: user.uid,
            groupId: 38,
            timestamp: serverTimestamp(),
            type: 'int',
            integer: saturation,
          });
          push(ref(database, 'data'), {
            userId: user.uid,
            groupId: 39,
            timestamp: serverTimestamp(),
            type: 'int',
            integer: brightness,
          });
        } else {
          console.log('User not authenticated');
        }
      };      
  
    return (
      <View style={styles.container}>
        <View
          style={[styles.colorCircle, { backgroundColor: color }]}
        ></View>
        <Text style={styles.label}>Hue</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={360}
          step={1}
          value={hue}
          onValueChange={(value) => setHue(value)}
        />
        <Text style={styles.label}>Saturation</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={saturation}
          onValueChange={(value) => setSaturation(value)}
        />
        <Text style={styles.label}>Brightness</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={brightness}
          onValueChange={(value) => setBrightness(value)}
        />
        <Button
          title="Send"
          onPress={sendColorValues}
          buttonStyle={styles.sendButton}
        />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginBottom: 20, // 适当的底部间距
    },    
    colorCircle: {
      width: 150,
      height: 150,
      borderRadius: 75,
      marginBottom: 20,
    },
    label: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 10,
    },
    slider: {
      width: 300,
      height: 40,
    },
    sendButton: {
      marginTop: 10,
      backgroundColor: '#007AFF', // 按钮背景颜色
      borderRadius: 15, // 按钮圆角
      width: 200, // 按钮宽度
      height: 50, // 按钮高度
    },
  });
  
  export default ColorPickerScreen;