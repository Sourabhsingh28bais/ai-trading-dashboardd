#!/usr/bin/env python3
"""
Auto-sync script for Trading Dashboard
Automatically commits and pushes changes to GitHub
"""

import subprocess
import time
import os
from datetime import datetime

def run_command(command):
    """Run a shell command and return the result"""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def check_git_changes():
    """Check if there are any changes to commit"""
    success, output, error = run_command("git status --porcelain")
    return success and output.strip() != ""

def auto_commit_and_push():
    """Automatically commit and push changes"""
    if not check_git_changes():
        print("✅ No changes detected")
        return True
    
    print("📝 Changes detected, committing...")
    
    # Add all changes
    success, output, error = run_command("git add .")
    if not success:
        print(f"❌ Failed to add changes: {error}")
        return False
    
    # Commit with timestamp
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    commit_message = f"Auto-sync: Update trading dashboard - {timestamp}"
    
    success, output, error = run_command(f'git commit -m "{commit_message}"')
    if not success:
        print(f"❌ Failed to commit: {error}")
        return False
    
    # Push to GitHub
    print("🚀 Pushing to GitHub...")
    success, output, error = run_command("git push origin main")
    if not success:
        print(f"❌ Failed to push: {error}")
        return False
    
    print("✅ Successfully synced to GitHub!")
    return True

def watch_and_sync(interval=30):
    """Watch for changes and auto-sync every interval seconds"""
    print(f"🔄 Auto-sync started - checking every {interval} seconds")
    print("📁 Watching directory:", os.getcwd())
    print("🔗 GitHub repository: https://github.com/Sourabhsingh28bais/ai-trading-dashboardd")
    print("⏹️  Press Ctrl+C to stop\n")
    
    try:
        while True:
            auto_commit_and_push()
            time.sleep(interval)
    except KeyboardInterrupt:
        print("\n⏹️  Auto-sync stopped")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        try:
            interval = int(sys.argv[1])
        except ValueError:
            print("❌ Invalid interval. Using default 30 seconds.")
            interval = 30
    else:
        interval = 30
    
    # Initial sync
    print("🚀 Starting Auto-Sync for Trading Dashboard")
    print("=" * 50)
    auto_commit_and_push()
    
    # Start watching
    watch_and_sync(interval)