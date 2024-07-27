// gameState.js
export let gameState = {
    inventory: ['Potion', 'Elixir', 'Herb', 'Antidote'],
    party: [
        {
            name: 'Broccoli',
            image: 'broccoli.png',
            health: 100,
            speed: 10,
            attack: 15,
            armor: 5,
            attacks: ['Slash', 'Headbutt', 'Leaf Tornado', 'Green Blast']
        },
        {
            name: 'Cauliflower',
            image: 'cauliflower.png',
            health: 120,
            speed: 8,
            attack: 10,
            armor: 7,
            attacks: ['Smash', 'Root Strike', 'White Wave', 'Cabbage Cannon']
        },
        {
            name: 'Carrot',
            image: 'carrot.png',
            health: 90,
            speed: 12,
            attack: 20,
            armor: 4,
            attacks: ['Pierce', 'Carrot Chop', 'Orange Storm', 'Veggie Vortex']
        }
    ]
};
