import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import globalStyle from '../styles/globalStyle';

export function FilledButton({title, style, onPress}) {

  return (
    <TouchableOpacity
      style={[styles.container, {backgroundColor: '#966EAF'}, style]}
      onPress={onPress}>
      <Text style={[globalStyle.font, styles.text]}>{title.toUpperCase()}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontFamily:'FjallaOne-Regular'
  },
});
