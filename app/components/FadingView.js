import React, {useEffect, useRef} from 'react';
import {Animated, Easing} from 'react-native';

const FadingView = ({children}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(Animated.sequence([Animated.timing(
      opacity,
      {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true
      }
    ), Animated.timing(
      opacity,
      {
        toValue: 0,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true
      }
    )])).start();
  }, []);

  return (
    <Animated.View style={{opacity: opacity}}>
      {children}
    </Animated.View>
  );
};

export default FadingView;
