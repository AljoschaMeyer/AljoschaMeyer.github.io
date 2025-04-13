import { A, Code, Em, I, P, Strong } from "macromania-html";
import { Marginale, Sidenote } from "macromania-marginalia";
import { Hsection } from "macromania-hsection";

export const mutability_and_rot = {
  draft: true,
  n: "mutability_and_rot",
  htmlTitle: "On Link Rot",
  title: "Mutability Does Not Imply Link Rot",
  date: "2025/04/13",
  children: (
    <>
      <P>
        The web suffers from{" "}
        <A href="https://en.wikipedia.org/wiki/Link_rot">link rot</A>:
        hyperlinks that were valid upon creation will often point into
        nothingness after some time has passed. Within the framework of the web,
        the typical solution is to link to a snapshot of the original page,
        hosted on <A href="https://archive.org/">archive.org</A>.
      </P>
      <P>
        Many projects that envision an alternative to the web try to eliminate
        the problem of dead links as part of their architecture, usually by
        employing{" "}
        <A href="https://en.wikipedia.org/wiki/Content-addressable_storage">
          content-addressing
        </A>{" "}
        of immutable data.{" "}
        <Strong>
          I propose that link rot and dead links are separate concepts, and
          eliminating link rot at the cost of eliminating all dead links is not
          worth it.
        </Strong>
      </P>

      <P>
        I will speak of link <I>rot</I> when a link becomes unresolvable due to
        {" "}
        <Em>inaction</Em>{" "}
        of the content’s author. Passive link rot is deeply built into the web,
        due to the way domains work: they are only rented, never bought.
        Renewing a domain requires active action. When an author drifts away
        from old work, they will eventually stop paying the rent for the domain
        — and the content goes down.
      </P>

      <P>
        Contrast this with active{" "}
        <I>mutation</I>, where an author opts to delete or change some content
        that is being referenced by other peoples’ links. This kind of link
        invalidation is a feature, not a bug. It gives agency to authors. In
        particular, authors can set up{" "}
        <A href="https://en.wikipedia.org/wiki/URL_redirection">
          URL redirections
        </A>{" "}
        if they want to move content without making it inaccessible.
      </P>

      <P>
        Systems that eliminate <Em>all</Em> dead links by design{" "}
        <Sidenote
          note={
            <>
              Actually, the content you link to still needs to be stored{" "}
              <Em>somewhere</Em>{" "}
              for it to be resolvable. In principle, any entity that stores a
              document can also store everything that this document
              (transitively) links to. <Em>Surely</Em>{" "}
              that is completely feasible and will never run into any resource
              limits.
            </>
          }
        >
          solve
        </Sidenote>{" "}
        the problem of link rot, but they also eliminate mutation. They strip
        authors of all agency beyond the act of publishing.<Marginale>
          {" "}
          Publishing something on the web always sacrifices <Em>some</Em>{" "}
          agency over the data: whoever consumes the data can take a screenshot
          and put it on their fridge, and no computer protocol will allow the
          author to remove that printout. But an author always retains control
          over the default way of accessing the data, which will be followed by
          the vast majority of future visitors.
        </Marginale>{" "}
        I, personally, am not interested in developing or using systems that
        strip humans of agency by design.
      </P>

      <P>
        <Strong>
          It is possible to design systems that allow for active mutation but do
          not suffer from passive link rot.
        </Strong>{" "}
        To see how, it helps to take a step back and consider the problem space.
      </P>

      <Hsection
        n="mutability_and_rot_problem_space"
        title="Data, Mutability, and Naming"
      >
        <P>
          All data is immutable. You cannot <Em>change</Em> the string{" "}
          <Code>"Hello World!"</Code>, just like you cannot change the number
          17. Neither can you change the source code of this website, it just
          {" "}
          <Em>is</Em>. When we talk about mutability in computer science, we
          mean something else: we map some identifier to some data, and later,
          we might map the same identifier to different data. The variable{" "}
          <Code>my_favourite_string</Code> might first be mapped to{" "}
          <Code>"Hello World!"</Code>, and later to{" "}
          <Code>"I love you"</Code>. On the web, URLs take on the role of these
          names.
        </P>

        <P>
          Many programming languages offer immutable bindings from names to
          values: you give a name to some expression, and you are not allowed to
          reassign that name to any other expression. As a consequence, you can
          now use the name and the expression interchangeably. There are
          computational benefits compared to simply copy-pasting the same
          expression over and over: it suffices to evaluate the expression only
          once and to then reuse the result; this also shortens the program. But
          semantically, there is no difference.
        </P>

        <P>
          Content-addressing implements the exact same concept: referencing some
          data by its name is convenient and efficient, but names are ultimately
          transparent to the meaning of the data. The notion of deleting data
          that somebody else is referencing makes little sense; if the other
          person had copied your data verbatim into their own data, you would
          not expect to be able to selectively delete those sections either.
        </P>

        <P>
          The hyperlinks of the web, in contrast, implement <Em>mutable</Em>
          {" "}
          mappings. Clicking on a link on different days can yield different
          results. The underlying technique is that of using <Em>addresses</Em>
          {" "}
          as names.<Marginale>
            I am simplifying things on multiple fronts here. But the core
            argument does not hinge on the simplifications.
          </Marginale>{" "}
          The link contains a domain, and that domain is translated into an{" "}
          <A href="https://en.wikipedia.org/wiki/IP_address">IP address</A>,
          which is a (more or less) physical location. At different points in
          physical time, different data might be placed at that location. This
          is a simple and efficient form of implementing mutable bindings —
          variables and pointers in imperative programming languages typically
          also work this way. Name resolution based in physical addresses is the
          first source of link rot: somebody needs to maintain the machine that
          answers HTTP requests.
        </P>

        <P>
          On top of this mechanism, the web layers a second step of name
          resolution: the{" "}
          <A href="https://en.wikipedia.org/wiki/Domain_Name_System">DNS</A>
          <Marginale>
            Technically, this step introduces a second way in which the web
            enables mutability: the same domain name can point to different IP
            addresses over time. Since that is a rather unidiomatic approach to
            changing content, I will mostly ignore this feature.
          </Marginale>{" "}
          maps human-readable domain names to the IP addresses that make
          everything work under the hood. Domain names are a scarce resource, so
          they typically are rented out on a yearly basis. Tieing name
          resolution to continuous payments is the biggest source of link rot,
          it ensures that content will certainly get lost once its author stops
          caring about it.
        </P>

        <P>
          Abstractly speaking, the challenge is to find implementation
          techniques for mutable name bindings not based in locations nor depend
          on the leasing of scarce resources. This is the solution space with
          the potential to preserve author agency while not suffering from name
          rot.
        </P>
      </Hsection>

      <Hsection
        n="mutability_and_rot_a_solution"
        title="A Possible Solution"
      >
        <P>
          One approach to mutable name bindings can be implemented via{" "}
          <A href="https://en.wikipedia.org/wiki/Digital_signature">
            digital signatures
          </A>. An author — identified by some public key — binds a name to some
          data by signing an identifier, the{" "}
          <Sidenote
            note={
              <>
                A straight-forward optimisation is to sign a secure hash of the
                data instead.
              </>
            }
          >
            data
          </Sidenote>, and a timestamp. When the same author binds different
          data to the same identifier, the binding with the greater timestamp
          wins. Such a system effectively creates a separate namespace per
          public key: a <I>name</I>{" "}
          consists of a public key together with an identifier.
        </P>

        <P>
          I use <I>timestamp</I>{" "}
          in a wide sense here: a timestamp could be a wall-clock time, or a
          logical counter, or something else entirely. For example, you could
          use a secure hash of the previous binding of that name, to establish a
          cryptographically verifiable order. And once you go here, you might as
          well use something{" "}
          <A href="https://worm-blossom.github.io/reed/">more efficient</A>.
          Anything that allows for a deterministic choice between competing
          bindings goes.
        </P>

        <P>
          Note that such a name — unlike a physical address — contains no
          information on how to resolve it to the underlying data. Neither does
          a hash in content-addressed systems. Both kinds of systems admit the
          same classes of solutions, for example to query peers with shared{" "}
          <Sidenote
            note={
              <>
                Whether they share those interest naturally or you pay them to
                care is irrelevant.
              </>
            }
          >
            interests
          </Sidenote>, or a{" "}
          <A href="https://en.wikipedia.org/wiki/Distributed_hash_table">
            distributed hash table
          </A>{" "}
          which randomly assigns storage responsibilities.
        </P>

        {/* The web crams all names into a single namespace, it is this scarcity that  */}
      </Hsection>
    </>
  ),
};

// Things *can* be implemented differently, for example: names are pairs of public keys and a user-chosen name, a binding is a triplet of the user-chosen name part, an instant in time, and a signature by the public key. Time could be a numeric timestamp (willow), a hash chain (ssb, reed, bluesky even), or anything else really.

// Deletion is built into the triplet-naming-approach. It does not suffer from rot: I might pay a provider to store the data I bind to a name; if I stop paying, they'll forget the data, but the binding remains unaffected.

// rent vs rot

// solves rot by replacing scarce physical place that must be leased into plentiful public-key-space
// does not cover how to resolve names (neither does content-addressing btw)
// zoko's triangle

// Could even put name binding thingies into a dht if you feel like it. Bam, mutable ipfs-

// Conclusion: You can have mutability without suffering from link rot. You *should*, even.

// - only one area of hte solution space; hope that eventually other areas will be explored as well

// Also:

// - content-addressing is not a necessity for addressing data independent from servers, as the signature-based naming schemes show
// - ipns reintroduces link rot, lol...
