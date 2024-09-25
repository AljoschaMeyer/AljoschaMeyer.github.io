// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const bufferDistance = 3;
function fieldId(x, y) {
    return `${x}|${y}`;
}
function startGame(levels, startLevelId, container) {
    const state = initialState(levels, container);
    const lvlIndex = levels.byId.get(startLevelId);
    const lvl = lvlIndex === undefined ? levels.ordered[0] : levels.ordered[lvlIndex];
    loadLevel(state, lvl);
    document.body.addEventListener("keydown", (e)=>{
        if (state.responsive) {
            if (e.code == `Escape`) {
                uiFadeOut(state, ()=>{
                    loadLevel(state, state.currentLevel);
                    uiFadeIn(state);
                });
            }
            let xStep = 0;
            let yStep = 0;
            if (e.code == `KeyW` || e.code == `ArrowUp`) {
                yStep = -1;
            } else if (e.code == `KeyS` || e.code == `ArrowDown`) {
                yStep = 1;
            } else if (e.code == `KeyA` || e.code == `ArrowLeft`) {
                xStep = -1;
            } else if (e.code == `KeyD` || e.code == `ArrowRight`) {
                xStep = 1;
            }
            if (xStep !== 0 || yStep !== 0) {
                move(state, xStep, yStep);
            }
        }
    });
}
function initialState(levels, container) {
    const state = {
        levels,
        currentLevel: levels.ordered[0],
        currentLevelState: initialStateOfLevel(levels.ordered[0].level),
        responsive: true,
        ui: initialUI(container)
    };
    return state;
}
function initialStateOfLevel(lvl) {
    const avatar = {
        x: lvl.startX,
        y: lvl.startY
    };
    const activatedFields = new Set(lvl.initiallyActivatedFields);
    return {
        avatar,
        activatedFields
    };
}
function initialUI(container) {
    const messageContainer = document.createElement("div");
    messageContainer.id = "message";
    container.appendChild(messageContainer);
    const gameContainer = document.createElement("div");
    gameContainer.id = "game";
    container.appendChild(gameContainer);
    const avatar = document.createElement("div");
    avatar.id = "avatar";
    gameContainer.appendChild(avatar);
    const fieldContainer = document.createElement("div");
    fieldContainer.id = "fields";
    gameContainer.appendChild(fieldContainer);
    const initialStyles = new CSSStyleSheet();
    document.adoptedStyleSheets.push(initialStyles);
    return {
        gameContainer,
        messageContainer,
        avatar,
        fieldContainer
    };
}
function loadLevel(state, lvl) {
    state.currentLevel = lvl;
    state.currentLevelState = initialStateOfLevel(lvl.level);
    state.responsive = true;
    uiResizeGame(state.ui.gameContainer, lvl.level);
    uiUpdateMessage(state.ui.messageContainer, lvl.message);
    uiUpdateAvatar(state.ui.avatar, state.currentLevelState.avatar);
    uiUpdateFields(state.ui.fieldContainer, lvl.level);
    uiUpdateFieldStyles(lvl.level.initiallyActivatedFields);
}
function uiResizeGame(gameContainer, lvl) {
    const totalWidth = lvl.maxX + 2 * 3;
    const totalHeight = lvl.maxY + 2 * 3;
    gameContainer.style.width = `calc(var(--ppf) * ${totalWidth})`;
    gameContainer.style.height = `calc(var(--ppf) * ${totalHeight})`;
}
function uiUpdateMessage(msgContainer, msg) {
    while(msgContainer.firstChild){
        msgContainer.lastChild?.remove();
    }
    if (msg) {
        msgContainer.append(msg);
    }
}
function uiUpdateAvatar(elem, avatar, transitionDurationInMs) {
    const duration = transitionDurationInMs ?? 0;
    elem.style.transition = `all ${duration}ms ease-in-out`;
    elem.style.left = `calc(var(--ppf) * ${avatar.x + bufferDistance})`;
    elem.style.top = `calc(var(--ppf) * ${avatar.y + bufferDistance})`;
}
function uiUpdateFields(fieldContainer, level) {
    const fields = level.fields;
    const fieldElems = [];
    for (const [_id, field] of fields){
        const elem = document.createElement("div");
        elem.classList.add("field");
        elem.style.left = `calc(var(--ppf) * ${field.x + bufferDistance})`;
        elem.style.top = `calc(var(--ppf) * ${field.y + bufferDistance})`;
        if (typeof field.kind === "object") {
            elem.dataset.fieldnum = `${field.kind.toggle}`;
            elem.classList.add("toggle");
        } else {
            elem.dataset.fieldnum = `${field.kind}`;
            elem.classList.add("wall");
        }
        fieldElems.push(elem);
    }
    while(fieldContainer.firstChild){
        fieldContainer.removeChild(fieldContainer.lastChild);
    }
    fieldElems.forEach((fe)=>fieldContainer.appendChild(fe));
    const goalElem = document.createElement("div");
    goalElem.classList.add("field", "goal");
    goalElem.style.left = `calc(var(--ppf) * ${level.endX + bufferDistance})`;
    goalElem.style.top = `calc(var(--ppf) * ${level.endY + bufferDistance})`;
    fieldContainer.appendChild(goalElem);
}
function uiUpdateFieldStyles(activated) {
    const sheet = new CSSStyleSheet();
    const rules = [];
    for(let num = 0; num < 6; num++){
        if (activated.has(num)) {
            rules.push(`.field.wall[data-fieldnum="${num}"] {
        mask-image: url(./maskWallActive.png);
      }`);
            rules.push(`.field.toggle[data-fieldnum="${num}"] {
        mask-image: url(./maskToggleActive.png);
      }`);
        } else {
            rules.push(`.field.wall[data-fieldnum="${num}"] {
        mask-image: url(./maskWallInactive.png);
      }`);
            rules.push(`.field.toggle[data-fieldnum="${num}"] {
        mask-image: url(./maskToggleInactive.png);
      }`);
        }
    }
    sheet.replaceSync(rules.join(""));
    document.adoptedStyleSheets.pop();
    document.adoptedStyleSheets.push(sheet);
}
function uiFadeIn(state, cb) {
    state.responsive = false;
    state.ui.gameContainer.style.opacity = "1";
    state.ui.messageContainer.style.opacity = "1";
    setTimeout(()=>{
        state.responsive = true;
        if (cb) cb();
    }, 1000);
}
function uiFadeOut(state, cb) {
    state.responsive = false;
    state.ui.gameContainer.style.opacity = "0";
    state.ui.messageContainer.style.opacity = "0";
    setTimeout(()=>{
        if (cb) cb();
    }, 1000);
}
function movePure(state, xDir, yDir) {
    const world = state.currentLevelState;
    const move = {
        oldX: world.avatar.x,
        oldY: world.avatar.y,
        newX: world.avatar.x,
        newY: world.avatar.y,
        distance: 0,
        overshot: true,
        won: false
    };
    let x = world.avatar.x;
    let y = world.avatar.y;
    while(x >= 0 && x < state.currentLevel.level.maxX && y >= 0 && y < state.currentLevel.level.maxY){
        x += xDir;
        y += yDir;
        const fid = fieldId(x, y);
        const field = state.currentLevel.level.fields.get(fid);
        if (field) {
            if (typeof field.kind === "object" || world.activatedFields.has(field.kind)) {
                if (typeof field.kind === "object") {
                    move.toggles = field.kind.toggle;
                }
                move.overshot = false;
                break;
            }
        }
    }
    move.newX = x - xDir;
    move.newY = y - yDir;
    move.distance = Math.abs(move.newX - move.oldX) + Math.abs(move.newY - move.oldY);
    if (move.distance === 0) {
        move.toggles = undefined;
    }
    if (!move.overshot && state.currentLevel.level.endX === move.newX && state.currentLevel.level.endY === move.newY) {
        move.won = true;
    }
    return move;
}
const msPerField = 1000 / 12;
function move(state, xDir, yDir) {
    state.responsive = false;
    const result = movePure(state, xDir, yDir);
    const distance = result.overshot ? result.distance + 3 : result.distance;
    const newX = result.overshot ? result.newX + 3 * xDir : result.newX;
    const newY = result.overshot ? result.newY + 3 * yDir : result.newY;
    const animationDuration = msPerField * distance;
    if (result.toggles !== undefined) {
        toggle(state, result.toggles, animationDuration);
    }
    state.currentLevelState.avatar.x = newX;
    state.currentLevelState.avatar.y = newY;
    uiUpdateAvatar(state.ui.avatar, state.currentLevelState.avatar, animationDuration);
    if (result.overshot) {
        setTimeout(()=>{
            uiFadeOut(state, ()=>{
                loadLevel(state, state.currentLevel);
                uiFadeIn(state);
            });
        }, animationDuration - (msPerField * 3 + 1000));
    } else if (result.won) {
        setTimeout(()=>{
            nextLevel(state);
        }, animationDuration);
    }
    setTimeout(()=>{
        state.responsive = true;
    }, animationDuration);
}
function toggle(state, toggles, delay) {
    if (state.currentLevelState.activatedFields.has(toggles)) {
        state.currentLevelState.activatedFields.delete(toggles);
    } else {
        state.currentLevelState.activatedFields.add(toggles);
    }
    setTimeout(()=>uiUpdateFieldStyles(state.currentLevelState.activatedFields), delay);
}
function nextLevel(state) {
    uiFadeOut(state, ()=>{
        const levelOffset = state.levels.byId.get(state.currentLevel.id) + 1;
        if (state.levels.ordered.length <= levelOffset) {
            uiUpdateMessage(state.ui.messageContainer, state.levels.gameoverMessage);
            state.ui.gameContainer.remove();
            uiFadeIn(state, ()=>{
                state.responsive = false;
            });
        } else {
            loadLevel(state, state.levels.ordered[levelOffset]);
            uiFadeIn(state);
        }
    });
}
function newLevels(gameoverMessage) {
    return {
        ordered: [],
        byId: new Map(),
        gameoverMessage
    };
}
function levelsAppend(levels, next) {
    levels.ordered.push(next);
    levels.byId.set(next.id, levels.ordered.length - 1);
}
function fieldsFromTriplets(triplets) {
    return new Map(triplets.map(([x, y, kind])=>[
            fieldId(x, y),
            {
                x,
                y,
                kind
            }
        ]));
}
const lvls = newLevels("Thank you for playing.");
const lvl0 = {
    maxX: 15,
    maxY: 8,
    startX: 1,
    startY: 1,
    endX: 11,
    endY: 5,
    initiallyActivatedFields: new Set([
        0
    ]),
    fields: fieldsFromTriplets([
        [
            6,
            1,
            0
        ],
        [
            7,
            1,
            0
        ],
        [
            6,
            2,
            0
        ],
        [
            5,
            6,
            {
                toggle: 1
            }
        ],
        [
            11,
            7,
            {
                toggle: 4
            }
        ],
        [
            12,
            5,
            0
        ],
        [
            8,
            1,
            1
        ],
        [
            9,
            1,
            2
        ],
        [
            10,
            1,
            3
        ],
        [
            11,
            1,
            4
        ],
        [
            12,
            1,
            5
        ]
    ])
};
function kbd(text) {
    const elem = document.createElement("kbd");
    elem.append(text);
    return elem;
}
const msg0 = document.createElement("div");
msg0.append("Use ", kbd("w"), " ", kbd("a"), " ", kbd("s"), " ", kbd("d"), " or arrow keys to move, ", kbd("esc"), " to reset.");
levelsAppend(lvls, {
    id: "first",
    message: msg0,
    level: lvl0
});
const lvl1 = {
    maxX: 12,
    maxY: 8,
    startX: 2,
    startY: 1,
    endX: 11,
    endY: 5,
    initiallyActivatedFields: new Set([
        0
    ]),
    fields: fieldsFromTriplets([
        [
            6,
            1,
            0
        ],
        [
            5,
            6,
            0
        ],
        [
            12,
            4,
            0
        ],
        [
            12,
            5,
            0
        ],
        [
            12,
            6,
            0
        ]
    ])
};
levelsAppend(lvls, {
    id: "banana",
    level: lvl1
});
startGame(lvls, "first", document.body);
