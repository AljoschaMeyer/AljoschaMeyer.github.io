import { Expression, Expressions } from "macromaniajsx/jsx-dev-runtime";
import { Html5 } from "macromania-html-utils";
import { CssDependency } from "macromania-previews";
import { ConfigHsection, Hsection } from "macromania-hsection";
import { mutability_and_rot } from "./posts/mutability_and_rot.tsx";
import { Dir, File } from "macromania-outfs";
import { Div, H1, H2, Hr, Li, Ol } from "macromania-html";
import { R } from "macromania-defref";
import { Config } from "macromania-config";
import { ConfigMarginalia } from "macromania-marginalia";
import { Counter, makeNumberingRenderer } from "macromania-counters";

export const posts = (
  <RenderPosts
    posts={[mutability_and_rot]}
  />
);

export type PostProps = {
  htmlTitle?: Expressions;
  n: string;
  title: Expressions;
  wideTitle?: boolean;
  date?: Expressions;
  draft?: boolean;
  children?: Expressions;
};

export function PostTemplate(
  { children, n, title, htmlTitle, draft }: PostProps,
): Expression {
  return (
    <Html5 title={htmlTitle ? htmlTitle : undefined}>
      <CssDependency dep={["base.css"]} />
      <CssDependency dep={["layout.css"]} />
      <CssDependency dep={["post.css"]} />
      <Div id="wrapContent">
        {draft
          ? <H1 clazz="wide">DRAFT, DO NOT SHARE YET PLEASE, THANK YOU =)</H1>
          : ""}

        <Hsection n={n} title={<exps x={title} />}>
          <exps x={children} />
        </Hsection>
      </Div>
    </Html5>
  );
}

function RenderPosts({ posts }: { posts: PostProps[] }): Expression {
  return (
    <>
      <omnomnom>
        <Dir name="posts">
          {posts.map((post) => {
            const headingPreRenderer = makeNumberingRenderer(0, 0);

            const sidenoteCounter = new Counter("sidenote-counter", 0);

            return (
              <Config
                options={[
                  <ConfigHsection
                    titleRenderPre={(ctx, numbering) => {
                      if (numbering.length <= 1) {
                        return "";
                      } else {
                        return <>{headingPreRenderer(ctx, numbering)}{" "}</>;
                      }
                    }}
                  />,
                  <ConfigMarginalia sidenoteCounter={sidenoteCounter} />,
                ]}
              >
                <Dir name={post.n}>
                  <File name="index.html">
                    {PostTemplate(post)}
                  </File>
                </Dir>
              </Config>
            );
          })}
        </Dir>
      </omnomnom>

      {posts.filter((post) => !post.draft).length === 0 ? "" : (
        <>
          <H2 id="posts" clazz="centered">Posts</H2>

          <Ol>
            {posts.filter((post) => !post.draft).map((post) => {
              return (
                <Li>
                  <R n={post.n}>
                    <exps x={post.title} />
                  </R>
                </Li>
              );
            })}
          </Ol>

          <Hr style="margin: 5rem auto;" />
        </>
      )}
    </>
  );
}
