import { A, Br, Code, Em, I, Li, P, Strong, Ul } from "macromania-html";
import { Marginale, Sidenote } from "macromania-marginalia";
import { Hsection } from "macromania-hsection";
import { Quotes } from "../macros.tsx";
import { ResolveAsset } from "macromania-assets";

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
        n="mutability_and_rot_problem_space"
        title="Data, Mutability, and Naming"
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
        n="mutability_and_rot_a_solution"
        title="A Possible Solution"
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
            advertisement in{" "}
            <A href="https://en.wikipedia.org/wiki/The_New_York_Times">
              New York Times
            </A>.
          </Li>
        </Ul>

        <P>
          There is a significant amount of design space beyond the choice of
          timestamp.{" "}
          <A href="https://willowprotocol.org/">Willow</A>, for example, assigns
          additional structured information to its names, enabling queries for
          sets set of related bindings. I leave this as an invitation to explore
          the design space beyond what this post sketches, but restrict my focus
          to keep things somewhat concise.
        </P>

        {
          /* // choice of timestamps has deep implications for single/multi-writer access, availability. But for this discussion, I can abstract over that.

        // Solution Space: SSB/Hypercore (and ATProto?) as purely additive "mutation"

        // from the lens of "cypherlinks are merely copy-pasting", SSB is an incredibly naive system (and a restrictive one, since you can't omit the copy-pasting of anything even if you want to), but one that communicates quite different expectations to (lay) users. Storytelling and teaching and perspectives matter!

        // location vs binding: with the latter, you never know whether you are up to date - switch to eventual consistency as mental model: but, technically, you don't know with location-based only whether you just missed an update by a microsecond. And, in principle, propagation delays for binding-based could be just as low (especially when employing likely-location optimisations)

        // related to main question: can mutability-based systems be made local-first?

        // does this work "at scale"? And *which* scales are important?

        // binding-based systems work if and only if content-addressed systems work; whether they do indeed work (at scale) remains to be seen - my primary goal is merely to convert those who already believe that CAS systems work, not to prophecise whether the distributed future will indeed arrive

        <P>
          Many proposals to make the fediverse less reliant on the continued
          well-being of individual instances point to content-addressing as the
          solution. Signed bindings are just as location-independent, yet do not
          need to give up on mutability. I would love to see more awareness of
          such alternatives in this space.
        </P>


        // Systems that eliminate <Em>all</Em> dead links by design{" "}
        // <Sidenote
        //   note={
        //     <>
        //       Actually, the content you link to still needs to be stored{" "}
        //       <Em>somewhere</Em>{" "}
        //       for it to be resolvable. In principle, any entity that stores a
        //       document can also store everything that this document
        //       (transitively) links to. <Em>Surely</Em>{" "}
        //       that is completely feasible and will never run into any resource
        //       limits.
        //     </>
        //   }
        // >
        //   solve
        // </Sidenote>{" "}
        // the problem of link rot */
        }

        {
          /* <P>
        TODO use "signed binding" terminology at start of this paragraph
          Note that such a name — unlike a physical address — contains no
          information on how to resolve it to the underlying data. Neither does
          a hash in content-addressed systems. Both kinds of systems admit the
          same classes of solutions, for example to query peers with shared{" "}
          <Sidenote
            note={
              <>
                Whether they share those interest naturally or you pay them to
                care makes little difference on the purely technical level.
              </>
            }
          >
            interests
          </Sidenote>, or a{" "}
          <A href="https://en.wikipedia.org/wiki/Distributed_hash_table">
            distributed hash table
          </A>{" "}
          which randomly assigns storage responsibilities and routes requests
          accordingly. Over time, lack of interest in some data might mean that
          you cannot find anyone who stores it. But the name binding itself
          never rots away.
        </P> */
        }
      </Hsection>

      <Hsection n="mutability_and_rot_closing" title="Closing Thoughts">
        {
          /*

        <P>
          It seems rather unlikely that signed bindings are the <Em>only</Em>
          {" "}
          approach to mutability that does not suffer form link rot. I am
          looking forward to seeing fresh projects pop up that explore other
          such approaches in the future.
        </P> */
        }
      </Hsection>

      <P>
        <Marginale>
          I am channeling{" "}
          <A href="https://en.wikipedia.org/wiki/Joseph_Weizenbaum">
            Joseph Weizenbaum
          </A>{" "}
          here — I believe that every single computer scientist should read his
          {" "}
          <A
            href={
              <ResolveAsset
                asset={[
                  "treasures",
                  "archive",
                  "computer_power_and_human_reason.pdf",
                ]}
              />
            }
          >
            Computer Power and Human Reason
          </A>.
        </Marginale>
        The previous sections were purely technical, they discussed what{" "}
        <Em>can</Em> be done. Much more important, though, is what{" "}
        <Em>should</Em> be done.
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

// why: fragility: location-based is attackable, censorable, compare "no global singletons" -> what does this mean for DHTs?

// at end: link to willow-page protocol comparison, and link from there back to this. Explicitly call out the cyclic linking

// discussion: signatures already dangerous?

///////
///////
///////

// Hsections are out of date

// For Weizenbaum, link to treasures page instead of the pdf
