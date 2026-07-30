import { A, Code, Dfn, Em, H2, H3, Hr, I, Li, P, Ul } from "macromania-html";
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

      <P>
        The paradigm of object-oriented programming is structured around message
        passing. Objects encapsulate state, but this state is not accessible to
        other objects. Instead, objects call methods on other objects,i.e., they
        pass messages to each other. Programs are structured around this
        fundamental mechanism. The underlying metaphor that inspired this
        approach to programming is that of cells in an organism: each has a
        complex, stateful interior, but communication to other cells is strictly
        mediated through a protective membrane.
      </P>

      <P>
        For broadcast-based programming, an underlying metaphor could be that of
        birds interacting in a forest. Each is its own, stateful organism, each
        can broadcast signals to all other birds, and each can hear and react to
        the signals sent by the others. In programming terms, this metaphor is
        fairly close to the actor model, with the big difference that messages
        are not sent to specific recipients but simply broadcast.
      </P>

      <P>
        I will call the stateful processes that make up a broadcast-based
        program{" "}
        <Dfn>stations</Dfn>. Every station can broadcast messages, and it can
        react to messages. Similar to how an object is defined by specifying a
        set of methods, a station is defined by specifying how it reacts to the
        messages it receives.
      </P>

      <P>
        Message broadcasts can be designed in several ways. In the most basic
        formulation, the operator for sending messages takes no arguments but
        the message to send, and the definitions of message handlers receive no
        arguments but the message.<Marginale>
          Whether there is static typing, a notion of interfaces, etc, is an
          orthogonal issue I will mostly ignore.
        </Marginale>{" "}
        One fairly obvious addition would be to introduce a notion of{" "}
        <Quotes>frequency bands</Quotes>. Sending a message would require
        specifying both the message and the frequency band on which to send it,
        and then message handlers would be defined on a per-frequency-band
        basis.
      </P>

      <P>
        This mechanism would immediately yield a neat mechanism for composition
        and encapsulation: one of the primitives of such a language would be an
        operator for obtaining a fresh, unique frequency band unknown to any
        other station (fully analogous to symbols in Lisps). By communicating
        that frequency band to another station, the two stations can then
        communicate without leaking any information to the remainder of the
        program.
      </P>

      <P>
        There is a problem with this approach, however: how would the station
        that minted a new frequency band communicate that band to only the
        intended recipient? There is a chicken-and-egg problem here. And it
        makes a lot of sense: if the only communication mechanism there is is
        global broadcast, establishing a secret between two stations is going to
        be difficult. In the real world, we have key-agreement protocols to work
        around this issue. In a programming language, there should probably be
        an easier way to solve this.
      </P>

      <P>
        One obvious solution is to introduce a notion of space and distances,
        and allow the sending of local broadcasts that only extend to a certain
        distance. I will return to this idea in a later section, but for now I
        want to explore the pure, global-broadcast-only model for a bit. There
        is an elegant solution in that model as well, but it requires looking at
        a different topic: the lifecycle of stations.
      </P>

      <P>
        Defining a station (or an object in OO-programming) is easy, you simply
        define how it reacts to messages. But to get a running program, you also
        need to <Em>create</Em> stations.<Marginale>
          <Em>Removing</Em>{" "}
          stations again is also necessary for a real programming language, but
          I consider this an optimisation detail that is mostly orthogonal to
          everything else I'm exploring here. Any of garbage collection, manual
          deallocation, or RAII works.
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
        Another variant of the broadcast operator is whether the receiver should
        be aware of the identity of the sender. The answer, I think, is a fairly
        clear{" "}
        <Em>no</Em>. In object-oriented programming, an object has no idea who
        called its methods, and this is important to make programs flexible and
        maintainable. The same applies to broadcast-based programming.
      </P>

      <P>
        The next detail of the language semantics to consider is that of
        concurrency and scheduling. in the idealised mental model, all stations
        operate in parallel. To which degree can and should a programming
        language approximate this? In the OO world, there are different answers.
        (Single-threaded) smalltalk diverges from the metaphor of concurrent
        cells and simply follows a single control flow. When a method is called,
        time stops from the perspective of the caller, and time starts for the
        callee. This makes for a fully deterministic language semantics.
        Contrast this with Erlang, where processes (which are essentially
        objects) all execute concurrently and scheduling is non-deterministic.
      </P>

      <P>
        For broadcast-based programming, it is more difficult to emulate the
        deterministic-yet-not-arbitrary execution semantics of Smalltalk for
        several reasons. When a station sends a message, there could be any
        number of stations that have a handler for that message. Which of these
        to execute is an arbitrary choice. Further, there is no notion of return
        values, so it makes no sense to freeze time (i.e., pause execution) of
        the sending station. Broadcasting is a fundamentally asynchronous
        operation.<Marginale>
          A related observation: OO is essentially pull-based, whereas
          broadcast-based programming is push-based.
        </Marginale>
      </P>

      <P>
        For these reasons, a broadcast-based programming language faces the
        choice of either establishing deterministic semantics via completely
        arbitrary criteria or of embracing non-deterministic execution order.
        The latter might seem scary, but it has the big upside of allowing for
        actual parallel execution of several stations on parallel (or
        distributed) hardware.
      </P>

      <P>
        The final big question regarding the semantics of our hypothetical
        language(s) is that of{" "}
        <Em>causality</Em>. Which guarantees should the language make about the
        order in which messages are sent or received? A first guarantee is that
        a language should not be received by any station before it has
        been<Marginale>
          This might sound obvious, but I can easily imagine compiler
          optimisations that would love to break this rule (and I can easily
          imagine compilers that aim to prove that they can get away with
          violating this rule without chaning any observable program semantics)
        </Marginale>{" "}
        sent. Beyond this rule, there are several decisions that are less
        clear-cut.
      </P>

      <P>
        If a station <Code>S</Code> sends a message <Code>M1</Code>{" "}
        followed by another message{" "}
        <Code>M2</Code>, should all other stations be guaranteed to receive{" "}
        <Code>M1</Code> before{" "}
        <Code>M2</Code>? Adding this guarantee (and any other guarantee in this
        area) will make programming easier (and possibly more expressive) but
        (distributed) implementation of the language more difficult.
      </P>

      <P>
        <Marginale>
          Aside from the obvious relation to causal broadcast, I've also found
          it interesting to ponder the relation to Christian's concept of the
          {" "}
          <I>novelty frontier</I>. The novelty frontier between two stations,
          roughly speaking, consists of the information that is known to one but
          not the other. Can the causality guarnatees be expressed in terms of
          novelty frontiers? Does the pairwise notion of novelty frontiers
          suffice, or is a more global concept necessary?
        </Marginale>
        A related but more complicated class of guarantees stems from questions
        involving more than two stations. If station <Code>S1</Code>{" "}
        sends a message <Code>M1</Code>, and <Code>S2</Code>{" "}
        receives it and in its message handler sends a message{" "}
        <Code>M2</Code>, is any third station <Code>S3</Code> allowed to receive
        {" "}
        <Code>M2</Code> before <Code>M1</Code>? What if <Code>M2</Code>{" "}
        is the result of applying a function to <Code>M1</Code>? What if{" "}
        <Code>M1</Code> contains a fresh frequency band and <Code>M2</Code>{" "}
        contains that same frequency band?
      </P>

      <P>
        As long as we consider broadcast-based programming as nothing but a
        metaphor for structuring programs, it makes sense to deliver the
        strictest, most causality-respecting guarantees. But if we consider
        broadcast-based programming as a way programming that lends itself to
        actual distribution across physical space, this choice becomes less
        obvious. The internet protocol, for example, has extremely weak causal
        guarantees. And yet we can fairly easily implement software on top of
        it, because these guarantees can be implemented by way of sequence
        numbers, buffering, and retransmissions. Just like TCP adds ordered
        delivery to IP, it should be possible to implement more causal broadcast
        variants on top of weak ordering guarantees.
      </P>

      <P>
        TODO interaction with station creation and removal semantics/timing
      </P>

      <P>
        Speaking of buffering: our programming model has not explicitly featured
        buffering so far. In the Smalltalk world, there is no need for message
        buffering at all, because of the linear deterministic control flow. In
        our model, buffering does become a necessity: if we simulate multiple
        stations on a single processor, we need to maintain a queue of message
        handlers to execute. And even in a parallel implementation with a single
        process per station, messages might arrive faster than they can be
        processed. This necessitates buffering and/or dropping. That is a
        fundamental difference to OO: method calls in traditional OO are
        infallible, but I do not think there is an infallible broadcast receival
        mechanism that works<Marginale>
          Whether this is a fatal flaw or an upside that enables transparent
          parallelisation and distribution is a matter of perspective.
        </Marginale>{" "}
        for all possible programs on finite hardware<Marginale>
          To be fair, OO also pretends that call stacks can grow arbitrarily.
        </Marginale>.
      </P>

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

      <P>
        Moving on to other interesting aspects, there is the notion of station
        identity. A landmark of OO is the ability to pass around references to
        objects; this is strictly required because without a reference you
        cannot send a message to an object. Broadcast-based programming, in
        contrast, can do completely without references to stations: the operator
        for station creation does not need to return a value. That is quite the
        paradigm shift in practical terms, but also philosophically: what does
        it mean for the identity of a station if it cannot be references? There
        is no notion of equality of stations, and not even a direct way to even
        sense whether other stations exist. If you broadcast a message and
        nobody replies, that does not necessarily mean that nobody else is
        there. Conversely, a station that never sends a single message might
        just as well not exist<Marginale>
          Especially if all observable side-effects of the programming language
          must be triggered by sending messages that are handled by system
          stations. TODO notes on randomness-as-a-system-service and symmetry
          breaking{" "}
          <Quotes>Everything is a station</Quotes>, as the famous slogan goes.
        </Marginale>.
      </P>

      <P>
        To recapitulate, a (global-) broadcast-based programming language needs:
      </P>

      <Ul>
        <Li>An operator for sending messages.</Li>
        <Li>
          A language for defining the behaviour of a station, i.e., for defining
          which messages it sends in response to receiving messages.
        </Li>
        <Li>A statementoperator for creating new stations.</Li>
        <Li>
          If encapsulation is desired: an operator for minting new frequency
          bands.
        </Li>
        <Li>
          A definition of which scheduling and delivery orders are allowed to
          happen.
        </Li>
      </Ul>

      <P>
        The biggest downsides of this model compared to object-oriented
        programming are nondeterministic execution and the need for buffering.
        The upside that stations are significantly more loosely coupled than
        objects are.
      </P>

      <P>
        A final note for the theory nerds: it seems fairly straightforward to
        port some process calculi in the style Milner et al. to the
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
        And I expect such systems to demonstrate that <Em>techincally</Em>{" "}
        you do not need a dedicated language for specifying message handlers,
        you can probably do it with the minimal set of operators (send message,
        obtain fresh frequency band, spawn station) together with a conditional
        operator (assuming a spawn operator that supports recursion,
        alternatively an additional replication operator should do the trick).
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
