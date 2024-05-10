import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import tw, { useDeviceContext } from 'twrnc';

function App() {
  useDeviceContext(tw);

  return (
    <View style={tw`w-full h-100vh bg-black`}>
      <SafeAreaView>
        <Text style={tw`text-center text-white`}>
          Example View III III
        </Text>
      </SafeAreaView>
    </View>
  )
}

export default App;
