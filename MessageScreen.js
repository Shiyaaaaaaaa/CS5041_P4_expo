import {
  ScrollView,
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useEffect, useState } from 'react';

import {
  Provider as PaperProvider,
  TextInput,
  Button as PaperButton,
  Card,
  Paragraph,
} from 'react-native-paper';

import { StatusBar } from 'expo-status-bar';

import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { getDatabase, ref, push, serverTimestamp, query, orderByChild, equalTo, limitToLast } from "firebase/database";
import { getFunctions, httpsCallable } from 'firebase/functions';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useList } from 'react-firebase-hooks/database';

import { ListItem, Input, Button } from 'react-native-elements';

import { SearchBar } from 'react-native-elements';

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

const CardComponent = ({ message }) => (
  <Card style={styles.card}>
    <Card.Content>
      <Paragraph>{message}</Paragraph>
    </Card.Content>
  </Card>
);

////一个名为 Add 的函数式组件。这个组件用于让用户发布新消息。
//它接收一个名为 user 的属性，表示已登录的用户，如果没有用户登录，则该属性为空。
//该组件包含一个输入框和一个发送按钮。输入框用于输入要发布的消息，而发送按钮用于将消息发布到数据库中。
//发送按钮的 onPress 处理程序使用 ref、push 和 serverTimestamp 方法将消息数据存储在数据库中，其中包括发布消息的用户ID、组ID、时间戳、消息类型和字符串内容。
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
            groupId: 20,
            timestamp: serverTimestamp(),
            type: 'str',
            string: text.toString(),
          });
        }}
        title="Post"
      />
    </View>
  );
};

//renderItem 的函数，该函数用于呈现单个列表项
const renderItem = ({ item }) => (
  <ListItem bottomDivider>
    <ListItem.Content>
      <ListItem.Title>{item.string}</ListItem.Title>
    </ListItem.Content>
  </ListItem>
);

//Messages 的函数式组件。这个组件用于显示最近发布的消息列表。它接收一个名为 messages 的属性
const Messages = ({ messages }) => {
  return (
    <FlatList
      style={styles.messageList}
      data={messages}
      renderItem={({ item }) => <CardComponent message={item.val().string} />}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

//该组件使用 Firebase 身份验证状态钩子 useAuthState 获取已登录的用户信息，
//并使用 useEffect 钩子在组件挂载后获取 Firebase 自定义令牌，以便对 Firebase 数据库进行身份验证。
//此外，该组件使用 useList 钩子获取最近发布的消息列表，并将其传递给 Messages 组件
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

  const [snapshots, dbLoading, dbError] = useList(
    user
      ? query(
          ref(database, 'data'),
          orderByChild('groupId'),
          equalTo(20),
          limitToLast(10)
        )
      : null
  );

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <Add user={user} />
        {snapshots ? <Messages messages={snapshots} /> : null}
        <StatusBar style="auto" />
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10, // 设置统一的边距
  },
  card: {
    margin: 10, // 设置统一的间距
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10, // 设置底部间距
  },
  textInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    fontSize: 16, // 设置字体大小
  },
  sendButton: {
    backgroundColor: 'blue',
    marginLeft: 10, // 设置左侧间距
  },
  messageList: {
    flex: 1,
  },
});









