const commands = {};
const serverBuys = require('../static/shop')

commands.createMaterialCommand = (player,item,count) => {
    return `give ${player} ${item} ${count}`;
}

commands.createSellCommand = (player,item,count) => {
    return `clear ${player} ${item} ${count}`;
}

commands.createSkinCommand = (player,skin) => {
    return `skin set ${player} ${skin}`;
}


module.exports = commands;