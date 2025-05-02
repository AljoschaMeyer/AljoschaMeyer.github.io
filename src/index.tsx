import { Expression, Expressions } from "macromania";

import { A, Div, H, H2, H4, Img, Li, P, Ul } from "macromania-html";
import { File } from "macromania-outfs";
import { ResolveAsset } from "macromania-assets";
import { Html5, ScriptDependencyInfo } from "macromania-html-utils";
import { CssDependency } from "macromania-previews";
import { posts } from "./posts.tsx";

const prettyPreviewsInfo: ScriptDependencyInfo = {
  dep: ["pretty_previews.js"],
  scriptProps: { defer: true, type: "module" },
};

const refHighlighting: ScriptDependencyInfo = {
  dep: ["defs.js"],
  scriptProps: { defer: true, type: "module" },
};

export const index = (
  <File name="index.html">
    <Html5
      htmlProps={{ lang: "en-GB" }}
      title={<>Aljoscha Meyer</>}
    >
      <CssDependency dep={["base.css"]} />
      <CssDependency dep={["index.css"]} />

      {`<!-- Self-contained progress pride flag, can be copy-pasted anywhere. Feel free to do so! -->
  <Div style="background: linear-gradient(to bottom,
  #e40303,
  #e40303 16.66666666666666%,
  #ff8c00 16.66666666666666%,
  #ff8c00 33.33333333333333%,
  #ffed00 33.33333333333333%,
  #ffed00 50%,
  #008026 50%,
  #008026 66.66666666666666%,
  #004dff 66.66666666666666%,
  #004dff 83.33333333333333%,
  #750787 83.33333333333333%,
  #750787 100%);
background-size: 100% 100%;
margin: 2rem auto;
margin-top: 0;
height: 2.5rem;">
    <svg viewBox="0 0 6000 3810" width="512" height="325" xmlns="http://www.w3.org/2000/svg"
      style="height: 100%; width: auto;">
      <Path fill="#613915" d="M0-480 2384 1905 0 4290z" />
      <Path fill="#74d7ee" d="M0 3810 0 0 1912 1905z" />
      <Path fill="#ffafc8" d="M0 3330 0 480 1420 1905z" />
      <Path fill="#fff" d="M0 960l951 945L0 2850z" />
    </svg>
  </Div>`}

      <Div clazz="centered" style="font-size: 2em; text-align: center;">
        Aljoscha Meyer does computer science.
      </Div>
      <Div clazz="centered" style="color: #ddbef2; margin: 0.6rem auto;">
        And sometimes wishes he didn’t.
      </Div>
      <Div clazz="centered">
        (<A clazz="u-email" href="mailto:mail@aljoscha-meyer.de">
          mail@aljoscha-meyer.de
        </A>) (<A href="https://github.com/AljoschaMeyer">Github</A>)
      </Div>

      <Div clazz="columns2">
        <Div>
          <H2>Some Projects</H2>

          <Card
            title="Willow"
            href="https://willowprotocol.org/"
            repo="https://github.com/earthstar-project/willowprotocol.org"
            splash="https://willowprotocol.org/emblem.png"
            splashAlt="A Willow emblem: a stylised drawing of a Willow’s branch tipping into a water surface, next to a hand-lettered display of the word *Willow*."
          >
            <P>
              A peer-to-peer, multi-writer data store.
            </P>
          </Card>

          <Card
            title="Bab"
            href="https://worm-blossom.github.io/bab/"
            repo="https://github.com/worm-blossom/bab"
            splash={["landing", "bab.svg"]}
            splashAlt="A depiction of a Merkle tree, an example of the internals of the family of Bab hash functions."
          >
            <P>
              Specification of a hash function that allows for verified
              streaming, similar to{" "}
              <A href="https://github.com/BLAKE3-team/BLAKE3">BLAKE3</A>’s{" "}
              <A href="https://github.com/oconnor663/bao/blob/master/docs/spec.md">
                Bao
              </A>.
            </P>
          </Card>

          <Card
            title="Reed"
            href="https://worm-blossom.github.io/reed/"
            repo="https://github.com/worm-blossom/reed"
            splash={["landing", "reed.svg"]}
            splashAlt="A depiction of the linking scheme underlying reed."
          >
            <P>
              A{" "}
              <A href="https://arxiv.org/pdf/2308.13836">
                prefix authentication scheme
              </A>{" "}
              that is more efficient than the one used in{" "}
              <A href="https://en.wikipedia.org/wiki/Certificate_Transparency">
                certificate transparency
              </A>. Supersedes{" "}
              <A href="https://github.com/AljoschaMeyer/bamboo">Bamboo</A>.
            </P>
          </Card>

          <Card
            title="Macromania"
            href="https://github.com/worm-blossom/macromania"
            repo="https://github.com/worm-blossom/macromania"
            splash={["landing", "macromania_deco.png"]}
            splashAlt="The macromania logotype, hand-lettered in a slightly manic font."
          >
            <P>
              A macro system for generating plaintext files. Suitable for
              producing{" "}
              <A href="https://github.com/worm-blossom/demo_macromania">
                web-native scientific papers
              </A>{" "}
              such as{" "}
              <A href="https://g-trees.github.io/g_trees/">this one</A>. And the
              website you are currently reading, of course.
            </P>
          </Card>

          <Card
            title="Ufotofu"
            href="https://docs.rs/ufotofu/latest/ufotofu/"
            repo="https://github.com/worm-blossom/ufotofu"
          >
            <P>
              A <A href="https://www.rust-lang.org/">Rust</A>{" "}
              library of abstractions for{" "}
              <A
                href={
                  <ResolveAsset
                    asset={["landing", "lazy_on_principle.pdf"]}
                  />
                }
              >
                lazily producing or consuming sequences
              </A>.
            </P>
          </Card>

          <Card
            title="Seasonal Clock"
            href="https://seasonalclock.org/"
            repo="https://github.com/worm-blossom/seasonal-hours-clock"
            splash={{
              other: (
                <H
                  name="iframe"
                  attrs={{
                    title: "Seasonal Clock",
                    src:
                      "https://seasonalclock.org/?lat=52.31&lon=13.24&offset=2&hl=worm&hl=rabbit",
                    style:
                      "height: 360px; border-radius: 4px; border: 2px solid black;",
                  }}
                />
              ),
            }}
          >
            <P>
              A tool for scheduling meetings across timezones, mapping UTC
              offsets to emoji. Carrying on some of{" "}
              <A href="https://github.com/cinnamon-bun">@cinnamon</A>’s light.
            </P>
          </Card>
        </Div>

        <Div>
          <H2>Some Writing</H2>

          <Card
            title="Geometric Search Trees"
            href="https://g-trees.github.io/g_trees/"
            repo="https://github.com/g-trees/g_trees"
            splash={["landing", "kziptree.svg"]}
            splashAlt="A figure from the paper: a depiction of a 2-zip-tree."
          >
            <P>
              A family of randomized set data structures that generalizes the
              {" "}
              <A href="https://arxiv.org/pdf/1806.06726">zip-trees</A>{" "}
              to work more efficiently in the presence of cache hierarchies.
              G-trees have applications for set fingerprinting and membership
              proofs.
            </P>
          </Card>

          <Card
            title="Range-Based Set Reconciliation"
            href={["landing", "rbsr.pdf"]}
            repo="https://github.com/AljoschaMeyer/rbsr_short"
            splash={["landing", "rbsr.png"]}
            splashAlt="A figure from the paper: the back-and-forth of messages in an example protocol run."
          >
            <P>
              Range-based set reconciliation is a simple approach to efficiently
              computing the union of two sets over a network, based on
              recursively partitioning the sets and comparing fingerprints of
              the partitions to probabilistically detect whether a partition
              requires further work. Several open source projects{" "}
              <A href="https://logperiodic.com/rbsr.html">started</A>{" "}
              <A href="https://www.youtube.com/watch?v=_D_tbAMqADM&list=PLvsg-fc7APc3liifbs3O_gokEIJcFn7Eu">
                considering
              </A>
              <A href="https://cips.ceramic.network/CIPs/cip-124">this</A>{" "}
              <A href="https://willowprotocol.org/specs/3d-range-based-set-reconciliation/index.html#d3_range_based_set_reconciliation">
                algorithm
              </A>.
            </P>
          </Card>

          <Card
            title="Strict Principles for Lazy Sequences"
            href={["landing", "lazy_on_principle.pdf"]}
            repo="https://github.com/AljoschaMeyer/lazy_on_principle"
          >
            <P>
              APIs like iterators, streams, sinks, readers, or writers are all
              APIs for lazily working with potentially infinite sequences of
              items. There is a large number of competing designs, but little
              principled work on evaluating them. Starting from the question of
              how to objectively evaluate such APIs, I derive some instructive
              and useful hierarchies of interfaces for lazily working with
              sequences.
            </P>
          </Card>

          <Card
            title="Better Prefix Authentication"
            href="https://arxiv.org/pdf/2308.15058"
            repo="https://github.com/AljoschaMeyer/pretty_neat_linking_scheme"
            splash={["landing", "slls2.svg"]}
            splashAlt="A figure from the paper: a depiction of the slls-2 linking scheme."
          >
            <P>
              Like{" "}
              <A href="https://datatracker.ietf.org/doc/html/rfc9162">
                certificate transparency logs
              </A>, but more simple and more efficient.
            </P>
          </Card>
        </Div>
      </Div>

      <Div clazz="centered">
        {posts}
      </Div>
    </Html5>
  </File>
);

type CardProps = {
  children: Expressions;
  title: Expressions;
  href: string | string[];
  repo: string;
  splash?: string | string[] | { other: Expressions };
  splashAlt?: Expressions;
};

function Card(
  { children, title, href, repo, splash, splashAlt }: CardProps,
): Expression {
  return (
    <Div clazz="card">
      <Div clazz="cardHeader">
        <H4>
          <A
            href={typeof href === "string"
              ? href
              : <ResolveAsset asset={href} />}
          >
            <exps x={title} />
          </A>
        </H4>
        <A href={repo}>Repo</A>
      </Div>
      {splash === undefined
        ? ""
        : (typeof splash === "object" && "other" in splash
          ? <exps x={splash.other} />
          : (
            <A
              href={typeof href === "string"
                ? href
                : <ResolveAsset asset={href} />}
            >
              <Img
                src={typeof splash === "string"
                  ? splash
                  : <ResolveAsset asset={splash} />}
                alt={<exps x={splashAlt} />}
              />
            </A>
          ))}
      <exps x={children} />
    </Div>
  );
}
