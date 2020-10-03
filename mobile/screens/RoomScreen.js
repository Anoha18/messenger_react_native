import React from 'react';
import { View, Text } from 'react-native';

export default ({ route }) => {
  const { params: { id } } = route;

  return (
    <View>
      <Text>
        This is chat room #{id}
      </Text>
    </View>
  )
}
