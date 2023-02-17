module.exports = {
    name: 'Add Artifact to Episode',
    description: 'Add Artifact to Episode is the description',
    method: "episode/list",
    actors: {
        'Author': 'uses',
    },
    steps: [
        { action: 'episode/create', parameters: {name:'EDT-47', file:'./templates/episode.yml'}},
        { action: 'artifact/update', parameters: {name:'EDT-47-Blog', type:'Blog', url:'https://darpai-my.sharepoint.com/:w:/g/personal/darren_pulsipher_org/Eden6yRFbp1Nlm4AfNhhFWsBNYWH_j36zVQGilrl_VNduQ?e=4pITOg'}},
        { action: 'artifact/update', parameters: {name:'EDT-47-Paper', type:'Doc', url:'https://darpai-my.sharepoint.com/:w:/g/personal/darren_pulsipher_org/EcmWwZ2ID-pEs3Rx_FOfi-gBpWGE1rbCcyiJKGsWvfbVOw?e=Vzo1Zy'}},
        { action: 'artifact/update', parameters: {name:'EDT-47-Video', type:'Video', url:'https://darpai-my.sharepoint.com/:v:/g/personal/darren_pulsipher_org/ESfHPLJNlqlOvhpznMMADywBJpgfyi9Rnr8H_84GUWjK8w?e=yB62pX'}},
        { action: 'artifact/update', parameters: {name:'EDT-47-Podcast', type:'Audio', url:'https://darpai-my.sharepoint.com/:u:/g/personal/darren_pulsipher_org/EaxAhJxy0W9Gr6kFb8mDGuoBiwwBsKkOZmVXmBwLH10OIg?e=7lqQ9u'}},
        { action: 'artifact/update', parameters: {name:'EDT-47-image', type:'image', url:'https://darpai-my.sharepoint.com/:i:/g/personal/darren_pulsipher_org/EcEpyL2ck7hIhlm6HoXgWnQBkNQZkUKWL0Gj0OOuEMkceA?e=0PlsHr'}},
        { action: 'artifact/update', parameters: {name:'EDT-47-Short1', type:'VideoShort', url:'https://darpai-my.sharepoint.com/:v:/g/personal/darren_pulsipher_org/EV8TUGsWexpOq4sAqHJLxdEBMk3tjAqDVOy4--DrpTeJrQ?e=rHKHt9'}},
        { action: 'artifact/update', parameters: {name:'EDT-47-Short2', type:'VideoShort', url:'https://darpai-my.sharepoint.com/:v:/g/personal/darren_pulsipher_org/EZwLLp4Q1m9GsTq20Zht9o8BwMgVI3munq8JmD6TxrRXmg?e=gd3rwi'}},
        { action: 'artifact/update', parameters: {name:'EDT-47-Short3', type:'VideoShort', url:'https://darpai-my.sharepoint.com/:v:/g/personal/darren_pulsipher_org/EWBOaWLhMj5DnkHaLgxJJToB-_dRMh1_IY1MgV9FNdT52g?e=seWFpi'}},
        { action: 'episode/addartifacts', parameters: {name:'EDT-47', items:'EDT-47-Blog,EDT-47-Paper,EDT-47-Video,EDT-47-Podcast,EDT-47-image,EDT-47-Short1,EDT-47-Short2,EDT-47-Short3'}}
    ]
};

