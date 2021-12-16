const TYPE_TO_ID = {
    SUM: 0,
    PRODUCT: 1,
    MIN: 2,
    MAX: 3,
    LITERAL: 4,
    GT: 5,
    LT: 6,
    EQ: 7,
}

const ID_TO_TYPE = {
    0: 'SUM',
    1: 'PRODUCT',
    2: 'MIN',
    3: 'MAX',
    4: 'LITERAL',
    5: 'GT',
    6: 'LT',
    7: 'EQ',
}

const TYPE_HANDLERS = {
    SUM: nums => nums.reduce((x, y) => x + y, 0),
    PRODUCT: nums => nums.reduce((x, y) => x * y, 1),
    MIN: nums => Math.min(...nums),
    MAX: nums => Math.max(...nums),
    GT: ([a, b]) => Number(a > b),
    LT: ([a, b]) => Number(a < b),
    EQ: ([a, b]) => Number(a == b),
}

class Packet {
    constructor(version, typeId, content) {
        this.version = version;
        this.typeId = typeId;
        this.content = content; // is either a literal or a packet
    }
}

class Action {
    constructor(typeId, content) {
        this.type = ID_TO_TYPE[typeId];
        if (this.type === undefined) {
            throw new Error(`Unknown type ${typeId}`)
        }
        this.content = content; // is either a literal or a packet
    }
}

function createAction(packet) {
    if (Array.isArray(packet.content)) {
        return new Action(packet.typeId, packet.content.map(subPacket => createAction(subPacket)))
    } else if (typeof packet.content === 'number') {
        return packet.content;
    }
    
    throw new Error(`Unknown packet content type: ${packet.content}`)
}


function evaluateAction({ type, content }) {
    const handler = TYPE_HANDLERS[type];
    
    if (handler === undefined) {
        throw new Error(`No handler for type ${type}`)
    }
    
    return handler(content.map(action => action instanceof Action ? evaluateAction(action) : action))
}

const HEX_TO_BITS = {
    0: '0000',
    1: '0001',
    2: '0010',
    3: '0011',
    4: '0100',
    5: '0101',
    6: '0110',
    7: '0111',
    8: '1000',
    9: '1001',
    A: '1010',
    B: '1011',
    C: '1100',
    D: '1101',
    E: '1110',
    F: '1111',
}
function hexToBits(hexStr) {
    return [...hexStr].map(hex => HEX_TO_BITS[hex]).join('')
}

function readPacket(str) {
    let cursor = 0
    const version = parseInt(str.slice(cursor, cursor += 3), 2)
    const typeId = parseInt(str.slice(cursor, cursor += 3), 2)

    if (typeId === TYPE_TO_ID.LITERAL) {
        // Read literal
        let read = true;
        let strVal = ''
        while (read) {
            const part = str.slice(cursor, cursor += 5)
            read = part[0] === '1';
            strVal += part.slice(1);
        }
        return {
            packet: new Packet(version, typeId, parseInt(strVal, 2)),
            remaining: str.slice(cursor)
        }
    }

    // THIS BELOW IS ALL FOR ACTIONS
    const content = [];
    const lengthTypeId = str.slice(cursor, cursor += 1)
    if (lengthTypeId === '0') {
        // length is 15-bits. number of bits of subpackets
        const length = parseInt(str.slice(cursor, cursor += 15), 2)
        let subStr = str.slice(cursor, cursor += length)
        while (subStr.length) {
            const { packet, remaining } = readPacket(subStr)
            content.push(packet)
            subStr = remaining
        }
    } else if (lengthTypeId === '1') {
        // length is 11-bits. number of subpackets
        const length = parseInt(str.slice(cursor, cursor += 11), 2)
        str = str.slice(cursor)
        cursor = 0;
        for (let i = 0; i < length; i++) {
            const { packet, remaining } = readPacket(str)
            content.push(packet)
            str = remaining
        }
    } else {
        throw new Error(`Unknown lengthTypeId ${lengthTypeId}`)
    }
    
    return {
        packet: new Packet(version, typeId, content),
        remaining: str.slice(cursor),
    }
}

function go(str) {
    const bits = hexToBits(str)
    const { packet, remaining } = readPacket(bits)
    const action = createAction(packet)
    const result = evaluateAction(action)
    // console.log(JSON.stringify(action, null, 2))
    return result
}

console.log(go('9C0141080250320F1802104A08'))