import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CardWithRoundedCorners = ({
  title,
  content,
  onPress,
  style,
  titleStyle,
  contentStyle,
  cornerRadius = 16,
  backgroundColor = '#fff',
  elevation = 4,
  padding = 16,
}) => {
  const cardStyle = {
    ...styles.card,
    borderRadius: cornerRadius,
    backgroundColor: backgroundColor,
    elevation: elevation,
    padding: padding,
    ...style,
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={cardStyle}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
      {typeof content === 'string' ? (
        <Text style={[styles.content, contentStyle]}>{content}</Text>
      ) : (
        content
      )}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    marginVertical: 8,
    marginHorizontal: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: '#333',
  },
});

export default CardWithRoundedCorners; 