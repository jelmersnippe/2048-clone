import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, Text} from 'react-native';
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
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (!gameStarted) {
            spawnRandomCell(field, 2);
            setGameStarted(true);
        }
    }, []);

    const updateAllCells = (axis: 'horizontal' | 'vertical', start: number, end: number): boolean => {
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

                let currentIndex = horizontalMovement ? cellIndex : rowIndex;
                const currentCell = updatedField[rowIndex][cellIndex];

                let merged = false;
                let moveAmount = 0;
                while ((inverse ? currentIndex > end : currentIndex < end) || !merged) {
                    const nextIndex = inverse ? currentIndex + 1 : currentIndex - 1;
                    const rowIndexToCheck = horizontalMovement ? rowIndex : nextIndex;
                    const cellIndexToCheck = horizontalMovement ? nextIndex : cellIndex;

                    if (inverse ? nextIndex > start : nextIndex < start) {
                        break;
                    }

                    if (updatedField[rowIndexToCheck][cellIndexToCheck] !== null && updatedField[rowIndexToCheck][cellIndexToCheck]?.value === currentCell?.value) {
                        updatedField[rowIndexToCheck][cellIndexToCheck] = null;
                        merged = true;
                    }
                    if (updatedField[rowIndexToCheck][cellIndexToCheck] === null) {
                        inverse ? moveAmount++ : moveAmount--;
                        inverse ? currentIndex++ : currentIndex--;
                        changesMade++;
                    }
                    else {
                        break;
                    }
                }
                if (moveAmount !== 0) {
                    if (merged && currentCell) {
                        currentCell.doubleValue();
                        setScore(score + currentCell.value);
                    }
                    updatedField[horizontalMovement ? rowIndex : rowIndex + moveAmount][horizontalMovement ? cellIndex + moveAmount : cellIndex] = currentCell;
                    updatedField[rowIndex][cellIndex] = null;
                }
            }
        }

        setField([...updatedField]);

        return changesMade > 0;
    };

    const move = (direction: Direction) => {
        if (!gameStarted) {
            return;
        }

        const updatedField = field;

        let changed = false;

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
            <SafeAreaView style={{...styles.mainContainer, flex: 1}}>
                <Text>Score: {score}</Text>
                <TouchableOpacity
                    style={styles.replayButton}
                    onPress={() => {
                        spawnRandomCell(emptyField(), 2);
                        setScore(0);
                        setGameStarted(true);
                    }}
                >
                    <Text style={styles.replayButtonText}>Replay</Text>
                </TouchableOpacity>
                <GestureHandler field={field} move={(direction: Direction) => move(direction)} containerStyle={styles.mainContainer}>
                    <Grid state={field}/>
                </GestureHandler>
            </SafeAreaView>
        </>
    );
};

export default App;

const styles = StyleSheet.create({
    mainContainer: {
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
    },
    replayButton: {
        borderWidth: 1,
        marginBottom: 40
    },
    replayButtonText: {
        fontSize: 24,
        textTransform: 'capitalize'
    }
});
