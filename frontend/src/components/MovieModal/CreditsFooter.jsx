import React from 'react';

const CreditsFooter = ({ details }) => {
  if (!details) return null;

  const director = details.credits?.crew?.find((c) => c.job === 'Director')?.name || 'N/A';
  const writers = details.credits?.crew
    ?.filter((c) => c.job === 'Screenplay' || c.job === 'Writer' || c.job === 'Story')
    .slice(0, 3)
    .map((c) => c.name)
    .join(', ') || 'N/A';

  const cast = details.credits?.cast?.slice(0, 6).map((c) => c.name).join(', ') || 'N/A';
  const genres = details.genres?.map((g) => g.name).join(', ') || 'N/A';
  const production = details.production_companies?.map((p) => p.name).join(', ') || 'N/A';

  const releaseDates = details.release_dates?.results || [];
  const usRelease = releaseDates.find((r) => r.iso_3166_1 === 'US') || releaseDates[0];
  const cert = usRelease?.release_dates?.find((rd) => rd.certification)?.certification || 'PG-13';

  const languages = details.spoken_languages?.map((l) => l.english_name || l.name).join(', ') || 'English';

  return (
    <div className="border-t border-zinc-800 p-6 bg-[#0f0f0f] rounded-b-xl text-xs space-y-4">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
        About <span className="text-white">{details.title}</span>
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <span className="text-gray-500 block mb-1">Director</span>
          <span className="text-gray-300 font-medium">{director}</span>
        </div>

        <div>
          <span className="text-gray-500 block mb-1">Writers</span>
          <span className="text-gray-300 font-medium">{writers}</span>
        </div>

        <div>
          <span className="text-gray-500 block mb-1">Cast</span>
          <span className="text-gray-300 font-medium">{cast}</span>
        </div>

        <div>
          <span className="text-gray-500 block mb-1">Genres</span>
          <span className="text-gray-300 font-medium">{genres}</span>
        </div>

        <div>
          <span className="text-gray-500 block mb-1">Production</span>
          <span className="text-gray-300 font-medium">{production}</span>
        </div>

        <div>
          <span className="text-gray-500 block mb-1">Maturity Rating</span>
          <span className="inline-block border border-zinc-600 px-1.5 py-0.5 rounded text-gray-200 font-bold mb-1">
            {cert}
          </span>
          <p className="text-gray-500 text-[10px]">Suitable for general audiences or parental guidance depending on content rating.</p>
        </div>

        <div>
          <span className="text-gray-500 block mb-1">Audio & Languages</span>
          <span className="text-gray-300 font-medium">{languages}</span>
        </div>
      </div>
    </div>
  );
};

export default CreditsFooter;
