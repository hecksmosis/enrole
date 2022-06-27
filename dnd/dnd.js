// dnd weapons with damage and qualities
const weapons = [
    { name: "Club", damage: "1d4", qualities: ["light", "blunted"], type: "simple melee" },
    { name: "Dagger", damage: "1d4", qualities: ["light", "finesse", "thrown"], range: "20/60", type: "simple melee" },
    { name: "Greatclub", damage: "1d8", qualities: ["two-handed"], type: "simple melee" },
    { name: "Handaxe", damage: "1d6", qualities: ["light", "thrown"], range: "20/60", type: "simple melee" },
    { name: "Javelin", damage: "1d6", qualities: ["light", "thrown"], range: "30/120", type: "simple melee" },
    { name: "Light hammer", damage: "1d4", qualities: ["light", "thrown"], range: "20/60", type: "simple melee" },
    { name: "Mace", damage: "1d6", qualities: ["blunted"], type: "simple melee" },
    { name: "Quarterstaff", damage: "1d6", qualities: ["versatile"], vdamage: "1d8", type: "simple melee" },
    { name: "Sickle", damage: "1d4", qualities: ["light", "finesse"], type: "simple melee" },
    { name: "Spear", damage: "1d6", qualities: ["thrown", "versatile"], vdamage: "1d8", range: "20/60", type: "simple melee" },
    { name: "Light crossbow", damage: "1d8", qualities: ["ammo", "loading", "two-handed"], range: "80/320", type: "simple ranged" },
    { name: "Dart", damage: "1d4", qualities: ["ammo", "finesse", "thrown"], range: "20/60", type: "simple ranged" },
    { name: "Shortbow", damage: "1d6", qualities: ["ammo", "two-handed"], range: "80/320", type: "simple ranged" },
    { name: "Sling", damage: "1d4", qualities: ["ammo", "thrown"], range: "30/120", type: "simple ranged" },
    { name: "Battleaxe", damage: "1d8", qualities: ["versatile"], vdamage: "1d10", type: "martial melee" },
    { name: "Flail", damage: "1d8", qualities: ["blunted", "reach", "two-handed"], type: "martial melee" },
    { name: "Glaive", damage: "1d10", qualities: ["heavy", "reach", "two-handed"], type: "martial melee" },
    { name: "Greataxe", damage: "1d12", qualities: ["heavy", "two-handed"], type: "martial melee" },
    { name: "Greatsword", damage: "2d6", qualities: ["heavy", "two-handed"], type: "martial melee" },
    { name: "Halberd", damage: "1d10", qualities: ["heavy", "reach", "two-handed"], type: "martial melee" },
    { name: "Lance", damage: "1d12", qualities: ["heavy", "reach", "two-handed"], type: "martial melee" },
    { name: "Longsword", damage: "1d8", qualities: ["heavy", "versatile"], vdamage: "1d10", type: "martial melee" },
    { name: "Maul", damage: "2d6", qualities: ["heavy", "two-handed"], type: "martial melee" },
    { name: "Morningstar", damage: "1d8", qualities: ["heavy", "versatile"], vdamage: "1d10", type: "martial melee" },
    { name: "Pike", damage: "1d10", qualities: ["heavy", "reach", "two-handed"], type: "martial melee" },
    { name: "Rapier", damage: "1d8", qualities: ["finesse", "light", "thrown"], range: "20/60", type: "martial melee" },
    { name: "Scimitar", damage: "1d6", qualities: ["finesse", "light"], type: "martial melee" },
    { name: "Shortsword", damage: "1d6", qualities: ["finesse", "light", "thrown"], type: "martial melee" },
    { name: "Trident", damage: "1d6", qualities: ["thrown", "versatile"], vdamage: "1d8", range: "20/60", type: "martial melee" },
    { name: "War pick", damage: "1d8", qualities: ["heavy", "two-handed"], type: "martial melee" },
    { name: "Warhammer", damage: "1d8", qualities: ["heavy", "versatile"], vdamage: "1d10", type: "martial melee" },
    { name: "Whip", damage: "1d4", qualities: ["finesse", "reach"], type: "martial melee" },
    { name: "Blowgun", damage: "1", qualities: ["ammo", "loading", "thrown"], range: "25/100", type: "martial ranged" },
    { name: "Crossbow, hand", damage: "1d6", qualities: ["ammo", "light", "loading", "two-handed"], range: "80/320", type: "martial ranged" },
    { name: "Crossbow, heavy", damage: "1d10", qualities: ["ammo", "heavy", "loading", "two-handed"], range: "100/400", type: "martial ranged" },
    { name: "Longbow", damage: "1d8", qualities: ["ammo", "heavy", "two-handed"], range: "150/600", type: "martial ranged" },
    { name: "Net", damage: "0", qualities: ["special"], type: "martial ranged" },
];

// weapon class
class Weapon {
    constructor(name) {
        this.name = name;
        this.damage = weapons.find(weapon => weapon.name === name).damage;
        this.qualities = weapons.find(weapon => weapon.name === name).qualities;
        this.type = weapons.find(weapon => weapon.name === name).type;
        this.range = weapons.find(weapon => weapon.name === name).range || "";
        this.vdamage = weapons.find(weapon => weapon.name === name).vdamage || "";
    }
    static byType(type) {
        var wlist = weapons.filter(weapon => weapon.type === type);
        wlist.forEach(weapon => {
            return new Weapon(weapon.name);
        });
        return wlist;
    }
    keys() {
        return Object.keys(this);
    }
}

// dnd armor and shields
const armors = [
    { name: "Padded", ac: 11, qualities: ["dexterity", "disadvantage"], type: "light", weight: 8 },
    { name: "Leather", ac: 11, qualities: ["dexterity"], type: "light", weight: 10 },
    { name: "Studded leather", ac: 12, qualities: ["dexterity"], type: "light", weight: 13 },
    { name: "Hide", ac: 12, qualities: ["dexterity"], type: "medium", weight: 12 },
    { name: "Chain shirt", ac: 13, qualities: ["dexterity"], type: "medium", weight: 20 },
    { name: "Scale mail", ac: 14, qualities: ["dexterity", "disadvantage"], type: "medium", weight: 45 },
    { name: "Breastplate", ac: 14, qualities: ["dexterity"], type: "medium", weight: 20 },
    { name: "Half plate", ac: 15, qualities: ["dexterity", "disadvantage"], type: "medium", weight: 40 },
    { name: "Ring mail", ac: 14, qualities: ["disadvantage"], type: "heavy", weight: 40 },
    { name: "Chain mail", ac: 16, qualities: ["disadvantage"], type: "heavy", strength: 13, weight: 55 },
    { name: "Splint", ac: 17, qualities: ["disadvantage"], type: "heavy", strength: 15, weight: 60 },
    { name: "Plate", ac: 18, qualities: ["disadvantage"], type: "heavy", strength: 15, weight: 65 },
    { name: "Shield", ac: 2, qualities: ["shield"], type: "shield", weight: 6 },
];

// armor class
class Armor {
    constructor(name) {
        this.name = name;
        this.ac = armors.find(armor => armor.name === name).ac;
        this.qualities = armors.find(armor => armor.name === name).qualities;
        this.type = armors.find(armor => armor.name === name).type;
        this.weight = armors.find(armor => armor.name === name).weight;
        this.strength = armors.find(armor => armor.name === name).strength || "";
    }
    static byType(type) {
        var alist = armors.filter(armor => armor.type === type);
        alist.forEach(armor => {
            return new Armor(armor.name);
        });
        return alist;
    }
    keys() {
        return Object.keys(this);
    }
}

// dnd packs
const packs = [{
        name: "Burglar's Pack",
        price: "16gp",
        items: [
            "Backpack",
            "1000 ball bearings",
            "10ft of string",
            "Bell",
            "5 candles",
            "Crowbar",
            "Hammer",
            "10 pitons",
            "Hooded lantern",
            "2 flasks of oil",
            "5 days of rations",
            "Tinderbox",
            "Waterskin",
            "50ft of hempen rope"
        ]
    },
    {
        name: "Diplomat's Pack",
        price: "39gp",
        items: [
            "Chest",
            "Fine clothes",
            "2 cases for maps and scrolls",
            "Bottle of ink",
            "Ink pen",
            "Lamp",
            "2 flasks of oil",
            "10 sheets of paper",
            "Vial of perfume",
            "Sealing wax",
            "Soap"
        ]
    },
    {
        name: "Dungeoneer's Pack",
        price: "12gp",
        items: [
            "Backpack",
            "Crowbar",
            "Hammer",
            "10 pitons",
            "10 torches",
            "10 days of rations",
            "50ft of hempen rope",
            "Waterskin",
            "Tinderbox"
        ]
    },
    {
        name: "Entertainer's Pack",
        price: "40gp",
        items: [
            "Backpack",
            "Bedroll",
            "2 costumes",
            "5 candles",
            "5 days of rations",
            "Waterskin",
            "Disguise kit"
        ]
    },
    {
        name: "Explorer's Pack",
        price: "10gp",
        items: [
            "Backpack",
            "Bedroll",
            "Mess kit",
            "Tinderbox",
            "10 torches",
            "10 days of rations",
            "Waterskin",
            "50ft of hempen rope"
        ]
    },
    {
        name: "Priest's Pack",
        price: "19gp",
        items: [
            "Backpack",
            "Blanket",
            "10 candles",
            "Tinderbox",
            "Alms box",
            "2 blocks of incense",
            "Censer",
            "Vestments",
            "2 days of rations",
            "Waterskin"
        ]
    },
    {
        name: "Scholar's Pack",
        price: "40gp",
        items: [
            "Backpack",
            "Book of lore",
            "Bottle of ink",
            "Ink pen",
            "10 sheets of parchment",
            "Little bag of sand",
            "Small knife"
        ]
    }
];

class Pack {
    constructor(name) {
        this.name = name;
        this.price = packs.find(pack => pack.name === name).price;
        this.items = packs.find(pack => pack.name === name).items;
    }
    keys() {
        return Object.keys(this);
    }
}

// Item class
class Item {
    constructor(name) {
        this.name = name;
    }
    keys() {
        return Object.keys(this);
    }
}


// dnd classes with its characteristics
const classList = [{
        name: "Barbarian",
        hitDice: 12,
        hitPoints: 12,
        armorProficiencies: Armor.byType("light").concat(Armor.byType("medium")).concat(Armor.byType("shield")),
        weaponProficiencies: Weapon.byType("simple melee").concat(Weapon.byType("simple ranged")).concat(Weapon.byType("martial melee")).concat(Weapon.byType("martial ranged")),
        toolProficiencies: ["None"],
        savingThrowProficiencies: ["Strength", "Constitution"],
        skillProficiencies: ["Athletics", "Intimidation", "Nature", "Perception"],
        skillProficiencyQuantity: 2,
        choices: [{
                choice: Weapon.byType("martial melee"),
            },
            {
                choice: Weapon.byType("simple melee").concat(new Weapon("Handaxe")),
            }
        ],
        packs: [new Pack("Explorer's Pack")],
        abilities: [{
                name: "Rage",
                desc: "In battle, you fight with primal ferocity. On your turn, you can enter a rage as a bonus action. While raging, you gain the following benefits if you aren't wearing heavy armor:",
                advantages: [
                    "You have advantage on Strength checks and Strength saving throws.",
                    "You have resistance to bludgeoning, piercing, and slashing damage.",
                    "You can make a melee weapon attack as a bonus action on each of your turns after you rage. If you do so, you gain the benefits of the attack.",
                    "You have advantage on melee weapon attack rolls against enemies that are below your speed."
                ],
                disadvantages: [
                    "You can't cast spells while raging.",
                ]
            },
            {
                name: "Unarmored Defense",
                desc: "While you are not wearing any armor, your Armor Class equals 10 + your Dexterity modifier + your Constitution modifier. You can use a shield and still gain this benefit.",
            }
        ]
    },
    {
        name: "Bard",
        hitDice: 8,
        hitPoints: 8,
        armorProficiencies: Armor.byType("light").concat(Armor.byType("medium")).concat(Armor.byType("shield")),
        weaponProficiencies: Weapon.byType("simple melee").concat(Weapon.byType("simple ranged")).concat(new Weapon("Crossbow, hand")).concat(new Weapon("Longsword")).concat(new Weapon("Rapier")).concat(new Weapon("Shortsword")),
        toolProficiencies: ["c: Three musical instruments"],
        savingThrowProficiencies: ["Dexterity", "Charisma"],
        skillProficiencies: ["Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception", "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth"],
        skillProficiencyQuantity: 3,
        packs: [new Pack("Diplomat's Pack"), new Pack("Entertainer's Pack")],
        choices: [{
                choice: Weapon.byType("simple melee").concat(new Weapon("Rapier")).concat(new Weapon("Longsword"))
            },
            {
                choice: ["c: One musical instrument"],
            },
            {
                choice: [new Armor("Leather")],
            },
            {
                choice: [new Weapon("Dagger")],
            }
        ],
        abilities: [{
            name: "Bardic Inspiration",
            desc: "You can inspire others through stirring words or music. To do so, you use a bonus action on your turn to choose one creature other than yourself within 60 feet of you. That creature gains one Bardic Inspiration die, a d6. Once within the next 10 minutes, the creature can roll the die and add the number rolled to one ability check, attack roll, or saving throw it makes. The creature can wait until after its next turn to do so. Once the Bardic Inspiration die is rolled, it is lost. A creature can have only one Bardic Inspiration die at a time. You can use this feature a number of times equal to your Charisma modifier (a minimum of once). You regain any expended uses when you finish a long rest.",
        }]
    },
    {
        name: "Cleric",
        hitDice: 8,
        hitPoints: 8,
        armorProficiencies: Armor.byType("light").concat(Armor.byType("medium")).concat(Armor.byType("shield")),
        weaponProficiencies: Weapon.byType("simple melee").concat(Weapon.byType("simple ranged")).concat(new Weapon("Crossbow, hand")).concat(new Weapon("Dagger")).concat(new Weapon("Mace")).concat(new Weapon("Quarterstaff")).concat(new Weapon("Scimitar")).concat(new Weapon("Sickle")).concat(new Weapon("Warhammer")),
        toolProficiencies: ["None"],
        savingThrowProficiencies: ["Wisdom", "Charisma"],
        skillProficiencies: ["History", "Insight", "Medicine", "Persuasion", "Religion"],
        choices: [{
                choice: Weapon.byType("simple melee").concat(new Weapon("Mace")),
            },
            {
                choice: [new Armor("Scale mail"), new Armor("Leather"), new Armor("Chain mail")],
            },
            {
                choice: Weapon.byType("simple melee").concat(Weapon.byType("simple ranged")).concat(new Weapon("Light crossbow")),
            },
            {
                choice: ["20 bolts"],
            },
            {
                choice: [new Armor("Shield")],
            }, {
                choice: ["Holy Symbol"],
            }
        ],
        packs: [new Pack("Priest's Pack"), new Pack("Explorer's Pack")],

        abilities: [{
            name: "Divine Domain",
            desc: "At 1st level, you adopt a divine domain that bestows special abilities on your cleric. Choose a domain from the cleric spell list. Your choice grants you features at 6th level and again at 18th level. You can select the same domain twice, but you can only select one domain at 20th level."
        }]
    },
    {
        name: "Druid",
        hitDice: 8,
        hitPoints: 8,
        armorProficiencies: Armor.byType("light").concat(Armor.byType("medium")).concat(Armor.byType("shield")),
        weaponProficiencies: Weapon.byType("simple melee").concat(Weapon.byType("simple ranged")).concat(new Weapon("Dagger")).concat(new Weapon("Scimitar")).concat(new Weapon("Sickle")).concat(new Weapon("Club")).concat(new Weapon("Mace")).concat(new Weapon("Quarterstaff")).concat(new Weapon("Sling")).concat(new Weapon("Spear")).concat(new Weapon("Crossbow, hand")).concat(new Weapon("Crossbow, heavy")),
        toolProficiencies: ["c: Herbalism kit"],
        savingThrowProficiencies: ["Wisdom", "Intelligence"],
        skillProficiencies: ["Arcana", "Animal Handling", "Insight", "Medicine", "Nature", "Perception", "Religion", "Survival"],
        skillProficiencyQuantity: 2,
        choices: [{
                choice: Weapon.byType("simple melee").concat(Weapon.byType("simple ranged")).concat(Armor.byType("shield")),
            },
            {
                choice: [new Armor("Leather")],
            },
            {
                choice: Weapon.byType("simple melee"),
            },
            {
                choice: [new Weapon("Dart")],
            },

        ],
        packs: [new Pack("Explorer's Pack")],
        abilities: [{
            name: "Druidic",
            desc: "You know Druidic, the secret language of druids. You can speak the language and use it to leave hidden messages. You and others who know this language automatically spot such a message. Others spot the message's presence with a successful DC 15 Wisdom (Perception) check but can't decipher it without magic.",
        }]
    },

];

module.exports = {
    classList,
    weapons,
    armors,
    packs,
    Weapon,
    Armor,
    Pack,
    Item
};