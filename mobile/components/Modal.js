import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

export default ({
  children,
  modalStyle,
  visible = false,
  cancelText = 'Отмена',
  okText = 'ОК',
  onOk,
  onCancel,
  hideCancelButton,
  hideOkButton,
  containerStyle,
  bodyStyle,
}) => {
  return (
    <Modal
      isVisible={visible}
      style={[styles.modalStyle, modalStyle]}
    >
      <View style={[styles.container, containerStyle]}>
        <View style={[ bodyStyle ]}>
          {children}
        </View>
        <View style={[styles.footer]}>
          { hideCancelButton
            ? <></>
            : <TouchableOpacity
                style={[styles.footerBtn, !hideOkButton ? { borderRightWidth: 1, borderColor: 'lightgray', } : { width: '100%' }]}
                onPress={onCancel}
              >
                <Text>{cancelText}</Text>
              </TouchableOpacity>
          }
          { hideOkButton
            ? <></>
            : <TouchableOpacity style={[styles.footerBtn, !hideCancelButton ? null : { width: '100%' }]} onPress={onOk}>
                <Text>{okText}</Text>
              </TouchableOpacity>
          }
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 100,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalStyle: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderColor: 'lightgray',
    borderTopWidth: 1
  },
  footerBtn: {
    paddingRight: 20,
    paddingLeft: 20,
    paddingBottom: 10,
    paddingTop: 10,
    width: '50%',
    alignItems: 'center'
  }
});
