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
LEN=3 # seconds per cut: a shot is at most 2.4 s, the rest is headroom for the speed ramp

# Shared look: dense film blacks with a hint of lift, a firm S-curve, highlights that roll off just
# before clipping, warm highlights over neutral-cool shadows, colour kept rich (the site's warm
# night), slight lens softness. Per-clip corrections first balance each source so they cut together.
LOOK="curves=all='0/0.012 0.2/0.15 0.5/0.52 0.8/0.86 1/0.97',\
colorbalance=rs=-0.02:bs=0.03:rm=0.02:bm=-0.02:rh=0.06:gh=0.02:bh=-0.05,\
eq=contrast=1.08:saturation=1.0,vignette=angle=PI/5,gblur=sigma=0.5"

# name | source id | in-point (s) | per-clip correction before the shared look
CLIPS=(
  "street|4451|0.4|colorbalance=bm=0.03:gh=-0.02,eq=saturation=0.95:gamma=0.95"            # yellow signage tamed, night kept
  "neon|4447|1.0|eq=saturation=0.88:contrast=1.04"                                          # red neon held back from clipping
  "subway|4449|1.8|colorbalance=gs=-0.08:gm=-0.08:rm=0.04:rh=0.03,eq=contrast=1.1:gamma=0.98:saturation=0.9" # green fluorescent out, flat image given depth
  "lantern|4109|13.6|eq=gamma=1.08:saturation=1.05"                                         # lantern held, mids lifted so it glows
  "walker|4451|11.8|colorbalance=bm=0.03:gh=-0.02,eq=saturation=0.95:gamma=0.95"           # same street, same balance
  "crossing|4401|2.6|eq=brightness=-0.04:gamma=0.86:contrast=1.15:saturation=0.85,colorbalance=bs=0.06:gs=0.02:rh=0.05:bh=-0.04" # overcast day pushed to dusk
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
