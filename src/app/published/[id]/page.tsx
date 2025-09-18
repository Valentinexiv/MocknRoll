import Image from "next/image";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { ShareBar } from "@/components/ShareBar";

async function fetchDraft(id: string) {
  const h = await headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  const proto = h.get('x-forwarded-proto') || 'http';
  const base = host ? `${proto}://${host}` : 'http://localhost:3000';
  const res = await fetch(`${base}/api/mock-drafts/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Draft not found');
  return res.json();
}

export default async function PublishedDraftPage(ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const draft = await fetchDraft(id);
  const h = await headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  const proto = h.get('x-forwarded-proto') || 'http';
  const url = host ? `${proto}://${host}/published/${id}` : `/published/${id}`;
  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-4 flex items-center gap-3">
        <Image
          src={'/mnr_logo.png'}
          alt="Mock’n’Roll logo"
          width={40}
          height={40}
          priority
        />
        <div className="ml-auto">
          <a href="/create-draft" className="inline-block px-5 py-2.5 rounded-md bg-blue-600 text-white hover:bg-blue-700">Create a Draft</a>
        </div>
      </div>
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">{draft.title}</h1>
        <div className="text-sm opacity-70 mt-1">By {draft.authorName || 'Anonymous'}</div>
        {draft.description ? (
          <p className="mt-3 text-[15px] leading-6">{draft.description}</p>
        ) : null}
        <div className="mt-4">
          <ShareBar url={url} title={draft.title} />
        </div>
      </header>

      <article className="space-y-8">
        {draft.picks.map((p: any) => (
          <section key={p.id} className="border-t pt-6">
            <div className="flex items-center gap-3 mb-2">
              {p.team.logoUrl ? (
                <Image src={p.team.logoUrl} alt={`${p.team.name} logo`} width={28} height={28} />
              ) : null}
              <h2 className="text-lg font-semibold">
                <span className="opacity-70 mr-2">{p.pickNumber}.</span>
                {p.team.name}
              </h2>
            </div>
            {p.prospect ? (
              <div className="ml-10">
                <div className="text-[17px] font-semibold">
                  {p.prospect.name}
                  <span className="font-normal">, {p.prospect.position}</span>
                  {p.prospect.college ? <span className="opacity-70">, {p.prospect.college}</span> : null}
                </div>
                {p.commentary ? (
                  <p className="mt-3 text-[15px] leading-7">{p.commentary}</p>
                ) : null}
              </div>
            ) : (
              <div className="ml-10 text-sm opacity-70">No selection</div>
            )}
          </section>
        ))}
      </article>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const draft = await fetchDraft(id);
    const title = draft?.title ? `${draft.title} – Mock’n’Roll` : 'Mock’n’Roll Draft';
    const description = draft?.description || 'Published mock draft on Mock’n’Roll.';
    const url = `/published/${id}`;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        images: [
          { url: '/mnr_logo.png', width: 800, height: 800, alt: 'Mock’n’Roll' }
        ],
        type: 'article'
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ['/mnr_logo.png']
      }
    };
  } catch {
    return {};
  }
}


