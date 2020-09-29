import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';

export default ({ visible }) => {
  return visible ? (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={visible}
    >
      <View style={styles.container}>
        <View style={styles.indicatorContainer}>
          <ActivityIndicator color="black" size="large" animating={true} />
        </View>
      </View>
    </Modal>
  ) : <></>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  indicatorContainer: {
    backgroundColor: '#FFFFFF',
    height: 80,
    width: 80,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  }
})