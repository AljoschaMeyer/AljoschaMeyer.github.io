import { Context } from "macromania";
import { ScriptDependencyInfo } from "macromania-html-utils";
import { Config } from "macromania-config";
import { ConfigPseudocode } from "macromania-pseudocode";
import { ConfigKatex } from "macromania-katex";
import { ConfigHsection } from "macromania-hsection";
import { ConfigPreviews, PreviewScopePushWrapper } from "macromania-previews";
import { ConfigDefref } from "macromania-defref";
import { ConfigWip } from "macromania-wip";
import { Dir, File } from "macromania-outfs";
import { ServerRoot } from "macromania-webserverroot";
import { Assets } from "macromania-assets";
import { Div } from "macromania-html";

import { index } from "./index.tsx";
import { treasures } from "./treasures.tsx";

const ctx = new Context();

const prettyPreviewsInfo: ScriptDependencyInfo = {
  dep: ["pretty_previews.js"],
  scriptProps: { defer: true, type: "module" },
};

const refHighlighting: ScriptDependencyInfo = {
  dep: ["defs.js"],
  scriptProps: { defer: true, type: "module" },
};

const exp = (
  <Config
    options={[
      <ConfigPseudocode
        cssDeps={[{ dep: ["pseudocode.css"] }]}
        jsDeps={[{
          dep: ["pseudocode.js"],
          scriptProps: { defer: true, type: "module" },
        }]}
      />,
      <ConfigKatex stylesheet={["katex.min.css"]} />,
      <ConfigHsection
        titleRenderPre={(ctx, numbering) => {
          return "";
        }}
      />,
      <ConfigPreviews
        previewPath={["build", "previews"]}
        cssDeps={[{ dep: ["index.css"] }]}
        jsDeps={[prettyPreviewsInfo]}
      />,
      <ConfigDefref
        depsCssDef={[]}
        depsJsDef={[prettyPreviewsInfo, refHighlighting]}
        depsCssPreview={[]}
        depsJsPreview={[]}
        depsCssRef={[]}
        depsJsRef={[prettyPreviewsInfo, refHighlighting]}
      />,
      <ConfigWip
        // hideWIP // uncomment this line to hide all WIP annotations and silence the warning
      />,
    ]}
  >
    <Dir name="build">
      <ServerRoot url="">
        <Dir name="assets">
          {/* See https://github.com/worm-blossom/macromania-assets */}
          <Assets input={["src", "assets"]} assets={{}} />
        </Dir>
        <PreviewScopePushWrapper
          wrapper={(_ctx, preview) => {
            return <Div id="wrapContent">{preview}</Div>;
          }}
        >
          {index}
          {treasures}
        </PreviewScopePushWrapper>
      </ServerRoot>
    </Dir>
  </Config>
);

ctx.evaluate(exp);
