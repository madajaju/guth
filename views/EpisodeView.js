import ArtifactView from "./ArtifactView.js";
import AssetView from "./AssetView.js";
import ActionView from './ActionView.js';
import ChartView from "./ChartView.js";
import CalendarView from "./CalendarView.js";
import PostView from "./PostView.js";


let artifactTypes = [
    {id: 1, text: 'video'},
    {id: 2, text: 'audio'},
    {id: 3, text: 'blog'},
];
let channelList = [
    {id: 1, text: 'video'},
    {id: 2, text: 'audio'},
    {id: 3, text: 'blog'},
];
let artifactList = [
    {id: 1, text: 'video'},
    {id: 2, text: 'audio'},
    {id: 3, text: 'blog'},
];

const ecolor = {
    "Created": "#aaaaff",
    "Backlog": "#ffaa88",
    "backlog": "#ffaa88",
    "Scheduled": "#aaaa77",
    "Recorded": "#66aaaa",
    "Edited": "#88cc88",
    "Written": "#44aa44",
    "Published": "#aaaaaa",
    "Posted": "#aaaaaa",
    "Cancelled": "#ffaaaa",
    "Failed": "#ff6666",
}

let _artifactRecID = 0;

export default class EpisodeView {
    constructor(config) {
        this.config = config;
        $.ajax({
            url: 'ArtifactType/list',
            success: function (results) {
                artifactTypes = [];
                let counter = 1;
                for (let i in results.records) {
                    artifactTypes.push({id: counter++, text: results.records[i].id});
                }
                EpisodeView.createEdit();
                EpisodeView.createList();
                EpisodeView.createDetail();
            },
        });
    }

    static createList() {
        if (!w2ui['EpisodeList']) {
        }
    }

    static createDetail() {
        if (!w2ui['EpisodeList']) {
        }
    }

    static createEdit() {
        if (!w2ui['EpisodeEdit']) {
            let fields = [];
            fields.push({
                field: 'state',
                type: 'textarea',
                required: false,
                html: {label: "State", attr: `size="12" style="width:500px"`}
            });
            fields.push({
                field: 'number',
                type: 'textarea',
                required: true,
                html: {label: "Number", attr: `size="10" style="width:500px"`}
            });
            fields.push({
                field: 'title',
                type: 'textarea',
                required: true,
                html: {label: "Title", attr: `size="50" style="width:500px"`}
            });
            fields.push(lookUpList('Tags', 'tags', "tag"));
            fields.push(lookUpList('Guests', 'guests', "person"));
            fields.push({
                field: 'releaseDate',
                type: 'date',
                required: false,
                html: {label: "Release Date", attr: `size="12" style="width:500px"`}
            });
            fields.push({
                field: 'scheduledDate',
                type: 'date',
                required: false,
                html: {label: "Scheduled Date", attr: `size="12" style="width:500px"`}
            });
            fields.push({
                field: 'summary',
                type: 'textarea',
                required: false,
                html: {label: "Summary", attr: `size="1000" style="width:500px; height:100px"`}
            });
            fields.push({
                field: 'script',
                type: 'textarea',
                required: false,
                html: {label: "Meta Summary", attr: `size="2048" style="width:500px; height:500px"`}
            });
            $().w2layout({
                name: 'EpisodeEdit',
                panels: [
                    {type: 'left', size: 100, resizable: true, minSize: 35},
                    {
                        type: 'main', size: 550, overflow: 'hidden',
                        toolbar: {
                            items: [],
                        }
                    }
                ],
                onRender: (event) => {
                    // Add the record to the form and the assoication tabs
                    if (event.target === 'EpisodeEdit') {
                        if (w2ui.EpisodeEdit.record) {
                            // General Panel
                            w2ui.EpisodeEditGeneral.record = {};
                            // Enums Must be in an array
                            w2ui.EpisodeEditGeneral.record.owner = w2ui.EpisodeEdit.record.owner;
                            w2ui.EpisodeEditGeneral.record.id = w2ui.EpisodeEdit.record._id;
                            w2ui.EpisodeEditGeneral.record.name = w2ui.EpisodeEdit.record._name;
                            w2ui.EpisodeEditGeneral.record.number = w2ui.EpisodeEdit.record.number.name;
                            w2ui.EpisodeEditGeneral.record.title = w2ui.EpisodeEdit.record.title.name;
                            w2ui.EpisodeEditGeneral.record.summary = w2ui.EpisodeEdit.record.summary.name;
                            w2ui.EpisodeEditGeneral.record.releaseDate = w2ui.EpisodeEdit.record.releaseDate.name;
                            w2ui.EpisodeEditGeneral.record.scheduledDate = w2ui.EpisodeEdit.record.scheduledDate.name;
                            w2ui.EpisodeEditGeneral.record.state = w2ui.EpisodeEdit.record._state;
                            w2ui.EpisodeEditGeneral.record.script = w2ui.EpisodeEdit.record.script;
                            w2ui.EpisodeEditGeneral.record.tags = w2ui.EpisodeEdit.record.tags.values;
                            w2ui.EpisodeEditGeneral.record.guests = w2ui.EpisodeEdit.record.guests.values;
                            w2ui.EpisodeEditGeneral.refresh();

                            // Artifact Panel
                            let arecords = _artifactGrid(w2ui.EpisodeEdit.record.artifacts.values);
                            w2ui.EpisodeEditArtifacts.records = arecords;
                            w2ui.EpisodeEditArtifacts.refresh();
                            _artifactGetInfo(arecords);

                            // Asset Panel
                            let asrecs = _assetGrid(w2ui.EpisodeEdit.record.assets.values);
                            w2ui.EpisodeEditAssets.records = asrecs;
                            w2ui.EpisodeEditAssets.refresh();
                            _assetGetInfo(asrecs);

                            // Post Panel
                            let precs = [];
                            let counter = 0;
                            for (let i in w2ui.EpisodeEdit.record.posts.values) {
                                let post = w2ui.EpisodeEdit.record.posts.values[i];
                                precs.push({
                                    "recid": counter++,
                                    "id": post._id,
                                    "name": post._name,
                                    "channel": post.channel,
                                    "text": post.text,
                                    "createdDate": post.createdDate,
                                    "postedDate": post.postedDate,
                                    "scheduledDate": post.scheduledDate,
                                    "lang": post.lang,
                                    "status": post._state,
                                });
                            }
                            w2ui.EpisodeEditPosts.records = precs;
                            w2ui.EpisodeEditPosts.refresh();
                            let bpurl = w2ui.PodcastEdit.record.blueprint._link;
                            $.ajax({
                                url: bpurl,
                                success: function (results) {
                                    let workflows = results.record.workflows.values
                                    let workflowMenuItem = w2ui.EpisodeEditGeneral.toolbar.get('workflows');
                                    workflowMenuItem.items = [];
                                    for (let i in workflows) {
                                        let workflow = workflows[i];
                                        workflow.url = `blueprint/workflow?id${workflow._id}`;
                                        let [target, name] = workflow.name.split('/');
                                        if (target === 'episode') {
                                            if(!workflowMenuItem.items) { workflowMenuItem.items = []; }
                                            workflowMenuItem.items.push({id: workflow._id, type: 'button', text: name.replace('Process', '')});
                                            w2ui.EpisodeEditGeneral.toolbar.factions[workflow._id] = workflow;
                                        }
                                    }
                                    let actMenuItem = w2ui.EpisodeEditGeneral.toolbar.get('activities');
                                    let activities = results.record.activities.values
                                    actMenuItem.items = [];
                                    for (let i in activities) {
                                        let act = activities[i];
                                        act.url = `blueprint/activity?id=${act._id}`;
                                        let [target, name] = act.name.split('/');
                                        if (target === 'episode') {
                                            if (!actMenuItem.items) {
                                                actMenuItem.items = [];
                                            }
                                            actMenuItem.items.push({id: act._id, type: 'button', text: name});
                                            /*w2ui.EpisodeEditGeneral.toolbar.items.push(
                                                {id: act._id, type: 'button', text: name}
                                            );*/
                                            w2ui.EpisodeEditGeneral.toolbar.factions[act._id] = act;
                                        }
                                    }
                                    w2ui.EpisodeEditGeneral.refresh();
                                }
                            });
                        }
                    }
                    w2ui.EpisodeEdit.html('left', w2ui.EpisodeEditTabs);
                    w2ui.EpisodeEdit.html('main', w2ui.EpisodeEditGeneral);
                }
            });
            $().w2sidebar({
                name: 'EpisodeEditTabs',
                flatButton: true,
                nodes: [
                    {id: 'general', text: 'General', selected: true},
                    {id: 'artifacts', text: 'Artifacts'},
                    {id: 'assets', text: 'Assets'},
                    {id: 'posts', text: 'Posts'},
                ],
                onClick(event) {
                    switch (event.target) {
                        case 'general':
                            w2ui['EpisodeEdit'].html('main', w2ui.EpisodeEditGeneral);
                            // w2ui.EpisodeEditGeneral.refresh();
                            // w2ui['EpisodeEdit'].refresh();
                            break;
                        case 'artifacts':
                            w2ui['EpisodeEdit'].html('main', w2ui.EpisodeEditArtifacts);
                            // w2ui.EpisodeEditArtifacts.refresh();
                            // w2ui['EpisodeEdit'].refresh();
                            break;
                        case 'assets':
                            w2ui['EpisodeEdit'].html('main', w2ui.EpisodeEditAssets);
                            // w2ui.EpisodeEditAssets.refresh();
                            // w2ui['EpisodeEdit'].refresh();
                            break;
                        case 'posts':
                            w2ui['EpisodeEdit'].html('main', w2ui.EpisodeEditPosts);
                            // w2ui.EpisodeEditPosts.refresh();
                            // w2ui['EpisodeEdit'].refresh();
                            break;
                    }
                }
            });
            w2ui['EpisodeEdit'].clear = () => {
                w2ui['EpisodeEdit'].record = undefined;
                w2ui['EpisodeEditGeneral'].clear();
                w2ui['EpisodeEditArtifacts'].clear();
                w2ui['EpisodeEditAssets'].clear();
                w2ui['EpisodeEditPosts'].clear();
            };
            $().w2form({
                name: 'EpisodeEditGeneral',
                modelType: 'Episode',
                style: 'border: 0px; background-color: transparent;',
                fields: fields,
                toolbar: {
                    items: [
                        {id: 'promote', type: 'button', text: "Promote"},
                        {id: 'generatePDF', type: 'button', text: "Generate PDF"},
                        {id: 'getStats', type: 'button', text: "Stats"},
                        {id: 'workflows', type: 'menu', text:'Workflows'},
                        {id: 'activities', type: 'menu', text:'Activities'}
                    ],
                    factions: {},
                    onClick(event) {
                        let podcast = w2ui.PodcastEdit.record;
                        let episode = w2ui.EpisodeEdit.record;
                        if (event.target === "promote") {
                            w2popup.close();
                            EpisodeView.openPromoteDialog(podcast, episode, undefined, "EpisodeEdit");
                        } else if(event.target === 'generatePDF') {
                            let url = `episode/generatepdf?id=${episode._id}`;
                            $.ajax({
                                url: url,
                                success: function (results) {
                                    alert("Completed" + results);
                                    console.log("results", results);
                                }
                            });

                        } else if (event.target === 'getStats') {
                            let data = {id: w2ui.EpisodeEditGeneral.record.name};
                            let url = 'episode/getstats';
                            $.post({
                                url: url,
                                data: data,
                                dataType: 'json',
                                success: function (results) {
                                    console.log(results);
                                    let html = `<canvas id="StatsChart">`;
                                    w2ui.EpisodeEdit.html('main', html);
                                    ChartView.showGraph(results.totals, "StatsChart");
                                },
                                failure: function (results) {
                                    console.error(results);
                                    alert(results.status);
                                    w2popup.close();
                                }
                            });
                        } else {
                            let [parent,action] = event.target.split(':');
                            let workflow = w2ui.EpisodeEditGeneral.toolbar.factions[action];
                            if (workflow) {
                                let data = {
                                    id: workflow._id,
                                    pid: w2ui.PodcastEditGeneral.record.name,
                                    episode: w2ui.EpisodeEdit.record._id
                                };
                                let url = workflow.url;
                                // if there are inputs then they should be asked by a popup up here and asked of the user.
                                let inputs = {};
                                for (let name in workflow.inputs) {
                                    if (name !== "id" && name !== "episode") {
                                        inputs[name] = workflow.inputs[name];
                                    }
                                }
                                if (Object.keys(inputs).length > 0) {
                                    ActionView.openDialog(url, inputs, data, _callAction, "EpisodeEdit");
                                } else {
                                    _callAction(url, data);
                                }
                            }
                        }
                    }
                },
                actions: {
                    Save: function () {
                        this.validate();
                        // Create the model.
                        let url = `episode/save?id=${this.record.name}`;
                        let changes = this.getChanges();
                        let data = {};
                        for (let name in changes) {
                            if(name === 'guests') {
                                data.guests = [];
                                for(let i in this.record[name]) {
                                    data.guests.push(this.record[name][i]._name);
                                }
                            }
                            // Skip the owner
                            else if (name !== 'owner') {
                                data[name] = this.record[name];
                            }
                        }

                        $.post({
                            url: url,
                            data: data,
                            dataType: 'json',
                            success: function (results) {
                                console.log(results);
                                $('#popupContent').w2render(w2ui[w2ui.EpisodeEdit.previousWindow]);
                            },
                            failure: function (results) {
                                console.error(results);
                                w2popup.close();
                            }
                        });
                    },
                    Reset: function () {
                        this.clear();
                    },
                    custom: {
                        caption: "Cancel",
                        style: 'background: pink;',
                        onClick(event) {
                            $('#popupContent').w2render(w2ui[w2ui.EpisodeEdit.previousWindow]);
                        }
                    }
                }
            });
            createActionForms();
            $().w2grid({
                name: 'EpisodeEditArtifacts',
                header: 'Artifacts',
                toolbar: {
                    items: [
                        {id: 'submit', type: 'button', text: "Submit"},
                    ],
                    onClick(event) {
                        if (event.target === 'submit') {
                            let selected = w2ui['EpisodeEditArtifacts'].getSelection();
                            let episode = w2ui.EpisodeEdit.record;
                            let sObj = w2ui.EpisodeEditArtifacts.get(selected[0]);
                            w2popup.close();
                            ArtifactView.openPublishDialog(episode, sObj, "EpisodeEdit");
                        }
                    },
                },
                show: {
                    header: true,
                    columnHeaders: true,
                    toolbar: true,
                    toolbarEdit: true,
                    toolbarSave: true,
                },
                onEdit: (event) => {
                    // Open the Episode Edit Dialog

                    let record = w2ui['EpisodeEditArtifacts'].records[event.recid];
                    if (record.recid != event.recid) {
                        for (let i in w2ui.EpisodeEditArtifacts.records) {
                            if (w2ui.EpisodeEditArtifacts.records[i].recid === event.recid) {
                                record = w2ui.EpisodeEditArtifacts.records[i];
                                break;
                            }
                        }
                    }
                    record._id = record.id;
                    ArtifactView.openDialog(record, "EpisodeEdit");
                },
                onSave: (event) => {
                    let changes = w2ui['EpisodeEditArtifacts'].getChanges();
                    let records = w2ui['EpisodeEditArtifacts'].records
                    for (let i in changes) {
                        let change = changes[i];
                        let rec = records[change.recid];
                        // Just updating the artifact
                        if (rec.id) {
                            let url = "Artifact/update?id=rec.id";
                            if (change.url) {
                                url += `&${change.url}`;
                            }
                            if (change.name) {
                                name += `&${change.name}`
                            }
                            if (change.artType) {
                                name += `&${change.artType.text}`
                            }
                            $.ajax({
                                url: url,
                                success: function (results) {
                                    console.log("results", results);
                                }
                            });
                        } else {
                            // Create a new artifact
                            let eid = w2ui['EpisodeEditGeneral'].record.name;
                            let url = `Artifact/create?episode=${eid}`;
                            // Update the record with all of the changes
                            if (change.url) {
                                rec.url = change.url;
                            }
                            if (change.name) {
                                rec.name = change.name;
                            }
                            if (change.artType) {
                                rec.artType = change.artType.text;
                            }
                            for (let rname in rec) {
                                url += `&${rname}=${rec[rname]}`;
                            }
                            $.ajax({
                                url: url,
                                success: function (results) {
                                    console.log("results", results);
                                }
                            });
                        }
                    }
                },
                onDelete: (event) => {
                    let selected = w2ui['EpisodeEditArtifacts'].getSelection();
                    console.log("Delete", selected);

                },
                onRender: (event) => {
                    setTimeout(function () {
                        w2ui.EpisodeEditArtifacts.refreshBody();
                    }, 10);
                },
                onSelect: (event) => {
                    let selected = null;
                    for (let i in w2ui.EpisodeEditArtifacts.records) {
                        let record = w2ui.EpisodeEditArtifacts.records[i];
                        if (record.recid === parseInt(event.recid)) {
                            selected = record;
                        }
                    }
                    // Now set the toolbar with the right states.
                    if (selected.children) {
                        w2ui.EpisodeEditArtifacts.toolbar.disable('promote');
                        w2ui.EpisodeEditArtifacts.toolbar.disable('submit');
                        // traverse the artifacts and get the information

                    } else if (selected.assets > 0) {
                        w2ui.EpisodeEditArtifacts.toolbar.enable('promote');
                        w2ui.EpisodeEditArtifacts.toolbar.enable('submit');
                    } else {
                        w2ui.EpisodeEditArtifacts.toolbar.disable('promote');
                        w2ui.EpisodeEditArtifacts.toolbar.enable('submit');
                    }
                },
                columns: [
                    {
                        field: 'name',
                        caption: 'Name',
                        size: '25%',
                        resizable: true,
                        sortable: true,
                        editable: {type: 'text'}
                    },
                    {
                        field: 'artType', caption: 'Type',
                        size: '10%',
                        resizable: true,
                        sortable: true,
                        editable: {type: 'list', items: artifactTypes, showAll: true},
                    },
                    {
                        field: 'assets', caption: 'Assets',
                        size: '25%',
                        resizable: true,
                        sortable: true,
                        editable: {type: 'text'}
                    },
                    {
                        field: 'summary', caption: 'Summary',
                        size: '35%',
                        resizable: true,
                        sortable: true,
                        editable: {type: 'text'}
                    }
                ]
            });
            $().w2grid({
                name: 'EpisodeEditPosts',
                header: 'Posts',
                show: {
                    header: true,
                    columnHeaders: true,
                    toolbar: true,
                    toolbarSave: true,
                    toolbarAdd: false,
                    toolbarEdit: true,
                    toolbarDelete: false
                },
                toolbar: {
                    items: [
                        {id: 'clone', type: 'button', text: "Clone"},
                        {id: 'calendar', type: 'button', text: "Calendar"}
                    ],
                    onClick(event) {
                        if (event.target === 'clone') {
                            let podcast = w2ui.PodcastEdit.record;
                            let selected = w2ui['EpisodeEditAssets'].getSelection();
                            let episode = w2ui.EpisodeEdit.record;
                            let sObj = w2ui.EpisodeEditAssets.records[selected];
                        } else if (event.target === 'calendar') {
                            let records = w2ui.EpisodeEditPosts.records;
                            let items = [];
                            for (let i in records) {
                                let record = records[i];
                                let endDate = record.postedDate || record.scheduledDate || record.createdDate || new Date();
                                endDate = new Date(endDate);
                                let postTime = `${endDate.getHours()}:${endDate.getMinutes()}`;
                                endDate = `${endDate.getFullYear()}-${endDate.getMonth() +1}-${endDate.getDate()}`;
                                let startDate = record.scheduledDate || record.createdDate || new Date();
                                startDate = new Date(startDate);
                                startDate = `${startDate.getFullYear()}-${startDate.getMonth() +1}-${startDate.getDate()}`;
                                items.push({
                                    id: record._id,
                                    allDay: true,
                                    start: endDate,
                                    end: endDate,
                                    text: record.text,
                                    postedDate: record.postedDate,
                                    channel: record.channel,
                                    title: record.channel + '-' + postTime,
                                    backgroundColor: ecolor[record.status],
                                })
                            }
                            CalendarView.openDialog(items, "PodcastEdit", {
                                onDrop: (info) => {
                                    // update the Episode Release Date.
                                    let releaseDate = info.event.end;
                                    let url = `post/save?id=${info.event.id}`;
                                    url += `&postedDate=${releaseDate}`
                                    // $.ajax({
                                    //     url: url,
                                    //     success: function (results) {
                                    //     }
                                    // });
                                },
                                onClick: (info) => {
                                    let record = null;
                                    for (let i in w2ui.EpisodeEditPosts.records) {
                                        record = w2ui.EpisodeEditPosts.records[i];
                                        if (record._id === info.event.id) {
                                            break;
                                        }
                                    }
                                    if(record) {
                                        PostView.openDialog(record, "PodcastEdit");
                                    }
                                }
                            });
                        }
                    },
                },
                onEdit: (event) => {
                    console.log("Edit");

                },
                onRender: (event) => {
                    setTimeout(function () {
                        w2ui.EpisodeEditPosts.refreshBody();
                    }, 10);
                },
                columns: [
                    {
                        field: 'status', caption: 'Status',
                        size: '5%',
                        resizable: true,
                    },
                    {
                        field: 'lang', caption: 'Lang',
                        size: '5%',
                        resizable: true,
                    },
                    {
                        field: 'channel', caption: 'Channel',
                        size: '15%',
                        resizable: true,
                    },
                    {
                        field: 'postedDate', caption: 'Published',
                        size: '15%',
                        resizable: true,
                    },
                    {
                        field: 'text', caption: 'Text',
                        size: '60%',
                        resizable: true,
                        editable: {type: 'text'},
                    },
                ]
            });
            $().w2grid({
                name: 'EpisodeEditAssets',
                header: 'Assets',
                toolbar: {
                    items: [
                        {id: 'promote', type: 'button', text: "Promote"}
                    ],
                    onClick(event) {
                        if (event.target === 'promote') {
                            let podcast = w2ui.PodcastEdit.record;
                            let selected = w2ui['EpisodeEditAssets'].getSelection();
                            let episode = w2ui.EpisodeEdit.record;
                            let sObj = w2ui.EpisodeEditAssets.get(selected);
                            w2popup.close();
                            EpisodeView.openPromoteDialog(podcast, episode, sObj[0], "EpisodeEdit");
                        }
                    },
                },
                show: {
                    header: true,
                    columnHeaders: true,
                    toolbar: true,
                    toolbarEdit: true,
                    toolbarSave: true,
                },
                onSave: (event) => {
                    let changes = w2ui['EpisodeEditAssets'].getChanges();
                    let records = w2ui['EpisodeEditAssets'].records
                    for (let i in changes) {
                        let change = changes[i];
                        let rec = records[change.recid];
                        // Just updating the artifact
                        if (rec.id) {
                            let url = `asset/save?id=${rec.id}`;
                            if (change.url) {
                                url += `&url=${change.url}`;
                            }
                            if (change.title) {
                                name += `&title=${change.title}`
                            }
                            if (change.summary) {
                                name += `&summary=${change.summary}`
                            }
                            $.ajax({
                                url: url,
                                success: function (results) {
                                    console.log("results", results);
                                }
                            });
                        }
                    }
                },
                onRender: (event) => {
                    setTimeout(function () {
                        w2ui.EpisodeEditAssets.refreshBody();
                    }, 10);
                },
                onEdit: (event) => {
                    // Open the Episode Edit Dialog
                    let record = w2ui['EpisodeEditAssets'].records[event.recid];
                    if (record.recid != event.recid) {
                        for (let i in w2ui.EpisodeEditAssets.records) {
                            if (w2ui.EpisodeEditAssets.records[i].recid === event.recid) {
                                record = w2ui.EpisodeEditAssets.records[i];
                                break;
                            }
                        }
                    }
                    record._id = record.id;
                    let episode = w2ui.EpisodeEdit.record;
                    AssetView.openDialog({
                        asset: record,
                        channel: record.channel,
                        artifact: record.artifact,
                        episode: episode,
                        name: record.name,
                        artType: "",
                        fields: { summary: record.summary, title: record.title },
                        url: record.url
                    }, 'EpisodeEdit');
                },
                columns: [
                    {
                        field: 'name',
                        caption: 'Name',
                        size: '15%',
                        resizable: true,
                    },
                    {
                        field: 'channel', caption: 'Channel',
                        size: '5%',
                        resizable: true,
                        // editable: {type: 'text'}
                    },
                    {
                        field: 'artifact', caption: 'Artifact',
                        size: '5%',
                        resizable: true,
                        // editable: {type: 'text'}
                    },
                    {
                        field: 'url', caption: 'URL',
                        size: '10%',
                        resizable: true,
                        editable: {type: 'text'}
                    },
                    {
                        field: 'title', caption: 'Title',
                        size: '20%',
                        resizable: true,
                        editable: {type: 'text'}
                    },
                    {
                        field: 'summary', caption: 'Summary',
                        size: '30%',
                        resizable: true,
                        editable: {type: 'text'}
                    }

                ]
            });
        }
        return w2ui['EpisodeEdit'];
    }

    static getEditForm(obj) {
        w2ui['EpisodeEdit'].clear();
        w2ui['EpisodeEdit'].record = obj;
        let url = `episode/show?id=${obj._id}`;
        $.ajax({
            url: url,
            success: function (results) {
                w2ui['EpisodeEdit'].record = results.record;
            }
        });
        return w2ui['EpisodeEdit'];
    }

    static openDialog(obj, previousWindow) {
        let editForm = EpisodeView.getEditForm(obj);
        editForm.previousWindow = previousWindow;
        w2popup.open({
            height: 850,
            width: 850,
            title: `Edit ${obj._name}`,
            body: '<div id="popupContent" style="width: 100%; height: 100%;"></div>',
            showMax: true,
            onToggle: function (event) {
                $(w2ui.popupContent.box).hide();
                event.onComplete = function () {
                    $(w2ui.popupContent.box).show();
                    w2ui.popupContent.resize();
                }
            },
            onOpen: function (event) {
                event.onComplete = function () {
                    // specifying an onOpen handler instead is equivalent to specifying an onBeforeOpen handler,
                    // which would make this code execute too early and hence not deliver.
                    $('#popupContent').w2render(editForm);
                }
            }
        });
    }

    static openPromoteDialog(podcast, episode, asset, previousWindow) {
        let url = `blueprint?id=${podcast.blueprint._id}`;
        $.ajax({
            url: url,
            success: function (results) {
                let blueprint = results.record;
                let mappings = blueprint.mappings.values;
                let id = episode.id || episode._id;
                let url = `episode/show?id=${id}`;
                $.ajax({
                    url: url,
                    success: function (results) {
                        let inputForm = EpisodeView.getPromoteForm(mappings, results.record, asset, previousWindow);
                        inputForm.previousWindow = previousWindow;
                        w2popup.open({
                            height: 850,
                            width: 850,
                            title: `Promote Episode: ${episode._name}`,
                            body: '<div id="popupContent" style="width: 100%; height: 100%;"></div>',
                            showMax: true,
                            onToggle: function (event) {
                                $(w2ui.popupContent.box).hide();
                                event.onComplete = function () {
                                    $(w2ui.popupContent.box).show();
                                    w2ui.popupContent.resize();
                                }
                            },
                            onOpen: function (event) {
                                event.onComplete = function () {
                                    // specifying an onOpen handler instead is equivalent to specifying an onBeforeOpen handler,
                                    // which would make this code execute too early and hence not deliver.
                                    $('#popupContent').w2render(inputForm);
                                }
                            }
                        });
                    }
                });
            }
        });
    }

    static getPromoteForm(mappings, episode, asset, previousWindow) {
        let publishForm = EpisodeView.createPromote(mappings, episode, asset, previousWindow);
        let urls = "";
        w2ui['EpisodeEdit'].record = episode;
        let assets = episode.assets.values;
        for (let i in assets) {
            let tasset = assets[i];
            urls += `${tasset.name}: ${tasset.url}\n`;
        }
        let tags = episode.tags.values;
        let tagStrings = [];
        for (let i in tags) {
            let tag = tags[i];
            tagStrings.push("#" + tag.name);
        }
        let record = {
            number: episode.number.name,
            summary: episode.summary.name,
            title: episode.title.name,
            tags: tagStrings.join(', '),
            urls: urls
        }

        publishForm.record = record;
        return publishForm;
    }

    static createPromote(mappings, episode, asset, previousWindow) {
        $().w2layout({
            name: "EpisodePromotePane",
            panels: [
                {type: 'left', size: 150, resizable: true},
                {
                    type: 'main', size: 500, overflow: 'hidden',
                    toolbar: {
                        name: 'LanguageToolBar',
                        items: [
                            {id: 'en', type: 'radio', group: 'lang', text: "English"},
                            {id: 'fr', type: 'radio', group: 'lang', text: "French"},
                            {id: 'de', type: 'radio', group: 'lang', text: "German"},
                            {id: 'it', type: 'radio', group: 'lang', text: "Italian"},
                            {id: 'pt', type: 'radio', group: 'lang', text: "Portuguese"},
                            {id: 'es', type: 'radio', group: 'lang', text: "Spanish"},
                        ],
                        onClick(event) {
                            w2ui.EpisodePromotePane.lang = event.target;
                        }
                    }
                }
            ],
            onRender: (event) => {
                w2ui.EpisodePromotePane.html('left', w2ui.EpisodePromoteTemplates);
                w2ui.EpisodePromotePane.html('main', "Select the Channel Below");
            }
        });
        let nodes = [];
        let events = {};
        for (let i in mappings) {
            nodes.push({id: mappings[i]._id, text: mappings[i]._name});
            events[mappings[i]._id] = mappings[i];
        }
        $().w2sidebar({
            name: 'EpisodePromoteTemplates',
            flatButton: true,
            nodes: nodes,
            onClick(event) {
                let mapping = events[event.target];
                let url = mapping._link;
                w2ui.EpisodePromotePane.html('main', "<h1>Generating Post, Please Wait!</h1>");
                $.ajax({
                    url: url,
                    success: function (results) {
                        let mapping = results.record
                        let channels = mapping.channels.values;
                        let lang = w2ui.EpisodePromotePane.lang;
                        let turl = `mapping/render?id=${mapping._id}&episode=${episode._id}&lang=${lang}`;
                        if (asset) {
                            turl += `&asset=${asset.id}`;
                        }
                        $.ajax({
                            url: turl,
                            success: function (results) {
                                let html = EpisodeView.getTemplateForm(episode, channels, mapping, results.results, previousWindow);
                                w2ui.EpisodePromotePane.html('main', html);
                            }
                        });
                    }
                })
            }
        });
        return w2ui['EpisodePromotePane'];
    }

    static getTemplateForm(episode, channels, mappings, results, previousWindow) {
        let fields = [];
        let record = {};
        for (let rname in results) {
            record[rname] = results[rname];
        }
        let actions = {
            Cancel: function () {
                $('#popupContent').w2render(w2ui[w2ui.EpisodeTemplateForm.previousWindow]);
            },
            Save: function () {
                // Get the channel.
                // Call promoteAsset on it.
                let url = `channel/promote`;
                let data = w2ui.EpisodeChannelForm.record;
                data.channel = data.channel._id || data.channel;
                data.episode = data.episode._id || data.episode;
                $.post({
                    url: url,
                    data: data,
                    success: function (results) {
                        if (results.redirect) {
                            window.open(results.redirect, "popup");
                        }
                        alert(results.message);
                    },
                    failure: function (error) {
                        alert(results.error);
                    }
                });
            }
        }
        for (let i in channels) {
            let channel = channels[i];
            actions[channel._id] = {
                caption: channel._name,
                style: 'background: lightgreen',
                onClick(event) {
                    let episode = w2ui['EpisodeEdit'].record;
                    let url = `channel/promoteInputs?id=${channel._id}`;
                    console.log("Event:", event);
                    $.ajax({
                        url: url,
                        success: function (results) {
                            let fields = [];
                            let record = w2ui.EpisodeTemplateForm.record;
                            record.channel = channel;
                            record.episode = episode;
                            for (let iname in results.results) {
                                let input = results.results[iname];
                                if (input.type !== 'ref') {
                                    let size = input.size || 100;
                                    fields.push({
                                        field: iname,
                                        type: 'textarea',
                                        required: input.required,
                                        html: {
                                            label: iname,
                                            attr: `size="${size}" style="width:500px; height:${(Math.round(size / 100) + 1) * 30}px"`
                                        }
                                    });
                                }
                            }
                            let actions = w2ui.EpisodeTemplateForm.actions;
                            if (w2ui.hasOwnProperty('EpisodeChannelForm')) {
                                $().w2destroy('EpisodeChannelForm');
                            }
                            $().w2form({
                                name: 'EpisodeChannelForm',
                                modelType: 'Episode',
                                fields: fields,
                                actions: actions,
                                record: record
                            });
                            w2ui.EpisodePromotePane.html('main', w2ui.EpisodeChannelForm);
                        }
                    })
                }
            }
        }
        if (w2ui.hasOwnProperty('EpisodeTemplateForm')) {
            $().w2destroy('EpisodeTemplateForm');
        }
        $().w2form({
            name: 'EpisodeTemplateForm',
            modelType: 'Episode',
            fields: fields,
            actions: actions,
            record: record
        });
        w2ui.EpisodeTemplateForm.previousWindow = previousWindow;
        return w2ui.EpisodeTemplateForm;
    }

    show(obj) {

    }
}

function lookUpList(title, name, type) {
    return {
        field: name,
        type: 'enum',
        options: {
            url: `${type}/list?mode=json`,
            renderItem: (item) => {
                if (item._name) {
                    return item._name;
                } else {
                    return item.name;
                }
            },
            renderDrop: (item) => {
                if (item.name.name) {
                    return item.name.name;
                } else {
                    return item.name;
                }
            },
            onNew: (event) => {
                // Add the item on the server side when it is saved.
                $.extend(event.item, {_name: event.item.text});
            },
            compare: function (item, search) {
                let re1 = new RegExp(search, 'i');
                if (re1.test(item._name)) {
                    return true;
                } else {
                    return false;
                }
            },
            openOnFocus: true,
        },
        html: {label: title, attr: 'style="width:500px"'}
    }
}

function lookUpItem(title, name, type) {
    return {
        field: name,
        type: 'enum',
        max: 1,
        options: {
            url: `${type}/list?mode=json`,
            renderItem: (item) => {
                if (item) {
                    if (item.name.name) {
                        return item.name.name;
                    } else {
                        return item.name;
                    }
                } else {
                    return "";
                }
            },
            renderDrop: (item) => {
                if (item.name.name) {
                    return item.name.name;
                } else {
                    return item.name;
                }
            },
            onNew: (event) => {
                // Add the item on the server side. When it is saved.
                $.extend(event.item, {_name: event.item.text});
            },
            compare: function (item, search) {
                let re1 = new RegExp(search, 'i');
                if (re1.test(item.id)) {
                    return true;
                } else
                    return re1.test(item.name.name);
            },
            openOnFocus: true,
        },
        html: {label: title, attr: 'style="width:500px"'}
    }
}

function createActionForms() {
    $().w2form({
        name: 'EpisodeActionsschedule',
        modelType: 'Episode',
        style: 'border: 0px; background-color: transparent;',
        fields: [{
            field: 'date',
            type: 'date',
            required: true,
        }],
        actions: {
            Save: function () {
                this.validate();
                // Create the model.
                let url = `episode/schedule?id=${this.record._id}&date=${this.record.date}`;
                console.log(url);
                $.post({
                    url: url,
                    data: {},
                    dataType: 'json',
                    success: function (results) {
                        console.log(results);
                        // w2popup.close();
                    },
                    failure: function (results) {
                        console.error(results);
                        //w2popup.close();
                    }
                });

            },
            Reset: function () {
                this.clear();
            },
            custom: {
                caption: "Cancel",
                style: 'background: pink;',
                onClick(event) {
                    w2popup.close();
                    $('#popupContent').w2render(w2ui[w2ui.EpisodeEdit.previousWindow]);
                }
            }
        }
    });
}

function _callAction(url, data) {
    $.post({
        url: url,
        data: data,
        dataType: 'json',
        success: function (results) {
            console.log(results);
            alert(results.status);
            w2popup.close();
        },
        failure: function (results) {
            console.error(results);
            alert(results.status);
            w2popup.close();
        }
    });
}

function _artifactGrid(values) {
    let records = [];
    let map = {};
    for (let i in values) {
        let value = values[i];
        let names = value._name.split('/');
        let name = undefined;
        _traverseArtifacts(map, names, value)
    }
    _artifactRecID = 1;
    _createArtifactRecords(map, records);
    return records;
}

function _traverseArtifacts(parent, names, item) {
    if (names.length > 1) {
        name = names.shift();
        if (!parent.hasOwnProperty(name)) {
            parent[name] = {
                "id": name,
                "name": name,
                "artType": "all",
                "summary": "",
                "link": undefined,
                "assets": 0,
                "children": {},
            }
        }
        parent[name].assets++;
        _traverseArtifacts(parent[name].children, names, item);
    } else {
        parent[names[0]] = {
            "id": item._id,
            "name": item._name,
            "artType": item.artType,
            "summary": item.summary,
            "link": item._link,
        }
    }
    return parent;
}

function _createArtifactRecords(map, records) {

    for (let name in map) {
        let item = map[name];
        item.recid = _artifactRecID++;
        records.push(item);
        if (item.children) {
            item.w2ui = {children: []};
            _createArtifactRecords(item.children, item.w2ui.children);
        }
    }
}

function _artifactGetInfo(arecords) {
    for (let i in arecords) {
        if (arecords[i].children) {
            _artifactGetInfo(arecords[i].w2ui.children);
        } else if (arecords[i].link) {
            $.ajax({
                url: arecords[i].link,
                success: function (results) {
                    arecords[i].summary = results.record.summary.name;
                    arecords[i].assets = results.record.assets.count;
                    arecords[i].title = results.record.title.name;
                },
            });
        }
    }
}

let _assetRecID = 0;

function _assetGrid(values) {
    let records = [];
    let map = {};
    for (let i in values) {
        let value = values[i];
        let names = value._name.split('/');
        let name = undefined;
        _traverseAssets(map, names, value)
    }
    _assetRecID = 1;
    _createAssetRecords(map, records);
    return records;
}

function _traverseAssets(parent, names, item) {
    if (names.length > 1) {
        name = names.shift();
        if (!parent.hasOwnProperty(name)) {
            parent[name] = {
                "id": name,
                "name": name,
                "artType": "all",
                "summary": "",
                "link": undefined,
                "artifacts": 0,
                "children": {},
            }
        }
        parent[name].artifacts++;
        _traverseAssets(parent[name].children, names, item);
    } else {
        parent[names[0]] = {
            "id": item._id,
            "name": item._name,
            "artType": item.artType,
            "summary": item.summary,
            "link": item._link,
        }
    }
    return parent;
}

function _createAssetRecords(map, records) {

    for (let name in map) {
        let item = map[name];
        item.recid = _assetRecID++;
        records.push(item);
        if (item.children) {
            item.w2ui = {children: []};
            _createAssetRecords(item.children, item.w2ui.children);
        }
    }
}

function _assetGetInfo(arecords) {
    for (let i in arecords) {
        if (arecords[i].children) {
            _assetGetInfo(arecords[i].w2ui.children);
        } else if (arecords[i].link) {
            $.ajax({
                url: arecords[i].link,
                success: function (results) {
                    if (results.record.artifact) {
                        arecords[i].artifact = results.record.artifact.name;
                        arecords[i].summary = results.record.artifact.summary;
                    }
                    if (results.record.channel) {
                        arecords[i].channel = results.record.channel.name;
                    }
                    if (results.record.url.name) {
                        arecords[i].url = results.record.url.name;
                    }
                    if (results.record.title.name) {
                        arecords[i].title = results.record.title.name;
                    }
                },
            });
        }
    }
}
