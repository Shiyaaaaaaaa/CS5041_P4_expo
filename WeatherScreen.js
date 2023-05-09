import {
    ScrollView,
    StyleSheet,
    View,
    SafeAreaView,
    FlatList,
    Text,
  } from 'react-native';
  
  import {
    Provider as PaperProvider,
    TextInput,
    Button as PaperButton,
    Card as PaperCard,
    Paragraph,
  } from 'react-native-paper';
  
  import { useEffect, useState } from 'react'; // 导入 useEffect 和 useState
  
  import { StatusBar } from 'expo-status-bar';
  
  import { initializeApp } from "firebase/app";
  import { getAuth, signInWithCustomToken } from "firebase/auth";
  import { getDatabase, ref, push, serverTimestamp, query, orderByChild, equalTo, limitToLast } from "firebase/database";
  import { getFunctions, httpsCallable } from 'firebase/functions';
  
  import { useAuthState } from 'react-firebase-hooks/auth';
  import { useList } from 'react-firebase-hooks/database';
  
  import { ListItem, Input, Button } from 'react-native-elements';

  //图标库
  import FontAwesome from 'react-native-vector-icons/FontAwesome';

  import grassImage from './asserts/grass.png';
  import greyRabbitImage from './asserts/greyRabbit.png';

  
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
  
  const TemperatureCard = ({ title, message, iconName }) => (
    <PaperCard style={styles.card}>
      <PaperCard.Content>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{title}</Text>
          <FontAwesome name={iconName} size={24} color="#000" />
        </View>
        <Text style={styles.cardNumber}>
          {message.type === 'int' ? message.integer : 'unknown'}
        </Text>
      </PaperCard.Content>
    </PaperCard>
  );  
  
  
  const Add = ({ user }) => {
    const [text, setText] = useState('');
  
    return (
      <View style={styles.inputContainer}>
        <Input
          containerStyle={styles.textInput}
          placeholder="Message"
          value={text}
          onChangeText={(text) => setText(text)}
        />
        <Button
        icon={{ name: 'send', color: 'white' }}
        buttonStyle={styles.sendButton}
        onPress={() => {
        push(ref(database, 'data'), {
            userId: user.uid,
            groupId: 8,
            timestamp: serverTimestamp(),
            type: 'int',
            integer: parseInt(text),
        });
    }}
    title="Post"
/>
      </View>
    );
  };
  
  const renderItem = ({ item }) => (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.string}</ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );
  
  import { Image } from 'react-native';

  const Messages = ({
    outsideMessages,
    insideMessages,
    outsideHumidityMessages,
    insideHumidityMessages,
    groupID8Messages,
  }) => {
    const signalValue = groupID8Messages && groupID8Messages[0]?.val()?.integer;
  
    const imageSource =
    signalValue === 0
    ? grassImage
    : signalValue === 1
    ? greyRabbitImage
    : null;

    console.log('Signal value:', signalValue);

    return (
      <>
        <View style={styles.row}>
          <TemperatureCard
            title="Outside Temperature"
            message={outsideMessages[0]?.val() || {}}
            iconName="thermometer-empty"
          />
          <TemperatureCard
            title="Inside Temperature"
            message={insideMessages[0]?.val() || {}}
            iconName="thermometer-half"
          />
        </View>
        <View style={styles.row}>
          <TemperatureCard
            title="Outside Humidity"
            message={outsideHumidityMessages[0]?.val() || {}}
            iconName="tint"
          />
          <TemperatureCard
            title="Inside Humidity"
            message={insideHumidityMessages[0]?.val() || {}}
            iconName="tint"
          />
        </View>
        {imageSource && <Image source={imageSource} style={{ width: '100%', height: 200 }} />}
      </>
    );
  };
  

  
  
  export default function MessagesScreen() {
    const [user, authLoading, authError] = useAuthState(auth);
  
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
    
    //外部温度
    const [snapshots, dbLoading, dbError] = useList(
      user
        ? query(
            ref(database, 'data'),
            orderByChild('groupId'),
            equalTo(1),
            limitToLast(1)
          )
        : null
    );
    
    //内部温度
    const [insideSnapshots, insideDbLoading, insideDbError] = useList(
        user
          ? query(
              ref(database, 'data'),
              orderByChild('groupId'),
              equalTo(2),
              limitToLast(1)
            )
          : null
      );

      //外部湿度
      const [outsideHumiditySnapshots, outsideHumidityLoading, outsideHumidityError] = useList(
        user
          ? query(
              ref(database, 'data'),
              orderByChild('groupId'),
              equalTo(11),
              limitToLast(1)
            )
          : null
      );
      
      //内部湿度
      const [insideHumiditySnapshots, insideHumidityLoading, insideHumidityError] = useList(
        user
          ? query(
              ref(database, 'data'),
              orderByChild('groupId'),
              equalTo(12),
              limitToLast(1)
            )
          : null
      );

      //灰兔子
      // GroupID 8
      const [groupID8Snapshots, groupID8Loading, groupID8Error] = useList(
        user
        ? query(
            ref(database, 'data'),
            orderByChild('groupId'),
            equalTo(8),
            limitToLast(1)
      )
    : null
);

      
  
      return (
        <PaperProvider>
          <SafeAreaView style={styles.container}>
          {snapshots &&
            insideSnapshots &&
            outsideHumiditySnapshots &&
            insideHumiditySnapshots &&
            groupID8Snapshots ? (
          <Messages
            outsideMessages={snapshots}
            insideMessages={insideSnapshots}
            outsideHumidityMessages={outsideHumiditySnapshots}
            insideHumidityMessages={insideHumiditySnapshots}
            groupID8Messages={groupID8Snapshots}
        />
      ) : null}

            <StatusBar style="auto" />
          </SafeAreaView>
        </PaperProvider>
      );          
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 10,
    },
    card: {
      flex: 1,
      margin: 10,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 5,
    },
    cardNumber: {
      fontSize: 36,
      fontWeight: 'bold',
      color: '#2196F3',
      textAlign: 'center',
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },  
    imageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      resizeMode: 'contain',
      width: '100%',
      height: '100%',
    },  
  });
  
  