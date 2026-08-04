import {
  A,
  Br,
  Code,
  Dfn,
  Em,
  H2,
  H3,
  Hr,
  I,
  Li,
  P,
  Ul,
} from "macromania-html";
import { Marginale, Sidenote } from "macromania-marginalia";
import { Quotes } from "../macros.tsx";

export const broadcast_based_programming = {
  n: "broadcast_based_programming",
  htmlTitle: "Broadcast-Based Programming",
  title: "Broadcast-Based Programming",
  date: new Date("2026-07-20"),
  summary: `Sketching a new programming language paradigm.`,
  rssLink: `https://aljoscha-meyer.de/posts/broadcast_based_programming/`,
  draft: true,
  children: (
    <>
      <P>
        In this post, I sketch out a new programming paradigm. The premise is
        simple: if the communication primitive of <Em>message-passing</Em>{" "}
        leads to{" "}
        <A href="https://en.wikipedia.org/wiki/Object-oriented_programming">
          object-oriented programming
        </A>, then what programming paradigm does the communication primitive of
        {" "}
        <Em>broadcast</Em>{" "}
        lead to? The explorations lead to some hypothetical relatives of{" "}
        <A href="https://en.wikipedia.org/wiki/Smalltalk">Smalltalk</A> and{" "}
        <A href="https://en.wikipedia.org/wiki/Erlang_(programming_language)">
          Erlang
        </A>, and to a (hopefully) interesting take on{" "}
        <A href="https://www.cs.unm.edu/~ackley/#rh-is">Spatial Programming</A>.
      </P>

      <P>
        This text is exploratory more than actually useful. Whether
        broadcast-based programming languages would actually be a good idea I
        doubt somewhat. But I learnt a bunch of stuff by exploring this space,
        and you might as well.
      </P>

      <H2>Broadcast Communication</H2>

      <P>
        While I will write mostly about programming languages, I will start out
        in the domain that inspired these ideas: computer networking.
      </P>

      <P>
        The predominant networking model for most developers is given by the
        internet: point-to-point communication. An{" "}
        <A href="https://en.wikipedia.org/wiki/Internet_Protocol">IP</A>{" "}
        packet has a single sender and a single receiver.{" "}
        <A href="https://en.wikipedia.org/wiki/User_Datagram_Protocol">UDP</A>
        {" "}
        and{" "}
        <A href="https://en.wikipedia.org/wiki/Transmission_Control_Protocol">
          TCP
        </A>{" "}
        are about pairs of computers exchanging messages.
      </P>

      <P>
        On a lower level, many modes of communication do <Em>not</Em>{" "}
        have single receivers, instead they are broadcast model. Classic{" "}
        <A href="https://en.wikipedia.org/wiki/Ethernet">Ethernet</A>{" "}
        has each computer send data to all connected machines simultaneously.
        Radio,{" "}
        <A href="https://en.wikipedia.org/wiki/LoRa">LoRa</A>, and other
        wireless technologies are very much broadcast-based. As is human speach
        or writing, for that matter.
      </P>

      <P>
        Over the past years,{" "}
        <A href="https://dmi.unibas.ch/de/personen/christian-tschudin/">
          Christian Tschudin
        </A>{" "}
        has been developing an interesting mindset around this space, starting
        from the assumption that global broadcast is the purest form of
        communication.<Marginale>
          I am probably misrepresenting this or botching it up; my sincere
          apologies to you Christian.
        </Marginale>{" "}
        Because true global broadcast cannot be achieved in practice, we use
        other forms of communication as approximations: local broadcast,
        repeaters, pub-sub, flooding, point-to-point cables, etc. All of these
        can be interpreted as weakenings of the global broadcast idea; by
        weakening the primitive it becomes more feasible to implement in the
        real world.
      </P>

      <P>
        The appeal behind this view is that we can start abstracting over the
        messy compromises of networking: simply design your systems in the
        (comparatively) easy-to-reason-about broadcast model, and trust that the
        physical infrastructure will be able to simulate that model sufficiently
        well. This idealised approach removes a whole lot of headaches that
        usually accompany networking, and has a tendency to result in highly
        reliable systems.
      </P>

      <P>
        Whether this is actually a good idea I cannot answer conclusively. But
        it makes for an interesting starting point for designing programming
        languages.
      </P>

      <H2>Broadcast-Based Programming</H2>

      <P>
        To approach the hypothetical programming language paradigm of
        boradcast-based programming (BBP), I will start with a recap of how
        message passing leads to object-oriented programming (OOP).
      </P>

      <P>
        The paradigm of object-oriented programming is structured around message
        passing. Objects encapsulate state, but this state is not accessible to
        other objects. Instead, objects call methods on other objects, i.e.,
        they pass messages to each other. Method calls are synchronous and
        point-to-point: on a method call, the single caller suspends its
        execution and resumes once the single callee returns its result.
      </P>

      <P>
        For broadcast-based programming, we also need state-encapsulating
        entities that do the broadcasting; to avoid ambiguity I will call these
        entities <Dfn>stations</Dfn> (rather than <I>objects</I> or{" "}
        <I>processes</I>). Every station can broadcast messages, and it can
        react to messages. Similar to how an object is defined by specifying a
        set of methods, a station is defined by specifying how it reacts to the
        messages it receives. <Em>All</Em>{" "}
        program code lives in message handlers.
      </P>

      <P>
        Unlike method calls, broadcasts do not have a dedicated receiver. A
        station simply sends its message, and{" "}
        <Sidenote
          note={
            <>
              This corresponds to truly <Em>global</Em>{" "}
              broadcast; I will discuss mechanisms corresponding to local
              broadcast later.
            </>
          }
        >
          all
        </Sidenote>{" "}
        other stations can react to it. Consequently, broadcasting is an{" "}
        <Em>asynchronous</Em>{" "}
        operation: broadcasting a message does not suspend the station, it will
        simply continue executing its current code (i.e., message handler).
      </P>

      <P>
        In OOP, method calls result in a call stack at runtime. For BBP, the
        resulting runtime data structure is more interesting. Because there can
        be many stations reacting to the same broadcast, all their message
        handlers should be enqueued (FIFO). Execution of the code that issued
        the broadcast could either resume immediately, or it could be suspended
        and enqueued after all receivers — either works.
      </P>

      <P>
        Note that this introduces a nondeterminism that is not inherent to
        (single-threaded) OOP: the order in which message handlers are enqueued
        is essentially arbitrary. Language semantics could either mandate a
        specific ordering, or they could simply leave the ordering as an
        implementation-specific detail. The latter choice essentially makes
        message handlers concurrent, and this could be expanded upon by allowing
        the runtime to parallelise execution of message handlers. This leads to
        a model closer to{" "}
        <Sidenote
          note={
            <>
              Note also the similarities with the{" "}
              <A href="https://en.wikipedia.org/wiki/Actor_model">
                actor model
              </A>.
            </>
          }
        >
          Erlang
        </Sidenote>{" "}
        than Smalltalk: stations run on their own logical threads, which might
        be interleaved or even executed in parallel.
      </P>

      <P>
        Enqueing message handlers results in certain causality guarantees: if
        station <Code>A</Code> sends a message <Code>m1</Code>, and station{" "}
        <Code>B</Code> reacts to it by sending a message{" "}
        <Code>m2</Code>, then a third station will handle <Code>m1</Code>{" "}
        before it handles{" "}
        <Code>m2</Code>. In principle, instead of mandating a particular
        queueing mechanism, we could instead define the admissable behaviour of
        the runtime as a set of <Em>causality constraints</Em>{" "}
        on the order in which message handlers are run. The more restrictive the
        causality constraints are, the more predictable the programming model
        becomes, but the less freedom the runtime has for optimisation.
      </P>

      <P>
        Some sensible causality constraints beyond the one sketched in the
        previous paragraph include that a message handler cannot be run before
        the message has been sent, and that if a single station sends two
        messages sequentially, then all handlers must run in the same order.
      </P>

      <P>
        These constraints seem sensible to me, but I have no formal reason to
        know whether they alone would suffice for a good programming model or
        whether more constraints would be necessary. An implementation based on
        enqueueing handlers statisfies all three criteria, but I don’t know
        whether there are <Em>better</Em>{" "}
        implementations that also satisfy them. In any case, for all three
        constraints I can imagine compiler optimisations that would love to
        break them, so it would be interesting to have compilers that seek to
        prove that breaking a constraint does not change the program semantics,
        in order to do an advanced optimisation.
      </P>

      <P>
        Note that there are good arguments for <Em>not</Em>{" "}
        guaranteeing strong causal constraints: a truly distributed
        implementation of a BBP language becomes much easier with weaker
        guarantees, and programs can still recreate stronger guarantees if they
        require them. Just like TCP adds ordered delivery to IP by means of
        sequence numbers, buffering, and retransmissions, it should be possible
        to implement strong causal broadcast guarantees on top of weak causality
        guarantees.
      </P>

      <Hr />

      <P>
        A strong suite of OOP is encapsulation, and BBP as described so far is
        lacking in that regard: all broadcasts are global, thus every part of a
        program can react to every other part of a program. A nice way of
        introducing encapsulation is through a notion of{" "}
        <Dfn>frequency bands</Dfn>. Sending a message would require specifying
        both the message and the frequency band on which to send it, and then
        message handlers would be defined on a per-frequency-band basis.
      </P>

      <P>
        One of the primitives of such a BBP language would be an operator for
        obtaining a fresh, unique frequency band unknown to any other station
        (fully analogous to symbols in Lisps). After communicating that
        frequency band to another station, the two stations can then communicate
        without leaking any information to the remainder of the program.
      </P>

      <P>
        There is a problem with this approach, however: how would the station
        that minted a new frequency band communicate that band to only the
        intended recipient? There is a chicken-and-egg problem here. And it
        makes a lot of sense: if the only communication mechanism there is is
        global broadcast, establishing a secret between two stations is going to
        be difficult. In the real world, we have key-agreement protocols to work
        around this issue. In a programming language, there should probably be
        an easier way to solve this. I have a proposal, but it requires looking
        at a different topic first: the lifecycle of stations.
      </P>

      <P>
        <Em>Defining</Em>{" "}
        a station is easy, you simply define how it reacts to messages. But to
        get a running program, you also need to <Em>create</Em>{" "}
        stations.<Marginale>
          <Em>Removing</Em>{" "}
          stations again is also necessary for a real programming language.
        </Marginale>{" "}
        The obvious solution is to allow each station to create new stations.
        And similar to the constructors of object-oriented programming, it seems
        sensible to allow the passing of arguments from the creating station to
        the created station. And this passing of arguments can be the escape
        hatch for non-global communication. The creating station can allocate a
        fresh frequency band, pass it to the created station, and then the two
        of them can communicate in a fully encapsulated way.
      </P>

      <P>
        Note that there are some interesting questions around causality
        constraints regarding the interaction of message sending and station
        creation (and removal): if a station <Code>S1</Code>{" "}
        first sends a message <Code>m</Code> and then creates a new station{" "}
        <Code>S2</Code>, then <Code>S2</Code> probably should not react to{" "}
        <Code>m</Code>. Similarly, there can be constraints for cross-station
        interaction, and constraints for how station removal must ensure that
        certain future messages will not be handled by the removed station. And
        as usual, logically concurrent broadcasts and station lifecycle events
        should all for nondeterministic semantics.
      </P>

      <P>
        On the implementation side, simply enqueing station creation and removal
        in the same queues as message handlers (or message broadcasts) seems to
        satisfy most sensible causality constraints I can come up with. This
        might require suspending the current handler and enqueing its resumption
        after enqueing a station creation or deletion though — I haven’t fully
        worked out the details here (and doing so would require developing a
        proper set of causality constraints first).
      </P>

      <Hr />

      <P>
        A final interesting aspect of BBP is the notion of{" "}
        <Em>station identity</Em>. A landmark of OO is the ability to pass
        around references to objects; this is strictly required because without
        a reference you cannot send a message to an object. Broadcast-based
        programming, in contrast, can do completely without references to
        stations: the operator for station creation does not even need to return
        a value. That is quite the paradigm shift in practical terms, but also
        philosophically: what does it mean for the identity of a station if it
        cannot be referenced? There is no notion of equality of stations, and
        not even a direct way to even sense whether other stations exist. If you
        broadcast a message and nobody replies, that does not necessarily mean
        that nobody else is there. Conversely, a station that never sends a
        single message might just as well not exist<Marginale>
          Especially if all observable side-effects of the programming language
          must be triggered by sending messages that are handled by system
          stations.{" "}
          <Quotes>Everything is a station</Quotes>, as the famous slogan
          goes.<Br />There are some interesting implications around randomness
          and symmetry breaking though if yout take this model to its logical
          extreme.
        </Marginale>.
      </P>

      <P>
        OOP languages have traditionally had a difficult time with value-based
        semantics, because objects necessarily require working with pointers.
        BBP languages could do a better job there.
      </P>

      <Hr />

      <P>
        To recapitulate, a BBP language needs:
      </P>

      <Ul>
        <Li>An operator for sending messages.</Li>
        <Li>
          A language for defining the behaviour of a station, i.e., for defining
          which messages it sends in response to receiving messages.
        </Li>
        <Li>A statement for creating new stations.</Li>
        <Li>
          If encapsulation is desired: an operator for minting new frequency
          bands.
        </Li>
        <Li>
          A definition of causality guarantees, speciying which station
          scheduling and message orders are allowed to happen, and how they
          interact with station creation and removal.
        </Li>
      </Ul>

      <P>
        Some final notes for the theory nerds: it seems fairly straightforward
        to port some process calculi in the style{" "}
        <A href="https://en.wikipedia.org/wiki/Robin_Milner">Milner</A>{" "}
        et al. to the broadcast-based world. You could use the same syntax as
        the{" "}
        <A href="https://en.wikipedia.org/wiki/Calculus_of_communicating_systems">
          calculus of communicating systems
        </A>{" "}
        and adjust the semantics from handshake-based communication to the
        broadcast setting. I imagine the resulting notions of{" "}
        <A href="https://en.wikipedia.org/wiki/Transition_system">
          transition systems
        </A>{" "}
        and{" "}
        <A href="https://en.wikipedia.org/wiki/Bisimulation">bisimulation</A>
        {" "}
        to be quite fun. And it should similarly be possible to repurpose the
        syntax of the{" "}
        <A href="https://en.wikipedia.org/wiki/Calculus_of_communicating_systems">
          pi calculus
        </A>{" "}
        to formally study the properties of frequency band allocation and
        transmission.<Marginale>
          A fun difference to Milner-style calculi is that in our setting
          observers need not influence the system behaviour, whereas you can
          take the view that in a handshake-based calculus the only way to
          observe a system is by interacting with it.
        </Marginale>{" "}
        I expect such formalisms to demonstrate that <Em>technically</Em>{" "}
        you do not need a dedicated language for specifying message handlers,
        you can probably do it with the minimal set of operators (send message,
        obtain fresh frequency band, spawn station) together with a conditional
        operator and either a replication operator or the ability to have
        stations recursively spawn copies of themselves.
      </P>

      <H2>Space and Locality</H2>

      <P>
        The BBP model as described so far implements <Em>global</Em>{" "}
        broadcast.<Marginale>
          Fair warning: things get significantly more wacky from here on.
        </Marginale>{" "}
        It is also worthwhile to explore variants based on local broadcasts, in
        order to allow for scalable distributed implementations.
      </P>

      <P>
        In what follows I refer primarily to{" "}
        <A href="https://www.cs.unm.edu/~ackley/papers/hotos-11.pdf">
          David Ackley’s vision of infinitely scalable computing
        </A>, you should read that paper if you haven’t yet (and perhaps watch
        {" "}
        <A href="https://www.youtube.com/watch?v=eQgxFuw8f1U">
          Lu Wilson’s spatial programming presentation
        </A>{" "}
        for a more concrete introduction). My basic premise is that
        computational atoms which broadcast messages would make for a good
        primitive of a living-ish computer.
      </P>

      <P>
        My central consideration is that the{" "}
        <A href="https://movablefeastmachine.org/">Movable Feast Machine</A>
        {" "}
        (MFM) is premised on an unrealistic model:<Marginale>
          I am exaggerating in this paragraph, you can fairly easily defend the
          MFM model against this criticism. But the conceptual argument is
          sound, I believe.
        </Marginale>{" "}
        having the computational atoms <Quotes>sense</Quotes>{" "}
        their environment in a fixed-size event window goes against physics. An
        entity cannot magically teleport information from the outside to itself.
        Broadcast is the more realistic model: every computational atom is
        responsible for sending out information, and the receival of information
        is a purely local operation (occuring when the broadcast has physically
        reached the receiver).
      </P>

      <P>
        A broadcast-based spatial programming (BBSP) approach has a couple of
        neat properties. For one, it admits heterogenous computational atoms of
        vastly differing scales. Stations could involve a conventional CPU and
        powerful transmitters and receivers, or they could be low-level,
        low-state hardware components that perform meaningful computations only
        in tandem with other stations (and whose state must be interpreted in
        tandem with that of other stations to become meaningful). Additionally,
        stations could be mobile (i.e., move through space) without requiring
        any tweaks to the system as a whole.
      </P>

      <P>
        Instead of a fixed-size window for sensing, stations could decide for
        themselves how far they send their messages. In fact, a single station
        could choose to broadcast at different ranges (strengths). There are
        physical tradeoffs: low-range communication can enjoy high bitrates,
        whereas long-range communication needs a lower bitrate. The thought of
        having a steady stream of low-bitrate communication over great distances
        while also having high-bitrate local broadcasts feels a lot more
        appealing to me than a fixed local event window size.
      </P>

      <P>
        Additionally, the system design has no theoretical limit on the spatial
        densitity of the computational atoms. Some areas might have relatively
        few stations (say, in between the earth and the moon), others might pack
        them very densely (say, in a BBSP-based microprocessor). Whereas Lu
        Wilson’s notion of recursive spatial programming mostly makes sense when
        thinking about a virtual machine, a higher density of stations makes
        intuitive sense in the real world, and does not require any changes to
        the computational model at all (similar to how mobility also just
        works).
      </P>

      <P>
        If the goal is to make BBSP applicable to the real world rather than for
        a virtual machine model, there are several additional facets to
        consider:
      </P>

      <Ul>
        <Li>
          Interference: broadcast too much information in the same space at the
          same time and signals cannot be decoded any more. This requires
          cooperative congestion control to tackle. Is it possible to handle
          this transparently, or should this source of problems be exposed to
          programmers?
        </Li>
        <Li>
          Overload: a station might receive messages more quickly than it can
          process them. This can be partially solved through buffering, but
          eventually buffer space might be exhausted (or buffering messages for
          a long time might make their processing pointless), so at some point
          messages would have to be dropped. Or alternatively, there could be
          system-wide (well, or at least locally-agreed-upon) limits on how much
          information to broadcast.
        </Li>
        <Li>
          Latency: broadcasts require a nonzero amount of time to reach other
          stations. Depending on scale, this delay might become nonnegligible.
        </Li>
      </Ul>

      <P>
        Finally, BBSP is a setting in which the strong causality guarantees of
        BBP cannot be upheld. While some basic properties of causality still
        hold (a message cannot arrive before it was sent), other tempting
        assumptions are not self-evident. In particular, the computational moedl
        should <Em>not</Em>{" "}
        assume that the space in which the stations are distributed is a{" "}
        <A href="https://en.wikipedia.org/wiki/Metric_space">metric space</A>
        {" "}
        with respect to message propagation times. Even message reordering
        should probably be allowed.<Marginale>
          And by <Quotes>be allowed</Quotes>{" "}
          I mean that programs should be robust against it. Because reorderings
          {" "}
          <Em>will</Em>{" "}
          happen somewhere eventually, whether the theoretical model allows them
          or not.
        </Marginale>
      </P>

      <H2>Conclusion</H2>

      <P>
        This was fun. I hope you think so as well.
      </P>
    </>
  ),
};
