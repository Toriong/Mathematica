import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import { IComponentProps } from '../globalTypes&Interfaces';

interface IProps extends IComponentProps {
    duration?: number
}

const PulseWrapper = ({ children, style, duration = 500 }: IProps) => {
    const [scale] = useState(new Animated.Value(1));

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scale, { toValue: 1.2, duration: duration, useNativeDriver: false }),
                Animated.timing(scale, { toValue: 1, duration: duration, useNativeDriver: false }),
            ]),
        ).start();
    }, [scale]);

    return (
        <Animated.View style={[style, { transform: [{ scale }] }]}>
            {children}
        </Animated.View>
    );
};

export default PulseWrapper;
