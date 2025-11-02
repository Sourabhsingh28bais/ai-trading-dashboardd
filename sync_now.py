#!/usr/bin/env python3
"""
Quick sync script - Run this to immediately sync changes to GitHub
"""

import subprocess
from datetime import datetime

def run_command(command):
    """Run a shell command and return the result"""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def quick_sync():
    """Quickly commit and push all changes"""
    print("🚀 Quick Sync to GitHub")
    print("=" * 30)
    
    # Check for changes
    success, output, error = run_command("git status --porcelain")
    if not success or output.strip() == "":
        print("✅ No changes to sync")
        return
    
    print("📝 Changes found:")
    print(output)
    
    # Add all changes
    print("📦 Adding changes...")
    success, output, error = run_command("git add .")
    if not success:
        print(f"❌ Failed to add: {error}")
        return
    
    # Commit
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    commit_message = f"Quick sync: Trading dashboard updates - {timestamp}"
    
    print("💾 Committing...")
    success, output, error = run_command(f'git commit -m "{commit_message}"')
    if not success:
        print(f"❌ Failed to commit: {error}")
        return
    
    # Push
    print("🚀 Pushing to GitHub...")
    success, output, error = run_command("git push origin main")
    if not success:
        print(f"❌ Failed to push: {error}")
        return
    
    print("✅ Successfully synced to GitHub!")
    print("🔗 View at: https://github.com/Sourabhsingh28bais/ai-trading-dashboardd")

if __name__ == "__main__":
    quick_sync()