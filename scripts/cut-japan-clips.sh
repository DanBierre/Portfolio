#!/usr/bin/env bash
# Cuts the hero's Japan shots from the raw Mixkit 1080p clips (media-src/japan, not in git) and grades
# them into one night-film look that sits on the site's warm charcoal and gold. Only the base grade is
# baked here: halation, film burn, flash frames, motion blur and time warp are added live by the hero's
# WebGL renderer, so baking them too would double them.
#   bash scripts/cut-japan-clips.sh           -> public/media/japan/<name>.mp4
#   bash scripts/cut-japan-clips.sh preview   -> before|after stills in $PREVIEW_DIR (default ./grade-preview)
set -euo pipefail
cd "$(dirname "$0")/.."
FF="${FFMPEG:-ffmpeg}"
SRC=media-src/japan
OUT=public/media/japan
LEN=3 # seconds per cut: a shot is at most 2.4 s, the rest is headroom for the speed ramp

# Shared look: milky film blacks, rolled-off highlights, warm highlights over neutral-cool shadows,
# saturation pulled back so the neon reads as colour accents, not wallpaper, slight lens softness.
LOOK="curves=all='0/0.04 0.22/0.17 0.55/0.55 0.85/0.86 1/0.93',\
colorbalance=rs=-0.02:bs=0.03:rm=0.02:bm=-0.02:rh=0.05:gh=0.02:bh=-0.05,\
eq=contrast=1.06:saturation=0.8,vignette=angle=PI/6,gblur=sigma=0.7"

# name | source id | in-point (s) | per-clip correction before the shared look
CLIPS=(
  "street|4451|0.4|eq=saturation=0.85:gamma=0.95"                                           # passer-by wipes frame
  "neon|4447|1.0|eq=saturation=0.85"                                                        # sign cycles pink -> cyan
  "subway|4449|1.8|colorbalance=gs=-0.06:gm=-0.07:rm=0.03,eq=brightness=-0.02:gamma=0.95:saturation=0.75" # fluorescent green out
  "lantern|4109|12.0|eq=gamma=0.97"                                                         # passer-by wipes, lantern revealed
  "crossing|4401|2.6|eq=brightness=-0.03:gamma=0.9:saturation=0.68,colorbalance=bs=0.04:bm=0.02" # day pushed to dusk
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
done
