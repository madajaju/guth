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

export default class AssetView {
    constructor(config) {
        this.config = config;
        // AssetView.createEdit();
        AssetView.createList();
        AssetView.createDetail();
    }

    static createList() {
        if (!w2ui['AssetList']) {
        }
    }

    static createDetail() {
        if (!w2ui['AssetList']) {
        }
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
                w2popup.close();
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

    static createEdit(obj) {
        if (w2ui['AssetEdit']) {
            $().w2destroy('AssetPromoteForm');
        }
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
            field: 'url',
            type: 'text',
            required: true,
            html: {label: "Summary", attr: `size="200" style="width:500px;"`}
        });

        if (!obj) {
            fields.push({
                field: 'title',
                type: 'textarea',
                required: true,
                html: {label: "Name", attr: `size="75" style="width:500px"`}
            });
            fields.push({
                field: 'tags',
                type: 'textarea',
                required: true,
                html: {label: "Tags", attr: `size="200" style="width:500px;"`}
            });
            fields.push({
                field: 'summary',
                type: 'textarea',
                required: true,
                html: {label: "Summary", attr: `size="1000" style="width:500px; height:200px"`}
            });
        } else {
            for (let name in obj.fields) {
                let fieldlength = obj.fields[name].length;
                fields.push({
                    field: name,
                    type: 'textarea',
                    required: true,
                    html: {
                        label: name,
                        attr: `size="${fieldlength}" style="width:500px; height:${50 + Math.round((fieldlength / 80) * 12)}px"`
                    }
                })
            }
        }

        $().w2layout({
            name: 'AssetEdit',
            panels: [
                {
                    type: 'preview', size: 250, overflow: 'hidden',
                },
                {
                    type: 'main', size: 700, overflow: 'hidden',
                    toolbar: {
                        toolbarSave: true,
                        items: [
                            {id: 'publish', type: 'button', caption: 'Promote'},
                        ],
                        onClick(event) {
                            if (w2ui.AssetEdit.record && w2ui[`AssetActions${event.target}`]) {
                                w2ui[`AssetActions${event.target}`].record = w2ui.AssetEdit.record;
                                w2ui['AssetEdit'].html('main', w2ui[`AssetActions${event.target}`]);
                            }
                        },
                    }
                }
            ],
            onRender: (event) => {
                // Add the record to the form and the association tabs
                if (event.target === 'AssetEdit') {
                    if (w2ui.AssetEdit.record) {
                        // General Panel
                        w2ui.AssetEditGeneral.record = {};
                        let assetFields = w2ui.AssetEdit.record.fields;
                        for(let name in assetFields) {
                            w2ui.AssetEditGeneral.record[name] = assetFields[name];
                        }
                        w2ui.AssetEditGeneral.record.id = w2ui.AssetEdit.record._id || "";
                        w2ui.AssetEditGeneral.record.name = w2ui.AssetEdit.record._name || w2ui.AssetEdit.record.name;
                        w2ui.AssetEditGeneral.record.artType = "";
                        if(w2ui.AssetEdit.record.artType) {
                            w2ui.AssetEditGeneral.record.artType = w2ui.AssetEdit.record.artType.name || w2ui.AssetEdit.record.artType;
                        }
                        w2ui.AssetEditGeneral.record.url = w2ui.AssetEdit.record.url.name || w2ui.AssetEdit.url;

                        w2ui.AssetEditGeneral.refresh();
                        // Must be here so the document is in focus
                        if(assetFields && assetFields.hasOwnProperty('Description')) {
                            let name = 'Description';
                            let type = 'text/plain';
                            if( assetFields[name].includes('<html>')) {
                                type= 'text/html';
                            }
                            let data = [];
                            const blob = new Blob([assetFields[name]], {type});
                            data.push(new ClipboardItem({[type]: blob}));
                            navigator.clipboard.write(data).then(
                                () => { console.log("Written to clipboard!");},
                                (e) => { console.error("error:", e) }
                            );
                        }
                    }
                }
                // w2ui.AssetEditGeneral.refresh();
                w2ui.AssetEdit.html('main', w2ui.AssetEditGeneral);
                w2ui.AssetEdit.html('preview', w2ui.AssetEditPosts);
            }
        });
        w2ui['AssetEdit'].clear = () => {
            w2ui['AssetEdit'].record = undefined;
            w2ui['AssetEditGeneral'].clear();
            w2ui['AssetEditPosts'].clear();
        };
        $().w2form({
            name: 'AssetEditGeneral',
            modelType: 'Asset',
            style: 'border: 0px; background-color: transparent;',
            fields: fields,
            actions: {
                Save: function () {
                    // this.validate();
                    // Create the model.

                    let asset = w2ui.AssetEdit.record;
                    let newValues = w2ui.AssetEditGeneral.record;
                    let url = "asset/createNew";
                    if (asset._id) {
                        // edit the asset.
                        url = "asset/update?id=" + asset._id;
                    }
                    let data = {
                        channel: asset.channel.id,
                        artifact: asset.artifact.id,
                        name: newValues.name,
                        url: newValues.url,
                        tags: newValues.Tags,
                        title: newValues.Title,
                        image: newValues.Image,
                        episode: asset.episode._id,
                        summary: newValues.Description,
                        artType: newValues.artType
                    };
                    $('#popupContent').w2render(w2ui[w2ui.AssetEdit.previousWindow]);
                    $.post({
                        url: url,
                        data: data,
                        success: (results) => {
                            alert("Asset Saved:" + results);
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
                        $('#popupContent').w2render(w2ui[w2ui.AssetEdit.previousWindow]);
                    }
                }
            }
        });
        // createActionForms();
        $().w2grid({
            name: 'AssetEditPosts',
            header: 'Posts',
            show: {
                header: true,
                columnHeaders: true,
                toolbar: true,
                toolbarReload: true,
                toolbarSave: false,
                toolbarEdit: true,
                toolbarDelete: false
            },
            onEdit: (event) => {
                // Add an asset to the artifact by publishing it.
                console.log("Edit");
            },
            onRender: (event) => {
                setTimeout(function () {
                    w2ui.AssetEditPosts.refreshBody();
                }, 10);
            },
            columns: [
                {
                    field: 'name',
                    caption: 'Name',
                    size: '25%',
                    resizable: true,
                },
                {
                    field: 'createdDate', caption: 'Date',
                    size: '25%',
                    resizable: true,
                },
                {
                    field: 'text', caption: 'Text',
                    size: '50%',
                    resizable: true,
                }
            ]
        });
        return w2ui['AssetEdit'];
    }

    static getPromoteForm(channels, episode, artifact) {
        let publishForm = AssetView.createPromote(channels);
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

    static getEditForm(obj) {
        AssetView.createEdit(obj);
        w2ui['AssetEdit'].clear();
        w2ui['AssetEdit'].record = obj;
        // Get the Asset from the server if it exists.
        if (obj._id) {
            let url = `asset?id=${obj._id}`;
            $.ajax({
                url: url,
                success: function (results) {
                    w2ui['AssetEdit'].record = results.record;
                }
            });
        }
        return w2ui['AssetEdit'];
    }

    static openPromoteDialog(podcast, episode, asset) {
        let url = `podcast/channelsByType`;
        let data = {podcast: episode.owner._id, artType: artifact.channel};
        $.post({
            url: url,
            data: data,
            success: function (results) {
                let inputForm = AssetView.getPromoteForm(results.results, episode, artifact);
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

    static openDialog(obj, previousWindow) {
        let editForm = AssetView.getEditForm(obj);
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
            name: 'AssetActionsschedule',
            modelType: 'Asset',
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
}
