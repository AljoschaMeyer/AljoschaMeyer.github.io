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
        Immutable systems based on content-addressable storage are elegant
        solutions to important concerns: censorship-resistant<Marginale>
          In the juxtaposition to systems of mutable names that follows, it is
          crucial that those systems need not suffer from passive link rot
          either — otherwise, their benefits would be counteracted by lack of
          durability and resilience, and we would end up comparing apples and
          oranges.
        </Marginale>{" "}
        access to information, automatic durable archiving of valuable material,
        compression of data (deduplication is a special form of compression).
      </P>

      <P>
        As such, I do hope that content-addressing will be an important tool in
        the distributed information systems of the future. But I believe that
        content-addressing should not be made the defining feature of such
        systems. I want to argue that a society would be impoverished<Marginale>
          I fully subscribe to the assumption that{" "}
          <A href="https://en.wikipedia.org/wiki/The_medium_is_the_message">
            the medium is the message
          </A>.
        </Marginale>{" "}
        by making immutable links the default way of connecting its artifacts.
      </P>

      <P>
        <Marginale>
          Publishing something always sacrifices <Em>some</Em>{" "}
          agency over the data: whoever consumes the data can take a screenshot
          and put it on their fridge, and no computer protocol will allow the
          author to remove that printout. But a mutable link lets the author
          retain control over the outcome of the intended way of accessing the
          data.
        </Marginale>
        Linking to some data with a mutable link means giving agency to the
        author of the data. They are free to change the contents in the future,
        or even to fully remove the data. An immutable link does not award this
        agency.
      </P>

      <P>
        Granting this agency means voluntarily ceding control. The quality of
        your work will vary based on the future actions of another human. A web
        of mutable references is a web of human interdepence, and builds on the
        voluntary giving of trust.
      </P>

      <P>
        Freely given trust and consensual interdependence are deeply human, they
        sit at the root of the most positive relationships we can form. I{" "}
        <Em>want</Em>{" "}
        to immerse myself (and have others immerse themselves) in a medium that
        fosters these notions, and I want to stay clear from media whose design
        choices eliminate them.
      </P>

      <P>
        A medium of mutable links should further teach an important lesson:
        trust must never be without alternative. You <Em>can</Em> choose to{" "}
        <Sidenote
          note={
            <>
              Or, ideally, you can refer to the content via content-addressing,
              which has much better usability.
            </>
          }
        >
          copy
        </Sidenote>{" "}
        content and retain full control over it. If trust is not an active
        choice but the only option, it becomes meaningless.
      </P>

      <P>
        I speculate that the vocal proponents of eliminating as much trust from
        distributed systems as possible arrive at this decision because they
        primarily reflect on involuntarily given{" "}
        <Sidenote
          note={
            <>
              An prime example would be the forced trust in and usage of the
              currency of the nation state you happen live in — it certainly is
              no coincidence that cryptocurrencies, blockchains, and code-is-law
              enthusiats frequently use narratives of trustlessness.
            </>
          }
        >
          trust
        </Sidenote>. Such indiscriminate opposition to (the giving of) all trust
        makes me quite sad. Instead, I want to see systems that minimise
        involuntary, coerced trust, while simultaneously maximising
        opportunities for voluntarily granting trust. And that is why I, like
        anybody would, decided to write a post on mutable name bindings.
      </P>

      <P>
        The analysis of the implications of mutability without link rot is
        multifaceted. I personally am passionate about the{" "}
        <Sidenote
          note={
            <>
              Let alone the engineering opportunities you get from trusting
              other agents in a distributed system. But that is a different
              topic for a different piece of writing.
            </>
          }
        >
          beauty
        </Sidenote>{" "}
        of meaningfully given trust, so that is what I want to contribute here.
        But there are numerous other important issues as well, and things are
        rarely black and white. The inability to retract one’s material can{" "}
        <A href="https://newdesigncongress.org/en/pub/this-is-fine/">
          cause harm
        </A>. Sometimes, active moderation of content by parties other than the
        authors could{" "}
        <A href="https://erinkissane.com/meta-in-myanmar-full-series">
          prevent harm
        </A>. But deletion of publicly valuable content can <Em>also</Em>{" "}
        cause harm. Immutability can support accountability, can counteract
        gaslighting or the rewriting of alternate facts into the past. How do we
        deal with lies and manipulation? What are the roles of apologies and
        foregiveness?
      </P>

      <P>
        I do not have all the answers, and neither does anyone else. But we
        should normalise discussions on these issues. Distributed systems
        designs are not{" "}
        <Sidenote
          note={
            <>
              And I <Em>wish</Em>{" "}
              the academic computer science community would stop pretending they
              were.
            </>
          }
        >
          neutral
        </Sidenote>, neither politically nor socially. When I see a new project
        pop up that glosses over all of these issues and does not position
        itself, I am not interested. I care less for what you can do, and more
        for what you consider worth doing.
      </P>

      <P>
        I believe that systems which neither suffer from link rot nor force
        permanence on all participants, which stay resilient yet allow for
        mutation, should receive more attention. How efficient can we make them?
        How accessible can they be, and to whom? How can we categorise different
        offshoots, how can we efficiently explore, chart, and analyse the design
        space? Which patterns and actors will emerge, who can, should, and will
        shape these systems? How can we ensure that as many people as possible
        who wish to engage with them can benefit?
      </P>

      <P>
        I am looking forward to finding out.
      </P>
    </>
  ),
};
