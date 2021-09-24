export function setSubState(...args) {
    if (args.length < 2) {
        throw new Error('setSubState() : Not enough arguments');
    }
    else if (args.length === 2) {
        return setSubState_one(args[0], args[1]);
    }
    else {
        return setSubState_one(args[0], setSubState(...args.slice(1)));
    }
}

function setSubState_one(subStateName, substateFn) {
    return state => {
        let out = null;
        if (Array.isArray(state)) {
            out = [ ...state ];
        }
        else if (typeof(state) === 'object') {
            out = { ...state };
        }
        else {
            console.error(`Substate ${subStateName} is not an object nor an Array, you don\'t need to use setSubState`);
        }
    
        out[subStateName] = substateFn(state[subStateName]);
        return out;
    };
}
