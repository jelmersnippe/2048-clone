import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import Grid from './grid';
import GestureHandler, {Direction} from './GestureHandler';
import {TileData} from './grid/TileData';

export const TILE_SIZE = 50;

const App = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [field, setField] = useState<Array<Array<TileData | null>>>([
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null]
    ]);

    useEffect(() => {
        if (!gameStarted) {
            spawnRandomTile(field, 2);
            setGameStarted(true);
        }
    }, []);

    const debugLog = (field: Array<Array<TileData | null>>) => {
        for (let row = 0; row < field.length; row++) {
            let rowString = '';
            for (let cell = 0; cell < field[row].length; cell++) {
                rowString += field[row][cell]?.value ?? 0;
                rowString += '\t';
            }
            console.log(rowString);
        }
        console.log('');
    };

    const updateAllTiles = (axis: 'horizontal' | 'vertical', start: number, end: number): boolean => {
        console.log('axis', axis);
        console.log('start', start);
        console.log('end', end);
        if (start === end) {
            return false;
        }

        const updatedField = field;
        let changesMade = 0;

        const horizontalMovement = axis === 'horizontal';

        const rowStart = !horizontalMovement ? start : 0;
        const rowEnd = !horizontalMovement ? end : field.length - 1;

        const cellStart = horizontalMovement ? start : 0;
        const cellEnd = horizontalMovement ? end : field.length - 1;

        const inverse = start > end;
        console.log('inverse', inverse);

        for (
            let rowIndex = rowStart;
            rowEnd > rowStart ? rowIndex <= rowEnd : rowIndex >= rowEnd;
            rowEnd > rowStart ? rowIndex++ : rowIndex--
        ) {

            for (
                let cellIndex = cellStart;
                cellEnd > cellStart ? cellIndex <= cellEnd : cellIndex >= cellEnd;
                cellEnd > cellStart ? cellIndex++ : cellIndex--
            ) {

                if (!updatedField[rowIndex][cellIndex]) {
                    continue;
                }

                console.log('tile');

                let currentIndex = horizontalMovement ? cellIndex : rowIndex;
                const currentCell = updatedField[rowIndex][cellIndex];
                console.log('currentIndex',currentIndex);

                let merged = false;
                let moveAmount = 0;
                while ((inverse ? currentIndex > end : currentIndex < end) || !merged) {
                    const nextIndex = inverse ? currentIndex + 1 : currentIndex - 1;
                    const rowIndexToCheck = horizontalMovement ? rowIndex : nextIndex;
                    const cellIndexToCheck = horizontalMovement ? nextIndex : cellIndex;

                    console.log('nextIndex', nextIndex);

                    if (inverse ? nextIndex > start : nextIndex < start) {
                        console.log('nextIndex is outside of bounds, moving to next tile');
                        break;
                    }

                    if (updatedField[rowIndexToCheck][cellIndexToCheck] !== null && updatedField[rowIndexToCheck][cellIndexToCheck]?.value === currentCell?.value) {
                        console.log('self tile value:', currentCell?.value);
                        console.log('other tile value:', updatedField[rowIndexToCheck][cellIndexToCheck]?.value);
                        updatedField[rowIndexToCheck][cellIndexToCheck] = null;
                        merged = true;
                    }
                    if (updatedField[rowIndexToCheck][cellIndexToCheck] === null) {
                        console.log('free spot, increasing moveAmount');
                        inverse ? moveAmount++ : moveAmount--;
                        inverse ? currentIndex++ : currentIndex--;
                        changesMade++;
                    }
                    else {
                        console.log('no free spot, moving on to next tile');
                        break;
                    }
                }
                if (moveAmount !== 0) {
                    if (merged) {
                        currentCell?.doubleValue();
                    }
                    updatedField[horizontalMovement ? rowIndex : rowIndex + moveAmount][horizontalMovement ? cellIndex + moveAmount : cellIndex] = currentCell;
                    updatedField[rowIndex][cellIndex] = null;
                    console.log(`${rowIndex + 1}, ${cellIndex + 1} -> ${(horizontalMovement ? rowIndex : rowIndex + moveAmount) + 1} , ${(horizontalMovement ? cellIndex + moveAmount : cellIndex) + 1} ${merged ? '(merged)' : ''}`);
                    debugLog(updatedField);
                }
            }
        }

        setField([...updatedField]);

        return changesMade > 0;
    };

    const move = (direction: Direction) => {
        const updatedField = field;

        let changed = false;

        console.log('direction', direction);

        switch (direction) {
            case Direction.LEFT:
                changed = updateAllTiles('horizontal', 0, field.length - 1);
                break;
            case Direction.RIGHT:
                changed = updateAllTiles('horizontal', field.length - 1, 0);
                break;
            case Direction.UP:
                changed = updateAllTiles('vertical', 0, field.length - 1);
                break;
            case Direction.DOWN:
                changed = updateAllTiles('vertical', field.length - 1, 0);
                break;
        }

        if (changed) {
            setTimeout(() => {
                spawnRandomTile(updatedField, 1);
            }, 250);
        }
    };

    const attemptToFillTile = (currentField: Array<Array<TileData | null>>): Array<Array<TileData | null>> => {
        const updatedField = currentField;

        const row = Math.floor(Math.random() * 100) % 4;
        const cell = Math.floor(Math.random() * 100) % 4;

        if (!updatedField[row][cell]) {
            updatedField[row][cell] = new TileData();
            updatedField[row][cell]?.location.setValue({x: cell * TILE_SIZE, y: row * TILE_SIZE});
            return updatedField;
        } else {
            return attemptToFillTile(updatedField);
        }
    };

    const spawnRandomTile = (currentField: Array<Array<TileData | null>>, amount: number) => {
        let updatedField = currentField;

        const filledTileCount = currentField.reduce((acc, cur) => {
            return acc + cur.reduce((acc, cur) => acc + (cur !== null ? 1 : 0), 0);
        }, 0);

        if (filledTileCount >= 16) {
            console.log('No more empty tiles');
            return;
        }

        for (let i = 0; i < amount; i++) {
            updatedField = attemptToFillTile(updatedField);
        }

        setField([...updatedField]);
    };

    return (
        <>
            <StatusBar barStyle={'dark-content'}/>
            <SafeAreaView style={{flex: 1}}>
                <GestureHandler move={(direction: Direction) => move(direction)} containerStyle={styles.mainContainer}>
                    <Grid state={field}/>
                </GestureHandler>
            </SafeAreaView>
        </>
    );
};

export default App;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    box: {
        height: 100,
        width: 100,
        borderRadius: 5,
        marginVertical: 40,
        backgroundColor: '#61dafb',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 14,
        fontWeight: 'bold',
        margin: 8,
        color: '#000',
        textAlign: 'center'
    }
});
