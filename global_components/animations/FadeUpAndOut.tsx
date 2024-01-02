import React, { useRef, useEffect, useState, Dispatch, SetStateAction } from 'react';
import { Animated, ViewStyle } from 'react-native';
import { IComponentProps, TStateSetter } from '../../globalTypes&Interfaces';



interface IFadeUpAndOut {
    _willFadeIn: [boolean, TStateSetter<boolean>],
    takeContainerOffOfVirutalDom: null | (() => void),
    duration?: number,
    delayMs?: number,
    willFadeOut: boolean,
    dynamicStyles?: ViewStyle,
    endTranslateNum?: number,
    startingOpacity?: number,
}

const FadeUpAndOut = ({
    children,
    _willFadeIn,
    takeContainerOffOfVirutalDom,
    duration = 1000,
    delayMs = 0,
    willFadeOut,
    dynamicStyles = {},
    endTranslateNum = 0,
    startingOpacity = 0,
}: IComponentProps & IFadeUpAndOut) => {
    const x = useState(false)
    const opacity = useRef(new Animated.Value(startingOpacity)).current;
    const translateY = useRef(new Animated.Value(50)).current;
    const [willFadeLayoutIn, setWillFadeLayoutIn] = _willFadeIn


    useEffect(() => {
        if (willFadeLayoutIn) {
            const animation = Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: endTranslateNum,
                    duration,
                    useNativeDriver: true,
                })
            ]);

            delayMs ? setTimeout(() => animation.start(), delayMs) : animation.start();
            setWillFadeLayoutIn(false);
        }
    }, [willFadeLayoutIn]);

    useEffect(() => {
        if (willFadeOut) {
            const animation = Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 0,
                    duration,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 50,
                    duration,
                    useNativeDriver: true,
                })
            ]);

            if (takeContainerOffOfVirutalDom) {
                takeContainerOffOfVirutalDom()
            }

            animation.start()
        }
    }, [willFadeOut])

    return (
        <Animated.View style={{ ...dynamicStyles, opacity, transform: [{ translateY }] }}>
            {children}
        </Animated.View>
    );
};

export default FadeUpAndOut;
