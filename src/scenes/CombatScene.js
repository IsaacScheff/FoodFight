import { gameState } from '../gameState.js';
export default class CombatScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CombatScene' });
        this.selectedCharacter = null;
    }

    preload() {
        gameState.party.forEach(member => {
            this.load.image(member.name, 'assets/images/' + member.image);
        });
    }

    create() {
        // Screen dimensions
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Menu box dimensions
        const boxHeight = height / 4;
        const boxY = height - boxHeight;

        // Draw menu box
        this.menuBox = this.add.graphics();
        this.menuBox.fillStyle(0xf5f5f5, 1); // Off-white color
        this.menuBox.fillRect(0, boxY, width, boxHeight);

        // Display party member images on the left side
        this.displayPartyMembers();

        // Create main menu buttons
        this.mainMenuButtons = [
            this.createButton(width / 8, boxY + 35, 'Attack', () => this.showAttackOptions()),
            this.createButton(3 * width / 8, boxY + 35, 'Items', () => this.showItemOptions()),
            this.createButton(5 * width / 8, boxY + 35, 'Option 3', () => this.showOption3()),
            this.createButton(7 * width / 8, boxY + 35, 'Option 4', () => this.showOption4())
        ];

        // Group for sub-options
        this.subOptionsGroup = this.add.group();

        // Initially hide sub-options
        this.subOptionsGroup.setVisible(false);

        // Create cancel button and hide it initially
        this.cancelButton = this.createCancelButton(30, boxY + 35, 'Cancel', () => this.showMainMenu());
        this.cancelButton.button.setVisible(false);
        this.cancelButton.text.setVisible(false);
    }

    displayPartyMembers() {
        gameState.party.forEach((member, index) => {
            const x = 50; // Fixed x position for all images
            const y = 30 + index * 60; // y position spaced by 100 pixels
            const characterImage = this.add.image(x, y, member.name).setInteractive();

            characterImage.on('pointerdown', () => {
                this.selectCharacter(member);
            });
        });
    }

    selectCharacter(member) {
        console.log(`Selected character: ${member.name}`);
        this.selectedCharacter = member;
        this.showAttackOptions();
    }

    showAttackOptions() {
        if (!this.selectedCharacter) {
            console.log('No character selected');
            return;
        }

        // Hide main menu buttons and texts
        this.mainMenuButtons.forEach(pair => {
            pair.button.setVisible(false);
            pair.text.setVisible(false);
        });

        // Show cancel button
        this.cancelButton.button.setVisible(true);
        this.cancelButton.text.setVisible(true);

        // Create attack options based on the selected character
        const width = this.cameras.main.width;
        const boxY = this.cameras.main.height - this.cameras.main.height / 4;

        this.selectedCharacter.attacks.forEach((attack, index) => {
            const buttonX = ((index + 1) * width) / 5;
            const pair = this.createButton(buttonX, boxY + 35, attack, () => this.performAttack(attack));
            this.subOptionsGroup.add(pair.button);
            this.subOptionsGroup.add(pair.text);
        });

        this.subOptionsGroup.setVisible(true);
    }

    showItemOptions() {
        // Hide main menu buttons and texts
        this.mainMenuButtons.forEach(pair => {
            pair.button.setVisible(false);
            pair.text.setVisible(false);
        });

        // Show cancel button
        this.cancelButton.button.setVisible(true);
        this.cancelButton.text.setVisible(true);

        // Create item options based on the global inventory
        const width = this.cameras.main.width;
        const boxY = this.cameras.main.height - this.cameras.main.height / 4;

        gameState.inventory.forEach((item, index) => {
            const buttonX = ((index + 1) * width) / 5;
            const pair = this.createButton(buttonX, boxY + 35, item, () => this.useItem(item));
            this.subOptionsGroup.add(pair.button);
            this.subOptionsGroup.add(pair.text);
        });

        this.subOptionsGroup.setVisible(true);
    }

    showOption3() {
        console.log("show option 3");
    }

    showOption4() {
        console.log("show option 4");
    }

    createButton(x, y, text, callback) {
        const buttonStyle = {
            fill: '#ffffff',
            font: '20px Arial',
            align: 'center'
        };

        let button = this.add.rectangle(x, y, 80, 50, 0x000000, 0.8).setInteractive({ useHandCursor: true });
        let buttonText = this.add.text(x, y, text, buttonStyle).setOrigin(0.5);

        button.on('pointerover', () => { button.setFillStyle(0x555555, 0.8); });
        button.on('pointerout', () => { button.setFillStyle(0x000000, 0.8); });
        button.on('pointerdown', callback);

        return { button, text: buttonText };
    }

    createCancelButton(x, y, text, callback) {
        const buttonStyle = {
            fill: '#ffffff',
            font: '10px Arial',
            align: 'center'
        };

        let button = this.add.rectangle(x, y, 40, 50, 0xff0000, 0.8).setInteractive({ useHandCursor: true });
        let buttonText = this.add.text(x, y, text, buttonStyle).setOrigin(0.5);

        button.on('pointerover', () => { button.setFillStyle(0xaa0000, 0.8); });
        button.on('pointerout', () => { button.setFillStyle(0xff0000, 0.8); });
        button.on('pointerdown', callback);

        return { button, text: buttonText };
    }

    performAttack(attackType) {
        console.log(`Performed attack: ${attackType}`);
        // Show main menu after selecting an attack
        this.showMainMenu();
    }

    useItem(itemName) {
        console.log(`Used item: ${itemName}`);
        // Show main menu after using an item
        this.showMainMenu();
    }

    showMainMenu() {
        // Hide sub-options
        this.subOptionsGroup.clear(true, true);
        this.subOptionsGroup.setVisible(false);

        // Hide cancel button
        this.cancelButton.button.setVisible(false);
        this.cancelButton.text.setVisible(false);

        // Show main menu buttons and texts
        this.mainMenuButtons.forEach(pair => {
            pair.button.setVisible(true);
            pair.text.setVisible(true);
        });
    }
}