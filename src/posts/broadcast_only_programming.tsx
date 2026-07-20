import { A, Code, Em, H2, H3, Hr, I, Li, P, Ul } from "macromania-html";
import { Marginale, Sidenote } from "macromania-marginalia";
import { Quotes } from "../macros.tsx";

export const broadcast_only_programming = {
  n: "broadcast_only_programming",
  htmlTitle: "Broadcast-Only Programming",
  title: "Broadcast-Only Programming",
  date: new Date("2026-07-20"),
  summary: `Sketching a new programming language paradigm.`,
  rssLink: `https://aljoscha-meyer.de/posts/broadcast_only_programming/`,
  children: (
    <>
      <P>
        In this post, I try to sketch a new programming paradigm. The premise is
        simple: if the communication primitive of <Em>message-passing</Em>{" "}
        leads to object-oriented programming, then what programming paradigm
        does the communication primitive of <Em>broadcast</Em> lead to?
      </P>

      <P>
        I do not have a fully fledged-out answer, but I have some ideas. I want
        to stress in advance that this is a flight of fancy, <Em>not</Em>{" "}
        an exercise in engineering. There is no clear conclusion waiting for you
        at the end. And while I do believe there can be value in exploring this
        design space, I am not constraining myself by practicality or usefulness
        in this post. Curiosity for curiosity's sake is where it's at.
      </P>

      <H2>Background</H2>

      <P>
        This post requires some rather non-standard background knowledge — both
        to see the value in the central premise, and to serve as points of
        comparison. I will attempt to briefly sketch out my main points of
        references.
      </P>

      <H3>Networking</H3>

      <P>
        While this post is mostly about programming languages, I will start out
        in the domain that inspired these ideas: computer networking.
      </P>

      <P>
        The predominant networking model for most developers is given by the
        internet: point-to-point communication. An IP packet has a single sender
        and a single receiver. UDP and TCP are about pairs of computers
        exchanging messages.
      </P>

      <P>
        On a lower level, many modes of communication do <Em>not</Em>{" "}
        have single receivers, instead they are broadcast model. Classic
        ethernet has each computer send data to all connected machines
        simultaneously. Radio, LoRa, and other wireless technologies are very
        much broadcast-based. As is human speach or writing, for that matter.
      </P>

      <P>
        Over the past years,{" "}
        <A href="https://dmi.unibas.ch/de/personen/christian-tschudin/">
          Christian Tschudin
        </A>{" "}
        has been developing an interesting mind set around this space, starting
        from the assumption that global broadcast is the purest form of
        communication.<Marginale>
          I am probably misrepresenting this or botching it up; my sincere
          apologies to you Christian.
        </Marginale>{" "}
        Because it cannot be achieved in practice, we use other communication
        forms as an approximation: local broadcast, repeaters, pub-sub,
        flooding, point-to-point cables, etc. All of these can be interpreted as
        weakenings of the global broadcast idea; by weakening the primitive it
        becomes more feasible to implement in the real world.
      </P>

      <P>
        The appealing behind this view is that we can start abstracting over the
        messy compromises of networking: simply design your systems in the
        (comparatively) easy-to-reason-about broadcast model, and trust that the
        physical infrastructure will be able to simulate that model sufficiently
        well. This idealised approach removes a whole lot of headaches that
        usually accompany networking.
      </P>

      <P>
        I do no need you, the reader, to fully subscribe to this view. In fact,
        {" "}
        <Em>I</Em>{" "}
        do not completely subscribe to it either. But at the very least, I
        consider it to be <Em>interesting</Em>{" "}
        enough to warrant further exploration.
      </P>

      <H3>Programming Paradigms</H3>

      <P>
        Bla
      </P>
    </>
  ),
};

/*

composition
encapsulation
frequency bands (private ones?)
range
internals
computations
space
triggering broadcasts
mobility
congestion
*/
