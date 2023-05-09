import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
// 导入所需的Firebase函数
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, push, serverTimestamp } from "firebase/database";
import { getFunctions } from 'firebase/functions';

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

const emotions = [
  { name: 'Surprised', color: '#FFA87A', icon: require('./asserts/surprised.png') },
  { name: 'Excited', color: '#FFC0CB', icon: require('./asserts/excited.png') },
  { name: 'Happy', color: '#F9D342', icon: require('./asserts/happy.png') },
  { name: 'Calm', color: '#9ED8F6', icon: require('./asserts/calm.png') },
  { name: 'Neutral', color: '#D0D1D4', icon: require('./asserts/neutral.png') },
  { name: 'Bored', color: '#AA96DA', icon: require('./asserts/bored.png') },
  { name: 'Anxious', color: '#FFB200', icon: require('./asserts/anxious.png') },
  { name: 'Sad', color: '#4A90E2', icon: require('./asserts/sad.png') },
  { name: 'Angry', color: '#FF6B6B', icon: require('./asserts/angry.png') },
 
];


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const cardSize = deviceWidth / 4;
const cardMargin = (deviceWidth * 0.01) / 2;

const MoodScreen = () => {
  const [selectedEmotion, setSelectedEmotion] = useState(null);

  // 发送数据到Firebase的函数
  const sendDataToFirebase = (emotionIndex) => {
    const integerValue = emotionIndex + 1;
    console.log("Sending integer:", integerValue);

    push(ref(database, 'data'), {
      userId: auth.currentUser.uid,
      groupId: 40,
      timestamp: serverTimestamp(),
      type: 'int',
      integer: integerValue,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.emotionCardsContainer}>
        {emotions.map((emotion, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setSelectedEmotion(emotion);
              sendDataToFirebase(index);
            }}
          >
            <View
              style={[
                styles.emotionCard,
                { backgroundColor: emotion.color },
              ]}
            >
              <Text style={styles.emotionText}>{emotion.name}</Text>
              {selectedEmotion === emotion && (
                <Image source={emotion.icon} style={styles.emotionIcon} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ flex: 1 }} />
    </View>
  );
};

export default MoodScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emotionCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    height: deviceHeight * 0.8,
    alignItems: 'center',
  },

  emotionCard: {
    width: cardSize,
    height: cardSize,
    justifyContent: 'center',
    alignItems: 'center',
    margin: cardMargin,
    borderRadius: 10,
  },

  emotionText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },

  emotionIcon: {
    width: 100,
    height: 100,
  },
});