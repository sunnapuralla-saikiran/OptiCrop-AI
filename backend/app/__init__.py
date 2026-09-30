"""
OptiCropAI 2.0 - Application Factory
Serves API endpoints under /api/* and single-page React frontend from frontend/dist.
"""
import os
from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS

from .config import Config
from .database.database import init_db
from .gateway import init_default_tools

from .routes.health import health_bp
from .routes.recommendation import recommendation_bp
from .routes.history import history_bp
from .routes.reports import reports_bp
from .routes.tools import tools_bp

def create_app(config_class=Config):
    dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))

    app = Flask(
        __name__,
        static_folder=dist_dir if os.path.exists(dist_dir) else None,
        static_url_path="/"
    )
    app.config.from_object(config_class)

    # Enable CORS for modern frontends
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Initialize SQLite Database & Tables
    init_db()

    # Initialize Tool Gateway Default Tools
    init_default_tools()

    # Register API Blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(recommendation_bp)
    app.register_blueprint(history_bp)
    app.register_blueprint(reports_bp)
    app.register_blueprint(tools_bp)

    # Single Page Application (SPA) static file serving for React frontend
    if os.path.exists(dist_dir):
        @app.route("/", defaults={"path": ""})
        @app.route("/<path:path>")
        def serve_frontend(path):
            if path.startswith("api/"):
                return jsonify({"error": "Resource Not Found", "message": f"API endpoint '/{path}' does not exist."}), 404

            target_file = os.path.join(dist_dir, path)
            if path != "" and os.path.exists(target_file):
                return send_from_directory(dist_dir, path)
            else:
                return send_from_directory(dist_dir, "index.html")

    # API JSON Error Handlers (applied to /api/* requests)
    @app.errorhandler(404)
    def not_found(e):
        if request.path.startswith("/api"):
            return jsonify({"error": "Resource Not Found", "message": "The requested API endpoint does not exist."}), 404
        if os.path.exists(dist_dir):
            return send_from_directory(dist_dir, "index.html")
        return jsonify({"error": "Resource Not Found", "message": "Frontend build not found and API endpoint does not exist."}), 404

    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"error": "Bad Request", "message": str(e)}), 400

    @app.errorhandler(422)
    def unprocessable(e):
        return jsonify({"error": "Unprocessable Entity", "message": str(e)}), 422

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"error": "Internal Server Error", "message": "An unexpected error occurred on the server."}), 500

    return app
