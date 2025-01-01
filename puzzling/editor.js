// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

function fieldId(x, y) {
    return `${x}|${y}`;
}
function fieldColor(field) {
    if ("toggle" in field.kind) {
        return field.kind.toggle;
    } else {
        return field.kind.wall;
    }
}
class Level {
    fields;
    start;
    target;
    #numColors;
    #width;
    #height;
    #minX;
    #maxX;
    #minY;
    #maxY;
    constructor(fields, start, target){
        this.fields = fields;
        this.start = start;
        this.target = target;
        let greatestColor = -1;
        let minX = Math.min(start[0], target[0]);
        let maxX = Math.max(start[0], target[0]);
        let minY = Math.min(start[1], target[1]);
        let maxY = Math.max(start[1], target[1]);
        this.fields.forEach((field)=>{
            greatestColor = Math.max(greatestColor, fieldColor(field));
            minX = Math.min(minX, field.x);
            maxX = Math.max(maxX, field.x);
            minY = Math.min(minY, field.y);
            maxY = Math.max(maxY, field.y);
        });
        this.#numColors = greatestColor + 1;
        this.#width = maxX + 1 - minX;
        this.#height = maxY + 1 - minY;
        this.#minX = minX;
        this.#maxX = maxX;
        this.#minY = minY;
        this.#maxY = maxY;
    }
    setField(x, y, kind) {
        const newFields = new Map(this.fields);
        newFields.set(fieldId(x, y), {
            x,
            y,
            kind
        });
        return new Level(newFields, [
            this.start[0],
            this.start[1]
        ], [
            this.target[0],
            this.target[1]
        ]);
    }
    deleteField(x, y) {
        const newFields = new Map(this.fields);
        newFields.delete(fieldId(x, y));
        return new Level(newFields, [
            this.start[0],
            this.start[1]
        ], [
            this.target[0],
            this.target[1]
        ]);
    }
    setStart(x, y) {
        if (this.target[0] == x && this.target[1] == y) {
            return this;
        } else {
            const newFields = new Map(this.fields);
            newFields.delete(fieldId(x, y));
            return new Level(newFields, [
                x,
                y
            ], [
                this.target[0],
                this.target[1]
            ]);
        }
    }
    setTarget(x, y) {
        if (this.start[0] == x && this.start[1] == y) {
            return this;
        } else {
            const newFields = new Map(this.fields);
            newFields.delete(fieldId(x, y));
            return new Level(newFields, [
                this.start[0],
                this.start[1]
            ], [
                x,
                y
            ]);
        }
    }
    numColors() {
        return this.#numColors;
    }
    width() {
        return this.#width;
    }
    height() {
        return this.#height;
    }
    minX() {
        return this.#minX;
    }
    maxX() {
        return this.#maxX;
    }
    minY() {
        return this.#minY;
    }
    maxY() {
        return this.#maxY;
    }
    *allWalls() {
        for (const field of this.fields.values()){
            if ("wall" in field.kind) {
                yield {
                    x: field.x,
                    y: field.y,
                    color: field.kind.wall,
                    inverted: field.kind.inverted
                };
            }
        }
    }
    *allToggles() {
        for (const field of this.fields.values()){
            if ("toggle" in field.kind) {
                yield {
                    x: field.x,
                    y: field.y,
                    color: field.kind.toggle
                };
            }
        }
    }
}
function levelFromLevelData(data) {
    const fields = new Map();
    for (const f of data.fields){
        fields.set(fieldId(f.x, f.y), f);
    }
    const lvl = new Level(fields, data.start, data.target);
    return lvl;
}
class Model {
    state;
    constructor(startingState){
        this.state = startingState;
    }
    movePure(xDir, yDir) {
        return doMovePure(this.state, xDir, yDir);
    }
    applyRegularMove(move) {
        for(let color = 0; color < this.state.currentLevel.numColors(); color++){
            this.setColorActivation(color, move.activatedFieldsAfterMove.has(color));
        }
        this.state.currentLevelState.avatar.x = move.newX;
        this.state.currentLevelState.avatar.y = move.newY;
    }
    setColorActivation(color, active) {
        if (active) {
            this.state.currentLevelState.activatedFields.add(color);
        } else {
            this.state.currentLevelState.activatedFields.delete(color);
        }
    }
}
function initialStateOfLevel(lvl) {
    const avatar = {
        x: lvl.start[0],
        y: lvl.start[1]
    };
    const activatedFields = new Set();
    for(let i = 0; i < lvl.numColors(); i++){
        activatedFields.add(i);
    }
    return {
        avatar,
        activatedFields
    };
}
function doMovePure(state, xDir, yDir) {
    const world = state.currentLevelState;
    const move = {
        oldX: world.avatar.x,
        oldY: world.avatar.y,
        newX: world.avatar.x,
        newY: world.avatar.y,
        distance: 0,
        stoppedBy: null,
        won: false,
        xDir,
        yDir,
        activatedFieldsAfterMove: new Set(state.currentLevelState.activatedFields)
    };
    let x = world.avatar.x;
    let y = world.avatar.y;
    while(x >= state.currentLevel.minX() && x <= state.currentLevel.maxX() && y >= state.currentLevel.minY() && y <= state.currentLevel.maxY()){
        x += xDir;
        y += yDir;
        const fid = fieldId(x, y);
        const field = state.currentLevel.fields.get(fid);
        if (field) {
            if ("toggle" in field.kind) {
                move.changedColor = [
                    field.kind.toggle,
                    !state.currentLevelState.activatedFields.has(field.kind.toggle)
                ];
                if (move.activatedFieldsAfterMove.has(field.kind.toggle)) {
                    move.activatedFieldsAfterMove.delete(field.kind.toggle);
                } else {
                    move.activatedFieldsAfterMove.add(field.kind.toggle);
                }
                move.stoppedBy = [
                    x,
                    y
                ];
                break;
            } else {
                if (world.activatedFields.has(field.kind.wall) && !field.kind.inverted || !world.activatedFields.has(field.kind.wall) && field.kind.inverted) {
                    move.stoppedBy = [
                        x,
                        y
                    ];
                    break;
                }
            }
        }
    }
    move.newX = x - xDir;
    move.newY = y - yDir;
    move.distance = Math.abs(move.newX - move.oldX) + Math.abs(move.newY - move.oldY);
    if (move.distance === 0) {
        move.changedColor = undefined;
    }
    if (move.stoppedBy && state.currentLevel.target[0] === move.newX && state.currentLevel.target[1] === move.newY) {
        move.won = true;
    }
    return move;
}
class View {
    currentLevel;
    currentLevelState;
    constructor(initialLevel, initialLevelState){
        this.currentLevel = initialLevel;
        this.currentLevelState = initialLevelState;
    }
}
function kbd(text) {
    const elem = document.createElement("kbd");
    elem.append(text);
    return elem;
}
function p(contents) {
    const elem = document.createElement("p");
    for (const content of contents){
        elem.append(content);
    }
    return elem;
}
const helpMessage = document.createElement("div");
helpMessage.append(p([
    "Press ",
    kbd("w"),
    " ",
    kbd("a"),
    " ",
    kbd("s"),
    " ",
    kbd("d"),
    " or arrow keys to move."
]));
helpMessage.append(p([
    "Press ",
    kbd("u"),
    " to undo a single move, press ",
    kbd("esc"),
    " to restart the current level."
]));
helpMessage.append(p([
    "Press any key to toggle this help message."
]));
const editorHelpMessage = document.createElement("div");
editorHelpMessage.append(p([
    "Click to place tiles. Press ",
    kbd("q"),
    ", ",
    kbd("w"),
    ", or ",
    kbd("e"),
    " to select tile types, press ",
    kbd("1"),
    " to ",
    kbd("6"),
    " to select colors."
]));
editorHelpMessage.append(p([
    "Right-click any wall tile to delete it."
]));
editorHelpMessage.append(p([
    "Press ",
    kbd("s"),
    " to move the start location to the current mouse location. Press ",
    kbd("t"),
    " to move the target location to the current mouse location."
]));
editorHelpMessage.append(p([
    "Press ",
    kbd("p"),
    " to play the level, press ",
    kbd("r"),
    " to return to editing. You can share the URL to let others play it as well."
]));
editorHelpMessage.append(p([
    "Press any other key to toggle this help message."
]));
function compileShader(gl, shaderSource, shaderType) {
    const shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
        throw "could not compile shader:" + gl.getShaderInfoLog(shader);
    }
    return shader;
}
function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        throw "program failed to link:" + gl.getProgramInfoLog(program);
    }
    return program;
}
function fetchFragmentShader(path) {
    return fetch(path).then(async (response)=>{
        if (response.status === 200) {
            return await response.text();
        } else {
            return await Promise.reject();
        }
    });
}
function pushRectanglePositions(arr, lesserX, lesserY, greaterX, greaterY) {
    arr.push(lesserX);
    arr.push(lesserY);
    arr.push(lesserX);
    arr.push(greaterY);
    arr.push(greaterX);
    arr.push(lesserY);
    arr.push(greaterX);
    arr.push(lesserY);
    arr.push(lesserX);
    arr.push(greaterY);
    arr.push(greaterX);
    arr.push(greaterY);
}
function prepareRectangleVAO(gl, vertexShader, clipCoordinates) {
    const positionAttributeLocation = gl.getAttribLocation(vertexShader, "a_position");
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(clipCoordinates), gl.STATIC_DRAW);
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);
    const type = gl.FLOAT;
    gl.vertexAttribPointer(positionAttributeLocation, 2, type, false, 0, 0);
    return vao;
}
function makeU1fSetter(gl, program, name) {
    const loc = gl.getUniformLocation(program, name);
    return (x)=>{
        gl.uniform1f(loc, x);
    };
}
function makeU2fSetter(gl, program, name) {
    const loc = gl.getUniformLocation(program, name);
    return (x, y)=>{
        gl.uniform2f(loc, x, y);
    };
}
class Sizing {
    pxPerSquare;
    bottomLeftSquareAsPx;
    gridOffset;
    input;
    #widthOfSquareClip;
    #heightOfSquareClip;
    constructor(info){
        const minWidthSquares = info.lvl.width() + 2 * info.minMargin;
        const minHeightSquares = info.lvl.height() + 2 * info.minMargin;
        const widthPxPerSquare = Math.floor(Math.min(info.width / minWidthSquares, info.maxPxPerSquare));
        const heightPxPerSquare = Math.floor(Math.min(info.height / minHeightSquares, info.maxPxPerSquare));
        const pxPerSquare = Math.min(widthPxPerSquare, heightPxPerSquare);
        const bottomLeftSquareAsPxX = -0.5 * pxPerSquare * (info.lvl.width() + 2.0 * info.lvl.minX());
        const bottomLeftSquareAsPxY = -0.5 * pxPerSquare * (info.lvl.height() + 2.0 * info.lvl.minY());
        this.pxPerSquare = pxPerSquare;
        this.bottomLeftSquareAsPx = [
            bottomLeftSquareAsPxX,
            bottomLeftSquareAsPxY
        ];
        this.gridOffset = [
            info.width / 2 % pxPerSquare + info.lvl.width() % 2 * pxPerSquare / 2,
            info.height / 2 % pxPerSquare + info.lvl.height() % 2 * pxPerSquare / 2
        ];
        this.#widthOfSquareClip = 2 / (info.width / pxPerSquare);
        this.#heightOfSquareClip = 2 / (info.height / pxPerSquare);
        this.input = info;
    }
    pxToClip([x, y]) {
        return [
            x / (this.input.width / 2),
            y / (this.input.height / 2)
        ];
    }
    pxToSquare(x, y) {
        const relativeTo = this.pxToBottomLeftPx(this.bottomLeftSquareAsPx);
        return [
            Math.floor((x - relativeTo[0]) / this.pxPerSquare),
            Math.floor((y - relativeTo[1]) / this.pxPerSquare)
        ];
    }
    pxToBottomLeftPx([x, y]) {
        return [
            x + this.input.width / 2,
            y + this.input.height / 2
        ];
    }
    widthOfSquareClip() {
        return this.#widthOfSquareClip;
    }
    heightOfSquareClip() {
        return this.#heightOfSquareClip;
    }
    centerOfSquareAsClip(x, y) {
        const [blx, bly] = this.bottomLeftSquareAsPx;
        return this.pxToClip([
            blx + x * this.pxPerSquare + 0.5 * this.pxPerSquare,
            bly + y * this.pxPerSquare + 0.5 * this.pxPerSquare
        ]);
    }
    centerOfSquareAsPx(x, y) {
        const [blx, bly] = this.bottomLeftSquareAsPx;
        return this.pxToBottomLeftPx([
            blx + x * this.pxPerSquare + 0.5 * this.pxPerSquare,
            bly + y * this.pxPerSquare + 0.5 * this.pxPerSquare
        ]);
    }
    squareAsClip(x, y) {
        const [blx, bly] = this.bottomLeftSquareAsPx;
        const bl = this.pxToClip([
            blx + x * this.pxPerSquare,
            bly + y * this.pxPerSquare
        ]);
        const tr = this.pxToClip([
            blx + (x + 1) * this.pxPerSquare,
            bly + (y + 1) * this.pxPerSquare
        ]);
        return [
            bl[0],
            bl[1],
            tr[0],
            tr[1]
        ];
    }
}
class WebglView extends View {
    canvas;
    messages;
    cover;
    actions;
    currentlyDisplayingAMessage;
    gl;
    marginSquares;
    staticState;
    levelState;
    levelAndResolutionState;
    impureState;
    paused;
    shaderSources;
    currentT;
    constructor(initialLevel, initialLevelState, canvas, messages, cover, marginSquares, shaderSources){
        super(initialLevel, initialLevelState);
        this.canvas = canvas;
        this.messages = messages;
        this.cover = cover;
        this.actions = new TimedActionDelay();
        this.currentlyDisplayingAMessage = true;
        this.marginSquares = marginSquares;
        this.gl = canvas.getContext("webgl2");
        if (!this.gl) {
            alert("This requires WebGl2 =(");
            throw "This requires WebGl2 =(";
        }
        this.staticState = null;
        this.levelAndResolutionState = null;
        this.levelState = null;
        this.impureState = {
            avatarPosition: [
                0,
                0
            ],
            colorActivities: new Map(),
            toggleActivities: new Map(),
            previousToggle: {
                t: -9999999999,
                x: 0,
                y: 0,
                color: 0
            },
            won: 0
        };
        this.currentT = 0;
        this.paused = false;
        if (shaderSources) {
            this.shaderSources = shaderSources;
        } else {
            this.shaderSources = null;
        }
    }
    pause() {
        this.paused = true;
        this.messages.innerText = "";
    }
    unpause() {
        this.paused = false;
        requestAnimationFrame((t)=>render(this, t));
    }
    async init() {
        const gl = this.gl;
        gl.clearColor(0.0784, 0.1098, 0.1843, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);
        const vertexShaderSource = `#version 300 es
        in vec4 a_position;
        out vec4 ts;
        
        void main() {
          ts = a_position;
          gl_Position = a_position;
        }
        `;
        const rectVert = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
        if (this.shaderSources === null) {
            const [bgFragSource, wallFragSource, toggleFragSource] = await Promise.all([
                fetchFragmentShader("./background.frag"),
                fetchFragmentShader("./wall.frag"),
                fetchFragmentShader("./toggle.frag")
            ]);
            this.shaderSources = {
                bgFragSource,
                wallFragSource,
                toggleFragSource
            };
        }
        const bgFrag = compileShader(gl, this.shaderSources.bgFragSource, gl.FRAGMENT_SHADER);
        const bgProgram = createProgram(gl, rectVert, bgFrag);
        const wallFrag = compileShader(gl, this.shaderSources.wallFragSource, gl.FRAGMENT_SHADER);
        const wallProgram = createProgram(gl, rectVert, wallFrag);
        const toggleFrag = compileShader(gl, this.shaderSources.toggleFragSource, gl.FRAGMENT_SHADER);
        const toggleProgram = createProgram(gl, rectVert, toggleFrag);
        const bgClips = [];
        pushRectanglePositions(bgClips, -1, -1, 1, 1);
        const bgVao = prepareRectangleVAO(gl, bgProgram, bgClips);
        this.staticState = {
            bgProgram,
            wallProgram,
            toggleProgram,
            bgVao,
            bgSetters: {
                time: makeU1fSetter(gl, bgProgram, "u_time"),
                resolution: makeU2fSetter(gl, bgProgram, "u_resolution"),
                px_per_square: makeU1fSetter(gl, bgProgram, "u_px_per_square"),
                target: makeU2fSetter(gl, bgProgram, "u_target"),
                avatar: makeU2fSetter(gl, bgProgram, "u_avatar"),
                avatar_light_radius: makeU1fSetter(gl, bgProgram, "u_avatar_light_radius"),
                grid_offset: makeU2fSetter(gl, bgProgram, "u_grid_offset"),
                previous_toggle_t: makeU1fSetter(gl, bgProgram, "u_previous_toggle_t"),
                previous_toggle_hue: makeU1fSetter(gl, bgProgram, "u_previous_toggle_hue"),
                previous_toggle_position: makeU2fSetter(gl, bgProgram, "u_previous_toggle_position"),
                won: makeU1fSetter(gl, bgProgram, "u_won")
            },
            wallSetters: {
                time: makeU1fSetter(gl, wallProgram, "u_time"),
                resolution: makeU2fSetter(gl, wallProgram, "u_resolution"),
                px_per_square: makeU1fSetter(gl, wallProgram, "u_px_per_square"),
                hue: makeU1fSetter(gl, wallProgram, "u_hue"),
                activity: makeU1fSetter(gl, wallProgram, "u_activity"),
                center_of_square: makeU2fSetter(gl, wallProgram, "u_center_of_square"),
                avatar: makeU2fSetter(gl, wallProgram, "u_avatar"),
                avatar_light_radius: makeU1fSetter(gl, wallProgram, "u_avatar_light_radius")
            },
            toggleSetters: {
                time: makeU1fSetter(gl, toggleProgram, "u_time"),
                resolution: makeU2fSetter(gl, toggleProgram, "u_resolution"),
                px_per_square: makeU1fSetter(gl, toggleProgram, "u_px_per_square"),
                hue: makeU1fSetter(gl, toggleProgram, "u_hue"),
                activity: makeU1fSetter(gl, toggleProgram, "u_activity"),
                center_of_square: makeU2fSetter(gl, toggleProgram, "u_center_of_square"),
                avatar: makeU2fSetter(gl, toggleProgram, "u_avatar"),
                avatar_light_radius: makeU1fSetter(gl, toggleProgram, "u_avatar_light_radius")
            }
        };
        this.startLevel(this.currentLevel);
        this.unpause();
    }
    displayMessage(msg) {
        if (this.currentlyDisplayingAMessage) {
            if (msg === null) {
                return this.actions.enqueue({
                    duration: 100,
                    cb: (p)=>{
                        this.messages.style.opacity = `${1 - p}`;
                        if (p >= 1) {
                            this.messages.textContent = "";
                            this.currentlyDisplayingAMessage = false;
                        }
                    }
                });
            } else {
                let switchedToFadeOut = true;
                return this.actions.enqueue({
                    duration: 100 * 2,
                    cb: (p)=>{
                        if (p <= 0.5) {
                            this.messages.style.opacity = `${2 * (0.5 - p)}`;
                        } else {
                            if (switchedToFadeOut) {
                                switchedToFadeOut = false;
                                this.messages.textContent = "";
                                this.messages.append(msg);
                            }
                            this.messages.style.opacity = `${2 * (p - 0.5)}`;
                        }
                    }
                });
            }
        } else {
            if (msg === null) {
                return true;
            } else {
                this.messages.append(msg);
                this.currentlyDisplayingAMessage = true;
                return this.actions.enqueue({
                    duration: 100,
                    cb: (p)=>{
                        this.messages.style.opacity = `${p}`;
                    }
                });
            }
        }
    }
    startLevel(level) {
        this.currentLevel = level;
        this.levelState = this.updateLevel(this.currentLevel);
        this.levelAndResolutionState = this.updateLevelAndResolution(this.currentLevel, this.canvas.clientWidth, this.canvas.clientHeight);
        this.impureState.avatarPosition = this.currentLevel.start;
        this.impureState.won = 0;
        const numColors = level.numColors();
        const colorActivities = new Map();
        const toggleActivities = new Map();
        for(let i = 0; i < numColors; i++){
            colorActivities.set(i, 1);
        }
        for (const { x, y } of level.allToggles()){
            toggleActivities.set(`${x}|${y}`, 0);
        }
        this.impureState.colorActivities = colorActivities;
        this.impureState.toggleActivities = toggleActivities;
    }
    updateLevel(level) {
        return {
            numColors: level.numColors(),
            hueOffset: 0
        };
    }
    updateLevelAndResolution(level, width, height) {
        const sizing = new Sizing({
            width,
            height,
            lvl: level,
            maxPxPerSquare: 64,
            minMargin: this.marginSquares
        });
        const wallClips = [];
        for (const { x, y } of level.allWalls()){
            const [lx, ly, gx, gy] = sizing.squareAsClip(x, y);
            pushRectanglePositions(wallClips, lx, ly, gx, gy);
        }
        const wallVao = prepareRectangleVAO(this.gl, this.staticState.wallProgram, wallClips);
        const toggleClips = [];
        for (const { x, y } of level.allToggles()){
            const [lx, ly, gx, gy] = sizing.squareAsClip(x, y);
            pushRectanglePositions(toggleClips, lx, ly, gx, gy);
        }
        const toggleVao = prepareRectangleVAO(this.gl, this.staticState.toggleProgram, toggleClips);
        return {
            sizing,
            wallVao,
            toggleVao,
            targetPosition: sizing.centerOfSquareAsPx(level.target[0], level.target[1])
        };
    }
    hueForColor(color) {
        return (color / this.levelState.numColors * 360 + this.levelState.hueOffset) % 360;
    }
}
function render(view, t) {
    if (view.paused) {
        return;
    }
    view.currentT = t;
    const gl = view.gl;
    const canvas = view.canvas;
    if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        view.levelAndResolutionState = view.updateLevelAndResolution(view.currentLevel, canvas.clientWidth, canvas.clientHeight);
    }
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const avatarPositionPx = view.levelAndResolutionState.sizing.centerOfSquareAsPx(view.impureState.avatarPosition[0], view.impureState.avatarPosition[1]);
    if (view.actions.now === -1) {
        view.actions.now = t;
        view.actions.startedAt = t;
    }
    view.actions.tick(t);
    const avatarLightRadius = 1.7 + Math.sin(14.0 * (t / 10000)) * (1.7 / 15);
    gl.useProgram(view.staticState.bgProgram);
    gl.bindVertexArray(view.staticState.bgVao);
    view.staticState.bgSetters.time(t / 10000);
    view.staticState.bgSetters.resolution(canvas.width, canvas.height);
    view.staticState.bgSetters.px_per_square(view.levelAndResolutionState.sizing.pxPerSquare);
    view.staticState.bgSetters.target(view.levelAndResolutionState.targetPosition[0], view.levelAndResolutionState.targetPosition[1]);
    view.staticState.bgSetters.avatar(avatarPositionPx[0], avatarPositionPx[1]);
    view.staticState.bgSetters.avatar_light_radius(avatarLightRadius);
    view.staticState.bgSetters.grid_offset(view.levelAndResolutionState.sizing.gridOffset[0], view.levelAndResolutionState.sizing.gridOffset[1]);
    view.staticState.bgSetters.previous_toggle_t(view.impureState.previousToggle.t / 10000);
    view.staticState.bgSetters.previous_toggle_hue(view.hueForColor(view.impureState.previousToggle.color));
    const [prevToggleX, prevToggleY] = view.levelAndResolutionState.sizing.centerOfSquareAsPx(view.impureState.previousToggle.x, view.impureState.previousToggle.y);
    view.staticState.bgSetters.previous_toggle_position(prevToggleX, prevToggleY);
    view.staticState.bgSetters.won(view.impureState.won);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.useProgram(view.staticState.wallProgram);
    gl.bindVertexArray(view.levelAndResolutionState.wallVao);
    view.staticState.wallSetters.time(t / 10000);
    view.staticState.wallSetters.resolution(canvas.width, canvas.height);
    view.staticState.wallSetters.px_per_square(view.levelAndResolutionState.sizing.pxPerSquare);
    view.staticState.wallSetters.avatar(avatarPositionPx[0], avatarPositionPx[1]);
    view.staticState.wallSetters.avatar_light_radius(avatarLightRadius);
    let i = 0;
    for (const wall of view.currentLevel.allWalls()){
        const [centerX, centerY] = view.levelAndResolutionState.sizing.centerOfSquareAsClip(wall.x, wall.y);
        view.staticState.wallSetters.center_of_square(centerX, centerY);
        const rawActivity = view.impureState.colorActivities.get(wall.color);
        view.staticState.wallSetters.activity(wall.inverted ? 1 - rawActivity : rawActivity);
        view.staticState.wallSetters.hue(view.hueForColor(wall.color));
        gl.drawArrays(gl.TRIANGLES, i, 6);
        i += 6;
    }
    gl.useProgram(view.staticState.toggleProgram);
    gl.bindVertexArray(view.levelAndResolutionState.toggleVao);
    view.staticState.toggleSetters.time(t / 10000);
    view.staticState.toggleSetters.resolution(canvas.width, canvas.height);
    view.staticState.toggleSetters.px_per_square(view.levelAndResolutionState.sizing.pxPerSquare);
    view.staticState.toggleSetters.avatar(avatarPositionPx[0], avatarPositionPx[1]);
    view.staticState.toggleSetters.avatar_light_radius(avatarLightRadius);
    i = 0;
    for (const toggle of view.currentLevel.allToggles()){
        const [centerX, centerY] = view.levelAndResolutionState.sizing.centerOfSquareAsClip(toggle.x, toggle.y);
        view.staticState.toggleSetters.center_of_square(centerX, centerY);
        view.staticState.toggleSetters.activity(view.impureState.toggleActivities.get(`${toggle.x}|${toggle.y}`));
        view.staticState.toggleSetters.hue(view.hueForColor(toggle.color));
        gl.drawArrays(gl.TRIANGLES, i, 6);
        i += 6;
    }
    requestAnimationFrame((t)=>render(view, t));
}
class TimedActionDelay {
    now;
    startedAt;
    current;
    buffered;
    constructor(){
        this.now = -1;
        this.startedAt = -1;
        this.current = null;
        this.buffered = null;
    }
    enqueue(action) {
        if (this.current === null) {
            this.current = action;
            this.startCurrent();
            return true;
        } else if (this.buffered === null) {
            this.buffered = action;
            return true;
        } else {
            return false;
        }
    }
    forceEnqueue(action) {
        if (this.current === null) {
            this.current = action;
            this.startCurrent();
        } else {
            this.buffered = action;
        }
    }
    tick(t) {
        this.now = t;
        if (this.current !== null) {
            this.current.cb(Math.min(1, (t - this.startedAt) / this.current.duration));
            if (t >= this.startedAt + this.current.duration) {
                this.current = null;
                this.startedAt = -1;
                this.advanceBuffer();
            }
        }
    }
    advanceBuffer() {
        if (this.buffered !== null) {
            this.current = this.buffered;
            this.buffered = null;
            this.startCurrent();
        }
    }
    startCurrent() {
        this.startedAt = this.now;
    }
}
function chainTimedActions(a1, a2) {
    const duration = a1.duration + a2.duration;
    return {
        duration,
        cb: (p)=>{
            if (p <= a1.duration / duration) {
                a1.cb(p * duration / a1.duration);
            } else {
                a2.cb((p - a1.duration / duration) * duration / a2.duration);
            }
        }
    };
}
class WebglEditorView extends WebglView {
    mouseX;
    mouseY;
    constructor(initialLevel, initialLevelState, canvas, messages, cover, shaderSources){
        super(initialLevel, initialLevelState, canvas, messages, cover, 3, shaderSources);
        this.mouseX = 0;
        this.mouseY = 0;
        this.messages.addEventListener("mousemove", (e)=>{
            this.mouseX = e.offsetX;
            this.mouseY = this.canvas.clientHeight - e.offsetY;
        });
    }
    getCurrentSquareOfMouse() {
        return this.levelAndResolutionState.sizing.pxToSquare(this.mouseX, this.mouseY);
    }
    setLevel(lvl) {
        this.startLevel(lvl);
    }
    setColor(_color) {}
    setBrush(_brush) {}
}
function encodeNat(n) {
    if (n >= 0) {
        return `a${n}`;
    } else {
        return `b${-n}`;
    }
}
function encodeField(f) {
    return `${encodeNat(f.x)}${encodeNat(f.y)}${encodeNat(fieldColor(f))}${"toggle" in f.kind ? "e" : f.kind.inverted ? "d" : "c"}`;
}
function encodeLevel(lvl) {
    let enc = `${encodeNat(lvl.start[0])}${encodeNat(lvl.start[1])}${encodeNat(lvl.target[0])}${encodeNat(lvl.target[1])}`;
    for (const f of lvl.fields.values()){
        enc = `${enc}${encodeField(f)}`;
    }
    return enc;
}
function decodeNat(i, enc) {
    let sign = 1.0;
    const firstChar = enc.charAt(i.offset);
    if (firstChar === "b") {
        sign = -1;
    } else if (firstChar !== "a") {
        throw "nope";
    }
    i.offset += 1;
    let abs = 0;
    while(true){
        abs *= 10;
        const nextChar = enc.charAt(i.offset);
        if (nextChar === "0") {
            abs += 0;
        } else if (nextChar === "1") {
            abs += 1;
        } else if (nextChar === "2") {
            abs += 2;
        } else if (nextChar === "3") {
            abs += 3;
        } else if (nextChar === "4") {
            abs += 4;
        } else if (nextChar === "5") {
            abs += 5;
        } else if (nextChar === "6") {
            abs += 6;
        } else if (nextChar === "7") {
            abs += 7;
        } else if (nextChar === "8") {
            abs += 8;
        } else if (nextChar === "9") {
            abs += 9;
        } else {
            return sign * abs / 10;
        }
        i.offset += 1;
    }
}
function decodeField(i, enc) {
    const x = decodeNat(i, enc);
    const y = decodeNat(i, enc);
    const color = decodeNat(i, enc);
    let kind = "wall";
    const nextChar = enc.charAt(i.offset);
    i.offset += 1;
    if (nextChar === "c") {} else if (nextChar === "d") {
        kind = "wallInverted";
    } else if (nextChar === "e") {
        kind = "toggle";
    } else {
        throw "nope";
    }
    return {
        x,
        y,
        kind: kind === "toggle" ? {
            toggle: color
        } : {
            wall: color,
            inverted: kind === "wallInverted"
        }
    };
}
function decodeLevel(i, enc) {
    const start = [
        decodeNat(i, enc),
        decodeNat(i, enc)
    ];
    const target = [
        decodeNat(i, enc),
        decodeNat(i, enc)
    ];
    const fields = new Set();
    while(i.offset < enc.length){
        fields.add(decodeField(i, enc));
    }
    return {
        start,
        target,
        fields
    };
}
function decodeLevelFromString(enc) {
    const i = {
        offset: 0
    };
    return decodeLevel(i, enc);
}
class PlayController {
    levels;
    levelIndex;
    keyEventSource;
    model;
    view;
    currentlyShowingMessage;
    currentlyShowingHelpMessage;
    postLevelMessageIndex;
    undoStack;
    constructor(levels, levelIndex, keyEventSource, view, showHelpAtStart){
        this.levels = levels;
        this.levelIndex = levelIndex;
        if (levelIndex >= levels.ordered.length) {
            throw "Starting levelIndex greater than number of levels";
        }
        this.model = freshModelForLevel(this.levels.ordered[this.levelIndex].level);
        this.view = view;
        this.undoStack = [];
        this.currentlyShowingMessage = false;
        this.currentlyShowingHelpMessage = false;
        this.postLevelMessageIndex = -1;
        this.keyEventSource = keyEventSource;
        this.keyEventSource.addEventListener("keydown", (e)=>{
            if (e.repeat) {
                return;
            }
            if (this.currentlyShowingMessage) {
                this.leaveCurrentMessage();
            } else {
                if (e.key == `Escape`) {
                    this.restartLevel(true);
                } else if (e.key == `u`) {
                    this.undo();
                } else {
                    let undefinedKey = true;
                    let xStep = 0;
                    let yStep = 0;
                    if (e.key == `w` || e.key == `ArrowUp`) {
                        yStep = 1;
                        undefinedKey = false;
                    } else if (e.key == `s` || e.key == `ArrowDown`) {
                        yStep = -1;
                        undefinedKey = false;
                    } else if (e.key == `a` || e.key == `ArrowLeft`) {
                        xStep = -1;
                        undefinedKey = false;
                    } else if (e.key == `d` || e.key == `ArrowRight`) {
                        xStep = 1;
                        undefinedKey = false;
                    }
                    if (undefinedKey && e.key !== `r`) {
                        this.displayMessage(helpMessage, true);
                    } else if (e.key !== `r`) {
                        this.processMove(xStep, yStep);
                    }
                }
            }
        });
        if (showHelpAtStart) {
            this.displayMessage(helpMessage, true);
        } else {
            this.view.displayMessage(null);
        }
        this.view.registerWonGameCb(()=>{
            this.displayMessage("Thank you for playing");
        });
    }
    displayMessage(msg, isHelp) {
        if (this.view.displayMessage(msg)) {
            this.currentlyShowingMessage = true;
            this.currentlyShowingHelpMessage = !!isHelp;
            return true;
        } else {
            return false;
        }
    }
    restartLevel(notifyView) {
        this.model = freshModelForLevel(this.levels.ordered[this.levelIndex].level);
        if (notifyView) {
            this.view.restartLevel();
        }
    }
    leaveCurrentMessage() {
        if (this.currentlyShowingHelpMessage) {
            if (this.view.displayMessage(null)) {
                this.currentlyShowingHelpMessage = false;
                this.currentlyShowingMessage = false;
            }
        } else {
            const messages = this.levels.ordered[this.levelIndex].messages;
            if (this.postLevelMessageIndex + 1 >= messages.length) {
                if (this.view.displayMessage(null)) {
                    this.currentlyShowingMessage = false;
                    this.levelIndex += 1;
                    this.postLevelMessageIndex = -1;
                    if (this.levelIndex >= this.levels.ordered.length) {
                        this.view.nextLevel(null);
                    } else {
                        const nextLevel = this.levels.ordered[this.levelIndex];
                        this.model = freshModelForLevel(nextLevel.level);
                        this.view.nextLevel(nextLevel.level);
                        const urlWithoutParamers = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
                        history.replaceState({}, "", `${urlWithoutParamers}?level=${nextLevel.id}`);
                    }
                }
            } else {
                if (this.displayMessage(messages[this.postLevelMessageIndex])) {
                    this.postLevelMessageIndex += 1;
                }
            }
        }
    }
    processMove(xDir, yDir) {
        const move = this.model.movePure(xDir, yDir);
        if (move.distance > 0) {
            const inverseMove = {
                oldX: move.newX,
                oldY: move.newY,
                newX: move.oldX,
                newY: move.oldY,
                distance: move.distance,
                changedColor: undefined,
                stoppedBy: move.stoppedBy,
                won: false,
                xDir: move.xDir * -1,
                yDir: move.yDir * -1,
                activatedFieldsAfterMove: new Set(move.activatedFieldsAfterMove)
            };
            if (move.changedColor !== undefined) {
                inverseMove.changedColor = [
                    move.changedColor[0],
                    !move.changedColor[1]
                ];
                if (inverseMove.activatedFieldsAfterMove.has(move.changedColor[0])) {
                    inverseMove.activatedFieldsAfterMove.delete(move.changedColor[0]);
                } else {
                    inverseMove.activatedFieldsAfterMove.add(move.changedColor[0]);
                }
            }
            this.undoStack.push(inverseMove);
            if (this.view.renderMove(move)) {
                if (move.stoppedBy) {
                    if (move.won) {
                        this.undoStack = [];
                        this.leaveCurrentMessage();
                    } else {
                        this.model.applyRegularMove(move);
                    }
                } else {
                    this.restartLevel(false);
                }
            }
        }
    }
    undo() {
        const move = this.undoStack.pop();
        if (move !== undefined) {
            if (this.view.renderMove(move, true)) {
                this.model.applyRegularMove(move);
            } else {
                this.undoStack.push(move);
            }
        }
    }
}
function freshModelForLevel(lvl) {
    return new Model({
        currentLevel: lvl,
        currentLevelState: initialStateOfLevel(lvl)
    });
}
class WebglPlayView extends WebglView {
    wonGameCb;
    constructor(initialLevel, initialLevelState, canvas, messages, cover, shaderSources){
        super(initialLevel, initialLevelState, canvas, messages, cover, 0, shaderSources);
        this.wonGameCb = ()=>{};
    }
    registerWonGameCb(cb) {
        this.wonGameCb = cb;
    }
    renderMove(move, isUndoMove) {
        const timePerSquare = 130;
        let moveDuration = move.distance * 130;
        if (isUndoMove && move.stoppedBy === null) {
            let restartedAlready = false;
            return this.actions.enqueue({
                duration: 1000,
                cb: (p)=>{
                    const newP = 1 - Math.abs(p - 0.5) * 2;
                    this.cover.style.opacity = `${easeInOutQuad(newP)}`;
                    if (!restartedAlready && p >= 0.5) {
                        restartedAlready = false;
                        this.impureState.avatarPosition = [
                            move.newX,
                            move.newY
                        ];
                        this.impureState.colorActivities = new Map();
                        for(let color = 0; color < this.currentLevel.numColors(); color++){
                            this.impureState.colorActivities.set(color, move.activatedFieldsAfterMove.has(color) ? 1 : 0);
                        }
                    }
                }
            });
        }
        if (move.changedColor === undefined) {
            let endX = move.newX;
            let endY = move.newY;
            let extraDist = 0;
            if (move.stoppedBy === null) {
                extraDist = 8;
                moveDuration += timePerSquare * extraDist;
                endX += move.xDir * extraDist;
                endY += move.yDir * extraDist;
            }
            let restartedAlready = false;
            return this.actions.enqueue({
                duration: moveDuration,
                cb: (p)=>{
                    if (move.stoppedBy !== null) {
                        this.impureState.avatarPosition = [
                            lerp(move.oldX, endX, easeInOutQuad(p)),
                            lerp(move.oldY, endY, easeInOutQuad(p))
                        ];
                    } else {
                        if (p <= move.distance / (move.distance + extraDist) + 0.5 * (extraDist / (move.distance + extraDist))) {
                            console.log(p);
                            this.impureState.avatarPosition = [
                                lerp(move.oldX, endX, easeInOutQuad(p)),
                                lerp(move.oldY, endY, easeInOutQuad(p))
                            ];
                        } else if (!restartedAlready) {
                            restartedAlready = true;
                            this.startLevel(this.currentLevel);
                        }
                    }
                    if (move.stoppedBy === null && p >= move.distance / (move.distance + extraDist)) {
                        let fadeP = p - move.distance / (move.distance + extraDist);
                        fadeP = fadeP / (extraDist / (move.distance + extraDist));
                        fadeP = 1 - Math.abs(fadeP - 0.5) * 2;
                        this.cover.style.opacity = `${easeInOutQuad(fadeP)}`;
                    }
                }
            });
        } else {
            const toggleId = `${move.stoppedBy[0]}|${move.stoppedBy[1]}`;
            const moveAction = {
                duration: move.distance * 130,
                cb: (p)=>{
                    this.impureState.avatarPosition = [
                        lerp(move.oldX, move.newX, easeInOutQuad(p)),
                        lerp(move.oldY, move.newY, easeInOutQuad(p))
                    ];
                }
            };
            let toggleActionFirstTick = true;
            const toggleAction = {
                duration: 260,
                cb: (p)=>{
                    if (toggleActionFirstTick) {
                        toggleActionFirstTick = false;
                        this.impureState.previousToggle = {
                            t: this.currentT,
                            color: move.changedColor[0],
                            x: move.stoppedBy[0],
                            y: move.stoppedBy[1]
                        };
                    }
                    const activity = easeInOutQuad(p);
                    this.impureState.colorActivities.set(move.changedColor[0], move.changedColor[1] ? activity : 1 - activity);
                    this.impureState.toggleActivities.set(toggleId, easeInOutQuad(2 * (0.5 - Math.abs(p - 0.5))));
                }
            };
            if (isUndoMove) {
                return this.actions.enqueue(chainTimedActions(toggleAction, moveAction));
            } else {
                return this.actions.enqueue(chainTimedActions(moveAction, toggleAction));
            }
        }
    }
    restartLevel() {
        let restartedAlready = false;
        this.actions.forceEnqueue({
            duration: 1000,
            cb: (p)=>{
                const newP = 1 - Math.abs(p - 0.5) * 2;
                this.cover.style.opacity = `${easeInOutQuad(newP)}`;
                if (!restartedAlready && p >= 0.5) {
                    restartedAlready = false;
                    this.startLevel(this.currentLevel);
                }
            }
        });
    }
    nextLevel(nextLevel) {
        const winningAction = {
            duration: 2000,
            cb: (p)=>{
                this.impureState.won = p;
            }
        };
        let startedNextAlready = false;
        const nextLevelAction = {
            duration: 1000,
            cb: (p)=>{
                const newP = 1 - Math.abs(p - 0.5) * 2;
                this.cover.style.opacity = `${easeInOutQuad(nextLevel === null ? 0 : newP)}`;
                if (!startedNextAlready && p >= 0.5) {
                    startedNextAlready = false;
                    if (nextLevel === null) {
                        this.wonGameCb();
                    } else {
                        this.startLevel(nextLevel);
                    }
                }
            }
        };
        if (this.actions.buffered === null) {
            this.actions.forceEnqueue(chainTimedActions(winningAction, nextLevelAction));
        } else {
            this.actions.forceEnqueue(chainTimedActions(this.actions.buffered, chainTimedActions(winningAction, nextLevelAction)));
        }
    }
}
function lerp(v1, v2, p) {
    return v1 + (v2 - v1) * p;
}
function easeInOutQuad(x) {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}
class EditorController {
    eventSource;
    view;
    currentlyShowingHelpMessage;
    lvl;
    encodedLvl;
    brush;
    paintingColor;
    playing;
    constructor(initialLevel, eventSource, view){
        this.view = view;
        this.currentlyShowingHelpMessage = false;
        this.brush = "wall";
        this.paintingColor = 0;
        this.lvl = initialLevel;
        this.encodedLvl = encodeLevel(initialLevel);
        this.playing = null;
        this.eventSource = eventSource;
        this.eventSource.addEventListener("keydown", (e)=>{
            if (e.repeat) {
                return;
            }
            if (this.playing === null) {
                if (this.currentlyShowingHelpMessage) {
                    this.dismissMessage();
                } else {
                    if (e.key == `q`) {
                        this.setBrush("wall");
                    } else if (e.key == `w`) {
                        this.setBrush("wallInverted");
                    } else if (e.key == `e`) {
                        this.setBrush("toggle");
                    } else if (e.key == `p`) {
                        this.startPlaying();
                    } else if (e.key == `1`) {
                        this.handleNumber(0);
                    } else if (e.key == `2`) {
                        this.handleNumber(1);
                    } else if (e.key == `3`) {
                        this.handleNumber(2);
                    } else if (e.key == `4`) {
                        this.handleNumber(3);
                    } else if (e.key == `5`) {
                        this.handleNumber(4);
                    } else if (e.key == `6`) {
                        this.handleNumber(5);
                    } else if (e.key == `s`) {
                        const square = this.view.getCurrentSquareOfMouse();
                        this.changeLevel(this.lvl.setStart(square[0], square[1]));
                    } else if (e.key == `t`) {
                        const square = this.view.getCurrentSquareOfMouse();
                        this.changeLevel(this.lvl.setTarget(square[0], square[1]));
                    } else {
                        this.currentlyShowingHelpMessage = true;
                        this.view.displayMessage(editorHelpMessage);
                    }
                }
            } else {
                if (e.key == `r`) {
                    this.stopPlaying();
                }
            }
        });
        this.eventSource.addEventListener("click", ()=>{
            if (this.playing === null) {
                if (this.currentlyShowingHelpMessage) {
                    this.dismissMessage();
                } else {
                    const square = this.view.getCurrentSquareOfMouse();
                    const kind = this.brush === "toggle" ? {
                        toggle: this.paintingColor
                    } : {
                        wall: this.paintingColor,
                        inverted: this.brush === "wallInverted"
                    };
                    this.changeLevel(this.lvl.setField(square[0], square[1], kind));
                }
            }
        });
        this.eventSource.addEventListener("contextmenu", (e)=>{
            if (this.playing === null) {
                e.preventDefault();
                if (this.currentlyShowingHelpMessage) {
                    this.dismissMessage();
                } else {
                    const square = this.view.getCurrentSquareOfMouse();
                    this.changeLevel(this.lvl.deleteField(square[0], square[1]));
                }
            }
        });
        this.currentlyShowingHelpMessage = true;
        this.view.displayMessage(editorHelpMessage);
    }
    dismissMessage() {
        this.currentlyShowingHelpMessage = false;
        this.view.displayMessage(null);
    }
    setBrush(b) {
        this.brush = b;
        this.view.setBrush(b);
    }
    handleNumber(n) {
        this.paintingColor = n;
        this.view.setColor(n);
    }
    async startPlaying() {
        const view = new WebglPlayView(this.lvl, initialStateOfLevel(this.lvl), this.view.canvas, this.view.messages, this.view.cover, this.view.shaderSources === null ? undefined : this.view.shaderSources);
        await view.init();
        const urlWithoutParamers = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
        history.replaceState({}, "", `${urlWithoutParamers}?play=true&lvl=${this.encodedLvl}`);
        this.view.pause();
        const levels = {
            ordered: [
                {
                    level: this.lvl,
                    id: "l",
                    messages: []
                }
            ],
            byId: new Map()
        };
        levels.byId.set("l", 0);
        const controller = new PlayController(levels, 0, document.body, view, false);
        view.registerWonGameCb(()=>{
            this.stopPlaying();
        });
        this.playing = {
            view,
            controller
        };
    }
    stopPlaying() {
        if (this.playing) {
            this.view.messages.innerHTML = "";
            this.playing.view.pause();
            this.view.unpause();
            this.playing = null;
            const urlWithoutParamers = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
            history.replaceState({}, "", `${urlWithoutParamers}?lvl=${this.encodedLvl}`);
        }
    }
    changeLevel(lvl) {
        this.lvl = lvl;
        this.view.setLevel(this.lvl);
        this.encodedLvl = encodeLevel(lvl);
        const urlWithoutParamers = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
        history.replaceState({}, "", `${urlWithoutParamers}?lvl=${this.encodedLvl}`);
    }
}
const basicInitialLevel = new Level(new Map(), [
    3,
    4
], [
    9,
    4
]);
async function startTheEditor() {
    let initialLevel = basicInitialLevel;
    const params = new URLSearchParams(window.location.search);
    const encodedLvl = params.get("lvl");
    if (encodedLvl) {
        try {
            const decoded = decodeLevelFromString(encodedLvl);
            initialLevel = levelFromLevelData(decoded);
        } catch (_) {}
    }
    const canvas = document.getElementById("glCanvas");
    const cover = document.getElementById("cover");
    const messagesDisplay = document.getElementById("messages");
    const view = new WebglEditorView(initialLevel, initialStateOfLevel(initialLevel), canvas, messagesDisplay, cover);
    await view.init();
    const controller = new EditorController(initialLevel, document.body, view);
    if (params.get("play")) {
        controller.startPlaying();
    }
}
startTheEditor();
