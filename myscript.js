// ======================================
//
// DOM Manipulation
//
// ======================================

__global_tick = 500;

// Fills in the card numbers on newly created cards
// by using a timeout to wait for the number to be filled in 
// in the attached link
var fillInCardNum = function(e, loop) {
    if (loop > 1000) {
        console.log("Never caught it");
    }
    else {
        var $link = e.find("a.list-card-title.js-card-name");
        if ($link.attr("href") === undefined) {
            setTimeout(function(){fillInCardNum(e, loop++)});
        }
        else {
            // Add the card #
            var $cardNum = $link.children("span.card-short-id");
            $cardNum.text("#" + $link.attr("href").split("/").slice(-1)[0].split("-")[0]);
        }
    }
};

var addCardNumberToOpenCard = function() {
    console.log("Adding card # to card.")
    var cardNum = window.location.href
        .split('/')
        .slice(-1)[0]
        .split("-")[0];

    $("div.window")
        .find("div.window-main-col")
        .before($("<span class=\"card-number button-link\">#" + cardNum + "</span>"))
}

var waitForVisible = function(e) {
    if (e.is(":visible")) {
        setTimeout(addCardNumberToOpenCard, __global_tick);
        setTimeout(waitForInvisible, __global_tick, e);
    } else {
        setTimeout(waitForVisible, __global_tick, e);
    }
}

var waitForInvisible = function(e) {
    if (!e.is(":visible")) {
        setTimeout(waitForVisible, __global_tick, e);
    } else {
        setTimeout(waitForInvisible, __global_tick, e);
    }
}

var newCardWatcher = function() {
    var $nodes = $("span.card-short-id.hide:not(._fc_seen)");
    for (var i = 0; i < $nodes.length; i++) {
        var $node = $($nodes[i]);
        if ($node.text().trim() == "#") {
            fillInCardNum($node.parent().parent(), 0);
        }
        $node.addClass("_fc_seen");
    }
    console.log($nodes.length);
}

// ======================================
//
// Attach event listener to card clicks
//
// ======================================
$(function(){
    // Set up our copy click listener
    $("div.window").on("click", "span.card-number.button-link", function(){
        prompt("Copy link to this page:", window.location.href);
    });

    if (window.location.href.indexOf("/c/") > 0) {
       addCardNumberToOpenCard();
    }

    var $popupWindow = $("div.window");
    waitForVisible($popupWindow);

    // Watch for new cards
    setInterval(newCardWatcher, __global_tick);

    console.log("Card Numbers for Trello - Flyclops Style - Loaded");
});
