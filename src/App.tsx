import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import Grid from './grid';
import GestureHandler, {Direction} from './GestureHandler';
import {CellData} from './grid/Cell/CellData';
import {theme} from './theme';

const emptyField = (): Array<Array<CellData | null>> => {
    const grid: Array<Array<CellData | null>> = [];

    for (let rowIndex = 0; rowIndex < theme.ROW_LENGTH; rowIndex++) {
        const row: Array<CellData | null> = [];

        for (let cell = 0; cell < theme.ROW_LENGTH; cell++) {
            row.push(null);
        }

        grid.push(row);
    }

    return grid;
};


const App = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [field, setField] = useState<Array<Array<CellData | null>>>(emptyField());

    useEffect(() => {
        if (!gameStarted) {
            spawnRandomCell(field, 2);
            setGameStarted(true);
        }
    }, [gameStarted]);

    const debugLog = (fieldToOutput: Array<Array<CellData | null>>) => {
        for (let row = 0; row < fieldToOutput.length; row++) {
            let rowString = '';
            for (let cell = 0; cell < fieldToOutput[row].length; cell++) {
                rowString += fieldToOutput[row][cell]?.value ?? 0;
                rowString += '\t';
            }
            console.log(rowString);
        }
        console.log('');
    };

    const updateAllCells = (axis: 'horizontal' | 'vertical', start: number, end: number): boolean => {
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

                console.log('cell');

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
                        console.log('nextIndex is outside of bounds, moving to next cell');
                        break;
                    }

                    if (updatedField[rowIndexToCheck][cellIndexToCheck] !== null && updatedField[rowIndexToCheck][cellIndexToCheck]?.value === currentCell?.value) {
                        console.log('self cell value:', currentCell?.value);
                        console.log('other cell value:', updatedField[rowIndexToCheck][cellIndexToCheck]?.value);
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
                        console.log('no free spot, moving on to next cell');
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
                changed = updateAllCells('horizontal', 0, theme.ROW_LENGTH - 1);
                break;
            case Direction.RIGHT:
                changed = updateAllCells('horizontal', theme.ROW_LENGTH - 1, 0);
                break;
            case Direction.UP:
                changed = updateAllCells('vertical', 0, theme.ROW_LENGTH - 1);
                break;
            case Direction.DOWN:
                changed = updateAllCells('vertical', theme.ROW_LENGTH - 1, 0);
                break;
        }

        const filledCellCount = updatedField.reduce((acc, cur) => {
            return acc + cur.reduce((acc, cur) => acc + (cur !== null ? 1 : 0), 0);
        }, 0);

        if (changed) {
            setTimeout(() => {
                spawnRandomCell(updatedField, 1);
            }, 250);
        } else if (filledCellCount >= 16) {
            console.log('No more empty cells');
            setField(emptyField());
            setGameStarted(false);
        }
    };

    const attemptToFillCell = (currentField: Array<Array<CellData | null>>): Array<Array<CellData | null>> => {
        const updatedField = currentField;

        const row = Math.floor(Math.random() * 100) % theme.ROW_LENGTH;
        const cell = Math.floor(Math.random() * 100) % theme.ROW_LENGTH;

        if (!updatedField[row][cell]) {
            updatedField[row][cell] = new CellData();
            updatedField[row][cell]?.location.setValue({x: cell * theme.CELL_SIZE, y: row * theme.CELL_SIZE});
            return updatedField;
        } else {
            return attemptToFillCell(updatedField);
        }
    };

    const spawnRandomCell = (currentField: Array<Array<CellData | null>>, amount: number) => {
        let updatedField = currentField;

        for (let i = 0; i < amount; i++) {
            updatedField = attemptToFillCell(updatedField);
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
