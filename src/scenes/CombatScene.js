import { gameState } from '../gameState.js';

export default class CombatScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CombatScene' });
        this.selectedCharacter = null;
        this.enemy = {
            name: 'Apple',
            image: 'apple.png',
            health: 1000,
            speed: 5,
            attacks: ['Bite', 'Scratch', 'Roar']
        };
        this.combatEnded = false;
    }

    preload() {
        gameState.party.forEach(member => {
            this.load.image(member.name, 'assets/images/' + member.image);
        });
        this.load.image(this.enemy.name, 'assets/images/' + this.enemy.image);
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

        // Text area for combat results
        this.resultText = this.add.text(10, boxY + 10, '', {
            fontSize: '16px',
            fill: '#000',
            wordWrap: { width: width - 20 }
        });

        // Display party member images on the left side
        this.displayPartyMembers();

        // Display enemy on the right side
        this.enemy.imageObject = this.add.image(width - 50, height / 2, this.enemy.name);

        // Start the combat loop
        this.startCombat();
    }

    displayPartyMembers() {
        gameState.party.forEach((member, index) => {
            const x = 50; // Fixed x position for all images
            const y = 30 + index * 60; // y position spaced by 60 pixels
            member.imageObject = this.add.image(x, y, member.name);
        });
    }

    startCombat() {
        // Combine party members and enemy into a single array for turn order
        this.combatants = [...gameState.party, this.enemy];

        // Sort combatants by speed in descending order
        this.combatants.sort((a, b) => b.speed - a.speed);

        // Start the turn loop
        this.turnIndex = 0;
        this.nextTurn();
    }

    nextTurn() {
        if (this.combatEnded) {
            return;
        }

        if (this.turnIndex >= this.combatants.length) {
            // Reset turn index if we've gone through all combatants
            this.turnIndex = 0;
        }

        const combatant = this.combatants[this.turnIndex];

        if (combatant.health > 0) {
            this.takeAction(combatant);
        } else {
            this.turnIndex++;
            this.nextTurn();
        }
    }

    takeAction(combatant) {
        if (combatant === this.enemy) {
            this.enemyAction(combatant);
        } else {
            this.characterAction(combatant);
        }
    }

    characterAction(character) {
        const attack = Phaser.Utils.Array.GetRandom(character.attacks);
        this.printResult(`${character.name} performs ${attack}`);
        this.performAttack(character, attack, this.enemy);

        this.time.delayedCall(1000, () => {
            this.turnIndex++;
            this.nextTurn();
        });
    }

    enemyAction(enemy) {
        const target = Phaser.Utils.Array.GetRandom(gameState.party.filter(member => member.health > 0));
        const attack = Phaser.Utils.Array.GetRandom(enemy.attacks);
        if (target) {
            this.printResult(`${enemy.name} performs ${attack} on ${target.name}`);
            this.performAttack(enemy, attack, target);

            this.time.delayedCall(1000, () => {
                this.turnIndex++;
                this.nextTurn();
            });
        }
    }

    performAttack(attacker, attackType, target) {
        if (this.combatEnded) {
            return;
        }

        const damage = Math.floor(Math.random() * 20) + 5; // Random damage between 5 and 25
        target.health -= damage;
        this.printResult(`${target.name} took ${damage} damage. Remaining health: ${target.health}`);
        this.showDamage(target, damage);

        if (target.health <= 0) {
            this.printResult(`${target.name} is defeated!`);
            if (target.imageObject) {
                target.imageObject.setVisible(false);
            }

            // Check for combat end conditions
            if (target === this.enemy) {
                this.enemyDefeated();
            } else if (gameState.party.every(member => member.health <= 0)) {
                this.allPartyMembersDefeated();
            }
        }
    }

    enemyDefeated() {
        this.printResult('Combat won!');
        this.combatEnded = true;
        this.time.delayedCall(2000, () => {
            // Additional logic for combat win, e.g., returning to main menu or starting next encounter
        });
    }

    allPartyMembersDefeated() {
        this.printResult('All party members are defeated!');
        this.combatEnded = true;
        this.time.delayedCall(2000, () => {
            // Additional logic for party defeat, e.g., game over screen or restarting the game
        });
    }

    printResult(message) {
        this.resultText.setText(message); // Set the new message, replacing the old one
    }

    showDamage(target, damage) {
        const x = target.imageObject ? target.imageObject.x : this.enemy.imageObject.x;
        const y = target.imageObject ? target.imageObject.y : this.enemy.imageObject.y;

        const damageText = this.add.text(x, y - 30, `-${damage}`, {
            fontSize: '20px',
            fill: '#ff0000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: damageText,
            y: y - 60,
            alpha: 0,
            duration: 1000,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                damageText.destroy();
            }
        });
    }
}