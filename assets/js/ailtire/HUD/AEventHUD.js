/*
 * Copyright 2023 Intel Corporation.
 * This software and the related documents are Intel copyrighted materials, and your use of them is governed by
 * the express license under which they were provided to you (License). Unless the License provides otherwise,
 * you may not use, modify, copy, publish, distribute, disclose or transmit this software or the related documents
 * without  Intel's prior written permission. This software and the related documents are provided as is, with no
 * express or implied warranties, other than those that are expressly stated in the License.
 *
 */

import {
    AText,
} from '../index.js';

export default class AEventHUD {
    static visible = false;
    static plane = undefined;
    static height= 0;
    static width= 0;
    static currentHeight= 0;
    static events = {};
    static colors = {};
    static dist = 20;
    static size = 0.5;

    static sync() {
        AEventHUD.hide();
        AEventHUD.plane = undefined;
        AEventHUD.show();
    }
    static updateHUD(event) {
        let width = AEventHUD.width;
        let height = AEventHUD.height;
        let currentHeight = AEventHUD.currentHeight;
        let size = AEventHUD.size;
        // Add the new Event Group
        if (!AEventHUD.events.hasOwnProperty(event.recid)) {
            // the size*.50 gives a 50% space between the events.
            currentHeight -= (4*size);
            AEventHUD.currentHeight = currentHeight;
            AEventHUD.events[event.recid] = {record: event, plane: {}, countObj: {}, eventsObj: {}, eventsBox: {}, yoffset: currentHeight};
            // Set the plane to contain all of the event states and messages
            const geo = new THREE.PlaneGeometry(width,(3*size) + size/2);
            const material = new THREE.MeshBasicMaterial({
                color: "#888888",
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.50,
            });
            const group = new THREE.Mesh(geo, material);
            AEventHUD.events[event.recid].plane = group;
            group.position.set(0, currentHeight, 0);
            if(AEventHUD.plane) {
                AEventHUD.plane.add(group);
            }
            // Add Label
            let labelr = AText.view3D({
                text: event.recid,
                color: "#ffffff",
                size: size,
                anchorX: 'left',
                anchorY: 'middle',
                textAlign: 'left',
            });
           // labelr.position.set(-width/2 + 4*2*size, 0, 0.01);
            labelr.position.set(-(width/2) + size, size, 0.01);
            group.add(labelr);
            // Add Count
            let labelc = AText.view3D({
                text: event.recid,
                color: "#ffffff",
                size: size,
                anchorX: 'right',
                anchorY: 'middle',
                textAlign: 'right',
            });
            labelc.position.set((width / 2) - size, size, 0.01);
            group.add(labelc);
            AEventHUD.events[event.recid].countObj = labelc;
            let labelm = AText.view3D({
                text: event.message,
                color: "#ffffff",
                size: size/1.5,
                anchorX: 'left',
                anchorY: 'middle',
                textAlign: 'left',
            });
            labelm.position.set(-(width / 2), -size, 0.01);
            group.add(labelm);
            AEventHUD.events[event.recid].messageObj = labelm;
            // Add eventsArray of Objects
            let i = 0;
            for (let ename in event.events) {
                i++;
                let color = AEventHUD.colors[ename] || "#ffbb88";
                let [elabel,ebox] = AEventHUD._statObj(AEventHUD.events[event.recid].plane, {
                    size: size,
                    x: -(width/2) + (i * 2 * size),
                    y: 0,
                    z: 0,
                    text: event.events[ename],
                    color: color,
                });
                group.add(elabel);
                AEventHUD.events[event.recid].eventsObj[ename] = elabel;
                AEventHUD.events[event.recid].eventsBox[ename] = ebox;
            }
        }
        AEventHUD.events[event.recid].countObj.text = `${event.count}`;
        AEventHUD.events[event.recid].messageObj.text = `${event.message}`;
        AEventHUD.events[event.recid].countObj.sync();


        for (let ename in event.events) {
            if (!AEventHUD.events[event.recid].eventsObj.hasOwnProperty(ename)) {
                let length = Object.keys(AEventHUD.events[event.recid].eventsObj).length;
                let color = AEventHUD.colors[ename] || "#ffbb88";
                length++;
                let [elabel, ebox] = AEventHUD._statObj(AEventHUD.events[event.recid].plane, {
                    size: size,
                    x: -(width/2) + (length * 2 * size),
                    y: 0,
                    z: 0,
                    text: event.events[ename],
                    color: color,
                });
                AEventHUD.events[event.recid].eventsObj[ename] = elabel;
                AEventHUD.events[event.recid].plane.add(elabel);
                AEventHUD.events[event.recid].eventsBox[ename] = ebox;
            }
            AEventHUD.events[event.recid].eventsObj[ename].text = `${event.events[ename]}`;
            AEventHUD.events[event.recid].eventsObj[ename].sync();
        }
        let [pevent, cevent] = event.currentEvent.split('.');
        let pcolor = AEventHUD.colors[cevent] || "#ffbb88";
        AEventHUD.events[pevent].plane.material.color.set(pcolor);
        for(let i in AEventHUD.events[pevent].eventsBox) {
            let box = AEventHUD.events[pevent].eventsBox[i];
            if(cevent === i) {
                box.material.opacity = 1.0;
            } else {
                box.material.opacity = 0.7;
            }
        }
    }

    static _statObj(parent, obj) {
        const geo = new THREE.BoxGeometry(obj.size*2,obj.size,0.1);
        const material = new THREE.MeshBasicMaterial({
            color: obj.color,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7,
        });
        const box = new THREE.Mesh(geo, material);
        box.position.set(obj.x, obj.y, obj.z);
        let label = AText.view3D({
            text: obj.text,
            color: "#000000",
            size: obj.size,
            anchorX: 'center',
            anchorY: 'middle',
            textAlign: 'center',
        });
        label.position.set(obj.x, obj.y, obj.z+0.1);
        box.add(label);
        parent.add(box);
        return [label, box];
    }

    static show() {
        let camera = window.graph.graph.camera();
        if (!AEventHUD.plane) {
            const dist = AEventHUD.dist;
            const vFOV = THREE.MathUtils.degToRad(camera.fov); // convert vertical fov to radians
            const height = 2 * Math.tan(vFOV / 2) * dist; // visible height
            const width = height * camera.aspect;
            let geometry = new THREE.PlaneGeometry(width / 6, height)
            const material = new THREE.MeshBasicMaterial({
                color: "#444444",
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.30,
            });
            const plane = new THREE.Mesh(geometry, material);
            plane.position.set(-5 * width / 12, 0, -dist);
            window.graph.graph.scene().add(camera);
            camera.add(plane);
            AEventHUD.visible = true;
            AEventHUD.plane = plane;
            AEventHUD.height = plane.geometry.parameters.height;
            AEventHUD.width = plane.geometry.parameters.width;
            AEventHUD.currentHeight = AEventHUD.height/2;
            // AEventHUD.currentHeight = 0;

            // Add the current events to the plane.
            // change the height and width for the events already created.
            for(let ename in AEventHUD.events) {
                let event = AEventHUD.events[ename];
                event.plane.position.set(-AEventHUD.width/2,AEventHUD.currentHeight)
                AEventHUD.plane.add(event.plane);
                AEventHUD.currentHeight -= AEventHUD.size;
            }
        }
        if (!AEventHUD.visible) {
            AEventHUD.visible = true;
            camera.add(AEventHUD.plane);
        }
    }

    static hide() {
        let camera = window.graph.graph.camera();

        // Remove plane
        camera.remove(AEventHUD.plane);
        AEventHUD.visible = false;
    }

    static toggle() {
        if (!AEventHUD.visible) {
            AEventHUD.show();
        } else {
            AEventHUD.hide();
        }
    }
    static setColors(scolor) {
        AEventHUD.colors = scolor;
    }
}

