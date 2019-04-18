/**
 * @author Alberto Contorno
 * @class
 */
export class Component{
    static nextId = 1;
    name;
    parent;

    constructor(){
        Component.nextId++;
        this.id = Component.nextId;
    }

    onAfterAdded() {}

    onAfterRemoved() {}
}

export const registeredComponents = {
    'transform': 0,
    'mesh': 1,
    'light': 2,
    'material': 3
}