
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TouchableOpacity, Text, Animated } from "react-native";

import { Video } from "expo-av";
import React, { useState } from 'react';

import MessageScreen from './MessageScreen.js';
import WeatherScreen from './WeatherScreen.js';
import MoodScreen from './MoodScreen.js';

const { width, height } = Dimensions.get('window');

function HomeScreen({ navigation }) {
  const [opacity] = useState(new Animated.Value(0));
  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.background, { opacity: opacity }]}
      >
        <Video
          isLooping
          isMuted
          positionMillis={500}
          onLoad={() => {
            Animated.timing(opacity, {
              toValue: 1,
              duration: 500,
              useNativeDriver: false,
            }).start();
          }}
          resizeMode="cover"
          shouldPlay
          source={{
            uri: "https://cdn.coverr.co/videos/coverr-the-ocean-in-the-evening-3606/1080p.mp4",
          }}
          style={{ width: '100%', height: '100%', position: "cover" }} // 修改这里
        />
      </Animated.View>
      <TouchableOpacity
        style={styles.button}
        onPress={navigation.openDrawer}
      >
        <Text style={styles.buttonText}>Open navigation drawer</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("MessageScreen")}
      >
        <Text style={styles.buttonText}>Send message to Fife Rabbits</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("MoodScreen")}
      >
        <Text style={styles.buttonText}>Send your color of moods</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("WeatherScreen")}
      >
        <Text style={styles.buttonText}>Go to check the Fife environment</Text>
      </TouchableOpacity>
    </View>
  );
}

const Drawer = createDrawerNavigator();

function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="MessageScreen" component={MessageScreen} />
        <Drawer.Screen name="WeatherScreen" component={WeatherScreen} />
        <Drawer.Screen name="MoodScreen" component={MoodScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "100%",
    maxWidth: 300,
    backgroundColor: "#1e90ff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default App;
