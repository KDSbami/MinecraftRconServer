
const shop = {};

shop.sellingItems = {
	"diamond":{
		type:"material",
		minecraftName:"diamond",
		cost:250,
		count:1
	},
	"ancientDebris":{
		type:"material",
		minecraftName:"ancient_debris",
		cost:750,
		count:1
	},
	"emerald":{
		type:"material",
		minecraftName:"emerald",
		cost:250,
		count:2
	},
	"acaiaWood":{
		type:"material",
		minecraftName:"acacia_wood",
		cost:500,
		count:64
	},
	"darkOakWood":{
		type:"material",
		minecraftName:"dark_oak_wood",
		cost:500,
		count:64
	},
	"jungleWood":{
		type:"material",
		minecraftName:"jungle_wood",
		cost:500,
		count:64
	},
	"crimsonHypae":{
		type:"material",
		minecraftName:"crimson_hyphae",
		cost:500,
		count:64
	},
	"warpedHyphae":{
		type:"material",
		minecraftName:"warped_hyphae",
		cost:500,
		count:64
	},	
	"bed":{
		type:"material",
		minecraftName:"white_bed",
		cost:30,
		count:1
	},
	"tnt":{
		type:"material",
		minecraftName:"tnt",
		cost:500,
		count:10
	},
	"glass":{
		type:"material",
		minecraftName:"glass",
		cost:500,
		count:64
	},
    "deathTP":{
        type:"deathTP",
        cost:150,
    },
    "skin":{
        type:"skin",
        cost:5
    },
}

shop.buying = {
    "serverPointsItem":{
        cost:50,
        minecraftName:"ender_eye",
        name:"Eye of Ender"
    },
    "rafflesItem":{
        cost:1,
        minecraftName:"diamond",
        name:"Diamond"
    }
}
module.exports = shop;