import sys
import os

# Ensure proper module resolution
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
from main import app

__all__ = ["app"]
