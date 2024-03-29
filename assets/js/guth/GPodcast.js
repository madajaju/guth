import {GEpisode,GGuest} from "../sabr/index.js";
import {AText} from "../ailtire/index.js";

let _instances = {};
export default class GPodcast {
    constructor(name){
        this.id = name
        this.name = name.split('/').pop();
        this.results = {};
        _instances[this.id] = this;
    }

    static handle(result, obj) {
        let channel = _instances[obj.id];
        channel.results = result;
        channel.showGraph('new');
        channel.showDetails();
    }
    static handleList(results) {
        window.graph.clearObjects();
        SChannel.showAllGraph(results, "new");
    }

    static showList(panel, parent) {
        SChannel.getAll({
            fn: (channels) => {
                let items = [];
                for (let i in channels) {
                    let channel = channels[i];
                    items.push({
                        id: channel.id,
                        text: channel.name,
                        img: 'icon-page',
                        view: 'channel',
                        link: `pulsar/topic?id=${channel.id}`,
                    });
                }
                w2ui[panel].add(parent, items);
            }
        });
    }

    showDetails() {
        if (!w2ui['objlist']) {
            $('#objlist').w2grid({name: 'objlist'});
        }
        if (!w2ui['objdetail']) {
            $('#objdetail').w2grid({
                name: 'objdetail',
                header: 'Details',
                show: {header: true, columnHeaders: false},
                columns: [
                    {
                        field: 'name',
                        label: 'Name',
                        size: '100px',
                        style: 'background-color: #efefef; border-bottom: 1px solid white; padding-right: 5px;',
                        attr: "align=right"
                    },
                    {
                        field: 'value', label: 'Value', size: '100%', render: function (record) {
                            return '<div>' + record.value + '</div>';
                        }
                    }
                ]
            });
        }
        let cols = [
            {field: 'name', size: "20%", resizeable: true, label: "Name", sortable: true},
            {field: 'value', size: "80%", resizeable: true, label: "Value", sortable: true},
        ];
        w2ui['objlist'].columns = cols;
        let records = [];
        let i = 0;
        for (let name in this.results) {
            let value = this.results[name];
            let detail = value;
            if (typeof value === 'object') {
                if (value instanceof Map) {
                    detail = Object.keys(value).join('|');
                    value = Object.keys(value).length;
                } else if (value instanceof Object) {
                    detail = Object.keys(value).join('|');
                    value = Object.keys(value).length;
                } else {
                    detail = value.join('|');
                    value = value.length;
                }
            }
            records.push({
                recid: i++,
                name: name,
                value: value,
                detail: detail,
            });
        }
        w2ui['objlist'].records = records;
        w2ui['objlist'].refresh();
    }

    updateData(callback) {
        let obj = this;
        let url = `pulsar/topic?id=${obj.id}`;
        $.ajax({
            url: url,
            success: (result) => {
                obj.storeData(result);
                if(callback) {
                    callback(obj);
                }
            },
            error: (result) => {
                console.log(result);
            }
        });
    }

    storeData(result) {
        this.results = result;
    }
    static showAllGraph(channels, mode) {
        if(mode === "new") {
            window.graph.clearObjects();
        }
        for(let i in channels) {
            channels[i].updateData( (channel) => {
                SChannel.viewDeep3D(channel, "add");
            });
        }
    }
    showGraph(mode) {
        window.graph.clearObjects();
        SChannel.viewDeep3D(this,mode);
    }
    static viewDeep3D(channel, mode) {
        let data = {nodes: {}, links: []};

        let cid = channel.id.replace(/\//g,'-');
        cid = cid.replace(/\:/g,'-');
        let node = {
            id: cid,
            name: channel.name.replace(/\s/g, '\n'),
            view: SChannel.view3D,
        };

        data.nodes[cid] = node;
        let i = 0;

        for (let sname in channel.results.subscriptions) {
            let subscription = channel.results.subscriptions[sname];
            sname = sname.replace(/\//g,'-').replace(/\:/,'');
            let node = {
                id: sname,
                name: sname,
                view: SSubscription.view3D,
            };
            data.nodes[sname] = node;
            for (let i in subscription.consumers) {
                let consumer = subscription.consumers[i];
                 let cnname = consumer.consumerName.replace(/\//g,'-').replace(/\:/,'');
                let cnode = {
                    id: cnname,
                    name: consumer.consumerName.replace(/\-.*$/, ''),
                    view: SConsumer.view3D,
                };
                data.nodes[cnode.id] = cnode;
                data.links.push({source: sname, target: cnode.id, value: 10});
            }
            data.links.push({source: cid, target: sname, value: 10});
            i++;
        }
        for (let sname in channel.results.publishers) {
            let producer = channel.results.publishers[sname];
            let pname = producer.producerName.replace(/\//g, '-').replace(/\:/,'');
            let node = {
                id: pname,
                name: producer.producerName,
                view: SProducer.view3D,
            };
            data.nodes[node.id] = node;
            data.links.push({source: node.id, target: cid, value: 10});
            i++;
        }
        if (mode === 'add') {
            window.graph.addData(data.nodes, data.links);
        } else {
            window.graph.setData(data.nodes, data.links);
        }
        window.graph.showLinks();
    }
}
