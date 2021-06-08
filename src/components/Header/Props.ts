interface Props {
    score: number;
    highScore: number;
    buttons?: Array<{
        icon: string;
        onPress: () => void;
    }>
}

export default Props;
