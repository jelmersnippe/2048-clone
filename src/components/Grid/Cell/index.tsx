import {Animated, Text} from 'react-native';
import React, {FunctionComponent} from 'react';
import styles from './styles';
import {theme} from '../../../config/theme';

interface Props {
    value: number;
    location: Animated.ValueXY;
}

const Cell: FunctionComponent<Props> = ({value, location}) => {
    return (
        <Animated.View style={{
            ...styles.cell,
            backgroundColor: theme.colors[value.toString()] ?? theme.colors['2'],
            transform: [
                {translateX: location.x},
                {translateY: location.y}
            ]
        }}>
            <Text style={styles.cellText}>{value}</Text>
        </Animated.View>
    );
};

export default Cell;
