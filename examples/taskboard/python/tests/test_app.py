from fastapi.testclient import TestClient

from task_tools.app import create_app


def test_create_update_and_stale_write(tmp_path):
    url = "sqlite:///" + (tmp_path / "tasks.db").as_posix()
    with TestClient(create_app(url)) as client:
        assert client.post("/api/tasks", json={"title": "  "}).status_code == 422
        response = client.post("/api/tasks", json={"title": "Learn Python"})
        assert response.status_code == 201
        task = response.json()
        target = response.headers["location"]
        body = {"title": "Done", "done": True, "version": task["version"]}
        assert client.put(target, json=body).json()["version"] == 1
        assert client.put(target, json=body).status_code == 409
        assert client.get("/api/tasks/9999999").status_code == 404
