import React, { useState } from 'react';
import ImageViewer from 'react-native-image-zoom-viewer';
import { StyleSheet, View, Modal, Text, TouchableOpacity } from 'react-native';
import { Item, Input } from 'native-base';
import IconAwesome from 'react-native-vector-icons/FontAwesome';

export default (props) => {
  const {
    onSend,
    cancelView,
    image
  } = props;
  const [text, setText] = useState('');

  return (
    <Modal style={styles.modalContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => cancelView()} style={{ marginLeft: 'auto' }}>
          <Text style={styles.closeText}>Закрыть</Text>
        </TouchableOpacity>
      </View>
      <ImageViewer
        imageUrls={[{ url: image.uri }]}
        enableSwipeDown
        onCancel={() => cancelView()}
      />
      <Item
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          paddingRight: 18
        }}
        regular
      >
        <Input onChangeText={(text) => setText(text)} placeholder='Введите сообщение' />
        <IconAwesome onPress={() => onSend([{ text, image }])} size={23} name="send" color="dodgerblue" />
      </Item>
    </Modal>
  )
};

const styles = StyleSheet.create({
  modalContainer: {
    position: 'relative'
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 50,
    zIndex: 10,
    width: '100%',
    paddingRight: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeText: {
    color: '#fff',
    fontSize: 16,
  }
});
