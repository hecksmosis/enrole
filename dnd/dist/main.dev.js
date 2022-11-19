"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// define gameState class
var GameState =
/*#__PURE__*/
function () {
  function GameState(data) {
    var _this = this;

    _classCallCheck(this, GameState);

    this.players = data.players;
    this.room = data.room;
    this.id = data.id;
    this.map = new Array(100).fill(Array(100));
    this.players.forEach(function (player) {
      if (player.isDM === false) {
        player.x = 0;
        player.y = 0;
        _this.map[player.y][player.x] = player.id;
        player["class"] = '';
        player.race = '';
        player.background = '';
        player.level = 1;
        player.xp = 0;
        player.alignment = '';
        player.str = 0;
        player.dex = 0;
        player.con = 0;
        player["int"] = 0;
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
        player.saves = {
          successes: 0,
          failures: 0
        };
      }
    });
  }

  _createClass(GameState, [{
    key: "setup",
    value: function setup(player, data) {
      this.map[player.y][player.x] = player.id;
      player["class"] = classList.includes(data["class"]) ? data["class"] : classList.random();
      player.race = raceList.includes(data.race) ? data.race : raceList.random();
      player.background = backgroundList.includes(data.background) ? data.background : backgroundList.random(); // TODO: Finish
    }
  }, {
    key: "addPlayer",
    value: function addPlayer(player) {
      this.map[player.y][player.x] = player.id;
      player["class"] = '';
      player.race = '';
      player.background = '';
      player.level = 1;
      player.xp = 0;
      player.alignment = '';
      player.str = 0;
      player.dex = 0;
      player.con = 0;
      player["int"] = 0;
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
      player.saves = {
        successes: 0,
        failures: 0
      };
    }
  }]);

  return GameState;
}();

module.exports = {
  GameState: GameState
};