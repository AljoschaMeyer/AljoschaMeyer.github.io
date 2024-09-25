// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

function fieldId(x, y) {
    return `${x}|${y}`;
}
function uiUpdateFieldStyles(activated) {
    const sheet = new CSSStyleSheet();
    const rules = [];
    for(let num = 0; num < 6; num++){
        if (activated.has(num)) {
            rules.push(`.field.wall[data-fieldnum="${num}"]:not(.inv) {
          mask-image: url(./maskWallActive.png);
        }`);
            rules.push(`.field.wall[data-fieldnum="${num}"].inv {
            mask-image: url(./maskWallInactive.png);
          }`);
        } else {
            rules.push(`.field.wall[data-fieldnum="${num}"]:not(.inv) {
            mask-image: url(./maskWallInactive.png);
          }`);
            rules.push(`.field.wall[data-fieldnum="${num}"].inv {
              mask-image: url(./maskWallActive.png);
            }`);
        }
    }
    sheet.replaceSync(rules.join(""));
    document.adoptedStyleSheets.pop();
    document.adoptedStyleSheets.push(sheet);
}
function encodeLevel(lvl) {
    return `${lvl.maxX}a${lvl.maxY}b${lvl.startX}c${lvl.startY}d${lvl.endX}e${lvl.endY}g${encodeFields(lvl.fields)}`;
}
function encodeFields(fields) {
    const parts = [];
    for (const [_id, field] of fields){
        parts.push(`${field.x}h${field.y}${encodeFieldKind(field.kind)}`);
    }
    return parts.join("g");
}
function encodeFieldKind(kind) {
    if ("toggle" in kind) {
        return `j${kind.toggle}`;
    } else if (kind.inverted) {
        return `k${kind.wall}`;
    } else {
        return `i${kind.wall}`;
    }
}
function decodeLevel(code, shrink) {
    const decodeRegex = /^(?<maxX>[0-9]+)a(?<maxY>[0-9]+)b(?<startX>[0-9]+)c(?<startY>[0-9]+)d(?<endX>[0-9]+)e(?<endY>[0-9]+)(?<fields>(?:g[0-9]+h[0-9]+(?:(?:i[0-5])|(?:j[0-5])|(?:k[0-5])))*)$/;
    const parsed = decodeRegex.exec(code);
    if (parsed === null) {
        return null;
    } else {
        const fields = new Map();
        const fieldsRegex = /g(?<x>[0-9]+)h(?<y>[0-9]+)(?:(?:(?<kind>i)(?<num>[0-5]))|(?:(?<kind>j)(?<num>[0-5]))|(?:(?<kind>k)(?<num>[0-5])))/g;
        let match;
        while(match = fieldsRegex.exec(parsed.groups.fields)){
            const x = parseInt(match.groups.x);
            const y = parseInt(match.groups.y);
            let kind = {
                toggle: 0
            };
            if (match.groups.kind === "j") {
                kind = {
                    toggle: parseInt(match.groups.num)
                };
            } else {
                kind = {
                    wall: parseInt(match.groups.num),
                    inverted: match.groups.kind === "k"
                };
            }
            fields.set(fieldId(x, y), {
                x,
                y,
                kind
            });
        }
        const lvl = {
            maxX: parseInt(parsed.groups.maxX),
            maxY: parseInt(parsed.groups.maxY),
            startX: parseInt(parsed.groups.startX),
            startY: parseInt(parsed.groups.startY),
            endX: parseInt(parsed.groups.endX),
            endY: parseInt(parsed.groups.endY),
            initiallyActivatedFields: new Set(),
            fields
        };
        if (lvl.startX >= lvl.maxX || lvl.endX >= lvl.maxX || lvl.startY >= lvl.maxY || lvl.endY >= lvl.maxY) {
            return null;
        }
        for (const [_, field] of fields){
            if (field.x >= lvl.maxX || field.y >= lvl.maxY) {
                return null;
            }
        }
        if (shrink) {
            return shrinkToFit(lvl);
        } else {
            return lvl;
        }
    }
}
function shrinkToFit(lvl) {
    let minX = lvl.maxX;
    let minY = lvl.maxY;
    let maxX = 1;
    let maxY = 1;
    if (lvl.endX < minX) {
        minX = lvl.endX;
    }
    if (lvl.startX < minX) {
        minX = lvl.startX;
    }
    if (lvl.endY < minY) {
        minY = lvl.endY;
    }
    if (lvl.startY < minY) {
        minY = lvl.startY;
    }
    if (lvl.endX > maxX) {
        maxX = lvl.endX;
    }
    if (lvl.startX > maxX) {
        maxX = lvl.startX;
    }
    if (lvl.endY > maxY) {
        maxY = lvl.endY;
    }
    if (lvl.startY > maxY) {
        maxY = lvl.startY;
    }
    for (const [_id, { x, y }] of lvl.fields){
        if (x < minX) {
            minX = x;
        }
        if (y < minY) {
            minY = y;
        }
        if (x > maxX) {
            maxX = x;
        }
        if (y > maxY) {
            maxY = y;
        }
    }
    const newFields = new Map();
    for (const [_id, field] of lvl.fields){
        const newX = field.x - minX;
        const newY = field.y - minY;
        newFields.set(fieldId(newX, newY), {
            x: newX,
            y: newY,
            kind: field.kind
        });
    }
    lvl.fields = newFields;
    lvl.startX -= minX;
    lvl.startY -= minY;
    lvl.endX -= minX;
    lvl.endY -= minY;
    lvl.maxX = 1 + maxX - minX;
    lvl.maxY = 1 + maxY - minY;
    return lvl;
}
function initialEditorState() {
    return {
        activatedFields: new Set(),
        fields: new Map(),
        fieldElems: new Map(),
        avatarX: 9,
        avatarY: 4,
        endX: 32 - 10,
        endY: 16 - 5,
        maxX: 32,
        maxY: 16,
        currentlyPlacing: 0
    };
}
const gameContainer = document.getElementById("game");
const avatar = document.getElementById("avatar");
const fieldContainer = document.getElementById("fields");
const goal = document.getElementById("goal");
const state = initialEditorState();
const initialStyles = new CSSStyleSheet();
document.adoptedStyleSheets.push(initialStyles);
uiUpdateFieldStyles(state.activatedFields);
gameContainer.style.width = `calc(var(--ppf) * ${state.maxX})`;
gameContainer.style.height = `calc(var(--ppf) * ${state.maxY})`;
const params = new URLSearchParams(window.location.search);
const encodedLvl = params.get("lvl");
if (encodedLvl) {
    const decoded = decodeLevel(encodedLvl);
    if (decoded !== null) {
        state.maxX = decoded.maxX;
        state.maxY = decoded.maxY;
        state.avatarX = decoded.startX;
        state.avatarY = decoded.startY;
        state.endX = decoded.endX;
        state.endY = decoded.endY;
        state.activatedFields = decoded.initiallyActivatedFields;
        state.fields = decoded.fields;
    }
}
renderLevel(state);
function positionElement(elem, x, y) {
    elem.style.left = `calc(var(--ppf) * ${x})`;
    elem.style.top = `calc(var(--ppf) * ${y})`;
}
function renderLevel(state) {
    positionElement(avatar, state.avatarX, state.avatarY);
    positionElement(goal, state.endX, state.endY);
    renderAllFields(fieldContainer, state);
}
function renderAllFields(fieldContainer, state) {
    while(fieldContainer.lastChild){
        fieldContainer.firstChild?.remove();
    }
    const fieldElems = [];
    state.fieldElems.clear();
    for (const [id, field] of state.fields){
        const elem = document.createElement("div");
        elem.classList.add("field");
        elem.style.left = `calc(var(--ppf) * ${field.x})`;
        elem.style.top = `calc(var(--ppf) * ${field.y})`;
        if ("toggle" in field.kind) {
            elem.dataset.fieldnum = `${field.kind.toggle}`;
            elem.classList.add("toggle");
        } else {
            elem.dataset.fieldnum = `${field.kind.wall}`;
            elem.classList.add("wall");
            if (field.kind.inverted) {
                elem.classList.add("inv");
            }
        }
        fieldElems.push(elem);
        state.fieldElems.set(id, elem);
    }
    fieldElems.forEach((fe)=>fieldContainer.appendChild(fe));
}
document.body.addEventListener("keydown", (e)=>{
    if (e.code == `KeyP`) {
        window.location.href = `./play.html?lvl=${encodeLevel(stateToLevel(state))}`;
    } else if (e.code == `Digit1`) {
        setBrush(state, 0);
    } else if (e.code == `Digit2`) {
        setBrush(state, 1);
    } else if (e.code == `Digit3`) {
        setBrush(state, 2);
    } else if (e.code == `Digit4`) {
        setBrush(state, 3);
    } else if (e.code == `Digit5`) {
        setBrush(state, 4);
    } else if (e.code == `Digit6`) {
        setBrush(state, 5);
    } else if (e.code == `Digit7`) {
        setBrush(state, 6);
    } else if (e.code == `Digit8`) {
        setBrush(state, 7);
    }
});
function setBrush(state, num) {
    state.currentlyPlacing = num;
}
gameContainer.addEventListener("click", (e)=>{
    const x = Math.floor(e.offsetX / 32);
    const y = Math.floor(e.offsetY / 32);
    const id = fieldId(x, y);
    const field = state.fields.get(id);
    if (field === undefined) {
        if (state.currentlyPlacing < 6) {
            state.fields.set(id, {
                x,
                y,
                kind: {
                    wall: state.currentlyPlacing,
                    inverted: true
                }
            });
            const newElem = document.createElement("div");
            newElem.classList.add("field", "wall", "inv");
            newElem.dataset.fieldnum = `${state.currentlyPlacing}`;
            state.fieldElems.set(id, newElem);
            positionElement(newElem, x, y);
            fieldContainer.appendChild(newElem);
        } else if (state.currentlyPlacing === 6) {
            state.avatarX = x;
            state.avatarY = y;
            positionElement(avatar, x, y);
        } else {
            state.endX = x;
            state.endY = y;
            positionElement(goal, x, y);
        }
    } else {
        const elem = state.fieldElems.get(id);
        if ("wall" in field.kind) {
            if (field.kind.inverted) {
                field.kind.inverted = false;
                elem.classList.remove("inv");
            } else {
                field.kind = {
                    toggle: field.kind.wall
                };
                elem.classList.replace("wall", "toggle");
            }
        } else {
            state.fields.delete(id);
            state.fieldElems.delete(id);
            elem.remove();
        }
    }
    const encoded = encodeLevel(stateToLevel(state));
    const urlWithoutParamers = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
    history.replaceState({}, "", `${urlWithoutParamers}?lvl=${encoded}`);
});
function stateToLevel(state) {
    return {
        maxX: state.maxX,
        maxY: state.maxY,
        startX: state.avatarX,
        startY: state.avatarY,
        endX: state.endX,
        endY: state.endY,
        fields: state.fields,
        initiallyActivatedFields: state.activatedFields
    };
}
