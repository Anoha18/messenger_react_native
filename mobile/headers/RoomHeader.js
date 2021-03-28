import React from 'react';
import { Text, View, StyleSheet, StatusBar } from 'react-native';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import {
  Header,
  Left,
  Right,
  Container,
  Body,
  Button,
  Icon,
  Title,
  Thumbnail
} from 'native-base';

export default (props) => {
  const { onPressBack, params } = props;
  return (
    <Header
      androidStatusBarColor="#fff"
      style={styles.header}
    >
      <Left style={{ flex: 1 }}>
        <Button
          onPress={onPressBack}
          color="black"
          transparent
        >
          <Icon style={{ color: 'black' }} name="arrow-back" />
        </Button>
      </Left>
      <Body style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          lineBreakMode="tail"
          style={styles.headerTitle}
        >
          {params.title || ''}
        </Text>
      </Body>
      <Right style={{ flex: 1 }}>
        {params.renderAvatar
          ? params.renderAvatar()
          : params.avatar
            ? <Thumbnail
                source={{ uri: params.avatar }}
                size={40}
                style={{
                  width: 40,
                  height: 40
                }}
              />
            : <EvilIcon name="user" size={40} />
        }
      </Right>
    </Header>
  )
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  headerTitle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
