import { Expression, Expressions } from "macromania";

import {
  A,
  Blockquote,
  Code,
  Div,
  Em,
  H1,
  H2,
  H3,
  I,
  Img,
  Li,
  Meta,
  Nav,
  Ol,
  P,
  Pre,
  S,
  Section,
  Title,
} from "macromania-html";
import { Dir, File } from "macromania-outfs";
import { ResolveAsset } from "macromania-assets";
import { Html5 } from "macromania-html-utils";
import { CssDependency, JsDependency } from "macromania-previews";
import { Def } from "macromania-defref";
import { Quotes } from "./macros.tsx";

export const simver = (
  <Dir name="simver">
    <File name="index.html">
      <Html5
        title={<>Simple Versioning</>}
        headContents={
          <>
            <Meta
              name="viewport"
              content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
            />
            <Meta name="author" content="Aljoscha Meyer" />
            <Meta
              name="description"
              content="Simple Versioning spec and website"
            />
          </>
        }
      >
        <CssDependency dep={["simver.css"]} />
        <JsDependency dep={["anchorli.js"]} />

        <Div id="spec">
          <H1 id="sane-versioning-1">Simple Versioning</H1>

          <H2 id="summary">Summary</H2>

          <P>Given a version number NUMBER, increment the:</P>

          <Ol>
            <Li>
              NUMBER version when you make backward-compatible API changes.
            </Li>
          </Ol>

          <P style="margin-top: 1em;">
            Breaking changes result in a new package with new versioning.
          </P>

          <H2 id="introduction">Introduction</H2>

          <P>
            In the world of software management there exists a dreaded notion
            called “<A href="https://Semver.org/#spec-item-8">
              major version updates
            </A>.” A software package breaks its API, and signals this by
            incrementing part of its version number. This pattern projects a
            human need for conceptual continuity onto a computer system. But
            computers have no corresponding notion of continuity.
          </P>

          <P>
            From the perspective of dependency management, a software package is
            solely defined by its API — typcially in prose, sometimes with some
            basic support by a type system. Dependency management cares about
            only one notion regarding such APIs: given an explicitly specified
            package <I>A</I>, can some package <I>B</I>{" "}
            — found through dependency resolution — be substituted for it? The
            answer is “yes” if and only if the API of <I>B</I>{" "}
            is compatible with that of <I>A</I>{" "}
            (where compatibility typically goes beyond what is expressed in a
            type system).
          </P>

          <P>
            As a package evolves, the maintainers release a sequence of
            successively compatible versions. We propose to assign successive
            natural numbers to these releases.
          </P>

          <P>
            We call this system “Simple Versioning.” Under this scheme, version
            numbers and the way they change convey meaning about the underlying
            code and what has been modified from one version to the next.
          </P>

          <P>
            What happens when a package needs a breaking change? You create a
            completely new package with independent versioning. For a dependency
            management system, <I>React version 2.0.0</I> and{" "}
            <I>React version 3.0.0</I>{" "}
            relate to each other in the exact same way as{" "}
            <I>React version 2.0.0</I> and{" "}
            <I>jQuery 2.0.0</I>. There is of course a meaningful difference
            between these two pairs, but this difference should have nothing to
            do with dependency management.
          </P>

          <H2 id="simple-versioning-specification-simver">
            Simple Versioning Specification (SimVer)
          </H2>

          <P>
            <S>
              The key words “MUST”, “MUST NOT”, “REQUIRED”, “SHALL”, “SHALL
              NOT”, “SHOULD”, “SHOULD NOT”, “RECOMMENDED”, “MAY”, and “OPTIONAL”
              in this document are to be interpreted as described in{" "}
              <A href="https://tools.ietf.org/Html/rfc2119">RFC 2119</A>.
            </S>
          </P>

          <P>
            Everything is normative unless indicated otherwise, duh. This is a
            specification.
          </P>

          <Ol>
            <Li>
              <P>
                There is clearly no need to define <I>software package</I> or
                {" "}
                <I>version</I>{" "}
                in a specification for versioning software packages, because
                everybody already knows the one universally agreed-upon meaning
                of these terms.
              </P>
            </Li>
            <Li>
              <P>
                Software packages using Simple Versioning must declare a public
                API. How this is done is out of scope of this specification.
                Good luck.
              </P>
            </Li>
            <Li>
              <P>
                Associated with every release of a package must be exactly one
                version <I>Number</I>, where <I>Number</I>{" "}
                is a natural number (possibly zero).
              </P>
            </Li>
            <Li>
              <P>
                All package releases must happen in a linear order; the version
                numbers must correspond to that linear order.
              </P>
            </Li>
            <Li>
              <P>
                For any two versions <I>Number</I> and <I>Number + 1</I>{" "}
                of the same package, any dependent on version <I>Number</I>{" "}
                must be able to substitute version <I>Number + 1</I>{" "}
                without changing...{" "}
                <I>something</I>? Clearly there will be observable changes on
                {" "}
                <Em>some</Em>{" "}
                level, since the versions are not equal. The exact notion of
                which changes are acceptable is out of scope of this
                specification, and should be communicated by the package
                authors. In advance, please.
              </P>
            </Li>
            <Li>
              <P>
                For human reading or machine processing, encode a version number
                {" "}
                <I>Number</I> as an ASCII decimal number without leading zeros.
              </P>
            </Li>
          </Ol>

          <H2 id="backusnaur-form-grammar-for-valid-simver-versions">
            Backus–Naur Form Grammar for Valid SimVer Versions
          </H2>
          <Pre>
            <Code>
              {`&lt;valid simver&gt; ::= "0" | &lt;positive digit&gt; | &lt;positive digit&gt; &lt;digits&gt;

&lt;digits&gt; ::= &lt;digit&gt; | &lt;digit&gt; &lt;digits&gt;

&lt;digit&gt; ::= "0" | &lt;positive digit&gt;

&lt;positive digit&gt; ::= "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"`}
            </Code>
          </Pre>

          <H2 id="why-use-simple-versioning">Why Use Simple Versioning?</H2>

          <P>
            This is not a new or revolutionary idea. In fact, you probably do
            something{" "}
            <A href="https://semver.org/#why-use-semantic-versioning">
              close to this
            </A>{" "}
            already. The problem is that “close” isn’t good enough. Without
            compliance to some sort of formal specification, version numbers are
            essentially useless for dependency management. By giving a name and
            clear definition to the above ideas, it becomes easy to communicate
            your intentions to the users of your software. Once these intentions
            are clear, flexible (but not too flexible) dependency specifications
            can finally be made.
          </P>

          <P>
            A simple example will demonstrate how Simple Versioning can make
            dependency hell a thing of the past. Consider a library called
            “Firetruck.” It requires a Simply Versioned package named “Ladder.”
            At the time that Firetruck is created, Ladder is at version{" "}
            <I>3</I>. Since Firetruck uses some functionality that was first
            introduced in{" "}
            <I>3</I>, you can safely specify the Ladder dependency as greater
            than or equal to <I>3</I>. Now, when Ladder version <I>4</I> and
            {" "}
            <I>5</I>{" "}
            become available, you can release them to your package management
            system and know that they will be compatible with existing dependent
            software.
          </P>

          <P>
            As a responsible developer you will, of course, want to verify that
            any package upgrades function as advertised. The real world is a
            messy place; there’s nothing we can do about that but be vigilant.
            What you can do is let Simple Versioning provide you with a sane way
            to release and upgrade packages without having to roll new versions
            of dependent packages, saving you time and hassle.
          </P>

          <P>
            If all of this sounds desirable, all you need to do to start using
            Simple Versioning is to declare that you are doing so and then
            follow the rules. Link to this website from your README so others
            know the rules and can benefit from them.
          </P>

          <H2 id="faq">FAQ</H2>

          <H3 id="major-version-names">
            If breaking changes result in new packages, do I need to come up
            with a new name every time?
          </H3>

          <P>
            Yes. Thankfully, we have come up with a simple and deterministic
            algorithm: If you need to do breaking changes to a package called
            {" "}
            <I>Flibble</I>, call the new package{" "}
            <I>Flibble 2</I>, the one after that{" "}
            <I>Flibble 3</I>, and so on. This works great with existing package
            managers, and humans will just call the thing <I>Flibble</I>{" "}
            the whole time (automatically becoming more precise when needed).
          </P>

          <H3 id="minor-vs-patch">
            Without a distinction between preview releases, bug fix releases,
            and feature releases, how will I select the correct policy for
            making all my users automatically and blindly download arbitrary
            code that any future maintainer of any of my (transitive)
            dependencies might ever publish?
          </H3>

          <P>
            The same way you{" "}
            <A href="https://research.swtch.com/vgo-intro#minimal_version_selection">
              should
            </A>{" "}
            without Simple Versioning.
          </P>

          <H3 id="is-there-a-suggested-regular-expression-regex-to-check-a-simver-string">
            Is there a suggested regular expression (RegEx) to check a SimVer
            string?
          </H3>

          <P>
            <Code>0|[1-9]\d*</Code>
          </P>

          <H3 id="embed">
            How can I use Simple Versioning in a world full of Semantic
            Versioning infrastructure?
          </H3>

          <P>
            Semantic Versioning contains a subset which is isomorphic to Simple
            Versioning. To embed a Simple Version <I>Number</I>{" "}
            in a Semantic Versioning system, use the semantic version{" "}
            <I>0.Number.0</I>. This will work for all software using Semantic
            Versioning, the software will be none the wiser!
          </P>

          <H3 id="concurrency">
            Sequential version numbering makes concurrent package updates by
            independent maintainers impossible, because they would assign the
            same version. This precludes truly decentralised,
            eventually-consistent, delay-tolerant software publishing, thus
            implicitly entrenching a status quo that assumes complete
            sovereignty over software packages by a single, privileged author
            (or group of authors who together act as a single logical author).
            How dare you?
          </H3>

          <P>
            Well, nobody else seems to care about this either.
          </P>

          <P>
            But since you just asked, I will lay out some ideas. Instead of
            using successive numbers as version identifiers, you could identify
            versions by a secure hash. This hash should be both over the data of
            the version in question and over the version identifier (i.e., the
            hash) of the previous version, if any. This results in a linked list
            of hashes. (If you absolutely insist, you can also hash in some data
            to distinguish, for example, between patch releases and feature
            releases.)
          </P>

          <P>
            More precisely, this scheme results in a <Em>tree</Em>{" "}
            of hashes: different versions of a package might branch off at the
            same base version. This is great, because it enables concurrent
            creation of new versions, and thus eliminates the need for a
            consensus mechanism between package authors.
          </P>

          <P>
            A typical follow-up question to this kind of design is how to merge
            together concurrently published versions that both have features
            that should be kept. There is an answer which is as obviously
            correct and simple as it is boring: add the combined features on one
            of the concurrent branches, and abandon the other one. Nothing in
            this system benefits from complicating the underlying data
            structures and cryptography by adding merge operators.
          </P>

          <P>
            A tree of versions results in a new challenge: given two versions,
            how do you efficiently determine whether one of them is a
            predecessor of the other? Systems such as{" "}
            <A href="https://worm-blossom.github.io/reed/">Reed</A>{" "}
            allow determining this in logarithmic time, while adding only a
            constant amount of additional data to incorporate into each version
            hash. Even in a peer-to-peer setting where participants might not
            want to store full version histories, peers can enable these
            comparisons by storing only a logarithmically-sized subset of the
            version histories.
          </P>

          <P>
            Such a system of tree-shaped version histories ultimately erodes the
            notion of coherent package identities: anyone can fork off of any
            published version and create their own compatible derivatives. Those
            might be malicious, or shoddy, but this is not problematic, since
            there can be no automatic fetching and installation of the newest
            compatible version anyway (because there <Em>is</Em>{" "}
            no single newest compatible version).
          </P>

          <P>
            You <Em>can</Em>{" "}
            of course establish channels where trusted maintainers can publish
            their <Quotes>official</Quotes>{" "}
            updates, thus restoring the notion of package identities (and linear
            version histories). In high-trust environments, you could even
            subscribe to such channels and automatically resolve to the most
            recent version. To keep things decentralised, delay-tolerant, and
            eventually consistent, I would recommend using{" "}
            <A href="https://aljoscha-meyer.de/posts/mutability_and_rot/index.html#mutability_and_rot_signed_bindings">
              signed bindings
            </A>{" "}
            as the mechanism for assigning a single name to a continuously
            updating package identity.
          </P>

          <P>
            This would be a design for a package manager that is{" "}
            <Em>actually</Em>{" "}
            decentralised, not one that simply relies on centralised package
            authorship and places the data on content-addressed peer-to-peer
            storage. But, you know, this is just an FAQ entry inside a
            specification of questionable seriousness, so probably not worth
            taking seriously.
          </P>

          <H2 id="about">About</H2>

          <P>
            The Simple Versioning specification was originally authored by{" "}
            <A href="https://aljoscha-meyer.de/">
              Aljoscha Meyer
            </A>, a good-for-nothing who didn’t co-found anything.
          </P>

          <P>
            If you’d like to leave feedback, feel free to reach out somehow. If
            that is too much effort, instead hug a person who loves you. Or
            plant a tree, or something.
          </P>

          <H2 id="license">License</H2>

          <P>
            <A href="https://Creativecommons.org/Licenses/by/4.0/">
              Creative Commons ― CC BY 4.0
            </A>
          </P>

          <P>
            This page was adapted from the{" "}
            <A href="https://semver.org">Semver 2.0.0</A> page, released under
            {" "}
            <A href="https://Creativecommons.org/Licenses/by/3.0/">
              Creative Commons ― CC BY 3.0
            </A>.
          </P>
        </Div>
      </Html5>
    </File>
  </Dir>
);
