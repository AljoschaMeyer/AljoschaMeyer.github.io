// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const bufferDistance = 3;
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
    const urlWithoutParamers = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
    history.replaceState({}, "", `${urlWithoutParamers}?level=${lvl.id}`);
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
            if ("toggle" in field.kind) {
                move.toggles = field.kind.toggle;
                move.overshot = false;
                break;
            } else {
                if (world.activatedFields.has(field.kind.wall) && !field.kind.inverted || !world.activatedFields.has(field.kind.wall) && field.kind.inverted) {
                    move.overshot = false;
                    break;
                }
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
    }, animationDuration - msPerField);
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
function startTheGame(gameoverMessage, levels) {
    const theLevels = {
        ordered: [],
        byId: new Map(),
        gameoverMessage
    };
    levels.forEach(({ msg, encoded }, i)=>{
        const decoded = decodeLevel(encoded, true);
        if (!decoded) {
            throw new Error("encoded");
        } else {
            const id = `${i}`;
            theLevels.ordered.push({
                message: msg,
                level: decoded,
                id
            });
            theLevels.byId.set(id, i);
        }
    });
    const params = new URLSearchParams(window.location.search);
    const levelId = params.get("level") ?? "0";
    startGame(theLevels, levelId, document.body);
}
function kbd(text) {
    const elem = document.createElement("kbd");
    elem.append(text);
    return elem;
}
function a(text, href) {
    const elem = document.createElement("a");
    elem.append(text);
    elem.href = href;
    return elem;
}
const msg0 = document.createElement("div");
msg0.append("Use ", kbd("w"), " ", kbd("a"), " ", kbd("s"), " ", kbd("d"), " or arrow keys to move, ", kbd("esc"), " to reset.");
const msg2 = document.createElement("div");
msg2.append("You can create your own levels ", a("here", "./build.html"), ".");
startTheGame("That’s all — for now.", [
    {
        msg: msg0,
        encoded: "32a16b0c0d6e3g5h0k0g0h3k0g9h2k0g4h6k0g10h5k0g5h3k0g8h7k0"
    },
    {
        encoded: "32a16b8c7d8e2g8h3k0g7h7i0g14h7j0g8h1i1g13h2j1g13h8j0g13h6i0"
    },
    {
        msg: msg2,
        encoded: "32a16b9c4d22e11g9h8k0g14h7k0g15h8k0g15h6k0g16h7k0g23h11i1g15h7j1g13h4k1g8h5j0g18h5i0g17h12j1g23h5j1g10h9k0g9h10k0g8h9k0g9h9j1g20h8j0g20h7k1g19h8k1g20h9k1g21h8k1g6h8i1g17h11i0g16h12i0g18h12i0g17h13i0g16h15k0g24h14i1g26h14i1g25h15i1g25h13i1g3h14i1g4h13i1g5h14i1g4h15i1g4h14j0g25h14j0g2h9i0g1h8i0g0h9i0g1h10i0g1h9j1g24h0k0g23h1k0g24h2k0g25h1k0g24h1j1g21h2j0g20h1j0g20h3j0g19h2j0g20h2j1g28h8i0g11h3j1g22h10i0g7h15k1g28h7i0g27h12j0g21h11k0g22h12k1g2h3k2g3h2k2g2h1k2g1h2k2g2h2j3g30h0k3g29h1k3g30h2k3g31h1k3g29h13i3g28h14i3g30h14i3g29h15i3g30h1j4g29h14j2"
    }
]);
