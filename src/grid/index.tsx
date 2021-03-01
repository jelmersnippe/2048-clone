import React, {FunctionComponent} from 'react';
import {Props} from './props';
import {Text, View} from 'react-native';
import styles from './styles';

const Grid: FunctionComponent<Props> = ({state}) => {
    return (
        <View>
            {
                state.map((row, rowIndex) =>
                    <View key={rowIndex} style={styles.row}>
                        {
                            row.map((cell, cellIndex) =>
                                <View key={rowIndex + '-' + cellIndex} style={{...styles.cell, backgroundColor: cell > 0 ? 'orange' : 'lightgrey'}}>
                                    {cell > 0 && <Text style={styles.cellText}>{cell}</Text>}
                                </View>
                            )
                        }
                    </View>
                )
            }
        </View>
    );
};

export default Grid;
