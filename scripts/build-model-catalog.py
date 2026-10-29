#!/usr/bin/env python3
"""Validate the public index and optionally rebuild verified, web-sized previews.

No network requests, model generation, Blender execution, or source publication.
Private source bundle: M300-001.json (README/manifest strings) + M300-001.png,
through M300-103. Keep this bundle OUTSIDE the public repository.
"""
import argparse
import hashlib
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / 'assets/models/index.json'
FIELDS = {'id', 'name', 'nameEn', 'category', 'categoryEn', 'tags', 'description', 'formats', 'notes', 'image'}
IDS = [f'M300-{number:03}' for number in range(1, 104)]


def verify(index):
    assert set(index) == {'version', 'updated', 'count', 'models'}, 'Unexpected index fields'
    assert index['version'] == 1 and index['count'] == len(IDS)
    assert [model['id'] for model in index['models']] == IDS, 'Missing, extra, duplicate, or unsorted IDs'
    for model in index['models']:
        assert set(model) == FIELDS, f"Unexpected fields: {model['id']}"
        assert all(model[key] for key in FIELDS), f"Empty metadata: {model['id']}"
        assert model['formats'] == ['BLEND', 'GLB', 'FBX']
        assert model['image'] == f"assets/models/previews/{model['id']}.webp"
    text = json.dumps(index, ensure_ascii=False)
    for blocked in ['https://', 'http://', 'token=', 'libfile_', 'qa.json', 'build_source.py', '/workspace/', 'AIcreate3dmodels']:
        assert blocked not in text, f'Non-display source data found: {blocked}'


def rebuild(bundle, index):
    for model in index['models']:
        asset_id = model['id']
        source = json.loads((bundle / f'{asset_id}.json').read_text())
        if 'manifest.json' in source:
            entries = json.loads(source['manifest.json'])['files']
            records = {item['path']: item['sha256'] for item in entries}
        else:
            records = dict((line.split(maxsplit=1)[1].lstrip('*'), line.split()[0])
                           for line in source['manifest.sha256'].splitlines() if line.strip())
        hero = 'previews/hero.png' if 'previews/hero.png' in records else next(
            name for name in records if name.startswith('previews/') and name.endswith('_hero.png'))
        data = (bundle / f'{asset_id}.png').read_bytes()
        assert hashlib.sha256(data).hexdigest() == records[hero], f'{asset_id}: source hash mismatch'
        for extension in ['.blend', '.glb', '.fbx']:
            assert any(name.lower().endswith(extension) for name in records), f'{asset_id}: absent format {extension}'
        image = Image.open(bundle / f'{asset_id}.png').convert('RGB')
        image.thumbnail((640, 640), Image.Resampling.LANCZOS)
        target = ROOT / model['image']
        target.parent.mkdir(parents=True, exist_ok=True)
        image.save(target, 'WEBP', quality=82, method=6)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, help='Private normalized source bundle; never committed')
    args = parser.parse_args()
    index = json.loads(INDEX.read_text())
    verify(index)
    if args.source:
        assert not args.source.resolve().is_relative_to(ROOT), 'Keep private source outside this repository'
        rebuild(args.source, index)
    for model in index['models']:
        with Image.open(ROOT / model['image']) as image:
            assert image.format == 'WEBP' and max(image.size) <= 640
            image.verify()
    expected = {f'{asset_id}.webp' for asset_id in IDS}
    assert {path.name for path in (ROOT / 'assets/models/previews').iterdir()} == expected
    print(f'PASS: {len(IDS)} unique completed models, metadata allowlist, and all WebP previews')


if __name__ == '__main__':
    main()
