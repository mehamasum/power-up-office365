/* global TrelloPowerUp */

var WHITE_ICON = './images/icon-white.svg';
var GRAY_ICON = './images/icon-gray.svg';
var APP_ID = '380ed9c5-4e06-4b73-b2e0-115ab3810cb8';
var DEFAULT = "XXX";

var KEY_ACCESS_TOKEN = "accessToken";
var KEY_ENDPOINT_HINT= "endpointHint";

var parkMap = {
    acad: 'Acadia National Park',
    arch: 'Arches National Park',
    badl: 'Badlands National Park',
    brca: 'Bryce Canyon National Park',
    crla: 'Crater Lake National Park',
    dena: 'Denali National Park',
    glac: 'Glacier National Park',
    grca: 'Grand Canyon National Park',
    grte: 'Grand Teton National Park',
    olym: 'Olympic National Park',
    yell: 'Yellowstone National Park',
    yose: 'Yosemite National Park',
    zion: 'Zion National Park'
};

var getBadges = function (t) {
    return t.card('name')
        .get('name')
        .then(function (cardName) {
            var badgeColor;
            var icon = GRAY_ICON;
            var lowercaseName = cardName.toLowerCase();
            if (lowercaseName.indexOf('green') > -1) {
                badgeColor = 'green';
                icon = WHITE_ICON;
            } else if (lowercaseName.indexOf('yellow') > -1) {
                badgeColor = 'yellow';
                icon = WHITE_ICON;
            } else if (lowercaseName.indexOf('red') > -1) {
                badgeColor = 'red';
                icon = WHITE_ICON;
            }

            if (lowercaseName.indexOf('dynamic') > -1) {
                // dynamic badges can have their function rerun after a set number
                // of seconds defined by refresh. Minimum of 10 seconds.
                return [{
                    dynamic: function () {
                        return {
                            title: 'Detail Badge', // for detail badges only
                            text: 'Dynamic ' + (Math.random() * 100).toFixed(0).toString(),
                            icon: icon, // for card front badges only
                            color: badgeColor,
                            refresh: 10
                        }
                    }
                }]
            }

            if (lowercaseName.indexOf('static') > -1) {
                // return an array of badge objects
                return [{
                    title: 'Detail Badge', // for detail badges only
                    text: 'Static',
                    icon: icon, // for card front badges only
                    color: badgeColor
                }];
            } else {
                return [];
            }
        })
};

var formatNPSUrl = function (t, url) {
    if (!/^https?:\/\/www\.nps\.gov\/[a-z]{4}\//.test(url)) {
        return null;
    }
    var parkShort = /^https?:\/\/www\.nps\.gov\/([a-z]{4})\//.exec(url)[1];
    if (parkShort && parkMap[parkShort]) {
        return parkMap[parkShort];
    } else {
        return null;
    }
};

var boardButtonCallback = function (t) {
    return t.popup({
        title: 'Popup List Example',
        items: [
            {
                text: 'Open Overlay',
                callback: function (t) {
                    return t.overlay({
                        url: './overlay.html',
                        args: {rand: (Math.random() * 100).toFixed(0)}
                    })
                        .then(function () {
                            return t.closePopup();
                        });
                }
            },
            {
                text: 'Open Board Bar',
                callback: function (t) {
                    return t.boardBar({
                        url: './board-bar.html',
                        height: 200
                    })
                        .then(function () {
                            return t.closePopup();
                        });
                }
            }
        ]
    });
};


function launchOneDrivePicker(t) {
    // check which one to call
    t.get('board', 'private', KEY_ACCESS_TOKEN, DEFAULT)
        .then(function (token) {

            console.log(token);

           if(token===DEFAULT) {
               launchOneDrivePickerOAuth(t);
           }
           else {

               //TODO: always returns DEFAULT :/

               t.get('board', 'private', KEY_ENDPOINT_HINT, DEFAULT)
                   .then(function (hint) {
                       launchOneDrivePickerWithToken(t, token, hint);
                   });
           }
        });
}


function launchOneDrivePickerOAuth(t){
    var odOptions = {
        clientId: APP_ID,
        action: "share",
        multiSelect: true,
        advanced: {},
        success: function(files) {
            /* success handler */

            return t.attach({url: "https://office.com", name: "Test attachment"})
                .then(function () {

                    //TODO: doesn't work :/
                    // save `accessToken` and `endpointHint`

                    console.log(JSON.stringify(files["accessToken"]));

                    t.set('board', 'private', {
                        KEY_ACCESS_TOKEN: files["accessToken"],
                        KEY_ENDPOINT_HINT: files["apiEndpoint"]
                    })
                        .then(function () {
                            t.get('board', 'private', KEY_ACCESS_TOKEN, DEFAULT)
                                .then(function (token) {
                                    console.log(token);
                                });

                            t.closePopup();

                        })
                })


        },
        cancel: function() {
            /* cancel handler */
            t.closePopup();
        },
        error: function(e) {
            /* error handler */
            t.closePopup();
        }
    };

    OneDrive.open(odOptions);
}


function launchOneDrivePickerWithToken(t, token, hint){
    var odOptions = {
        clientId: APP_ID,
        action: "share",
        multiSelect: true,
        advanced: {
            accessToken: token,
            endpointHint: hint
        },
        success: function(files) {
            /* success handler */
        },
        cancel: function() {
            /* cancel handler */
        },
        error: function(e) {
            /* error handler */

        }
    };

    OneDrive.open(odOptions);
}

var cardButtonCallback = function (t) {
    /*var items = Object.keys(parkMap).map(function (parkCode) {
        var urlForCode = 'http://www.nps.gov/' + parkCode + '/';
        return {
            text: parkMap[parkCode],
            url: urlForCode,
            callback: function (t) {
                return t.attach({url: urlForCode, name: parkMap[parkCode]})
                    .then(function () {
                        return t.closePopup();
                    })
            }
        };
    });

    return t.popup({
        title: 'Popup Search Example',
        items: items,
        search: {
            count: 5,
            placeholder: 'Search National Parks',
            empty: 'No parks found'
        }
    });*/


    var attachFile = function(t) {
        /*return t.overlay({
            url: 'attach.html'
        })
        .then(function(){
            return t.closePopup();
        })*/

        //launchOneDrivePicker(t);

        // test: set


        return t.set('board', 'private', {
            KEY_ACCESS_TOKEN: "AAA",
            KEY_ENDPOINT_HINT: "BBB"
        })
            .then(function () {
                return t.get('board', 'private', KEY_ACCESS_TOKEN, DEFAULT);
            })
            .then(function (token) {
                console.log(token);
                return t.closePopup();
            });

    };

    var attachFolder = function(t) {
        /*return t.overlay({
            url: 'attach-folder.html'
        })
        .then(function(){
            return t.closePopup();
        })*/


        return t.get('board', 'private', KEY_ACCESS_TOKEN, DEFAULT)
            .then(function (token) {
                console.log(token);
                return t.set('board', 'private', {
                    KEY_ACCESS_TOKEN: "PPP",
                    KEY_ENDPOINT_HINT: "QQQ"
                });

            })
            .then(function () {
                return t.get('board', 'private', KEY_ACCESS_TOKEN, DEFAULT)
            })
            .then(function (new_token) {
                console.log(new_token);
                t.closePopup();
            });


    };

    return t.popup({
        title: 'Office 365',
        items: [
            {
                text: "Attach OneDrive File",
                callback: attachFile
            },
            {
                text: "Attach OneDrive Folder",
                callback: attachFolder
            }
        ]
    });



};

TrelloPowerUp.initialize({

    'authorization-status': function(t) {

        // if true
        // t.set has been used
        // `remove settings` is displayed



        // if false
        // `show-authorization` is displayed

        return new TrelloPowerUp.Promise((resolve) =>
            resolve({ authorized: false })
        )
    },

    'show-authorization': function(t) {
        t.popup({
            title: 'My Auth Popup',
            url: './onedrive/index.html',
            height: 500
        })
    },

    'show-settings': function (t, options) {
        return t.popup({
            title: 'Settings',
            url: './settings.html',
            height: 184
        });
    },

    // Allows you to add one or more buttons on the right side of the back of cards
    // Each button should have { icon, text, callback -> method }
    'card-buttons': function (t, options) {
        return [{
            icon: GRAY_ICON,
            text: 'Office 365',
            callback: cardButtonCallback
        }];
    },

    'attachment-sections': function (t, options) {
        // options.entries is a list of the attachments for this card
        // you can look through them and 'claim' any that you want to
        // include in your section.

        // we will just claim urls for Yellowstone
        var claimed = options.entries.filter(function (attachment) {
            return attachment.url.indexOf('http://www.nps.gov/yell/') == 0;
        });

        // you can have more than one attachment section on a card
        // you can group items together into one section, have a section
        // per attachment, or anything in between.
        if (claimed && claimed.length > 0) {
            // if the title for your section requires a network call or other
            // potentially length operation you can provide a function for the title
            // that returns the section title. If you do so, provide a unique id for
            // your section
            return [{
                id: 'Yellowstone', // optional if you aren't using a function for the title
                claimed: claimed,
                icon: GRAY_ICON,
                title: 'Example Attachment Section: Yellowstone',
                content: {
                    type: 'iframe',
                    url: t.signUrl('./section.html', {arg: 'you can pass your section args here'}),
                    height: 230
                }
            }];
        } else {
            return [];
        }
    },
    'attachment-thumbnail': function (t, options) {
        var parkName = formatNPSUrl(t, options.url);
        if (parkName) {
            // return an object with some or all of these properties:
            // url, title, image, openText, modified (Date), created (Date), createdBy, modifiedBy
            return {
                url: options.url,
                title: parkName,
                image: {
                    url: './images/nps.svg',
                    logo: true // false if you are using a thumbnail of the content
                },
                openText: 'Open in NPS'
            };
        } else {
            throw t.NotHandled();
        }
    },

    // Allows you to add one or more buttons to a Board at the top right of the screen
    'board-buttons': function (t, options) {
        return [{
            icon: WHITE_ICON,
            text: 'Office 365',
            callback: boardButtonCallback
        }];
    },


    'card-badges': function (t, options) {
        return getBadges(t);
    },

    'card-detail-badges': function (t, options) {
        return getBadges(t);
    },
    'card-from-url': function (t, options) {
        var parkName = formatNPSUrl(t, options.url);
        if (parkName) {
            return {
                name: parkName,
                desc: 'An awesome park: ' + options.url
            };
        } else {
            throw t.NotHandled();
        }
    },
    'format-url': function (t, options) {
        var parkName = formatNPSUrl(t, options.url);
        if (parkName) {
            return {
                icon: GRAY_ICON,
                text: parkName
            };
        } else {
            throw t.NotHandled();
        }
    }
});
