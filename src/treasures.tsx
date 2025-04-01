import { Expression, Expressions } from "macromania";

import {
  A,
  Blockquote,
  Div,
  Em,
  H1,
  H2,
  Img,
  Li,
  Nav,
  P,
  Section,
  Ul,
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
          Treasures
        </H1>

        <P clazz="centered">
          Works that have been important to me.
        </P>

        <Nav>
          <Ul>
            <Li>
              <A href="#fiction">Fiction</A>
            </Li>
            <Li>
              <A href="#nonfiction">Non-Fiction</A>
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
          </Ul>
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
                      what keeps people in order? Why don't they rob and murder
                      each other?
                    </Quotes>
                  </P>
                  <P>
                    <Quotes>
                      Nobody owns anything to rob. If you want things you take
                      them from the depository. As for violence, well, I don't
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
              The world would be a better place if more people had read this
              book.
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
                  more prudently who has already learned how to love not
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
                  If you believe everyone is untrustworthy, you'll build that
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
          To be filled in later.
        </Section>

        <H2>
          <A id="digital" href="#digital">Digital</A>
        </H2>

        <Section clazz="digital">
          To be filled in later.
        </Section>

        <H2>
          <A id="music" href="#music">Music</A>
        </H2>

        <Section clazz="music">
          To be filled in later.
        </Section>

        <H2>
          <A id="other" href="#other">Other</A>
        </H2>

        <Section clazz="other">
          To be filled in later.
        </Section>
      </Html5>
    </File>
  </Dir>
);

type TreasureProps = {
  children: Expressions;
  title: Expressions;
  metadata?: Expressions;
  href: string | string[];
  splash?: string | string[] | { other: Expressions };
  splashAlt?: Expressions;
  quote?: Expressions | Expressions[];
};

function Treasure(
  { children, title, metadata, href, splash, splashAlt, quote }: TreasureProps,
): Expression {
  return (
    <Div clazz="treasure">
      <Div clazz="vertsplash">
        {splash === undefined
          ? ""
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
            >
              <exps x={title} />
            </A>
            <Div>
              <exps x={metadata} />
            </Div>
          </Div>

          <Div clazz="commentary">
            <exps x={children} />
          </Div>

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
