/**
 * @author Alberto Contorno
 * @class
 */
export class Component{
    name;
    parent;

    onAfterAdded() {}
}

export const registeredComponents = {
    'transform': 0,
    'mesh': 1,
    'light': 2,
    'material': 3
}