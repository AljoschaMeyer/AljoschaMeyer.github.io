import { A, Code, Dfn, Em, H2, H3, Hr, I, Li, P, Ul } from "macromania-html";
import { Marginale, Sidenote } from "macromania-marginalia";
import { Quotes } from "../macros.tsx";

export const broadcast_based_programming = {
  n: "broadcast_based_programming",
  htmlTitle: "Broadcast-Based Programming",
  title: "Broadcast-Based Programming",
  date: new Date("2026-07-20"),
  summary: `Sketching a new programming language paradigm.`,
  rssLink: `https://aljoscha-meyer.de/posts/broadcast_based_programming/`,
  children: (
    <>
      <P>
        In this post, I try to explore a new programming paradigm. The premise
        is simple: if the communication primitive of <Em>message-passing</Em>
        {" "}
        leads to object-oriented programming, then what programming paradigm
        does the communication primitive of <Em>broadcast</Em>{" "}
        lead to? My explorations lead to some hopythetical relatives of
        Smalltalk and Erlang, as well as to an interesting take on Spatial
        Programming.
      </P>

      <P>
        This post is exploratory more than actually useful. Whether
        broadcast-based programming languages would actually be a good idea I
        doubt somewhat. But I learnt a bunch of stuff by exploring this space,
        and you might as well.
      </P>

      <H2>Broadcast Communication</H2>

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
        has been developing an interesting mindset around this space, starting
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
        To approach our hypothetical programming language paradigm of
        boradcast-based programming (BBP), I will start with a recap of how
        message passing leads to object-oriented programming (OOP).
      </P>

      <P>
        The paradigm of object-oriented programming is structured around message
        passing. Objects encapsulate state, but this state is not accessible to
        other objects. Instead, objects call methods on other objects, i.e.,
        they pass messages to each other. Method calls are synchronous and
        point-to-point: on a method call, the single caller suspends its
        execution and resumes once the single callee returned its result.
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
        In OOP, methods calls result in a call stack at runtime. For BBP, the
        resulting runtime data structure is less obvious. Because there can be
        many stations reacting to the same broadcast, all their message handlers
        should be enqueued (FIFO). Execution of the code that issued the
        broadcast could either resume immediately, or it could be suspended and
        enqueued after all receivers — either works.
      </P>

      <P>
        Note that this introduces a nondeterminism that is not inherent to
        (single-threaded) OOP: the order in which message handlers are enqueued
        is essentially arbitrary. Language semantics could either mandate a
        specific ordering, or they could simply leave the ordering as an
        implementation-specific detail. The latter choice essentially makes
        message handlers concurrent, and this could be expanded upon by allowing
        the runtime to parallelise execution of message handlers. This leads to
        a model closer to Erlang than Smalltalk: stations run on their own
        logical threads, which might be interleaved or even executed in parallel
        on actual hardware.
      </P>

      <P>
        Enqueing message handlers results in certain causality guarantees: if
        station <Code>A</Code> sends a message <Code>m1</Code>, and station{" "}
        <Code>B</Code> reacts to it by sending a message{" "}
        <Code>m2</Code>, than a third station will handle <Code>m1</Code>{" "}
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
        enqueueing handlers statisfies all three criteria, but I don't know
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
        implementation of a BBP langauge becomes much easier with weaker
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
        an easier way to solve this. I have a neat proposal, but it requires
        looking at a different topic first: the lifecycle of stations.
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
        after enqueing a station creation or deletion though — I haven't fully
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
        stations: the operator for station creation does not need to return a
        value. That is quite the paradigm shift in practical terms, but also
        philosophically: what does it mean for the identity of a station if it
        cannot be references? There is no notion of equality of stations, and
        not even a direct way to even sense whether other stations exist. If you
        broadcast a message and nobody replies, that does not necessarily mean
        that nobody else is there. Conversely, a station that never sends a
        single message might just as well not exist<Marginale>
          Especially if all observable side-effects of the programming language
          must be triggered by sending messages that are handled by system
          stations. TODO notes on randomness-as-a-system-service and symmetry
          breaking{" "}
          <Quotes>Everything is a station</Quotes>, as the famous slogan goes.
        </Marginale>.
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
        to port some process calculi in the style Milner et al. to the
        broadcast-based world. You could use the same syntax as the{" "}
        <A href="https://en.wikipedia.org/wiki/Calculus_of_communicating_systems">
          calculus of communicating systems
        </A>{" "}
        and adjust the semantics from handshake-based communication to the
        broadcast setting. I imagine the corresponding notions of transition
        systems and bisimilarity to be quite fun. And it should similarly be
        possible to repurpose the syntax of the{" "}
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
        And I expect such systems to demonstrate that <Em>technically</Em>{" "}
        you do not need a dedicated language for specifying message handlers,
        you can probably do it with the minimal set of operators (send message,
        obtain fresh frequency band, spawn station) together with a conditional
        operator (assuming a spawn operator that supports recursion,
        alternatively an additional replication operator should do the trick).
      </P>

      ---

      <P>
        Another aspect to consider is that of congestion or interference. For
        every physical broadcast medium, there is a limit on how many messages
        can be transmitted simultaneously while still being receivable. This is
        another aspect that introduces fallability. In a simulated,
        single-machine implementation, this issue could be subsumed as an issue
        of buffering: the physical limit of the simulated transfer medium is the
        available space for buffering messages before their delivery. But there
        might be upsides to reporting such congestion in a different way to
        programmers: the correct ways for a station to adjust its behaviour in
        the face of congestion versus when running out of local message buffer
        space are completely different after all.
      </P>
    </>
  ),
};

/*

constant vs occasional broadcast (compare the immutable data of FP)
- append-only logs? reducibility between global broadcast and globally-accessible append-only logs?

local-simulated-synchronous-infallible-deterministic vs global-physical-asynchronous-fallible-concurrent

space and range (global braodacst doesn't need space), guarantees?
spatial programming (but without the 2d visiual programming language)
latency (speed of light as fundamental limit)
re-ordering of messages
mobility
causality in spatial programming
identity of stations?
sensing vs receiving (compare spatial computing locality)
sender determines how far the signal travels (contrast with spatial programming, where a "receiver" decides how much of its environment it actively senses)




composition
encapsulation
frequency bands (private ones?)
space and range (global braodacst doesn't need space), guarantees?
latency (speed of light as fundamental limit)
internals
computations
space
triggering broadcasts
mobility
congestion
push vs pull (compare method calls), sensing vs receiving (compare spatial computing locality)
constant vs occasional broadcast (compare the immutable data of FP)
  - append-only logs? reducibility between global broadcast and globally-accessible append-only logs?
local-simulated-synchronous-infallible-deterministic vs global-physical-asynchronous-fallible-concurrent
static typing, interfaces, etc
*causal* broadcast? (both for sendings by a single process and for ordering between multiple processes)
    does this require a metric space? if A sends x, and B sends f(x), can B's f(x) arrive at C before x? Does this change based on whether x is data or something special (a symbol)? CC "novelty frontier" and frontier**s**
    compare how spatial computing handles this (no causality whatsoever
    recreate causality through buffering, CC TCP)
no message queues
sender address attached to each broadast? (no, probably, compare method calls... but what about physics?)
joining/leaving
spawning new stations, communicating their addresses

calculus of communicating systems (CCS) and pi calculus
    observability of a system does not require the system to interact with the observer
*/
