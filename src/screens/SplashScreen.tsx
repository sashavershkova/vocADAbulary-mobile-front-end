import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Animated,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import bgImage from '../assets/images/splash-bg.jpeg';
import { splashStyles } from '../styles/splashStyles';

const { height, width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen = ({ navigation }: Props) => {
  const [phase, setPhase] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const fadeAnim = new Animated.Value(0);

  const texts = [
    'mADAms team presents...',
    'NEW TECH VOICE',
    'our stickman will help you to find your own.',
  ];

  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;
    let delayBeforeNextPhase: NodeJS.Timeout;

    const typeText = (text: string) => {
      let i = 0;
      setDisplayText('');
      typingTimeout = setInterval(() => {
        setDisplayText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(typingTimeout);
          delayBeforeNextPhase = setTimeout(() => {
            if (phase < texts.length - 1) {
              setPhase((prev) => prev + 1);
            } else {
              navigation.replace('Login');
            }
          }, 3000);
        }
      }, 80);
    };

    typeText(texts[phase]);

    return () => {
      clearInterval(typingTimeout);
      clearTimeout(delayBeforeNextPhase);
    };
  }, [phase]);

  return (
    <ImageBackground source={bgImage} style={splashStyles.background} resizeMode="cover">
      <View style={splashStyles.overlay}>
        <Animated.Text
          style={phase === 2 ? splashStyles.smallText : splashStyles.mainText}
        >
          {displayText}
        </Animated.Text>
      </View>
    </ImageBackground>
  );
};

export default SplashScreen;
