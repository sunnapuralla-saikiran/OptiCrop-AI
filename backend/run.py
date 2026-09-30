"""
OptiCropAI 2.0 - Server Entry Point
"""
import os
import sys

# Ensure backend root is on Python sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app import create_app
from backend.app.config import Config

app = create_app(Config)

if __name__ == "__main__":
    print(f"Starting {Config.PROJECT_NAME} v{Config.VERSION} server...")
    print(f"Server available at: http://127.0.0.1:{Config.PORT}")
    print(f"API endpoints available at: http://127.0.0.1:{Config.PORT}/api")
    # use_reloader=False prevents OneDrive file system indexing from causing unwanted restarts
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG, use_reloader=False)

