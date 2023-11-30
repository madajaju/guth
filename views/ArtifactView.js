import AssetView from "./AssetView.js";

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

export default class ArtifactView {
    function
    function

    function

    constructor(config) {
        this.config = config;
        ArtifactView.createEdit();
        ArtifactView.createList();
        ArtifactView.createDetail();
    }

    static createList() {
        if (!w2ui['ArtifactList']) {
        }
    }

    static createDetail() {
        if (!w2ui['ArtifactList']) {
        }
    }

    static createPublish(channels, episode, artifact) {
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
            html: {label: "Summary", attr: `size="300" style="width:500px;height:100px"`}
        });
        fields.push({
            field: 'tags',
            type: 'textarea',
            required: true,
            html: {label: "Tags", attr: `size="300" style="width:500px; height:100px"`}
        });
        fields.push({
            field: 'urls',
            type: 'textarea',
            required: true,
            html: {label: "URLs", attr: `size="1000" style="width:500px; height:100px"`}
        });

        let actions = {
            Cancel: function () {
                $('#popupContent').w2render(w2ui[w2ui.ArtifactPublishForm.previousWindow]);
            }
        }

        // Get the language of the artifact to select the right channels.
        let lang = artifact.name.split('/')[0];
        for (let i in channels.values) {
            let channel = channels.values[i];
            if(!channel.lang || lang === channel.lang)  {
                actions[channel.name] = {
                    caption: channel.name,
                    style: 'background: lightblue;',
                    onClick(event) {
                        let url = channel.submission || channel.url;
                        window.open(url);
                        let durl = `asset/getFields?episode=${episode._id}&artifact=${artifact.id}&channel=${channel.id}&lang=${lang}`;
                        $.ajax({
                            url: durl,
                            dataType: 'json',
                            success: function (results) {
                                console.log(results);
                                // Open the asset create form with the channel, artifact populated.
                                AssetView.openDialog({
                                    channel: channel,
                                    artifact: artifact,
                                    episode: episode,
                                    name: `${lang}/${artifact.artType}`,
                                    artType: artifact.artType,
                                    fields: results.results,
                                    url: ""
                                }, 'EpisodeEdit');
                            },
                            failure: function (results) {
                                console.error(results);
                                w2popup.close(sh);
                            }
                        });
                    }
                }
            }
        }
        if (w2ui.hasOwnProperty('ArtifactPublishForm')) {
            $().w2destroy('ArtifactPublishForm');
        }

        $().w2form({
            name: 'ArtifactPublishForm',
            modelType: 'Artifact',
            style: 'border: 0px; background-color: transparent;',
            fields: fields,
            actions: actions
        });
        return w2ui['ArtifactPublishForm'];
    }

    static createEdit() {
        if (!w2ui['ArtifactEdit']) {
            let fields = [];
            fields.push({
                field: 'name',
                type: 'textarea',
                required: true,
                html: {label: "Name", attr: `size="75" style="width:500px"`}
            });
            fields.push({
                field: 'artType',
                type: 'textarea',
                required: true,
                html: {label: "Type", attr: `size="75" style="width:500px;"`}
            });
            fields.push({
                field: 'summary',
                type: 'textarea',
                required: true,
                html: {label: "Summary", attr: `size="1000" style="width:500px; height:100px"`}
            });

            $().w2layout({
                name: 'ArtifactEdit',
                panels: [
                    {
                        type: 'preview', size: 550, overflow: 'hidden',
                    },
                    {
                        type: 'main', size: 550, overflow: 'hidden',
                        toolbar: {
                            items: [
                                {id: 'publish', type: 'button', caption: 'Publish'},
                            ],
                            onClick(event) {
                                if (w2ui.ArtifactEdit.record && w2ui[`ArtifactActions${event.target}`]) {
                                    w2ui[`ArtifactActions${event.target}`].record = w2ui.ArtifactEdit.record;
                                    w2ui['ArtifactEdit'].html('main', w2ui[`ArtifactActions${event.target}`]);
                                }
                            }
                        }
                    }
                ],
                onRender: (event) => {
                    // Add the record to the form and the association tabs
                    if (event.target === 'ArtifactEdit') {
                        if (w2ui.ArtifactEdit.record) {
                            // General Panel
                            w2ui.ArtifactEditGeneral.record = {};
                            // Enums Must be in an array
                            w2ui.ArtifactEditGeneral.record.id = w2ui.ArtifactEdit.record._id;
                            w2ui.ArtifactEditGeneral.record.name = w2ui.ArtifactEdit.record._name;
                            w2ui.ArtifactEditGeneral.record.summary = w2ui.ArtifactEdit.record.summary.name;
                            w2ui.ArtifactEditGeneral.record.artType = w2ui.ArtifactEdit.record.artType.name;
                            w2ui.ArtifactEditGeneral.record.assets = w2ui.ArtifactEdit.record.assets.values;
                            w2ui.ArtifactEditGeneral.refresh();


                            // Asset Panel
                            let asrecs = [];
                            let counter = 0;
                            for (let i in w2ui.ArtifactEdit.record.assets.values) {
                                let asset = w2ui.ArtifactEdit.record.assets.values[i];
                                asrecs.push({
                                    "recid": counter++,
                                    "id": asset._id,
                                    "channel": asset.channel,
                                    "name": asset._name,
                                    "url": asset.url,
                                    "summary": asset.summary,
                                    "link": asset._link,
                                });
                            }
                            w2ui.ArtifactEditAssets.add(asrecs);
                            w2ui.ArtifactEditAssets.refresh();
                            for (let i in asrecs) {
                                $.ajax({
                                    url: asrecs[i].link,
                                    success: function (results) {
                                        let aName = "";
                                        if (results.record.artifact) {
                                            aName = results.record.artifact.name;
                                        }
                                        let cName = "";
                                        if (results.record.channel) {
                                            cName = results.record.channel.name;
                                        }

                                        w2ui.ArtifactEditAssets.set(i, {artifact: aName, channel: cName});
                                    },
                                });
                            }
                        }
                    }
                    let linkURL = `artifactType/channels?artType=${w2ui.ArtifactEdit.record.artType}`;
                    $.ajax({
                        url: linkURL,
                        success: function (results) {
                            w2ui.ArtifactEditGeneral.toolbar = {
                                items: [
                                    {id: 'publish', type: 'button', caption: 'Publish'},
                                ],
                                onClick(event) {
                                    if (w2ui.ArtifactEdit.record && w2ui[`ArtifactActions${event.target}`]) {
                                        w2ui[`ArtifactActions${event.target}`].record = w2ui.ArtifactEdit.record;
                                        w2ui['ArtifactEdit'].html('main', w2ui[`ArtifactActions${event.target}`]);
                                    }
                                }
                            }
                        }
                    });
                    // w2ui.ArtifactEditGeneral.refresh();
                    w2ui.ArtifactEdit.html('main', w2ui.ArtifactEditGeneral);
                    w2ui.ArtifactEdit.html('preview', w2ui.ArtifactEditAssets);
                }
            });
            $().w2sidebar({
                name: 'ArtifactEditTabs',
                flatButton: true,
                nodes: [
                    {id: 'general', text: 'General', selected: true},
                    {id: 'assets', text: 'Assets'},
                ],
                onClick(event) {
                    switch (event.target) {
                        case 'general':
                            w2ui['ArtifactEdit'].html('main', w2ui.ArtifactEditGeneral);
                            // w2ui.ArtifactEditGeneral.refresh();
                            // w2ui['ArtifactEdit'].refresh();
                            break;
                        case 'assets':
                            w2ui['ArtifactEdit'].html('main', w2ui.ArtifactEditAssets);
                            // w2ui.ArtifactEditAssets.refresh();
                            // w2ui['ArtifactEdit'].refresh();
                            break;
                    }
                }
            });
            w2ui['ArtifactEdit'].clear = () => {
                w2ui['ArtifactEdit'].record = undefined;
                w2ui['ArtifactEditGeneral'].clear();
                w2ui['ArtifactEditAssets'].clear();
            };
            $().w2form({
                name: 'ArtifactEditGeneral',
                modelType: 'Artifact',
                style: 'border: 0px; background-color: transparent;',
                fields: fields,
                actions: {
                    Save: function () {
                        this.validate();
                        // Create the model.
                        let url = `episode/save?id=${this.record.name}`;
                        // Artifact saving.
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
                                $('#popupContent').w2render(w2ui[w2ui.ArtifactEdit.previousWindow]);
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
                            $('#popupContent').w2render(w2ui[w2ui.ArtifactEdit.previousWindow]);
                        }
                    }
                }
            });
            // createActionForms();
            $().w2grid({
                name: 'ArtifactEditArtifacts',
                header: 'Artifacts',
                show: {
                    header: true,
                    columnHeaders: true,
                    toolbar: true,
                    toolbarReload: true,
                    toolbarSave: true,
                    toolbarEdit: true,
                    toolbarDelete: true
                },
                onEdit: (event) => {
                    // Add an asset to the artifact by publishing it.
                    console.log("Edit");
                },
                onSave: (event) => {
                    let changes = w2ui['ArtifactEditArtifacts'].getChanges();
                    let records = w2ui['ArtifactEditArtifacts'].records
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
                            let eid = w2ui['ArtifactEditGeneral'].record.name;
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
                    let selected = w2ui['ArtifactEditArtifacts'].getSelection();
                    console.log("Delete", selected);

                },
                onRender: (event) => {
                    setTimeout(function () {
                        w2ui.ArtifactEditArtifacts.refreshBody();
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
                        editable: {type: 'text'},
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
                name: 'ArtifactEditAssets',
                header: 'Assets',
                show: {
                    header: true,
                    columnHeaders: true,
                    toolbarSave: true,
                },
                onRender: (event) => {
                    setTimeout(function () {
                        w2ui.ArtifactEditAssets.refreshBody();
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
                        editable: {type: 'text'}
                    },
                    {
                        field: 'artifact', caption: 'Artifact',
                        size: '25%',
                        resizable: true,
                        editable: {type: 'text'}
                    },
                    {
                        field: 'url', caption: 'URL',
                        size: '25%',
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
        return w2ui['ArtifactEdit'];
    }

    static getPublishForm(channels, episode, artifact) {
        let publishForm = ArtifactView.createPublish(channels, episode, artifact);
        let urls = "";
        // Show the assets in the urls.
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
        let summary = artifact.summary || episode.summary.name;
        let title = artifact.title || episode.title.name;
        let record = {
            number: episode.number.name,
            summary: summary,
            title: title,
            tags: tagStrings.join(', '),
            urls: urls
        }

        publishForm.record = record;
        return publishForm;
    }

    static getEditForm(obj) {
        ArtifactView.createEdit();
        w2ui['ArtifactEdit'].clear();
        w2ui['ArtifactEdit'].record = obj;
        let url = `artifact?id=${obj._id}`;
        $.ajax({
            url: url,
            success: function (results) {
                w2ui['ArtifactEdit'].record = results.record;
            }
        });
        return w2ui['ArtifactEdit'];
    }

    static openPublishDialog(episode, artifact, previousWindow) {
        let url = `podcast/channelsByType`;
        let data = {podcast: episode.owner._id, artType: artifact.artType};
        $.post({
            url: url,
            data: data,
            success: function (results) {
                let inputForm = ArtifactView.getPublishForm(results.results, episode, artifact);
                inputForm.previousWindow = previousWindow;
                w2popup.open({
                    height: 850,
                    width: 850,
                    title: `Publish Artifact: ${artifact._name}`,
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

    static openDialog(obj, previousWindow) {
        let editForm = ArtifactView.getEditForm(obj);
        editForm.previousWindow = previousWindow;
        w2popup.open({
            height: 850,
            width: 850,
            title: `Edit ${obj._type}`,
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

    static openPromoteDialog(episode, artifact, previousWindow) {
        let url = `podcast/channelsByType`;
        let data = {podcast: episode.owner._id, artType: artifact.artType};
        $.post({
            url: url,
            data: data,
            success: function (results) {
                let inputForm = ArtifactView.getPromoteForm(results.results, episode, artifact);
                inputForm.previousWindow = previousWindow;
                w2popup.open({
                    height: 850,
                    width: 850,
                    title: `Promote Asset: ${artifact._type}`,
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

    static getPromoteForm(channels, episode, artifact) {
        let publishForm = ArtifactView.createPromote(channels);
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

    static createPromote(channels) {
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
            Cancel: function () {
                $('#popupContent').w2render(w2ui[w2ui.AssetPromoteForm.previousWindow]);
            }
        }
        for (let i in channels.values) {
            let channel = channels.values[i];
            actions[channel.name] = {
                caption: channel.name,
                style: 'background: lightblue;',
                onClick(event) {
                    window.open(channel.url);

                }
            }
        }
        if (w2ui.hasOwnProperty('AssetPromoteForm')) {
            $().w2destroy('AssetPromoteForm');
        }

        $().w2form({
            name: 'AssetPromoteForm',
            modelType: 'Asset',
            style: 'border: 0px; background-color: transparent;',
            fields: fields,
            actions: actions
        });
        return w2ui['AssetPromoteForm'];
    }

    show(obj) {

    }

    lookUpList(title, name, type) {
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

    lookUpItem(title, name, type) {
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

    createActionForms() {
        $().w2form({
            name: 'ArtifactActionsschedule',
            modelType: 'Artifact',
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
                            $('#popupContent').w2render(w2ui[w2ui.ArtifactEdit.previousWindow]);
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
                        $('#popupContent').w2render(w2ui[w2ui.ArtifactEdit.previousWindow]);
                    }
                }
            }
        });
    }
}
