
export default class PersonView {
    constructor(config) {
        this.config = config;
        PersonView.createEdit();
        PersonView.createList();
        PersonView.createDetail();
    }

    static createList() {
        if (!w2ui['PersonList']) {
        }
    }

    static createDetail() {
        if (!w2ui['PersonDetail']) {
        }
    }

    static createEdit() {
        if (!w2ui['PersonEdit']) {
            let fields = [];
            fields.push({
                field: 'name',
                type: 'textarea',
                required: true,
                html: {label: "Name", attr: `size="20" style="width:375px"`}
            });
            fields.push({
                field: 'email',
                type: 'textarea',
                required: true,
                html: {label: "Email", attr: `size="80" style="width:375px;"`}
            });
            fields.push({
                field: 'notes',
                type: 'textarea',
                required: true,
                html: {label: "Notes", attr: `size="1000" style="width:375px; height:100px"`}
            });
            $().w2layout({
                name: 'PersonEdit',
                panels: [
                    {type: 'left', size: 100, resizable: true, minSize: 35},
                    {type: 'main', size: 550, overflow: 'hidden'}
                ],
                onRender: (event) => {
                    // Add the record to the form and the assoication tabs
                    if (event.target === 'PersonEdit') {
                        if (w2ui.PersonEdit.record) {
                            // General Panel
                            w2ui.PersonEditGeneral.record = {};
                            // Enums Must be in an array
                            w2ui.PersonEditGeneral.record.name = w2ui.PersonEdit.record.name.name;
                            w2ui.PersonEditGeneral.record.email = w2ui.PersonEdit.record.email.name;
                            w2ui.PersonEditGeneral.record.notes = w2ui.PersonEdit.record.notes.name;
                            w2ui.PersonEditGeneral.refresh();

                            // Episodes Panel
                            let arecords = [];
                            let counter = 0;
                            for (let i in w2ui.PersonEdit.record.episodes.values) {
                                let episode = w2ui.PersonEdit.record.episodes.values[i];
                                arecords.push({
                                    "recid": counter++,
                                    "state": episode._state,
                                    "id": episode._id,
                                    "name": episode._name,
                                    "number": episode.number,
                                    "summary": episode.summary,
                                });
                            }
                            w2ui.PersonEditEpisodes.add(arecords);
                            w2ui.PersonEditEpisodes.refresh();


                            // socials Panel
                            let asocials = [];
                            counter = 0;
                            for (let i in w2ui.PersonEdit.record.socials.values) {
                                let social = w2ui.PersonEdit.record.socials.values[i];
                                asocials.push({
                                    "recid": counter++,
                                    "id": social._id,
                                    "name": social._name,
                                    "type": social.stype,
                                    "channel": social.channel,
                                });
                            }
                            w2ui.PersonEditSocials.add(asocials);
                            w2ui.PersonEditSocials.refresh();

                        }
                    }
                    w2ui.PersonEdit.html('left', w2ui.PersonEditTabs);
                    w2ui.PersonEdit.html('main', w2ui.PersonEditGeneral);
                }
            });
            $().w2sidebar({
                name: 'PersonEditTabs',
                flatButton: true,
                nodes: [
                    {id: 'general', text: 'General', selected: true},
                    {id: 'socials', text: 'Socials'},
                    {id: 'episodes', text: 'Episodes'},
                ],
                onClick(event) {
                    switch (event.target) {
                        case 'general':
                            w2ui['PersonEdit'].html('main', w2ui.PersonEditGeneral);
                            break;
                        case 'episodes':
                            w2ui['PersonEdit'].html('main', w2ui.PersonEditEpisodes);
                            break;
                        case 'socials':
                            w2ui['PersonEdit'].html('main', w2ui.PersonEditSocials);
                            break;
                    }
                }
            });
            w2ui['PersonEdit'].clear = () => {
                w2ui['PersonEdit'].record = undefined;
                w2ui['PersonEditGeneral'].clear();
                w2ui['PersonEditEpisodes'].clear();
                w2ui['PersonEditSocials'].clear();
            };
            $().w2form({
                name: 'PersonEditGeneral',
                modelType: 'Person',
                style: 'border: 0px; background-color: transparent;',
                fields: fields,
                actions: {
                    Save: function () {
                        this.validate();
                        // Create the model.
                        let url = `person/save?name=${this.record.name}`;
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
                name: 'PersonEditEpisodes',
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
                    let anum = w2ui['PersonEditEpisodes'].records.length;
                    w2ui['PersonEditEpisodes'].add({
                        "recid": anum,
                        "name": "Enter Name",
                        "number": "0",
                        "summary": "Summary",
                    });
                },
                onSave: (event) => {
                    let changes = w2ui['PersonEditEpisodes'].getChanges();
                    let records = w2ui['PersonEditEpisodes'].records
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
                    let record = w2ui['PersonEditEpisodes'].records[event.recid];
                    record._id = record.id;
                    EpisodeView.openDialog(record);
                },
                onDelete: (event) => {
                    let selected = w2ui['PersonEditEpisodes'].getSelection();
                    console.log("Delete", selected);
                },
                onRender: (event) => {
                    setTimeout(function () {
                        w2ui.PersonEditEpisodes.refreshBody();
                    }, 10);
                },
                columns: [
                    {
                        field: 'state',
                        caption: 'State',
                        size: '10%',
                        resizable: true,
                        editable: {type: 'text'}
                    },
                    {
                        field: 'number', caption: 'Number',
                        size: '10%',
                        resizable: true,
                        editable: {type: 'text'}
                    },
                    {
                        field: 'name',
                        caption: 'Name',
                        size: '25%',
                        resizable: true,
                        editable: {type: 'text'}
                    },
                    {
                        field: 'summary', caption: 'Summary',
                        size: '55%',
                        resizable: true,
                        editable: {type: 'text'}
                    },
                ]
            });
            $().w2grid({
                name: 'PersonEditSocials',
                header: 'Socials',
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
                    let anum = w2ui['PersonEditSocials'].records.length;
                    w2ui['PersonEditSocials'].add({
                        "recid": anum,
                        "name": "Enter Name",
                        "email": "nobody@email.com",
                        "notes": "Notes",
                    });
                },
                onEdit: (event) => {
                    console.log("Edit");
                },
                onDelete: (event) => {
                    let selected = w2ui['PersonEditEpisodes'].getSelection();
                    console.log("Delete", selected);
                },
                onRender: (event) => {
                    setTimeout(function () {
                        w2ui.PersonEditSocials.refreshBody();
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
                        field: 'type', caption: 'Type',
                        size: '25%',
                        resizable: true,
                        editable: {type: 'text'}
                    },
                    {
                        field: 'channel', caption: 'Channel',
                        size: '50%',
                        resizable: true,
                        editable: {type: 'text'}
                    },
                ]
            });
        }
        return w2ui['PersonEdit'];
    }

    static getEditForm(obj) {
        w2ui['PersonEdit'].clear();
        w2ui['PersonEdit'].record = obj;
        let url = `person?id=${obj._id}`;
        $.ajax({
            url: url,
            success: function (results) {
                w2ui['PersonEdit'].record = results.record;
            }
        });
        return w2ui['PersonEdit'];
    }
    static openDialog(obj) {
        let editForm = PersonView.getEditForm(obj);
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
