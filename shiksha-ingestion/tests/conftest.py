import sys
from pathlib import Path

# Add the parent directory to sys.path so connectors module can be imported
sys.path.insert(0, str(Path(__file__).parent.parent))
