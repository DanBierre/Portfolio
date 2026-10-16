#!/usr/bin/env bash
# Cuts the hero's Japan shots from the raw Mixkit 1080p clips (media-src/japan, not in git) and grades
# them into one night-film look that sits on the site's warm charcoal and gold. Only the base grade is
# baked here: halation, film burn, flash frames, motion blur and time warp are added live by the hero's
# WebGL renderer, so baking them too would double them.
#   bash scripts/cut-japan-clips.sh           -> public/media/japan/<name>.mp4 (+ raw/<name>.mp4, ungraded)
#   bash scripts/cut-japan-clips.sh preview   -> before|after stills in $PREVIEW_DIR (default ./grade-preview)
set -euo pipefail
cd "$(dirname "$0")/.."
FF="${FFMPEG:-ffmpeg}"
SRC=media-src/japan
OUT=public/media/japan
LEN=4 # seconds per cut: holds run up to 3.2 s, the rest is headroom for the speed ramp

# Shared look, nostalgic 16mm printed orange: soft contrast with lifted, warm-brown shadows (no blue
# anywhere), orange-amber highlights, organic skin, 85% colour, and the hazy softness of an old lens.
# Red halation, grain and light leaks are added live by the hero's shader.
LOOK="curves=r='0/0.07 0.25/0.26 0.5/0.56 0.8/0.87 1/0.98':g='0/0.05 0.25/0.21 0.5/0.48 0.8/0.77 1/0.9':b='0/0.03 0.25/0.15 0.5/0.38 0.8/0.62 1/0.74',eq=contrast=0.92:saturation=0.85,vignette=angle=PI/5,gblur=sigma=1.0"

# name | source id | in-point (s) | per-clip correction before the shared look
CLIPS=(
  "garden|px31679638|1.0|eq=gamma=0.92:contrast=1.08:saturation=0.9,colorbalance=rs=0.1:gs=-0.03:bs=-0.1:rm=0.06:bm=-0.06:rh=0.06:bh=-0.08" # calm: stone lantern in a misted Kyoto garden (Pexels 31679638)
  "market|4452|2.0|eq=brightness=-0.05:gamma=0.85:saturation=0.8,colorbalance=rs=0.04:bs=-0.05:rh=0.05:bh=-0.06" # busy: Asakusa market, crowd in long exposure
  "kimono|px31385028|0.0|eq=gamma=0.95:saturation=0.92,colorbalance=rs=0.04:bs=-0.05:rh=0.04:bh=-0.05" # calm: kimono under a lantern, looking down the lane, before she turns (Pexels 31385028)
  "shrine|4404|1.0|eq=brightness=-0.04:gamma=0.92:contrast=1.04:saturation=0.8,colorbalance=rs=0.06:bs=-0.08:rm=0.05:bm=-0.06:rh=0.06:bh=-0.1" # busy: Sensō-ji's gate, the crowd a long-exposure blur
  "gate|4405|2.0|eq=brightness=-0.03:gamma=0.94:contrast=1.03,colorbalance=rs=0.05:bs=-0.07:rm=0.04:bm=-0.05:rh=0.05:bh=-0.08" # calm: inside Sensō-ji's gate
  "pagoda|px18688462|4.0|eq=gamma=1.04:saturation=0.95"                                      # night: Sensō-ji's pagoda and the Skytree, vertical (camera tilts) (Pexels 18688462)
  "lantern|4109|13.6|eq=gamma=1.08:saturation=1.05"                                         # calm: a paper lantern held, mids lifted so it glows
  "building|px34977302|1.0|eq=gamma=1.35:brightness=0.03:saturation=0.45,colorbalance=rs=0.14:gs=-0.06:bs=-0.12:rm=0.12:gm=-0.04:bm=-0.12" # rain: a wet building at night, lit windows (Pexels 34977302)
  "redlight|2846|6.0|colorbalance=rs=0.22:gs=-0.04:bs=-0.22:rm=0.2:gm=-0.04:bm=-0.2:rh=0.1:bh=-0.14,eq=brightness=-0.1:gamma=0.85:saturation=1.1" # rain: a red light through rain on glass
)

if [[ "${1:-}" == preview ]]; then
  P="${PREVIEW_DIR:-grade-preview}"; mkdir -p "$P"; rows=()
  for c in "${CLIPS[@]}"; do
    IFS='|' read -r name id in fix <<<"$c"
    "$FF" -v error -y -ss "$(awk "BEGIN{print $in+1.2}")" -i "$SRC/$id-1080.mp4" -frames:v 1 \
      -filter_complex "scale=640:-2,split[a][b];[b]$fix,$LOOK[g];[a][g]hstack" "$P/$name.png"
    rows+=(-i "$P/$name.png")
  done
  "$FF" -v error -y "${rows[@]}" -filter_complex "vstack=inputs=${#CLIPS[@]}" "$P/all.png"
  echo "$P/all.png"; exit
fi

mkdir -p "$OUT"
for c in "${CLIPS[@]}"; do
  IFS='|' read -r name id in fix <<<"$c"
  # 24 fps to match the renderer's cap; keyframe every 12 frames so seeking to an in-point is cheap.
  "$FF" -v error -y -ss "$in" -t "$LEN" -i "$SRC/$id-1080.mp4" -an \
    -vf "fps=24,$fix,$LOOK,format=yuv420p" \
    -c:v libx264 -preset slow -crf 27 -profile:v high -g 12 -movflags +faststart "$OUT/$name.mp4"
  echo "$OUT/$name.mp4 $(du -k "$OUT/$name.mp4" | cut -f1) KB"
  # Ungraded twin for the Lab's Grade wipe: same frames, no look, 720p is plenty under a wipe.
  mkdir -p "$OUT/raw"
  "$FF" -v error -y -ss "$in" -t "$LEN" -i "$SRC/$id-1080.mp4" -an -vf "fps=24,scale=1280:-2,format=yuv420p"     -c:v libx264 -preset slow -crf 28 -g 12 -movflags +faststart "$OUT/raw/$name.mp4"
  # Posters: the Lab pages show these until a visitor interacts, so footage never weighs on first load.
  "$FF" -v error -y -ss 1 -i "$OUT/$name.mp4" -frames:v 1 -vf scale=800:-2 -q:v 7 "$OUT/$name.jpg"
  "$FF" -v error -y -ss 1 -i "$OUT/raw/$name.mp4" -frames:v 1 -vf scale=800:-2 -q:v 7 "$OUT/raw/$name.jpg"
done
