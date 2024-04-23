import CalendarView from "./CalendarView.js";
import PostView from "./PostView";

export default class SchedulerView {
    constructor(config) {
        this.config = config;
    }
    static view(data) {
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
    static getEditForm(url, inputs, data, callback) {
        let fields = [];
        for(let name in inputs) {
            let input = inputs[name];
            if(input.type === 'date') {
                fields.push({
                    field: name,
                    type: 'date',
                    required: input.required,
                    html: {label: name}
                });
            }
            else if(input.type === "boolean") {
                fields.push({
                    field: name,
                    type: 'checkbox',
                    required: input.required,
                    html: {label: name}
                });
            }
            else if(input.size) {
                fields.push({
                    field: name,
                    type: 'textarea',
                    required: input.required,
                    html: {label: name, attr: `size="${input.size}" style="width:500px; height:250px"`}
                });
            } else {
                fields.push({
                    field: name,
                    type: 'textarea',
                    required: input.required,
                    html: {label: name, attr: `size="50" style="width:500px"`}
                });
            }
        }
        if(w2ui['ActionInputForm']) {
            $().w2destroy('ActionInputForm');
        }
        $().w2form({
            name: 'ActionInputForm',
            modelType: 'Action',
            style: 'border: 0px; background-color: transparent;',
            fields: fields,
            actions: {
                Save: function () {
                    this.validate();
                    for(let name in this.record) {
                        data[name] =this.record[name];
                    }
                    callback(url, data);
                },
                Reset: function () {
                    this.clear();
                },
                custom: {
                    caption: "Cancel",
                    style: 'background: pink;',
                    onClick(event) {
                        $('#actionInputDialog').w2render(w2ui[w2ui.ActionInputForm.previousWindow]);
                        /*w2popup.close();
                        if(w2ui.ActionInputForm.previousWindow) {
                            w2ui.ActionInputForm.previousWindow;
                            w2popup.open({
                                height:850,
                                width: 850,
                                body: '<div id="content"'
                            }
                        }
                         */
                    }
                }
            }
        });
        return w2ui['ActionInputForm'];
    }
    static openDialog(url, inputs,data, callback, previousWindow) {
        let editForm = ActionView.getEditForm(url, inputs, data, callback);
        editForm.previousWindow = previousWindow;
        w2popup.open({
            height: 850,
            width: 850,
            title: `Action Input View`,
            body: '<div id="actionInputDialog" style="width: 100%; height: 100%;"></div>',
            showMax: true,
            onToggle: function (event) {
                $(w2ui.actionInputDialog.box).hide();
                event.onComplete = function () {
                    $(w2ui.actionInputDialog.box).show();
                    w2ui.actionInputDialog.resize();
                }
            },
            onOpen: function (event) {
                event.onComplete = function () {
                    // specifying an onOpen handler instead is equivalent to specifying an onBeforeOpen handler,
                    // which would make this code execute too early and hence not deliver.
                    $('#actionInputDialog').w2render(editForm);
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
