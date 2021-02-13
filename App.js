import { setStatusBarTranslucent, StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {
  const [index, setIndex] = useState(0);
  const [currencies, setCurrencies] = useState([]);
  const [curr, setCurr] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [rate, setRate] = useState(0);
  const [result, setResult] = useState(0);

  React.useEffect(() => {
    fetch('https://api.exchangeratesapi.io/latest')
    .then((response) => response.json())
    .then((responseJson) => {
      setCurrencies(responseJson.rates);
      setCurr(Object.keys(currencies));
      setRate(Object.values(currencies));
      setLoading(false);
    })
    .catch((error) => {
      Alert.alert('Error', error);
    });
  }, [])

  function buttonPressed() {
    const [sum] = [Number(text)];
    setResult(sum/rate[index]);
    setText('');
  }

  const currencyList = curr.map((value, index) => {
    return (
      <Picker.Item label={value} value={index} key={index} />
    )
  });

  return (
    <View style={styles.container}>
      {isLoading ? <Text>Loading...</Text> : (
        <View style={styles.container}>
          <Image
            style={styles.logo}
            source={require('./euro-logo.png')}
          />
          <Text>{result.toFixed(2)} €</Text>
          <View style={styles.inputBar}>
            <TextInput
              style={styles.input}
              value={text}
              onChangeText={text => setText(text)}
            />
            <Picker
              selectedValue={index}
              style={{ height: 40, width: 75, borderColor: 'gray', borderWidth: 1}}
              onValueChange={(itemValue) => {
                setIndex(itemValue);
              }}>
            {currencyList}
            </Picker>
          </View>
          <Button title='CONVERT' onPress={buttonPressed} />
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 100,
    borderColor: 'gray',
    borderWidth: 1,
    fontSize: 18,
    padding: 5,
  },
  logo: {
    width: 100,
    height: 100,
    margin: 25,
  },
  inputBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    margin: 25,
  }
});
