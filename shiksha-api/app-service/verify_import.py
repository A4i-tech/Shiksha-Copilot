
import sys
import os
from pathlib import Path

# Add app directory to path
sys.path.insert(0, str(Path.cwd()))

def log(msg):
    with open("verify_output.txt", "a") as f:
        f.write(msg + "\n")
        f.flush()

log("Script started.")

try:
    log("Path inserted. Starting import...")
    from app.services.lesson_chat_service import LessonChatService
    log("Import successful!")
except Exception as e:
    log(f"Import failed: {e}")
except KeyboardInterrupt:
    log("Import hung and was interrupted")
