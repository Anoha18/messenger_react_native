import React, { useState } from 'react';
import { Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { Button, View, Thumbnail, Form, Item, Input, Label, Toast } from 'native-base';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { SERVER } from '../config';
import ImagePicker from 'react-native-image-picker';
import ImagePickerCrop from 'react-native-image-crop-picker';
import { uploadFile } from '../store/actions/file';
import { updateUser } from '../store/actions/user';

const EditUserScreen = (props) => {
  const {
    navigation,
    user,
    uploadFile,
    updateUser,
  } = props;
  const [name, setName] = useState(user.name || '');
  const [lastname, setLastname] = useState(user.lastname || '');
  const [newAvatar, setNewAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickNewAvatar = () => {
    ImagePicker.showImagePicker({
      title: 'Выберите фото',
      storageOptions: {
        path: 'images',
        skipBackup: true
      },
      takePhotoButtonTitle: 'Сделать фото',
      chooseFromLibraryButtonTitle: 'Выбрать из галереи',
      mediaType: 'photo',
    }, (response) => {
      if (response.didCancel) {
        return console.log('User cancelled image picker');
      } else if (response.error) {
        return console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        return console.log('User tapped custom button: ', response.customButton);
      }

      cropImage(response);
    })
  }

  const cropImage = (image) => {
    ImagePickerCrop.openCropper({
      width: 100,
      height: 100,
      cropping: true,
      cropperCircleOverlay: true,
      showCropGuidelines: false,
      showCropFrame: false,
      enableRotationGesture: false,
      hideBottomControls: true,
      path: image.uri,
      includeBase64: true,
      includeExif: true,
      mediaType: 'photo',
    }).then(cropedImage => {
      const filename = cropedImage.path.substring(cropedImage.path.lastIndexOf('/') + 1, cropedImage.path.length)
      setNewAvatar({ ...cropedImage, ...{ filename }});
      console.log(newAvatar);
    }).catch(error => console.error(error));
  }

  const save = async() => {
    name.trim();
    lastname.trim();

    if (!name) {
      return Alert.alert('Ошибка', 'Поле "Имя" не должно быть пустым')
    }
    setLoading(true);

    const newUserData = {
      name,
      lastname
    };

    if (newAvatar) {
      const { file: savedFile, error } = await uploadFile({
        uri: newAvatar.path,
        type: newAvatar.mime,
        name: newAvatar.filename,
        data: newAvatar.data,
      });

      if (error) {
        setLoading(false);
        return Alert.alert('Ошибка', error);
      }

      newUserData.file_id = savedFile.id;
    }


    const { user, error } = await updateUser(newUserData);
    if (error) {
      setLoading(false);
      return Alert.alert('Ошибка', error);
    }

    setLoading(false);
    Toast.show({
      text: 'Профиль успешно обновлен',
      buttonText: 'ОК',
      type: 'success',
      duration: 3000
    });
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.photoContainer}>
          { user.avatar || newAvatar
            ? (
                <Thumbnail
                  source={
                    (newAvatar && newAvatar.path && { uri: newAvatar.path })
                    || (user.avatar && user.avatar.file_path && { uri: `${SERVER.URL}${user.avatar.file_path}` })
                    || ''
                  }
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50
                  }}
                  borderRadius={50}
                />
              )
            : (
                <EvilIcon name="user" size={150} />
              )
          }
          <Ionicon onPress={() => pickNewAvatar()} style={styles.cameraIcon} name="camera" size={60} color="white" />
          <View
            onPress={() => pickNewAvatar()}
            style={{
              position: 'absolute',
              zIndex: 1,
              backgroundColor: 'rgba(0,0,0, 0.5)',
              width: 100,
              height: 100,
              borderRadius: 50
            }}
          />
        </View>
        <Text style={{ marginTop: 10 }}>@{user.login}</Text>
        <View style={{ width: '100%', paddingLeft: 5, paddingRight: 5, marginTop: 15 }}>
          <Item floatingLabel>
            <Label>Имя</Label>
            <Input value={name} onChangeText={(text) => setName(text)} />
          </Item>
          <Item style={{ marginTop: 8 }} floatingLabel>
            <Label>Фамилия</Label>
            <Input value={lastname} onChangeText={(text) => setLastname(text)} />
          </Item>
        </View>

      </ScrollView>
      <View style={styles.footerContainer}>
        <Button onPress={() => save()} block primary disabled={loading}>
          <Text style={styles.saveText}>Сохранить</Text>
        </Button>
        <Button style={{ marginTop: 5 }} onPress={() => navigation.goBack()} block light>
          <Text style={styles.backText}>Назад</Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
    paddingLeft: 10,
  },
  footerContainer: {
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 10,
    paddingTop: 5,
  },
  saveText: {
    color: '#fff',
    fontSize: 17
  },
  backText: {
    color: '#000',
    fontSize: 17
  },
  photoContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  cameraIcon: {
    position: 'absolute',
    zIndex: 2
  }
})

export default connect(
  state => ({
    user: state.user.user,
  }),
  {
    uploadFile,
    updateUser
  }
) (EditUserScreen);
