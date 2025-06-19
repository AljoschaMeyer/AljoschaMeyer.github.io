import { Br, Hr, Li, P, Ul } from "macromania-html";
import { Quotes } from "../macros.tsx";

export const some_guiding_principles_on_coding = {
  n: "some_guiding_principles_on_coding",
  htmlTitle: "Principles for Coding",
  title: "Some Guiding Principles on Coding",
  date: new Date(2025, 3, 26),
  summary: `How past me approached coding.`,
  rssLink: `https://aljoscha-meyer.de/posts/some_guiding_principles_on_coding`,
  children: (
    <>
      <Ul clazz="wide">
        <Li>
          Code affects humans, not machines.
        </Li>
        <Li>
          Think through the consequences of design decisions.
        </Li>
        <Li>
          Tradeoffs are everywhere, document them.
        </Li>
        <Li>
          Taking on technical debt should be an informed decision, not the
          default.
        </Li>
        <Li>
          All resources are finite.
        </Li>
        <Li>
          Share, teach, and be taught.
        </Li>
        <Li>
          Don’t hesitate to create and improve your tools.
        </Li>
        <Li>
          Know your complexity bounds and impossibility results.
        </Li>
        <Li>
          Algebraic laws are one honking great idea — let’s do more of those.
        </Li>
        <Li>
          When in doubt, create beauty.
        </Li>
      </Ul>

      <Br />

      <P>
        These principles were the first (and for a long while only) writing on
        my website. When I put them up in 2019, I fully expected to feel ashamed
        for them after a few years’ time. As of now (2025), I think they still
        hold up well.
      </P>

      <P>
        However, coding itself has become less important for me. I do not feel
        sufficiently excited about it anymore to devote landing page space to
        these principles. So away they go, into a remote, rarely-read post.
        Nevertheless, you just found them. Yay!
      </P>

      <P>
        If I wrote these today, I would probably add two more principles — both
        corollaries of{" "}
        <Quotes>all resources are finite</Quotes>, and both imparted to me by
        wise fellow humans:
      </P>

      <Ul>
        <Li>
          Don’t be lazy.
        </Li>
        <Li>
          But also, be kind to yourself.
        </Li>
      </Ul>
    </>
  ),
};
