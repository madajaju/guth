import EpisodeView from './EpisodeView.js';
import PersonView from './PersonView.js';

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
                html: {label: "Name", attr: `size="20" style="width:375px"`}
            });
            fields.push({
                field: 'summary',
                type: 'textarea',
                required: true,
                html: {label: "Summary", attr: `size="1000" style="width:375px; height:100px"`}
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
                                arecords.push({
                                    "recid": counter++,
                                    "state": episode._state,
                                    "id": episode._id,
                                    "name": episode._name,
                                    "number": Number(episode.number,0),
                                    "summary": episode.summary,
                                });
                                nextEpisodeNumber = Math.max(episode.number, nextEpisodeNumber);
                            }
                            w2ui.PodcastEditEpisodes.episodeNumber = nextEpisodeNumber;
                            w2ui.PodcastEditEpisodes.add(arecords);
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
                            w2ui.PodcastEditGuests.add(aguests);
                            w2ui.PodcastEditGuests.refresh();

                            // Channels Panel
                            let achannels = [];
                            counter = 0;
                            for (let i in w2ui.PodcastEdit.record.channels.values) {
                                let channel = w2ui.PodcastEdit.record.channels.values[i];
                                achannels.push({
                                    "recid": counter++,
                                    "name": channel.name,
                                    "user": channel.user,
                                });
                            }
                            w2ui.PodcastEditChannels.add(achannels);
                            w2ui.PodcastEditChannels.refresh();

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
                                console.log(results);
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
                onAdd: (event) => {
                    let anum = w2ui['PodcastEditEpisodes'].records.length;
                    // Add the new episode with the next episode number.
                    let nextEpisodeNumber = w2ui['PodcastEditEpisodes'].episodeNumber + 1;
                    w2ui['PodcastEditEpisodes'].add({
                        "recid": anum,
                        "name": "Enter Name",
                        "number": nextEpisodeNumber,
                        "summary": "Summary",
                        "scheduledDate": "mm/dd/yyy",
                    });
                },
                onSave: (event) => {
                    let changes = w2ui['PodcastEditEpisodes'].getChanges();
                    let records = w2ui['PodcastEditEpisodes'].records
                    for (let i in changes) {
                        let change = changes[i];
                        let rec = records[change.recid];
                        // Just updating the episode
                        if (rec.id) {
                            let url = `episode/save?id=${rec.id}`;
                            if (change.name) {
                                url += `&name=${change.name}`
                            }
                            if (change.number) {
                                url += `&number=${change.number}`
                            }
                            if (change.summary) {
                                url += `&summary=${change.summary}`
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
                    if(record.recid != event.recid) {
                        for(let i in w2ui.PodcastEditEpisodes.records) {
                            if(w2ui.PodcastEditEpisodes.records[i].recid === event.recid) {
                                record = w2ui.PodcastEditEpisodes.records[i];
                                break;
                            }
                        }
                    }
                    record._id = record.id;
                    EpisodeView.openDialog(record);
                },
                onDelete: (event) => {
                    let selected = w2ui['PodcastEditEpisodes'].getSelection();
                    console.log("Delete", selected);
                },
                onRender: (event) => {
                    setTimeout(function () {
                        w2ui.PodcastEditEpisodes.refreshBody();
                    }, 10);
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
                        field: 'scheduledDate', caption: 'Date',
                        size: '10%',
                        resizable: true,
                        sortable: true,
                        editable: {type: 'date'}
                    },
                    {
                        field: 'name',
                        caption: 'Name',
                        size: '25%',
                        resizable: true,
                        sortable: true,
                        editable: {type: 'text'}
                    },
                    {
                        field: 'summary', caption: 'Summary',
                        size: '50%',
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
                    if(record.recid != event.recid) {
                        for(let i in w2ui.PodcastEditGuests.records) {
                            if(w2ui.PodcastEditGuests.records[i].recid === event.recid) {
                                record = w2ui.PodcastEditGuests.records[i];
                                break;
                            }
                        }
                    }
                    record._id = record.id;
                    PersonView.openDialog(record);
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
                    for (let i in changes) {
                        let change = changes[i];
                        let rec = records[change.recid];
                        // Just updating the artifact
                        if (rec.id) {
                            let url = "Artifact/save?id=rec.id";
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
                            let eid = w2ui['PodcastEditGeneral'].record.name;
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
                    let selected = w2ui['PodcastEditChannels'].getSelection();
                    console.log("Delete", selected);

                },
                onRender: (event) => {
                    setTimeout(function () {
                        w2ui.PodcastEditChannels.refreshBody();
                    }, 10);
                },
                columns: [
                    {
                        field: 'name',
                        label: 'Id',
                        size: '25%',
                        resizable: true,
                        editable: {type: 'text'}
                    },
                    {
                        field: 'user', label: 'User',
                        size: '75%',
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
        html: {label: title, attr: 'style="width:375px"'}
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
        html: {label: title, attr: 'style="width:375px"'}
    }
}
