import { Expression, Expressions } from "macromaniajsx/jsx-dev-runtime";
import { Html5 } from "macromania-html-utils";
import { CssDependency } from "macromania-previews";
import { ConfigHsection, Hsection } from "macromania-hsection";
import { mutability_and_rot } from "./posts/mutability_and_rot.tsx";
import { Dir, File } from "macromania-outfs";
import { A, Div, H1, H2, Hr, Li, Ol, P, Time } from "macromania-html";
import { R } from "macromania-defref";
import { Config } from "macromania-config";
import { ConfigMarginalia } from "macromania-marginalia";
import { Counter, makeNumberingRenderer } from "macromania-counters";
import { some_guiding_principles_on_coding } from "./posts/some_guiding_principles_on_coding.tsx";
import { beatles_collection } from "./posts/beatles_collection.tsx";

export const posts = (
  <RenderPosts
    posts={[
      {
        link: "/simver",
        title: "Simple Versioning Specification",
        date: "2025/05/28",
        draft: true,
      },
      mutability_and_rot,
      beatles_collection,
      some_guiding_principles_on_coding,
      {
        link: "/treasures",
        title: "Treasures",
        date: "2025/04/08",
      },
      {
        link: "/puzzling",
        title: "Puzzling",
        date: "2025/01/01",
      },
    ]}
  />
);

export type PostProps = BlogPost | LinkPost | DefrefablePost;

type BlogPost = {
  htmlTitle?: Expressions;
  n: string;
  title: Expressions;
  wideTitle?: boolean;
  date: Expressions;
  draft?: boolean;
  children?: Expressions;
};

type LinkPost = {
  link: string;
  title: Expressions;
  date: Expressions;
  draft?: boolean;
};

type DefrefablePost = {
  n: string;
  title: Expressions;
  date: Expressions;
  draft?: boolean;
};

export function BlogPostTemplate(
  { children, n, title, htmlTitle, draft }: BlogPost,
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

        <P id="home">
          <A href="/#other">Home</A>
        </P>
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
            if ("n" in post) {
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
                      {BlogPostTemplate(post)}
                    </File>
                  </Dir>
                </Config>
              );
            } else {
              return "";
            }
          })}
        </Dir>
      </omnomnom>

      <H2 id="other" clazz="centered">Other</H2>

      <Div id="postList">
        {posts.filter((post) => !post.draft).map((post) => {
          if ("n" in post) {
            return (
              <>
                <R n={post.n}>
                  <Time>
                    <exps x={post.date} />
                  </Time>
                </R>
                <R n={post.n}>
                  <exps x={post.title} />
                </R>
              </>
            );
          } else {
            return (
              <>
                <A href={post.link}>
                  <Time>
                    <exps x={post.date} />
                  </Time>
                </A>
                <A href={post.link}>
                  <exps x={post.title} />
                </A>
              </>
            );
          }
        })}
      </Div>
    </>
  );
}
