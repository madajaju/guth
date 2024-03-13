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

export default class PostView {
    constructor(config) {
        this.config = config;
        // PostView.createEdit();
        PostView.createList();
        PostView.createDetail();
    }

    static createList() {
        if (!w2ui['PostList']) {
        }
    }

    static createDetail() {
        if (!w2ui['PostList']) {
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
        if (w2ui.hasOwnProperty('PostPromoteForm')) {
            $().w2destroy('PostPromoteForm');
        }

        $().w2form({
            name: 'PostPromoteForm',
            modelType: 'Post',
            style: 'border: 0px; background-color: transparent;',
            fields: fields,
            actions: actions
        });
        return w2ui['PostPromoteForm'];
    }

    static createEdit(obj) {
        if (w2ui['PostEdit']) {
            $().w2destroy('PostPromoteForm');
        }
        let fields = [];
        fields.push({
            field: 'Status',
            type: 'text',
            required: true,
            html: {label: "Status", attr: `size="40" style="width:500px"`}
        });
        fields.push({
            field: 'name',
            type: 'text',
            required: true,
            html: {label: "Name", attr: `size="75" style="width:500px"`}
        });
        fields.push({
            field: 'lang',
            type: 'text',
            required: true,
            html: {label: "Language", attr: `size="40" style="width:500px;"`}
        });
        fields.push({
            field: 'channel',
            type: 'text',
            required: true,
            html: {label: "Channel", attr: `size="40" style="width:500px;"`}
        });
        fields.push({
            field: 'postedDate',
            type: 'datetime',
            required: true,
            html: {label: "Posted Date", attr: `size="200" style="width:500px;"`}
        });
        fields.push({
            field: 'text',
            type: 'textarea',
            required: true,
            html: {label: "Text", attr: `size="3000" style="width:500px; height: 400px;"`}
        });

        $().w2layout({
            name: 'PostEdit',
            panels: [
                {
                    type: 'main', size: 700, overflow: 'hidden',
                    toolbar: {
                        toolbarSave: true,
                        items: [
                            {id: 'publish', type: 'button', caption: 'Promote'},
                        ],
                        onClick(event) {
                            if (w2ui.PostEdit.record && w2ui[`PostActions${event.target}`]) {
                                w2ui[`PostActions${event.target}`].record = w2ui.PostEdit.record;
                                w2ui['PostEdit'].html('main', w2ui[`PostActions${event.target}`]);
                            }
                        },
                    }
                }
            ],
            onRender: (event) => {
                // Add the record to the form and the association tabs
                if (event.target === 'PostEdit') {
                    if (w2ui.PostEdit.record) {
                        // General Panel
                        w2ui.PostEditGeneral.record = w2ui.PostEdit.record;
                        w2ui.PostEditGeneral.refresh();
                    }
                }
                // w2ui.PostEditGeneral.refresh();
                w2ui.PostEdit.html('main', w2ui.PostEditGeneral);
            }
        });
        w2ui['PostEdit'].clear = () => {
            w2ui['PostEdit'].record = undefined;
            w2ui['PostEditGeneral'].clear();
            w2ui['PostEditPosts'].clear();
        };
        $().w2form({
            name: 'PostEditGeneral',
            modelType: 'Post',
            style: 'border: 0px; background-color: transparent;',
            fields: fields,
            actions: {
                Save: function () {
                    let post = w2ui.PostEdit.record;
                    let newValues = w2ui.PostEditGeneral.record;
                    let url = "post/save?id=" + post.id;
                    let data = {
                        channel: newValues.channel,
                        name: newValues.name,
                        lang: newValues.lang,
                        postedDate: newValues.postedDate,
                        text: newValues.text
                    };
                    $('#popupContent').w2render(w2ui[w2ui.PostEdit.previousWindow]);
                    $.post({
                        url: url,
                        data: data,
                        success: (results) => {
                            alert("Post Saved:" + results);
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
                        $('#popupContent').w2render(w2ui[w2ui.PostEdit.previousWindow]);
                    }
                }
            }
        });
        // createActionForms();
        $().w2grid({
            name: 'PostEditPosts',
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
                    w2ui.PostEditPosts.refreshBody();
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
        return w2ui['PostEdit'];
    }

    static getPromoteForm(channels, episode, artifact) {
        let publishForm = PostView.createPromote(channels);
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
        PostView.createEdit(obj);
        w2ui['PostEdit'].clear();
        w2ui['PostEdit'].record = obj;
        return w2ui['PostEdit'];
    }

    static openPromoteDialog(podcast, episode, asset) {
        let url = `podcast/channelsByType`;
        let data = {podcast: episode.owner._id, artType: artifact.channel};
        $.post({
            url: url,
            data: data,
            success: function (results) {
                let inputForm = PostView.getPromoteForm(results.results, episode, artifact);
                w2popup.open({
                    height: 850,
                    width: 850,
                    title: `Promote Post: ${artifact._type}`,
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
        let editForm = PostView.getEditForm(obj);
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
            name: 'PostActionsschedule',
            modelType: 'Post',
            style: 'border: 0px; background-color: transparent;',
            fields: [{
                field: 'date',
                type: 'datetime',
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
