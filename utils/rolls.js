
const items = [
    {
        minecraftName:'diamond',
        weight:60,
        name:'2 diamonds',
        count:2,
        img:'https://static.wikia.nocookie.net/minecraft_gamepedia/images/a/ab/Diamond_JE3_BE3.png/revision/latest/scale-to-width-down/150?cb=20200325185152',
        description:'You just won 2 fucking diamonds.                       ',
    } , {
        minecraftName:'emerald',
        weight:250,
        name:'2 Emeralds',
        count:2,
        img:'https://static.wikia.nocookie.net/minecraft_gamepedia/images/2/26/Emerald_JE3_BE3.png/revision/latest/scale-to-width-down/150?cb=20191229174220',
        description:'ooo... interesting... still an ass roll.',
    } , {
        minecraftName:'gold_ingot',
        weight:300,
        name:'gold ingot',
        count:5,
        img:'https://static.wikia.nocookie.net/create_mod/images/5/5b/GoldIngot18w43a.png/revision/latest?cb=20210203085603',
        description:'You just won 5 gold, you piglin.                       ',
    } , {
        minecraftName:'dirt',
        weight:3000,
        name:'dirt',
        count:10,
        img:'https://www.minecraftguides.org/blocks/dirt.png',
        description:'LOL LOSER.                            ',
    } , {
        minecraftName:'iron_ore',
        weight:500,
        name:'iron ore',
        count:3,
        img:'https://static.wikia.nocookie.net/minecraft_gamepedia/images/0/0c/Iron_Ore_JE3.png/revision/latest?cb=20200315185600',
        description:'You just won 3 iron ore, go make a bucket and drown :).'
    },{
        minecraftName:'ancient_debris',
        weight:10,
        name:'Ancient Debris',
        count:1,
        img:'https://static.wikia.nocookie.net/minecraft_gamepedia/images/4/4c/Ancient_Debris_JE1_BE1.png/revision/latest/scale-to-width-down/150?cb=20200216200020',
        description:'DAYUMMMMMMMMMMMMMMMMMMMMMMMM, You just copped SOME OLD EXPENSIVE DIRT'
    },{
        minecraftName:'experience_bottle',
        weight:20,
        name:'bottle of enchanting',
        count:64,
        img:'https://static.wikia.nocookie.net/minecraft_gamepedia/images/b/b6/Bottle_o%27_Enchanting_JE2_BE2.png/revision/latest?cb=20191229123032',
        description:'DAYUM... you just won some XP.'
    },{
        minecraftName:`diamond_sword{Enchantments:[{id:"minecraft:fire_aspect",lvl:1s}]}`,
        weight:10,
        name:'diamond sword with fire aspect',
        count:1,
        img:'https://static.wikia.nocookie.net/minecraft_gamepedia/images/d/d1/Enchanted_Diamond_Sword.gif/revision/latest/scale-to-width-down/250?cb=20201118111712',
        description:'Welcome to oven simulator.'
    },{
        minecraftName:'diamond_boots{Enchantments:[{id:"frost_walker",lvl:1s}]}',
        weight:20,
        name:'diamond boots with frost walker ',
        count:1,
        img:'https://static.wikia.nocookie.net/minecraft_gamepedia/images/c/c1/Enchanted_Diamond_Boots_%28item%29.gif/revision/latest/scale-to-width-down/250?cb=20201118111600',
        description:'Chongyun sim ?.'
    },{
        minecraftName:'golden_apple',
        weight:100,
        name:'golden apple',
        count:1,
        url:"https://static.wikia.nocookie.net/minecraft/images/0/0e/Golden_Apple.png/revision/latest?cb=20200826201359",
        description:'AN APPLE A DAY KEEPS DUBAYLAL AWAY.'
    },{
        minecraftName:'name_tag',
        weight:60,
        name:'name tag',
        count:1,
        img:'https://lh3.googleusercontent.com/gk2LM0chzfK2NrzgmW0hh6tpc-A-VOtv2v3r2TILk23so-VhYNh7Kc8HmCYcvpKMC2_ShguZPhU6UdUIrTl3uQ',
        description:'you can finally waste your xp for nothing.'
    },{
        minecraftName:'trident',
        weight:60,
        name:'Trident',
        count:1,
        img:'https://static.wikia.nocookie.net/minecraft_gamepedia/images/9/9a/Trident.png/revision/latest?cb=20200106005732',
        description:'Just Stole it from mandir.'
    },{
        minecraftName:'smooth_stone',
        weight:1300,
        name:'smooth stone',
        count:20,
        img:'https://static.wikia.nocookie.net/minecraft/images/4/43/SmoothStone.png/revision/latest?cb=20190907050017',
        description:'I feel like your brain is smoother.'

    } , 
]

const compileItems = () => {
    const itemArray = [];
    let weightSum = 0;
    let index = 0;
    itemArray.push([]);
    for(let i = 0;i<items.length;i++){
        item = items[i];
        weightSum = weightSum + item.weight;
        let itemCount = item.weight/10;
        while(itemCount> 0) {
            itemArray[index].push(i)
            itemCount = itemCount - 1;
            if(itemArray[index].length % 10 === 0) {
                index = index+1;
                itemArray.push([]);
            }
        }
    };
    console.log(weightSum);
    return {itemArray:itemArray,totalWeight:weightSum}
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class roll {
    
    constructor(){
        this.itemArrayObject =compileItems()
    }

    rarety(chance) {

        if(chance <= 1) {
            return 'You Lucky Bastard'
        } else if(chance <= 5) {
            return 'Hyper Rare'
        } else if(chance <= 10) {
            return 'Rare'
        } else if(chance <= 20) {
            return 'Uncommon'
        } else if(chance <= 40) {
            return 'Common'
        } else {
            return 'Scammed'
        }

    }

    color = {
        'You Lucky Bastard':16766464,
        'Hyper Rare':13698823,
        'Rare':13043112,
        'Uncommon': 5640382,
        'Common':1001149,
        'Scammed':10395294
    }

    get totalWeight() {
        return this.itemArrayObject['totalWeight'];
    }

    get roll() {
        return this.findItem();
    }
    
    findItem() {
        let index = 0;
        const randomValue = getRandomInt(0,(this.itemArrayObject['totalWeight']));
        const tens = parseInt((randomValue % 100)/10);
        const hundreds = parseInt(randomValue /100);

        index = this.itemArrayObject['itemArray'][hundreds][tens] ;  
        return items[index] ;
    }

}



module.exports = roll;