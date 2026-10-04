#!/usr/bin/env bash
out_dir="$1"
if [ -z $out_dir ]; then
  >&2 echo "Please supply an output location"
  exit 1
fi
if ! mkdir -p "$out_dir"; then
  >&2 echo "Output location \"$out_dir\" is either a file, or you don't have access to write to it.  Please try another location."
  exit 1
fi
out_dir="$( cd "$out_dir" &>/dev/null && pwd )"
echo OUT DIR: $out_dir

root_dir=${CI_PROJECT_DIR:-"$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." &>/dev/null && pwd )"}
pushd $root_dir/.gitlab/pages
  for file in ./*.md ./**/*.md; do
    if [[ "$file" =~ "*" ]]; then continue; fi
    file_out_dir="$out_dir/$(dirname $file)"
    mkdir -p "$file_out_dir"
    showdown makehtml -i $file -o "$file_out_dir/$(basename $file .md).html" --completeHTMLDocument
  done
popd