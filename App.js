import React, { useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Video } from 'expo-av';
import MessageScreen from './MessageScreen.js'; 
import WeatherScreen from './WeatherScreen.js';
import MoodScreen from './MoodScreen.js';
import MuseumStoryForm from './MuseumStoryForm.js'
import ColorPickerScreen from './ColorPickerScreen.js';



const { width, height } = Dimensions.get('window');

function HomeScreen({ navigation }) {
  const [opacity] = useState(new Animated.Value(0));

  const handlePressIn = (buttonOpacity) => {
    Animated.timing(buttonOpacity, {
      toValue: 0.5,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = (buttonOpacity) => {
    Animated.timing(buttonOpacity, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  const renderButton = (title, onPress) => {
    const buttonOpacity = new Animated.Value(1);

    return (
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            opacity: buttonOpacity,
            shadowOpacity: buttonOpacity.interpolate({
              inputRange: [0.5, 1],
              outputRange: [0.3, 0.8],
            }),
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.button}
          onPressIn={() => handlePressIn(buttonOpacity)}
          onPressOut={() => handlePressOut(buttonOpacity)}
          onPress={onPress}
        >
          <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

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
      {renderButton('Open navigation drawer', () => navigation.openDrawer())}
      {renderButton('Send message to Fife Rabbits', () => navigation.navigate('Send your message to Fife rabbits'))}
      {renderButton('Choose your moods', () => navigation.navigate('Choose your moods'))}
      {renderButton('Pick your emotional color', () => navigation.navigate('ColorPickerScreen'))}
      {renderButton('Check the Fife environment', () => navigation.navigate('WeatherScreen'))}
      {renderButton('Tell your story to our museum', () => navigation.navigate('MuseumStoryForm'))}
    </View>
  );
}

const Drawer = createDrawerNavigator();

function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Send your message to Fife rabbits" component={MessageScreen} />
        <Drawer.Screen name="Check the Fife Environment" component={WeatherScreen} />
        <Drawer.Screen name="Choose your moods" component={MoodScreen} />
        <Drawer.Screen name="Pick your emotional color" component={ColorPickerScreen} />
        <Drawer.Screen name="Tell your story to our museum" component={MuseumStoryForm} />
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
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  button: {
    backgroundColor: "#1e90ff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default App;

