import { Expression, Expressions } from "macromania";

import {
  A,
  Blockquote,
  Div,
  Em,
  H1,
  H2,
  I,
  Img,
  Li,
  Nav,
  Ol,
  P,
  Section,
} from "macromania-html";
import { Dir, File } from "macromania-outfs";
import { ResolveAsset } from "macromania-assets";
import { Html5 } from "macromania-html-utils";
import { CssDependency } from "macromania-previews";

export const treasures = (
  <Dir name="treasures">
    <File name="index.html">
      <Html5
        title={<>Treasures</>}
      >
        <CssDependency dep={["base.css"]} />
        <CssDependency dep={["treasures.css"]} />

        <H1>
          <A href="#">Treasures</A>
        </H1>

        <P clazz="centered">
          Some works that have been important to me.
        </P>

        <Nav id="toc">
          <Ol>
            <Li>
              <A href="#fiction">Fiction</A>
            </Li>
            <Li>
              <A href="#nonfiction" clazz="nowrap">Non-Fiction</A>
            </Li>
            <Li>
              <A href="#digital">Digital</A>
            </Li>
            <Li>
              <A href="#music">Music</A>
            </Li>
            <Li>
              <A href="#other">Other</A>
            </Li>
          </Ol>
        </Nav>

        <H2>
          <A id="fiction" href="#fiction">Fiction</A>
        </H2>

        <Section clazz="fiction">
          <MajorTreasures>
            <Treasure
              title="The Dispossessed"
              metadata={
                <>
                  <A href="https://en.wikipedia.org/wiki/Ursula_K._Le_Guin">
                    Ursula K. Le Guin
                  </A>{" "}
                  (1974)
                </>
              }
              href={["treasures", "archive", "the_dispossessed.pdf"]}
              splash={["treasures", "splash", "the_dispossessed.jpg"]}
              splashAlt="A picture of the cover of the book"
              quote={[
                <>
                  <P>
                    He asked his students to write a paper on any problem in
                    physics that interested them, and told them that he would
                    give them all the highest mark, so that the bureaucrats
                    would have something to write on their forms and lists. To
                    his surprise a good many students came to him to complain.
                    They wanted him to set the problems, to ask the right
                    questions; they did not want to think about questions, but
                    to write down the answers they had learned. And some of them
                    objected strongly to his giving everyone the same mark. How
                    could the diligent students be distinguished from the dull
                    ones? What was the good in working hard? If no competitive
                    distinctions were to be made, one might as well do nothing.
                  </P>
                  <P>
                    <Quotes>Well, of course,</Quotes> Shevek said, troubled.
                    {" "}
                    <Quotes>
                      If you do not want to do the work, you should not do it.
                    </Quotes>
                  </P>
                </>,
                <P>
                  Surely freedom lay rather in openness than in secrecy, and
                  freedom is always worth the risk.
                </P>,
                <>
                  <P>
                    <Quotes>But what,</Quotes>{" "}
                    Oiie said abruptly, as if the question, long kept back,
                    burst from him under pressure,{" "}
                    <Quotes>
                      what keeps people in order? Why don’t they rob and murder
                      each other?
                    </Quotes>
                  </P>
                  <P>
                    <Quotes>
                      Nobody owns anything to rob. If you want things you take
                      them from the depository. As for violence, well, I don’t
                      know, Oiie; would you murder me, ordinarily? And if you
                      felt like it, would a law against it stop you? Coercion is
                      the least efficient means of obtaining order.
                    </Quotes>
                  </P>
                </>,
                <P>
                  We know that there is no help for us but from one another,
                  that no hand will save us if we do not reach out our hand. And
                  the hand that you reach out is empty, as mine is. You have
                  nothing. You possess nothing. You own nothing. You are free.
                  All you have is what you are, and what you give.
                </P>,
              ]}
            >
              This <Quotes>ambiguous utopia</Quotes>{" "}
              with its flawed but beautiful anarchist society has been an
              inexhaustible font of inspiration, courage, and optimism for me.
              The world would be a better place if more people read this book.
            </Treasure>

            <Treasure
              title="The Brothers Karamazov"
              metadata={
                <>
                  <A href="https://en.wikipedia.org/wiki/Fyodor_Dostoevsky">
                    Fyodor Dostoevsky
                  </A>{" "}
                  (1880)
                </>
              }
              href={["treasures", "archive", "the_brothers_karamazov.pdf"]}
              splash={["treasures", "splash", "the_brothers_karamazov.jpg"]}
              splashAlt="A picture of the cover of the book"
              quote={[
                <P>
                  I would only ask the reader not to be in too great a hurry to
                  laugh at my young man’s pure heart. Not only have I no
                  intention of apologizing for him, of excusing and justifying
                  his simple faith on account of his youth, for instance, or the
                  little progress he had made formerly in the study of science,
                  and so on and so forth, but I will do the opposite and declare
                  firmly that I sincerely respect the nature of his heart. No
                  doubt some other young man, who takes his heart’s impressions
                  more prudently, who has already learned how to love not
                  ardently but just lukewarmly, whose thoughts, though correct,
                  are too reasonable (and therefore cheap) for his age, such a
                  young man, I say, would avoid what happened to my young man,
                  but in certain cases, really, it is more honorable to yield to
                  some passion, however unwise, if it springs from great love,
                  than not to yield to it at all.
                </P>,
                <P>
                  We are assured that the world is becoming more and more
                  united, is being formed into brotherly communion, by the
                  shortening of distance, by the transmitting thoughts through
                  the air. Alas, do not believe in such a union of people.
                  Taking freedom to mean the increase and prompt satisfaction of
                  needs, they distort their own nature, for they generate many
                  meaningless and foolish desires, habits, and the most absurd
                  fancies in themselves. They live only for mutual envy, for
                  pleasure-seeking and self-display. To have dinners, horses,
                  carriages, rank, and slaves to serve them is now considered
                  such a necessity that or the sake of it, to satisfy it, they
                  will sacrifice life, honor, the love of mankind, and will even
                  kill themselves if they are unable to satisfy it.
                </P>,
                <P>
                  My young brother asked forgiveness of the birds: it seems
                  senseless, yet it is right, for all is like an ocean, all
                  flows and connects; touch it in one place and it echoes at the
                  other end of the world. Let it be madness to ask forgiveness
                  of the birds, still it would be easier for the birds, and for
                  a child, and for any animal near you, if you yourself were
                  more gracious than you are now, if only by a drop, still it
                  would be easier. All is like an ocean, I say to you. Tormented
                  by universal love, you, too, would then start praying to the
                  birds, as if in a sort of ecstasy, and entreat them to forgive
                  you your sin. Cherish this ecstasy, however senseless it may
                  seem to people.
                </P>,
                <P>
                  The centripetal force on our planet is still fearfully strong,
                  Alyosha. I have a longing for life, and I go on living in
                  spite of logic. Though I may not believe in the order of the
                  universe, yet I love the sticky little leaves as they open in
                  spring. I love the blue sky, I love some people, whom one
                  loves you know sometimes without knowing why. I love some
                  great deeds done by men, though I’ve long ceased perhaps to
                  have faith in them, yet from old habit one’s heart prizes
                  them.
                </P>,
              ]}
            >
              Before this book, I had never entered a flow state through reading
              fiction. I did not expect to empathise with and admire Christian
              characters so deeply either. Nor could I know how timely a book
              from pre-revolutionary Russia would feel. Also, it’s a murder
              mystery? This is easily the most powerful book I know.
            </Treasure>

            <Treasure
              title="Walkaway"
              metadata={
                <>
                  <A href="https://en.wikipedia.org/wiki/Cory_Doctorow">
                    Cory Doctorow
                  </A>{" "}
                  (2017)
                </>
              }
              href="https://en.wikipedia.org/wiki/Walkaway_(Doctorow_novel)"
              splash={["treasures", "splash", "walkaway.jpg"]}
              splashAlt="A picture of the cover of the book"
              quote={[
                <P>
                  We’re not making a world without greed, Jacob. We’re making a
                  world where greed is a perversion. Where grabbing everything
                  for yourself instead of sharing is like smearing yourself with
                  shit: gross. Wrong. Our winning doesn’t mean you don’t get to
                  be greedy. It means people will be ashamed for you, will pity
                  you and want to distance themselves from you. You can be as
                  greedy as you want, but no one will admire you for it.
                </P>,
                <P>
                  Look, there are as many walkaway philosophies as there are
                  walkaways, but mine is, ‘the stories you tell come true.’{" "}
                  If you believe everyone is untrustworthy, you’ll build that
                  into your systems so that even the best people have to act
                  like the worst people to get anything done. If you assume
                  people are okay, you live a much happier life.
                </P>,
                <P>
                  Once you’ve been a shotgun person for a while, it’s hard to
                  imagine anything else, and you start using stupid terms like
                  ‘human nature’ to describe it. If being a selfish, untrusting
                  asshole is human nature, then how do we form friendships?
                  Where do families come from?
                </P>,
                <P>
                  Your dad manages to kid himself that he’s rich and powerful
                  because he’s the cream and has risen to the top. But he’s not
                  stupid. He knows he’s kidding himself. So underneath that top
                  layer of bullshit is another, more aware belief system: the
                  belief that everyone else would kid themselves the same way he
                  does, if they had the chance.
                </P>,
              ]}
            >
              I read this book at just the right point in my life: I was slowly
              leaving the bubble in which rational-minded programmers are better
              at everything than everyone else really; and Walkaway completely
              shattered that bubble in the best possible way. Many of the
              computer sciency things I do today are still informed by this
              book. It has its weaknesses, but as long as people praise
              meritocracy{" "}
              with a straight face, it deserves being read more widely.
            </Treasure>
          </MajorTreasures>

          <SmallerTreasures>
            <Treasure
              title="His Dark Materials"
              metadata={
                <>
                  <A href="https://en.wikipedia.org/wiki/Philip_Pullman">
                    Philip Pullman
                  </A>{" "}
                  (1995 – 2000)
                </>
              }
              href="https://en.wikipedia.org/wiki/His_Dark_Materials"
              splash={["treasures", "splash", "his_dark_materials.jpg"]}
              splashAlt="A picture of the cover of the book"
            >
              As far as first works to encounter that criticise religion go,
              this is an amazing one. Of all the fantasy books I devoured as a
              young teenager, this trilogy alone stayed with me.
            </Treasure>

            <Treasure
              title="The Man Outside"
              metadata={
                <>
                  <A href="https://en.wikipedia.org/wiki/Wolfgang_Borchert">
                    Wolfgang Borchert
                  </A>{" "}
                  (1946)
                </>
              }
              href="https://en.wikipedia.org/wiki/The_Man_Outside"
              splash={["treasures", "splash", "the_man_outside.jpg"]}
              splashAlt="A picture of the cover of the book"
            >
              A chilling play about a soldier returning from the war that deeply
              impressed me toward the end of school. Can we not do wars, please?
            </Treasure>

            <Treasure
              title="House of Leaves"
              metadata={
                <>
                  <A href="https://en.wikipedia.org/wiki/Mark_Z._Danielewski">
                    Mark Z. Danielewski
                  </A>{" "}
                  (2000)
                </>
              }
              href="https://en.wikipedia.org/wiki/House_of_Leaves"
              splash={["treasures", "splash", "house_of_leaves.jpg"]}
              splashAlt="A picture of the cover of the book"
            >
              Books can be <Em>weird</Em>!
            </Treasure>

            <Treasure
              title="Dune Series"
              metadata={
                <>
                  <A href="https://en.wikipedia.org/wiki/Frank_Herbert">
                    Frank Herbert
                  </A>{" "}
                  (1965 – 1985)
                </>
              }
              href="https://en.wikipedia.org/wiki/Frank_Herbert_bibliography#The_Dune_series"
              splash={["treasures", "splash", "dune.jpg"]}
              splashAlt="A picture of the cover of the first book"
            >
              Stories can be <Em>expansive</Em>.
            </Treasure>
          </SmallerTreasures>

          {`
<!--
Fiction Honorable Mentions:

- Catch 22
- The Master and Margarita
- 1984
- Island
-->
`}
        </Section>

        <H2>
          <A id="nonfiction" href="#nonfiction">Non-Fiction</A>
        </H2>

        <Section clazz="nonfiction">
          <MajorTreasures>
            <Treasure
              title="Tools for Conviviality"
              metadata={
                <>
                  <A href="https://en.wikipedia.org/wiki/Ivan_Illich">
                    Ivan Illich
                  </A>{" "}
                  (1973)
                </>
              }
              href={["treasures", "archive", "tools_for_conviviality.pdf"]}
              splash={["treasures", "splash", "tools_for_conviviality.jpg"]}
              splashAlt="A picture of the cover of the book"
              quote={[
                <P>
                  Education, the mails, social work, transportation, and even
                  civil engineering have followed this evolution. At first, new
                  knowledge is applied to the solution of a clearly stated
                  problem and scientific measuring sticks are applied to account
                  for the new efficiency. But at a second point, the progress
                  demonstrated in a previous achievement is used as a rationale
                  for the exploitation of society as a whole in the service of a
                  value which is determined and constantly revised by an element
                  of society, by one of its self-certifying professional élites.
                </P>,
                <>
                  <P>
                    People have a native capacity for healing, consoling,
                    moving, learning, building their houses, and burying their
                    dead. Each of these capacities meets a need. The means for
                    the satisfaction of these needs are abundant so long as they
                    depend primarily on what people can do for themselves, with
                    only marginal dependence on commodities. These activities
                    have use-value without having been given exchange-value.
                    Their exercise at the service of man is not considered
                    labor.
                  </P>
                  <P>
                    These basic satisfactions become scarce when the social
                    environment is transformed in such a manner that basic needs
                    can no longer be met by abundant competence. The
                    establishment of radical monopoly happens when people give
                    up their native ability to do what they can do for
                    themselves and for each other, in exchange for something
                    “better” that can be done for them only by a major tool.
                  </P>
                </>,
                <P>
                  When ends become subservient to the tools chosen for their
                  sake, the user first feels frustration and finally either
                  abstains from their use or goes mad.
                </P>,
                <P>
                  Growth has become addictive. Like heroin addiction, the habit
                  distorts basic value judgments. Addicts of any kind are
                  willing to pay increasing amounts for declining satisfactions.
                  They have become tolerant to escalating marginal disutility.
                  They are blind to deeper frustration because they are absorbed
                  in playing for always mounting stakes. Minds accustomed to
                  thinking that transportation ought to provide speedy motion
                  rather than reduction of the time and effort spent moving are
                  boggled by this contrary hypothesis.
                </P>,
              ]}
            >
              A compelling exploration of why most of everything feels pretty
              fucked up nowadays, and how things might, in principle, be changed
              for the better. Slightly uncomfortable at times, but all the more
              impressive for following a passionate, humanistic logic through
              that discomfort. Also, I love that I found a book which perfectly
              captures (and helped me clarify to myself) why I have always tried
              to keep smartphones out of my life — and that said book was
              published decades before the first smartphones existed.
            </Treasure>

            {`
<!--
Tools for Conviviality, additional excerpts
===========================================

To formulate a theory about a future society both very modern and not dominated by industry, it will be necessary to recognize natural scales and limits. We must come to admit that only within limits can machines take the place of slaves; beyond these limits they lead to a new kind of serfdom. Only within limits can education fit people into a man-made environment; beyond these limits lies the universal schoolhouse, hospital ward, or prison. Only within limits ought politics to be concerned with the distribution of maximum industrial outputs, rather than with equal inputs of either energy or information. Once these limits are recognized, it becomes possible to articulate the triadic relationship between persons, tools, and a new collectivity. <Em>Such a society, in which modern technologies serve politically interrelated individuals rather than managers, I will call <Quotes>convivial.</Quotes></Em>

---

At present people tend to relinquish the task of envisaging the future to a professional élite. They transfer power to politicians who promise to build up the machinery to deliver this future. They accept a growing range of power levels in society when inequality is needed to maintain high outputs. Political institutions themselves become draft mechanisms to press people into complicity with output goals. What is right comes to be subordinated to what is good for institutions. Justice is debased to mean the equal distribution of institutional wares.

---

Not only has the redefinition of learning as schooling made schools seem necessary, it has also compounded the poverty of the unschooled with discrimination against the uneducated. People who have climbed up the ladder of schooling know where they dropped out and how uneducated they are. Once they accept the authority of an agency to define and measure their level of knowledge, they easily go on to accept the authority of other agencies to define for them their level of appropriate health or mobility. It is difficult for them to identify the structural corruption of our major institutions.

---

The commodity called “education” and the institution called “school” make each other necessary. The circle can be broken only by a widely shared insight that the institution has come to define the purpose. Values abstractly stated are reduced to mechanical processes that enslave men. This serfdom can be broken only by the joyful self-recognition of the fool who assumes personal responsibility for his folly.

---

What is fundamental to a convivial society is not the total absence of manipulative institutions and addictive goods and services, but the balance between those tools which create the specific demands they are specialized to satisfy and those complementary, enabling tools which foster self-realization. The first set of tools produces according to abstract plans for men in general; the other set enhances the ability of people to pursue their own goals in their unique way.

---

This unqualified identification of scientific advance with the replacement of human initiative by programmed tools springs from an ideological prejudice and is not the result of scientific analysis. Science could be applied for precisely the opposite purpose. Advanced or “high” technology could become identified with labor-sparing, work-intensive decentralized productivity. Natural and social science can be used for the creation of tools, utilities, and rules available to everyone, permitting individuals and transient associations to constantly recreate their mutual relationships and their environment with unenvisaged freedom and self-expression.

---

The railroads reflected the class societies they served simply by putting different fares on the same speed. But when a society commits itself to higher speeds, the speedometer becomes an indicator of social class. Any peasant could accompany Làzaro Càrdenas on horseback. Today only his personal staff can accompany a modern governor in his private helicopter. In capitalist countries how often you can cover great distances is determined by what you can pay. In socialist countries your velocity depends on the social importance the bureaucracy attaches to you. In both cases the particular speed at which you travel puts you into your class and company. Speed is one of the means by which an efficiency-oriented society is stratified.

---

In 1945, 32 percent of all one-family housing units in Massachusetts were still self-built: either built by their owners from foundation to roof or constructed under the full responsibility of the owner. By 1970 the proportion had gone down to 11 percent. Meanwhile, <Em>housing</Em> had been discovered as a major <Em>problem</Em>. The technological capability to produce tools and materials that favor self-building had increased in the intervening decades, but social arrangements – like unions, codes, mortgage rules, and markets – had turned against this choice.

---

The human equilibrium is open. It is capable of shifting within flexible but finite parameters. People can change, but only within bounds. In contrast, the present industrial system is dynamically unstable. It is organized for indefinite expansion and the concurrent unlimited creation of new needs, which in an industrial environment soon become basic necessities.

---

The re-establishment of an ecological balance depends on the ability of society to counteract the progressive materialization of values. Otherwise man will find himself totally enclosed within his artificial creation, with no exit. Enveloped in a physical, social, and psychological milieu of his own making, he will be a prisoner in the shell of technology, unable to find again the ancient milieu to which he was adapted for hundreds of thousands of years. The ecological balance cannot be re-established unless we recognize again that only persons have ends and that only persons can work toward them. Machines only operate ruthlessly to reduce people to the role of impotent allies in their destructive progress.

---

Many more people are against cars than are against driving them. They are against cars because they pollute and because they monopolize traffic. They drive cars because they consider the pollution created by one car insignificant, and because they do not feel personally deprived of freedom when they drive. It is also difficult to be protected against monopoly when a society is already littered with roads, schools, or hospitals, when independent action has been paralyzed for so long that the ability for it seems to have atrophied, and when simple alternatives seem beyond the reach of the imagination. Monopoly is hard to get rid of when it has frozen not only the shape of the physical world but also the range of behavior and of imagination. Radical monopoly is generally discovered only when it is too late.

---

There are two ranges in the growth of tools: the range within which machines are used to extend human capability and the range in which they are used to contract, eliminate, or replace human functions. In the first, man as an individual can exercise authority on his own behalf and therefore assume responsibility. In the second, the machine takes over – first reducing the range of choice and motivation in both the operator and the client, and second imposing its own logic and demand on both. Survival depends on establishing procedures which permit ordinary people to recognize these ranges and to opt for survival in freedom, to evaluate the structure built into tools and institutions so they can exclude those which by their structure are destructive, and control those which are useful. Exclusion of the malignant tool and control of the expedient tool are the two major priorities for politics today.

---

Above all, political discussion is stunned by a delusion about science. This term has come to mean an institutional enterprise rather than a personal activity, the solving of puzzles rather than the unpredictably creative activity of individual people. Science is now used to label a spectral production agency which turns out better knowledge just as medicine produces better health. The damage done by this misunderstanding about the nature of knowledge is even more fundamental than the damage done to the conceptions of health, education, or mobility by their identification with institutional outputs. False expectations of better health corrupt society, but they do so in only one particular sense. They foster a declining concern with healthful environments, healthy life styles, and competence in the personal care of one’s neighbor. Deceptions about health are circumstantial. The institutionalization of knowledge leads to a more general and degrading delusion. It makes people dependent on having their knowledge produced for them. It leads to a paralysis of the moral and political imagination.

---

Large institutions can quite suddenly lose their respectability, their legitimacy, and their reputation for serving the public good. It happened to the Roman Church in the Reformation, to Royalty in the Revolution.

-->
`}

            <Treasure
              title="Computer Power and Human Reason"
              metadata={
                <>
                  <A href="https://en.wikipedia.org/wiki/Joseph_Weizenbaum">
                    Joseph Weizenbaum
                  </A>{" "}
                  (1976)
                </>
              }
              href={[
                "treasures",
                "archive",
                "computer_power_and_human_reason.pdf",
              ]}
              splash={[
                "treasures",
                "splash",
                "computer_power_and_human_reason.jpg",
              ]}
              splashAlt="A picture of the cover of the book"
              quote={[
                <P>
                  <Quotes>
                    The scientific man has above all things to strive at
                    self-elimination in his judgements,
                  </Quotes>{" "}
                  wrote Karl Pearson in 1892. Of the many scientists I know,
                  only a very few would disagree with that statement. Yet it
                  must be acknowledged that it urges man to strive to become a
                  disembodied intelligence, to himself become an instrument, a
                  machine. So far has man’s initially so innocent liaison with
                  prostheses and pointer readings brought him. And upon a
                  culture so fashioned burst the computer.
                </P>,
                <P>
                  Power is nothing if it is not the power to choose.
                  Instrumental reasoning can make decisions, but there is all
                  the difference between deciding and choosing.
                </P>,
                <>
                  <P>
                    Horkeimer, long before computers became a fetish and gave
                    concrete form to the eclipse of reason, gave us the needed
                    perspective:
                  </P>
                  <Blockquote>
                    <Quotes>
                      Justice, equality, happiness, tolerance, all the concepts
                      that ... were in preceding centuries supposed to be
                      inherent in or sanctioned by reason, have lost their
                      intellectual roots. They are still aims and ends, but
                      there is no rational agency authorized to appraise and
                      link them to an objective reality. Endorsed by venerable
                      historical documents, they may still enjoy a certain
                      prestige, and some are contained in the supreme law of the
                      greatest countries. Nevertheless, they lack any
                      confirmation by reason in its modern sense. Who can say
                      that any one of these ideals is more closely related to
                      truth than its opposite? According to the philosophy of
                      the average modern intellectual, there is only one
                      authority, namely, science, conceived as the
                      classification of facts and the calculation of
                      probabilities. The statement that justice and freedom are
                      better in themselves than injustice and oppression is
                      scientifically unverifiable and useless. It has come to
                      sound as meaningless in itself as would the statement that
                      red is more beautiful than blue, or that an egg is better
                      than milk.
                    </Quotes>{" "}
                    [M. Horkeimer, <I>Eclipse of Reason</I>, 1947]
                  </Blockquote>
                </>,
                <P>
                  It may be that social services such as welfare could have been
                  administered by humans exercising human judgment if the
                  dispensing of such services were organized around
                  decentralized, indigenous population groupings, such as
                  neighborhoods and natural regions. But the computer was used
                  to automate the administration of social services and to
                  centralize it along established political lines. If the
                  computer had not facilitated the perpetuation and{" "}
                  <Quotes>improvement</Quotes>{" "}
                  of existing welfare distribution systems — hence of their
                  philosophical rationales — perhaps someone might have thought
                  of eliminating much of the need for welfare by, for example,
                  introducing negative income tax. The very erection of an
                  enormously large and complex computer based welfare
                  administration apparatus, however, created an interest in its
                  maintenance and therefore in the perpetuation of the welfare
                  system itself. And such interests soon become substantial
                  barriers to innovation even if good reasons to innovate later
                  accumulate. In other words, many of the problems of growth and
                  complexity that pressed insistently and irresistibly for
                  response during the postwar decades could have served as
                  incentives for social and political innovation. An enormous
                  acceleration of social invention, had it begun then, would now
                  seem to us as natural a consequence of man’s predicament in
                  that time as does the flood of technological invention and
                  innovation that was actually stimulated.
                </P>,
                <>
                  <P>
                    It is a widely held but a grievously mistaken belief that
                    civil courage finds exercise only in the context of
                    world-shaking events. To the contrary, its most arduous
                    exercise is often in those small contexts in which the
                    challenge is to overcome the fears induced by petty concerns
                    over career, over our relationships to those who appear to
                    have power over us, over whatever may disturb the tranquil-
                    ity of our mundane existence.
                  </P>
                  <P>
                    If this book is to be seen as advocating anything, then let
                    it be a call to this simple kind of courage.
                  </P>
                </>,
              ]}
            >
              The one book that every (computer) scientist should read.
            </Treasure>

            <Treasure
              title="Mindstorms"
              metadata={
                <>
                  <A href="https://en.wikipedia.org/wiki/Seymour_Papert">
                    Seymour Papert
                  </A>{" "}
                  (1980)
                </>
              }
              href={["treasures", "archive", "mindstorms.pdf"]}
              splash={["treasures", "splash", "mindstorms.jpg"]}
              splashAlt="A picture of the cover of the book"
              quote={[
                <P>
                  In many schools today, the phrase{" "}
                  <Quotes>computer-aided instruction</Quotes>{" "}
                  means making the computer teach the child. One might say the
                  computer is being used to program the child. In my vision, the
                  child programs the computer and, in doing so, both acquires a
                  sense of mastery over a piece of the most modern and powerful
                  technology and establishes an intimate contact with some of
                  the deepest ideas from science, from mathematics, and from the
                  art of intellectual model building.
                </P>,
                <P>
                  By deliberately learning to imitate mechanical thinking, the
                  learner becomes able to articulate what mechanical thinking is
                  and what it is not. The exercise can lead to greater
                  confidence about the ability to choose a cognitive style that
                  suits the problem. Analysis of{" "}
                  <Quotes>mechanical thinking</Quotes>{" "}
                  and how it is different from other kinds and practice with
                  problem analysis can result in a new degree of intellectual
                  sophistication. By providing a very concrete, down-to-earth
                  model of a particular style of thinking, work with the
                  computer can make it easier to understand that there is such a
                  thing as a <Quotes>style of thinking.</Quotes>{" "}
                  And giving children the opportunity to choose one style or
                  another provides an opportunity to develop the skill necessary
                  to choose between styles. Thus instead of inducing mechanical
                  thinking, contact with computers could turn out to be the best
                  conceivable antidote to it. And for me what is most important
                  in this is that through these experiences these children would
                  be serving their apprenticeships as epistemologists, that is
                  to say learning to think articulately about thinking.
                </P>,
                <P>
                  Juggling and writing an essay seem to have little in common if
                  one looks at the product. But the processes of learning both
                  skills have much in common. By creating an intellectual
                  environment in which the emphasis is on process we give people
                  with different skills and interests something to talk about.
                  By developing expressive languages for talking about process
                  and by recasting old knowledge in these new languages we can
                  hope to make transparent the barriers separating disciplines.
                  In the schools math is math and history is history and
                  juggling is outside the intellectual pale. Time will tell
                  whether schools can adapt themselves. What is more important
                  is understanding the recasting of knowledge into new forms.
                </P>,
                <P>
                  A child (and, indeed, perhaps most adults) lives in a world in
                  which everything is only partially understood: well enough
                  perhaps, but never completely. For many, understanding the
                  Turtle’s action so completely that there is nothing more to
                  say about it is a rare, possibly unique, experience. For some
                  it is an exhilarating one: We can see this by the children’s
                  eagerness to explain what they have understood. For all it is
                  a better model of the crispness of analytic knowledge than
                  most people ever encounter.
                </P>,
              ]}
            >
              The <Em>other</Em>{" "}
              one book that every (computer) scientist should read. Whereas
              Weizenbaum calls out societal harm caused by unreflecting
              technologists, Papert offers an empowering vision of how computers
              could enrich society’s capability for reflection and epistemology.
            </Treasure>

            {`
<!--
Mindstorms, Additional Excerpts
===============================

Our culture is relatively poor in models of systematic procedures.
Until recently there was not even a name in popular language for programming,
let alone for the ideas needed to do so successfully.
There is no word for "nested loops" and no word for the double-counting bug.
Indeed, there are no words for the powerful ideas computerists refer to as "bug" and "debugging."

Without the incentive or the materials to build powerful, concrete ways to think about problems involving
systematicity, children are forced to approach such problems in a groping, abstract fashion.

---

The ethic of school has rubbed off too well. What we see as a good
program with a small bug, the child sees as "wrong," "bad," "a mistake."
School teaches that errors are bad; the last thing one wants to do is
to pore over them, dwell on them, or think about them. The child is glad
to take advantage of the computer’s ability to erase it all without any
trace for anyone to see. The debugging philosophy suggests an opposite
attitude. Errors benefit us because they lead us to study what
happened, to understand what went wrong, and, through understanding, to
fix it. Experience with computer programming leads children more
effectively than any other activity to "believe in" debugging.

---

Robert, a seventh grader, expressed his conversion to this style of programming by exclaiming:
"See, all my procedures are mind-sized bites." Robert amplified the metaphor by comments such as:
"I used to get mixed up by my programs. Now I don’t bite off more than I can chew." He had met a powerful idea:
It is possible to build a large intellectual system without ever making a step that cannot be comprehended.
And building with a hierarchical structure makes it possible to grasp the system as a whole,
that is to say, to see the system as "viewed from the top."

---

But I was painfully aware that some people who could not under-
stand the differential could easily do things I found much more dif-
ficult. Slowly I began to formulate what I still consider the funda-
mental fact about learning: Anything is easy if you can assimilate
it to your collection of models. If you can’t, anything can be pain-
fully difficult.

---

What an
individual can learn, and how he learns it, depends on what models
he has available. This raises, recursively, the question of how he
learned these models. Thus the "laws of learning" must be about
how intellectual structures grow out of one another and about how,
in the process, they acquire both logical and emotional form.

---

The computer can be a mathematics-speaking and an alphabetic-speaking entity. We are learning
how to make computers with which children love to communicate.
When this communication occurs, children learn mathematics as a
living language. Moreover, mathematical communication and alphabetic communication are thereby both transformed from the
alien and therefore difficult things they are for most children into
natural and therefore easy ones. The idea of "talking mathematics"
to a computer can be generalized to a view of learning mathematics
in "Mathland"; that is to say, in a context which is to learning
mathematics what living in France is to learning French.

---

It is generally
assumed that children cannot learn formal geometry until well into
their school years and that most cannot learn it too well even then.
But we can quickly see that these assumptions are based on ex-
tremely weak evidence by asking analogous questions about the
ability of children to learn French. If we had to base our opinions
on observation of how poorly children learned French in American
schools, we would have to conclude that most people were incapa-
ble of mastering it.

---

And in teaching the
computer how to think, children embark on an exploration about
how they themselves think. The experience can be heady: Thinking
about thinking turns the child into an epistemologist, an experience
not even shared by most adults.


---

Imagine that children were
forced to spend an hour a day drawing dance steps on squared pa-
per and had to pass tests in these "dance facts" before they were al-
lowed to dance physically. Would we not expect the world to be full
of "dancophobes"? Would we say that those who made it to the
dance floor and music had the greatest "aptitude for dance"? In
my view, it is no more appropriate to draw conclusions about math-
ematical aptitude from children’s unwillingness to spend many
hundreds of hours doing sums.

---

The children can see perfectly well that the teacher does not like
math any more than they do and that the reason for doing it is sim-
ply that it has been inscribed into the curriculum. All of this erodes
children’s confidence in the adult world and the process of educa-
tion. And I think it introduces a deep element of dishonesty into
the educational relationship.

Children perceive the school’s rhetoric about mathematics as
double talk. In order to remedy the situation we must first ac-
knowledge that the child’s perception is fundamentally correct. The
kind of mathematics foisted on children in schools is not meaning-
ful, fun, or even very useful.

-->
`}
          </MajorTreasures>

          <SmallerTreasures>
            <Treasure
              title="Seeing Like A State"
              metadata={
                <>
                  <A href="https://en.wikipedia.org/wiki/James_C._Scott">
                    James C. Scott
                  </A>{" "}
                  (1998)
                </>
              }
              href="https://en.wikipedia.org/wiki/Seeing_Like_a_State"
              splash={["treasures", "splash", "seeing_like_a_state.jpg"]}
              splashAlt="A picture of the cover of the book"
            >
              Having been trained as a computer engineer to see complexity and
              inefficiency as purely negative, this book helped me to see their
              benefits as well. Which, given that the world is full of
              (superficial) inefficiencies, greatly improved my peace of mind.
            </Treasure>

            <Treasure
              title="Debt: The First 5,000 Years"
              metadata={
                <>
                  <A href="https://en.wikipedia.org/wiki/David_Graeber">
                    David Graeber
                  </A>{" "}
                  (2011)
                </>
              }
              href="https://en.wikipedia.org/wiki/Debt:_The_First_5,000_Years"
              splash={["treasures", "splash", "debt.jpg"]}
              splashAlt="A picture of the cover of the book"
            >
              A hopeful reminder that financial realities can and have shifted a
              great deal over time. Also a fascinating collection of
              not-quite-general knowledge on what humans have been up to over
              the last millenia.
            </Treasure>

            <Treasure
              title="Lockhart’s Lament"
              metadata={
                <>
                  Paul Lockhart (2002)
                </>
              }
              href={["treasures", "archive", "lockharts_lament.pdf"]}
              splash={["treasures", "splash", "lockharts_lament.jpg"]}
              splashAlt="A figure from the essay"
            >
              I recommend this short essay to anyone who struggles to understand
              how some people can find fulfilment in mathematics. And to anyone
              who <Em>does</Em>{" "}
              find fulfilment in mathematics but struggles to communicate why.
            </Treasure>
          </SmallerTreasures>
        </Section>

        <H2>
          <A id="digital" href="#digital">Digital</A>
        </H2>

        <Section clazz="digital">
          <SmallerTreasures>
            <Treasure
              title="Inventing on Principle"
              metadata={
                <>
                  <A href="https://worrydream.com/">Bret Victor</A>
                </>
              }
              href="https://vimeo.com/906418692"
              splash={[
                "treasures",
                "splash",
                "inventing_on_principle.jpg",
              ]}
              splashAlt="A still from the presentation"
              horizontal
            >
              Bret Victor has been my most direct source of inspiration and
              endurance as well as self-doubt and depression with respect to
              working with computers. Anyone willing to reflect on the practice
              of programming probably benefits from absorbing his output.
            </Treasure>

            <Treasure
              title="BeepBox"
              metadata={
                <>
                  <A href="https://johnnesky.com/">John Nesky</A>
                </>
              }
              href="https://www.beepbox.co"
              splash={[
                "treasures",
                "splash",
                "beepbox.jpg",
              ]}
              splashAlt="A screenshot of the workstation of BeepBox"
              horizontal
            >
              When my chronic wrist pain was at its worst, this website was my
              primary way of making music. I don’t want to know how badly I’d
              have done during that time without this gem.
            </Treasure>

            <Treasure
              title="The Future Will be Technical"
              metadata={
                <>
                  <A href="https://coolguy.website">Zach Mandeville</A> (2017?)
                </>
              }
              href="https://coolguy.website/the-future-will-be-technical/index.html"
              splash={[
                "treasures",
                "splash",
                "the_future_will_be_technical.gif",
              ]}
              splashAlt="Hermies, the hermit crab logo of secure scuttlebutt, scuttling along"
              horizontal
            >
              Zach beautifully captured the optimism some dozens of us nerds
              used to shared on{" "}
              <A href="https://scuttlebutt.nz/">Secure Scuttlebutt</A>. The
              community has drifted apart, but for me, the wonder will always
              stay.
            </Treasure>

            <Treasure
              title="This is Fine"
              metadata={
                <>
                  <A href="https://shiba.computer/">Cade Diehm</A> (2020)
                </>
              }
              href="https://newdesigncongress.org/en/pub/this-is-fine/"
              splash={[
                "treasures",
                "splash",
                "this_is_fine.jpg",
              ]}
              splashAlt="The title splash image of the article"
              horizontal
            >
              Cade beautifully tore apart the optimism we shared on Secure
              Scuttlebutt. Being called out in this essay strongly affected how
              I try to approach systems design now.
            </Treasure>

            <Treasure
              title="What Football Will Look Like in the Future"
              metadata={
                <>
                  <A href="https://en.wikipedia.org/wiki/Jon_Bois">Jon Bois</A>
                  {" "}
                  (2017)
                </>
              }
              href="https://www.sbnation.com/a/17776-football"
              splash={[
                "treasures",
                "splash",
                "17776.jpg",
              ]}
              splashAlt="A screenshot of this article about football"
              horizontal
            >
              The best article about American football I ever read. Also the
              only article about American football I ever read. Something is
              terribly wrong.
            </Treasure>
          </SmallerTreasures>
        </Section>

        <H2>
          <A id="music" href="#music">Music</A>
        </H2>

        <P clazz="centered" style="max-width: 33rem;">
          This section was difficult to narrow down. I’m going with a
          chronologically sorted selection of works or performances, each of
          which has shaped different parts of my musical understanding. And I’m
          omitting a painful amount of fantastic music...
        </P>

        <Section clazz="music">
          <SmallerTreasures>
            <Treasure
              title="Sonata No. 1 in G minor for solo violin, BWV 1001"
              metadata={
                <>
                  <A href="https://en.wikipedia.org/wiki/Johann_Sebastian_Bach">
                    Johann Sebastian Bach
                  </A>{" "}
                  (1720)
                </>
              }
              href="https://www.youtube.com/watch?v=lpDaLZsZS4c"
              splash={["treasures", "splash", "bach_violin.jpg"]}
              splashAlt="First page of the autograph"
            >
              When I learned about double stops on the violin, I asked my dad
              whether it wouldn’t then be possible to write polyphonic music for
              the violin. He showed me the fugue from this sonata in response,
              which has stayed with me since that day.
            </Treasure>

            <Treasure
              title="Piano Sonata No. 15 in D major, Op. 28"
              metadata={
                <>
                  <A href="https://en.wikipedia.org/wiki/Ludwig_van_Beethoven">
                    Ludwig van Beethoven
                  </A>{" "}
                  (1801)
                </>
              }
              href="https://www.youtube.com/watch?v=Y-8UY81DSTw"
              splash={["treasures", "splash", "beethoven_pastorale.png"]}
              splashAlt="First page of the first movement"
            >
              Far from the first piano piece I fell in love with, but I adore
              how so much beauty comes from such relative simplicity.
            </Treasure>

            <Treasure
              title="Paulus"
              metadata={
                <>
                  <A href="https://en.wikipedia.org/wiki/Felix_Mendelssohn">
                    Felix Mendelssohn Bartholdy
                  </A>{" "}
                  (1836)
                </>
              }
              href="https://www.youtube.com/watch?v=moYGGxOcJtE"
              splash={["treasures", "splash", "mendelssohn.jpg"]}
              splashAlt="A picture of Mendelssohn"
            >
              I was immensely lucky to go to a school whose choir performed
              larger pieces such as this one. The intense joy of singing in a
              group does not compare to anything else.
            </Treasure>

            <Treasure
              title="Violin Concerto No. 1"
              metadata={
                <>
                  <A href="https://en.wikipedia.org/wiki/Dmitri_Shostakovich">
                    Dmitri Shostakovich
                  </A>{" "}
                  (1955)
                </>
              }
              href="https://www.youtube.com/watch?v=moYGGxOcJtE"
              splash={["treasures", "splash", "shostakovich.jpg"]}
              splashAlt="A picture of Shostakovich"
            >
              To me, the passacaglia is the most beautiful thing ever created by
              a human being. That is all.
            </Treasure>

            <Treasure
              title="The Velvet Underground & Nico"
              metadata={
                <>
                  <A href="https://en.wikipedia.org/wiki/The_Velvet_Underground">
                    The Velvet Underground
                  </A>{" "}
                  & <A href="https://en.wikipedia.org/wiki/Nico">Nico</A> (1967)
                </>
              }
              href="https://www.youtube.com/watch?v=4RDF0dkjyEM&list=OLAK5uy_ngt5QCFCxWPcpApM_frvpcbOKJPtAKbpo&index=2"
              splash={["treasures", "splash", "velvet_underground_nico.jpg"]}
              splashAlt="The album cover"
            >
              I grew up almost exclusively listening to classical music. The raw
              intensity of music such as this album makes me glad I eventually
              explored beyond that.
            </Treasure>

            <Treasure
              title="Song to a Seagull"
              metadata={
                <>
                  <A href="https://en.wikipedia.org/wiki/Joni_Mitchell">
                    Joni Mitchell
                  </A>{" "}
                  (1968)
                </>
              }
              href="https://www.youtube.com/watch?v=8PGITZmJrkE"
              splash={["treasures", "splash", "song_to_a_seagull.jpg"]}
              splashAlt="The album cover"
            >
              Early after branching out of purely classical music into more
              popular stuff, I got stuck in a spiral of increasingly chaotic,
              intellectual, and frankly <Em>ugly</Em>{" "}
              music (John Zorn can lead down a slippery slope). Joni’s music
              broke me out of that.
            </Treasure>

            <Treasure
              title="Wisconsin ’69 (Appleton)"
              metadata={
                <>
                  <A href="https://en.wikipedia.org/wiki/Frank_Zappa">
                    Frank Zappa
                  </A>{" "}
                  &{" "}
                  <A href="https://en.wikipedia.org/wiki/The_Mothers_of_Invention">
                    The Mothers of Invention
                  </A>{" "}
                  (1969)
                </>
              }
              href="https://www.youtube.com/watch?v=wJSVufRuro0"
              splash={["treasures", "splash", "zappa_appleton.jpg"]}
              splashAlt="The album cover"
            >
              This is just really good, ok?
            </Treasure>

            <Treasure
              title="The Köln Concert"
              metadata={
                <>
                  <A href="https://en.wikipedia.org/wiki/Keith_Jarrett">
                    Keith Jarrett
                  </A>{" "}
                  (1975)
                </>
              }
              href="https://www.youtube.com/watch?v=rATrCj2qnts&list=OLAK5uy_nwpyUBiL5MJl7ZulPu7PfbR_7ZaKN_Fm4"
              splash={["treasures", "splash", "jarrett.jpg"]}
              splashAlt="The album cover"
            >
              Listening to this record at the age of thirteen turned music from
              something that was always just there into something magnificent
              and painful and wonderous and overwhelming.
            </Treasure>

            <Treasure
              title="Live in Berlin 1991"
              metadata={
                <>
                  <A href="https://en.wikipedia.org/wiki/The_Lounge_Lizards">
                    The Lounge Lizards
                  </A>{" "}
                  (1991)
                </>
              }
              href="https://www.youtube.com/watch?v=2njV16CtqOk"
              splash={["treasures", "splash", "lounge_lizards.jpg"]}
              splashAlt="The album cover"
            >
              While I do enjoy jazz music, quite a lot of jazz sounds like quite
              a lot of other jazz from a certain distance. But then there are
              musicians like John Lurie.
            </Treasure>

            <Treasure
              title="10/18/95 - Philadelphia, PA @ The Electric Factory"
              metadata={
                <>
                  <A href="https://en.wikipedia.org/wiki/Sonic_Youth">
                    Sonic Youth
                  </A>{" "}
                  (1995)
                </>
              }
              href="https://www.youtube.com/watch?v=V3oFoFTvGN8"
              splash={["treasures", "splash", "sonic_youth.jpg"]}
              splashAlt="A poster for the concert"
            >
              The first bit of music I heard by Sonic Youth. I clearly recall
              feeling completely stunned by the opening track, as if I had never
              properly heard guitars before.
            </Treasure>

            <Treasure
              title="Grand Opening and Closing"
              metadata={
                <>
                  <A href="https://en.wikipedia.org/wiki/Sleepytime_Gorilla_Museum">
                    Sleepytime Gorilla Museum
                  </A>{" "}
                  (2001)
                </>
              }
              href="https://www.youtube.com/watch?v=XsNRxgzk4sQ&list=OLAK5uy_nlcV6f7sKsjjzTHrrgTw4JqYNFuR-n_gs&index=2"
              splash={["treasures", "splash", "grand_opening_and_closing.jpg"]}
              splashAlt="The album cover"
            >
              When I first listened to this album, I did not like it. But I
              sensed that I <Em>could</Em>{" "}
              like it. So I listened to it again, and again, and again. And at
              some point, it had become my favourite piece of recorded music.
            </Treasure>

            <Treasure
              title="NPR MUSIC FRONT ROW 2014"
              metadata={
                <>
                  <A href="https://en.wikipedia.org/wiki/Tune-Yards">
                    tUnE-yArDs
                  </A>{" "}
                  (2014)
                </>
              }
              href="https://www.youtube.com/watch?v=sj1C7BFcnvI"
              splash={["treasures", "splash", "tune_yards.jpg"]}
              splashAlt="A fotograph of Merrill Garbus during the concert"
            >
              I greatly admire when anyone can channel and shape energy like
              this. I do not dance, but if I did, it would be to music such as
              this.
            </Treasure>

            <Treasure
              title="Live at House of Blues 2018"
              metadata={
                <>
                  <A href="https://en.wikipedia.org/wiki/Punch_Brothers">
                    Punch Brothers
                  </A>{" "}
                  (2018)
                </>
              }
              href="https://www.youtube.com/watch?v=FWCH_h8SEuo"
              splash={["treasures", "splash", "punch_brothers.jpg"]}
              splashAlt="A fotograph of the band during the concert"
            >
              I have always considered bands as a continuation of the tradition
              of classical chamber music. The Punch Brothers make some of my
              favourite contemporary chamber music.
            </Treasure>
          </SmallerTreasures>
        </Section>

        <H2>
          <A id="other" href="#other">Other</A>
        </H2>

        <Section clazz="other">
          <SmallerTreasures>
            <Treasure
              title="Psychotherapy"
              href="https://en.wikipedia.org/wiki/Psychotherapy"
              horizontal
            >
              Turns out a far-reaching abscence of pleasant anticipation or joy
              over several years does not mean you are an ungrateful failure,
              and admits effective treatment. Going into therapy was an almost
              impossibly difficult step, but also the best decision of my life.
            </Treasure>
          </SmallerTreasures>
        </Section>

        <Div id="hundertwasser">
          <A href="https://en.wikipedia.org/wiki/Friedensreich_Hundertwasser">
            <Img
              alt="A painting by Hundertwasser: 'Die Häuser hängen unter den Wiesen'"
              src={
                <ResolveAsset
                  asset={[
                    "treasures",
                    "splash",
                    "hundertwasser.jpg",
                  ]}
                />
              }
            />
          </A>
        </Div>

        <P clazz="centered" style="margin-top: 6rem;">
          <A href="/" style="color: inherit;">Home</A>
        </P>
      </Html5>
    </File>
  </Dir>
);

type TreasureProps = {
  children?: Expressions;
  title: Expressions;
  metadata?: Expressions;
  href: string | string[];
  splash?: string | string[] | { other: Expressions };
  splashAlt?: Expressions;
  quote?: Expressions | Expressions[];
  horizontal?: boolean;
};

function Treasure(
  { children, title, metadata, href, splash, splashAlt, quote, horizontal }:
    TreasureProps,
): Expression {
  return (
    <Div clazz="treasure">
      <Div clazz={horizontal ? "horisplash" : "vertsplash"}>
        {splash === undefined
          ? <Div></Div>
          : (typeof splash === "object" && "other" in splash
            ? <exps x={splash.other} />
            : (
              <Div>
                <A
                  href={typeof href === "string"
                    ? href
                    : <ResolveAsset asset={href} />}
                >
                  <Img
                    src={typeof splash === "string"
                      ? splash
                      : <ResolveAsset asset={splash} />}
                    alt={<exps x={splashAlt} />}
                  />
                </A>
              </Div>
            ))}
        <Div>
          <Div clazz="metadata">
            <A
              href={typeof href === "string"
                ? href
                : <ResolveAsset asset={href} />}
              clazz={typeof href === "string" ? [] : "pdf"}
            >
              <exps x={title} />
            </A>
            <Div>
              <exps x={metadata} />
            </Div>
          </Div>

          {children === undefined ? "" : (
            <Div clazz="commentary">
              <exps x={children} />
            </Div>
          )}

          {quote === undefined ? "" : (
            Array.isArray(quote)
              ? (
                <exps
                  x={quote.map((q) => (
                    <Blockquote>
                      <exps x={q} />
                    </Blockquote>
                  ))}
                />
              )
              : (
                <Blockquote>
                  <exps x={quote} />
                </Blockquote>
              )
          )}
        </Div>
      </Div>
    </Div>
  );
}

function MajorTreasures(
  { children }: { children: Expressions },
): Expression {
  return (
    <Div clazz="majorTreasures">
      <exps x={children} />
    </Div>
  );
}

function SmallerTreasures(
  { children }: { children: Expressions },
): Expression {
  return (
    <Div clazz="smallerTreasures">
      <exps x={children} />
    </Div>
  );
}

function Quotes(
  { children }: { children: Expressions },
): Expression {
  return (
    <>
      “<exps x={children} />”
    </>
  );
}
