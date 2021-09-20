const playCard = (state, player, cards) => {
    const playedCards = [];
    state.forEach(playerData => {
        if (playerData.playerId === player) {
            playerData.cards = playerData.cards.filter(card => { 
                cards.has(card) && playedCards.push(card)
                return !cards.has(card)
            })
        }
    })
    return {state, playedCards} 
}

const generateNewDeck = () => {
    const newDeck = [];
    ["S", "H", "C", "D"].forEach(suite => {
        ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"].forEach(value =>  {
            newDeck.push(value + suite);
        })
    })
    
    return newDeck;
}

const deal = (newDeck, players) => {
    const playerData = [];
    
    players.forEach(player => {
        const newPlayer = {};
        newPlayer.playerId = player;
        newPlayer.cards = [];
        playerData.push(newPlayer)
    }) 

    for (let i = 0; i < 52; i++) {
        const random = Math.floor(Math.random() * newDeck.length);
        const card = newDeck[random];
        newDeck.splice(random, 1);
        playerData[i % 4].cards.push(card);
    }

    return playerData;

}

const newGame = (players) => {
    const newDeck = generateNewDeck();
    const playerData = deal(newDeck, players);
    return playerData
}

module.exports = {playCard, newGame}