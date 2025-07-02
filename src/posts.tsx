import { Expression, Expressions } from "macromaniajsx/jsx-dev-runtime";
import { Html5 } from "macromania-html-utils";
import { CssDependency } from "macromania-previews";
import { ConfigHsection, Hsection } from "macromania-hsection";
import { mutability_and_rot } from "./posts/mutability_and_rot.tsx";
import { bab_funding } from "./posts/bab_funding.tsx";
import { Dir, File } from "macromania-outfs";
import { A, Div, H1, H2, Hr, Li, Ol, P, Time } from "macromania-html";
import { R } from "macromania-defref";
import { Config } from "macromania-config";
import { ConfigMarginalia } from "macromania-marginalia";
import { Counter, makeNumberingRenderer } from "macromania-counters";
import { some_guiding_principles_on_coding } from "./posts/some_guiding_principles_on_coding.tsx";
import { beatles_collection } from "./posts/beatles_collection.tsx";
import {
  H4,
  RssFeed,
  RssItem,
  Span,
} from "../../macromania_temporary_monorepo/mod.tsx";

export const posts = (
  <RenderPosts
    posts={[
      bab_funding,
      {
        link: "/simver",
        title: "Simple Versioning Specification",
        date: new Date(2025, 4, 28),
        summary:
          `An entirely serious alternative to the semantic versioning specification.`,
        rssLink: `https://aljoscha-meyer.de/simver`,
      },
      mutability_and_rot,
      beatles_collection,
      some_guiding_principles_on_coding,
      {
        link: "/treasures",
        title: "Treasures",
        date: new Date(2025, 3, 8),
        summary:
          `A collection of treasures — works that have been important to me.`,
        rssLink: `https://aljoscha-meyer.de/treasures`,
      },
      {
        link: "/puzzling",
        title: "Puzzling",
        date: new Date(2025, 0, 1),
        summary: `A small puzzling game I once wrote while being sick.`,
        rssLink: `https://aljoscha-meyer.de/puzzling`,
      },
    ]}
  />
);

export type PostProps = BlogPost | LinkPost | DefrefablePost;

type BlogPost = {
  htmlTitle?: Expressions;
  n: string;
  title: string;
  wideTitle?: boolean;
  date: Date;
  summary: string;
  rssLink: string;
  draft?: boolean;
  children?: Expressions;
};

type LinkPost = {
  link: string;
  title: string;
  date: Date;
  summary: string;
  rssLink: string;
  draft?: boolean;
};

type DefrefablePost = {
  n: string;
  title: string;
  date: Date;
  summary: string;
  rssLink: string;
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

      <H2 id="other" clazz="centered">
        <A href="#other">Other</A>
      </H2>

      <Div clazz="centered">
        <Span style="font-size: 0.8em; color: #555555">
          <A href="/rss.xml">RSS Feed</A>
        </Span>
      </Div>

      <RssFeed
        title="Aljoscha's Updates"
        description="Feed of updates to https://aljoscha-meyer.de/"
        name="rss"
        path={{ relativity: 0, components: ["rss.xml"] }}
      >
        <Div id="postList">
          {(() => {
            let i = 0;

            return posts.filter((post) => !post.draft).map((post) => {
              let li: Expression = "";
              i += 1;

              if ("n" in post) {
                li = (
                  <>
                    <H4>
                      <R n={post.n}>
                        <exps x={post.title} />
                      </R>
                    </H4>
                    <R n={post.n}>
                      <Time>
                        <exps x={renderDate(post.date)} />
                      </Time>
                    </R>
                  </>
                );
              } else {
                li = (
                  <>
                    <H4>
                      <A href={post.link}>
                        <exps x={post.title} />
                      </A>
                    </H4>
                    <A href={post.link}>
                      <Time>
                        <exps x={renderDate(post.date)} />
                      </Time>
                    </A>
                  </>
                );
              }

              return (
                <Div clazz="card">
                  <Div clazz="cardHeader">
                    <exps x={li} />
                  </Div>
                  <P>
                    <RssItem
                      name={`rss_${i}`}
                      title={post.title}
                      pubDate={post.date}
                      link={post.rssLink}
                    >
                      {post.summary}
                    </RssItem>
                  </P>
                </Div>
              );
            });
          })()}
        </Div>
      </RssFeed>
    </>
  );
}

function renderDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}
