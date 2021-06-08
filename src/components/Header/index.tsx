import React, {FunctionComponent} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import ScoreBlock from '../ScoreBlock';
import styles from './styles';
import Props from './Props';
import Icon from 'react-native-vector-icons/Foundation';
import {theme} from '../../config/theme';

const Header: FunctionComponent<Props> = ({score, highScore, buttons}) => {
    return (
        <View style={styles.header}>
            <Text style={styles.appName}>{'Tegel\nveger'}</Text>
            <View style={styles.headerDetails}>
                <View style={styles.scoreContainer}>
                    <ScoreBlock label={'Score'} score={score}/>
                    <ScoreBlock label={'Best'} score={highScore}/>
                </View>
                <View style={styles.buttonContainer}>
                    {buttons?.map((button, index) => (
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={button.onPress}
                            key={'header_button_' + index}
                        >
                            <Icon
                                color={theme.colors.lightText}
                                size={20}
                                name={button.icon}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
};

export default Header;
