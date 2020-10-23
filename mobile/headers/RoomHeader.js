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
      <StatusBar barStyle="dark-content" />
      <Left style={{ flex: 1 }}>
        <Button
          onPress={onPressBack}
          color="black"
          transparent
        >
          <Icon style={{ color: 'black' }} name="arrow-back" />
        </Button>
      </Left>
      <Body style={{ flex: 0 }}>
        <Title style={styles.headerTitle}>
          {params.title || ''}
        </Title>
      </Body>
      <Right style={{ flex: 1 }}>
          { params.avatar
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
    color: 'black'
  }
});
