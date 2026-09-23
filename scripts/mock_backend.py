import json
from http.server import HTTPServer, BaseHTTPRequestHandler

class MockAPIHandler(BaseHTTPRequestHandler):
    def _set_headers(self, content_type="application/json"):
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers()

    def do_GET(self):
        self._set_headers()
        path = self.path

        if "monthly-count" in path:
            body = {"statusCode": 200, "data": {"quarterYear": {"total": 42, "completed": 38}}}
        elif "teacher-lesson-plan/list" in path:
            body = {"statusCode": 200, "data": [{"id": f"lp-{i}", "title": f"Lesson Plan {i}", "subject": "Science"} for i in range(10)]}
        elif "my-schedules" in path:
            body = {"statusCode": 200, "data": [{"id": f"sch-{i}", "period": i, "subject": "Math"} for i in range(6)]}
        elif "group-by-board" in path:
            body = {"statusCode": 200, "data": [{"boardId": "b1", "board": "State Board", "classes": [{"id": f"c{i}", "name": f"Class {i}"} for i in range(1, 11)]}]}
        elif "facility/list" in path:
            body = {"statusCode": 200, "data": [{"id": f"f{i}", "name": f"School {i}", "district": "Bangalore"} for i in range(15)]}
        elif "surveys" in path:
            body = {"statusCode": 200, "data": {"completed": True}}
        elif "profile" in path:
            body = {"statusCode": 200, "data": {"name": "Test Teacher", "phone": "9741773789", "school": "GHS Bangalore"}}
        elif "faq" in path:
            body = {"statusCode": 200, "data": [{"q": f"FAQ Question {i}", "a": f"Answer {i}"} for i in range(8)]}
        else:
            body = {"statusCode": 200, "data": {"success": True}}

        resp_bytes = json.dumps(body).encode("utf-8")
        self.wfile.write(resp_bytes)

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length > 0:
            self.rfile.read(content_length)
        self._set_headers()
        path = self.path

        if "get-otp" in path:
            body = {"statusCode": 200, "message": "OTP sent successfully", "data": {"otpTriggered": True, "resendAfterSeconds": 30}}
        elif "validate-otp" in path:
            body = {
                "statusCode": 200,
                "data": {
                    "token": "bearer-mock-token-xyz-12345",
                    "user": {
                        "_id": "668d07ee2d23c6b67dbb76f1",
                        "name": "Test Teacher",
                        "phone": "9741773789",
                        "roles": ["teacher", "admin"],
                        "preferredLanguage": "en"
                    },
                    "permissions": [
                        {"permission": p, "scopeType": "GLOBAL"} for p in [
                            "analytics.view", "home.view", "profile.view", "school.list",
                            "user.view", "role.view", "content.view", "question-paper.generate",
                            "chat.use", "schedule.view", "training.view", "content.activity.view",
                            "audit.view", "help.view"
                        ]
                    ]
                }
            }
        elif "events/token" in path:
            body = {"statusCode": 200, "data": {"token": "realtime-token-event-dispatch"}}
        else:
            body = {"statusCode": 200, "data": {"success": True}}

        resp_bytes = json.dumps(body).encode("utf-8")
        self.wfile.write(resp_bytes)

    def log_message(self, format, *args):
        pass

def run(port=8080):
    server_address = ("127.0.0.1", port)
    httpd = HTTPServer(server_address, MockAPIHandler)
    print(f"Mock Backend Server listening on http://127.0.0.1:{port}", flush=True)
    httpd.serve_forever()

if __name__ == "__main__":
    run()
