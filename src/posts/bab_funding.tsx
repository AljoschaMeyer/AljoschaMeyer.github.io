import { A, Br, Code, Em, I, Li, P, Ul } from "macromania-html";
import { Marginale, Sidenote } from "macromania-marginalia";
import { Hsection } from "macromania-hsection";
import { Quotes } from "../macros.tsx";
import { R } from "macromania-defref";

export const bab_funding = {
  n: "bab_funding",
  htmlTitle: "Bab Introduction",
  title: "Willow News: Funding from NLnet",
  date: new Date(2025, 6, 2),
  summary:
    `The Willow project got funding for implementing a new hash function. Here I explain the gist of it.`,
  rssLink: `https://aljoscha-meyer.de/posts/bab_funding`,
  children: (
    <>
      <P>
        <A href="http://worm-blossom.org/">Worm-blossom</A>{" "}
        (<A href="https://gwil.garden/">Sam Gwilym</A>{" "}
        and I) received funding from <A href="https://nlnet.nl/">NLnet</A>{" "}
        to implement{" "}
        <A href="https://worm-blossom.github.io/bab/">Bab</A>, a new hash
        function we will use with{" "}
        <A href="https://willowprotocol.org/">Willow</A>. Why would we need yet
        another hash function, and how did we convince people to fund it? So
        glad you asked!
      </P>

      <P>
        When participants exchange data in a peer-to-peer system, they typically
        verify the integrity of the data by computing a checksum (or hash) over
        data they receive. Traditionally, this can only be done once all data
        has been transferred. If a transfer is cut short, peers cannot tell
        whether they received a valid prefix of what they wanted, or whether
        they were deliberately fed malicious data.
      </P>

      <P>
        There do exist techniques for solving this problem. A while ago, we have
        created a suitable specification called{" "}
        <Quotes>Bab</Quotes>, for usage with Willow, and we are happy to
        announce that NLNet has granted us funding to now implement this
        specification.
      </P>

      <P>
        <A href="https://worm-blossom.github.io/bab/">Bab</A>{" "}
        is a hash function designed specifically for usage in content-addressed
        storage systems, where participants request data by hash and verify the
        integrity of responses by recomputing the hash from the response data.
        With Bab, responses interleave a small amount of metadata within the
        actually requested data. This metadata allows the peer to continuously
        verify the integrity of the data that has been received so far.
      </P>

      <P>
        Why is this useful? It ensures that even large data can be transferred
        over an unreliable connection. If the connection drops during a data
        transfer, the peer can verify that it received valid data so far,
        persist it, and later resume the transfer at the point where it broke
        off. As we want Willow to operate gracefully even in unreliable
        networks, this feature is a must for us.
      </P>

      <P>
        Further, when propagating new data through a network, this optimisation
        can reduce latency. Consider a setting where Alfie is connected to
        Betty, and Betty is connected to Gemma. Alfie sends some new data to
        Betty. Gemma is also interested in that data, and would like Betty to
        forward it to her as soon as possible. Naturally, Betty should only
        forward data whose integrity she has verified, lest she unwittingly
        propagate malicious data. With traditional hash functions, she would
        have to wait for the full data to arrive before she could forward it.
        With Bab, she can stream the data as it arrives.
      </P>

      <P>
        Beyond incremental verification from the very start of the requested
        data, peers can also request arbitrary slices of data, and Bab allows
        for (incremental) verification of the response data. This is obviously
        useful when peers require access to only part of the data. But even for
        bulk transfer, slice requests open up a neat optimisation: a peer can
        request different slices from different peers in parallel, thus speeding
        up the overall download. Systems using Bab (including Willow) obtain
        this torrent-style optimisation for free.
      </P>

      <P>
        Bab is not the first hash function that provides these benefits, the
        Blake3 hash function also offers them. The name "Bab" is in fact derived
        from "Bao", a streaming verification specification based on Blake3. Why
        did we design Bab then?
      </P>

      <P>
        Bab has three main advantages over Bao. First, when given a hash, peers
        can certify the number of bytes that where hashed in a constant amount
        of space. Bao needs a logarithmic amount of space for such proofs: the
        proof size grows (slowly but still noticeably) for longer strings.
        Second, Bab is a more generic construction that allows for various
        instantiations, whereas Bao is tied to specific cryptographic
        primitives. And third, we came up with a couple of optimisations for
        verifiable streaming that have not yet been done for Bao.
      </P>

      <P>
        We plan to devote a good amount of time and energy to providing a
        high-quality implementation of Bab. The goal is twofold: in general to
        provide a go-to Rust library for all projects which should care about
        the benefits of verifiable streaming, and more specifically to be able
        to use Bab as the default hash function for payloads in Willow.
      </P>

      <P>
        Yay!
      </P>
    </>
  ),
};
