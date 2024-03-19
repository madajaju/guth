import {AText} from './index.js';

export default class AEvent {
    static colors = {};
    static events = {};
    static count = 0;
    static nodes = {};
    static legend = {};
    static xOffset = 0;
    static default = {
        fontSize: 5,
        height: 10,
        width: 40,
        depth: 5,
        corner: 1,
    }

    constructor(config) {
        this.config = config;
    }

    static calculateBox(node) {
        let nameArray = node.name.split(/\s/).map(item => {
            return item.length;
        });
        let maxLetters = nameArray.reduce(function (a, b) {
            return Math.max(a, b);
        }, -Infinity);

        let height = nameArray.length * AEvent.default.fontSize * 2;
        let width = maxLetters * (AEvent.default.fontSize / 1.5);
        let depth = AEvent.default.depth;
        let radius = Math.max(Math.sqrt(width * width + height * height), Math.sqrt(height * height + depth * depth), Math.sqrt(width * width + depth * depth)) / 2;

        return {w: width, h: height, d: depth, r: radius};
    }
    static viewGroup3D(node, type) {
        let size = AEvent.calculateBox(node);
        // This is the rounded cube
        let width = size.w;
        let height = size.h
        let halfWidth = width / 2;
        let halfHeight = height / 2;
        let depth = size.d;

        let color = node.color || "#ffbb88";
        let opacity = node.opacity || 0.50;

        if (type === 'Selected') {
            color = "yellow";
        } else if (type === 'Targeted') {
            color = "red";
        } else if (type === 'Sourced') {
            color = "green";
        }

        let geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshPhysicalMaterial({
            color: color,
            transparent: true,
            opacity: opacity,
            depthTest: true,
            depthWrite: true,
            alphaTest: 0,
            reflectivity: 0.2,
            thickness: 6,
            metalness: 0,
            side: THREE.DoubleSide
        });

        // This is the rounded cube
        let group = new THREE.Mesh(geometry, material);
        let labelText = node.name.replace(/\s/g, '\n');
        let label = AText.view3D({
            text: labelText,
            color: "#ffffff",
            width: node.width,
            size: AEvent.default.fontSize
        });
        label.position.set(0, 0, (depth/2)+1);
        group.add(label);

        node.expandLink = `nolink`;
        node.description = node.description || node.name;
        node.getDetail = AEvent.getDetail;
        node.box = 0;
        return group;
    }
    static viewEvent3D(node, type) {
        let size = AEvent.calculateBox(node);
        // This is the rounded cube
        let width = size.w;
        let height = size.h
        let halfWidth = width / 2;
        let halfHeight = height / 2;
        let depth = size.d;

        let color = node.color || "#ffbb88";
        let opacity = node.opacity || 0.50;

        if (type === 'Selected') {
            color = "yellow";
        } else if (type === 'Targeted') {
            color = "red";
        } else if (type === 'Sourced') {
            color = "green";
        }

        let geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshPhysicalMaterial({
            color: color,
            transparent: true,
            opacity: opacity,
            depthTest: true,
            depthWrite: true,
            alphaTest: 0,
            reflectivity: 0.2,
            thickness: 6,
            metalness: 0,
            side: THREE.DoubleSide
        });

        // This is the rounded cube
        let group = new THREE.Mesh(geometry, material);
        let labelText = node.name.replace(/\s/g, '\n');
        let label = AText.view3D({
            text: labelText,
            color: "#ffffff",
            width: node.width,
            size: AEvent.default.fontSize
        });
        label.position.set(0, 0, (depth/2) + 1);
        group.add(label);

        node.expandLink = `nolink`;
        node.getDetail = AEvent.getDetail;
        node.description = node.description || node.name;
        node.box = 0;
        return group;
    }
    static viewInstance3D(node, type) {
        // This is the rounded cube
        let width = AEvent.default.width;
        let height = AEvent.default.height;
        let halfWidth = width / 2;
        let halfHeight = height / 2;
        let depth = AEvent.default.depth;

        let color = node.color || "#ffbb88";
        let opacity = node.opacity || 0.50;

        let geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshPhysicalMaterial({
            color: color,
            transparent: true,
            opacity: opacity,
            depthTest: true,
            depthWrite: true,
            alphaTest: 0,
            reflectivity: 0.2,
            thickness: 6,
            metalness: 0,
            side: THREE.DoubleSide
        });

        let group = new THREE.Mesh(geometry, material);
        let labelText = node.name.replace(/\s/g, '\n');
        let label = AText.view3D({
            text: labelText,
            color: "#ffffff",
            width: node.width,
            size: AEvent.default.fontSize
        });
        label.position.set(0, 0, (depth/2) + 1);
        group.add(label);

        node.expandLink = `nolink`;
        node.getDetail = AEvent.getDetail;
        node.description = node.description || node.name;
        node.box = 0;
        return group;
    }

    static getDetail(node) {
        AEvent.showDetail(node);
    }

    static showDetail(result) {
        let records = [];
        let cols = [
            {field: 'name', size: "20%", resizeable: true, label: "Name", sortable: true},
            {field: 'value', size: "80%", resizeable: true, label: "Value", sortable: true},
        ];
        w2ui['objdetail'].clear();
        w2ui['objdetail'].columns = cols;
        let i = 0;
        records.push({recid: i++, name: 'name', value: result.object.name, detail: result.object.name});
        records.push({
            recid: i++,
            name: 'Description',
            value: result.object.description,
            detail: result.object.description
        });
        records.push({
            recid: i++,
            name: 'Type',
            value: result.object.type,
            detail: result.object.type
        });
        if (result.object.actor) {
            records.push({
                recid: i++,
                name: 'Actor',
                value: result.object.actor,
                detail: result.object.actor
            });
        }
        if (result.object.package) {
            records.push({
                recid: i++,
                name: 'Actor',
                value: result.object.package,
                detail: result.object.package
            });
        }
        // Next Activity
        for (let aname in result.object.next) {
            let next = result.object.next[aname];
            let details = new Array();
            details.push(`name^${aname}`);
            if (next.condition) {
                details.push(`condition^${next.condition.test}[${next.condition.value}]`);
            }

            records.push({recid: i++, name: "Next", value: aname, detail: details.join('|')});
        }

        w2ui['objdetail'].records = records;
        // Clear the detail list

        ASelectedHUD.update('Activity', records);
        w2ui['objdetail'].refresh();
    }

    static handle(event, message, mode) {
        let msg = "";
        if(typeof message?.message === "string") {
            msg = message.message;
        } else if(message.obj) {
            msg = message.obj.description;
        } else {
            msg = message.toString();
        }
        let data = {nodes: {}, links: []};
        // parse the event and subevent.
        let [pevent, sevent] = event.split('.');
        if (!AEvent.events.hasOwnProperty(pevent) || !AEvent.nodes[pevent]) {
            let numOfGroups = Object.keys(AEvent.events).length;
            data.nodes[pevent] = AEvent.nodes[pevent] = {
                id: pevent,
                name: pevent,
                view: AEvent.viewGroup3D,
                fx: 0,
                fy: (numOfGroups * AEvent.default.height) * 1.20,
                fz: 0,
                description: pevent,
            }
            AEvent.events[pevent] = {
                name: pevent,
                events: {},
                node: AEvent.nodes[pevent]
            }
        }
        AEvent.nodes[pevent].color = AEvent.colors[sevent] || "#ffbb88";
        AEvent.nodes[pevent].description = `${msg}`;

        let id = `E:${pevent}.${sevent}`;
        let iid = `${id}.${AEvent.count++}`;
        if(!AEvent.legend.hasOwnProperty(sevent)) {
            AEvent.legend[sevent] = { name: sevent, x: AEvent.xOffset};
            AEvent.xOffset += (AEvent.default.width * 1.20);
        }
        if (!AEvent.events[pevent].events.hasOwnProperty(id) || !AEvent.nodes[id]) {

            data.nodes[id] = AEvent.nodes[id] = {
                id: id,
                name: `${sevent} (1)`,
                view: AEvent.viewEvent3D,
                rbox: {
                    parent: pevent,
                    fx: AEvent.legend[sevent].x,
                    fy: 0,
                    fz: 0
                }
            }
            AEvent.events[pevent].events[id] = {
                id: id,
                name: sevent,
                instances: [],
                node: AEvent.nodes[id],
            }

        }
        let numOfIEvents = AEvent.events[pevent].events[id].instances.length;
        AEvent.nodes[id].color = AEvent.colors[sevent] || "#ffbb88";
        AEvent.nodes[id].name = `${sevent}(${numOfIEvents+1})`;
        AEvent.nodes[id].description = `${msg}`;
        data.nodes[iid] = AEvent.nodes[iid] = {
            id: iid,
            count: AEvent.count,
            name: `${AEvent.count}`,
            description: `${msg}`,
            view: AEvent.viewInstance3D,
            rbox: {
                parent: id,
                fx: 0,
                fy: 0,
                fz: -(AEvent.count * AEvent.default.depth) * 1.20
            },
            color: AEvent.colors[sevent] || "#ffbb88"
        }
        AEvent.events[pevent].events[id].instances.push({
            id: iid,
            name: sevent,
            message: `${msg}`,
            node: AEvent.nodes[iid]
        });
        if (mode === 'add') {
            window.graph.addData(data.nodes, []);
        } else {
            window.graph.setData(AEvent.nodes, []);
        }
    }

    static setColors(scolor) {
        AEvent.colors = scolor;
    }
}
