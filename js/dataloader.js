const loadHighScores = async () => {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        console.log("High Scores:", data.HighScores);

    } catch (error) {
        console.error("Erro ao carreagor os dados JSON", error);
    }

};

loadHighScores();