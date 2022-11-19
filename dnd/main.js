// define gameState class
class GameState {
    constructor(data) {
        this.players = data.players;
        this.room = data.room;
        this.id = data.id;
        this.map = new Array(100).fill(Array(100));
        this.players.forEach((player) => {
            if (player.isDM === false) {
                player.x = 0;
                player.y = 0;
                this.map[player.y][player.x] = player.id;
                player.class = '';
                player.race = '';
                player.background = '';
                player.level = 1;
                player.xp = 0;
                player.alignment = '';
                player.str = 0;
                player.dex = 0;
                player.con = 0;
                player.int = 0;
                player.wis = 0;
                player.cha = 0;
                player.savingThrows = [];
                player.skills = [];
                player.proficiencyBonus = 2;
                player.initiative = 0;
                player.speed = 0;
                player.maxHitPoints = 0;
                player.hitPoints = 0;
                player.hitDice = 0;
                player.armorClass = 0;
                player.passivePerception = 0;
                player.proficiencies = [];
                player.languages = [];
                player.equipment = [];
                player.attacks = [];
                player.spells = [];
                player.features = [];
                player.personalityTraits = '';
                player.ideals = '';
                player.bonds = '';
                player.flaws = '';
                player.saves = { successes: 0, failures: 0 };
            }
        });
    }
    setup(player, data) {
        this.map[player.y][player.x] = player.id;
        player.class = classList.includes(data.class) ? data.class : classList.random();
        player.race = raceList.includes(data.race) ? data.race : raceList.random();
        player.background = backgroundList.includes(data.background) ? data.background : backgroundList.random();
        // TODO: Finish
    }
    addPlayer(player) {
        this.map[player.y][player.x] = player.id;
        player.class = '';
        player.race = '';
        player.background = '';
        player.level = 1;
        player.xp = 0;
        player.alignment = '';
        player.str = 0;
        player.dex = 0;
        player.con = 0;
        player.int = 0;
        player.wis = 0;
        player.cha = 0;
        player.savingThrows = [];
        player.skills = [];
        player.proficiencyBonus = 2;
        player.initiative = 0;
        player.speed = 0;
        player.maxHitPoints = 0;
        player.hitPoints = 0;
        player.hitDice = 0;
        player.armorClass = 0;
        player.passivePerception = 0;
        player.proficiencies = [];
        player.languages = [];
        player.equipment = [];
        player.attacks = [];
        player.spells = [];
        player.features = [];
        player.personalityTraits = '';
        player.ideals = '';
        player.bonds = '';
        player.flaws = '';
        player.saves = { successes: 0, failures: 0 };
    }
}

module.exports = { GameState };