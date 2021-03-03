import React, {FunctionComponent, useEffect} from 'react';
import {Props} from './props';
import {Animated, View} from 'react-native';
import styles from './styles';
import Cell from './Cell';
import {TileData} from './TileData';
import {TILE_SIZE} from '../App';

const Grid: FunctionComponent<Props> = ({state}) => {

    useEffect(() => {
        state.forEach((row, i) => {
            row.forEach((e, j) => {
                if (e) {
                    Animated.timing(e.location, {
                        toValue: {x: TILE_SIZE * j, y: TILE_SIZE * i},
                        duration: 250,
                        useNativeDriver: true
                    }).start();
                }
            });
        });
    }, [state]);

    const renderCells = (field: Array<Array<TileData | null>>): Array<JSX.Element> => {
        const cells: Array<JSX.Element> = [];

        for (let i = 0; i < field.length; i++) {
            for (let j = 0; j < field[i].length; j++) {
                const cell = field[i][j];
                if (cell) {
                    cells.push(<Cell value={cell.value} location={cell.location} key={`${i}-${j}`}/>);
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
                                <View key={rowIndex + '-' + cellIndex} style={{...styles.cell, backgroundColor: 'lightgrey'}}/>
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
