import React from 'react';

const ContentDetails = ({ movie, details, onCastClick }) => {
  if (!movie) return null;

  const voteAvg = details?.vote_average || movie.vote_average || 0;
  const matchPercent = Math.round(voteAvg * 10);

  const releaseYear = (details?.release_date || movie.release_date || '').substring(0, 4);

  const runtime = details?.runtime
    ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
    : null;

  // Derive certification/maturity rating
  const releaseDates = details?.release_dates?.results || [];
  const usRelease = releaseDates.find((r) => r.iso_3166_1 === 'US') || releaseDates[0];
  const certification = usRelease?.release_dates?.find((rd) => rd.certification)?.certification || 'PG-13';

  // Extract top cast members
  const castList = details?.credits?.cast?.slice(0, 5) || [];

  // Extract director
  const director = details?.credits?.crew?.find((c) => c.job === 'Director')?.name || 'N/A';

  // Extract genres
  const genres = details?.genres || [];

  // Production companies
  const productionCompanies = details?.production_companies?.map((p) => p.name).join(', ') || 'N/A';

  // Origin countries
  const countries = details?.origin_country?.join(', ') || details?.production_countries?.map((c) => c.name).join(', ') || 'USA';

  // Format Currency
  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  // Derive tone/vibe tags from genres
  const getVibeTags = (genreItems) => {
    const names = genreItems.map((g) => g.name.toLowerCase());
    const vibes = [];
    if (names.includes('action') || names.includes('adventure')) vibes.push('Exciting', 'Adrenaline');
    if (names.includes('comedy')) vibes.push('Witty', 'Hilarious');
    if (names.includes('drama')) vibes.push('Emotional', 'Gripping');
    if (names.includes('horror') || names.includes('thriller')) vibes.push('Chilling', 'Suspenseful');
    if (names.includes('romance')) vibes.push('Charming', 'Swoonworthy');
    if (names.includes('science fiction') || names.includes('fantasy')) vibes.push('Mind-bending', 'Imaginative');
    return vibes.length > 0 ? vibes : ['Engaging', 'Atmospheric'];
  };

  const vibeTags = getVibeTags(genres);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 text-gray-200">
      {/* Left Column (60% / 2 cols) */}
      <div className="md:col-span-2 space-y-4">
        {/* Match & Metadata Row */}
        <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
          <span className="text-green-400 font-bold">{matchPercent}% Match</span>
          <span>{releaseYear}</span>
          {runtime && <span className="border border-zinc-700 px-1.5 py-0.5 rounded text-xs">{runtime}</span>}
          <span className="border border-zinc-500 px-1.5 py-0.5 rounded text-xs font-bold text-gray-300">
            {certification}
          </span>
          <span className="border border-zinc-600 px-1 text-xs text-gray-400">HD</span>
        </div>

        {/* Overview / Synopsis */}
        <p className="text-gray-300 text-sm md:text-base leading-relaxed">
          {details?.overview || movie.overview || 'No overview available for this title.'}
        </p>

        {/* Languages */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Audio Languages:</span>
          {(details?.spoken_languages || [{ english_name: movie.original_language || 'English' }]).map((lang, idx) => (
            <span key={idx} className="bg-zinc-800 text-xs px-2.5 py-1 rounded text-gray-300">
              {lang.english_name || lang.name}
            </span>
          ))}
        </div>
      </div>

      {/* Right Column (40% / 1 col) */}
      <div className="space-y-4 text-xs md:text-sm border-t md:border-t-0 md:border-l border-zinc-800 pt-4 md:pt-0 md:pl-6">
        {/* Cast */}
        <div>
          <span className="text-gray-500 block mb-1">Cast:</span>
          <div className="flex flex-wrap gap-1">
            {castList.map((actor, idx) => (
              <button
                key={actor.id || idx}
                onClick={() => onCastClick && onCastClick(actor.name)}
                className="text-gray-300 hover:text-white hover:underline text-left cursor-pointer"
              >
                {actor.name}
                {idx < castList.length - 1 ? ',' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Genres */}
        <div>
          <span className="text-gray-500 block mb-1">Genres:</span>
          <div className="flex flex-wrap gap-1.5">
            {genres.map((g) => (
              <span key={g.id} className="bg-zinc-800 hover:bg-zinc-700 text-gray-200 px-2 py-0.5 rounded text-xs">
                {g.name}
              </span>
            ))}
          </div>
        </div>

        {/* Vibe / Tone */}
        <div>
          <span className="text-gray-500 block mb-1">This Movie Is:</span>
          <div className="flex flex-wrap gap-1.5">
            {vibeTags.map((tag, idx) => (
              <span key={idx} className="border border-zinc-700 text-gray-300 px-2 py-0.5 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Director */}
        <div>
          <span className="text-gray-500 font-medium">Director: </span>
          <span className="text-gray-300">{director}</span>
        </div>

        {/* Production & Country */}
        <div>
          <span className="text-gray-500 font-medium">Production: </span>
          <span className="text-gray-300">{productionCompanies}</span>
        </div>

        {/* Budget */}
        {details?.budget > 0 && (
          <div>
            <span className="text-gray-500 font-medium">Budget: </span>
            <span className="text-gray-300">{formatCurrency(details.budget)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentDetails;
