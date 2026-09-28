#!/usr/bin/env python3
"""
Seed script to index historical incidents into OpsMind Hindsight Memory Engine.
"""
import os
import sys
import json
import glob

# Ensure backend directory is in Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.hindsight.client import HindsightClient

def main():
    data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "incidents")
    files = glob.glob(os.path.join(data_dir, "*.json"))
    client = HindsightClient()

    print("Indexing incidents into Hindsight Memory Engine...")
    for f in sorted(files):
        with open(f, 'r') as fh:
            incident = json.load(fh)
            memory_id = client.add_incident_memory(incident)
            print(f"Indexed incident {incident.get('id')} -> Memory entry {memory_id}")

    print("Hindsight memory seeding complete!")

if __name__ == "__main__":
    main()
