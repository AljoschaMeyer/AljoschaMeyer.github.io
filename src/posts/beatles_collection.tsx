import { Div, Em, H4, P } from "macromania-html";
import { Expression } from "macromaniajsx/jsx-dev-runtime";

export const beatles_collection = {
  n: "beatles_collection",
  htmlTitle: "Beatles",
  title: "Favourite Beatles Songs",
  date: new Date(2025, 4, 2),
  summary: `A few of my favourite Beatles songs.`,
  rssLink: `https://aljoscha-meyer.de/posts/beatles_collection`,
  children: (
    <>
      <P>
        Today, a friend told me — for the second time actually — that she barely
        knows any Beatles songs. I have taken that as an excuse to spend an
        evening going through my favourites and compiling a list!
      </P>

      <BeatlesSong
        title="I'll Follow The Sun"
        videoEmbed={`<iframe width="560" height="315" src="https://www.youtube.com/embed/28d_A_NuJ7A?si=NGxVw0FNbqoVTiKH" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`}
      />

      <BeatlesSong
        title="I Feel Fine"
        videoEmbed={`<iframe width="560" height="315" src="https://www.youtube.com/embed/xLBVgnZyuic?si=0EjHDF5xjGFJlvY1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`}
      />

      <BeatlesSong
        title="Paperback Writer"
        videoEmbed={`<iframe width="560" height="315" src="https://www.youtube.com/embed/SepZDSkY4Ro?si=2Hceq_usBgj_crM7" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`}
      />

      <BeatlesSong
        title="Got To Get You Into My Life"
        videoEmbed={`<iframe width="560" height="315" src="https://www.youtube.com/embed/r95-7zfgtLw?si=hrdfHn9w0AkII8PT" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`}
      />

      <BeatlesSong
        title="Getting Better"
        videoEmbed={`<iframe width="560" height="315" src="https://www.youtube.com/embed/EGlo9LzmOME?si=eTBzf38cHIT0hc_e" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`}
      />

      <BeatlesSong
        title="A Day In The Life"
        videoEmbed={`<iframe width="560" height="315" src="https://www.youtube.com/embed/UYeV7jLBXvA?si=JHrBmTJeHSuMP5FW" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`}
      />

      <BeatlesSong
        title="Penny Lane"
        videoEmbed={`<iframe width="560" height="315" src="https://www.youtube.com/embed/z7syIxQCquo?si=h5svgr5tIoiNkNOh" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`}
      />

      <BeatlesSong
        title="Dear Prudence"
        videoEmbed={`<iframe width="560" height="315" src="https://www.youtube.com/embed/I4xw_Dx0pIg?si=l0Osoffzn9afLJF5" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`}
      />

      <BeatlesSong
        title="I Want You (She's So Heavy)"
        videoEmbed={`<iframe width="560" height="315" src="https://www.youtube.com/embed/tAe2Q_LhY8g?si=BRrtT4krjYIZOi8c" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`}
      />

      <P style="margin-top: 2.5rem;">
        I tried to keep the above list as short as possible without being{" "}
        <Em>too</Em>{" "}
        deeply unhappy about excluding anything. With a bit more leeway, I would
        add the following songs as well.
      </P>

      <BeatlesSong
        title="Norwegian Wood"
        videoEmbed={`<iframe width="560" height="315" src="https://www.youtube.com/embed/B_RQv7OMJFI?si=PzAqM7MTKjmL5opd" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`}
      />

      <BeatlesSong
        title="If I Needed Someone"
        videoEmbed={`<iframe width="560" height="315" src="https://www.youtube.com/embed/Kt5OoWr4v1k?si=KXWaN9qWHP_vfrl7" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`}
      />

      <BeatlesSong
        title="I'm Only Sleeping"
        videoEmbed={`<iframe width="560" height="315" src="https://www.youtube.com/embed/sAG3m3p9UeI?si=Q-WoiDz-54GKwIUG" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`}
      />

      <BeatlesSong
        title="She Said She Said"
        videoEmbed={`<iframe width="560" height="315" src="https://www.youtube.com/embed/3iybCwJdudM?si=JMSh3bon2fFiqB9c" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`}
      />

      <BeatlesSong
        title="Good Day Sunshine"
        videoEmbed={`<iframe width="560" height="315" src="https://www.youtube.com/embed/6dC7ILQ_vtE?si=nBK2kFzp00iAgSlQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`}
      />

      <BeatlesSong
        title="Fixing A Hole"
        videoEmbed={`<iframe width="560" height="315" src="https://www.youtube.com/embed/UPBd8eHQqIw?si=BEx5cxsVR4kgquxk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`}
      />

      <BeatlesSong
        title="Strawberry Fields Forever"
        videoEmbed={`<iframe width="560" height="315" src="https://www.youtube.com/embed/gS_-aHQxUqw?si=asOo9COzPqIx-G-M" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`}
      />

      <BeatlesSong
        title="The Fool On The Hill"
        videoEmbed={`<iframe width="560" height="315" src="https://www.youtube.com/embed/rtnAI1hgNyI?si=s1-fBLzb3NXZ0qdl" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`}
      />

      <BeatlesSong
        title="Something"
        videoEmbed={`<iframe width="560" height="315" src="https://www.youtube.com/embed/uXRvmkQLyTc?si=ebV_imowkk_qwCQZ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`}
      />

      <BeatlesSong
        title="Blackbird"
        videoEmbed={`<iframe width="560" height="315" src="https://www.youtube.com/embed/Man4Xw8Xypo?si=0iwrFavDhq71OMhr" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`}
      />

      <BeatlesSong
        title="Because"
        videoEmbed={`<iframe width="560" height="315" src="https://www.youtube.com/embed/hL0tnrl2L_U?si=6yFNhXvTFrUVPM1Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`}
      />
    </>
  ),
};

function BeatlesSong(
  { title, videoEmbed }: { title: string; videoEmbed: string },
): Expression {
  return (
    <Div clazz="song">
      <H4>
        <exps x={title} />
      </H4>
      <exps x={videoEmbed} />
    </Div>
  );
}
