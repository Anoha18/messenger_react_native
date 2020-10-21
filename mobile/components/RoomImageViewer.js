import React, { useState } from 'react';
import ImageViewer from 'react-native-image-zoom-viewer';
import { StyleSheet, View, Modal, Text, TouchableOpacity, Alert } from 'react-native';
import { Item, Input } from 'native-base';
import IconAwesome from 'react-native-vector-icons/FontAwesome';
import { uploadFile } from '../store/actions/file';
import { connect } from 'react-redux';

const RoomImageViewer = (props) => {
  const {
    onSend,
    cancelView,
    image,
    uploadFile,
  } = props;
  const [text, setText] = useState(props.text || '');

  const sendFile = async (file) => {
    const { file: savedFile, error } = await uploadFile({
      uri: file.uri,
      type: file.type,
      name: file.fileName,
      data: file.data,
    });

    if (error) {
      return Alert.alert('Ошибка', error)
    }

    const message = {
      text,
      file_id: savedFile.id
    }
    onSend([ message ])
  }

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
        <Input value={text} onChangeText={(text) => setText(text)} placeholder='Введите сообщение' />
        <IconAwesome onPress={() => sendFile(image)} size={23} name="send" color="dodgerblue" />
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

export default connect(
  null,
  {
    uploadFile
  }
) (RoomImageViewer);
