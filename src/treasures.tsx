import { Expression, Expressions } from "macromania";

import { Img, Li, Nav, P, Ul } from "macromania-html";
import { R } from "macromania-defref";
import { Marginale } from "macromania-marginalia";
import { Dir, File } from "macromania-outfs";
import { ResolveAsset } from "macromania-assets";
import { Html5 } from "macromania-html-utils";
import { CssDependency } from "macromania-previews";

export const treasures = (
  <Dir name="treasures">
    <File name="index.html">
      <Html5
        htmlProps={{ lang: "en-GB" }}
        title={<>Treasures</>}
      >
        <CssDependency dep={["base.css"]} />
        <CssDependency dep={["treasures.css"]} />
      </Html5>
    </File>
  </Dir>
);
