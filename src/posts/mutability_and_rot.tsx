import { A, Br, Code, Em, I, Li, P, Strong, Ul } from "macromania-html";
import { Marginale, Sidenote } from "macromania-marginalia";
import { Hsection } from "macromania-hsection";
import { Quotes } from "../macros.tsx";
import { ResolveAsset } from "macromania-assets";
import { R } from "macromania-defref";

export const mutability_and_rot = {
  draft: true,
  n: "mutability_and_rot",
  htmlTitle: "On Link Rot",
  title: "Distributed Mutability Without Link Rot",
  date: "2025/04/13",
  children: (
    <>
      <P>
        The web suffers from{" "}
        <A href="https://en.wikipedia.org/wiki/Link_rot">link rot</A>:
        hyperlinks that were valid upon creation will often point into
        nothingness after some time has passed. Within the framework of the web,
        the typical{" "}
        <Sidenote
          note={
            <>
              This is not a <Em>true</Em>{" "}
              solution, since a link to the internet archive can rot just like
              any other link. The archivists best intentions do not protect
              against{" "}
              <A href="https://blog.archive.org/2024/10/21/internet-archive-services-update-2024-10-21/">
                targeted attacks to bring down their servers
              </A>.
            </>
          }
        >
          solution
        </Sidenote>{" "}
        is to link to a snapshot of the original page, hosted on{" "}
        <A href="https://archive.org/">archive.org</A>.
      </P>

      <P>
        The only foolproof solution is to forego hyperlinks to other servers,
        and to instead{" "}
        <Sidenote
          note={
            <>
              I deliberately ignore dynamically generated content. I wish to
              discuss interlinked data evolving over time, not
              computation-as-a-service.
            </>
          }
        >
          copy
        </Sidenote>{"  "}
        their data onto your own server. The obvious inefficiencies — especially
        once everyone does this and copying some site would involve recursively
        copying everything that <Em>it</Em>{" "}
        had previously copied — can be neatly solved by employing{" "}
        <A href="https://en.wikipedia.org/wiki/Content-addressable_storage">
          content-addressing
        </A>: you link to some data by giving its{" "}
        <A href="https://en.wikipedia.org/wiki/Cryptographic_hash_function">
          secure hash
        </A>, and the software transparently fetches, caches, and deduplicates
        the data. This is essentially the pitch of the{" "}
        <A href="https://en.wikipedia.org/wiki/InterPlanetary_File_System">
          IPFS
        </A>.
      </P>

      <P>
        But if sufficiently efficient verbatim inclusion of data became{" "}
        <Em>the</Em>{" "}
        mechanism for hyperlinking, something would be lost. When I link to{" "}
        <A href="https://gwil.garden/">a friend’s website</A>, I know that
        readers will always get the up-to-date version. A snapshot of that page
        at the time of publishing this piece would be stale and incomplete for
        the majority of readers.
      </P>

      <P>
        Personal websites, blogs and microblogging, forums, image boards, and
        the connections between all of these — indeed most facets of the web
        that make it feel worthwhile, alive, and human to me — rely on the
        active mutation of content. Whenever a project promises to deliver{" "}
        <Quotes>the immutable web</Quotes>, I internally replace those words
        with{" "}
        <Quotes>censorship-resistant collections of data sets</Quotes>. Those
        are a worthwhile engineering feat in their own, but they can never
        become a worthy successor of the web.
      </P>

      <P>
        A quick look at the current landscape of popular distributed systems can
        make this look like a dilemma: while many systems introduce mutability,
        these projects seem to invariably be plagued by link rot. It seems like
        either you embrace active mutability at the cost of passive link
        rot,<Marginale>
          Active mutation might invalidate links when the author deliberately
          removes a page, but I do not consider this link rot. Link rot stems
          from inaction, not from delibarately exercised agency. The latter I
          consider a feature, not a bug.
        </Marginale>{" "}
        or you eliminate passive link rot at the cost of active mutability.
      </P>

      <P>
        That would be a wrong conclusion, there do exist well-known techniques
        that allow for productive mutability without suffering from link rot. In
        this post, I want to provide a brief overview of the problem space, to
        serve as a foundation for future system designs.
      </P>

      <Hsection
        n="mutability_and_rot_immutable_names"
        title="Names and (Im)mutability"
      >
        <P>
          Data is, by definition, immutable. You cannot <Em>change</Em>{" "}
          the string{" "}
          <Code>"Hello World!"</Code>, just like you cannot change the number
          17. Neither can you change the source code of this website, it just
          {" "}
          <Em>is</Em>. When we talk about mutability in computer science, we
          mean something else: we map some identifier (a{" "}
          <I>name</I>) to some data, and later, we might map the same identifier
          to different data. The variable <Code>my_favourite_string</Code>{" "}
          might first be mapped to <Code>"Hello World!"</Code>, and later to
          {" "}
          <Code>"I love you"</Code>. On the web, URLs take on the role of these
          names.
        </P>

        <P>
          In programming, the simplemost case of names ist not used for
          mutability, but merely to make working with large values (or the
          results of complex computations) easier. Many programming languages
          offer deliberately <Em>immutable</Em>{" "}
          bindings from names to values: you give a name to some expression, and
          you are not allowed to reassign that name to any other expression. As
          a consequence, you can now use the name and the expression{" "}
          <Sidenote
            note={
              <>
                Repeatedly replacing all occurrences of a name with the data to
                which it was bound is the{" "}
                <A href="https://en.wikipedia.org/wiki/Lambda_calculus#Substitution">
                  core operation
                </A>{" "}
                of the{" "}
                <A href="https://en.wikipedia.org/wiki/Lambda_calculus">
                  lambda calculus
                </A>, one of the oldest formal models of computation.
              </>
            }
          >
            interchangeably
          </Sidenote>. There are computational and notational benefits compared
          to copy-pasting the same complex expressions over and over: it
          suffices to evaluate the expression only once and to then reuse the
          result; and programs become shorter. But semantically, there is no
          difference.
        </P>

        <P>
          Content-addressing implements an analogous concept: referencing some
          data by its name is convenient and efficient, but otherwise
          semantically equivalent to supplying a verbatim copy of the referenced
          data. The notion of deleting data that somebody else is referencing
          makes little sense; if the other person had copied your data verbatim
          into their own data, you would not expect to be able to selectively
          delete those sections either. Another obvious technical limitation is
          the impossibility of cyclic{" "}
          <Sidenote
            note={
              <>
                A challenge to the programming language theory enthusiasts: it
                seems fair to draw a parallel between cyclic immutable
                references and mutually recursive functions. The lambda calculus
                does not look like it would support recursion, let alone mutual
                recursion, but along come{" "}
                <A href="https://en.wikipedia.org/wiki/Fixed-point_combinator">
                  fixpoint combinators
                </A>{" "}
                and suddenly you get surprisingly close. What is an analogous
                concept for cyclic references in content-addressed hypertext
                systems?
              </>
            }
          >
            references
          </Sidenote>.
        </P>
      </Hsection>

      <Hsection
        n="mutability_and_rot_web"
        title="Names on the Web"
      >
        <P>
          The hyperlinks of the web, in contrast, implement <Em>mutable</Em>
          {" "}
          mappings — clicking on the same link on different days can yield
          different results. The process from clicking a link to obtaining the
          data is quite involved, but for this discussion we can simplify it
          down to two separate steps: first, a URLs is resolved into an IP
          address, and second the machine running at that address is contacted
          and asked for its data.
        </P>

        <P>
          Translation of a URL into an IP address — performed by the{" "}
          <A href="https://en.wikipedia.org/wiki/Domain_Name_System">
            Domain Name System (DNS)
          </A>{" "}
          —{" "}
          <Sidenote
            note={
              <>
                Technically, the DNS can also be used to implement mutability,
                by mapping equal URLs to IP addresses serving different content.
                Using this mechanism for updating content is so unidiomatic that
                we will disregard it.
                <Br />The DNS can also be used for optimisations like mapping
                the same URL to different IP addresses serving identical data,
                based on physical proximity to the requestor. These
                optimisations do not meaningfully change the conceptual model,
                so I abstract over them.
              </>
            }
          >
            primarily
          </Sidenote>{" "}
          serves to make the names of the web human-friendly. Working with{" "}
          <Code>2001:df2:e500:ed1a::1</Code>{" "}
          is a lot less convenient than working with <Code>wikipedia.org</Code>.
        </P>

        <P>
          Unfortunately, human-readable names are a scarce and quite valuable
          resource. The DNS rents out names on a per-year basis. When you stop
          paying for the mapping to be maintained, all links to your site will
          stop working. This all but guarantees link rot! From this, we can
          derive several related but not quite equivalent necessary conditions
          for avoiding link rot:<Marginale>
            Petname systems make for an example of how to introduce
            human-friendly names without inducing link rot. A{" "}
            <I>petname</I>, to sketch a rough definition, is any name that a
            user actively assigns for their own use — think the name you give to
            a contact on your phone. Petnames are inherintly subjective, though
            their assignment could in principle be delegated instead of being
            carried out manually.
            <Br /> See also:{" "}
            <A href="https://en.wikipedia.org/wiki/Zooko%27s_triangle">
              Zooko’s Triangle
            </A>.
          </Marginale>
        </P>

        <Ul>
          <Li>Do not rent out names.</Li>
          <Li>Do not make name resolution dependent on scarce resources.</Li>
          <Li>Do not tie name resolution to real-world time.</Li>
        </Ul>

        <P>
          On the web, after the DNS has resolved a URL into an IP address, the
          second phase of name resolution takes place: the user agent contacts
          the server running at the given IP address, and the server returns the
          data it stores at that point in time. This is the primary mechanism
          for mutability on the web: the same server can store and return
          different data at different points in time.
        </P>

        <P>
          This approach to mutability is closely analogous to that in
          (imperative) programming: a variable name compiles down to a physical
          memory address on a computer. Whenever a program access the value of a
          variable, the computer supplies the current value stored at the
          corresponding address.
        </P>

        <P>
          In a distributed system, location-based name resolution unfortunately
          leads to link rot.<Marginale>
            Like the web, the{" "}
            <A href="https://en.wikipedia.org/wiki/Fediverse">Fediverse</A>{" "}
            runs on location-based mutability (as well as DNS). I will be sad to
            watch large patches of it be swallowed by link rot over the next
            decades.
          </Marginale>{" "}
          The server running at the location needs constant attention (or, at
          the very least, power), or it will be unable to supply data. Attackers
          or accidents might shut down the server. And censorship could prevent
          communication with the server.
        </P>
      </Hsection>

      <Hsection
        n="mutability_and_rot_signed_bindings"
        title="Signed Bindings"
      >
        <P>
          A different approach to name-based mutability is what I will{" "}
          <Sidenote
            note={
              <>
                I have first encountered this technique in{" "}
                <A href="https://scuttlebutt.nz/">Secure Scuttlebutt</A> and
                {" "}
                <A href="https://earthstar-project.org/">Earthstar</A>; the{" "}
                <A href="https://specs.ipfs.tech/ipns/ipns-record/">IPNS</A>
                {" "}
                cites the{" "}
                <A href="https://en.wikipedia.org/wiki/Self-certifying_File_System">
                  Self-certifying File System
                </A>. It seems safe to say that this technique has been and will
                be reinvented several times, but I am not aware of a common name
                for it. So I am giving it one simply to make writing this post
                more convenient.
              </>
            }
          >
            call
          </Sidenote>{" "}
          <I>signed bindings</I>. A name is simply the public key of a{" "}
          <A href="https://en.wikipedia.org/wiki/Digital_signature">
            digital signature scheme
          </A>. An author binds data to the name by signing the concatenation of
          the{" "}
          <Sidenote
            note={
              <>
                A straightforward optimisation is to sign a secure hash of the
                data instead.
              </>
            }
          >
            data
          </Sidenote>{" "}
          and a timestamp. When the same author binds different data to the same
          identifier, the binding with the greater timestamp wins. Services that
          provide name resolution cannot present fraudulent data, because they
          cannot forge the signature that the requestor will verify. The worst
          they can do is to deliberately present outdated data — but <Em>no</Em>
          {" "}
          system can force other actors to always divulge (new) data anyway.
        </P>

        <P>
          I use <I>timestamp</I>{" "}
          in a wide sense here, anything that allows for tie-breaking between
          competing bindings works. A non-exhaustive selection of choices:
        </P>

        <Ul>
          <Li>
            A wall-clock timestamp (<A href="https://earthstar-project.org/">
              Earthstar
            </A>).
          </Li>
          <Li>
            A logical counter
            (<A href="https://specs.ipfs.tech/ipns/ipns-record/">
              IPNS
            </A>).<Marginale>
              The IPNS gives bindings a time-to-live, and the default resolution
              substrate limits it to 48 hours. This engineering concession sadly
              results in aggressive link rot.
            </Marginale>
          </Li>
          <Li>
            A secure hash of the previous binding
            (<A href="https://scuttlebutt.nz/">Secure Scuttlebutt</A>).
          </Li>
          <Li>
            A secure hash of two previous bindings
            (<A href="https://worm-blossom.github.io/reed/">Reed</A>).
          </Li>
          <Li>A secure hash of a block in a blockchain.</Li>
          <Li>
            A date on which you placed a secure hash of the data as an
            advertisement in the{" "}
            <A href="https://en.wikipedia.org/wiki/The_New_York_Times">
              New York Times
            </A>.
          </Li>
        </Ul>

        <P>
          The choice of timestamps can have some far-reaching consequences. One
          aspect of particular interest are single-writer versus multi-writer
          properties. With wall-clock timestamps,<Marginale>
            We have a discussion of the consequences of using claimed wallclock
            timestamps on the{" "}
            <A href="https://willowprotocol.org/more/timestamps-really/index.html">
              Willow page
            </A>.
          </Marginale>{" "}
          multiple devices can publish data without needing significant
          coordination (beyond keeping their clocks in rough sync). With logical
          counters, when two devices publish new data logically concurrently,
          tiebreaking is needed, and that tiebreaking probably does not always
          align with user intuition about the passage of physical time.
          Timestamps based on hash chains enforces mutually exclusive write
          access to publish updates — concurrent writes can be detected, and
          typically <A href="https://arxiv.org/pdf/2307.08381">invalidate</A>
          {" "}
          the name.
        </P>

        <P>
          Beyond implying{" "}
          <Sidenote
            note={
              <>
                Running a distributed mutual-exclusion protocol to manage
                multiple writers on different physical devices essentially
                converts them into a single logical writer.
              </>
            }
          >
            single-writer
          </Sidenote>{" "}
          systems, another important facet of hash chains is that they only
          allow for non-destructive mutation. Given that inclusion of a secure
          hash is semantically equivalent to including the hashed data verbatim,
          such name bindings only ever append new data, while keeping around all
          old data.
        </P>

        <P>
          Other properties of signed bindings do not depend on the specific
          choice of timestamps. A fundamental one is that names do not include
          any information on how to resolve them — in contrast to an address
          which essentially <Em>is</Em>{" "}
          the relevant information how to resolve it. Systems built on signed
          bindings need to provide infrastructure for name
          resolution,<Marginale>
            I drafted quite a few paragraphs of detailed discussion, before
            deciding this should be left out of scope of this post.
          </Marginale>{" "}
          such as{" "}
          <A href="https://en.wikipedia.org/wiki/Distributed_hash_table">
            distributed hash tables (DHTs)
          </A>{" "}
          or{" "}
          <A href="https://en.wikipedia.org/wiki/Gossip_protocol">
            gossip protocols
          </A>.
        </P>

        <P>
          Resilient name resolution of signed bindings always builds on the fact
          that data need not be served by the original author: everyone can
          verify the signature for the bound data, so there is no need to trust
          the peer who gives you the data. The introduction of such
          intermediaries does open up questions of freshness. Did you get the
          newest data bound to the name, or is the data stale?{" "}
          <Sidenote
            note={
              <>
                A prominent exception is{" "}
                <A href="https://en.wikipedia.org/wiki/Nostr">Nostr</A>, which
                goes for best-effort delivery with no formal consistency model.
              </>
            }
          >
            Typically
          </Sidenote>, systems aim for eventual consistency, where all peers
          will eventually obtain the most up-to-date data once updates stop and
          the system keeps running long enough.
        </P>

        <P>
          While resolving an address and contacting a server directly may feel
          like a stronger guarantee of recency, you can never know whether the
          server did not happen to update its data immediately after serving
          your request.<Marginale>
            The naming model I discuss in this post is purely pull-based.
            Efficient systems should probably incorporate push-based solutions
            (subscriptions to binding updates) as well.
          </Marginale>{" "}
          So you cannot ever be certain to be fully up-to-date in address-based
          settings either. And with enough engineering effort, you can reduce
          the delay in name resolution in signed-binding systems quite far as
          well. In particular, such a system could annotate its names with the
          (IP) address of a recommended data source(s) to contact for
          resolution.<Marginale>
            More broadly speaking, there is always an engineering space where
            you can overlay centralised architectures over a decentralised
            system to achieve certain optimisations. The important part is to
            make absolutely sure that things will continue to work when the
            centralised components fail.
          </Marginale>{" "}
          Such a system would have all the advantages of regular address-based
          systems while the recommended server(s) are online, while still
          failing gracefully to a slower but more resilient resolution mechanism
          to prevent link rot.
        </P>

        <P>
          When everyone can serve data to everyone else, the responsibility for
          keeping data around is diluted. In this sense, no system can fully
          prevent link rot: when the last remaining copy of some data is lost,
          it cannot be retrieved any longer. But, conceptually, each{" "}
          <Em>binding</Em>{" "}
          itself lasts as long as the digital signature scheme remains secure.
        </P>

        <P>
          <Marginale>
            For every proposal to add content-addressing to the Fediverse to
            move beyond reliance on individual instances (i.e., addressed
            locations), there could be an equivalent proposal championing signed
            bindings.
          </Marginale>
          Perhaps curiously, signed bindings share much the same challenges as
          systems based on content-addressing. Both deal in names that are not
          human-readable, and both deal in names that carry no information in
          how to resolve them. I find it fair to say that <Em>if</Em>{" "}
          content-addressed systems can be made to work at{" "}
          <Sidenote
            note={
              <>
                Did you know that{" "}
                <Quotes>
                  a dominant global system used by pretty much everyone, their
                  dog, and their dog’s dozens of{" "}
                  <A href="https://en.wikipedia.org/wiki/Internet_of_things">
                    IoT
                  </A>{" "}
                  devices
                </Quotes>{" "}
                is not the only scale worth running systems at?
              </>
            }
          >
            scale
          </Sidenote>, so can systems based on signed bindings.
        </P>

        <P>
          There is a lot more design space for naming systems which enable
          mutation. Some examples:
        </P>

        <Ul>
          <Li>
            Who should get to resolve names? Can everyone resolve everything, or
            is it possible to introduce some level of access control?
          </Li>
          <Li>
            Should names carry additional structure?{" "}
            <A href="https://willowprotocol.org/">Willow</A>,<Marginale>
              Willow can also mediate access control via this structure.
            </Marginale>{" "}
            for example, arranges names in a three-dimensional space, and then
            allows for spacial queries to resolve names in bulk.
          </Li>
          <Li>
            Are there decentralised, rot-resistent techniques beyond signed
            bindings?
          </Li>
        </Ul>

        <P>
          But for now, I hope to have provided a useful overview of the basics.
        </P>

        {/* immutable has the advantage of "being done" at some point */}

        {
          /* //     <>
        //       Actually, the content you link to still needs to be stored{" "}
        //       <Em>somewhere</Em>{" "}
        //       for it to be resolvable. In principle, any entity that stores a
        //       document can also store everything that this document
        //       (transitively) links to. <Em>Surely</Em>{" "}
        //       that is completely feasible and will never run into any resource
        //       limits.
        //     </> */
        }
      </Hsection>

      <Hsection
        n="mutability_and_rot_important"
        title="The Actually Important Questions"
      >
      </Hsection>

      <P>
        <Marginale>
          I am channeling{" "}
          <A href="https://en.wikipedia.org/wiki/Joseph_Weizenbaum">
            Joseph Weizenbaum
          </A>{" "}
          in his radiant <R n="computer_power_and_human_reason" /> here.
        </Marginale>
        <Marginale>
          I am also channeling{" "}
          <A href="https://shiba.computer/">Cade Diehm</A>, whose writing has
          influenced how I approach systems design and who gave me immensely
          helpful feedback on an early draft of this post.
        </Marginale>
        The previous sections were purely technical, they discussed what{" "}
        <Em>can</Em> be done. Much more important, though, is what{" "}
        <Em>should</Em>{" "}
        be done. I personally believe strongly that we need resilient systems
        that do not suffer from link rot yet allow for active mutation. And I am
        unhappy how much of the time, energy, and resources that go into
        research and development of resilient systems go into systems with no or
        purely non-destructive notions of mutability.
      </P>

      <P>
      </P>

      {
        /*

- yay immutability: censorship-resistence, archiving [marginale: my argumentation will draw on the assumtion of having mutability without link rot, otherwise I would "lose" on both archiving and censorship-resistence ends]
- should be *a* tool in the "system of the future", but should not be considered defining
- there are negative consequences to making this defining, i.e. to make links immutable by default (just as if everyone was copy-pasting by default)
- mutable links leave agency with the author [marginale on fridge notes vs default way of access]
- by using a mutable link, you voluntarily cede control; this creates interdependence and requires trust
- these are deeply human things and they sit at the root of the most positive relationships
- I'd rather immerse myself (and have others immerse themselves) in a medium that reinforces these notions, instead of a medium that tries to eliminate them
- such a medium also teaches an important lesson: trust is never forced, you *can* choose to copy-paste (or content-address) after all
- alternativeless or forced trust is a hollow shell and not-a-great-thing
- drawing the conclusion that all trust should be eliminated is quite a sad thing; instead we should eliminate coerced trust while simultaneously maximising opertunities for voluntarily granting meaningful trust

- note: I am not being comprehensive here, I merely try to convey how I feel and why
- there are tons of other important issues. vulnerability, forgiveness, lies and manipulation, ...
- the important part is that we have these discussions
- the systems we design are not neutral, neither politically nor socially
- when I see a new project that does not acknowledge this and communicates where it stands on these questions, I'm not going to go near to it. It might be impressive in what it *can* do, but anyone who does not stop to think whether they *should* be doing it should not get support.

- end with powerful final statement and call to action

      */
      }

      <P>
        TODO arrange my thoughts, write them down...
      </P>
    </>
  ),
};

////////
////////
////////

// Publishing something on the web always sacrifices <Em>some</Em>
// {" "}
// agency over the data: whoever consumes the data can take a
// screenshot and put it on their fridge, and no computer protocol
// will allow the author to remove that printout. But an author
// always retains control over the default way of accessing the data,
// which will be followed by the vast majority of future visitors.

// A mutable link to your own stuff is under your control and thus exempt from discussions of link rot, but a mutable link to somebody else's stuff is giving up control, depending on them. these mutable links create interdependence, which is deeply human. removing mutable links makes the web not only less expressive but less humane

// from the lens of "cypherlinks are merely copy-pasting", SSB is an incredibly naive system (and a restrictive one, since you can't omit the copy-pasting of anything even if you want to), but one that communicates quite different expectations to (lay) users. Storytelling and teaching and perspectives matter! (also: when telling stories, make clear who gets to resolve names!)

// discussion: signatures already dangerous?

//
//
//

// Cade:
// =====

// Through an engineer's lens, you are strongly defending authorial
// agency, but you don't fully wrestle with how that agency is itself
// contested in practice. There’s a huge dierence between deleting your
// blog post and retroactively erasing material that has public value (or
// harm). The defense of “active mutation” needs more nuance,
// particularly in the current climate where revision, deletion, and
// ephemerality can themselves be part of soft power, manipulation, or
// escape from accountability.

// Are there situations where mutability is undesirable? Can we design
// systems where authors retain agency without enabling denialism or
// revisionist erasure? What are these implications for your proposal here?
// These are all extremely important , particularly in the current socio-
// political climate, if you are to gain traction with this compelling concept

// End with an invitation. What kind of system would armatively treat
// mutability as a right? What kinds of futures might that unlock? Who
// are the peers in this space? I know I'm asking you to think beyond the
// scope of link rot solutionism, but think about it: you're trying to get
// away with proposing an entirely dierent infrastructural ethic, I'm not
// going to let you get away with scoping that to a focused solution in a
// vacuum!!

// What this needs is a compsci voice that draws on the discussions you,
// me and Gwil have had for years: we need a design language for
// mutable, non-rotting systems that do not rely on scarcity, address
// resolution, or enforced permanence. That’s the deeper thesis here,
// and the more we hone and refine it, the more noise we make, the more
// attention it will bring, and the more likely we are to be able to continue
// what we do. Look around, look at the state of things; your demands
// here deserve to be shouted, not whispered.
