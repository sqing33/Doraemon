#!/usr/bin/env python3
"""Create an Issue CSV under ./issues from the template."""

from __future__ import annotations

import argparse
from pathlib import Path

from plan_utils import (
    build_plan_filename,
    get_assets_dir,
    get_issues_dir,
    now_timestamp,
    slugify,
    validate_slug,
    validate_timestamp,
)


def parse_plan_filename(plan_path: Path) -> tuple[str, str]:
    name = plan_path.name
    if not name.endswith(".md"):
        raise ValueError("Plan filename must end with .md")
    base = name[: -len(".md")]
    if "-" not in base:
        raise ValueError("Plan filename must be '<timestamp>-<slug>.md'")
    timestamp, slug = base.split("-", 1)
    validate_timestamp(timestamp)
    validate_slug(slug)
    # validate round-trip format
    _ = build_plan_filename(timestamp, slug)
    return timestamp, slug


def main() -> int:
    parser = argparse.ArgumentParser(description="Create an Issue CSV under ./issues.")
    parser.add_argument("--title", help="Optional title for the first row (replaces REPLACE_ME_TITLE).")
    parser.add_argument("--slug", help="Slug override (lower-case, hyphen-delimited).")
    parser.add_argument("--timestamp", help="Timestamp override (YYYY-MM-DD_HH-mm-ss).")
    parser.add_argument(
        "--plan",
        help="Path to a plan markdown file (infers timestamp/slug from filename).",
    )
    parser.add_argument("--overwrite", action="store_true", help="Overwrite if the file exists.")
    args = parser.parse_args()

    if args.plan:
        plan_path = Path(args.plan).expanduser()
        if not plan_path.exists():
            raise SystemExit(f"Plan not found: {plan_path}")
        timestamp, slug = parse_plan_filename(plan_path)
    else:
        timestamp = args.timestamp.strip() if args.timestamp else now_timestamp()
        validate_timestamp(timestamp)

        if args.slug:
            slug = args.slug.strip()
            validate_slug(slug)
        else:
            seed = args.title.strip() if args.title else "issues"
            slug = slugify(seed)
            validate_slug(slug)

    issues_dir = get_issues_dir()
    issues_dir.mkdir(parents=True, exist_ok=True)
    issues_path = issues_dir / f"{timestamp}-{slug}.csv"

    if issues_path.exists() and not args.overwrite:
        raise SystemExit(f"Issue CSV already exists: {issues_path}. Use --overwrite to replace.")

    template_path = get_assets_dir() / "_template.csv"
    content = template_path.read_text(encoding="utf-8")
    if args.title:
        content = content.replace("REPLACE_ME_TITLE", args.title.strip())

    issues_path.write_text(content, encoding="utf-8")
    print(str(issues_path))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

