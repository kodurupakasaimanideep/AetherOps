#!/usr/bin/env python3
"""
Seed script to verify or load incidents into OpsMind database / storage.
"""
import os
import json
import glob

def main():
    data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "incidents")
    files = glob.glob(os.path.join(data_dir, "*.json"))
    print(f"Found {len(files)} incident seed files:")
    for f in sorted(files):
        with open(f, 'r') as fh:
            data = json.load(fh)
            print(f" - [{data.get('id')}] {data.get('title')} ({data.get('severity')})")

if __name__ == "__main__":
    main()
