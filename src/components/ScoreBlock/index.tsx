import React, {FunctionComponent} from 'react';
import {Text, View} from 'react-native';
import Props from './Props';
import styles from './styles';

const ScoreBlock: FunctionComponent<Props> = ({label, score}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.score}>{score}</Text>
        </View>
    );
};

export default ScoreBlock;

