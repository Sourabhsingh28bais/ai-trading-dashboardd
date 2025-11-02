#!/usr/bin/env python3
"""
Real-time file watcher for automatic GitHub sync
Watches for file changes and immediately syncs to GitHub
"""

import os
import time
import subprocess
from datetime import datetime
from pathlib import Path

class FileWatcher:
    def __init__(self, watch_directory="."):
        self.watch_directory = Path(watch_directory)
        self.last_modified = {}
        self.ignore_patterns = {
            '.git', '__pycache__', 'node_modules', '.env', 
            'trading_dashboard.db', '.kiro', '.vscode'
        }
        
    def should_ignore(self, file_path):
        """Check if file should be ignored"""
        path_str = str(file_path)
        return any(pattern in path_str for pattern in self.ignore_patterns)
    
    def get_file_times(self):
        """Get modification times for all files"""
        file_times = {}
        for file_path in self.watch_directory.rglob('*'):
            if file_path.is_file() and not self.should_ignore(file_path):
                try:
                    file_times[str(file_path)] = file_path.stat().st_mtime
                except (OSError, PermissionError):
                    continue
        return file_times
    
    def run_git_command(self, command):
        """Run git command"""
        try:
            result = subprocess.run(command, shell=True, capture_output=True, text=True)
            return result.returncode == 0, result.stdout, result.stderr
        except Exception as e:
            return False, "", str(e)
    
    def sync_to_github(self, changed_files):
        """Sync changes to GitHub"""
        print(f"\n🔄 Files changed: {len(changed_files)}")
        for file in changed_files[:5]:  # Show first 5 files
            print(f"   📝 {file}")
        if len(changed_files) > 5:
            print(f"   ... and {len(changed_files) - 5} more files")
        
        # Add changes
        success, output, error = self.run_git_command("git add .")
        if not success:
            print(f"❌ Failed to add: {error}")
            return False
        
        # Commit
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        files_summary = f"{len(changed_files)} files"
        commit_message = f"Real-time sync: {files_summary} updated - {timestamp}"
        
        success, output, error = self.run_git_command(f'git commit -m "{commit_message}"')
        if not success:
            if "nothing to commit" in error:
                print("✅ No changes to commit")
                return True
            print(f"❌ Failed to commit: {error}")
            return False
        
        # Push
        print("🚀 Pushing to GitHub...")
        success, output, error = self.run_git_command("git push origin main")
        if not success:
            print(f"❌ Failed to push: {error}")
            return False
        
        print("✅ Successfully synced to GitHub!")
        return True
    
    def watch(self, check_interval=5):
        """Watch for file changes"""
        print("🔄 Real-time GitHub Sync Started")
        print("=" * 40)
        print(f"📁 Watching: {self.watch_directory.absolute()}")
        print(f"🔗 Repository: https://github.com/Sourabhsingh28bais/ai-trading-dashboardd")
        print(f"⏱️  Check interval: {check_interval} seconds")
        print("⏹️  Press Ctrl+C to stop\n")
        
        # Initial scan
        self.last_modified = self.get_file_times()
        print(f"📊 Monitoring {len(self.last_modified)} files")
        
        try:
            while True:
                current_times = self.get_file_times()
                changed_files = []
                
                # Check for changes
                for file_path, mod_time in current_times.items():
                    if (file_path not in self.last_modified or 
                        self.last_modified[file_path] != mod_time):
                        changed_files.append(file_path)
                
                # Check for deleted files
                for file_path in self.last_modified:
                    if file_path not in current_times:
                        changed_files.append(f"{file_path} (deleted)")
                
                if changed_files:
                    self.sync_to_github(changed_files)
                    self.last_modified = current_times
                
                time.sleep(check_interval)
                
        except KeyboardInterrupt:
            print("\n⏹️  Real-time sync stopped")

if __name__ == "__main__":
    import sys
    
    interval = 5  # Default 5 seconds
    if len(sys.argv) > 1:
        try:
            interval = int(sys.argv[1])
        except ValueError:
            print("❌ Invalid interval. Using default 5 seconds.")
    
    watcher = FileWatcher()
    watcher.watch(interval)