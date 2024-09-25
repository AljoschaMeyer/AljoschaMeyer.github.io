export type GameState = {
  levels: Levels;
  currentLevel: LevelWithMeta;
  currentLevelState: LevelState;
  responsive: boolean; // While false, ignore all input.
  ui: UI;
};

export type LevelState = {
  avatar: Avatar;
  activatedFields: Set<number>;
};

export type Avatar = {
  x: number;
  y: number;
};

// Of form `${x}|${y}`.
export type FieldId = string;

export type FieldKind =
  | { toggle: number }
  | {
    wall: number;
    inverted: boolean;
  };

export type Field = {
  x: number;
  y: number;
  kind: FieldKind;
};

export type Level = {
  maxX: number;
  maxY: number;
  fields: Map<FieldId, Field>;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  initiallyActivatedFields: Set<number>;
};

export type LevelWithMeta = {
  level: Level;
  id: string; // used in url to load level directly
  message?: string | HTMLElement; // Displayed above the level
};

export type Levels = {
  ordered: LevelWithMeta[];
  byId: Map<string, number /* index into `ordered` */>;
  gameoverMessage: string; // Displayed after beating the final level
};

export type UI = {
  gameContainer: HTMLElement;
  messageContainer: HTMLElement;
  avatar: HTMLElement;
  fieldContainer: HTMLElement;
};

// How many fields past the level the game UI may extend in each direction.
export const bufferDistance = 3;

export const maxX = 32;
export const maxY = 16;

/// Pixel per field. Must be kept in sync with the css `--ppf` variable.
export const ppf = 32;

/**
 * Compute the field id for a given x and y coordinate.
 */
export function fieldId(x: number, y: number): FieldId {
  return `${x}|${y}`;
}

export function uiUpdateFieldStyles(activated: Set<number>) {
  const sheet = new CSSStyleSheet();
  const rules: string[] = [];

  for (let num = 0; num < 6; num++) {
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
