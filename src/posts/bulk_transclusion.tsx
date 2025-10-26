import { A, Br, Code, Em, Hr, I, Li, P, Ul } from "macromania-html";
import { Marginale, Sidenote } from "macromania-marginalia";
import { Hsection } from "macromania-hsection";
import { Quotes } from "../macros.tsx";
import { R } from "macromania-defref";

export const bulk_transclusion = {
  n: "bulk_transclusion",
  htmlTitle: "Bulk Transclusion as Reified UI",
  title: "Bulk Transclusion as Reified UI",
  date: new Date(2025, 8, 19),
  draft: true,
  summary: `TODO write summary`,
  rssLink: `https://aljoscha-meyer.de/posts/bulk_transclusion`,
  children: (
    <>
      <P>
        TLDR: Some common UI patterns — such as the timeline in microblogging,
        or the thread view in forums — could be natively supported in hypermedia
        systems with sufficiently powerful bulk transclusion operators.
        Interpreting bulk transclusion as a reification of particular UI
        patterns opens an interesting design space for building (collaborative)
        information infrastructures without implementing special-purpose
        application logic.
      </P>

      <P>
        And now to give enough context for the above to start making sense...
      </P>

      <Hr />

      <P>
        The{" "}
        <Sidenote
          note={
            <>
              For simplicity, I will only consider static web pages in this
              post. Dynamically created pages turn the web into an ad-hoc
              anything-goes fest with barely any meaningful structural
              properties to analyse.
            </>
          }
        >
          web
        </Sidenote>{" "}
        is a hypertext system. Individual webpages (like the blog post you are
        reading right now) are syntactically self-contained documents, which can
        be displayed by a suitable user interface (the browser). Hyperlinks
        (<A href="https://gwil.garden/peaches/">like this one</A>) allow for
        easy navigation between pages. Additionally, iframes provide
        transclusion: the ability to directly embed a document inside another.
        Think embedded videos from a video hosting platform, or embedded
        interactive maps from a map provider.
      </P>

      <P>
        At its essence, the web displays pages in isolation. Browsers typically
        support tabs, but those could also be simulated by opening multiple
        browsers; each rendered page is independent from every other rendered
        page. There is no native support on the web for, say, getting an
        overview of all pages hosted on a particular domain. Such sitemaps must
        explicitly be created by authors in the form of another webpage, with no
        support from the underlying platform (the web) itself.
      </P>

      <P>
        This observation is the starting point for this blog post; I will
        explore (a particular slice of) the design space around hypertext
        systems which include notions of <Em>collections</Em>{" "}
        of documents, and user interface concerns which arise from those
        notions.
      </P>

      <P>
        To give a better idea of what I mean by UIs for collections of
        documents, I will start with a few examples:
      </P>

      <Ul>
        <Li>
          A profile timeline on a microblogging service displays all{" "}
          <Quotes>tweets</Quotes>{" "}
          by the same author sequentially, sorted by creation time.
        </Li>
        <Li>
          A thread list in a forum displays the titles of threads, typically
          sorted by most recent activity.
        </Li>
        <Li>
          A file manager displays the names of files (including directories),
          typically sorted by name. A good file manager allows for plenty of
          configuration (sorting by most recent activity or by file size,
          previewing file contents, etc).
        </Li>
        <Li>
          Some platforms with comment functionality that allows for nested
          comments displays a tree of comment, often with platform-specific
          sorting criteria.
        </Li>
      </Ul>

      <P>
        There are some direct similarities between all of these examples, we can
        derive a general pattern of which these are instances:
      </P>

      <Ul>
        <Li>
          Each example aggregates several objects and linearises them according
          to some sorting criteria. For microblogging and comments, the
          aggregated objects are self-contained, as are the{" "}
          <Quotes>normal</Quotes>{" "}
          files in a file manager. Forum threads and directories in a file
          manager are themselves again linearised collections of objects.
        </Li>
        <Li>
          Objects have metadata; to unify these examples we need each object to
          have a <Em>name</Em>{" "}
          (thread name, file name), and a timestamp denoting the most recent
          update. The view aggregating the objects may or may not display that
          metadata explicitly. Note that sorting in order of original creation
          (but not rearranging when editing) can be accomplished by using the
          creation time of an object as its name, and then sorting by name. This
          is how the microblogging timeline fits into this framework.
        </Li>
        <Li>
          When dealing with nested objects, there is a choice of how much nested
          structure to display. A forum shows typically only the name of a
          thread and hides the posts behind a link, file managers typically have
          the same behaviour, comment sections might show a full heirarchy of
          comments, or they might require explicit user interaction to show
          deeply nested comments.
        </Li>
      </Ul>

      <P>
        This categorisation allows us to specify these UI patterns
        declaratively, instead of through ad-hoc logic such as the javascript
        powering a microblogging timeline. A rough list of declarative
        parameters<Marginale>
          This list is far from exhaustive, other parameters could include
          filter options, rate limits, a flag to control live updating, etc. I
          am exploring here, not trying to nail down conclusive lists.
        </Marginale>{" "}
        includes the order by which to sort (name or most recent update), which
        metadata to display, how much of the content to display, and how deeply
        to display nested hierarchies. Finally, we would need to specify{" "}
        <Em>which</Em>{" "}
        documents to aggregate in the view. How this could be done depends on
        the organisation of the underlying hypertext system. For HTML, the
        simplemost option (to which I will restrict this exposition for now)
        would be to specify a directory on some webserver, for example,
        everything in <Code>https://aljoscha-meyer.de/posts/</Code>.
      </P>

      <P>
        It is quite easy to envision web support for this kind of UI. You open a
        new tab, get a mask for selecting a directory to aggregate, how to sort,
        which metadata and data to display, how to deal with nesting, hit{" "}
        <Code>ok</Code>, and the browser issues a corresponding request to the
        server. The server replies with the set of pages which should be
        included. The browser then fetches those pages and their metadata, and
        renders the UI.
      </P>

      <P>
        What would this give us? For starters, effortless
        microblogging<Marginale>
          I am simplifying. You would not get the ability to react to posts,
          write replies, etc. I am sticking to the basics for exploring a design
          space here, not proposing a fully-featured system for decentralised
          social media.
        </Marginale>{" "}
        to anyone with a website. No need for centralised
        microblogging-as-a-service platforms, nor for custom federated
        protocols. Instead, this would simply be a part of what the web{" "}
        <Em>is</Em>.
      </P>

      <P>
        A more abstract but noteworthy property is a certain inversion of
        control: authors provide data, but the aggregation techniques are left
        to the viewers. On today’s web, authors implicitly set the one true way
        in which their documents are aggregated: when using a publishing
        platform they defer to whichever algorithm and UI patterns the platform
        provides, and for self-hosted websites the default choice is to nt have
        any aggregation at all. A web with declarative aggregating UIs would
        lift this burden of choice from authors, and let viewers choose the most
        appropriate view for whatever it is they are trying to accomplish.
      </P>

      <P>
        This alone is already pretty cool in my book. But the system I have
        sketched so far is fairly cumbersome: either viewers would need to
        re-create the same UI configurations again and again, or browsers would
        need to develop a whole set of functionality around the persistence of
        UI choices, and, ideally, their sharing and remixing. This is where we
        come to the core idea of this text: what if aggregating UIs could be
        embedded <Em>inside</Em> the documents of a hypertext system themselves?
      </P>

      <P>
        The web already has the ability to transclude individual documents via
        iframes. What if you could point an iframe not only at webpages, but
        also at directories, together with a declarative description of the UI
        it should use for aggregating the contained pages? Suddenly, we have
        reified the bulk view UI as part of the hypertext system itself, through
        the (conceptually) simple act of bulk transclusion!
      </P>

      <P>
        An immediate advantage is that the problem of managing UIs almost
        disappears. You can save UIs as regular webpages, for which there is
        already a vast hosting infrastructure, plus browser functionality such
        as bookmarks. Making a particular view available to others turns into
        the simple act of hosting some static HTML.
      </P>

      <P>
        This harkens back to the notion of bulk UIs providing an inversion of
        control for how to access and discover documents.
        Bulk-UI-as-a-browser-feature would make this inversion of control
        cumbersome to the viewers, but wiht reified bulk UI, the burden can be
        shared arbitrarily. Authors could easily specify a recommended way of
        aggregating their documents. But viewers would not be restricted to
        those recommendations, they might prefer their own UI choices — or those
        offered by a third party.
      </P>

      <P>
        <Marginale>
          A fun observation: you can easly create (mutually) recursive views,
          which would lead to infinitely deep nesting. UIs which do not unfold
          nested hierarchies indefinitely have no trouble dealing with this at
          all (think of how a file viewer would deal with cyclicly symlinked
          directories). Other UIs would need to detect this case, similar to how
          browsers must already detect iframes which contain themselves. Whereas
          browsers simply stop rendering at the first repitition of an iframe, I
          would argue that for most hypermedia systems it would make more sense
          to allow unfolding the recursion one level at a time based on user
          interaction.
        </Marginale>Another benefitial consequence is the arbitrary nesting of
        these bulk aggregations. You can aggregate documents which themselves
        contain aggregations of other documents, possibly with completely
        different UI parameters. The different renderings in forums of listing
        threads versus listing the posts inside a single thread immediately
        comes to mind. If bulk UIs were merely a browser feature, switching
        rendering needs based on levels of nesting would significantly
        complicate the declarative UI declaration.{" "}
        By reifying bulk UIs through bulk transclusion, this becomes trivial and
        highly flexible instead.
      </P>

      <P>
        In fact, one possible design choice here would be to not have any
        built-in notion of displaying nested hierarchies at all, instead fully
        relying on the fact that the documents you display can themselves
        display nested contents again. This reduces the complexity of the
        bulk-transclusion operator, but at the cost of reducing the inversion of
        control: rendering of nested hierarchies would rely on the documents
        which <Quotes>contain</Quotes>{" "}
        other documents, not on the (potentially) user-controlled transclusion
        operator.
      </P>

      {
        /*
        - at extreme: UI and bulk transclusion become the same thing (extending also to browsers, window managers, etc)
            - not just for hypermedia? good views as a service?
            - filtering, also dynamically
        - neither special-purpose logic nor no aggregation at all (you *could* implement this on todays web with fetch api and iframes, but it would miss the point)
        - multi-author (cross-domain) by displaying "duplicates"
        - which authors should be merged, and at which root? reify it!
        - merging duplicates
        - CRDTs and explicit "conflicting" state markers
        - access control?
        - notifications about new stuff, read vs unread indicators?
        - Web? Willow!
        */
      }
    </>
  ),
};
