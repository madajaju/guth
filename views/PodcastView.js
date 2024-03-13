import EpisodeView from './EpisodeView.js';
import PersonView from './PersonView.js';
import ActionView from './ActionView.js';
import ChartView from './ChartView.js';
import CalendarView from './CalendarView.js';

const ecolor = {
    "Created": "#aaaaff",
    "Backlog": "#ffaa88",
    "backlog": "#ffaa88",
    "Scheduled": "#aaaa77",
    "Recorded": "#66aaaa",
    "Edited": "#88cc88",
    "Written": "#44aa44",
    "Published": "#aaaaaa",
    "Cancelled": "#ffaaaa",
}
export default class PodcastView {
    constructor(config) {
        this.config = config;
        PodcastView.createEdit();
        PodcastView.createList();
        PodcastView.createDetail();
    }

    static createList() {
        if (!w2ui['PodcastList']) {
        }
    }

    static createDetail() {
        if (!w2ui['PodcastDetail']) {
        }
    }

    static createEdit() {
        if (!w2ui['PodcastEdit']) {
            let fields = [];
            fields.push({
                field: 'name',
                type: 'textarea',
                required: true,
                html: {label: "Name", attr: `size="20" style="width:500px"`}
            });
            fields.push({
                field: 'summary',
                type: 'textarea',
                required: true,
                html: {label: "Summary", attr: `size="1000" style="width:500px; height:100px"`}
            });
            $().w2layout({
                name: 'PodcastEdit',
                panels: [
                    {type: 'left', size: 100, resizable: true, minSize: 35},
                    {type: 'main', size: 550, overflow: 'hidden'}
                ],
                onRender: (event) => {
                    // Add the record to the form and the assoication tabs
                    if (event.target === 'PodcastEdit') {
                        if (w2ui.PodcastEdit.record) {
                            // General Panel
                            w2ui.PodcastEditGeneral.record = {};
                            // Enums Must be in an array
                            w2ui.PodcastEditGeneral.record.name = w2ui.PodcastEdit.record.name.name;
                            w2ui.PodcastEditGeneral.record.summary = w2ui.PodcastEdit.record.summary.name;
                            w2ui.PodcastEditGeneral.refresh();

                            // Episodes Panel
                            let arecords = [];
                            let counter = 0;
                            let nextEpisodeNumber = 0;
                            for (let i in w2ui.PodcastEdit.record.episodes.values) {
                                let episode = w2ui.PodcastEdit.record.episodes.values[i];
                                let color = ecolor[episode._state] || '#cccccc';
                                arecords.push({
                                    "recid": counter++,
                                    "state": episode._state,
                                    "date": episode.releaseDate || episode.scheduleDate,
                                    "id": episode._id,
                                    "title": episode.title,
                                    "lang": episode.lang,
                                    "number": Number(episode.number, 0),
                                    "summary": episode.summary,
                                    "w2ui": {"style": {0: `background-color: ${color}`}}
                                });
                                nextEpisodeNumber = Math.max(episode.number, nextEpisodeNumber);
                            }
                            w2ui.PodcastEditEpisodes.episodeNumber = nextEpisodeNumber;
                            w2ui.PodcastEditEpisodes.records = arecords;
                            w2ui.PodcastEditEpisodes.refresh();


                            // Guests Panel
                            let aguests = [];
                            counter = 0;
                            for (let i in w2ui.PodcastEdit.record.guests.values) {
                                let guest = w2ui.PodcastEdit.record.guests.values[i];
                                aguests.push({
                                    "recid": counter++,
                                    "id": guest._id,
                                    "name": guest._name,
                                    "email": guest.email,
                                    "notes": guest.notes,
                                });
                            }
                            w2ui.PodcastEditGuests.records = aguests;
                            w2ui.PodcastEditGuests.refresh();

                            // Channels Panel
                            let achannels = [];
                            counter = 0;
                            for (let i in w2ui.PodcastEdit.record.channels.values) {
                                let channel = w2ui.PodcastEdit.record.channels.values[i];
                                achannels.push({
                                    "recid": counter++,
                                    "_id": channel._id,
                                    "name": channel.name,
                                    "user": channel.user,
                                    "authorized": channel.authorized,
                                });
                            }
                            w2ui.PodcastEditChannels.records = achannels;
                            w2ui.PodcastEditChannels.refresh();


                            // Now get the workflow options from the podcast's blueprint.
                            let bpurl = w2ui.PodcastEdit.record.blueprint._link;
                            $.ajax({
                                url: bpurl,
                                success: function (results) {
                                    let workflows = results.record.workflows.values
                                    let workflowMenuItem = w2ui.PodcastEditGeneral.toolbar.get('workflows');
                                    for (let i in workflows) {
                                        let workflow = workflows[i];
                                        let [target, name] = workflow.name.split('/');
                                        if (target === 'podcast') {
                                            if(!workflowMenuItem.items) { workflowMenuItem.items = []; }
                                            workflowMenuItem.items.push({id: workflow._id, type: 'button', text: name.replace('Process', '')});
                                            w2ui.PodcastEditGeneral.toolbar.factions[workflow._id] = workflow;
                                        }
                                    }
                                    let actMenuItem = w2ui.PodcastEditGeneral.toolbar.get('activities');
                                    let activities = results.record.activities.values
                                    for (let i in activities) {
                                        let act = activities[i];
                                        act.url = `blueprint/activity?id=${act._id}`;
                                        let [target, name] = act.name.split('/');
                                        if (target === 'podcast') {
                                            if(!actMenuItem.items) { actMenuItem.items = []; }
                                            actMenuItem.items.push({id: act._id, type: 'button', text: name});
                                            /*w2ui.PodcastEditGeneral.toolbar.items.push(
                                                {id: act._id, type: 'button', text: name}
                                            );*/
                                            w2ui.PodcastEditGeneral.toolbar.factions[act._id] = act;
                                        }
                                    }
                                    w2ui.PodcastEditGeneral.refresh();
                                }
                            });
                        }
                    }
                    w2ui.PodcastEdit.html('left', w2ui.PodcastEditTabs);
                    w2ui.PodcastEdit.html('main', w2ui.PodcastEditGeneral);
                }
            });
            $().w2sidebar({
                name: 'PodcastEditTabs',
                flatButton: true,
                nodes: [
                    {id: 'general', text: 'General', selected: true},
                    {id: 'episodes', text: 'Episodes'},
                    {id: 'guests', text: 'Guests'},
                    {id: 'channels', text: 'Channels'},
                ],
                onClick(event) {
                    switch (event.target) {
                        case 'general':
                            w2ui['PodcastEdit'].html('main', w2ui.PodcastEditGeneral);
                            break;
                        case 'episodes':
                            w2ui['PodcastEdit'].html('main', w2ui.PodcastEditEpisodes);
                            break;
                        case 'guests':
                            w2ui['PodcastEdit'].html('main', w2ui.PodcastEditGuests);
                            break;
                        case 'channels':
                            w2ui['PodcastEdit'].html('main', w2ui.PodcastEditChannels);
                            break;
                    }
                }
            });
            w2ui['PodcastEdit'].clear = () => {
                w2ui['PodcastEdit'].record = undefined;
                w2ui['PodcastEditGeneral'].clear();
                w2ui['PodcastEditEpisodes'].clear();
                w2ui['PodcastEditGuests'].clear();
                w2ui['PodcastEditChannels'].clear();
            };
            $().w2form({
                name: 'PodcastEditGeneral',
                modelType: 'Podcast',
                style: 'border: 0px; background-color: transparent;',
                toolbar: {
                    items: [
                        {id: 'getstats', type: 'button', text: 'Stats'},
                        {id: 'calendar', type: 'button', text: 'Calendar'},
                        {id: 'activities', type: 'menu', text: 'Activities'},
                        {id: 'workflows', type: 'menu', text: 'Workflows'},
                    ],
                    factions: {},
                    onClick(event) {
                        if (event.target === 'getstats') {
                            let data = {id: w2ui.PodcastEditGeneral.record.name};
                            let url = 'podcast/getstats';
                            $.post({
                                url: url,
                                data: data,
                                dataType: 'json',
                                success: function (results) {
                                    console.log(results);
                                    let html = `<canvas id="StatsChart">`;
                                    w2ui.PodcastEdit.html('main', html);
                                    ChartView.showGraph(results.totals, "StatsChart");
                                },
                                failure: function (results) {
                                    console.error(results);
                                    alert(results.status);
                                    w2popup.close();
                                }
                            });
                        } else if (event.target === 'calendar') {
                            let records = w2ui.PodcastEdit.record.episodes.values;
                            let items = [];
                            for (let i in records) {
                                let record = records[i];
                                let endDate = record.releaseDate || record.createdDate || new Date();
                                endDate = new Date(endDate);
                                endDate = `${endDate.getFullYear()}-${endDate.getMonth() +1}-${endDate.getDate()}`;
                                let startDate = record.createdDate || new Date();
                                startDate = new Date(startDate);
                                startDate = `${startDate.getFullYear()}-${startDate.getMonth() +1}-${startDate.getDate()}`;
                                items.push({
                                    id: record._id,
                                    allDay: true,
                                    start: endDate,
                                    end: endDate,
                                    title: record.number + '-' + record.title,
                                    backgroundColor: ecolor[record._state],
                                })
                            }
                            CalendarView.openDialog(items, "PodcastEdit", {
                                onDrop: (info) => {
                                    // update the Episode Release Date.
                                    let releaseDate = info.event.end;
                                    let url = `episode/save?id=${info.event.id}`;
                                    url += `&releaseDate=${releaseDate}`
                                    $.ajax({
                                        url: url,
                                        success: function (results) {
                                        }
                                    });
                                },
                                onClick: (info) => {
                                    let record = null;
                                    for (let i in w2ui.PodcastEdit.record.episodes.values) {
                                        record = w2ui.PodcastEdit.record.episodes.values[i];
                                        if (record._id === info.event.id) {
                                            break;
                                        }
                                    }
                                    if(record) {
                                        EpisodeView.openDialog(record, "PodcastEdit");
                                    }
                                }
                            });
                        } else {
                            let [parent,action] = event.target.split(':');
                            let workflow = w2ui.PodcastEditGeneral.toolbar.factions[action];
                            if (workflow) {
                                let data = {id: workflow._id, pid: w2ui.PodcastEditGeneral.record.name};
                                let url = workflow.url;
                                // if there are inputs then they should be asked by a popup up here and asked of the user.
                                let inputs = {};
                                for (let name in workflow.inputs) {
                                    if (name !== "id" && name !== "pid") {
                                        inputs[name] = workflow.inputs[name];
                                    }
                                }
                                if (Object.keys(inputs).length > 0) {
                                    console.log(workflow.inputs);
                                    ActionView.openDialog(url, inputs, data, _callAction, "PodcastEdit");
                                } else {
                                    _callAction(url, data);
                                }
                            }
                        }
                    }
                },
                fields: fields,
                actions: {
                    Save: function () {
                        this.validate();
                        // Create the model.
                        let url = `podcast/save`;
                        let data = {};
                        for (let name in this.record) {
                            data[name] = this.record[name];
                        }
                        $.post({
                            url: url,
                            data: data,
                            dataType: 'json',
                            success: function (results) {
                                w2popup.close();
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
                            w2popup.close();
                        }
                    }
                }
            });
            $().w2grid({
                name: 'PodcastEditEpisodes',
                header: 'Episodes',
                show: {
                    header: true,
                    columnHeaders: true,
                    toolbar: true,
                    toolbarSave: true,
                    toolbarAdd: true,
                    toolbarEdit: true,
                    toolbarDelete: true
                },
                toolbar: {
                    items: [
                        {id: 'publish', type: 'button', text: "Publish"},
                        {id: 'promote', type: 'button', text: "Promote"}
                    ],
                    onClick(event) {
                        if (event.target === 'publish') {
                            let selected = w2ui['PodcastEditEpisodes'].getSelection();
                            let records = w2ui.PodcastEditEpisodes.records;
                            let sObj = null;
                            for (let i in records) {
                                let record = records[i];
                                if (record.recid === selected[0]) {
                                    sObj = record;
                                }
                            }
                            let podcast = w2ui.PodcastEdit.record;
                            w2popup.close();
                            PodcastView.openPublishDialog(podcast, sObj);
                        } else if (event.target === 'promote') {
                            let selected = w2ui['PodcastEditEpisodes'].getSelection();
                            let records = w2ui.PodcastEditEpisodes.records;
                            let sObj = null;
                            for (let i in records) {
                                let record = records[i];
                                if (record.recid === selected[0]) {
                                    sObj = record;
                                }
                            }
                            let podcast = w2ui.PodcastEdit.record;
                            w2popup.close();
                            EpisodeView.openPromoteDialog(podcast, sObj, undefined, "PodcastEdit");
                        }
                    }
                },
                onAdd: (event) => {
                    let workflow = null;
                    let workflows = w2ui.PodcastEditGeneral.toolbar.factions;
                    for (let i in workflows) {
                        if (workflows[i].name.includes('createEpisode')) {
                            workflow = workflows[i];
                        }
                    }
                    if (workflow) {
                        let data = {id: workflow._id, pid: w2ui.PodcastEditGeneral.record.name};
                        let url = workflow.path.replaceAll(/\s/g, '');
                        // if there are inputs then they should be asked by a popup up here and asked of the user.
                        let inputs = {};
                        for (let name in workflow.inputs) {
                            if (name !== "id") {
                                inputs[name] = workflow.inputs[name];
                            }
                        }
                        if (Object.keys(inputs).length > 0) {
                            console.log(workflow.inputs);
                            ActionView.openDialog(url, inputs, data, _callAction, "PodcastEdit");
                        } else {
                            _callAction(url, data);
                        }
                    }
                },
                onSave: (event) => {
                    let changes = w2ui['PodcastEditEpisodes'].getChanges();
                    let records = w2ui['PodcastEditEpisodes'].records
                    for (let i in changes) {
                        let change = changes[i];
                        let rec = null;
                        for (let j in records) {
                            if (records[j].recid === change.recid) {
                                rec = records[j];
                                break;
                            }
                        }
                        // Just updating the episode
                        if (rec.id) {
                            let url = `episode/save?id=${rec.id}`;
                            for(let i in change) {
                                if(i === "date") {
                                    url += `&releaseDate=${change[i]}`;
                                } else {
                                    url += `&${i}=${change[i]}`;
                                }
                            }
                            $.ajax({
                                url: url,
                                success: function (results) {
                                    console.log("results", results);
                                }
                            });
                        } else {
                        }
                    }
                },
                onEdit: (event) => {
                    // Open the Episode Edit Dialog

                    let record = w2ui['PodcastEditEpisodes'].records[event.recid];
                    if (record.recid != event.recid) {
                        for (let i in w2ui.PodcastEditEpisodes.records) {
                            if (w2ui.PodcastEditEpisodes.records[i].recid === event.recid) {
                                record = w2ui.PodcastEditEpisodes.records[i];
                                break;
                            }
                        }
                    }
                    record._id = record.id;
                    EpisodeView.openDialog(record, "PodcastEdit");
                },
                onDelete: (event) => {
                    let selected = w2ui['PodcastEditEpisodes'].getSelection();
                    console.log("Delete", selected);
                },
                onRender: (event) => {
                    w2ui.PodcastEditEpisodes.sort('number', 'desc');
                    setTimeout(function () {
                        w2ui.PodcastEditEpisodes.refreshBody();
                    }, 10);
                },
                onSelect: (event) => {
                    let selected = null;
                    for (let i in w2ui.PodcastEditEpisodes.records) {
                        let record = w2ui.PodcastEditEpisodes.records[i];
                        if (record.recid === parseInt(event.recid)) {
                            selected = record;
                        }
                    }
                    // Now set the toolbar with the right states.
                    if (selected.state === 'Published') {
                        w2ui.PodcastEditEpisodes.toolbar.enable('promote');
                        w2ui.PodcastEditEpisodes.toolbar.disable('publish');
                    } else {
                        w2ui.PodcastEditEpisodes.toolbar.disable('promote');
                        w2ui.PodcastEditEpisodes.toolbar.enable('publish');
                    }
                },
                columns: [
                    {
                        field: 'state',
                        caption: 'State',
                        size: '10%',
                        resizable: true,
                        editable: {type: 'text'},
                        sortable: true,
                    },
                    {
                        field: 'number', caption: 'Number',
                        size: '5%',
                        resizable: true,
                        sortable: true,
                        editable: {type: 'number'}
                    },
                    {
                        field: 'date', caption: 'Date',
                        size: '10%',
                        resizable: true,
                        sortable: true,
                        editable: {type: 'date'}
                    },
                    {
                        field: 'title',
                        caption: 'Title',
                        size: '25%',
                        resizable: true,
                        sortable: true,
                        editable: {type: 'text'}
                    },
                    {
                        field: 'lang',
                        caption: "Languages",
                        size: "10%",
                    },
                    {
                        field: 'summary', caption: 'Summary',
                        size: '40%',
                        resizable: true,
                        sortable: true,
                        editable: {type: 'text'}
                    },
                ]
            });
            $().w2grid({
                name: 'PodcastEditGuests',
                header: 'Guests',
                show: {
                    header: true,
                    columnHeaders: true,
                    toolbar: true,
                    toolbarSave: false,
                    toolbarAdd: true,
                    toolbarEdit: true,
                    toolbarDelete: true
                },
                onAdd: (event) => {
                    let anum = w2ui['PodcastEditGuests'].records.length;
                    w2ui['PodcastEditGuests'].add({
                        "recid": anum,
                        "name": "Enter Name",
                        "email": "nobody@email.com",
                        "notes": "Notes",
                    });
                },
                onEdit: (event) => {
                    // Open the Episode Edit Dialog
                    let record = w2ui['PodcastEditGuests'].records[event.recid];
                    if (record.recid != event.recid) {
                        for (let i in w2ui.PodcastEditGuests.records) {
                            if (w2ui.PodcastEditGuests.records[i].recid === event.recid) {
                                record = w2ui.PodcastEditGuests.records[i];
                                break;
                            }
                        }
                    }
                    record._id = record.id;
                    PersonView.openDialog(record, "PodcastEdit");
                },
                onDelete: (event) => {
                    let selected = w2ui['PodcastEditEpisodes'].getSelection();
                    console.log("Delete", selected);
                },
                onRender: (event) => {
                    setTimeout(function () {
                        w2ui.PodcastEditGuests.refreshBody();
                    }, 10);
                },
                columns: [
                    {
                        field: 'name',
                        caption: 'Name',
                        size: '25%',
                        resizable: true,
                        editable: {type: 'text'}
                    },
                    {
                        field: 'email', caption: 'Email',
                        size: '25%',
                        resizable: true,
                        editable: {type: 'text'}
                    },
                    {
                        field: 'notes', caption: 'Notes',
                        size: '50%',
                        resizable: true,
                        editable: {type: 'text'}
                    },
                ]
            });
            $().w2grid({
                name: 'PodcastEditChannels',
                header: 'Channels',
                toolbar: {
                    items: [
                        {id: 'authorize', type: 'button', text: 'Authorize'}
                    ],
                    onClick(event) {
                        if (event.target === 'authorize') {
                            let selected = w2ui['PodcastEditChannels'].getSelection();
                            let records = w2ui.PodcastEditChannels.records;
                            let sObj = null;
                            for (let i in records) {
                                let record = records[i];
                                if (record.recid === selected[0]) {
                                    sObj = record;
                                }
                            }
                            let url = `channel/authorize?id=${sObj.name}`;
                            $.ajax({
                                url: url,
                                success: function (results) {
                                    console.log("Results", results);
                                    if (results.url) {
                                        window.open(results.url);
                                    }
                                }
                            });
                        }
                    }

                },
                show: {
                    header: true,
                    columnHeaders: true,
                    toolbar: true,
                    toolbarSave: true,
                    toolbarAdd: true,
                    toolbarEdit: true,
                    toolbarDelete: true
                },
                onAdd: (event) => {
                    let anum = w2ui['PodcastEditChannels'].records.length;
                    w2ui['PodcastEditChannels'].add({
                        "recid": anum,
                        "id": "Enter Name",
                        "title": "Enter Name",
                        "type": "linkedIn",
                    });
                },
                onEdit: (event) => {
                    console.log("Edit");
                },
                onSave: (event) => {
                    let changes = w2ui['PodcastEditChannels'].getChanges();
                    let records = w2ui['PodcastEditChannels'].records
                },
                onRender: (event) => {
                    setTimeout(function () {
                        w2ui.PodcastEditChannels.refreshBody();
                    }, 10);
                },
                onSelect: (event) => {
                    let selected = null;
                    for (let i in w2ui.PodcastEditChannels.records) {
                        let record = w2ui.PodcastEditChannels.records[i];
                        if (record.recid === parseInt(event.recid)) {
                            selected = record;
                        }
                    }
                    // Now set the toolbar with the right states.
                    if (!selected.authorized) {
                        w2ui.PodcastEditChannels.toolbar.enable('authorize');
                    }
                },
                columns: [
                    {
                        field: 'authorized', label: 'Auth',
                        size: '5%',
                        resizable: true,
                    },
                    {
                        field: 'name',
                        label: 'Id',
                        size: '25%',
                        resizable: true,
                        editable: {type: 'text'}
                    },
                    {
                        field: 'user', label: 'User',
                        size: '70%',
                        resizable: true,
                        editable: {type: 'text'},
                    },
                ]
            });
        }
        return w2ui['PodcastEdit'];
    }

    static getEditForm(obj) {
        w2ui['PodcastEdit'].record = obj;
        let url = `podcast?id=${obj._id}`;
        w2ui['PodcastEdit'].clear();
        $.ajax({
            url: url,
            success: function (results) {
                w2ui['PodcastEdit'].record = results.record;
            }
        });
        return w2ui['PodcastEdit'];
    }

    static openPublishDialog(podcast, episode) {
        let url = `podcast/channelsByType`;
        let data = {podcast: podcast._id, artType: 'all'};
        $.post({
            url: url,
            data: data,
            success: function (results) {
                let url = `episode?id=${episode.id}`;
                let channels = results.results;
                $.get({
                    url: url,
                    success: function (results) {
                        let episode = results.record;
                        let inputForm = PodcastView.getPublishForm(channels, episode);
                        w2popup.open({
                            height: 850,
                            width: 850,
                            title: `Publish Artifacts for Episode: ${episode._id}`,
                            body: '<div id="editObjectDialog" style="width: 100%; height: 100%;"></div>',
                            showMax: true,
                            onToggle: function (event) {
                                $(w2ui.editObjectDialog.box).hide();
                                event.onComplete = function () {
                                    $(w2ui.editObjectDialog.box).show();
                                    w2ui.editObjectDialog.resize();
                                }
                            },
                            onOpen: function (event) {
                                event.onComplete = function () {
                                    // specifying an onOpen handler instead is equivalent to specifying an onBeforeOpen handler,
                                    // which would make this code execute too early and hence not deliver.
                                    $('#editObjectDialog').w2render(inputForm);
                                }
                            }
                        });

                    }
                });
            }
        });
    }

    static createPublish(channels) {
        // window.open(URL)
        // show the title
        // show the summary
        // show the tags
        // Show the other assets urls.
        //
        let fields = [];
        fields.push({
            field: 'number',
            type: 'textarea',
            required: true,
            html: {label: "Number", attr: `size="75" style="width:500px"`}
        });
        fields.push({
            field: 'title',
            type: 'textarea',
            required: true,
            html: {label: "Title", attr: `size="75" style="width:500px"`}
        });
        fields.push({
            field: 'summary',
            type: 'textarea',
            required: true,
            html: {label: "Summary", attr: `size="75" style="width:500px;"`}
        });
        fields.push({
            field: 'tags',
            type: 'textarea',
            required: true,
            html: {label: "Tags", attr: `size="1000" style="width:500px; height:100px"`}
        });
        fields.push({
            field: 'urls',
            type: 'textarea',
            required: true,
            html: {label: "URLs", attr: `size="1000" style="width:500px; height:100px"`}
        });

        let actions = {
            Save: function () {
                let selected = w2ui['PodcastEditEpisodes'].getSelection();
                let records = w2ui.PodcastEditEpisodes.records;
                let sObj = null;
                for (let i in records) {
                    let record = records[i];
                    if (record.recid === selected[0]) {
                        sObj = record;
                    }
                }
                let podcast = w2ui.PodcastEdit.record
                let url = `episode/publish?id=${sObj.id}`;
                $.get({
                    url: url,
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
            },
            Cancel: function () {
                w2popup.close();
            }
        }
        let buttons = {};

        /*
        let textButtons = `<div class="w2ui-buttons">`;
        for (let i in channels.values) {
            let channel = channels.values[i];
            for (let j in channel.types) {
                let mType = channel.types[j];
                if (!buttons.hasOwnProperty(mType)) {
                    // buttons[mType] = `<div class="w2ui-buttons">`;
                    buttons[mType] = "";
                }
                let surl = channel.submission || channel.url;
                buttons[mType] += `<button class="w2ui-btn" style='background: lightblue;' onclick='window.open("${surl}");'>${channel.name}</button>\n`;
            }
        }
        /* for(let name in buttons) {
            buttons[name] += `</div>`;
        }

         */
        /*
                for (let artType in buttons) {
                    fields.push({
                        field: `Publish${artType}`, type: 'text',
                        caption: `Publish ${artType}`,
                        html: {
                            text: buttons[artType]
                        }
                    });
                }
            */
        if (w2ui.hasOwnProperty('PodcastPublishForm')) {
            $().w2destroy('PodcastPublishForm');
        }

        $().w2form({
            name: 'PodcastPublishForm',
            modelType: 'Podcast',
            style: 'border: 0px; background-color: transparent;',
            fields: fields,
            actions: actions
        });
        return w2ui['PodcastPublishForm'];
    }

    static getPublishForm(channels, episode) {
        let publishForm = PodcastView.createPublish(channels);
        let urls = "";
        let assets = episode.assets.values;
        for (let i in assets) {
            let asset = assets[i];
            urls += `${asset.name}: ${asset.url}\n`;
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

    static openDialog(obj) {
        let editForm = PodcastView.getEditForm(obj);
        w2popup.open({
            height: 850,
            width: 850,
            title: `Edit ${obj._type}`,
            body: '<div id="editObjectDialog" style="width: 100%; height: 100%;"></div>',
            showMax: true,
            onToggle: function (event) {
                $(w2ui.editObjectDialog.box).hide();
                event.onComplete = function () {
                    $(w2ui.editObjectDialog.box).show();
                    w2ui.editObjectDialog.resize();
                }
            },
            onOpen: function (event) {
                event.onComplete = function () {
                    // specifying an onOpen handler instead is equivalent to specifying an onBeforeOpen handler,
                    // which would make this code execute too early and hence not deliver.
                    $('#editObjectDialog').w2render(editForm);
                }
            }
        });
    }
}

function lookUpList(title, name, type) {
    return {
        field: name,
        type: 'enum',
        options: {
            url: `${type}/list?mode=json`,
            renderItem: (item) => {
                if (item.name.name) {
                    return item.name.name;
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
                $.extend(event.item, {name: {name: event.item.text}});
                // Add the item on the server side.
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
                $.extend(event.item, {name: {name: event.item.text}});
                // Add the item on the server side.
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
