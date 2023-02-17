let artifactTypes = [
    {id: 1, text: 'Video'},
    {id: 2, text: 'Audio'},
    {id: 3, text: 'Blog'},
];
let channelList = [
    {id: 1, text: 'Video'},
    {id: 2, text: 'Audio'},
    {id: 3, text: 'Blog'},
];
let artifactList = [
    {id: 1, text: 'Video'},
    {id: 2, text: 'Audio'},
    {id: 3, text: 'Blog'},
];

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
        if (!w2ui['EpispodeList']) {
        }
    }

    static createDetail() {
        if (!w2ui['EpispodeList']) {
        }
    }

    static createEdit() {
        if (!w2ui['EpisodeEdit']) {
            let fields = [];
            fields.push(lookUpItem('Podcast', 'owner', "podcast"));
            fields.push({
                field: 'name',
                type: 'textarea',
                required: true,
                html: {label: "Name", attr: `size="20" style="width:375px"`}
            });
            fields.push({
                field: 'number',
                type: 'textarea',
                required: true,
                html: {label: "Number", attr: `size="10" style="width:375px"`}
            });
            fields.push({
                field: 'title',
                type: 'textarea',
                required: true,
                html: {label: "Title", attr: `size="75" style="width:375px"`}
            });
            fields.push({
                field: 'tagline',
                type: 'textarea',
                required: false,
                html: {label: "Tag Line", attr: `size="150" style="width:375px; height:30px"`}
            });
            fields.push({
                field: 'summary',
                type: 'textarea',
                required: true,
                html: {label: "Summary", attr: `size="1000" style="width:375px; height:100px"`}
            });
            fields.push({
                field: 'meta',
                type: 'textarea',
                required: true,
                html: {label: "Meta Summary", attr: `size="300" style="width:375px; height:100px"`}
            });
            fields.push({
                field: 'notes',
                type: 'textarea',
                required: true,
                html: {label: "Show Notes", attr: `size="10000" style="width:375px; height:300px"`}
            });
            fields.push(lookUpList('Tags', 'tags', "tag"));
            // fields.push(lookUpList('Solutions', 'solutions', "solution"));
            //fields.push(lookUpList('Products', 'products', "product"));
            fields.push(lookUpList('Guests', 'guests', "person"));
            $().w2layout({
                name: 'EpisodeEdit',
                panels: [
                    {type: 'left', size: 100, resizable: true, minSize: 35},
                    {
                        type: 'main', size: 550, overflow: 'hidden',
                        toolbar: {
                            items: [
                                {id: 'schedule', type: 'button', caption: 'Schedule'},
                                {id: 'cancel', type: 'button', caption: 'Cancel'},
                                {id: 'edit', type: 'button', caption: 'Edit'},
                                {id: 'write', type: 'button', caption: 'Write'},
                                {id: 'publish', type: 'button', caption: 'Publish'},
                                {id: 'promote', type: 'button', caption: 'Promote'},
                            ],
                            onClick(event) {
                                if (w2ui.EpisodeEdit.record && w2ui[`EpisodeActions${event.target}`]) {
                                    w2ui[`EpisodeActions${event.target}`].record = w2ui.EpisodeEdit.record;
                                    w2ui['EpisodeEdit'].html('main', w2ui[`EpisodeActions${event.target}`]);
                                }
                            }
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
                            w2ui.EpisodeEditGeneral.record.name = w2ui.EpisodeEdit.record.name.name;
                            w2ui.EpisodeEditGeneral.record.number = w2ui.EpisodeEdit.record.number.name;
                            w2ui.EpisodeEditGeneral.record.title = w2ui.EpisodeEdit.record.title.name;
                            w2ui.EpisodeEditGeneral.record.summary = w2ui.EpisodeEdit.record.summary.name;
                            w2ui.EpisodeEditGeneral.record.tagline = w2ui.EpisodeEdit.record.tagline.name;
                            w2ui.EpisodeEditGeneral.record.meta = w2ui.EpisodeEdit.record.meta.name;
                            w2ui.EpisodeEditGeneral.record.notes = w2ui.EpisodeEdit.record.notes.name;
                            w2ui.EpisodeEditGeneral.record.tags = w2ui.EpisodeEdit.record.tags.values;
                            // w2ui.EpisodeEditGeneral.record.solutions = w2ui.EpisodeEdit.record.solutions.values;
                            // w2ui.EpisodeEditGeneral.record.products = w2ui.EpisodeEdit.record.products.values;
                            w2ui.EpisodeEditGeneral.record.guests = w2ui.EpisodeEdit.record.guests.values;
                            w2ui.EpisodeEditGeneral.refresh();

                            // Artifact Panel
                            let arecords = [];
                            let counter = 0;
                            for (let i in w2ui.EpisodeEdit.record.artifacts.values) {
                                let artifact = w2ui.EpisodeEdit.record.artifacts.values[i];
                                arecords.push({
                                    "recid": counter++,
                                    "id": artifact._id,
                                    "name": artifact._name,
                                    "artType": artifact.artType,
                                    "summary": artifact.summary,
                                    "link": artifact._link
                                });
                            }
                            w2ui.EpisodeEditArtifacts.add(arecords);
                            w2ui.EpisodeEditArtifacts.refresh();
                            for(let i in arecords) {
                                $.ajax( {
                                    url: arecords[i].link,
                                    success: function (results) {
                                        w2ui.EpisodeEditArtifacts.set(i, {summary: results.record.summary.name, assets: results.record.assets.count});
                                    },
                                });
                            }


                            // Asset Panel
                            let asrecs = [];
                            counter = 0;
                            for (let i in w2ui.EpisodeEdit.record.assets.values) {
                                let asset = w2ui.EpisodeEdit.record.assets.values[i];
                                asrecs.push({
                                    "recid": counter++,
                                    "id": asset._id,
                                    "name": asset._name,
                                    "url": asset.url,
                                    "summary": asset.summary,
                                    "link": asset._link,
                                });
                            }
                            w2ui.EpisodeEditAssets.add(asrecs);
                            w2ui.EpisodeEditAssets.refresh();
                            for(let i in asrecs) {
                                $.ajax({
                                    url: asrecs[i].link,
                                    success: function (results) {
                                        let aName = "";
                                        if(results.record.artifact) { aName = results.record.artifact.name; }
                                        let cName = "";
                                        if(results.record.channel) { cName = results.record.channel.name; }

                                        w2ui.EpisodeEditAssets.set(i, { artifact: aName, channel: cName });
                                    },
                                });
                            }

                            // Post Panel
                            let precs = [];
                            counter = 0;
                            for (let i in w2ui.EpisodeEdit.record.posts.values) {
                                let post = w2ui.EpisodeEdit.record.posts.values[i];
                                precs.push({
                                    "recid": counter++,
                                    "id": post._id,
                                    "name": post._name,
                                    "asset": post._asset,
                                    "text": post._text,
                                    "createdDate": post.createdDate,
                                });
                            }
                            w2ui.EpisodeEditPosts.add(precs);
                            w2ui.EpisodeEditPosts.refresh();
                        }
                    }
                    // w2ui.EpisodeEditGeneral.refresh();
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
                actions: {
                    Save: function () {
                        this.validate();
                        // Create the model.
                        let url = `episode/save?id=${this.record.name}`;
                        let data = {};
                        for (let name in this.record) {
                            if (name === 'owner') {
                                data.owner = this.record.owner[0];
                            } else {
                                data[name] = this.record[name];
                            }
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
            createActionForms();
            $().w2grid({
                name: 'EpisodeEditArtifacts',
                header: 'Artifacts',
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
                    let anum = w2ui['EpisodeEditArtifacts'].records.length;
                    w2ui['EpisodeEditArtifacts'].add({
                        "recid": anum,
                        "name": "Enter Name",
                        "type": "video",
                        "url": "URL here"
                    });
                },
                onEdit: (event) => {
                    console.log("Edit");
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
                columns: [
                    {
                        field: 'name',
                        caption: 'Name',
                        size: '25%',
                        resizable: true,
                        editable: {type: 'text'}
                    },
                    {
                        field: 'artType', caption: 'Type',
                        size: '10%',
                        resizable: true,
                        editable: {type: 'list', items: artifactTypes, showAll: true},
                    },
                    {
                        field: 'assets', caption: 'Assets',
                        size: '25%',
                        resizable: true,
                        editable: {type: 'text'}
                    },
                    {
                        field: 'summary', caption: 'Summary',
                        size: '35%',
                        resizable: true,
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
                    toolbar: false,
                    toolbarSave: true,
                    toolbarAdd: true,
                    toolbarEdit: true,
                    toolbarDelete: true
                },
                onAdd: (event) => {
                    let anum = w2ui['EpisodeEditPosts'].records.length;
                    w2ui['EpisodeEditPosts'].add({
                        "recid": anum,
                        "name": "Enter Name",
                        "type": "video",
                        "url": "URL here"
                    });
                },
                onEdit: (event) => {
                    console.log("Edit");

                },
                onSave: (event) => {
                    let changes = w2ui['EpisodeEditPosts'].getChanges();
                    let records = w2ui['EpisodeEditPosts'].records
                    for (let i in changes) {
                        let change = changes[i];
                        let rec = records[change.recid];
                        // Just updating the artifact
                        if (rec.id) {
                            let url = "Post/update?id=rec.id";
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
                            let url = `Post/create?episode=${eid}`;
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
                    let selected = w2ui['EpisodeEditPosts'].getSelection();
                    console.log("Delete", selected);

                },
                onRender: (event) => {
                    setTimeout(function () {
                        w2ui.EpisodeEditPosts.refreshBody();
                    }, 10);
                },
                columns: [
                    {
                        field: 'name',
                        label: 'Name',
                        size: '10%',
                        resizable: true,
                        editable: {type: 'text'}
                    },
                    {
                        field: 'asset', label: 'Asset',
                        size: '15%',
                        resizable: true,
                    },
                    {
                        field: 'text', label: 'Type',
                        size: '50%',
                        resizable: true,
                        editable: {type: 'list', items: artifactTypes, showAll: true},
                    },
                    {
                        field: 'createdDate', label: 'CreatedDate',
                        size: '25%',
                        resizable: true,
                    },

                ]
            });
            $().w2grid({
                name: 'EpisodeEditAssets',
                header: 'Assets',
                show: {
                    header: true,
                    columnHeaders: true,
                },
                onRender: (event) => {
                    setTimeout(function () {
                        w2ui.EpisodeEditAssets.refreshBody();
                    }, 10);
                },
                columns: [
                    {
                        field: 'name',
                        caption: 'Name',
                        size: '10%',
                        resizable: true,
                        editable: {type: 'text'}
                    },
                    {
                        field: 'channel', caption: 'Channel',
                        size: '10%',
                        resizable: true,
                        editable: {type: 'text' }
                    },
                    {
                        field: 'artifact',caption: 'Artifact',
                        size: '25%',
                        resizable: true,
                        editable: {type: 'text' }
                    },
                    {
                        field: 'url',caption: 'URL',
                        size: '25%',
                        resizable: true,
                        editable: {type: 'text'}
                    },
                    {
                        field: 'summary',caption: 'Summary',
                        size: '30%',
                        resizable: true,
                        editable: {type: 'text'}
                    }
                ]
            });
        }
        return w2ui['EpisodeEdit'];
    }

    show(obj) {

    }

    static getEditForm(obj) {
        w2ui['EpisodeEdit'].clear();
        w2ui['EpisodeEdit'].record = obj;
        let url = `episode?id=${obj._id}`;
        $.ajax({
            url: url,
            success: function (results) {
                w2ui['EpisodeEdit'].record = results.record;
            }
        });
        return w2ui['EpisodeEdit'];
    }

    static openDialog(obj) {
        let editForm = EpisodeView.getEditForm(obj);
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
        html: {label: title, attr: 'style="width:375px"'}
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
                }
            }
        }
    });
}
