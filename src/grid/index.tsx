import React, {FunctionComponent, useEffect} from 'react';
import {Props} from './props';
import {Animated, View} from 'react-native';
import styles from './styles';
import Cell from './Cell';
import {CellData} from './Cell/CellData';
import {theme} from '../theme';

const Grid: FunctionComponent<Props> = ({state}) => {

    useEffect(() => {
        state.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                if (cell) {
                    Animated.timing(cell.location, {
                        toValue: {x: theme.CELL_SIZE * cellIndex, y: theme.CELL_SIZE * rowIndex},
                        duration: 150,
                        useNativeDriver: true
                    }).start();
                }
            });
        });
    }, [state]);

    const renderCells = (field: Array<Array<CellData | null>>): Array<JSX.Element> => {
        const cells: Array<JSX.Element> = [];

        for (let rowIndex = 0; rowIndex < field.length; rowIndex++) {
            for (let cellIndex = 0; cellIndex < field[rowIndex].length; cellIndex++) {
                const cell = field[rowIndex][cellIndex];
                if (cell) {
                    cells.push(<Cell value={cell.value} location={cell.location} key={`${rowIndex}-${cellIndex}`}/>);
                }
            }
        }

        return cells;
    };

    return (
        <View style={styles.grid}>
            {
                state.map((row, rowIndex) =>
                    <View key={rowIndex} style={styles.row}>
                        {
                            row.map((cell, cellIndex) =>
                                <View key={rowIndex + '-' + cellIndex} style={styles.cell}/>
                            )
                        }
                    </View>
                )
            }
            {renderCells(state)}
        </View>
    );
};

export default Grid;
