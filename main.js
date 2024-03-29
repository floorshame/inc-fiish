/* thank you for using fiish as your next skidded project! */

var soundClick = new Audio('sounds/click.mp3');
var soundCash = new Audio('sounds/cash.mp3');



var game = {
    Fish: 0,
    FishPerClick: 1,
    FPS: 0,
    Money: 0,
    SellMulti: 1
}


var pond = {
    name: [
        "salmon",
        "tuna",
        "shrimp",
        "angelfish"
    ],
    income: [
        1,
        5,
        12,
        32
    ],
    cooldown: [
        1,
        3,
        5,
        12
    ],
    unlocked: [
        2,
        0,
        0,
        0
    ],
    price: [
        0,
        50,
        500,
        2500
    ], /* AutoFISH PRICES*/
}

var upgrade = {
    id: [
        0,
        1,
        2
    ],
    cost: [
        25,
        100,
        800
    ],
    unlocked: [
        0,
        0,
        0
    ],
    modifier: [
        "fish",
        "fish",
        "fish"
    ],
    modifiername: [
        "salmon",
        "tuna",
        "shrimp"
    ],
    modifiermulti: [
        2,
        2,
        2
    ]
}

var autoFish = {
    collected: 0,
    cooldown: 30,
    repair: 10,
    repaircost: 0, /* when unlocking new pond price goes up by 2x*/

    price: [
        25,
        100,
        300,
        1500,
    ],
    owned: [
        0,
        0,
        0,
        0,
    ],


}

const NotificationConst = document.querySelector('.Notification')


function createNotification(text, seconds){
  const NotificationN = document.createElement('div')

  NotificationN.classList.add('toast')
  NotificationN.innerText = text
  NotificationN.style = '  border: solid 0 var(--border); border-radius: var(--curves); padding: 5px;   background-color: var(--divback); '
  NotificationConst.appendChild(NotificationN);
  
  
  setTimeout(() => {NotificationN.remove()}, seconds * 1000)
}

var HomeTab = document.getElementById("fishamnt");

document.getElementById("fishamnt").innerHTML = game.Fish;
function loadingscreen() {
    document.style.display = 'none';
}



function fishclicked(amnt) {
    game.Fish = game.Fish + game.FishPerClick;
    document.getElementById("fishamnt").innerHTML = game.Fish;

} 

function fishfromthepond(fishpondID) {
    const container = document.getElementById(pond.name[fishpondID] + "pondcooldown");
        document.getElementById(pond.name[fishpondID] + "pondbutton").disabled = true;
        soundClick.play();
        setTimeout(function(){
            document.getElementById(pond.name[fishpondID] + "pondbutton").disabled = false;
            game.Fish = game.Fish + pond.income[fishpondID];
            document.getElementById("fishamnt").innerHTML = game.Fish;
            
        }, pond.cooldown[fishpondID] * 1000);

}

function purchasePond(fishpondID) {
    if (game.Money >= pond.price[fishpondID]) {
        soundCash.play();
        game.Money -= pond.price[fishpondID];
        pond.unlocked[fishpondID] = 1;
        document.getElementById("moneyamnt").innerHTML = game.Money;
        pondCheck();
    } else {
        createNotification('You need more $', 3)
    }
}

function purchaseAF(fishpondID) {
    if (game.Money >= autoFish.price[fishpondID]) {
        soundCash.play();
        game.Money -= autoFish.price[fishpondID];
        autoFish.price[fishpondID] = Math.round(autoFish.price[fishpondID] * 1.5);
        autoFish.owned[fishpondID] += 1;
        updatescores();
        pondCheck();
    } else {
        createNotification("You need more $", 1)
    }
}

function purchaseUpgrade(upgradeID) {
    if (game.Money >= upgrade.cost[upgradeID]) { 

        if (upgrade.modifier[upgradeID] == "fish") {
            soundCash.play();
            game.Money -= upgrade.cost[upgradeID]
            upgrade.unlocked[upgradeID] = 1;
            var fishname = upgrade.modifiername[upgradeID];
            for (i = 0; i < pond.name.length; i++) {
                if (pond.name[i] == fishname) {
                    pond.income[i] *= upgrade.modifiermulti[upgradeID];
                    updatescores();
                    pondCheck();
                    updateUpgrades();
                    
                }
            }

        } if (upgrade.modifier[upgradeID] == "money") {
            game.Money -= upgrade.cost[upgradeID]
            upgrade.unlocked[upgradeID] = 1;
            updatescores();
            pondCheck();
            updateUpgrades();

            /* NOT DONE NO UPGRADES HAVE BEEN USED USING THIS*/
        }
    }
}

function repairAutoFish() {
    if (game.Money >= autoFish.repaircost) {
        console.log("wow");
        game.Money -= autoFish.repaircost;
        autoFish.repair = 10;
        checkAF();
    } else {
        console.log("l");
    }
}

function withFish() {
    if (autoFish.collected >= 1) {
        game.Fish += autoFish.collected;
        autoFish.collected = 0;
        checkAF();
        updatescores();
    }
}

setInterval(function() {
    document.getElementById("fishamnt").innerHTML = game.Fish;
    document.title = "fiish - " + game.Fish;
}, 1000);

setInterval(function() {
    saveGame();
}, 30000);

setInterval(function() {
    createNotification('the dawn is your enemy', 60)
}, 86400 * 1000);


/* AF CODE */
setInterval(function() {
    for (i = 0; i < autoFish.owned.length; i++) {
        if (autoFish.repair >= 1) {
            if (autoFish.owned[i] >= 1) {
                autoFish.collected += pond.income[i] * autoFish.owned[i];
                var rolldice = Math.floor(Math.random() * (4 - 1) + 1);
                if (rolldice == 1) {
                    autoFish.repair -= 1;
                    checkAF();

                } else {
                    checkAF();
                }
            }
        } else {
        }
    }

}, autoFish.cooldown * 1000);

function checkAF() {
    document.getElementById("roboFishCollected").innerHTML = autoFish.collected;
    document.getElementById("roboFishCooldown").innerHTML = autoFish.cooldown;
    document.getElementById("roboGrade").innerHTML = autoFish.repair;
}








var TabOpened = "pond"; /* tab that is currently opened */
var AFOpened = false;
/* tab stuff*/
document.getElementById("TAB_Shop").style.display = 'none'
document.getElementById("TAB_Koi").style.display = 'none';
document.getElementById("TAB_Settings").style.display = 'none';
document.getElementById("Pond_TAB_Button").style = 'box-shadow: 0px -1px var(--blurwidth) var(--acsent);';


document.getElementById("fishhidden").style.display = 'none';

function TabSwitch(Tab) {
    if (Tab == 'shop') {
        TabOpened = "shop"

        document.getElementById("Shop_TAB_Button").style = 'box-shadow: 0px -1px var(--blurwidth) var(--acsent);';
        document.getElementById("Settings_TAB_Button").style = '';
        document.getElementById("Koi_TAB_Button").style = '';
        document.getElementById("Pond_TAB_Button").style = '';


        document.getElementById("TAB_pond").style.display = 'none';
        document.getElementById("TAB_Koi").style.display = 'none';
        document.getElementById("TAB_Settings").style.display = 'none';
        document.getElementById("TAB_Shop").style.display = '';
    }
    if (Tab == 'pond') {
        TabOpened = "pond"


        document.getElementById("Pond_TAB_Button").style = 'box-shadow: 0px -1px var(--blurwidth) var(--acsent);';
        document.getElementById("Settings_TAB_Button").style = '';
        document.getElementById("Koi_TAB_Button").style = '';
        document.getElementById("Shop_TAB_Button").style = '';

        document.getElementById("TAB_pond").style.display = '';
        document.getElementById("TAB_Koi").style.display = 'none';
        document.getElementById("TAB_Settings").style.display = 'none';
        document.getElementById("TAB_Shop").style.display = 'none';
    }
    if (Tab == 'koi') {

        document.getElementById("Koi_TAB_Button").style = 'box-shadow: 0px -1px var(--blurwidth) var(--acsent);';
        document.getElementById("Settings_TAB_Button").style = '';
        document.getElementById("Pond_TAB_Button").style = '';
        document.getElementById("Shop_TAB_Button").style = '';

        document.getElementById("TAB_pond").style.display = 'none';
        document.getElementById("TAB_Settings").style.display = 'none';
        document.getElementById("TAB_Koi").style.display = '';
        document.getElementById("TAB_Shop").style.display = 'none';
    }
    if (Tab == 'settings') {

        document.getElementById("Settings_TAB_Button").style = 'box-shadow: 0px -1px var(--blurwidth) var(--acsent);';
        document.getElementById("Koi_TAB_Button").style = '';
        document.getElementById("Pond_TAB_Button").style = '';
        document.getElementById("Shop_TAB_Button").style = '';


        document.getElementById("TAB_pond").style.display = 'none';
        document.getElementById("TAB_Settings").style.display = '';
        document.getElementById("TAB_Koi").style.display = 'none';
        document.getElementById("TAB_Shop").style.display = 'none';
    }
}
function AFTabClicked() {
    if (AFOpened == true) {
        document.getElementById("fishhidden").style.display = 'none';
        AFOpened = false;
    }else {
        document.getElementById("fishhidden").style.display = '';
        AFOpened = true;
    }
}
document.addEventListener("keydown", function(event) {
    if (event.which == 49) { //ctrl + s //
        event.preventDefault();
        TabSwitch('pond')
    }
}, false);

document.addEventListener("keydown", function(event) {
    if (event.which == 50) { //ctrl + s //
        event.preventDefault();
        TabSwitch('koi')
    }
}, false);
document.addEventListener("keydown", function(event) {
    if (event.which == 51) { //ctrl + s //
        event.preventDefault();
        TabSwitch('shop')

    }
}, false);
document.addEventListener("keydown", function(event) {
    if (event.which == 52) { //ctrl + s //
        event.preventDefault();
        TabSwitch('settings')

    }
}, false);



function pondCheck() {
    for (i = 0; i < pond.name.length; i++) {
        if (pond.unlocked[i] == 0) {
            document.getElementById(pond.name[i] + "pond").style.display = 'none';
            document.getElementById(pond.name[i] + "pondbuy").style.display = '';


        } if (pond.unlocked[i] == 1) {
            document.getElementById(pond.name[i] + "pond").style.display = '';
            document.getElementById(pond.name[i] + "pondbuy").style.display = 'none';
            document.getElementById(pond.name[i] + "afcost").innerHTML = autoFish.price[i];
        } if (pond.unlocked[i] == 2) {
            document.getElementById(pond.name[i] + "afcost").innerHTML = autoFish.price[i];


        }

    }


}

function updateUpgrades() {
    for (i = 0; i < upgrade.id.length; i++) { /* 0upgradebuy*/
        if (upgrade.unlocked[i] == 1) {
            document.getElementById(upgrade.id[i] + "upgradebuy").style.display = 'none';
            
        } if (upgrade.unlocked[i] == 0) {
            document.getElementById(upgrade.id[i] + "upgradebuy").style.display = '';

        }
    }

}

function sellfish() {
    if (game.Fish > 0 ) {
        soundCash.play();
        var tempmoney = game.SellMulti * game.Fish;
        game.Money += game.SellMulti * game.Fish;
        game.Fish -= game.Fish;
        document.getElementById("moneyamnt").innerHTML = game.Money;
        document.getElementById("fishamnt").innerHTML = game.Fish;
        createNotification('You have earned: $' + tempmoney, 3)

    }
}

function saveGame() {
    var gamedata = {
        /* main vars*/
        Fish: game.Fish,
        FishPerClick: game.FishPerClick,
        FPS: game.FPS,
        SellMulti: game.SellMulti,
        Money: game.Money,

        /* pond data */

        pondname: pond.name,
        pondincome: pond.income,
        pondcooldown: pond.cooldown,
        pondunlocked: pond.unlocked,
        pondprice: pond.price,

        /* upgrade data*/
        upgradeID: upgrade.id,
        upgradeCost: upgrade.cost,
        upgradeUnlocked: upgrade.unlocked,
        upgradeModifier: upgrade.modifier,
        upgradeModifierName: upgrade.modifiername,
        upgradeModifierMulti: upgrade.modifiermulti,

        /* auto fish data */
        AFCollected: autoFish.collected,
        AFCooldown: autoFish.cooldown,
        AFrepair: autoFish.repair,
        AFrepaircost: autoFish.repaircost,

        AFprice: autoFish.price,
        AFowned: autoFish.owned,
    };
    localStorage.setItem("gamedata", JSON.stringify(gamedata));
    createNotification('Game has been saved', 3)

}
function loadGame () {
    var gamedata =  JSON.parse(localStorage.getItem("gamedata"));
    if (localStorage.getItem("gamedata") !== null) {
        if (typeof gamedata.Fish !== "undefined") game.Fish = gamedata.Fish;
        if (typeof gamedata.Fish !== "undefined") game.FishPerClick = gamedata.FishPerClick;
        if (typeof gamedata.Fish !== "undefined") game.FPS = gamedata.FPS;
        if (typeof gamedata.SellMulti !== "undefined") game.SellMulti = gamedata.SellMulti;
        if (typeof gamedata.Money !== "undefined") game.Money = gamedata.Money;

        if (typeof gamedata.AFCollected !== "undefined") autoFish.collected = gamedata.AFCollected;
        if (typeof gamedata.AFCooldown !== "undefined") autoFish.cooldown = gamedata.AFCooldown;
        if (typeof gamedata.AFrepair !== "undefined") autoFish.repair = gamedata.AFrepair;
        if (typeof gamedata.AFrepaircost !== "undefined") autoFish.repaircost = gamedata.AFrepaircost;


        if (typeof gamedata.pondname !== "undefined") {
            for (i = 0; i < gamedata.pondname.length; i++) {
                pond.name[i] = gamedata.pondname[i];
            }

            }
            if (typeof gamedata.pondincome !== "undefined") {
            for (i = 0; i < gamedata.pondincome.length; i++) {
                pond.income[i] = gamedata.pondincome[i];
            }

            }

            if (typeof gamedata.pondcooldown !== "undefined") {
            for (i = 0; i < gamedata.pondcooldown.length; i++) {
                pond.cooldown[i] = gamedata.pondcooldown[i];
            }
            }
            if (typeof gamedata.pondunlocked !== "undefined") {
            for (i = 0; i < gamedata.pondunlocked.length; i++) {
                pond.unlocked[i] = gamedata.pondunlocked[i];
            }
            }
            if (typeof gamedata.pondprice !== "undefined") {
            for (i = 0; i < gamedata.pondprice.length; i++) {
                pond.price[i] = gamedata.pondprice[i];
            }
            }

            if (typeof gamedata.upgradeID !== "undefined") {
            for (i = 0; i < gamedata.upgradeID.length; i++) {
                upgrade.id[i] = gamedata.upgradeID[i];
            }
            }
            if (typeof gamedata.upgradeCost !== "undefined") {
            for (i = 0; i < gamedata.upgradeCost.length; i++) {
                upgrade.cost[i] = gamedata.upgradeCost[i];
            }
            }
            if (typeof gamedata.upgradeUnlocked !== "undefined") {
            for (i = 0; i < gamedata.upgradeUnlocked.length; i++) {
                upgrade.unlocked[i] = gamedata.upgradeUnlocked[i];
            }
            }
            if (typeof gamedata.upgradeModifier !== "undefined") {
            for (i = 0; i < gamedata.upgradeModifier.length; i++) {
                upgrade.modifier[i] = gamedata.upgradeModifier[i];
            }
            }
            if (typeof gamedata.upgradeModifierName !== "undefined") {
            for (i = 0; i < gamedata.upgradeModifierName.length; i++) {
                upgrade.modifiername[i] = gamedata.upgradeModifierName[i];
            }
            }
            if (typeof gamedata.upgradeModifierMulti !== "undefined") {
            for (i = 0; i < gamedata.upgradeModifierMulti.length; i++) {
                upgrade.modifiermulti[i] = gamedata.upgradeModifierMulti[i];
            }
            }

            if (typeof gamedata.AFprice !== "undefined") {
            for (i = 0; i < gamedata.AFprice.length; i++) {
                    autoFish.price[i] = gamedata.AFprice[i];
            }
            }
    
            if (typeof gamedata.AFowned !== "undefined") {
            for (i = 0; i < gamedata.AFowned.length; i++) {
                    autoFish.owned[i] = gamedata.AFowned[i];
            }
            }
    


        }


    updatescores();
    pondCheck();
    updateUpgrades();
    checkAF();
    createNotification('Game has been loaded', 3)

}
function resetGame() {
    if (confirm("Are you sure!")) {
        var gamedata = {} ;
        localStorage.setItem("gamedata", JSON.stringify(gamedata));
        location.reload();
    }
}
function updatescores() {
    document.getElementById("fishamnt").innerHTML = game.Fish;
    document.getElementById("moneyamnt").innerHTML = game.Money;

}
document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.which == 83) { //ctrl + s //
        event.preventDefault();
        saveGame();
    }
}, false);

window.onload = function() {
    loadGame();
    console.log('%cfiish has been loaded', 'background: #000000; color: #c4f6ff');

};

